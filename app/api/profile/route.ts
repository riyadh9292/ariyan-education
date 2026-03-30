import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"

// GET /api/profile?type=founder  OR  ?type=principal
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
    })
  } catch (err) {
    console.error("Public profile GET error:", err)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}