export default function Banner() {
  return (
    <section
      className="relative text-white py-24 text-center overflow-hidden"
      style={{
        backgroundImage: "url('https://i.ibb.co.com/4Z8PpKZV/tim-mossholder-WE-Kv-ZB1l0-unsplash.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Dark overlay so text stays readable */}
      <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(15,27,45,0.82) 0%, rgba(30,58,95,0.75) 100%)" }} />

      {/* Content */}
      <div className="relative z-10 max-w-3xl mx-auto px-6">
        {/* Logo mark */}
        <div className="w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center shadow-2xl"
          style={{ background: "linear-gradient(135deg, #c9a84c, #f0c040)" }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0f1b2d" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
            <path d="M6 12v5c3 3 9 3 12 0v-5"/>
          </svg>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold mb-3 leading-tight">
          আরিয়ান এডুকেশন সেন্টার
        </h1>

        <div className="w-20 h-1 mx-auto my-4 rounded-full"
          style={{ background: "linear-gradient(90deg, #c9a84c, #f0c040)" }} />

        <p className="text-lg opacity-90 font-medium" style={{ color: "#fde68a" }}>
          জ্ঞানের আলোয় আলোকিত ভবিষ্যৎ
        </p>

        <p className="text-white/60 text-sm mt-2">
          Ariyan Education Center — Quality education for a better future
        </p>
      </div>
    </section>
  )
}