/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from "next/link"
import { readJson } from "@/lib/fileDb"

export default function MenuSection() {
  const menu = readJson("menu.json")

  return (
    <footer className="max-w-7xl mx-auto py-12 grid md:grid-cols-4 gap-8">

      {menu.map((item: any, i: number) => (
        <div key={i}>

          <h2 className="font-bold text-lg border-b pb-2 mb-3">
            {item.title}
          </h2>

          <ul className="space-y-2">

            {item.submenu.map((sub: any) => (
              <li key={sub.slug}>

                <Link
                  href={`/${sub.slug}`}
                  className="
                  hover:text-blue-600
                  transition
                  flex items-center gap-2
                "
                >
                  • {sub.title}
                </Link>

              </li>
            ))}

          </ul>

        </div>
      ))}

    </footer>
  )
}