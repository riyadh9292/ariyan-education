import { NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"

const STAFF_FILE = path.join(process.cwd(), "data", "pages", "staff.json")

function readFile() {
  if (!fs.existsSync(STAFF_FILE)) return {}
  try {
    return JSON.parse(fs.readFileSync(STAFF_FILE, "utf-8"))
  } catch {
    return {}
  }
}

// GET — return only the staff array
export async function GET() {
  try {
    const data = readFile()
    return NextResponse.json(Array.isArray(data.staff) ? data.staff : [])
  } catch (err) {
    console.error("Staff GET error:", err)
    return NextResponse.json([], { status: 500 })
  }
}

// POST — merge staff array into existing file, preserve title & content
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    if (!Array.isArray(body)) {
      return NextResponse.json({ error: "Expected an array" }, { status: 400 })
    }

    const existing = readFile()

    const updated = {
      ...existing,   // keeps title, content, and any other fields untouched
      staff: body,
    }

    fs.writeFileSync(STAFF_FILE, JSON.stringify(updated, null, 2), "utf-8")
    return NextResponse.json({ message: "Staff data saved successfully" })
  } catch (err) {
    console.error("Staff POST error:", err)
    return NextResponse.json({ error: "Failed to save staff data" }, { status: 500 })
  }
}