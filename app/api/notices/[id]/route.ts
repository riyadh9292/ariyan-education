import { NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import { connectDB, getNoticesBucket } from "@/lib/mongodb"

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    const isMeta = req.nextUrl.searchParams.get("meta") === "1"
 
    const { db } = await connectDB()
 
    // Support lookup by either _id or fileId
    let notice = null
    if (ObjectId.isValid(id)) {
      notice =
        (await db.collection("notices").findOne({ fileId: new ObjectId(id) })) ||
        (await db.collection("notices").findOne({ _id:    new ObjectId(id) }))
    }
 
    if (!notice) {
      return NextResponse.json({ error: "Notice not found" }, { status: 404 })
    }
 
    // ── Metadata only ──────────────────────────────────────────────
    if (isMeta) {
      return NextResponse.json({
        title : notice.title      ?? "নোটিশ",
        date  : notice.date       ?? notice.uploadedAt ?? null,
        fileId: notice.fileId?.toString() ?? id,
      })
    }
 
    // ── Stream PDF from GridFS ─────────────────────────────────────
    const bucket = await getNoticesBucket()
    const fileId = notice.fileId ?? notice._id
    const chunks: Buffer[] = []
 
    await new Promise<void>((resolve, reject) => {
      const stream = bucket.openDownloadStream(new ObjectId(fileId.toString()))
      stream.on("data",  (chunk) => chunks.push(chunk))
      stream.on("end",   resolve)
      stream.on("error", reject)
    })
 
    const buffer = Buffer.concat(chunks)
 
    return new NextResponse(buffer, {
      headers: {
        "Content-Type"       : "application/pdf",
        "Content-Disposition": `inline; filename="${notice.title ?? "notice"}.pdf"`,
        "Content-Length"     : buffer.length.toString(),
        "Cache-Control"      : "private, max-age=3600",
      },
    })
  } catch (err) {
    console.error("Notices GET error:", err)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

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
      try {
        await bucket.delete(new ObjectId(notice.fileId))
      } catch (fileErr) {
        // File may already be missing from GridFS — log and continue
        console.warn(`GridFS file not found for notice ${id}, skipping file deletion:`, fileErr)
      }
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