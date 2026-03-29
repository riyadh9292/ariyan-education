/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from "next/link"
import Image from "next/image"
import { getMenu } from "@/lib/menu"

export default async function Header() {
  const menu = await getMenu()

  return (
    <header className="fixed top-0 z-50 bg-white shadow w-full">
      <nav className="w-full mx-auto flex justify-center items-center gap-8 p-4 font-medium py-0">

        <Link href="/" className="flex items-center gap-3 pr-6 mr-4 border-r border-white/10 flex-shrink-0 group">
          <div className="transition-transform group-hover:scale-105 duration-300">
            <img
              src="https://i.ibb.co.com/v4FC2GWy/788c07e9-a035-4984-b329-6f96b83456d2-removebg-preview.png"
              alt="আরিয়ান এডুকেশন সেন্টার"
              className="w-28 h-28 object-contain"
            />
          </div>
        </Link>
        {menu.map((item: any, i: number) => (
          <div key={i} className="relative group">

            {item.submenu.length > 0 ? (
              // Top-level with submenu: just show title + dropdown
              <span className="cursor-pointer hover:text-blue-600 transition">
                {item.title}
              </span>
            ) : (
              // Top-level without submenu: clickable link
              <Link
                href={`/${item.slug}`}
                className="cursor-pointer hover:text-blue-600 transition"
              >
                {item.title}
              </Link>
            )}

            {item.submenu.length > 0 && (
              <div
                className="
                absolute left-0 mt-2 w-56
                bg-white shadow-lg rounded
                opacity-0 invisible
                group-hover:opacity-100
                group-hover:visible
                transition-all duration-200
              "
              >
                {item.submenu.map((sub: any) => (
                  <Link
                    key={sub.slug}
                    href={`/${sub.slug}`}
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    {sub.title}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}

      </nav>
    </header>
  )
}