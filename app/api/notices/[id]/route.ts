import { NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import { connectDB, getNoticesBucket } from "@/lib/mongodb"

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params

    const { db } = await connectDB()
    const bucket = await getNoticesBucket()

    const noticeId = new ObjectId(id)

    const notice = await db.collection("notices").findOne({ _id: noticeId })

    if (!notice) {
      return NextResponse.json({ error: "Notice not found" }, { status: 404 })
    }

    // delete file from GridFS
    if (notice.fileId) {
      await bucket.delete(new ObjectId(notice.fileId))
    }

    // delete notice document
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