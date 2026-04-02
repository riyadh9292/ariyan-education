'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Sub   { title: string; slug: string }
interface Item  { title: string; slug: string; submenu: Sub[] }
interface Props { menu: Item[] }

export default function MobileNav({ menu }: Props) {
  const [open,     setOpen]     = useState(false)
  const [expanded, setExpanded] = useState<number | null>(null)

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  const close = () => { setOpen(false); setExpanded(null) }

  return (
    <>
      {/* Hamburger */}
      <button
        onClick={() => setOpen(true)}
        className="flex flex-col justify-center items-center w-9 h-9 rounded-lg gap-1.5 flex-shrink-0 transition-all hover:bg-white/10"
        aria-label="মেনু খুলুন"
      >
        <span className="w-5 h-0.5 bg-white rounded-full" />
        <span className="w-5 h-0.5 bg-white rounded-full" />
        <span className="w-5 h-0.5 bg-white rounded-full" />
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-[9998]"
          style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(2px)' }}
          onClick={close}
        />
      )}

      {/* Sidebar */}
      <div
        className="fixed top-0 right-0 h-full w-80 max-w-[85vw] z-[9999] flex flex-col shadow-2xl transition-transform duration-300 ease-in-out"
        style={{
          background: 'linear-gradient(160deg, #0a1628 0%, #0f1b2d 100%)',
          transform : open ? 'translateX(0)' : 'translateX(100%)',
          borderLeft: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        {/* Sidebar header */}
        <div className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="flex items-center gap-2">
            <img
              src="https://i.ibb.co.com/Lz5Ns3K0/Whats-App-Image-2026-03-30-at-09-27-46-removebg-preview.png"
              alt="Ariyan Education"
              className="w-20 h-20 object-contain scale-150"
            />
            <div>
              <div className="text-white text-sm font-bold leading-tight">আরিয়ান স্কিলড</div>
              <div className="text-xs font-medium" style={{ color: '#c9a84c' }}>একাডেমি</div>
            </div>
          </div>
          <button
            onClick={close}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* Home */}
        <Link
          href="/"
          onClick={close}
          className="flex items-center gap-3 px-5 py-3.5 text-sm font-medium transition-colors hover:bg-white/5"
          style={{ color: 'rgba(255,255,255,0.8)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
          হোম
        </Link>

        {/* Menu */}
        <div className="flex-1 overflow-y-auto py-2">
          {menu.map((item, i) => (
            <div key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              {item.submenu?.length > 0 ? (
                <>
                  <button
                    onClick={() => setExpanded(expanded === i ? null : i)}
                    className="w-full flex items-center justify-between px-5 py-3.5 text-sm font-medium transition-colors hover:bg-white/5"
                    style={{ color: expanded === i ? '#ffffff' : 'rgba(255,255,255,0.75)' }}
                  >
                    <span>{item.title}</span>
                    <svg
                      width="14" height="14" viewBox="0 0 24 24" fill="none"
                      stroke={expanded === i ? '#c9a84c' : 'rgba(255,255,255,0.4)'}
                      strokeWidth="2.5" strokeLinecap="round"
                      className="transition-transform duration-200 flex-shrink-0"
                      style={{ transform: expanded === i ? 'rotate(180deg)' : 'rotate(0deg)' }}
                    >
                      <path d="M6 9l6 6 6-6"/>
                    </svg>
                  </button>
                  {expanded === i && (
                    <div style={{ background: 'rgba(0,0,0,0.2)' }}>
                      {item.submenu.map((sub) => (
                        <Link
                          key={sub.slug}
                          href={`/${sub.slug}`}
                          onClick={close}
                          className="flex items-center gap-3 pl-9 pr-5 py-3 text-sm transition-colors hover:bg-white/5"
                          style={{ color: 'rgba(255,255,255,0.6)', borderTop: '1px solid rgba(255,255,255,0.03)' }}
                        >
                          <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#c9a84c' }} />
                          {sub.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  href={`/${item.slug}`}
                  onClick={close}
                  className="flex items-center px-5 py-3.5 text-sm font-medium transition-colors hover:bg-white/5"
                  style={{ color: 'rgba(255,255,255,0.75)' }}
                >
                  {item.title}
                </Link>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-5 py-4 text-xs text-center"
          style={{ color: 'rgba(255,255,255,0.25)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          © {new Date().getFullYear()} আরিয়ান স্কিলড একাডেমি
        </div>
      </div>
    </>
  )
}