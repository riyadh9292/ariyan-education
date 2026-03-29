import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.IMGBB_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: "IMGBB_API_KEY is not configured" }, { status: 500 })
    }

    const formData = await req.formData()
    const file = formData.get("image") as File | null

    if (!file) {
      return NextResponse.json({ error: "No image file provided" }, { status: 400 })
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer()
    const base64 = Buffer.from(bytes).toString("base64")

    // Upload to ImageBB
    const body = new URLSearchParams()
    body.append("key", apiKey)
    body.append("image", base64)
    body.append("name", file.name.split(".")[0]) // optional: filename without extension

    const res = await fetch("https://api.imgbb.com/1/upload", {
      method: "POST",
      body,
    })

    if (!res.ok) {
      const err = await res.text()
      console.error("ImageBB error:", err)
      return NextResponse.json({ error: "ImageBB upload failed" }, { status: 502 })
    }

    const data = await res.json()

    if (!data.success) {
      return NextResponse.json({ error: "ImageBB returned failure" }, { status: 502 })
    }

    return NextResponse.json({
      url: data.data.url,           // direct image URL
      display_url: data.data.display_url,
      delete_url: data.data.delete_url,
    })
  } catch (err) {
    console.error("Upload error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}