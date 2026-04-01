"use client"
import { useEffect, useState } from "react"
import PageWrapper from "@/components/PageWrapper"

interface Photo {
  id     : string
  url    : string
  caption: string
}

const galleryIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
    stroke="#f0c040" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2"/>
    <circle cx="8.5" cy="8.5" r="1.5"/>
    <polyline points="21 15 16 10 5 21"/>
  </svg>
)

export default function PhotoGallery() {
  const [photos,  setPhotos]  = useState<Photo[]>([])
  const [loading, setLoading] = useState(true)
  const [preview, setPreview] = useState<Photo | null>(null)
  const [previewIndex, setPreviewIndex] = useState<number>(0)

  useEffect(() => {
    fetch("/api/photos")
      .then(r => r.json())
      .then(data => setPhotos(Array.isArray(data) ? data : []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const openPreview = (photo: Photo, index: number) => {
    setPreview(photo)
    setPreviewIndex(index)
  }

  const goPrev = (e: React.MouseEvent) => {
    e.stopPropagation()
    const newIndex = (previewIndex - 1 + photos.length) % photos.length
    setPreview(photos[newIndex])
    setPreviewIndex(newIndex)
  }

  const goNext = (e: React.MouseEvent) => {
    e.stopPropagation()
    const newIndex = (previewIndex + 1) % photos.length
    setPreview(photos[newIndex])
    setPreviewIndex(newIndex)
  }

  return (
    <>
      <PageWrapper
        title="ফটো গ্যালারী"
        subtitle={loading ? "" : `মোট ${photos.length}টি ছবি`}
        icon={galleryIcon}
      >
        <div className="-mx-5 -mb-6 -mt-1">

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 p-5">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="aspect-square rounded-2xl animate-pulse"
                  style={{ background: "linear-gradient(145deg, #0f1b2d, #1e3a5f)", opacity: 1 - i * 0.07 }}
                >
                  <div className="h-1 w-full rounded-t-2xl"
                    style={{ background: "linear-gradient(90deg, #c9a84c, #f0c040, #c9a84c)" }} />
                </div>
              ))}
            </div>

          ) : photos.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <svg className="w-14 h-14 mb-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
              <p className="text-lg font-medium">কোনো ছবি যুক্ত করা হয়নি।</p>
            </div>

          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 p-5">
              {photos.map((photo, i) => (
                <div
                  key={photo.id}
                  onClick={() => openPreview(photo, i)}
                  className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer"
                  style={{
                    boxShadow: "0 4px 15px rgba(15,27,45,0.2)",
                  }}
                >
                  {/* Gold top line — matches site design */}
                  <div className="absolute top-0 inset-x-0 h-0.5 z-10"
                    style={{ background: "linear-gradient(90deg, #c9a84c, #f0c040, #c9a84c)" }} />

                  {/* Image */}
                  <img
                    src={photo.url}
                    alt={photo.caption}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />

                  {/* Dark overlay on hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: "linear-gradient(145deg, rgba(15,27,45,0.6) 0%, rgba(30,58,95,0.5) 100%)" }} />

                  {/* Index badge */}
                  <div className="absolute top-2.5 left-2.5 z-10 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    style={{ background: "linear-gradient(135deg, #c9a84c, #f0c040)", color: "#7a4a00" }}>
                    {i + 1}
                  </div>

                  {/* Caption + zoom icon */}
                  <div className="absolute inset-x-0 bottom-0 p-3 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-1 group-hover:translate-y-0">
                    <div className="flex items-end justify-between gap-2">
                      {photo.caption && (
                        <p className="text-xs text-white font-medium leading-snug line-clamp-2 flex-1">
                          {photo.caption}
                        </p>
                      )}
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ background: "rgba(201,168,76,0.9)" }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0f1b2d" strokeWidth="2.5" strokeLinecap="round">
                          <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </PageWrapper>

      {/* ── Lightbox — improved with prev/next ─────────────────── */}
      {preview && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          style={{ background: "rgba(10,16,28,0.95)", backdropFilter: "blur(8px)" }}
          onClick={() => setPreview(null)}
        >
          {/* Close */}
          <button
            onClick={() => setPreview(null)}
            className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center text-white/70 hover:text-white transition-colors hover:bg-white/10"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>

          {/* Counter */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 text-xs font-semibold px-3 py-1.5 rounded-full"
            style={{ background: "rgba(201,168,76,0.2)", color: "#f0c040", border: "1px solid rgba(201,168,76,0.3)" }}>
            {previewIndex + 1} / {photos.length}
          </div>

          {/* Prev */}
          {photos.length > 1 && (
            <button
              onClick={goPrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full flex items-center justify-center text-white transition-all hover:scale-110"
              style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)" }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M15 18l-6-6 6-6"/>
              </svg>
            </button>
          )}

          {/* Image */}
          <div className="relative max-w-5xl w-full px-16" onClick={e => e.stopPropagation()}>
            {/* Gold top line on image */}
            <div className="h-0.5 w-full rounded-t-2xl"
              style={{ background: "linear-gradient(90deg, #c9a84c, #f0c040, #c9a84c)" }} />
            <img
              src={preview.url}
              alt={preview.caption}
              className="w-full max-h-[80vh] object-contain rounded-b-2xl"
              style={{ boxShadow: "0 25px 60px rgba(0,0,0,0.5)" }}
            />
            {preview.caption && (
              <div className="mt-3 text-center">
                <span className="text-sm px-4 py-1.5 rounded-full inline-block"
                  style={{ color: "rgba(255,255,255,0.7)", background: "rgba(255,255,255,0.08)" }}>
                  {preview.caption}
                </span>
              </div>
            )}
          </div>

          {/* Next */}
          {photos.length > 1 && (
            <button
              onClick={goNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full flex items-center justify-center text-white transition-all hover:scale-110"
              style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)" }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </button>
          )}
        </div>
      )}
    </>
  )
}