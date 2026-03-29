/* eslint-disable @typescript-eslint/no-explicit-any */
import { getMenu, getAllSlugs } from "@/lib/menu"
import PageContent from "@/components/PageContent"

export async function generateStaticParams() {
  const slugs = await getAllSlugs()
  return slugs.map((slug) => ({ slug }))
}

export default async function Page({ params }: any) {
  const { slug } = await params
  const menu = await getMenu()

  let title = slug
  // let content = "এই পেজের কনটেন্ট শীঘ্রই যুক্ত করা হবে।"

  // find title from menu
  menu.forEach((item: any) => {
    if (item.slug === slug) title = item.title
    item.submenu?.forEach((sub: any) => {
      if (sub.slug === slug) title = sub.title
    })
  })

  return <PageContent slug={slug} defaultTitle={title} />
}