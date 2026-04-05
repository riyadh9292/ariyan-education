"use client"
import { useEffect, useState } from "react"
import { FileText, Download, Eye, Loader2 } from "lucide-react"
import PageWrapper from "@/components/PageWrapper"

interface ResultRecord {
  _id         : string
  fileId      : string
  academicYear   : string
  originalName: string
  uploadedAt  : string
}

const resultsIcon = (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#f0c040"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V9l-6-6z" />
    <path d="M9 3v6h6" />
    <path d="M9 13l2 2 4-4" />
  </svg>
)

export default function AdmissionTestResult() {
  const [records, setRecords] = useState<ResultRecord[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/admin/admission/result")
      .then(r => r.json())
      .then(data => setRecords(Array.isArray(data) ? data : []))
      .catch(() => setRecords([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <PageWrapper
      title="প্রবেশ পরীক্ষার ফলাফল"
      subtitle="প্রকাশিত ফলাফল সমূহ"
      icon={resultsIcon}
    >
      {loading ? (
        <div className="flex items-center justify-center py-16 text-gray-400 gap-3">
          <Loader2 size={22} className="animate-spin" />
          <span>ফলাফল লোড হচ্ছে...</span>
        </div>

      ) : records.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <FileText size={48} className="mx-auto mb-3 text-gray-200" />
          <p className="text-lg font-medium">এখনো কোনো ফলাফল প্রকাশিত হয়নি</p>
        </div>

      ) : (
        <div className="overflow-x-auto -mx-5 -mb-6">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: "linear-gradient(135deg, #0f1b2d, #1e3a5f)" }}>
                <th className="text-left px-5 py-3.5 text-white font-semibold">ক্রমিক</th>
                <th className="text-left px-5 py-3.5 text-white font-semibold">ফাইল</th>
                <th className="text-left px-5 py-3.5 text-white font-semibold">আপলোডের তারিখ</th>
                <th className="text-center px-5 py-3.5 text-white font-semibold">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {records.map((r, i) => (
                <tr key={r._id} className="hover:bg-blue-50 transition-colors">
                  <td className="px-5 py-4 text-gray-400 font-medium">{i + 1}</td>
                  
                  <td className="px-5 py-4 text-gray-600 font-medium">{r.originalName}</td>
                  <td className="px-5 py-4 text-gray-500 text-xs">
                    {new Date(r.uploadedAt).toLocaleDateString("bn-BD", {
                      year: "numeric", month: "long", day: "numeric",
                    })}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <a
                        href={`/api/admission/result/${r.fileId}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                      >
                        <Eye size={13} /> দেখুন
                      </a>
                      <a
                        href={`/api/admission/result/${r.fileId}`}
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
      )}
    </PageWrapper>
  )
}