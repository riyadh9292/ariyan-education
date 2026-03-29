"use client"
import { useEffect, useState } from "react"

interface Photo {
  id      : string
  url     : string
  caption : string
}

export default function PhotoGallery() {
  const [photos,  setPhotos]  = useState<Photo[]>([])
  const [loading, setLoading] = useState(true)
  const [preview, setPreview] = useState<Photo | null>(null)

  useEffect(() => {
    fetch("/api/photos")
      .then(r => r.json())
      .then(data => setPhotos(Array.isArray(data) ? data : []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-2">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="aspect-square rounded-xl bg-gray-100 animate-pulse" />
        ))}
      </div>
    )
  }

  if (photos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-400">
        <svg className="w-14 h-14 mb-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <p className="text-lg font-medium">কোনো ছবি যুক্ত করা হয়নি।</p>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-2">
        {photos.map((photo) => (
          <div
            key={photo.id}
            onClick={() => setPreview(photo)}
            className="group relative aspect-square rounded-xl overflow-hidden cursor-pointer bg-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
          >
            <img
              src={photo.url}
              alt={photo.caption}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {photo.caption && (
              <div className="absolute inset-x-0 bottom-0 px-3 py-2 text-xs text-white font-medium truncate opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                style={{ background: "linear-gradient(to top, rgba(0,0,0,0.7), transparent)" }}>
                {photo.caption}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {preview && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.85)" }}
          onClick={() => setPreview(null)}
        >
          <div className="relative max-w-4xl w-full" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setPreview(null)}
              className="absolute -top-10 right-0 text-white/70 hover:text-white text-sm flex items-center gap-1"
            >
              ✕ বন্ধ করুন
            </button>
            <img
              src={preview.url}
              alt={preview.caption}
              className="w-full max-h-[80vh] object-contain rounded-xl"
            />
            {preview.caption && (
              <p className="text-center text-white/70 text-sm mt-3">{preview.caption}</p>
            )}
          </div>
        </div>
      )}
    </>
  )
}