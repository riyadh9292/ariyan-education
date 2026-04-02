/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from "next/link"
import { connectDB } from "@/lib/mongodb"

export const dynamic = "force-dynamic"

async function getAllNotices() {
  try {
    const { db } = await connectDB()        // ✅ destructure { db }
    const notices = await db
      .collection("notices")
      .find({})
      .sort({ uploadedAt: -1 })             // ✅ sort by uploadedAt not date
      .toArray()

    return notices.map((n: any) => ({
      id      : n._id.toString(),
      fileId  : n.fileId.toString(),        // ✅ needed for API URL
      title   : n.title,
      filename: n.originalName || n.filename,
      createdAt: n.createdAt || n.uploadedAt,
    }))
  } catch (err) {
    console.error("Failed to fetch notices:", err)
    return []
  }
}

export default async function NoticesPage() {
  const notices = await getAllNotices()

  return (
    <div className="w-[96%] sm:w-[80vw] mx-auto py-16 px-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-800">সকল নোটিশ</h1>
        <Link href="/" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
          </svg>
          হোমে ফিরুন
        </Link>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="h-1" style={{ background: "linear-gradient(90deg, #1e3a5f, #2563eb, #c9a84c)" }} />

        {notices.length === 0 ? (
          <div className="py-16 text-center text-gray-400">
            <svg className="w-12 h-12 mx-auto mb-3 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p>কোনো নোটিশ নেই।</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200" style={{ background: "linear-gradient(135deg, #0f1b2d, #1e3a5f)" }}>
                <th className="text-left px-5 py-4 font-semibold text-white w-12">ক্রমিক</th>
                <th className="text-left px-5 py-4 font-semibold text-white">শিরোনাম</th>
                <th className="text-left px-5 py-4 font-semibold text-white w-44">তারিখ</th>
                <th className="px-5 py-4 w-28 text-center font-semibold text-white">ডাউনলোড</th>
              </tr>
            </thead>
            <tbody>
              {notices.map((notice, i) => (
                <tr
                  key={notice.id}
                  className="border-b border-gray-100 hover:bg-blue-50/40 transition-colors"
                >
                  <td className="px-5 py-3.5 text-gray-400 text-xs">{i + 1}</td>
                  <td className="px-5 py-3.5">
                    {/* ✅ opens the notice viewer page */}
                    <Link
                      href={`/notice/${notice.fileId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start gap-2 group"
                    >
                      <span className="mt-0.5 text-blue-500 shrink-0 group-hover:translate-x-0.5 transition-transform">▶</span>
                      <span className="text-gray-700 underline underline-offset-2 decoration-dashed group-hover:text-blue-700 transition-colors">
                        {notice.title}
                      </span>
                    </Link>
                  </td>
                  <td className="px-5 py-3.5 text-gray-500 text-xs">
                    {new Date(notice.createdAt).toLocaleDateString("bn-BD", {
                      year: "numeric", month: "long", day: "numeric",
                    })}
                  </td>
                  <td className="px-5 py-3.5 text-center">
                    {/* ✅ uses fileId for API URL, originalName for filename */}
                    <a
                      href={`/api/notices/${notice.fileId}`}
                      download={notice.filename}
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors text-xs font-medium"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      PDF
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <p className="text-center text-xs text-gray-400 mt-6">
        মোট {notices.length}টি নোটিশ
      </p>
    </div>
  )
}