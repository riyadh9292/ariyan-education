import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"

export async function GET() {
  try {
    const { db } = await connectDB()
    const doc = await db.collection("site_pages").findOne({ key: "academic-videos" })
    const videos = Array.isArray(doc?.value?.videos) ? doc.value.videos : []
    return NextResponse.json(videos)
  } catch (err) {
    console.error("Videos fetch error:", err)
    return NextResponse.json([], { status: 500 })
  }
}