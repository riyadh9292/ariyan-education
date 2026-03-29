/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/fileDb.ts
// Drop-in replacement — same API as before but reads/writes MongoDB instead of JSON files

import { connectDB } from "@/lib/mongodb"

export async function readDb(key: string) {
  const { db } = await connectDB()
  const doc = await db.collection("site_data").findOne({ key })
  return doc?.value ?? null
}

export async function writeDb(key: string, value: any) {
  const { db } = await connectDB()
  await db.collection("site_data").updateOne(
    { key },
    { $set: { key, value, updatedAt: new Date() } },
    { upsert: true }   // insert if not exists, update if exists
  )
}