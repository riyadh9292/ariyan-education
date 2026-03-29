"use client"
import { useEffect, useState } from "react"
import { FileText, Download, Eye, Loader2 } from "lucide-react"

interface ResultRecord {
  _id         : string
  fileId      : string
  examName    : string
  examYear    : string
  examClass   : string
  originalName: string
  uploadedAt  : string
}

export default function ResultTable() {
  const [records, setRecords] = useState<ResultRecord[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/results")
      .then(r => r.json())
      .then(data => setRecords(Array.isArray(data) ? data : []))
      .catch(() => setRecords([]))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-gray-400 gap-3">
        <Loader2 size={22} className="animate-spin" />
        <span>ফলাফল লোড হচ্ছে...</span>
      </div>
    )
  }

  if (records.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
        <FileText size={52} className="mx-auto mb-3 text-gray-200" />
        <p className="text-gray-400 text-lg font-medium">এখনো কোনো ফলাফল প্রকাশিত হয়নি</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: "linear-gradient(135deg, #0f1b2d, #1e3a5f)" }}>
              <th className="text-left px-5 py-4 text-white font-semibold">ক্রমিক</th>
              <th className="text-left px-5 py-4 text-white font-semibold">পরীক্ষার নাম</th>
              <th className="text-left px-5 py-4 text-white font-semibold">শ্রেণি</th>
              <th className="text-left px-5 py-4 text-white font-semibold">সাল</th>
              <th className="text-left px-5 py-4 text-white font-semibold">প্রকাশের তারিখ</th>
              <th className="text-center px-5 py-4 text-white font-semibold">ফলাফল</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {records.map((r, i) => (
              <tr key={r._id} className="hover:bg-blue-50 transition-colors">
                <td className="px-5 py-4 text-gray-400 font-medium">{i + 1}</td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <FileText size={16} className="text-blue-400 flex-shrink-0" />
                    <span className="font-semibold text-gray-800">{r.examName}</span>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                    {r.examClass}
                  </span>
                </td>
                <td className="px-5 py-4 text-gray-600 font-medium">{r.examYear}</td>
                <td className="px-5 py-4 text-gray-500 text-xs">
                  {new Date(r.uploadedAt).toLocaleDateString("bn-BD", {
                    year: "numeric", month: "long", day: "numeric",
                  })}
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center justify-center gap-2">
                    <a
                      href={`/api/results/${r.fileId}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                    >
                      <Eye size={13} /> দেখুন
                    </a>
                    <a
                      href={`/api/results/${r.fileId}`}
                      download={r.originalName}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-green-50 text-green-700 hover:bg-green-100 transition-colors border border-green-200"
                    >
                      <Download size={13} /> ডাউনলোড
                    </a>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}