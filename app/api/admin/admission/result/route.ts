import { NextRequest, NextResponse } from "next/server"
import { connectDB, getGridFSBucket } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function GET() {
  try {
    const { db } = await connectDB()
    const records = await db
      .collection("admission_result")
      .find({})
      .sort({ uploadedAt: -1 })
      .toArray()

    return NextResponse.json(
      records.map(r => ({
        _id         : r._id.toString(),
        fileId      : r.fileId.toString(),
        examName    : r.examName,
        originalName: r.originalName,
        uploadedAt  : r.uploadedAt,
      }))
    )
  } catch (err) {
    console.error("Questions GET error:", err)
    return NextResponse.json([], { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file     = formData.get("file")     as File   | null
    const examName = (formData.get("examName")as string)?.trim()

    if (!file || file.type !== "application/pdf") {
      return NextResponse.json({ error: "PDF ফাইল আবশ্যক।" }, { status: 400 })
    }
    if (!examName) {
      return NextResponse.json({ error: "পরীক্ষার নাম আবশ্যক।" }, { status: 400 })
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
    await db.collection("admission_result").insertOne({
      fileId,
      examName,
      originalName: file.name,
      uploadedAt  : new Date(),
    })

    return NextResponse.json({ success: true, message: "ফলাফল আপলোড সম্পন্ন হয়েছে ✓" })
  } catch (err) {
    console.error("Results POST error:", err)
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
    const record = await db
      .collection("admission_result")
      .findOne({ fileId: new ObjectId(id) })
    if (!record) return NextResponse.json({ error: "পাওয়া যায়নি।" }, { status: 404 })

    const bucket = await getGridFSBucket()
    try { await bucket.delete(new ObjectId(id)) } catch { /* already gone */ }

    await db.collection("admission_result").deleteOne({ fileId: new ObjectId(id) })
    return NextResponse.json({ success: true, message: "ফলাফল মুছে ফেলা হয়েছে।" })
  } catch (err) {
    console.error("Results DELETE error:", err)
    return NextResponse.json({ error: "মুছতে ব্যর্থ হয়েছে।" }, { status: 500 })
  }
}