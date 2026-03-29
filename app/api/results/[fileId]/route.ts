import { NextRequest, NextResponse } from "next/server"
import { getGridFSBucket } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function GET(
  _req: NextRequest,
  { params }: { params: { fileId: string } }
) {
    
  try {
    const { fileId } = await params
    const bucket = await getGridFSBucket()
    const objectId = new ObjectId(fileId)

    const files = await bucket.find({ _id: objectId }).toArray()
    if (files.length === 0) {
      return NextResponse.json({ error: "File not found." }, { status: 404 })
    }

    const downloadStream = bucket.openDownloadStream(objectId)
    const chunks: Buffer[] = []

    await new Promise<void>((resolve, reject) => {
      downloadStream.on("data",  chunk => chunks.push(chunk))
      downloadStream.on("end",   resolve)
      downloadStream.on("error", reject)
    })

    const fileBuffer = Buffer.concat(chunks)

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type"       : "application/pdf",
        "Content-Disposition": `inline; filename="${files[0].filename}"`,
        "Content-Length"     : fileBuffer.length.toString(),
      },
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Stream failed." }, { status: 500 })
  }
}