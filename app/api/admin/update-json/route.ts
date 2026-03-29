/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function POST(req: NextRequest) {
  try {
    const { file, data } = await req.json()

    // Only allow files inside /data or /data/pages
    const filePath = path.join(process.cwd(), "data", file)

    if (!filePath.startsWith(path.join(process.cwd(), "data"))) {
      return NextResponse.json({ success: false, message: "Invalid file path" }, { status: 400 })
    }

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8")

    return NextResponse.json({ success: true, message: "File updated successfully" })
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 })
  }
}