import { connectDB } from "@/lib/mongodb"

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ type: string }>
}) {
  const { type } = await params
  const { db }   = await connectDB()
  const doc      = await db.collection("site_profiles").findOne({ type })

  if (!doc) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center text-gray-400">
          <svg className="w-16 h-16 mx-auto mb-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 7a4 4 0 100 8 4 4 0 000-8z"/>
          </svg>
          <p className="text-lg font-medium">প্রোফাইল পাওয়া যায়নি</p>
        </div>
      </div>
    )
  }

  const isFounder  = type === "founder"
  const titleBn    = isFounder ? "চেয়ারম্যান" : "ব্যবস্থাপনা পরিচালক"
  const badgeStyle = isFounder
    ? { background: "#fef3c7", color: "#92400e" }
    : { background: "#eff6ff", color: "#1d4ed8" }

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(160deg, #f0f4ff 0%, #faf9f6 60%, #fff 100%)" }}>

      {/* ── Hero band — same navy as NoticeBoard & ProfileSection ── */}
      <div
        className="relative overflow-hidden"
        style={{ background: "linear-gradient(145deg, #0f1b2d 0%, #1e3a5f 60%, #1a3060 100%)" }}
      >
        {/* Blobs */}
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(201,168,76,0.12) 0%, transparent 70%)", transform: "translate(30%,-30%)" }} />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(37,99,235,0.15) 0%, transparent 70%)", transform: "translate(-30%,30%)" }} />

        {/* Gold top line */}
        <div className="h-1 w-full"
          style={{ background: "linear-gradient(90deg, #c9a84c, #f0c040, #c9a84c)" }} />

        <div className="relative z-10 max-w-4xl mx-auto px-6 py-14 flex flex-col sm:flex-row items-center gap-8">

          {/* Photo */}
          <div className="relative flex-shrink-0">
            <div
              className="w-36 h-36 rounded-full overflow-hidden"
              style={{
                outline      : `4px solid ${isFounder ? "#c9a84c" : "#2563eb"}`,
                outlineOffset: "4px",
                boxShadow    : "0 8px 32px rgba(0,0,0,0.4)",
              }}
            >
              {doc.photo ? (
                <img src={doc.photo} alt={doc.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-white"
                  style={{ background: isFounder ? "linear-gradient(135deg,#c9a84c,#f0c040)" : "linear-gradient(135deg,#0f1b2d,#1e3a5f)" }}>
                  {doc.name?.charAt(0) ?? "?"}
                </div>
              )}
            </div>
            {/* Badge dot */}
            <span
              className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full flex items-center justify-center border-2 border-white"
              style={{ background: isFounder ? "linear-gradient(135deg,#c9a84c,#f0c040)" : "linear-gradient(135deg,#1e3a5f,#2563eb)" }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={isFounder ? "#7a4a00" : "white"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                {isFounder
                  ? <><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/></>
                  : <><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></>
                }
              </svg>
            </span>
          </div>

          {/* Name + role */}
          <div className="text-center sm:text-left">
            <span
              className="inline-block text-[10px] font-bold px-2.5 py-1 rounded-full mb-3 uppercase tracking-widest"
              style={badgeStyle}
            >
              {titleBn}
            </span>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 leading-tight">
              {doc.name}
            </h1>
            <div className="w-16 h-1 rounded-full sm:mx-0 mx-auto"
              style={{ background: "linear-gradient(90deg, #c9a84c, #f0c040)" }} />
          </div>
        </div>

        {/* Bottom shimmer */}
        <div className="h-0.5 w-full"
          style={{ background: "linear-gradient(90deg, transparent, rgba(201,168,76,0.4), transparent)" }} />
      </div>

      {/* ── Content card ─────────────────────────────────────────── */}
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div
          className="relative rounded-3xl overflow-hidden shadow-2xl"
          style={{
            background: "linear-gradient(145deg, #0f1b2d 0%, #1e3a5f 60%, #1a3060 100%)",
            boxShadow : "0 25px 60px rgba(15,27,45,0.35), 0 8px 20px rgba(15,27,45,0.2)",
          }}
        >
          {/* Blob */}
          <div className="absolute bottom-0 right-0 w-56 h-56 rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(201,168,76,0.1) 0%, transparent 70%)", transform: "translate(20%,20%)" }} />

          {/* Gold top line */}
          <div className="h-1 w-full"
            style={{ background: "linear-gradient(90deg, #c9a84c, #f0c040, #c9a84c)" }} />

          <div className="relative z-10 p-7">

            {/* Header row */}
            <div className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 flex items-center justify-center rounded-xl flex-shrink-0"
                style={{ background: "rgba(201,168,76,0.15)", border: "1px solid rgba(201,168,76,0.3)" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f0c040" strokeWidth="2" strokeLinecap="round">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-bold text-white leading-tight">বিবরণ</h2>
                <p className="text-xs leading-none mt-0.5" style={{ color: "rgba(255,255,255,0.45)" }}>
                  {titleBn}র বিস্তারিত তথ্য
                </p>
              </div>
            </div>

            {/* Inner white card — same as NoticeBoard inner */}
            <div className="rounded-2xl overflow-hidden p-6" style={{ background: "rgba(255,255,255,0.97)" }}>
              {doc.description ? (
                <div
                  className="quill-content text-gray-700 leading-8 text-[15px]"
                  dangerouslySetInnerHTML={{ __html: doc.description }}
                />
              ) : (
                <p className="text-gray-400 italic text-center py-6">কোনো বিবরণ যুক্ত করা হয়নি।</p>
              )}
            </div>
          </div>

          {/* Bottom shimmer */}
          <div className="h-0.5 w-full"
            style={{ background: "linear-gradient(90deg, transparent, rgba(201,168,76,0.4), transparent)" }} />
        </div>
      </div>

    </div>
  )
}