"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

type Profile = {
  name: string
  photo: string
  description: string
}

export default function ProfileSection() {
  const [founder,   setFounder]   = useState<Profile | null>(null)
  const [principal, setPrincipal] = useState<Profile | null>(null)
  const [loading,   setLoading]   = useState(true)

  useEffect(() => {
    async function loadProfiles() {
      const founderRes   = await fetch("/api/profile?type=founder")
      const founderData  = await founderRes.json()
      const principalRes = await fetch("/api/profile?type=principal")
      const principalData = await principalRes.json()
      setFounder(founderData)
      setPrincipal(principalData)
      setLoading(false)
    }
    loadProfiles()
  }, [])

  const profiles = [
    { title: "চেয়ারম্যান", titleEn: "Founder",   data: founder,   slug: "founder",   index: 0 },
    { title: "ব্যবস্থাপনা পরিচালক",    titleEn: "Principal",  data: principal, slug: "principal", index: 1 },
  ]

  return (
    <section className="w-full max-w-5xl mx-auto px-4 xl:pt-16 pb-16 ">

      {/* ── Outer card — identical to NoticeBoard ────────────────── */}
      <div
        className="relative rounded-3xl overflow-hidden shadow-2xl"
        style={{
          background: "linear-gradient(145deg, #0f1b2d 0%, #1e3a5f 60%, #1a3060 100%)",
          boxShadow : "0 25px 60px rgba(15,27,45,0.35), 0 8px 20px rgba(15,27,45,0.2)",
        }}
      >
        {/* Blobs */}
        <div className="absolute top-0 left-0 w-72 h-72 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(201,168,76,0.12) 0%, transparent 70%)", transform: "translate(-30%,-30%)" }} />
        <div className="absolute bottom-0 right-0 w-56 h-56 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(37,99,235,0.15) 0%, transparent 70%)", transform: "translate(30%,30%)" }} />

        {/* Gold top line */}
        <div className="h-1 w-full"
          style={{ background: "linear-gradient(90deg, #c9a84c, #f0c040, #c9a84c)" }} />

        <div className="relative z-10 p-7">

          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-11 h-11 flex items-center justify-center rounded-xl flex-shrink-0"
              style={{ background: "rgba(201,168,76,0.15)", border: "1px solid rgba(201,168,76,0.3)" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f0c040" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white leading-tight">প্রশাসনিক পরিচিতি</h2>
              <p className="text-xs leading-none mt-0.5" style={{ color: "rgba(255,255,255,0.45)" }}>
                চেয়ারম্যান ও ব্যবস্থাপনা পরিচালক
              </p>
            </div>
          </div>

          {/* ── Inner white card ───────────────────────────────── */}
          <div className="rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.97)" }}>

            {loading ? (
              <div className="divide-y divide-gray-50">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="flex items-center gap-5 px-5 py-5 animate-pulse">
                    <div className="w-14 h-14 rounded-full bg-gray-100 flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 bg-gray-100 rounded w-1/4" />
                      <div className="h-3.5 bg-gray-100 rounded w-1/2" />
                      <div className="h-3 bg-gray-100 rounded w-1/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <ul className="grid grid-cols-2 xl:grid-cols-1 justify-center divide-y divide-gray-50">
                {profiles.map((p) => {
                  if (!p.data) return null
                  return (
                    <li key={p.slug}>
                      <span className="inline-block text-[9px] font-bold px-1.5 py-0.5 rounded self-start uppercase tracking-wider"
                            style={p.index === 0
                              ? { background: "#fef3c7", color: "#92400e" }
                              : { background: "#eff6ff", color: "#1d4ed8" }}>
                            {p.title}
                          </span>
                      <Link
                        href={`/profile/${p.slug}`}
                        className="group flex flex-col justify-center items-center gap-5 px-5 py-4 hover:bg-blue-50/70 transition-all duration-200"
                      >
                        {/* Photo */}
                        <div className="relative flex-shrink-0">
                          <div className="w-28 h-28 rounded-full overflow-hidden transition-transform duration-300 group-hover:scale-110"
                            style={{ outline: `3px solid ${p.index === 0 ? "#c9a84c" : "#1e3a5f"}`, outlineOffset: "2px" }}>
                            {p.data.photo ? (
                              <img src={p.data.photo} alt={p.data.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-lg font-bold text-white"
                                style={{ background: p.index === 0 ? "linear-gradient(135deg,#c9a84c,#f0c040)" : "linear-gradient(135deg,#0f1b2d,#1e3a5f)" }}>
                                {p.data.name?.charAt(0) ?? "?"}
                              </div>
                            )}
                          </div>
                          {/* Index badge */}
                          <span className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white border-2 border-white"
                            style={{ background: p.index === 0 ? "linear-gradient(135deg,#c9a84c,#f0c040)" : "linear-gradient(135deg,#1e3a5f,#2563eb)", color: p.index === 0 ? "#7a4a00" : "white" }}>
                            {p.index + 1}
                          </span>
                        </div>

                        {/* Title → name → description — vertical col */}
                        <div className="flex-1 min-w-0 flex flex-col gap-0.5 justify-center items-center">
                    
                          {/* Name */}
                          <p className="text-sm font-bold text-gray-800 group-hover:text-blue-700 transition-colors leading-snug truncate">
                            {p.data.name}
                          </p>
                          {/* Description — strip HTML */}
                          {p.data.description && (
                            <p className="text-xs text-gray-400 line-clamp-1">
                              {p.data.description.replace(/<[^>]*>/g, " ").substring(0, 80)}
                            </p>
                          )}
                        </div>

                        {/* Arrow — identical to NoticeBoard */}
                        <svg
                          width="14" height="14" viewBox="0 0 24 24" fill="none"
                          stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round"
                          className="flex-shrink-0 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-200"
                        >
                          <path d="M5 12h14M12 5l7 7-7 7"/>
                        </svg>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            )}

          </div>
        </div>

        {/* Bottom shimmer */}
        <div className="h-0.5 w-full"
          style={{ background: "linear-gradient(90deg, transparent, rgba(201,168,76,0.4), transparent)" }} />
      </div>
    </section>
  )
}