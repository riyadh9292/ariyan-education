import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("slug")
  if (!slug) return NextResponse.json({ title: "", content: "" }, { status: 400 })

  try {
    const { db } = await connectDB()
    const doc = await db.collection("site_pages").findOne({ key: slug })

    return NextResponse.json({
      title  : doc?.value?.title   ?? "",
      content: doc?.value?.content ?? "",
    })
  } catch (err) {
    console.error("Page fetch error:", err)
    return NextResponse.json({ title: "", content: "" }, { status: 500 })
  }
}