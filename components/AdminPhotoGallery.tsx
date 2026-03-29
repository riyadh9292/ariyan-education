/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { useEffect, useRef, useState } from "react"
import Image from "next/image"

interface Photo {
  id: string
  url: string
  caption: string
  uploadedAt: string
}

export default function AdminPhotoGallery() {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [caption, setCaption] = useState("")
  const [preview, setPreview] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null)
  const fileRef = useRef<HTMLInputElement | null>(null)

  const fetchPhotos = () => {
    setLoading(true)
    fetch("/api/admin/photos")
      .then((r) => r.json())
      .then(setPhotos)
      .catch(() => setPhotos([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchPhotos() }, [])

  const showMsg = (text: string, type: "success" | "error") => {
    setMessage({ text, type })
    setTimeout(() => setMessage(null), 3500)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null
    setFile(f)
    if (f) setPreview(URL.createObjectURL(f))
    else setPreview(null)
  }

  const handleUpload = async () => {
    if (!file) return showMsg("ছবি বেছে নিন।", "error")
    setUploading(true)
    const formData = new FormData()
    formData.append("image", file)
    formData.append("caption", caption)
    try {
      const res = await fetch("/api/admin/photos", { method: "POST", body: formData })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      showMsg(data.message, "success")
      setFile(null)
      setCaption("")
      setPreview(null)
      if (fileRef.current) fileRef.current.value = ""
      fetchPhotos()
    } catch (e: any) {
      showMsg(e.message ?? "আপলোড ব্যর্থ হয়েছে।", "error")
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("এই ছবিটি মুছে ফেলবেন?")) return
    setDeletingId(id)
    try {
      const res = await fetch(`/api/admin/photos?id=${id}`, { method: "DELETE" })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      showMsg(data.message, "success")
      setPhotos((prev) => prev.filter((p) => p.id !== id))
    } catch (e: any) {
      showMsg(e.message ?? "মুছতে ব্যর্থ হয়েছে।", "error")
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="mb-6">
      {/* Upload form */}
      <div className="border border-gray-200 rounded-xl p-5 mb-6 bg-gray-50">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">নতুন ছবি আপলোড</h3>
        <div className="flex flex-col gap-3">
          {/* Preview */}
          {preview && (
            <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-gray-200">
              <Image src={preview} alt="preview" fill className="object-cover" sizes="128px" />
            </div>
          )}

          <div className="flex items-center gap-3 flex-wrap">
            <input type="file" accept="image/*" ref={fileRef} onChange={handleFileChange} className="hidden" />
            <button
              onClick={() => fileRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-sm text-gray-600 hover:bg-white transition-colors bg-white"
            >
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {file ? file.name : "ছবি বেছে নিন"}
            </button>

            <input
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="ক্যাপশন (ঐচ্ছিক)"
              className="flex-1 min-w-[160px] border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
            />

            <button
              onClick={handleUpload}
              disabled={uploading}
              className="flex items-center gap-2 px-5 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {uploading ? (
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
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

      {/* Photo grid */}
      {loading ? (
        <div className="text-center py-10 text-gray-400 text-sm">লোড হচ্ছে...</div>
      ) : photos.length === 0 ? (
        <div className="text-center py-10 text-gray-400 text-sm border border-dashed border-gray-200 rounded-xl">
          কোনো ছবি নেই।
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {photos.map((photo) => (
            <div key={photo.id} className="relative group rounded-xl overflow-hidden border border-gray-200 bg-gray-50 aspect-square">
              <Image src={photo.url} alt={photo.caption || "ছবি"} fill className="object-cover" sizes="200px" />
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                {photo.caption && (
                  <p className="text-white text-xs leading-snug line-clamp-2">{photo.caption}</p>
                )}
                <button
                  onClick={() => handleDelete(photo.id)}
                  disabled={deletingId === photo.id}
                  className="self-end p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors disabled:opacity-50"
                  title="মুছুন"
                >
                  {deletingId === photo.id ? (
                    <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                  ) : (
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
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