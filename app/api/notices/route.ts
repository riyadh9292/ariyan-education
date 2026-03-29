// app/api/notices/route.ts
import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl
    const limit = Math.min(
      parseInt(searchParams.get("limit") || "5"),
      100   // hard cap so no one requests 99999
    )

    const { db } = await connectDB()

    const notices = await db
      .collection("notices")
      .find({})
      .sort({ uploadedAt: -1 })
      .limit(limit)
      .toArray()

    return NextResponse.json(
      notices.map(n => ({
        ...n,
        _id   : n._id.toString(),
        fileId: n.fileId.toString(),
      }))
    )
  } catch (err) {
    console.error("Notice fetch error:", err)
    return NextResponse.json({ error: "Fetch failed." }, { status: 500 })
  }
}