import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const { username, password } = await req.json()

  if (username === "admin" && password === "admin") {
    // In a real app, use JWT or sessions
    return NextResponse.json({ success: true })
  } else {
    return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 })
  }
}