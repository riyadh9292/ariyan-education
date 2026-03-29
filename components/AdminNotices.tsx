"use client"
import { useEffect, useRef, useState } from "react"

interface Notice {
  _id: string
  title: string
  filename: string
  date: string
}

export default function AdminNotices() {
  const [notices, setNotices] = useState<Notice[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [title, setTitle] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null)
  const fileRef = useRef<HTMLInputElement | null>(null)

  const fetchNotices = () => {
    setLoading(true)
    fetch("/api/admin/notices")
      .then((r) => r.json())
      .then(setNotices)
      .catch(() => setNotices([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchNotices() }, [])

  const showMsg = (text: string, type: "success" | "error") => {
    setMessage({ text, type })
    setTimeout(() => setMessage(null), 3500)
  }

  const handleUpload = async () => {
    if (!title.trim()) return showMsg("শিরোনাম দিন।", "error")
    if (!file) return showMsg("PDF ফাইল বেছে নিন।", "error")

    setUploading(true)
    const formData = new FormData()
    formData.append("title", title.trim())
    formData.append("file", file)

    try {
      const res = await fetch("/api/admin/notices", { method: "POST", body: formData })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      showMsg(data.message, "success")
      setTitle("")
      setFile(null)
      if (fileRef.current) fileRef.current.value = ""
      fetchNotices()
    } catch (e: unknown) {
      showMsg(e instanceof Error ? e.message : "আপলোড ব্যর্থ হয়েছে।", "error")
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("এই নোটিশটি মুছে ফেলবেন?")) return
    setDeletingId(id)
    try {
      const res = await fetch(`/api/notices/${id}`, { method: "DELETE" })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      showMsg(data.message, "success")
      setNotices((prev) => prev.filter((n) => n._id !== id))
    } catch (e: unknown) {
      showMsg(e instanceof Error ? e.message : "মুছতে ব্যর্থ হয়েছে।", "error")
    } finally {
      setDeletingId(null)
    }
  }
  console.log(notices,"notices");
  

  return (
    <div className="mb-6">
      {/* Upload form */}
      <div className="border border-gray-200 rounded-xl p-5 mb-6 bg-gray-50">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">নতুন নোটিশ আপলোড</h3>

        <div className="flex flex-col gap-3">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="নোটিশের শিরোনাম লিখুন..."
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
          />

          <div className="flex items-center gap-3">
            <input
              type="file"
              accept="application/pdf"
              ref={fileRef}
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="hidden"
            />
            <button
              onClick={() => fileRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-sm text-gray-600 hover:bg-white hover:border-gray-400 transition-colors bg-white"
            >
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
              {file ? file.name : "PDF বেছে নিন"}
            </button>

            <button
              onClick={handleUpload}
              disabled={uploading}
              className="flex items-center gap-2 px-5 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {uploading ? (
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
              )}
              {uploading ? "আপলোড হচ্ছে..." : "আপলোড করুন"}
            </button>
          </div>

          {message && (
            <p className={`text-sm font-medium ${message.type === "success" ? "text-green-600" : "text-red-600"}`}>
              {message.text}
            </p>
          )}
        </div>
      </div>

      {/* Notices table */}
      <div className="border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left px-4 py-3 font-semibold text-gray-600 w-8">#</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">শিরোনাম</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600 w-36">তারিখ</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600 w-24">দেখুন</th>
              <th className="px-4 py-3 w-12"></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr key="test">
                <td colSpan={5} className="text-center py-10 text-gray-400">লোড হচ্ছে...</td>
              </tr>
            ) : notices.length === 0 ? (
              <tr key='t2'>
                <td colSpan={5} className="text-center py-10 text-gray-400">কোনো নোটিশ নেই।</td>
              </tr>
            ) : (
              notices.map((notice, i) => (
                <tr key={notice._id} className="border-b border-gray-100 hover:bg-gray-50/60 transition-colors">
                  <td className="px-4 py-3 text-gray-400 text-xs">{i + 1}</td>
                  <td className="px-4 py-3 text-gray-800 font-medium">{notice.title}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">
                    {new Date(notice.date).toLocaleDateString("bn-BD", {
                      year: "numeric", month: "long", day: "numeric",
                    })}
                  </td>
                  <td className="px-4 py-3">
                    <a
                      href={`/notice/${notice._id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-xs font-medium hover:underline"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      দেখুন
                    </a>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleDelete(notice._id)}
                      disabled={deletingId === notice._id}
                      className="text-red-400 hover:text-red-600 p-1 rounded hover:bg-red-50 transition-colors disabled:opacity-40"
                      title="মুছুন"
                    >
                      {deletingId === notice._id ? (
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      )}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}