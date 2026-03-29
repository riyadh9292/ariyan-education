/* eslint-disable @typescript-eslint/no-explicit-any */
import { getMenu, getAllSlugs } from "@/lib/menu"
import { connectDB } from "@/lib/mongodb"
import ResultTable from "@/components/ResultTable"
import StaffCards from "@/components/Staffcards"
import PhotoGallery from "@/components/PhotoGallery"
import VideoGallery from "@/components/VideoGallery"

export async function generateStaticParams() {
  const slugs = await getAllSlugs()
  return slugs.map((slug) => ({ slug }))
}

export default async function Page({ params }: any) {
  const { slug } = await params
  const menu = await getMenu()

  let title = slug
  let content = "এই পেজের কনটেন্ট শীঘ্রই যুক্ত করা হবে।"

  // find title from menu
  menu.forEach((item: any) => {
    if (item.slug === slug) title = item.title
    item.submenu?.forEach((sub: any) => {
      if (sub.slug === slug) title = sub.title
    })
  })

  // fetch page data from MongoDB
  const { db } = await connectDB()
  const doc = await db.collection("site_pages").findOne({ key: slug })
  console.log(doc,"doc");
  

  if (doc?.value) {
    title = doc.value.title ?? title
    content = doc.value.content ?? content
  }

  return (
    <div className="max-w-5xl mx-auto py-16 px-6">
      <h1 className="text-3xl font-bold mb-6">{title}</h1>

      {slug === "results" ? (
        <ResultTable />
      ) : slug === "staff" ? (
        <StaffCards />
      ) : slug === "academic-photos" ? (
        <PhotoGallery />
      ) : slug === "academic-videos" ? (
        <VideoGallery />
      ) : (
        <div
          dangerouslySetInnerHTML={{ __html: content }}
          className="text-gray-700 leading-7"
        />
      )}
    </div>
  )
}