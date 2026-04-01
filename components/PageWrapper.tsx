// components/PageWrapper.tsx
// Universal page wrapper — matches NoticeBoard, ProfileSection, ContactPage design
// Usage:
//   <PageWrapper title="পেজের শিরোনাম" icon={<svg.../>}>
//     {children}
//   </PageWrapper>

import React from "react"

interface Props {
  title    : string
  subtitle?: string
  icon?    : React.ReactNode   // SVG element — defaults to document icon
  children : React.ReactNode
  // Optional: pass a second column (e.g. map, image, sidebar)
  aside?   : React.ReactNode
}

// Default document icon used when no icon is passed
function DefaultIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
      stroke="#f0c040" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/>
    </svg>
  )
}

export default function PageWrapper({ title, subtitle, icon, children, aside }: Props) {
  return (
    <section className="w-full">

      {/* ── Outer dark navy card — consistent across the whole site ── */}
      <div
        className="relative rounded-3xl overflow-hidden"
        style={{
          background: "linear-gradient(145deg, #0f1b2d 0%, #1e3a5f 60%, #1a3060 100%)",
          boxShadow : "0 25px 60px rgba(15,27,45,0.35), 0 8px 20px rgba(15,27,45,0.2)",
        }}
      >
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(201,168,76,0.10) 0%, transparent 70%)", transform: "translate(35%,-35%)" }} />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(37,99,235,0.13) 0%, transparent 70%)", transform: "translate(-35%,35%)" }} />

        {/* Gold top line */}
        <div className="h-1 w-full"
          style={{ background: "linear-gradient(90deg, #c9a84c, #f0c040, #c9a84c)" }} />

        <div className="relative z-10 p-6 sm:p-8">

          {/* ── Header — icon + title + subtitle ─────────────────── */}
          <div className="flex items-center gap-3 mb-7">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: "rgba(201,168,76,0.15)", border: "1px solid rgba(201,168,76,0.3)" }}
            >
              {icon ?? <DefaultIcon />}
            </div>
            <div>
              <h2 className="text-xl font-bold text-white leading-tight">{title}</h2>
              {subtitle && (
                <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.45)" }}>
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          {/* ── Body — single or two-column ──────────────────────── */}
          {aside ? (
            // Two-column layout (e.g. content + map)
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* Left — main content */}
              <div className="rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.97)" }}>
                <div className="px-5 py-3 border-b border-gray-100 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ background: "#f0c040" }} />
                  <span className="text-sm font-semibold text-gray-700">{title}</span>
                </div>
                <div className="p-5">{children}</div>
              </div>
              {/* Right — aside (map, image etc.) */}
              <div className="rounded-2xl overflow-hidden relative" style={{ minHeight: "320px" }}>
                {aside}
              </div>
            </div>
          ) : (
            // Single-column — full width white card
            <div className="rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.97)" }}>
              <div className="px-5 py-3 border-b border-gray-100 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full" style={{ background: "#f0c040" }} />
                <span className="text-sm font-semibold text-gray-700">{title}</span>
              </div>
              <div className="p-5 sm:p-6">{children}</div>
            </div>
          )}

        </div>

        {/* Bottom shimmer */}
        <div className="h-0.5 w-full"
          style={{ background: "linear-gradient(90deg, transparent, rgba(201,168,76,0.4), transparent)" }} />
      </div>

    </section>
  )
}