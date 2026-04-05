"use client"
import { useEffect, useRef, useState } from "react"
import { Upload, Trash2, Eye, FileText, Loader2, CheckCircle, XCircle } from "lucide-react"

interface ResultRecord {
  _id         : string
  fileId      : string
  examName    : string
  originalName: string
  uploadedAt  : string
}

export default function AdminAdmissionResult() {
  const [examName, setExamName] = useState("")
  const [file,     setFile]     = useState<File | null>(null)
  const [dragging, setDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [uploading, setUploading] = useState(false)
  const [message,   setMessage]   = useState<{ text: string; ok: boolean } | null>(null)

  const [records,  setRecords]  = useState<ResultRecord[]>([])
  const [fetching, setFetching] = useState(true)

  const flash = (text: string, ok: boolean) => {
    setMessage({ text, ok })
    setTimeout(() => setMessage(null), 4000)
  }

  const fetchRecords = async () => {
    setFetching(true)
    try {
      const res  = await fetch("/api/admin/admission/result")
      const data = await res.json()
      setRecords(Array.isArray(data) ? data : [])
    } catch {
      setRecords([])
    } finally {
      setFetching(false)
    }
  }

  useEffect(() => { fetchRecords() }, [])

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const dropped = e.dataTransfer.files[0]
    if (dropped?.type === "application/pdf") setFile(dropped)
    else flash("শুধুমাত্র PDF ফাইল অনুমোদিত।", false)
  }

  const handleUpload = async () => {
    if (!examName) return flash("পরীক্ষার নাম লিখুন।", false)
    if (!file)     return flash("PDF ফাইল বেছে নিন।", false)

    setUploading(true)
    try {
      const fd = new FormData()
      fd.append("file",     file)
      fd.append("examName", examName)

      const res  = await fetch("/api/admin/admission/result", { method: "POST", body: fd })
      const data = await res.json()

      if (data.success) {
        flash(data.message ?? "ফলাফল আপলোড সম্পন্ন হয়েছে ✓", true)
        setFile(null)
        setExamName("")
        if (fileInputRef.current) fileInputRef.current.value = ""
        fetchRecords()
      } else {
        flash(data.error || "আপলোড ব্যর্থ হয়েছে।", false)
      }
    } catch {
      flash("নেটওয়ার্ক সমস্যা হয়েছে। আবার চেষ্টা করুন।", false)
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (fileId: string) => {
    if (!confirm("এই ফলাফলটি স্থায়ীভাবে মুছে ফেলবেন?")) return
    try {
      const res  = await fetch("/api/admin/admission/result", {
        method : "DELETE",
        headers: { "Content-Type": "application/json" },
        body   : JSON.stringify({ id: fileId }),
      })
      const data = await res.json()
      if (data.success) flash(data.message, true)
      else flash(data.error ?? "মুছতে ব্যর্থ হয়েছে।", false)
      fetchRecords()
    } catch {
      flash("মুছতে ব্যর্থ হয়েছে।", false)
    }
  }

  return (
    <div className="space-y-8">

      {/* ── Upload form ──────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
          <h2 className="font-semibold text-gray-800">ভর্তি পরীক্ষার ফলাফল আপলোড</h2>
          <p className="text-xs text-gray-500 mt-0.5">PDF ফাইল আপলোড করুন (সর্বোচ্চ ২০MB)</p>
        </div>

        <div className="p-6 space-y-4">
          {/* Exam name */}
          <div className="max-w-sm">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              পরীক্ষার নাম <span className="text-red-500">*</span>
            </label>
            <input
              className="border rounded-lg px-3 py-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="যেমন: ভর্তি পরীক্ষা ২০২৫"
              value={examName}
              onChange={e => setExamName(e.target.value)}
            />
          </div>

          {/* Drop zone */}
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={e => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors
              ${dragging
                ? "border-blue-400 bg-blue-50"
                : file
                  ? "border-green-400 bg-green-50"
                  : "border-gray-300 bg-gray-50 hover:border-blue-300 hover:bg-blue-50"
              }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={e => setFile(e.target.files?.[0] || null)}
            />
            {file ? (
              <div className="flex flex-col items-center gap-2">
                <FileText size={36} className="text-green-500" />
                <p className="font-medium text-green-700">{file.name}</p>
                <p className="text-xs text-gray-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                <button
                  type="button"
                  onClick={e => { e.stopPropagation(); setFile(null) }}
                  className="text-xs text-red-500 hover:underline mt-1"
                >
                  সরিয়ে দিন
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 text-gray-400">
                <Upload size={36} />
                <p className="font-medium">PDF ফাইল টেনে আনুন অথবা ক্লিক করুন</p>
                <p className="text-xs">শুধুমাত্র PDF • সর্বোচ্চ ২০MB</p>
              </div>
            )}
          </div>

          {/* Feedback */}
          {message && (
            <div className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium
              ${message.ok
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-red-50 text-red-700 border border-red-200"
              }`}
            >
              {message.ok ? <CheckCircle size={16} /> : <XCircle size={16} />}
              {message.text}
            </div>
          )}

          <button
            onClick={handleUpload}
            disabled={uploading}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-lg
              hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading
              ? <><Loader2 size={16} className="animate-spin" /> আপলোড হচ্ছে...</>
              : <><Upload size={16} /> আপলোড করুন</>
            }
          </button>
        </div>
      </div>

      {/* ── Records table ─────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-gray-800">আপলোড করা ফলাফল</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              মোট {records.length.toLocaleString("bn-BD")}টি ফলাফল
            </p>
          </div>
          <button onClick={fetchRecords} className="text-xs text-blue-600 hover:underline">
            রিফ্রেশ
          </button>
        </div>

        {fetching ? (
          <div className="flex items-center justify-center py-12 text-gray-400 gap-2">
            <Loader2 size={20} className="animate-spin" /> লোড হচ্ছে...
          </div>
        ) : records.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <FileText size={40} className="mx-auto mb-2 opacity-30" />
            <p>এখনো কোনো প্রশ্নপত্র আপলোড করা হয়নি।</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">পরীক্ষার নাম</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">আপলোডের তারিখ</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">ফাইল</th>
                  <th className="text-center px-4 py-3 font-semibold text-gray-600">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {records.map(r => (
                  <tr key={r._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-800">{r.examName}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      {new Date(r.uploadedAt).toLocaleDateString("bn-BD", {
                        year: "numeric", month: "long", day: "numeric",
                      })}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-400 max-w-[160px] truncate">
                      {r.originalName}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <a
                          href={`/api/admission/${r.fileId}`}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg
                            bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors font-medium"
                        >
                          <Eye size={13} /> দেখুন
                        </a>
                        <button
                          onClick={() => handleDelete(r.fileId)}
                          className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg
                            bg-red-50 text-red-600 hover:bg-red-100 transition-colors font-medium"
                        >
                          <Trash2 size={13} /> মুছুন
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}