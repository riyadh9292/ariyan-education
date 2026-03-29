import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"

export async function GET() {
  try {
    const { db } = await connectDB()
    const doc = await db.collection("site_pages").findOne({ key: "academic-photos" })
    const photos = Array.isArray(doc?.value?.photos) ? doc.value.photos : []
    return NextResponse.json(photos)
  } catch (err) {
    console.error("Photos fetch error:", err)
    return NextResponse.json([], { status: 500 })
  }
}