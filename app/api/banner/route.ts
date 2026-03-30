import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"

const COLLECTION = "banner_images"

export async function GET() {
  try {
    const { db } = await connectDB()
    const images = await db.collection(COLLECTION).find({}).sort({ createdAt: -1 }).toArray()
    return NextResponse.json(
      images.map(img => ({
        id       : img._id.toString(),
        url      : img.url,
        deleteUrl: img.deleteUrl,
        caption  : img.caption ?? "",
        createdAt: img.createdAt,
      }))
    )
  } catch (err) {
    console.error("Banner fetch error:", err)
    return NextResponse.json([], { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  console.log("calling this route");
  
  try {
    const formData  = await req.formData()
    const file      = formData.get("file") as File | null
    const caption   = (formData.get("caption") as string)?.trim() ?? ""
    const IMGBB_KEY = process.env.IMGBB_API_KEY

    if (!file)      return NextResponse.json({ error: "No file provided." }, { status: 400 })
    if (!IMGBB_KEY) return NextResponse.json({ error: "IMGBB_API_KEY not set." }, { status: 500 })

    const base64  = Buffer.from(await file.arrayBuffer()).toString("base64")
    const imgbbFd = new FormData()
    imgbbFd.append("key",   IMGBB_KEY)
    imgbbFd.append("image", base64)
    if (caption) imgbbFd.append("name", caption)

    const imgbbRes  = await fetch("https://api.imgbb.com/1/upload", { method: "POST", body: imgbbFd })
    const imgbbData = await imgbbRes.json()
    console.log(imgbbData,"imgbbData");

    if (!imgbbData.success) {
      return NextResponse.json({ error: "ImgBB upload failed.", detail: imgbbData }, { status: 500 })
    }
    console.log(imgbbData,"imgbbData");
    

    const { db } = await connectDB()
    const result  = await db.collection(COLLECTION).insertOne({
      url      : imgbbData.data.url        as string,
      deleteUrl: imgbbData.data.delete_url as string,
      caption,
      createdAt: new Date(),
    })

    return NextResponse.json({ success: true, id: result.insertedId.toString(), url: imgbbData.data.url })
  } catch (err) {
    console.error("Banner upload error:", err)
    return NextResponse.json({ error: "Upload failed." }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id }   = await req.json()
    const { db }   = await connectDB()
    const { ObjectId } = await import("mongodb")
    await db.collection(COLLECTION).deleteOne({ _id: new ObjectId(id) })
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("Banner delete error:", err)
    return NextResponse.json({ error: "Delete failed." }, { status: 500 })
  }
}