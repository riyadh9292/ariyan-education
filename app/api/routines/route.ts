import { NextRequest, NextResponse } from "next/server"
import { connectDB, getGridFSBucket } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function GET() {
  try {
    const { db } = await connectDB()
    const records = await db
      .collection("routines")
      .find({})
      .sort({ uploadedAt: -1 })
      .toArray()

    return NextResponse.json(
      records.map(r => ({
        _id         : r._id.toString(),
        fileId      : r.fileId.toString(),
        academicYear: r.academicYear,
        originalName: r.originalName,
        uploadedAt  : r.uploadedAt,
      }))
    )
  } catch (err) {
    console.error("Routines GET error:", err)
    return NextResponse.json([], { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData    = await req.formData()
    const file        = formData.get("file")         as File   | null
    const academicYear= (formData.get("academicYear")as string)?.trim()

    if (!file || file.type !== "application/pdf") {
      return NextResponse.json({ error: "PDF ফাইল আবশ্যক।" }, { status: 400 })
    }
    if (!academicYear) {
      return NextResponse.json({ error: "সাল আবশ্যক।" }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const bucket = await getGridFSBucket()
    const fileId = new ObjectId()

    const uploadStream = bucket.openUploadStreamWithId(fileId, file.name, {
      metadata: { contentType: "application/pdf" },
    })

    await new Promise<void>((resolve, reject) => {
      uploadStream.on("finish", resolve)
      uploadStream.on("error",  reject)
      uploadStream.write(buffer)
      uploadStream.end()
    })

    const { db } = await connectDB()
    await db.collection("routines").insertOne({
      fileId,
      academicYear,
      originalName: file.name,
      uploadedAt  : new Date(),
    })

    return NextResponse.json({ success: true, message: "রুটিন আপলোড সম্পন্ন হয়েছে ✓" })
  } catch (err) {
    console.error("Routines POST error:", err)
    return NextResponse.json({ error: "আপলোড ব্যর্থ হয়েছে।" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json()
    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 })
    }

    const { db } = await connectDB()
    const record = await db.collection("routines").findOne({ fileId: new ObjectId(id) })
    if (!record) return NextResponse.json({ error: "পাওয়া যায়নি।" }, { status: 404 })

    const bucket = await getGridFSBucket()
    try { await bucket.delete(new ObjectId(id)) } catch { /* already gone */ }

    await db.collection("routines").deleteOne({ fileId: new ObjectId(id) })
    return NextResponse.json({ success: true, message: "রুটিন মুছে ফেলা হয়েছে।" })
  } catch (err) {
    console.error("Routines DELETE error:", err)
    return NextResponse.json({ error: "মুছতে ব্যর্থ হয়েছে।" }, { status: 500 })
  }
}