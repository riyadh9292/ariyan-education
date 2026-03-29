/* eslint-disable @typescript-eslint/no-explicit-any */
import { connectDB } from "@/lib/mongodb"

export async function getMenu() {
  const { db } = await connectDB()
  const doc = await db.collection("site_menu").findOne({ key: "menu" })
  return (doc?.value as any[]) ?? []
}

export async function getAllSlugs() {
  const menu = await getMenu()
  const slugs: string[] = []

  menu.forEach((item: any) => {
    slugs.push(item.slug)
    item.submenu?.forEach((sub: any) => {
      slugs.push(sub.slug)
    })
  })

  return slugs
}