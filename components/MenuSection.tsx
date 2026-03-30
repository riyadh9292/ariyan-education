/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from "next/link"
import { getMenu } from "@/lib/menu"

export default async function Footer() {
  const menu = await getMenu()
  const year = new Date().getFullYear()

  return (
    <footer>
      {/* ── Main footer body ─────────────────────────────────────────── */}
      <div style={{ background: "linear-gradient(160deg, #0a1628 0%, #0f1b2d 50%, #1a2a42 100%)" }}>
        <div className="max-w-7xl mx-auto px-6 pt-16 pb-10">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">

            {/* ── Brand column ───────────────────────────────────────── */}
            <div className="lg:col-span-2 space-y-5">
              <Link href="/" className="flex items-center gap-3 group w-fit">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0 transition-transform group-hover:scale-105 duration-300"
                  style={{ background: "linear-gradient(135deg, #c9a84c, #f0c040)" }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0f1b2d" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                    <path d="M6 12v5c3 3 9 3 12 0v-5"/>
                  </svg>
                </div>
                <div>
                  <div className="text-white font-bold text-lg leading-tight">আরিয়ান এডুকেশন</div>
                  <div className="font-semibold text-sm" style={{ color: "#c9a84c" }}>সেন্টার</div>
                </div>
              </Link>

              <p className="text-sm leading-relaxed" style={{ color: "#94a3b8" }}>
                জ্ঞানের আলোয় আলোকিত ভবিষ্যৎ গড়ার লক্ষ্যে আমরা নিরলসভাবে কাজ করে যাচ্ছি। মানসম্পন্ন শিক্ষা ও নৈতিক মূল্যবোধ আমাদের মূল ভিত্তি।
              </p>

              <div className="space-y-2.5">
                {[
                  { text: "ঢাকা, বাংলাদেশ",              path: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z" },
                  { text: "+880 1XXX-XXXXXX",             path: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" },
                  { text: "info@ariyaneducation.com",     path: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
                ].map((c, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ background: "rgba(201,168,76,0.12)" }}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d={c.path}/>
                      </svg>
                    </div>
                    <span className="text-sm" style={{ color: "#94a3b8" }}>{c.text}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4">
                <div className="text-xs mb-2 font-semibold tracking-wide uppercase" style={{ color: "#c9a84c" }}>
                  আমাদের অবস্থান
                </div>

                <div
                  className="w-full h-40 rounded-xl overflow-hidden border"
                  style={{ borderColor: "rgba(255,255,255,0.08)" }}
                >
                  <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d130495.18488182833!2d89.8741244!3d24.2593849!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39fdfbc20f052825%3A0x6b2a56b91ca498e8!2sSP%20Park!5e1!3m2!1sen!2sbd!4v1774893703499!5m2!1sen!2sbd" width="600" height="450" style={{ border: "0" }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-1">
                {[
                  { label: "Facebook", href: "#", path: "M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" },
                  { label: "YouTube",  href: "#", path: "M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 00-1.95 1.96A29 29 0 001 12a29 29 0 00.46 5.58a2.78 2.78 0 001.95 1.95C5.12 20 12 20 12 20s6.88 0 8.59-.47a2.78 2.78 0 001.95-1.95A29 29 0 0023 12a29 29 0 00-.46-5.58z M9.75 15.02l5.75-3.02-5.75-3.02v6.04z" },
                ].map((s) => (
                  <a key={s.label} href={s.href}
                    className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-110 hover:border-yellow-400/40"
                    style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)" }}
                    aria-label={s.label}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d={s.path}/>
                    </svg>
                  </a>
                ))}
              </div>
            </div>

            {/* ── Menu columns ───────────────────────────────────────── */}
            <div className="lg:col-span-3 grid grid-cols-2 sm:grid-cols-3 gap-8">
              {menu.slice(0, 6).map((item: any, i: number) => (
                <div key={i}>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="w-1 h-4 rounded-full flex-shrink-0"
                      style={{ background: "linear-gradient(180deg, #c9a84c, #f0c040)" }} />
                    <h3 className="text-white font-semibold text-sm">{item.title}</h3>
                  </div>

                  <ul className="space-y-2.5">
                    {item.submenu?.length > 0 ? (
                      item.submenu.map((sub: any) => (
                        <li key={sub.slug}>
                          {/* ✅ Pure CSS hover — no event handlers */}
                          <Link
                            href={`/${sub.slug}`}
                            className="flex items-center gap-2 text-sm group/link w-fit"
                            style={{ color: "#64748b" }}
                          >
                            <span className="w-1 h-1 rounded-full flex-shrink-0 group-hover/link:bg-yellow-400 transition-colors duration-200"
                              style={{ background: "#334155" }} />
                            <span className="group-hover/link:text-yellow-400 group-hover/link:translate-x-0.5 transition-all duration-200">
                              {sub.title}
                            </span>
                          </Link>
                        </li>
                      ))
                    ) : (
                      <li>
                        <Link
                          href={`/${item.slug}`}
                          className="flex items-center gap-2 text-sm group/link w-fit"
                          style={{ color: "#64748b" }}
                        >
                          <span className="w-1 h-1 rounded-full flex-shrink-0 group-hover/link:bg-yellow-400 transition-colors duration-200"
                            style={{ background: "#334155" }} />
                          <span className="group-hover/link:text-yellow-400 group-hover/link:translate-x-0.5 transition-all duration-200">
                            বিস্তারিত দেখুন
                          </span>
                        </Link>
                      </li>
                    )}
                  </ul>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* ── Bottom bar ───────────────────────────────────────────────── */}
      <div style={{ background: "#060d18", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs" style={{ color: "#475569" }}>
            © {year} আরিয়ান এডুকেশন সেন্টার — সকল স্বত্ব সংরক্ষিত
          </p>
          <div className="flex items-center gap-4">
            {[
              { label: "নোটিশ",   href: "/notices" },
              { label: "ফলাফল",   href: "/results" },
              { label: "যোগাযোগ", href: "/institution-contact" },
            ].map((l) => (
              <Link key={l.href} href={l.href}
                className="text-xs transition-colors hover:text-white"
                style={{ color: "#475569" }}>
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}