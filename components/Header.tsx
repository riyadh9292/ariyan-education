/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from 'next/link'
import { getMenu } from '@/lib/menu'
import NavDropdown from '@/components/NavDropdown'

export default async function Header() {
  const menu = await getMenu()

  return (
    <header
      className="fixed top-0 z-50 w-full shadow-lg"
      style={{ background: 'linear-gradient(135deg, #0f1b2d 0%, #1e3a5f 100%)' }}
    >
      <nav className="w-full mx-auto flex items-center justify-center px-4">

        {/* ── Logo ───────────────────────────────────────────────── */}
        <Link
          href="/"
          className="flex items-center flex-shrink-0 transition-transform hover:scale-105 duration-300 pr-3"
          style={{ borderRight: '1px solid rgba(255,255,255,0.12)' }}
        >
          <img
            src="https://i.ibb.co.com/v4FC2GWy/788c07e9-a035-4984-b329-6f96b83456d2-removebg-preview.png"
            alt="আরিয়ান এডুকেশন সেন্টার"
            className="w-20 h-20 object-contain"
          />
        </Link>

        {/* ── Home icon ──────────────────────────────────────────── */}
        <Link
          href="/"
          className="flex items-center justify-center w-9 h-9 rounded-lg mx-3 flex-shrink-0 transition-all duration-200 hover:scale-110"
          style={{
            background: 'rgba(201,168,76,0.15)',
            border: '1px solid rgba(201,168,76,0.3)',
          }}
          title="হোম"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="#c9a84c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
        </Link>

        {/* ── Divider ────────────────────────────────────────────── */}
        <span className="h-6 w-px flex-shrink-0"
          style={{ background: 'rgba(255,255,255,0.12)' }} />

        {/* ── Menu ───────────────────────────────────────────────── */}
        <div
          className="flex items-center overflow-x-auto "
          style={{ scrollbarWidth: 'none' }}
        >
          {menu.map((item: any, i: number) => (
            <div key={i} className="flex items-center flex-shrink-0">

              {/* | separator between items */}
              {i > 0 && (
                <span className="h-4 w-px flex-shrink-0 mx-1"
                  style={{ background: 'rgba(255,255,255,0.15)' }} />
              )}

              {/* ✅ Client component handles hover + dropdown reliably */}
              <NavDropdown
                title={item.title}
                slug={item.slug}
                submenu={item.submenu ?? []}
              />

            </div>
          ))}
        </div>

      </nav>
    </header>
  )
}