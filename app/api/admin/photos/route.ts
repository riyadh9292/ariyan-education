/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"

// GET — return all photos
export async function GET() {
  try {
    const { db } = await connectDB()
    const doc = await db.collection("site_pages").findOne({ key: "academic-photos" })
    const photos = Array.isArray(doc?.value?.photos) ? doc.value.photos : []
    return NextResponse.json(photos)
  } catch (err) {
    console.error("Photos GET error:", err)
    return NextResponse.json([], { status: 500 })
  }
}

// POST — upload to ImageBB, save URL in MongoDB
export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.IMGBB_API_KEY
    if (!apiKey) return NextResponse.json({ error: "IMGBB_API_KEY not configured" }, { status: 500 })

    const formData = await req.formData()
    const file = formData.get("image") as File | null
    const caption = (formData.get("caption") as string) ?? ""

    if (!file) return NextResponse.json({ error: "No image provided" }, { status: 400 })

    // Upload to ImageBB
    const bytes = await file.arrayBuffer()
    const base64 = Buffer.from(bytes).toString("base64")
    const body = new URLSearchParams()
    body.append("key", apiKey)
    body.append("image", base64)

    const imgRes = await fetch("https://api.imgbb.com/1/upload", { method: "POST", body })
    const imgData = await imgRes.json()
    if (!imgData.success) throw new Error("ImageBB upload failed")

    const newPhoto = {
      id: Date.now().toString(),
      url: imgData.data.url,
      caption,
      uploadedAt: new Date().toISOString(),
    }

    const { db } = await connectDB()
    await db.collection("site_pages").updateOne(
      { key: "academic-photos" },
      {
        $push: { "value.photos": newPhoto } as any,
        $setOnInsert: { key: "academic-photos", "value.title": "ছবি", "value.content": "" },
      },
      { upsert: true }
    )

    return NextResponse.json({ message: "ছবি আপলোড সম্পন্ন হয়েছে", photo: newPhoto })
  } catch (err) {
    console.error("Photos POST error:", err)
    return NextResponse.json({ error: "আপলোড ব্যর্থ হয়েছে" }, { status: 500 })
  }
}

// DELETE — remove by id
export async function DELETE(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get("id")
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 })

    const { db } = await connectDB()
    await db.collection("site_pages").updateOne(
      { key: "academic-photos" },
      { $pull: { "value.photos": { id } } } as any
    )

    return NextResponse.json({ message: "ছবি মুছে ফেলা হয়েছে" })
  } catch (err) {
    console.error("Photos DELETE error:", err)
    return NextResponse.json({ error: "মুছতে ব্যর্থ হয়েছে" }, { status: 500 })
  }
}