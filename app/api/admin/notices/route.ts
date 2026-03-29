import { NextResponse } from "next/server"
import { connectDB, getNoticesBucket } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function POST(req: Request) {
  try {
    const formData = await req.formData()

    const title = formData.get("title") as string
    const file = formData.get("file") as File

    const bucket = await getNoticesBucket()
    const { db } = await connectDB()

    const buffer = Buffer.from(await file.arrayBuffer())

    const uploadStream = bucket.openUploadStream(file.name)

    uploadStream.end(buffer)

    const fileId = uploadStream.id

    const notice = await db.collection("notices").insertOne({
      title,
      fileId,
      createdAt: new Date(),
    })

    return NextResponse.json({
      success: true,
      noticeId: notice.insertedId,
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}

export async function GET() {
  const { db } = await connectDB()

  const notices = await db
    .collection("notices")
    .find({})
    .sort({ createdAt: -1 })
    .toArray()

  return NextResponse.json(notices)
}