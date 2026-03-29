"use client"
import { useEffect, useState } from "react"

interface Video {
  id       : string
  url      : string
  title    : string
  thumbnail: string
}

function getYouTubeId(url: string): string | null {
  const match = url.match(
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
  const [videos,   setVideos]   = useState<Video[]>([])
  const [loading,  setLoading]  = useState(true)
  const [playing,  setPlaying]  = useState<Video | null>(null)

  useEffect(() => {
    fetch("/api/videos")
      .then(r => r.json())
      .then(data => setVideos(Array.isArray(data) ? data : []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-2">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="rounded-2xl overflow-hidden animate-pulse">
            <div className="aspect-video bg-gray-100" />
            <div className="p-3 space-y-2">
              <div className="h-3 bg-gray-100 rounded w-3/4" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (videos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-400">
        <svg className="w-14 h-14 mb-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M15 10l4.553-2.276A1 1 0 0121 8.723v6.554a1 1 0 01-1.447.894L15 14M4 6h8a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2z" />
        </svg>
        <p className="text-lg font-medium">কোনো ভিডিও যুক্ত করা হয়নি।</p>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-2">
        {videos.map((video) => (
          <div
            key={video.id}
            onClick={() => setPlaying(video)}
            className="group rounded-2xl overflow-hidden shadow-sm border border-gray-100 cursor-pointer hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 bg-white"
          >
            {/* Thumbnail */}
            <div className="relative aspect-video bg-gray-100 overflow-hidden">
              {getThumbnail(video) ? (
                <img
                  src={getThumbnail(video)}
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              )}
              {/* Play overlay */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                style={{ background: "rgba(0,0,0,0.35)" }}>
                <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-gray-800 ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
              </div>
            </div>

            {video.title && (
              <div className="px-4 py-3">
                <p className="text-sm font-semibold text-gray-800 line-clamp-2 leading-snug">
                  {video.title}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Video player modal */}
      {playing && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.9)" }}
          onClick={() => setPlaying(null)}
        >
          <div className="relative w-full max-w-4xl" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setPlaying(null)}
              className="absolute -top-10 right-0 text-white/70 hover:text-white text-sm flex items-center gap-1"
            >
              ✕ বন্ধ করুন
            </button>
            <div className="aspect-video rounded-xl overflow-hidden shadow-2xl">
              {getYouTubeId(playing.url) ? (
                <iframe
                  src={`https://www.youtube.com/embed/${getYouTubeId(playing.url)}?autoplay=1`}
                  className="w-full h-full"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                />
              ) : (
                <video src={playing.url} controls autoPlay className="w-full h-full" />
              )}
            </div>
            {playing.title && (
              <p className="text-center text-white/70 text-sm mt-3">{playing.title}</p>
            )}
          </div>
        </div>
      )}
    </>
  )
}