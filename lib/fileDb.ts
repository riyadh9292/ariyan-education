import fs from "fs"
import path from "path"

const dataDir = path.join(process.cwd(), "data")

export function readJson(file: string) {
  const filePath = path.join(dataDir, file)
  const data = fs.readFileSync(filePath, "utf-8")
  return JSON.parse(data)
}