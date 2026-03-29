import { NextRequest, NextResponse } from "next/server"
import { connectDB, getGridFSBucket } from "@/lib/mongodb"
import { Readable } from "stream"
import { ObjectId } from "mongodb"

// POST — upload a PDF
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file      = formData.get("file") as File | null
    const examName  = formData.get("examName") as string
    const examYear  = formData.get("examYear") as string
    const examClass = formData.get("examClass") as string

    if (!file || file.type !== "application/pdf") {
      return NextResponse.json({ error: "Please upload a valid PDF." }, { status: 400 })
    }

    const { db } = await connectDB()
    const bucket  = await getGridFSBucket()

    const arrayBuffer = await file.arrayBuffer()
    const buffer      = Buffer.from(arrayBuffer)
    const readable    = Readable.from(buffer)

    const filename = `${examYear}_${examClass}_${examName}_${Date.now()}.pdf`
      .replace(/\s+/g, "_")

    const uploadStream = bucket.openUploadStream(filename, {
      metadata: { examName, examYear, examClass, originalName: file.name },
    })

    await new Promise<void>((resolve, reject) => {
      readable.pipe(uploadStream)
      uploadStream.on("finish", resolve)
      uploadStream.on("error", reject)
    })

    await db.collection("result_records").insertOne({
      fileId      : uploadStream.id,
      filename,
      examName,
      examYear,
      examClass,
      originalName: file.name,
      uploadedAt  : new Date(),
    })

    return NextResponse.json({ success: true, fileId: uploadStream.id.toString() })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Upload failed." }, { status: 500 })
  }
}

// GET — list all results
export async function GET() {
  try {
    const { db } = await connectDB()
    const records = await db
      .collection("result_records")
      .find({})
      .sort({ uploadedAt: -1 })
      .toArray()

    return NextResponse.json(
      records.map(r => ({
        ...r,
        _id   : r._id.toString(),
        fileId: r.fileId.toString(),
      }))
    )
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Fetch failed." }, { status: 500 })
  }
}

// DELETE — remove file + record
export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json()
    const { db } = await connectDB()
    const bucket  = await getGridFSBucket()

    await bucket.delete(new ObjectId(id))
    await db.collection("result_records").deleteOne({ fileId: new ObjectId(id) })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Delete failed." }, { status: 500 })
  }
}