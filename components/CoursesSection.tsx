"use client"
import PageWrapper from "@/components/PageWrapper"

interface Course {
  id         : string
  title      : string
  level      : string
  category   : string
  price      : number
  description: string
  skills     : string[]
}

const courses: Course[] = [
  {
    id         : "1",
    title      : "প্রাইমারি হেলথ কেয়ার সার্ভিসেস",
    level      : "লেভেল-২",
    category   : "স্বাস্থ্যসেবা",
    price      : 0,
    description: "প্রাইমারি হেলথ কেয়ার (PHC) সার্ভিস বা প্রাথমিক স্বাস্থ্যসেবা হলো একটি দেশের স্বাস্থ্য ব্যবস্থার মূল ভিত্তি। এটি এমন একটি সেবা যা সমাজের প্রতিটি মানুষের জন্য সহজলভ্য, বৈজ্ঞানিকভাবে সম্মত এবং সাশ্রয়ী।",
    skills     : [
      "জরুরি প্রাথমিক চিকিৎসা",
      "রক্তচাপ মাপা ও ইনজেকশন প্রদান",
      "৩২-৩৫ প্রকারের জরুরি ওষুধের ব্যবহার",
      "কমিউনিটি ক্লিনিকে কর্মসংস্থান",
      "উচ্চতর শিক্ষার ভিত্তি গঠন",
    ],
  },
  {
    id         : "2",
    title      : "কেয়ারগিভিং ফর ইনফ্যান্ট টোডলারস এন্ড চিলড্রেন",
    level      : "লেভেল-৩",
    category   : "শিশু পরিচর্যা",
    price      : 0,
    description: "শিশুদের সঠিক যত্ন ও পরিচর্যা প্রদান করার জন্য এটি একটি অপরিহার্য কোর্স যা শিশুদের শারীরিক, মানসিক ও সামাজিক উন্নয়নে সাহায্য করবে।",
    skills     : [
      "বয়সভিত্তিক শিশুদের যত্ন নেওয়া",
      "নেভিগেশন দক্ষতা অনুশীলন",
      "মানসিক প্রতিবন্ধকতা ও অটিজম চিহ্নিতকরণ",
      "প্লেগ্রুপ কেয়ার প্রদান",
      "ওয়ার্কপ্লেস ভ্যালু প্রয়োগ",
    ],
  },
  {
    id         : "3",
    title      : "কেয়ারগিভিং ফর এল্ডারলি পারসন",
    level      : "লেভেল-৩",
    category   : "বৃদ্ধ পরিচর্যা",
    price      : 0,
    description: "এটি একটি দক্ষতাভিত্তিক প্রশিক্ষণ পাঠ্যক্রম, যা বয়স্ক ব্যক্তিদের যত্নে প্রয়োজনীয় জ্ঞান, দক্ষতা এবং কর্মক্ষেত্রে যথাযথ মানসিকতা তৈরির জন্য প্রণয়ন করা হয়েছে।",
    skills     : [
      "স্ট্রোক ও ডিমেনশিয়া রোগীর কেয়ার",
      "প্যালিয়েটিভ কেয়ার প্রদান",
      "চলাফেরায় সহায়তা প্রদান",
      "পারকিনসন ও অ্যালঝাইমার রোগীর সেবা",
      "ওয়ার্ক ভ্যালু প্রদর্শন",
    ],
  },
  {
    id         : "4",
    title      : "হাউসকিপিং",
    level      : "লেভেল-২",
    category   : "পর্যটন ও আতিথেয়তা",
    price      : 0,
    description: "পর্যটন শিল্পের প্রসারে দেশজুড়ে বেড়ে উঠছে বিভিন্ন হোটেল ও রিসোর্ট। হাউজকিপিং পেশায় দক্ষ কর্মীর চাহিদা ও প্রশিক্ষিত জনশক্তির কদর দিন দিন বাড়ছে।",
    skills     : [
      "গেস্ট রুম প্রিপারেশন",
      "ট্রলি প্রিপারেশন ও ক্লিনিং",
      "ক্লিনিং কেমিক্যালস ও ইকুইপমেন্ট",
      "টাইম ম্যানেজমেন্ট",
      "কমিউনিকেশন স্কিলস",
    ],
  },
]

// Category color map
const categoryStyle: Record<string, { bg: string; text: string; badge: string }> = {
  "স্বাস্থ্যসেবা"       : { bg: "rgba(239,68,68,0.1)",   text: "#dc2626", badge: "#fef2f2"  },
  "শিশু পরিচর্যা"       : { bg: "rgba(59,130,246,0.1)",  text: "#2563eb", badge: "#eff6ff"  },
  "বৃদ্ধ পরিচর্যা"      : { bg: "rgba(16,185,129,0.1)",  text: "#059669", badge: "#f0fdf4"  },
  "পর্যটন ও আতিথেয়তা" : { bg: "rgba(245,158,11,0.1)",  text: "#d97706", badge: "#fffbeb"  },
}

const coursesIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
    stroke="#f0c040" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
    <path d="M6 12v5c3 3 9 3 12 0v-5"/>
  </svg>
)

export default function CoursesSection() {
  return (
    <PageWrapper
      title="আমাদের কোর্সসমূহ"
      subtitle={`মোট ${courses.length}টি কোর্স উপলব্ধ`}
      icon={coursesIcon}
    >
      <div className="-mx-5 -mb-6 -mt-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 p-5">
          {courses.map((course, i) => {
            const style = categoryStyle[course.category] ?? {
              bg: "rgba(201,168,76,0.1)", text: "#b45309", badge: "#fffbeb",
            }

            return (
              <div
                key={course.id}
                className="group relative rounded-3xl overflow-hidden transition-all duration-300 hover:-translate-y-1"
                style={{
                  background: "linear-gradient(145deg, #0f1b2d 0%, #1e3a5f 60%, #1a3060 100%)",
                  boxShadow : "0 10px 30px rgba(15,27,45,0.25)",
                }}
              >
                {/* Blob */}
                <div className="absolute top-0 right-0 w-48 h-48 rounded-full pointer-events-none"
                  style={{ background: `radial-gradient(circle, ${style.bg} 0%, transparent 70%)`, transform: "translate(30%,-30%)" }} />

                {/* Gold top line */}
                <div className="h-1 w-full"
                  style={{ background: "linear-gradient(90deg, #c9a84c, #f0c040, #c9a84c)" }} />

                <div className="relative z-10 p-6">

                  {/* Header row */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    {/* Course number badge */}
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                      style={{ background: "linear-gradient(135deg, #c9a84c, #f0c040)", color: "#7a4a00" }}
                    >
                      {i + 1}
                    </div>

                    {/* FREE badge */}
                    <div className="flex items-center gap-2">
                      {course.price === 0 ? (
                        <span className="flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full"
                          style={{ background: "rgba(16,185,129,0.15)", color: "#34d399", border: "1px solid rgba(52,211,153,0.3)" }}>
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                            <polyline points="20 6 9 17 4 12"/>
                          </svg>
                          বিনামূল্যে
                        </span>
                      ) : (
                        <span className="text-xs font-bold px-2.5 py-1 rounded-full"
                          style={{ background: "rgba(201,168,76,0.15)", color: "#f0c040", border: "1px solid rgba(201,168,76,0.3)" }}>
                          ৳ {course.price}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Category + Level */}
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                      style={{ background: style.bg, color: style.text }}>
                      {course.category}
                    </span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                      style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.5)" }}>
                      {course.level}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-white font-bold text-base leading-snug mb-2">
                    {course.title}
                  </h3>

                  {/* Gold divider */}
                  <div className="w-10 h-0.5 mb-4 rounded-full"
                    style={{ background: "linear-gradient(90deg, #c9a84c, #f0c040)" }} />

                  {/* Description */}
                  <p className="text-xs leading-relaxed mb-4"
                    style={{ color: "rgba(255,255,255,0.55)" }}>
                    {course.description}
                  </p>

                  {/* Inner white skills card */}
                  <div className="rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.97)" }}>
                    <div className="px-4 py-2.5 border-b border-gray-100 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#f0c040" }} />
                      <span className="text-xs font-semibold text-gray-600">যা শিখবেন</span>
                    </div>
                    <ul className="divide-y divide-gray-50">
                      {course.skills.map((skill, si) => (
                        <li key={si} className="flex items-center gap-3 px-4 py-2.5 hover:bg-blue-50/60 transition-colors">
                          <span className="w-5 h-5 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{ background: "linear-gradient(135deg, #0f1b2d, #1e3a5f)" }}>
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
                              stroke="#f0c040" strokeWidth="3" strokeLinecap="round">
                              <polyline points="20 6 9 17 4 12"/>
                            </svg>
                          </span>
                          <span className="text-xs text-gray-700 leading-snug">{skill}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Enroll button */}
                  <button
                    className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-95"
                    style={{ background: "linear-gradient(135deg, #c9a84c, #f0c040)", color: "#0f1b2d" }}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                      <path d="M6 12v5c3 3 9 3 12 0v-5"/>
                    </svg>
                    ভর্তি হন
                  </button>

                </div>

                {/* Bottom shimmer on hover */}
                <div className="h-0.5 w-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
                  style={{ background: "linear-gradient(90deg, transparent, rgba(201,168,76,0.6), transparent)" }} />
              </div>
            )
          })}
        </div>
      </div>
    </PageWrapper>
  )
}