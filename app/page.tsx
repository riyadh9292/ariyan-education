// app/page.tsx — replace your entire homepage with this
import NoticeBoard from "@/components/NoticeBoard"

export default function Home() {
  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(160deg, #f0f4ff 0%, #faf9f6 60%, #fff 100%)" }}>

      {/* ── Hero header ─────────────────────────────────────────────── */}
      <div className="relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0f1b2d 0%, #1e3a5f 60%, #1a3a6b 100%)" }}>

        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #f0c040, transparent)", transform: "translate(30%, -30%)" }} />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full opacity-5"
          style={{ background: "radial-gradient(circle, #60a5fa, transparent)", transform: "translate(-30%, 30%)" }} />

        <div className="relative z-10 max-w-5xl mx-auto px-4 py-16 text-center">
          {/* Logo / icon */}
          <div className="w-20 h-20 mx-auto mb-5 rounded-2xl flex items-center justify-center shadow-2xl"
            style={{ background: "linear-gradient(135deg, #c9a84c, #f0c040)" }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#0f1b2d" strokeWidth="1.8" strokeLinecap="round">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
              <path d="M6 12v5c3 3 9 3 12 0v-5"/>
            </svg>
          </div>

          <h1 className="text-3xl md:text-5xl font-bold text-white mb-3 leading-tight">
            আরিয়ান এডুকেশন সেন্টার
          </h1>
          <p className="text-yellow-300 text-lg font-medium mb-2">
            জ্ঞানের আলোয় আলোকিত ভবিষ্যৎ
          </p>
          <p className="text-gray-400 text-sm">
            মানসম্পন্ন শিক্ষার একটি বিশ্বস্ত প্রতিষ্ঠান
          </p>
        </div>

        {/* Bottom wave */}
        <svg viewBox="0 0 1440 60" className="w-full block" style={{ marginBottom: "-2px" }}>
          <path d="M0 60L60 50C120 40 240 20 360 18C480 16 600 28 720 32C840 36 960 32 1080 27C1200 22 1320 14 1380 10L1440 6V60H0Z"
            style={{ fill: "linear-gradient(160deg, #f0f4ff 0%, #faf9f6 60%, #fff 100%)" }} fill="#f4f6fb"/>
        </svg>
      </div>

      {/* ── Quick stats strip ────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 -mt-2">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { num: "৫০০+", label: "শিক্ষার্থী", color: "#2563eb" },
            { num: "৩০+",  label: "শিক্ষক",    color: "#059669" },
            { num: "৯৮%",  label: "পাসের হার", color: "#d97706" },
            { num: "১৫+",  label: "বছর",        color: "#7c3aed" },
          ].map((s, i) => (
            <div key={i} className="bg-white rounded-2xl p-4 text-center shadow-sm border border-gray-100">
              <div className="text-2xl font-bold" style={{ color: s.color }}>{s.num}</div>
              <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Notice board ─────────────────────────────────────────────── */}
      <NoticeBoard />
      
    </div>
  )
}