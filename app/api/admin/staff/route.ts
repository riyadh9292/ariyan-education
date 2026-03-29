import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"

// GET — return only the staff array from site_pages
export async function GET() {
  try {
    const { db } = await connectDB()
    const doc = await db.collection("site_pages").findOne({ key: "staff" })
    const staff = Array.isArray(doc?.value?.staff) ? doc.value.staff : []
    return NextResponse.json(staff)
  } catch (err) {
    console.error("Staff GET error:", err)
    return NextResponse.json([], { status: 500 })
  }
}

// POST — update only the staff array, preserve title & content
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    if (!Array.isArray(body)) {
      return NextResponse.json({ error: "Expected an array" }, { status: 400 })
    }

    const { db } = await connectDB()
    await db.collection("site_pages").updateOne(
      { key: "staff" },
      { $set: { "value.staff": body, updatedAt: new Date() } },
      { upsert: true }
    )

    return NextResponse.json({ message: "Staff data saved successfully" })
  } catch (err) {
    console.error("Staff POST error:", err)
    return NextResponse.json({ error: "Failed to save staff data" }, { status: 500 })
  }
}