"use client"
import { useEffect, useState } from "react"
import PageWrapper from "@/components/PageWrapper"

interface StaffMember {
  id     : string
  name   : string
  photo  : string
  address: string
  email  : string
  mobile : string
}

const staffIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
    stroke="#f0c040" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
  </svg>
)

export default function StaffCards() {
  const [staff,   setStaff]   = useState<StaffMember[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/staff")
      .then(r => r.json())
      .then(data => setStaff(Array.isArray(data) ? data : []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <PageWrapper
      title="শিক্ষক ও কর্মচারী"
      subtitle="আমাদের দক্ষ শিক্ষকমণ্ডলী ও কর্মচারীবৃন্দ"
      icon={staffIcon}
    >
      {/* ── negative margin to break out of PageWrapper padding ── */}
      <div className="-mx-5 -mb-6 -mt-1">

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-5">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="rounded-3xl overflow-hidden animate-pulse"
                style={{ background: "linear-gradient(145deg, #0f1b2d, #1e3a5f)" }}>
                <div className="h-1 w-full" style={{ background: "linear-gradient(90deg, #c9a84c, #f0c040, #c9a84c)" }} />
                <div className="p-7 flex flex-col items-center">
                  <div className="w-24 h-24 rounded-full mb-5"
                    style={{ background: "rgba(255,255,255,0.08)" }} />
                  <div className="h-4 rounded w-1/2 mb-6"
                    style={{ background: "rgba(255,255,255,0.08)" }} />
                  <div className="w-full space-y-3">
                    {[...Array(3)].map((_, j) => (
                      <div key={j} className="h-3 rounded"
                        style={{ background: "rgba(255,255,255,0.06)", width: `${75 - j * 10}%` }} />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

        ) : staff.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <svg className="w-14 h-14 mb-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <p className="text-lg font-medium">তথ্য এখনো যুক্ত করা হয়নি।</p>
          </div>

        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-5">
            {staff.map((member, i) => (
              <div
                key={member.id}
                className="group relative rounded-3xl overflow-hidden transition-all duration-300 hover:-translate-y-1"
                style={{
                  background: "linear-gradient(145deg, #0f1b2d 0%, #1e3a5f 60%, #1a3060 100%)",
                  boxShadow : "0 10px 30px rgba(15,27,45,0.25)",
                }}
              >
                {/* Blob */}
                <div className="absolute top-0 right-0 w-40 h-40 rounded-full pointer-events-none"
                  style={{ background: "radial-gradient(circle, rgba(201,168,76,0.1) 0%, transparent 70%)", transform: "translate(30%,-30%)" }} />

                {/* Gold top line */}
                <div className="h-1 w-full"
                  style={{ background: "linear-gradient(90deg, #c9a84c, #f0c040, #c9a84c)" }} />

                <div className="relative z-10 p-7">

                  {/* Photo */}
                  <div className="flex justify-center mb-5">
                    <div className="relative">
                      <div
                        className="w-24 h-24 rounded-md overflow-hidden transition-transform duration-300 group-hover:scale-105"
                        style={{
                          outline      : "3px solid rgba(201,168,76,0.5)",
                          outlineOffset: "3px",
                          boxShadow    : "0 4px 20px rgba(0,0,0,0.3)",
                        }}
                      >
                        {member.photo ? (
                          <img src={member.photo} alt={member.name} className="w-full h-full object-cover object-top" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-white"
                            style={{ background: "linear-gradient(135deg, #c9a84c, #f0c040)" }}>
                            {member.name?.charAt(0) ?? "?"}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Name */}
                  <h3 className="text-center text-lg font-bold text-white mb-1 leading-snug">
                    {member.name}
                  </h3>
                  <div className="w-10 h-0.5 mx-auto mb-5 rounded-full"
                    style={{ background: "linear-gradient(90deg, #c9a84c, #f0c040)" }} />

                  {/* Inner white info card */}
                  <div className="rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.97)" }}>
                    <ul className="divide-y divide-gray-50">

                      <li className="flex items-start gap-3 px-4 py-2 hover:bg-blue-50/60 transition-colors">
                        <span
  className="mt-0.5 shrink-0 w-7 h-7 rounded-lg flex items-center justify-center"
  style={{ background: "linear-gradient(135deg, #0f1b2d, #1e3a5f)" }}
>
  <svg
    className="w-3.5 h-3.5 text-yellow-300"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M16 7V5a2 2 0 00-2-2H10a2 2 0 00-2 2v2M4 7h16v14H4V7z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M16 11H8v4h8v-4z"
    />
  </svg>
</span>
                        <span className="text-sm text-gray-600 leading-snug mt-1.5">{member.address}</span>
                      </li>

                      <li className="flex items-center gap-3 px-4 py-3 hover:bg-blue-50/60 transition-colors">
                        <span className="shrink-0 w-7 h-7 rounded-lg flex items-center justify-center"
                          style={{ background: "linear-gradient(135deg, #0f1b2d, #1e3a5f)" }}>
                          <svg className="w-3.5 h-3.5 text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                          </svg>
                        </span>
                        <a href={`mailto:${member.email}`}
                          className="text-sm text-gray-600 truncate hover:text-blue-600 transition-colors">
                          {member.email}
                        </a>
                      </li>

                      <li className="flex items-center gap-3 px-4 py-3 hover:bg-blue-50/60 transition-colors">
                        <span className="shrink-0 w-7 h-7 rounded-lg flex items-center justify-center"
                          style={{ background: "linear-gradient(135deg, #0f1b2d, #1e3a5f)" }}>
                          <svg className="w-3.5 h-3.5 text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                          </svg>
                        </span>
                        <a href={`tel:${member.mobile}`}
                          className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                          {member.mobile}
                        </a>
                      </li>

                    </ul>
                  </div>
                </div>

                {/* Bottom shimmer */}
                <div className="h-0.5 w-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
                  style={{ background: "linear-gradient(90deg, transparent, rgba(201,168,76,0.6), transparent)" }} />
              </div>
            ))}
          </div>
        )}

      </div>
    </PageWrapper>
  )
}