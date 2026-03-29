/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { GridFSBucket, ObjectId } from "mongodb"

async function getVideosBucket() {
  const { db } = await connectDB()
  return new GridFSBucket(db, { bucketName: "gallery_videos" })
}

// GET — return all video metadata
export async function GET() {
  try {
    const { db } = await connectDB()
    const doc = await db.collection("site_pages").findOne({ key: "academic-videos" })
    const videos = Array.isArray(doc?.value?.videos) ? doc.value.videos : []
    return NextResponse.json(videos)
  } catch (err) {
    console.error("Videos GET error:", err)
    return NextResponse.json([], { status: 500 })
  }
}

// POST — upload video to GridFS, save metadata in site_pages
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get("video") as File | null
    const caption = (formData.get("caption") as string) ?? ""

    if (!file) return NextResponse.json({ error: "No video provided" }, { status: 400 })
    if (!file.type.startsWith("video/")) {
      return NextResponse.json({ error: "Only video files are allowed" }, { status: 400 })
    }

    const bucket = await getVideosBucket()
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Upload to GridFS
    const fileId = new ObjectId()
    const uploadStream = bucket.openUploadStreamWithId(fileId, file.name, {
      metadata: { contentType: file.type },
    })

    await new Promise<void>((resolve, reject) => {
      uploadStream.on("finish", resolve)
      uploadStream.on("error", reject)
      uploadStream.write(buffer)
      uploadStream.end()
    })

    const newVideo = {
      id: fileId.toString(),
      gridfsId: fileId.toString(),
      filename: file.name,
      caption,
      mimeType: file.type,
      size: buffer.length,
      uploadedAt: new Date().toISOString(),
    }

    const { db } = await connectDB()
    await db.collection("site_pages").updateOne(
      { key: "academic-videos" },
      {
        $push: { "value.videos": newVideo } as any,
        $setOnInsert: { key: "academic-videos", "value.title": "ভিডিও", "value.content": "" },
      },
      { upsert: true }
    )

    return NextResponse.json({ message: "ভিডিও আপলোড সম্পন্ন হয়েছে", video: newVideo })
  } catch (err) {
    console.error("Videos POST error:", err)
    return NextResponse.json({ error: "আপলোড ব্যর্থ হয়েছে" }, { status: 500 })
  }
}

// DELETE — remove from GridFS and metadata
export async function DELETE(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get("id")
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 })

    // Delete from GridFS
    const bucket = await getVideosBucket()
    try {
      await bucket.delete(new ObjectId(id))
    } catch {
      // File may already be gone, continue to clean metadata
    }

    const { db } = await connectDB()
    await db.collection("site_pages").updateOne(
      { key: "academic-videos" },
      { $pull: { "value.videos": { id } } } as any
    )

    return NextResponse.json({ message: "ভিডিও মুছে ফেলা হয়েছে" })
  } catch (err) {
    console.error("Videos DELETE error:", err)
    return NextResponse.json({ error: "মুছতে ব্যর্থ হয়েছে" }, { status: 500 })
  }
}