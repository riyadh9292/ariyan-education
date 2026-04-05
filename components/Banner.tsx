"use client"
import { useEffect, useState, useCallback } from "react"

interface BannerImage { id: string; url: string; caption: string }

const FALLBACK: BannerImage = {
  id: "fallback",
  url: "/site-logo.png",
  caption: "",
}

export default function Banner() {
  const [images,  setImages]  = useState<BannerImage[]>([FALLBACK])
  const [current, setCurrent] = useState(0)
  const [fading,  setFading]  = useState(false)

  useEffect(() => {
    fetch("/api/banner")
      .then(r => r.json())
      .then(data => { if (Array.isArray(data) && data.length > 0) setImages(data) })
      .catch(() => {})
  }, [])

  const goTo = useCallback((index: number) => {
    setFading(true)
    setTimeout(() => { setCurrent(index); setFading(false) }, 600)
  }, [])

  useEffect(() => {
    if (images.length <= 1) return
    const timer = setInterval(() => goTo((current + 1) % images.length), 5000)
    return () => clearInterval(timer)
  }, [current, images.length, goTo])

  return (
    <section className="relative text-white overflow-hidden h-[300px] xl:h-[350px]">

      {/* Slides */}
      {images.map((img, i) => (
        <div key={img.id} className="absolute inset-0 transition-opacity duration-700"
          style={{ opacity: i === current ? (fading ? 0 : 1) : 0, zIndex: i === current ? 1 : 0 }}>
          <img src={img.url} alt={img.caption || "Banner"} className="w-full h-full object-cover object-center" />
        </div>
      ))}

      {/* Overlay */}
      <div className="absolute inset-0 z-10"
        style={{ background: "linear-gradient(135deg, rgba(15,27,45,0.82) 0%, rgba(30,58,95,0.72) 100%)" }} />

      {/* Content */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-start md:justify-center text-center px-6 mt-2.5 md:mt-0">
        <div className="max-w-3xl mx-auto">
          <div className="">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 mb-5 justify-center">
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-2xl"
            style={{ background: "linear-gradient(135deg, #c9a84c, #f0c040)" }}>
              <img src="https://i.ibb.co.com/Lz5Ns3K0/Whats-App-Image-2026-03-30-at-09-27-46-removebg-preview.png" alt="Whats App Image 2026 03 30 at 09 27 46 removebg preview" className="w-full h-full object-contain scale-[175%]" />
             </div>
             <div className="flex flex-col items-center sm:items-start">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">আরিয়ান স্কিলড একাডেমি</h1>
              <p className="text-yellow-300 text-lg font-medium">প্রতিষ্ঠাকাল - ২০২৫ খ্রিঃ
</p>
             </div>
             

            </div>
          </div>
          
          
          <div className="w-20 h-1 mx-auto my-4 rounded-full"
            style={{ background: "linear-gradient(90deg, #c9a84c, #f0c040)" }} />
          <p className="text-lg font-medium" style={{ color: "#fde68a" }}>মূল লক্ষ্য হলো যুবক ও তরুণীদের আধুনিক কর্মমুখী শিক্ষায় শিক্ষিত করে তোলা।</p>
          {/* {images[current]?.caption && (
            <p className="mt-4 text-white/70 text-sm italic">{images[current].caption}</p>
          )} */}
        </div>
      </div>

      {/* Dots */}
      {images.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
          {images.map((_, i) => (
            <button key={i} onClick={() => goTo(i)} className="rounded-full transition-all duration-300"
              style={{ width: i === current ? "24px" : "8px", height: "8px",
                background: i === current ? "linear-gradient(90deg,#c9a84c,#f0c040)" : "rgba(255,255,255,0.4)" }} />
          ))}
        </div>
      )}
    </section>
  )
}