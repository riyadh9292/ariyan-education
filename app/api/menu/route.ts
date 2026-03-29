/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function GET() {
  try {
    // Build path to menu.json
    const filePath = path.join(process.cwd(), "data/menu.json")
    
    // Read file
    const menuData = fs.readFileSync(filePath, "utf-8")
    
    // Parse JSON
    const menu = JSON.parse(menuData)
    
    // Return response
    return NextResponse.json(menu)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}