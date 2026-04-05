/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from 'next/link'
import { getMenu } from '@/lib/menu'
import NavDropdown from '@/components/NavDropdown'
import MobileNav from '@/components/Mobilenav'

export default async function Header() {
  const menu = await getMenu()

  return (
    <header
      className="fixed top-0 z-50 w-full shadow-lg"
      style={{ background: 'linear-gradient(135deg, #0f1b2d 0%, #1e3a5f 100%)' }}
    >
      <nav className="w-full flex items-center px-4">


        {/* ── Desktop: home icon + menu ── visible above 1200px ───── */}
        <div className="hidden xl:flex items-center flex-1">

          {/* Home icon */}
          

          {/* Desktop menu */}
          <div className="flex items-center justify-center flex-1 flex-wrap">
            <Link
            href="/"
            className="flex items-center justify-center w-9 h-9 rounded-lg mx-3 flex-shrink-0 transition-all duration-200 hover:scale-110"
            style={{ background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.3)' }}
            title="হোম"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="#c9a84c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
          </Link>

          <span className="h-6 w-px flex-shrink-0" style={{ background: 'rgba(255,255,255,0.12)' }} />
            {menu.map((item: any, i: number) => (
              <div key={i} className="flex items-center flex-shrink-0">
                {i > 0 && (
                  <span className="h-4 w-px" style={{ background: 'rgba(255,255,255,0.15)' }} />
                )}
                <NavDropdown
                  title={item.title}
                  slug={item.slug}
                  submenu={item.submenu ?? []}
                />
              </div>
            ))}
          </div>
        </div>

        {/* ── Mobile: school name + hamburger ── hidden above 1200px ── */}
        <div className="flex xl:hidden items-center flex-1 justify-between h-[50px]">
          <Link
            href="/"
            className="flex items-center justify-center w-9 h-9 rounded-lg  flex-shrink-0 transition-all duration-200 hover:scale-110">
            <img
              src="https://i.ibb.co.com/Lz5Ns3K0/Whats-App-Image-2026-03-30-at-09-27-46-removebg-preview.png"
              alt="আরিয়ান এডুকেশন সেন্টার"
              className="h-14 w-auto object-contain scale-150"
            />
        </Link>
          <MobileNav menu={menu} />
        </div>

      </nav>
    </header>
  )
}