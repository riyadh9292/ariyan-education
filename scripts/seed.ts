/**
 * seed-menu.ts — seeds only the menu into MongoDB
 *
 * Run: npx tsx scripts/seed-menu.ts
 */

import { MongoClient } from "mongodb"
import { config } from "dotenv"
import path from "path"

config({ path: path.join(process.cwd(), ".env.local") })

const MONGODB_URI = process.env.MONGODB_URI!
if (!MONGODB_URI) throw new Error("MONGODB_URI not found in .env.local")

const MENU = [
  {
    title: "প্রতিষ্ঠান পরিচিতি",
    slug: "about",
    submenu: [
      { title: "আমাদের সম্পর্কে", slug: "about-us" },
      { title: "লক্ষ্য এবং উদ্দেশ্য", slug: "mission" },
      { title: "ইতিহাস", slug: "history" },
      { title: "বার্ষিক কর্ম পরিকল্পনা", slug: "annual-plan" },
      { title: "যোগাযোগের ঠিকানা", slug: "contact" },
    ],
  },
  {
    title: "প্রশাসনিক তথ্য",
    slug: "administration",
    submenu: [
      { title: "প্রতিষ্ঠাতা", slug: "founder" },
      { title: "অধ্যক্ষের পরিচিতি", slug: "principal" },
      { title: "অধ্যক্ষ", slug: "head" },
    ],
  },
  {
    title: "শিক্ষক ও কর্মচারী",
    slug: "staff",
    submenu: [],
  },
  {
    title: "একাডেমিক তথ্য",
    slug: "academic",
    submenu: [
      { title: "ক্লাস রুটিন", slug: "class-routine" },
      { title: "ছুটির তালিকা", slug: "holiday-list" },
      { title: "ফি সমূহ", slug: "fees" },
    ],
  },
  {
    title: "ভর্তি সংক্রান্ত",
    slug: "admission",
    submenu: [
      { title: "প্রস্পেক্টাস", slug: "prospectus" },
      { title: "ভর্তির নিয়মাবলী", slug: "rules" },
      { title: "ভর্তির পদ্ধতি", slug: "process" },
      { title: "ভর্তি পরীক্ষার ফলাফল", slug: "result" },
      { title: "ভর্তি পরীক্ষার প্রশ্নপত্র", slug: "questions" },
    ],
  },
  {
    title: "পরীক্ষা সংক্রান্ত",
    slug: "exam",
    submenu: [
      { title: "পরীক্ষার নিয়মাবলী", slug: "exam-rules" },
      { title: "পরীক্ষার সময়সূচী", slug: "schedule" },
      { title: "পরীক্ষার সিলেবাস", slug: "syllabus" },
    ],
  },
  {
    title: "ফলাফল",
    slug: "results",
    submenu: [],
  },
  {
    title: "গ্যালারি",
    slug: "gallery",
    submenu: [
      { title: "ছবি", slug: "academic-photos" },
      { title: "ভিডিও", slug: "academic-videos" },
    ],
  },
]

async function seed() {
  console.log("🔌 Connecting to MongoDB...")
  const client = new MongoClient(MONGODB_URI)
  await client.connect()
  const db = client.db()

  console.log("📋 Saving menu to site_menu collection...")
  await db.collection("site_menu").updateOne(
    { key: "menu" },
    { $set: { key: "menu", value: MENU, updatedAt: new Date() } },
    { upsert: true }
  )

  console.log("✅ Done! Menu saved as { key: 'menu', value: [...] }")
  await client.close()
}

seed().catch((err) => {
  console.error("❌ Failed:", err)
  process.exit(1)
})