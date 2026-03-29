"use client"
import { useEffect, useState } from "react"
import Link from "next/link"

interface Notice {
  _id        : string
  fileId     : string
  title      : string
  date       : string
  uploadedAt : string
}

export default function NoticeBoard() {
  const [notices, setNotices] = useState<Notice[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/notices?limit=5")
      .then(r => r.json())
      .then(data => setNotices(Array.isArray(data) ? data.slice(0, 7) : []))
      .catch(() => setNotices([]))
      .finally(() => setLoading(false))
  }, [])

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("bn-BD", {
      year: "numeric", month: "short", day: "numeric",
    })

  return (
    <section className="w-full max-w-5xl mx-auto px-4 py-12">
      {/* Header row */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          {/* Bell icon */}
          <div className="relative w-10 h-10 flex items-center justify-center rounded-xl"
            style={{ background: "linear-gradient(135deg, #1e3a5f, #2563eb)" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fde68a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
            {/* Pulse dot */}
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 leading-tight">নোটিশ বোর্ড</h2>
            <p className="text-xs text-gray-400 leading-none mt-0.5">সর্বশেষ বিজ্ঞপ্তিসমূহ</p>
          </div>
        </div>
        <Link
          href="/notices"
          className="flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-full border transition-all hover:shadow-md"
          style={{ borderColor: "#1e3a5f", color: "#1e3a5f" }}
        >
          সকল নোটিশ
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </Link>
      </div>

      {/* Board card */}
      <div className="relative rounded-2xl overflow-hidden shadow-lg border border-gray-100"
        style={{ background: "linear-gradient(180deg, #ffffff 0%, #f8faff 100%)" }}>

        {/* Decorative top bar */}
        <div className="h-1.5 w-full" style={{ background: "linear-gradient(90deg, #1e3a5f, #2563eb, #c9a84c)" }} />

        {loading ? (
          /* Skeleton loaders */
          <div className="divide-y divide-gray-50 px-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 px-4 py-4">
                <div className="w-8 h-8 rounded-full bg-gray-100 animate-pulse flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3.5 bg-gray-100 rounded animate-pulse w-3/4" />
                  <div className="h-2.5 bg-gray-100 rounded animate-pulse w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : notices.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-300">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
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
                  href={`/notices/${n.fileId}`}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-start gap-4 px-6 py-4 hover:bg-blue-50 transition-all duration-200"
                >
                  {/* Serial badge */}
                  <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white mt-0.5 transition-transform group-hover:scale-110"
                    style={{ background: i === 0 ? "linear-gradient(135deg, #c9a84c, #f0c040)" : "linear-gradient(135deg, #1e3a5f, #2563eb)", color: i === 0 ? "#1a1200" : "white" }}>
                    {i + 1}
                  </div>

                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 group-hover:text-blue-700 transition-colors leading-snug line-clamp-2">
                      {/* NEW badge for first item */}
                      {i === 0 && (
                        <span className="inline-block text-[10px] font-bold px-1.5 py-0.5 rounded mr-2 align-middle"
                          style={{ background: "#fef3c7", color: "#92400e" }}>
                          নতুন
                        </span>
                      )}
                      {n.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round">
                        <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
                        <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                      </svg>
                      <span className="text-xs text-gray-400">{formatDate(n.date || n.uploadedAt)}</span>
                    </div>
                  </div>

                  {/* Arrow */}
                  <div className="flex-shrink-0 mt-1 opacity-0 group-hover:opacity-100 transition-all -translate-x-1 group-hover:translate-x-0">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}

        {/* Footer — see all */}
        {!loading && notices.length > 0 && (
          <div className="border-t border-gray-100">
            <Link
              href="/notices"
              className="group flex items-center justify-center gap-2 py-4 text-sm font-semibold transition-colors hover:bg-blue-50"
              style={{ color: "#1e3a5f" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
              সকল নোটিশ দেখুন
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
                className="-translate-x-1 group-hover:translate-x-0 transition-transform">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}