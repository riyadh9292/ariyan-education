/* eslint-disable react-hooks/set-state-in-effect */
'use client'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { createPortal } from 'react-dom'

interface Sub   { title: string; slug: string }
interface Props { title: string; slug: string; submenu: Sub[] }

export default function NavDropdown({ title, slug, submenu }: Props) {
  const [open, setOpen]       = useState(false)
  const [coords, setCoords]   = useState({ top: 0, left: 0 })
  const [mounted, setMounted] = useState(false)
  const triggerRef = useRef<HTMLDivElement>(null)
  const timerRef   = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Need to be mounted on client before using createPortal
  useEffect(() => { setMounted(true) }, [])

  const onEnter = () => {
    if (timerRef.current) clearTimeout(timerRef.current)
    // Calculate position of dropdown relative to viewport
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect()
      setCoords({ top: rect.bottom, left: rect.left })
    }
    setOpen(true)
  }

  const onLeave = () => {
    timerRef.current = setTimeout(() => setOpen(false), 120)
  }

  if (!submenu || submenu.length === 0) {
    return (
      <Link
        href={`/${slug}`}
        className="relative flex items-center px-3 py-6 text-sm font-medium group/link"
        style={{ color: 'rgba(255,255,255,0.8)' }}
      >
        <span className="group-hover/link:text-white transition-colors">{title}</span>
        <span className="absolute inset-x-0 bottom-0 h-0.5 scale-x-0 group-hover/link:scale-x-100 transition-transform origin-left rounded-full"
          style={{ background: '#c9a84c' }} />
      </Link>
    )
  }

  return (
    <div
      ref={triggerRef}
      className="relative flex-shrink-0"
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      {/* Trigger */}
      <div
        className="flex items-center gap-1.5 px-3 py-6 text-sm font-medium cursor-pointer select-none relative"
        style={{ color: open ? '#ffffff' : 'rgba(255,255,255,0.8)' }}
      >
        <span className="absolute inset-0 transition-opacity duration-150"
          style={{ background: 'rgba(201,168,76,0.12)', opacity: open ? 1 : 0 }} />
        <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full transition-transform duration-150 origin-left"
          style={{ background: 'linear-gradient(90deg,#c9a84c,#f0c040)', transform: open ? 'scaleX(1)' : 'scaleX(0)' }} />
        <span className="relative z-10">{title}</span>
        <svg className="relative z-10 flex-shrink-0 transition-transform duration-200"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
          width="12" height="12" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </div>

      {/* ✅ Portal — renders outside the fixed header, no clipping */}
      {mounted && open && createPortal(
        <div
          onMouseEnter={onEnter}
          onMouseLeave={onLeave}
          style={{
            position : 'fixed',
            top      : coords.top,
            left     : coords.left,
            zIndex   : 99999,
            minWidth : '220px',
            borderRadius: '12px',
            overflow : 'hidden',
            boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
            background: '#0f1b2d',
            border   : '1px solid rgba(255,255,255,0.12)',
          }}
        >
          {/* Gold accent top */}

          {submenu.map((sub, i) => (
            <Link
              key={sub.slug}
              href={`/${sub.slug}`}
              onClick={() => setOpen(false)}
              style={{
                display    : 'flex',
                alignItems : 'center',
                gap        : '12px',
                padding    : '12px 16px',
                fontSize   : '14px',
                color      : 'rgba(255,255,255,0.75)',
                borderBottom: i < submenu.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                transition : 'background 0.15s',
                textDecoration: 'none',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <span style={{
                width: '6px', height: '6px', borderRadius: '50%',
                background: '#c9a84c', flexShrink: 0,
              }} />
              {sub.title}
            </Link>
          ))}
        </div>,
        document.body
      )}
    </div>
  )
}