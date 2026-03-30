/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { useEffect, useRef, useState } from "react"
import Image from "next/image"

interface BannerImage {
  id: string
  url: string
  caption: string
  createdAt: string
}

export default function AdminBannerUpload() {
  const [images, setImages] = useState<BannerImage[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [caption, setCaption] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null)
  const fileRef = useRef<HTMLInputElement | null>(null)

  const fetchImages = () => {
    setLoading(true)
    fetch("/api/banner")
      .then((r) => r.json())
      .then((data) => setImages(Array.isArray(data) ? data : []))
      .catch(() => setImages([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchImages() }, [])

  const showMsg = (text: string, type: "success" | "error") => {
    setMessage({ text, type })
    setTimeout(() => setMessage(null), 3500)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null
    setFile(f)
    setPreview(f ? URL.createObjectURL(f) : null)
  }

  const handleUpload = async () => {
    if (!file) return showMsg("ছবি বেছে নিন।", "error")
    setUploading(true)
    const formData = new FormData()
    formData.append("file", file)
    formData.append("caption", caption)
    try {
      const res = await fetch("/api/banner", { method: "POST", body: formData })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      showMsg("ব্যানার ছবি আপলোড সম্পন্ন হয়েছে ✓", "success")
      setFile(null)
      setCaption("")
      setPreview(null)
      if (fileRef.current) fileRef.current.value = ""
      fetchImages()
    } catch (e: any) {
      showMsg(e.message ?? "আপলোড ব্যর্থ হয়েছে।", "error")
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("এই ব্যানার ছবিটি মুছে ফেলবেন?")) return
    setDeletingId(id)
    try {
      const res = await fetch("/api/banner", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      showMsg("ছবি মুছে ফেলা হয়েছে।", "success")
      setImages((prev) => prev.filter((img) => img.id !== id))
    } catch (e: any) {
      showMsg(e.message ?? "মুছতে ব্যর্থ হয়েছে।", "error")
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-lg bg-indigo-100 flex items-center justify-center shrink-0">
          <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-800">ব্যানার ছবি</h2>
          <p className="text-xs text-gray-400">হোমপেজে প্রদর্শিত স্লাইডার ছবি পরিচালনা করুন</p>
        </div>
      </div>

      {/* Upload card */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-6 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          নতুন ব্যানার যুক্ত করুন
        </h3>

        <div className="flex flex-col gap-4">
          {/* Drop zone / preview */}
          <div
            onClick={() => fileRef.current?.click()}
            className={`relative cursor-pointer rounded-xl border-2 border-dashed transition-colors overflow-hidden
              ${preview ? "border-indigo-300 bg-indigo-50/40" : "border-gray-200 bg-gray-50 hover:border-indigo-300 hover:bg-indigo-50/30"}`}
            style={{ minHeight: "160px" }}
          >
            {preview ? (
              <div className="relative w-full h-48">
                <Image src={preview} alt="preview" fill className="object-cover rounded-xl" sizes="800px" />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded-xl">
                  <span className="text-white text-sm font-medium bg-black/50 px-3 py-1 rounded-lg">ছবি পরিবর্তন করুন</span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 gap-2 text-gray-400">
                <svg className="w-10 h-10 mb-1 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-sm font-medium text-gray-500">ক্লিক করে ছবি বেছে নিন</p>
                <p className="text-xs text-gray-400">JPG, PNG, WEBP (প্রস্তাবিত: ১৬:৯ অনুপাত)</p>
              </div>
            )}
          </div>
          <input type="file" accept="image/*" ref={fileRef} onChange={handleFileChange} className="hidden" />

          {/* Caption + upload button row */}
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="ক্যাপশন (ঐচ্ছিক)"
              className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
            />
            <button
              onClick={handleUpload}
              disabled={uploading || !file}
              className="flex items-center gap-2 px-5 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium
                hover:bg-indigo-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
            >
              {uploading ? (
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
              )}
              {uploading ? "আপলোড হচ্ছে..." : "আপলোড"}
            </button>
          </div>

          {message && (
            <p className={`text-sm font-medium ${message.type === "success" ? "text-green-600" : "text-red-600"}`}>
              {message.text}
            </p>
          )}
        </div>
      </div>

      {/* Existing banners */}
      <h3 className="text-sm font-semibold text-gray-600 mb-3">
        বর্তমান ব্যানার {!loading && `(${images.length}টি)`}
      </h3>

      {loading ? (
        <div className="text-center py-12 text-gray-400 text-sm">লোড হচ্ছে...</div>
      ) : images.length === 0 ? (
        <div className="text-center py-12 text-gray-300 text-sm border-2 border-dashed border-gray-100 rounded-2xl">
          কোনো ব্যানার ছবি নেই।
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {images.map((img, i) => (
            <div
              key={img.id}
              className="group relative bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Index badge */}
              <div className="absolute top-2 left-2 z-10 bg-black/60 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                #{i + 1}
              </div>

              {/* Image */}
              <div className="relative w-full h-44 bg-gray-100">
                <Image src={img.url} alt={img.caption || `Banner ${i + 1}`} fill className="object-cover" sizes="400px" />
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between px-4 py-3 gap-2">
                <div className="min-w-0">
                  {img.caption ? (
                    <p className="text-sm font-medium text-gray-700 truncate">{img.caption}</p>
                  ) : (
                    <p className="text-sm text-gray-400 italic">ক্যাপশন নেই</p>
                  )}
                  <p className="text-xs text-gray-400 mt-0.5">
                    {new Date(img.createdAt).toLocaleDateString("bn-BD", {
                      year: "numeric", month: "short", day: "numeric",
                    })}
                  </p>
                </div>

                <button
                  onClick={() => handleDelete(img.id)}
                  disabled={deletingId === img.id}
                  className="shrink-0 p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-40"
                  title="মুছুন"
                >
                  {deletingId === img.id ? (
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}