"use client"
import { useEffect, useRef, useState } from "react"
import { Upload, Trash2, Eye, FileText, Loader2, CheckCircle, XCircle } from "lucide-react"

interface ResultRecord {
  _id         : string
  fileId      : string
  examName    : string
  examYear    : string
  examClass   : string
  originalName: string
  uploadedAt  : string
}

export default function AdminResultUpload() {
  const [examName,  setExamName]  = useState("")
  const [examYear,  setExamYear]  = useState(new Date().getFullYear().toString())
  const [examClass, setExamClass] = useState("")
  const [file,      setFile]      = useState<File | null>(null)
  const [dragging,  setDragging]  = useState(false)
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
      const res  = await fetch("/api/results")
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
    else flash("Only PDF files are allowed.", false)
  }

  const handleUpload = async () => {
    if (!file)      return flash("Please select a PDF file.", false)
    if (!examName)  return flash("Please enter exam name.", false)
    if (!examYear)  return flash("Please enter year.", false)
    if (!examClass) return flash("Please enter class.", false)

    setUploading(true)
    try {
      const fd = new FormData()
      fd.append("file",      file)
      fd.append("examName",  examName)
      fd.append("examYear",  examYear)
      fd.append("examClass", examClass)

      const res  = await fetch("/api/results", { method: "POST", body: fd })
      const data = await res.json()

      if (data.success) {
        flash("Result uploaded successfully! ✓", true)
        setFile(null)
        setExamName("")
        setExamClass("")
        if (fileInputRef.current) fileInputRef.current.value = ""
        fetchRecords()
      } else {
        flash(data.error || "Upload failed.", false)
      }
    } catch {
      flash("Network error. Try again.", false)
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (fileId: string) => {
    if (!confirm("Delete this result PDF permanently?")) return
    try {
      await fetch("/api/results", {
        method : "DELETE",
        headers: { "Content-Type": "application/json" },
        body   : JSON.stringify({ id: fileId }),
      })
      fetchRecords()
    } catch {
      flash("Delete failed.", false)
    }
  }

  return (
    <div className="space-y-8">

      {/* Upload form */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
          <h2 className="font-semibold text-gray-800">ফলাফল আপলোড করুন</h2>
          <p className="text-xs text-gray-500 mt-0.5">PDF ফাইল আপলোড করুন (সর্বোচ্চ 20MB)</p>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                পরীক্ষার নাম <span className="text-red-500">*</span>
              </label>
              <input
                className="border rounded-lg px-3 py-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="যেমন: বার্ষিক পরীক্ষা"
                value={examName}
                onChange={e => setExamName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                সাল <span className="text-red-500">*</span>
              </label>
              <input
                className="border rounded-lg px-3 py-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="২০২৬"
                value={examYear}
                onChange={e => setExamYear(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                কোর্সের নাম <span className="text-red-500">*</span>
              </label>
              <input
                className="border rounded-lg px-3 py-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="ম্যাটস ভর্তি পরীক্ষার ফলাফল"
                value={examClass}
                onChange={e => setExamClass(e.target.value)}
              />
            </div>
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
                <p className="text-xs">শুধুমাত্র PDF • সর্বোচ্চ 20MB</p>
              </div>
            )}
          </div>

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

      {/* Records table */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-gray-800">আপলোড করা ফলাফল</h2>
            <p className="text-xs text-gray-500 mt-0.5">মোট {records.length}টি ফলাফল</p>
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
            <p>এখনো কোনো ফলাফল আপলোড করা হয়নি।</p>
          </div>
        ) : (
          <div className=" w-75 sm:w-fit overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">পরীক্ষার নাম</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">কোর্সের নাম</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">সাল</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">তারিখ</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">ফাইল</th>
                  <th className="text-center px-4 py-3 font-semibold text-gray-600">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {records.map(r => (
                  <tr key={r._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-800">{r.examName}</td>
                    <td className="px-4 py-3 text-gray-600">{r.examClass}</td>
                    <td className="px-4 py-3 text-gray-600">{r.examYear}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      {new Date(r.uploadedAt).toLocaleDateString("bn-BD", {
                        year: "numeric", month: "long", day: "numeric"
                      })}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-400 max-w-[160px] truncate">
                      {r.originalName}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <a
                          href={`/api/results/${r.fileId}`}
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