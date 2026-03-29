import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
 
export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("slug")
  if (!slug) return NextResponse.json({ error: "slug is required" }, { status: 400 })
 
  const { db } = await connectDB()
  const doc = await db.collection("site_pages").findOne({ key: slug })
 
  if (!doc) return NextResponse.json({ title: "", content: "" })
 
  return NextResponse.json(doc.value)
}
 
export async function POST(req: NextRequest) {
  const { slug, title, content } = await req.json()
  if (!slug || !title || !content)
    return NextResponse.json({ error: "slug, title, content required" }, { status: 400 })
 
  const { db } = await connectDB()
  await db.collection("site_pages").updateOne(
    { key: slug },
    { $set: { key: slug, value: { title, content }, updatedAt: new Date() } },
    { upsert: true }
  )
 
  return NextResponse.json({ success: true, message: "Page updated successfully" })
}