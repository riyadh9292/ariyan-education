"use client"
import { useEffect, useState } from "react"
import Link from "next/link"

interface Notice {
  _id       : string
  fileId    : string
  title     : string
  createdAt : string
  uploadedAt: string
}

export default function NoticeBoard() {
  const [notices, setNotices] = useState<Notice[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/notices?limit=5")
      .then(r => r.json())
      .then(data => setNotices(Array.isArray(data) ? data : []))
      .catch(() => setNotices([]))
      .finally(() => setLoading(false))
  }, [])

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("bn-BD", {
      year: "numeric", month: "short", day: "numeric",
    })

  return (
    <section className="w-full max-w-5xl mx-auto px-4 py-16">

      {/* ── Outer card ───────────────────────────────────────────── */}
      <div
        className="relative rounded-3xl overflow-hidden shadow-2xl"
        style={{
          background: "linear-gradient(145deg, #0f1b2d 0%, #1e3a5f 60%, #1a3060 100%)",
          boxShadow : "0 25px 60px rgba(15,27,45,0.35), 0 8px 20px rgba(15,27,45,0.2)",
        }}
      >
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-72 h-72 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(201,168,76,0.12) 0%, transparent 70%)", transform: "translate(30%, -30%)" }} />
        <div className="absolute bottom-0 left-0 w-56 h-56 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(37,99,235,0.15) 0%, transparent 70%)", transform: "translate(-30%, 30%)" }} />

        {/* Gold top accent */}
        <div className="h-1 w-full"
          style={{ background: "linear-gradient(90deg, #c9a84c, #f0c040, #c9a84c)" }} />

        <div className="relative z-10 p-7">

          {/* ── Header ─────────────────────────────────────────── */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              {/* Animated bell */}
              <div className="relative w-11 h-11 flex items-center justify-center rounded-xl flex-shrink-0"
                style={{ background: "rgba(201,168,76,0.15)", border: "1px solid rgba(201,168,76,0.3)" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f0c040" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                </svg>
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 animate-pulse"
                  style={{ borderColor: "#0f1b2d" }} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white leading-tight">নোটিশ বোর্ড</h2>
                <p className="text-xs leading-none mt-0.5" style={{ color: "rgba(255,255,255,0.45)" }}>
                  সর্বশেষ বিজ্ঞপ্তিসমূহ
                </p>
              </div>
            </div>

            <Link
              href="/notices"
              className="flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-full transition-all hover:scale-105"
              style={{
                background: "rgba(201,168,76,0.15)",
                border    : "1px solid rgba(201,168,76,0.4)",
                color     : "#f0c040",
              }}
            >
              সকল নোটিশ
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
          </div>

          {/* ── Inner white card ───────────────────────────────── */}
          <div className="rounded-2xl overflow-hidden"
            style={{ background: "rgba(255,255,255,0.97)" }}>

            {loading ? (
              <div className="divide-y divide-gray-50">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center gap-4 px-5 py-4">
                    <div className="w-8 h-8 rounded-full bg-gray-100 animate-pulse flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 bg-gray-100 rounded animate-pulse"
                        style={{ width: `${65 + (i % 3) * 10}%` }} />
                      <div className="h-2.5 bg-gray-100 rounded animate-pulse w-1/4" />
                    </div>
                  </div>
                ))}
              </div>
            ) : notices.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-gray-300">
                <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                </svg>
                <p className="mt-3 text-sm">কোনো নোটিশ নেই</p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-50">
                {notices.map((n, i) => (
                  <li key={n._id}>
                    <Link
                      href={`/notice/${n.fileId}`}
                      target="_blank"
                      rel="noreferrer"
                      className="group flex items-center gap-4 px-5 py-3.5 hover:bg-blue-50/70 transition-all duration-200"
                    >
                      {/* Badge */}
                      <div
                        className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold transition-transform group-hover:scale-110"
                        style={{
                          background: i === 0
                            ? "linear-gradient(135deg, #c9a84c, #f0c040)"
                            : "linear-gradient(135deg, #1e3a5f, #2563eb)",
                          color: i === 0 ? "#7a4a00" : "white",
                        }}
                      >
                        {i + 1}
                      </div>

                      {/* Text */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800 group-hover:text-blue-700 transition-colors leading-snug truncate">
                          {i === 0 && (
                            <span className="inline-block text-[9px] font-bold px-1.5 py-0.5 rounded mr-1.5 align-middle"
                              style={{ background: "#fef3c7", color: "#92400e" }}>
                              নতুন
                            </span>
                          )}
                          {n.title}
                        </p>
                        <div className="flex items-center gap-1.5 mt-1">
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round">
                            <rect x="3" y="4" width="18" height="18" rx="2"/>
                            <line x1="16" y1="2" x2="16" y2="6"/>
                            <line x1="8" y1="2" x2="8" y2="6"/>
                            <line x1="3" y1="10" x2="21" y2="10"/>
                          </svg>
                          <span className="text-[11px] text-gray-400">{formatDate(n.createdAt || n.uploadedAt)}</span>
                        </div>
                      </div>

                      {/* Arrow */}
                      <svg
                        width="14" height="14" viewBox="0 0 24 24" fill="none"
                        stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round"
                        className="flex-shrink-0 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-200"
                      >
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                      </svg>
                    </Link>
                  </li>
                ))}
              </ul>
            )}

            {/* Footer */}
            {!loading && notices.length > 0 && (
              <Link
                href="/notices"
                className="group flex items-center justify-center gap-2 py-3.5 text-sm font-semibold transition-all hover:bg-blue-50 border-t border-gray-100"
                style={{ color: "#1e3a5f" }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                </svg>
                সকল নোটিশ দেখুন
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
                  className="-translate-x-1 group-hover:translate-x-0 transition-transform duration-200">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Link>
            )}
          </div>

        </div>

        {/* Bottom shimmer line */}
        <div className="h-0.5 w-full"
          style={{ background: "linear-gradient(90deg, transparent, rgba(201,168,76,0.4), transparent)" }} />
      </div>

    </section>
  )
}