"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

type Profile = {
  name: string
  photo: string
  description: string
}

export default function ProfileSection() {
  const [founder, setFounder] = useState<Profile | null>(null)
  const [principal, setPrincipal] = useState<Profile | null>(null)

  useEffect(() => {
    async function loadProfiles() {
      const founderRes = await fetch("/api/profile?type=founder")
      const founderData = await founderRes.json()

      const principalRes = await fetch("/api/profile?type=principal")
      const principalData = await principalRes.json()

      setFounder(founderData)
      setPrincipal(principalData)
    }

    loadProfiles()
  }, [])

  const profiles = [
    { title: "Founder", data: founder, slug: "founder" },
    { title: "Principal", data: principal, slug: "principal" },
  ]

  return (
    <div className="flex flex-col items-center gap-8 mt-10">
      {profiles.map((p) =>
        p.data ? (
          <div
  key={p.slug}
  className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6 text-center group"
>
  <h2 className="text-lg font-semibold text-gray-500 uppercase tracking-wide mb-4">
    {p.title}
  </h2>

  {p.data.photo && (
    <div className="flex justify-center mb-4">
      <img
        src={p.data.photo}
        alt={p.data.name}
        className="w-40 h-40 object-cover rounded-full border-4 border-gray-100 group-hover:scale-105 transition"
      />
    </div>
  )}

  <Link
    href={`/profile/${p.slug}`}
    className="text-xl font-semibold text-gray-800 hover:text-blue-600 transition"
  >
    {p.data.name}
  </Link>

  <p className="text-sm text-gray-400 mt-2">View Profile →</p>
</div>
        ) : null
      )}
    </div>
  )
}