import { NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("slug")
  if (!slug) return NextResponse.json({ error: "slug is required" }, { status: 400 })

  const pagePath = path.join(process.cwd(), "data/pages", `${slug}.json`)

  if (!fs.existsSync(pagePath)) {
    return NextResponse.json({ title: "", content: "" })
  }

  const data = JSON.parse(fs.readFileSync(pagePath, "utf-8"))
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const { slug, title, content } = await req.json()
  if (!slug || !title || !content)
    return NextResponse.json({ error: "slug, title, content required" }, { status: 400 })

  const pagePath = path.join(process.cwd(), "data/pages", `${slug}.json`)
  fs.writeFileSync(pagePath, JSON.stringify({ title, content }, null, 2), "utf-8")

  return NextResponse.json({ success: true, message: "Page updated successfully" })
}