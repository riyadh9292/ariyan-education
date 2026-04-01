"use client"
import { useEffect, useState } from "react"
import PageWrapper from "@/components/PageWrapper"

interface Video {
  id       : string
  url      : string
  title    : string
  thumbnail: string
}

const videoIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
    stroke="#f0c040" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 10l4.553-2.276A1 1 0 0121 8.723v6.554a1 1 0 01-1.447.894L15 14"/>
    <rect x="2" y="6" width="13" height="12" rx="2"/>
  </svg>
)

function getYouTubeId(url: string): string | null {
  const match = url?.match(
    /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/
  )
  return match ? match[1] : null
}

function getThumbnail(video: Video): string {
  if (video.thumbnail) return video.thumbnail
  const ytId = getYouTubeId(video.url)
  return ytId ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` : ""
}

export default function VideoGallery() {
  const [videos,       setVideos]       = useState<Video[]>([])
  const [loading,      setLoading]      = useState(true)
  const [playing,      setPlaying]      = useState<Video | null>(null)
  const [playingIndex, setPlayingIndex] = useState(0)

  useEffect(() => {
    fetch("/api/videos")
      .then(r => r.json())
      .then(data => setVideos(Array.isArray(data) ? data : []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const openVideo = (video: Video, index: number) => {
    setPlaying(video)
    setPlayingIndex(index)
  }

  const goPrev = (e: React.MouseEvent) => {
    e.stopPropagation()
    const i = (playingIndex - 1 + videos.length) % videos.length
    setPlaying(videos[i])
    setPlayingIndex(i)
  }

  const goNext = (e: React.MouseEvent) => {
    e.stopPropagation()
    const i = (playingIndex + 1) % videos.length
    setPlaying(videos[i])
    setPlayingIndex(i)
  }

  return (
    <>
      <PageWrapper
        title="ভিডিও গ্যালারী"
        subtitle={loading ? "" : `মোট ${videos.length}টি ভিডিও`}
        icon={videoIcon}
      >
        <div className="-mx-5 -mb-6 -mt-1">

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-5">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="rounded-2xl overflow-hidden animate-pulse" style={{ opacity: 1 - i * 0.07 }}>
                  <div className="aspect-video" style={{ background: "linear-gradient(145deg, #0f1b2d, #1e3a5f)" }}>
                    <div className="h-0.5 w-full" style={{ background: "linear-gradient(90deg, #c9a84c, #f0c040, #c9a84c)" }} />
                  </div>
                  <div className="p-3 space-y-2" style={{ background: "rgba(15,27,45,0.06)" }}>
                    <div className="h-3 rounded w-3/4 bg-gray-200" />
                  </div>
                </div>
              ))}
            </div>

          ) : videos.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <svg className="w-14 h-14 mb-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M15 10l4.553-2.276A1 1 0 0121 8.723v6.554a1 1 0 01-1.447.894L15 14M4 6h8a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2z"/>
              </svg>
              <p className="text-lg font-medium">কোনো ভিডিও যুক্ত করা হয়নি।</p>
            </div>

          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-5">
              {videos.map((video, i) => (
                <div
                  key={video.id}
                  onClick={() => openVideo(video, i)}
                  className="group relative rounded-2xl overflow-hidden cursor-pointer"
                  style={{ boxShadow: "0 4px 15px rgba(15,27,45,0.2)" }}
                >
                  {/* Gold top accent */}
                  <div className="absolute top-0 inset-x-0 h-0.5 z-10"
                    style={{ background: "linear-gradient(90deg, #c9a84c, #f0c040, #c9a84c)" }} />

                  {/* Thumbnail */}
                  <div className="relative aspect-video overflow-hidden bg-gray-900">
                    {getThumbnail(video) ? (
                      <img
                        src={getThumbnail(video)}
                        alt={video.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center"
                        style={{ background: "linear-gradient(145deg, #0f1b2d, #1e3a5f)" }}>
                        <svg className="w-12 h-12 opacity-30" fill="none" stroke="#f0c040" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                            d="M15 10l4.553-2.276A1 1 0 0121 8.723v6.554a1 1 0 01-1.447.894L15 14M4 6h8a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2z"/>
                        </svg>
                      </div>
                    )}

                    {/* Hover overlay */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{ background: "linear-gradient(145deg, rgba(15,27,45,0.55) 0%, rgba(30,58,95,0.45) 100%)" }} />

                    {/* Play button */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div
                        className="w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 group-hover:scale-110"
                        style={{
                          background: "rgba(255,255,255,0.15)",
                          border: "2px solid rgba(240,192,64,0.6)",
                          backdropFilter: "blur(4px)",
                        }}
                      >
                        <svg className="w-6 h-6 ml-1" fill="#f0c040" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      </div>
                    </div>

                    {/* Index badge */}
                    <div
                      className="absolute top-2.5 left-2.5 z-10 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      style={{ background: "linear-gradient(135deg, #c9a84c, #f0c040)", color: "#7a4a00" }}
                    >
                      {i + 1}
                    </div>

                    {/* YouTube badge */}
                    {getYouTubeId(video.url) && (
                      <div
                        className="absolute top-2.5 right-2.5 z-10 flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold"
                        style={{ background: "#FF0000", color: "white" }}
                      >
                        <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.54 3.5 12 3.5 12 3.5s-7.54 0-9.38.55A3.02 3.02 0 0 0 .5 6.19 31.6 31.6 0 0 0 0 12a31.6 31.6 0 0 0 .5 5.81 3.02 3.02 0 0 0 2.12 2.14C4.46 20.5 12 20.5 12 20.5s7.54 0 9.38-.55a3.02 3.02 0 0 0 2.12-2.14A31.6 31.6 0 0 0 24 12a31.6 31.6 0 0 0-.5-5.81zM9.75 15.02V8.98L15.5 12l-5.75 3.02z"/>
                        </svg>
                        YouTube
                      </div>
                    )}
                  </div>

                  {/* Title bar */}
                  {video.title && (
                    <div
                      className="px-4 py-3 flex items-center justify-between gap-2"
                      style={{ background: "linear-gradient(145deg, #0f1b2d, #1e3a5f)" }}
                    >
                      <p className="text-sm font-semibold text-white/90 line-clamp-1 flex-1 leading-snug">
                        {video.title}
                      </p>
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                        style={{ background: "rgba(201,168,76,0.2)", border: "1px solid rgba(201,168,76,0.3)" }}
                      >
                        <svg width="10" height="10" fill="#f0c040" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

        </div>
      </PageWrapper>

      {/* ── Video player modal ───────────────────────────────────── */}
      {playing && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          style={{ background: "rgba(10,16,28,0.96)", backdropFilter: "blur(8px)" }}
          onClick={() => setPlaying(null)}
        >
          {/* Close */}
          <button
            onClick={() => setPlaying(null)}
            className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center text-white/70 hover:text-white transition-colors hover:bg-white/10"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>

          {/* Counter */}
          <div
            className="absolute top-4 left-1/2 -translate-x-1/2 text-xs font-semibold px-3 py-1.5 rounded-full"
            style={{ background: "rgba(201,168,76,0.2)", color: "#f0c040", border: "1px solid rgba(201,168,76,0.3)" }}
          >
            {playingIndex + 1} / {videos.length}
          </div>

          {/* Prev */}
          {videos.length > 1 && (
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

          {/* Player */}
          <div className="relative w-full max-w-5xl px-16" onClick={e => e.stopPropagation()}>
            <div className="h-0.5 w-full rounded-t-2xl"
              style={{ background: "linear-gradient(90deg, #c9a84c, #f0c040, #c9a84c)" }} />
            <div className="aspect-video rounded-b-2xl overflow-hidden"
              style={{ boxShadow: "0 25px 60px rgba(0,0,0,0.6)" }}>
              {getYouTubeId(playing.url) ? (
                <iframe
                  key={playing.id}
                  src={`https://www.youtube.com/embed/${getYouTubeId(playing.url)}?autoplay=1&rel=0`}
                  className="w-full h-full"
                  allow="autoplay; encrypted-media; fullscreen"
                  allowFullScreen
                />
              ) : (
                <video key={playing.id} src={playing.url} controls autoPlay className="w-full h-full bg-black" />
              )}
            </div>
            {playing.title && (
              <div className="mt-4 text-center">
                <span
                  className="text-sm px-4 py-1.5 rounded-full inline-block"
                  style={{ color: "rgba(255,255,255,0.75)", background: "rgba(255,255,255,0.07)" }}
                >
                  {playing.title}
                </span>
              </div>
            )}
          </div>

          {/* Next */}
          {videos.length > 1 && (
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