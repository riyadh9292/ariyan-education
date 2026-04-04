import Link from "next/link";

export default function OpportunityBanner() {

  return (
    <div className="relative overflow-hidden w-full max-w-5xl mx-auto px-4 mb-10">
        <div
  className="rounded-tl-3xl rounded-tr-3xl"
  style={{ background: "linear-gradient(135deg, #0f1b2d 0%, #1e3a5f 60%, #1a3a6b 100%)" }}
>
  {/* background glow */}
  <div
    className="absolute bottom-0 left-0 w-64 h-64 rounded-full opacity-5"
    style={{
      background: "radial-gradient(circle, #60a5fa, transparent)",
      transform: "translate(-30%, 30%)",
    }}
  />

  <div className="relative z-10 max-w-5xl mx-auto px-4 py-16 text-center">

    {/* logo */}
    <div
      className="w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center shadow-2xl"
      style={{ background: "linear-gradient(135deg, #c9a84c, #f0c040)" }}
    >
      <img
        src="https://i.ibb.co.com/fB86vmL/Whats-App-Image-2026-03-30-at-09-27-46-1-removebg-preview.png"
        alt="logo"
        className="w-full h-full object-contain scale-[120%]"
      />
    </div>

    {/* heading */}
    <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
      আরিয়ান চাইল্ড এন্ড ওল্ড কেয়ার
    </h2>

    {/* tagline */}
    <p className="text-yellow-300 text-lg font-semibold mb-4">
      প্রশিক্ষণ শেষেই কর্মসংস্থানের সম্ভাবনা
    </p>

    {/* description */}
    <p className="text-gray-300 text-sm md:text-base max-w-3xl mx-auto leading-relaxed">
      আমাদের কেয়ারগিভিং প্রশিক্ষণ কোর্স সম্পন্ন করার পর যোগ্য শিক্ষার্থীদের জন্য 
      <span className="text-white font-semibold"> আরিয়ান চাইল্ড এন্ড ওল্ড কেয়ার </span>
      প্রতিষ্ঠানে কাজ করার সুযোগ থাকতে পারে। 
      আমাদের লক্ষ্য দক্ষ, সহানুভূতিশীল এবং পেশাদার কেয়ারগিভার তৈরি করা যারা 
      শিশু ও বয়স্কদের সেবায় গুরুত্বপূর্ণ ভূমিকা রাখতে পারবে।
    </p>

    {/* CTA */}
    <div className="mt-8 flex justify-center gap-4 flex-wrap">
      <Link
        href="/courses"
        className="px-6 py-3 rounded-xl font-semibold text-white shadow-lg transition hover:scale-105"
        style={{ background: "linear-gradient(135deg, #c9a84c, #f0c040)" }}
      >
        কোর্স দেখুন
      </Link>

      <Link
        href="/contact"
        className="px-6 py-3 rounded-xl font-semibold border border-blue-400 text-blue-300 hover:bg-blue-500 hover:text-white transition"
      >
        যোগাযোগ করুন
      </Link>
    </div>

    {/* small disclaimer */}
    <p className="text-xs text-gray-500 mt-6">
      * কোর্স সফলভাবে সম্পন্ন করা ও যোগ্যতার ভিত্তিতে কর্মসংস্থানের সুযোগ প্রদান করা হতে পারে।
    </p>
  </div>

  {/* bottom wave */}
  <svg viewBox="0 0 1440 60" className="w-full block" style={{ marginBottom: "-2px" }}>
    <path
      d="M0 60L60 50C120 40 240 20 360 18C480 16 600 28 720 32C840 36 960 32 1080 27C1200 22 1320 14 1380 10L1440 6V60H0Z"
      fill="#ffffff"
    />
  </svg>
</div>
    </div>
    
  );
}