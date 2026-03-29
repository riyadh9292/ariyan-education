import { NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import { connectDB, getNoticesBucket } from "@/lib/mongodb"

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params
    console.log("calling this one");
    
    const { db } = await connectDB()
    const bucket = await getNoticesBucket()

    const noticeId = new ObjectId(id)

    // Find notice
    const notice = await db.collection("notices").findOne({ _id: noticeId })

    if (!notice) {
      return NextResponse.json({ error: "Notice not found" }, { status: 404 })
    }

    // Delete file from GridFS
    if (notice.fileId) {
      await bucket.delete(new ObjectId(notice.fileId))
    }

    // Delete notice document
    await db.collection("notices").deleteOne({ _id: noticeId })

    return NextResponse.json({
      success: true,
      message: "Notice deleted successfully",
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Delete failed" }, { status: 500 })
  }
}