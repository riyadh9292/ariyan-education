/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"

export async function GET() {
  try {
    const { db } = await connectDB()
    const doc = await db.collection("site_pages").findOne({ key: "academic-videos" })
    const raw = Array.isArray(doc?.value?.videos) ? doc.value.videos : []

    // Transform stored shape → what VideoGallery component expects
    const videos = raw.map((v: any) => ({
      id       : v.id ?? v.gridfsId,
      url      : `/api/videos/${v.id ?? v.gridfsId}`,   // stream endpoint
      title    : v.caption ?? v.filename ?? "",          // component uses title
      thumbnail: "",                                     // no thumbnail for uploads
    }))

    return NextResponse.json(videos)
  } catch (err) {
    console.error("Videos fetch error:", err)
    return NextResponse.json([], { status: 500 })
  }
}