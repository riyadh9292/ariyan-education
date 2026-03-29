/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from "fs"
import path from "path"
import { getMenu, getAllSlugs } from "@/lib/menu"
import ResultTable from "@/components/ResultTable"
import StaffCards from "@/components/Staffcards"

export async function generateStaticParams() {

  const slugs = getAllSlugs()
  

  return slugs.map((slug) => ({
    slug
  }))
}

export default async function Page({ params }: any) {    

  const { slug } = await params
  const menu = getMenu()
  

  let title = slug
  let content = "এই পেজের কনটেন্ট শীঘ্রই যুক্ত করা হবে।"

  // find title from menu
  menu.forEach((item: any) => {

    if (item.slug === slug) {
      title = item.title
    }

    item.submenu?.forEach((sub: any) => {
      if (sub.slug === slug) {
        title = sub.title
      }
    })

  })

  // check custom json page
  const pagePath = path.join(
    process.cwd(),
    "data/pages",
    `${slug}.json`
  )
  

  if (fs.existsSync(pagePath)) {

    const data = JSON.parse(
      fs.readFileSync(pagePath, "utf-8")
    )

    title = data.title
    content = data.content
  }

  return (
    <div className="max-w-5xl mx-auto py-16 px-6">

      <h1 className="text-3xl font-bold mb-6">
        {title}
      </h1>

      { slug === "results" ? (
        <ResultTable />
      ) : slug === "staff" ? (
        <>
          <StaffCards />
        </>
      ) : (
      <p dangerouslySetInnerHTML={{ __html: content }} className="text-gray-700 leading-7">
      </p>
      )
    }

    </div>
  )
}