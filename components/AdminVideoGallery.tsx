/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { useEffect, useRef, useState } from "react"

interface Video {
  id: string
  filename: string
  caption: string
  mimeType: string
  size: number
  uploadedAt: string
}

function formatBytes(bytes: number) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function AdminVideoGallery() {
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [caption, setCaption] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null)
  const fileRef = useRef<HTMLInputElement | null>(null)

  const fetchVideos = () => {
    setLoading(true)
    fetch("/api/admin/videos")
      .then((r) => r.json())
      .then(setVideos)
      .catch(() => setVideos([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchVideos() }, [])

  const showMsg = (text: string, type: "success" | "error") => {
    setMessage({ text, type })
    setTimeout(() => setMessage(null), 3500)
  }

  const handleUpload = async () => {
    if (!file) return showMsg("ভিডিও ফাইল বেছে নিন।", "error")
    setUploading(true)
    setUploadProgress(0)

    const formData = new FormData()
    formData.append("video", file)
    formData.append("caption", caption)

    try {
      // Use XMLHttpRequest for upload progress
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.open("POST", "/api/admin/videos")
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) setUploadProgress(Math.round((e.loaded / e.total) * 100))
        }
        xhr.onload = () => {
          const data = JSON.parse(xhr.responseText)
          if (xhr.status >= 200 && xhr.status < 300) {
            showMsg(data.message, "success")
            setFile(null)
            setCaption("")
            if (fileRef.current) fileRef.current.value = ""
            fetchVideos()
            resolve()
          } else {
            reject(new Error(data.error))
          }
        }
        xhr.onerror = () => reject(new Error("নেটওয়ার্ক সমস্যা হয়েছে।"))
        xhr.send(formData)
      })
    } catch (e: any) {
      showMsg(e.message ?? "আপলোড ব্যর্থ হয়েছে।", "error")
    } finally {
      setUploading(false)
      setUploadProgress(0)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("এই ভিডিওটি মুছে ফেলবেন?")) return
    setDeletingId(id)
    try {
      const res = await fetch(`/api/admin/videos?id=${id}`, { method: "DELETE" })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      showMsg(data.message, "success")
      setVideos((prev) => prev.filter((v) => v.id !== id))
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
        <h3 className="text-sm font-semibold text-gray-700 mb-4">নতুন ভিডিও আপলোড</h3>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3 flex-wrap">
            <input type="file" accept="video/*" ref={fileRef} onChange={(e) => setFile(e.target.files?.[0] ?? null)} className="hidden" />
            <button
              onClick={() => fileRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-sm text-gray-600 hover:bg-white transition-colors bg-white"
            >
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.069A1 1 0 0121 8.87v6.26a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              {file ? `${file.name} (${formatBytes(file.size)})` : "ভিডিও বেছে নিন"}
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
              {uploading ? `আপলোড হচ্ছে... ${uploadProgress}%` : "আপলোড"}
            </button>
          </div>

          {/* Progress bar */}
          {uploading && (
            <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          )}

          {message && (
            <p className={`text-sm font-medium ${message.type === "success" ? "text-green-600" : "text-red-600"}`}>
              {message.text}
            </p>
          )}
        </div>
      </div>

      {/* Video list */}
      {loading ? (
        <div className="text-center py-10 text-gray-400 text-sm">লোড হচ্ছে...</div>
      ) : videos.length === 0 ? (
        <div className="text-center py-10 text-gray-400 text-sm border border-dashed border-gray-200 rounded-xl">
          কোনো ভিডিও নেই।
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {videos.map((video) => (
            <div key={video.id} className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl bg-white hover:bg-gray-50 transition-colors">
              {/* Thumbnail placeholder */}
              <div className="w-24 h-16 rounded-lg bg-gray-100 flex items-center justify-center shrink-0 overflow-hidden border border-gray-200">
                <video
                  src={`/api/videos/${video.id}`}
                  className="w-full h-full object-cover"
                  preload="metadata"
                  muted
                />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">{video.caption || video.filename}</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {formatBytes(video.size)} · {new Date(video.uploadedAt).toLocaleDateString("bn-BD", { year: "numeric", month: "short", day: "numeric" })}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={`/api/videos/${video.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                  title="দেখুন"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </a>

                <button
                  onClick={() => handleDelete(video.id)}
                  disabled={deletingId === video.id}
                  className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-40"
                  title="মুছুন"
                >
                  {deletingId === video.id ? (
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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