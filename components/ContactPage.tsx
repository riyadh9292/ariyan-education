"use client"

interface Props {
  content: string  // HTML from Quill / raw text stored in MongoDB
  title : string  // Optional title for the contact page
}

// Parse plain-text lines like "ফোন: 01XXXXXXX" into structured rows
// Falls back to rendering raw HTML if content looks like rich HTML
function parseContactLines(raw: string) {
  const stripped = raw.replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").trim()
  return stripped
    .split(/\n|<br\s*\/?>/)
    .map(l => l.trim())
    .filter(Boolean)
}

function iconFor(line: string) {
  const l = line.toLowerCase()
  if (l.includes("ফোন") || l.includes("phone") || l.includes("মোবাইল") || l.includes("01"))
    return (
      <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    )
  if (l.includes("ইমেইল") || l.includes("email") || l.includes("@"))
    return (
      <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    )
  if (l.includes("সময়") || l.includes("অফিস") || l.includes("time"))
    return (
      <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  if (l.includes("ঠিকানা") || l.includes("address") || l.includes("রোড") || l.includes("গ্রাম"))
    return (
      <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    )
  // default
  return (
    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

export default function ContactPage({ content, title }: Props) {
  const lines = parseContactLines(content)
  const isRichHtml = /<(p|ul|ol|h[1-6]|strong|em|br)\b/i.test(content)

  return (
    <section className="w-full">
      {/* ── Outer card — same navy/gold language as NoticeBoard ── */}
      <div
        className="relative rounded-3xl overflow-hidden"
        style={{
          background: "linear-gradient(145deg, #0f1b2d 0%, #1e3a5f 60%, #1a3060 100%)",
          boxShadow : "0 25px 60px rgba(15,27,45,0.35), 0 8px 20px rgba(15,27,45,0.2)",
        }}
      >
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(201,168,76,0.10) 0%, transparent 70%)", transform: "translate(35%,-35%)" }} />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(37,99,235,0.13) 0%, transparent 70%)", transform: "translate(-35%,35%)" }} />

        {/* Gold top accent */}
        <div className="h-1 w-full" style={{ background: "linear-gradient(90deg,#c9a84c,#f0c040,#c9a84c)" }} />

        <div className="relative z-10 p-6 sm:p-8">

          {/* Header */}
          <div className="flex items-center gap-3 mb-7">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: "rgba(201,168,76,0.15)", border: "1px solid rgba(201,168,76,0.3)" }}>
              <svg className="w-5 h-5" fill="none" stroke="#f0c040" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white leading-tight">{title}</h2>
              <p className="text-sm mt-0.5" style={{ color: "rgba(255,255,255,0.45)" }}>আমাদের সাথে যোগাযোগ করুন</p>
            </div>
          </div>

          {/* ── Two-column body ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

            {/* LEFT — contact info card */}
            <div className="rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.97)" }}>
              {/* <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full" style={{ background: "#f0c040" }} />
                <span className="text-sm font-semibold text-gray-700">যোগাযোগ তথ্য</span>
              </div> */}

              <div className="p-5">
                {isRichHtml ? (
                  // Render rich HTML from Quill as-is
                  <div
                    className="text-sm text-gray-700 leading-7 space-y-1"
                    dangerouslySetInnerHTML={{ __html: content }}
                  />
                ) : lines.length > 0 ? (
                  <ul className="space-y-4">
                    {lines.map((line, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span
                          className="mt-0.5 w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                          style={{ background: "linear-gradient(135deg,#1e3a5f,#2563eb)", color: "white" }}
                        >
                          {iconFor(line)}
                        </span>
                        <span className="text-sm text-gray-700 leading-snug pt-1">{line}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-400">যোগাযোগ তথ্য শীঘ্রই যুক্ত করা হবে।</p>
                )}
              </div>

              {/* Social row */}
              <div className="px-5 py-4 border-t border-gray-100 flex items-center gap-3">
                <span className="text-xs text-gray-400 font-medium">সোশ্যাল মিডিয়া:</span>
                {[
                  {
                    label: "WhatsApp",
                    href: "https://wa.me/8801768782036",
                    color: "#25D366",
                    icon: "M20.52 3.48A11.94 11.94 0 0012.02 0C5.39 0 .02 5.37.02 12c0 2.11.55 4.16 1.6 5.97L0 24l6.19-1.62A11.95 11.95 0 0012.02 24c6.63 0 12-5.37 12-12 0-3.2-1.25-6.21-3.5-8.52zM12.02 21.82c-1.83 0-3.62-.49-5.18-1.42l-.37-.22-3.67.96.98-3.58-.24-.37A9.8 9.8 0 1121.82 12c0 5.42-4.39 9.82-9.8 9.82zm5.37-7.37c-.29-.15-1.71-.84-1.98-.93-.27-.1-.46-.15-.65.15-.19.29-.75.93-.92 1.12-.17.19-.34.22-.63.07-.29-.15-1.23-.45-2.35-1.43-.87-.77-1.46-1.72-1.63-2.01-.17-.29-.02-.45.13-.6.13-.13.29-.34.43-.51.15-.17.19-.29.29-.49.1-.19.05-.36-.02-.51-.07-.15-.65-1.56-.9-2.14-.24-.57-.48-.49-.65-.5h-.55c-.19 0-.49.07-.75.36-.26.29-1 1-1 2.44 0 1.43 1.03 2.82 1.17 3.02.15.19 2.02 3.09 4.9 4.33.69.3 1.23.48 1.65.61.69.22 1.32.19 1.82.12.56-.08 1.71-.7 1.95-1.37.24-.67.24-1.25.17-1.37-.07-.12-.26-.19-.55-.34z"
                  },
                  { label: "Facebook",href: "https://www.facebook.com/ariyanskilledtangail", color: "#1877F2", icon: "M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" },
                  {
                    label: "LinkedIn",
                    href: "https://www.linkedin.com/in/ariyan-skilled-academy-tangail/",
                    color: "#0A66C2",
                    icon: "M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2zM4 2a2 2 0 110 4 2 2 0 010-4z"
                  },
                ].map(({ label, color, icon, href }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={label}
                    className="w-8 h-8 rounded-full flex items-center justify-center transition-transform hover:scale-110"
                    style={{ background: color }}
                  >
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d={icon} />
                    </svg>
                  </a>
                ))}
              </div>
            </div>

            {/* RIGHT — map */}
            <div className="rounded-2xl overflow-hidden relative" style={{ minHeight: "320px" }}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d32625.41018631367!2d89.88921980156044!3d24.253094441214433!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39fdfb00689d8f87%3A0x3fd0a156948a89bf!2sAriyan%20Skilled%20Academy!5e1!3m2!1sen!2sbd!4v1774929422541!5m2!1sen!2sbd"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: "320px" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="প্রতিষ্ঠানের অবস্থান"
                className="absolute inset-0 w-full h-full"
              />
              {/* Map label */}
              <div
                className="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg"
                style={{ background: "rgba(15,27,45,0.85)", color: "#f0c040", backdropFilter: "blur(4px)" }}
              >
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
                আমাদের অবস্থান
              </div>
            </div>

          </div>
        </div>

        {/* Bottom shimmer */}
        <div className="h-0.5 w-full"
          style={{ background: "linear-gradient(90deg,transparent,rgba(201,168,76,0.4),transparent)" }} />
      </div>
    </section>
  )
}