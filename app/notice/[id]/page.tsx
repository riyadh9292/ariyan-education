// app/notices/[fileId]/page.tsx
import Link from "next/link"
import { connectDB } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export default async function NoticePage({
  params,
}: {
  params: Promise<{ fileId: string }>
}) {
  const { fileId } = await params

  let title      = "নোটিশ"
  let date       = ""
  let noticeDate = ""

  try {
    const { db } = await connectDB()
    const notice = await db
      .collection("notices")
      .findOne({ fileId: new ObjectId(fileId) })
    if (notice) {
      title = notice.title || "নোটিশ"
      noticeDate = notice.date || notice.uploadedAt?.toISOString() || ""
      if (noticeDate) {
        date = new Date(noticeDate).toLocaleDateString("bn-BD", {
          year: "numeric", month: "long", day: "numeric",
        })
      }
    }
  } catch { /* fallback to defaults */ }

  const pdfUrl = `/api/notices/${fileId}`

  return (
    <div className="min-h-screen" style={{ background: "#f0f4f8" }}>

      {/* ── Top navbar ──────────────────────────────────────────────── */}
      <header className="sticky top-0 z-20 shadow-lg"
        style={{ background: "linear-gradient(135deg, #0f1b2d 0%, #1e3a5f 100%)" }}>
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center gap-4">

          {/* Back button */}
          <Link
            href="/notices"
            className="flex items-center gap-1.5 text-white/60 hover:text-white text-sm transition-colors flex-shrink-0 group"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
              className="group-hover:-translate-x-0.5 transition-transform">
              <path d="M19 12H5M12 5l-7 7 7 7"/>
            </svg>
            সকল নোটিশ
          </Link>

          {/* Divider */}
          <span className="text-white/20 text-lg flex-shrink-0">|</span>

          {/* Title (truncated) */}
          <span className="text-white/90 text-sm font-medium truncate flex-1">{title}</span>

          {/* Download button */}
          <a
            href={pdfUrl}
            download
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold flex-shrink-0 transition-all hover:scale-105 active:scale-95"
            style={{ background: "linear-gradient(135deg, #c9a84c, #f0c040)", color: "#0f1b2d" }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            ডাউনলোড
          </a>
        </div>
      </header>

      {/* ── Notice meta card ─────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 pt-6 pb-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            {/* Icon */}
            <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #1e3a5f, #2563eb)" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fde68a" strokeWidth="2" strokeLinecap="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
                <polyline points="10 9 9 9 8 9"/>
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 leading-snug">{title}</h1>
              {date && (
                <div className="flex items-center gap-1.5 mt-1.5">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round">
                    <rect x="3" y="4" width="18" height="18" rx="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                  <span className="text-sm text-gray-400">{date}</span>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <a
              href={pdfUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold border transition-all hover:bg-gray-50"
              style={{ borderColor: "#1e3a5f", color: "#1e3a5f" }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                <polyline points="15 3 21 3 21 9"/>
                <line x1="10" y1="14" x2="21" y2="3"/>
              </svg>
              নতুন ট্যাবে খুলুন
            </a>
            <a
              href={pdfUrl}
              download
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold text-white transition-all hover:opacity-90"
              style={{ background: "linear-gradient(135deg, #1e3a5f, #2563eb)" }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              ডাউনলোড
            </a>
          </div>
        </div>
      </div>

      {/* ── PDF viewer ───────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 pb-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Viewer toolbar strip */}
          <div className="flex items-center gap-3 px-5 py-3 border-b border-gray-100 bg-gray-50">
            <div className="flex gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-400"/>
              <span className="w-3 h-3 rounded-full bg-yellow-400"/>
              <span className="w-3 h-3 rounded-full bg-green-400"/>
            </div>
            <span className="text-xs text-gray-400 ml-2 truncate">{title}</span>
          </div>
          {/* iframe */}
          <iframe
            src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=1`}
            className="w-full"
            style={{ height: "82vh", border: "none", display: "block" }}
            title={title}
          />
        </div>
      </div>
    </div>
  )
}