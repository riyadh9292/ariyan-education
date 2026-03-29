import { connectDB } from "@/lib/mongodb"

interface Video {
  id: string
  filename: string
  caption: string
  mimeType: string
  size: number
  uploadedAt: string
}

async function getVideos(): Promise<Video[]> {
  try {
    const { db } = await connectDB()
    const doc = await db.collection("site_pages").findOne({ key: "academic-videos" })
    return Array.isArray(doc?.value?.videos) ? doc.value.videos : []
  } catch {
    return []
  }
}

function formatBytes(bytes: number) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("bn-BD", {
    year: "numeric", month: "long", day: "numeric",
  })
}

export default async function VideoGallery() {
  const videos = await getVideos()

  if (videos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-gray-300">
        <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
            d="M15 10l4.553-2.069A1 1 0 0121 8.87v6.26a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
        <p className="text-lg font-medium text-gray-400">এখনো কোনো ভিডিও যুক্ত করা হয়নি।</p>
      </div>
    )
  }

  return (
    <>
      <style>{`
        .video-card { transition: transform 0.25s ease, box-shadow 0.25s ease; }
        .video-card:hover { transform: translateY(-4px); box-shadow: 0 20px 40px -12px rgba(0,0,0,0.15); }
        .video-card video::-webkit-media-controls { border-radius: 0 0 12px 12px; }
        .video-badge {
          background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
        }
      `}</style>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video, i) => (
          <div
            key={video.id}
            className="video-card group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            {/* Video player */}
            <div className="relative bg-black aspect-video">
              <video
                src={`/api/videos/${video.id}`}
                controls
                preload="metadata"
                className="w-full h-full object-contain"
                controlsList="nodownload"
              />
            </div>

            {/* Card footer */}
            <div className="p-4">
              {/* Caption / filename */}
              <h3 className="text-sm font-semibold text-gray-800 leading-snug line-clamp-2 mb-2">
                {video.caption || video.filename}
              </h3>

              {/* Meta row */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                  <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{formatDate(video.uploadedAt)}</span>
                </div>

                <span className="video-badge text-white text-[10px] font-medium px-2 py-0.5 rounded-full tracking-wide">
                  {formatBytes(video.size)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <p className="text-center text-xs text-gray-400 mt-8">মোট {videos.length}টি ভিডিও</p>
    </>
  )
}