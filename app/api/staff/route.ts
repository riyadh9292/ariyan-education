import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"

export async function GET() {
  try {
    const { db } = await connectDB()
    const doc = await db.collection("site_pages").findOne({ key: "staff" })
    const staff = Array.isArray(doc?.value?.staff) ? doc.value.staff : []
    return NextResponse.json(staff)
  } catch (err) {
    console.error("Staff fetch error:", err)
    return NextResponse.json([], { status: 500 })
  }
}