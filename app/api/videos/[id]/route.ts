/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { GridFSBucket, ObjectId } from "mongodb"
 
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
 
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 })
    }
 
    const { db } = await connectDB()
    const bucket = new GridFSBucket(db, { bucketName: "gallery_videos" })
 
    const files = await bucket.find({ _id: new ObjectId(id) }).toArray()
    if (!files.length) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }
 
    const file = files[0]
    const chunks: Buffer[] = []
 
    await new Promise<void>((resolve, reject) => {
      const stream = bucket.openDownloadStream(new ObjectId(id))
      stream.on("data", (chunk) => chunks.push(chunk))
      stream.on("end",   resolve)
      stream.on("error", reject)
    })
 
    const buffer = Buffer.concat(chunks)
 
    // GridFS stores contentType directly on the file document, not in metadata
    const contentType = (file as any)?.contentType ?? "video/mp4"
 
    return new NextResponse(buffer, {
      headers: {
        "Content-Type"  : contentType,
        "Content-Length": buffer.length.toString(),
        "Accept-Ranges" : "bytes",
        "Cache-Control" : "private, max-age=3600",
      },
    })
  } catch (err) {
    console.error("Video stream error:", err)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
 