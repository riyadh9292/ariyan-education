import { NextRequest, NextResponse } from "next/server"
import { getGridFSBucket } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ fileId: string }> }
) {
  try {
    const { fileId } = await params

    if (!ObjectId.isValid(fileId)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 })
    }

    const bucket   = await getGridFSBucket()
    const objectId = new ObjectId(fileId)

    const files = await bucket.find({ _id: objectId }).toArray()
    if (!files.length) {
      return NextResponse.json({ error: "File not found." }, { status: 404 })
    }

    const chunks: Buffer[] = []

    await new Promise<void>((resolve, reject) => {
      const stream = bucket.openDownloadStream(objectId)
      stream.on("data",  chunk => chunks.push(chunk))
      stream.on("end",   resolve)
      stream.on("error", reject)
    })

    const buffer = Buffer.concat(chunks)

    return new NextResponse(buffer, {
      headers: {
        "Content-Type"       : "application/pdf",
        "Content-Disposition": `inline; filename="question.pdf"; filename*=UTF-8''${encodeURIComponent(files[0].filename)}`,
        "Content-Length"     : buffer.length.toString(),
        "Cache-Control"      : "private, max-age=3600",
      },
    })
  } catch (err) {
    console.error("admission result stream error:", err)
    return NextResponse.json({ error: "Stream failed." }, { status: 500 })
  }
}