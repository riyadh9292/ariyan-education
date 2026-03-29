import { connectDB } from "@/lib/mongodb"
import Image from "next/image"

interface StaffMember {
  id: string
  name: string
  photo: string
  address: string
  email: string
  mobile: string
}

async function getStaff(): Promise<StaffMember[]> {
  try {
    const { db } = await connectDB()
    const doc = await db.collection("site_pages").findOne({ key: "staff" })
    return Array.isArray(doc?.value?.staff) ? doc.value.staff : []
  } catch {
    return []
  }
}

export default async function StaffCards() {
  const staff = await getStaff()

  if (staff.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-400">
        <svg className="w-14 h-14 mb-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <p className="text-lg font-medium">তথ্য এখনো যুক্ত করা হয়নি।</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-2">
      {staff.map((member, i) => (
        <div
          key={member.id}
          className="group relative bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
          style={{ animationDelay: `${i * 60}ms` }}
        >
          <div className="h-1.5 w-full bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-400" />

          <div className="p-6">
            <div className="flex justify-center mb-4">
              <div className="relative w-24 h-24 rounded-full ring-4 ring-emerald-50 ring-offset-2 overflow-hidden bg-gray-100 shrink-0">
                {member.photo ? (
                  <Image
                    src={member.photo}
                    alt={member.name}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-100 to-teal-100">
                    <svg className="w-10 h-10 text-emerald-300" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
                    </svg>
                  </div>
                )}
              </div>
            </div>

            <h3 className="text-center text-lg font-bold text-gray-800 mb-4 leading-snug">
              {member.name}
            </h3>

            <div className="border-t border-dashed border-gray-100 mb-4" />

            <ul className="space-y-2.5 text-sm">
              <li className="flex items-start gap-2.5 text-gray-600">
                <span className="mt-0.5 shrink-0 w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center">
                  <svg className="w-3 h-3 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </span>
                <span className="leading-snug">{member.address}</span>
              </li>

              <li className="flex items-center gap-2.5 text-gray-600">
                <span className="shrink-0 w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center">
                  <svg className="w-3 h-3 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </span>
                <a href={`mailto:${member.email}`} className="truncate hover:text-emerald-600 transition-colors">
                  {member.email}
                </a>
              </li>

              <li className="flex items-center gap-2.5 text-gray-600">
                <span className="shrink-0 w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center">
                  <svg className="w-3 h-3 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </span>
                <a href={`tel:${member.mobile}`} className="hover:text-emerald-600 transition-colors">
                  {member.mobile}
                </a>
              </li>
            </ul>
          </div>
        </div>
      ))}
    </div>
  )
}