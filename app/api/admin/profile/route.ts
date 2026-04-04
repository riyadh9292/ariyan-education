import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"

// GET /api/admin/profile?type=founder  OR  ?type=principal
export async function GET(req: NextRequest) {
  const type = req.nextUrl.searchParams.get("type")
  if (!type) return NextResponse.json({ error: "type required" }, { status: 400 })

  try {
    const { db } = await connectDB()
    const doc = await db.collection("site_profiles").findOne({ type })
    if (!doc) return NextResponse.json({ name: "", photo: "", description: "" })
    return NextResponse.json({
      name:        doc.name        ?? "",
      photo:       doc.photo       ?? "",
      description: doc.description ?? "",
      bani:        doc.bani        ?? "",  
    })
  } catch (err) {
    console.error("Profile GET error:", err)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

// POST /api/admin/profile
// body: FormData — type, name, description, photo? (file, uploaded to ImageBB)
export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.IMGBB_API_KEY

    const formData    = await req.formData()
    const type        = (formData.get("type")        as string)?.trim()
    const name        = (formData.get("name")        as string)?.trim()
    const description = (formData.get("description") as string)?.trim()
    const bani        = (formData.get("bani")        as string)?.trim()
    const file        = formData.get("photo") as File | null

    if (!type || !name) {
      return NextResponse.json({ error: "type ও name আবশ্যক" }, { status: 400 })
    }

    let photoUrl: string | undefined

    // Upload new photo if provided
    if (file && file.size > 0) {
      if (!apiKey) return NextResponse.json({ error: "IMGBB_API_KEY not set" }, { status: 500 })

      const base64 = Buffer.from(await file.arrayBuffer()).toString("base64")
      const body   = new URLSearchParams()
      body.append("key",   apiKey)
      body.append("image", base64)

      const imgRes  = await fetch("https://api.imgbb.com/1/upload", { method: "POST", body })
      const imgData = await imgRes.json()
      if (!imgData.success) throw new Error("ImageBB upload failed")
      photoUrl = imgData.data.url as string
    }

    const { db } = await connectDB()

    const $set: Record<string, string | Date> = {
      type,
      name,
      description: description ?? "",
      bani:        bani        ?? "",
      updatedAt:   new Date(),
    }
    if (photoUrl) $set.photo = photoUrl

    await db.collection("site_profiles").updateOne(
      { type },
      { $set },
      { upsert: true }
    )

    return NextResponse.json({ message: "সফলভাবে সংরক্ষিত হয়েছে ✓" })
  } catch (err) {
    console.error("Profile POST error:", err)
    return NextResponse.json({ error: "সংরক্ষণ ব্যর্থ হয়েছে" }, { status: 500 })
  }
}