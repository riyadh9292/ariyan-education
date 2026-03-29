import { connectDB } from "@/lib/mongodb"
import Image from "next/image"

interface Photo {
  id: string
  url: string
  caption: string
  uploadedAt: string
}

async function getPhotos(): Promise<Photo[]> {
  try {
    const { db } = await connectDB()
    const doc = await db.collection("site_pages").findOne({ key: "academic-photos" })
    return Array.isArray(doc?.value?.photos) ? doc.value.photos : []
  } catch {
    return []
  }
}

export default async function PhotoGallery() {
  const photos = await getPhotos()

  if (photos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-gray-300">
        <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <p className="text-lg font-medium text-gray-400">এখনো কোনো ছবি যুক্ত করা হয়নি।</p>
      </div>
    )
  }

  return (
    <>
      <style>{`
        .gallery-item { break-inside: avoid; }
        .lightbox-input { display: none; }
        .lightbox-input:checked ~ .lightbox-overlay { opacity: 1; pointer-events: all; }
        .lightbox-input:checked ~ .lightbox-overlay .lightbox-content { transform: scale(1); opacity: 1; }
        .lightbox-overlay {
          position: fixed; inset: 0; z-index: 9999;
          background: rgba(0,0,0,0.93);
          display: flex; align-items: center; justify-content: center;
          opacity: 0; pointer-events: none;
          transition: opacity 0.3s ease;
        }
        .lightbox-content {
          position: relative; max-width: 90vw; max-height: 90vh;
          transform: scale(0.92); opacity: 0;
          transition: transform 0.3s ease, opacity 0.3s ease;
        }
        .lightbox-close {
          position: absolute; top: -44px; right: 0;
          color: white; font-size: 28px; cursor: pointer;
          width: 36px; height: 36px; display: flex; align-items: center; justify-content: center;
          border-radius: 50%; transition: background 0.2s;
        }
        .lightbox-close:hover { background: rgba(255,255,255,0.15); }
        .gallery-trigger { cursor: zoom-in; }
        .gallery-card:hover .gallery-overlay { opacity: 1; }
        .gallery-card:hover img { transform: scale(1.05); }
      `}</style>

      <div className="columns-2 sm:columns-3 lg:columns-4 gap-3 space-y-3">
        {photos.map((photo, i) => {
          const inputId = `lb-${photo.id}`
          return (
            <div key={photo.id} className="gallery-item">
              {/* Hidden checkbox for lightbox toggle */}
              <input type="checkbox" id={inputId} className="lightbox-input" />

              {/* Lightbox overlay */}
              <div className="lightbox-overlay">
                <label htmlFor={inputId} className="absolute inset-0 cursor-zoom-out" />
                <div className="lightbox-content">
                  <label htmlFor={inputId} className="lightbox-close">✕</label>
                  <div className="relative w-[80vw] max-w-4xl" style={{ maxHeight: "80vh" }}>
                    <img
                      src={photo.url}
                      alt={photo.caption || `ছবি ${i + 1}`}
                      className="rounded-xl shadow-2xl max-h-[80vh] w-auto mx-auto object-contain"
                    />
                    {photo.caption && (
                      <p className="text-center text-white/80 text-sm mt-3 px-4">{photo.caption}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Gallery card */}
              <label
                htmlFor={inputId}
                className="gallery-card gallery-trigger block relative rounded-xl overflow-hidden bg-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300"
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <div className="overflow-hidden">
                  <img
                    src={photo.url}
                    alt={photo.caption || `ছবি ${i + 1}`}
                    className="w-full h-auto object-cover transition-transform duration-500"
                    loading="lazy"
                  />
                </div>

                {/* Hover overlay */}
                <div className="gallery-overlay absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 flex items-end p-3">
                  {photo.caption ? (
                    <p className="text-white text-xs leading-snug line-clamp-2">{photo.caption}</p>
                  ) : (
                    <div className="ml-auto">
                      <svg className="w-5 h-5 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                      </svg>
                    </div>
                  )}
                </div>
              </label>
            </div>
          )
        })}
      </div>

      <p className="text-center text-xs text-gray-400 mt-8">মোট {photos.length}টি ছবি</p>
    </>
  )
}