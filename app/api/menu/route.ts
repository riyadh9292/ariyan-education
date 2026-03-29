/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server"
import { getMenu } from "@/lib/menu"
 
export async function GET() {
  try {
    const menu = await getMenu()
    return NextResponse.json(menu)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}