/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from "fs"
import path from "path"

export function getMenu() {
  const filePath = path.join(process.cwd(), "data/menu.json")
  const data = fs.readFileSync(filePath, "utf-8")
  return JSON.parse(data)
}

export function getAllSlugs() {

  const menu = getMenu()
  const slugs: string[] = []

  menu.forEach((item: any) => {

    slugs.push(item.slug)

    if (item.submenu?.length) {
      item.submenu.forEach((sub: any) => {
        slugs.push(sub.slug)
      })
    }

  })

  return slugs
}