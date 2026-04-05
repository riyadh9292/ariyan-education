/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import dynamic from "next/dynamic"
import "react-quill-new/dist/quill.snow.css"
import AdminResultUpload  from "@/components/AdminResultUpload"
import AdminStaffTable    from "@/components/Adminstafftable"
import AdminNotices       from "@/components/AdminNotices"
import AdminVideoGallery  from "@/components/AdminVideoGallery"
import AdminPhotoGallery  from "@/components/AdminPhotoGallery"
import AdminBannerUpload  from "@/components/AdminBannerUpload"
import AdminProfile       from "@/components/AdminProfile"
import AdminRoutineUpload  from "@/components/AdminRoutineUpload"
import AdminAdmissionQuestions from "@/components/AdminQuestionsUpload"
import AdminAdmissionResult from "@/components/AdminAdmissionResult"

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false })

const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, false] }],
    [{ font: [] }],
    [{ size: ["small", false, "large", "huge"] }],
    ["bold", "italic", "underline", "strike"],
    [{ color: [] }, { background: [] }],
    [{ align: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ indent: "-1" }, { indent: "+1" }],
    ["blockquote", "code-block"],
    ["link", "image"],
    ["clean"],
  ],
}

const quillFormats = [
  "header", "font", "size",
  "bold", "italic", "underline", "strike",
  "color", "background",
  "align", "list", "indent",
  "blockquote", "code-block",
  "link", "image",
]

// ── Auth constants ────────────────────────────────────────────
const REQUIRED_ADMIN = "mahabub"
const REQUIRED_PASS  = "ariyaneducation"

type Panel = "editor" | "banner" | "founder" | "principal"

// ── Login screen ─────────────────────────────────────────────
function LoginScreen({ onSuccess }: { onSuccess: () => void }) {
  const [password, setPassword] = useState("")
  const [showPass, setShowPass] = useState(false)
  const [error,    setError]    = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === REQUIRED_PASS) {
      sessionStorage.setItem("admin_authed", "true")
      onSuccess()
    } else {
      setError("পাসওয়ার্ড সঠিক নয়। আবার চেষ্টা করুন।")
      setPassword("")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4"
      style={{ background: "linear-gradient(145deg, #0f1b2d 0%, #1e3a5f 100%)" }}>

      {/* Blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(201,168,76,0.08) 0%, transparent 70%)", transform: "translate(30%,-30%)" }} />
      <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(37,99,235,0.1) 0%, transparent 70%)", transform: "translate(-30%,30%)" }} />

      <div className="relative z-10 w-full max-w-sm">
        <div className="rounded-3xl overflow-hidden shadow-2xl"
          style={{ background: "rgba(255,255,255,0.97)" }}>

          {/* Gold top line */}
          <div className="h-1 w-full"
            style={{ background: "linear-gradient(90deg, #c9a84c, #f0c040, #c9a84c)" }} />

          <div className="p-8">
            {/* Logo */}
            <div className="text-center mb-8">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg"
                style={{ background: "linear-gradient(135deg, #0f1b2d, #1e3a5f)" }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none"
                  stroke="#f0c040" strokeWidth="2" strokeLinecap="round">
                  <rect x="3" y="11" width="18" height="11" rx="2"/>
                  <path d="M7 11V7a5 5 0 0110 0v4"/>
                </svg>
              </div>
              <h1 className="text-xl font-bold text-gray-900">অ্যাডমিন প্যানেল</h1>
              <p className="text-xs text-gray-400 mt-1">আরিয়ান এডুকেশন সেন্টার</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  পাসওয়ার্ড
                </label>
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    value={password}
                    onChange={e => { setPassword(e.target.value); setError("") }}
                    placeholder="পাসওয়ার্ড লিখুন..."
                    autoFocus
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 pr-11 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-shadow"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(s => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPass ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
                        <line x1="1" y1="1" x2="23" y2="23"/>
                      </svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm"
                  style={{ background: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="15" y1="9" x2="9" y2="15"/>
                    <line x1="9" y1="9" x2="15" y2="15"/>
                  </svg>
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 active:scale-95"
                style={{ background: "linear-gradient(135deg, #0f1b2d, #1e3a5f)" }}
              >
                প্রবেশ করুন
              </button>
            </form>
          </div>
        </div>

        <p className="text-center text-xs mt-4"
          style={{ color: "rgba(255,255,255,0.25)" }}>
          শুধুমাত্র অনুমোদিত ব্যবহারকারীদের জন্য
        </p>
      </div>
    </div>
  )
}

// ── Blocked screen ────────────────────────────────────────────
function BlockedScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center"
      style={{ background: "linear-gradient(145deg, #0f1b2d, #1e3a5f)" }}>
      <div className="text-center px-6">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
          style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)" }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
            stroke="#f87171" strokeWidth="2" strokeLinecap="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="15" y1="9" x2="9" y2="15"/>
            <line x1="9" y1="9" x2="15" y2="15"/>
          </svg>
        </div>
        <h1 className="text-xl font-bold text-white mb-2">অ্যাক্সেস নিষিদ্ধ</h1>
        <p className="text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
          এই পেজে প্রবেশের অনুমতি নেই।
        </p>
      </div>
    </div>
  )
}

// ── Main admin content (unchanged logic) ─────────────────────
function AdminContent({ onLogout }: { onLogout: () => void }) {
  const [menu,       setMenu]       = useState<any[]>([])
  const [parentSlug, setParentSlug] = useState("")
  const [subSlug,    setSubSlug]    = useState("")
  const [pageSlug,   setPageSlug]   = useState("")
  const [title,      setTitle]      = useState("")
  const [content,    setContent]    = useState("")
  const [message,    setMessage]    = useState<{ text: string; type: "success" | "error" } | null>(null)
  const [mounted,    setMounted]    = useState(false)
  const [loading,    setLoading]    = useState(false)
  const [panel,      setPanel]      = useState<Panel>("editor")

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    fetch("/api/menu")
      .then(res => res.json())
      .then(data => setMenu(data))
      .catch(err => console.error("Failed to load menu:", err))
  }, [])

  const submenus = menu.find((item: any) => item.slug === parentSlug)?.submenu || []

  useEffect(() => {
    setSubSlug(submenus.length > 0 ? submenus[0].slug : "")
  }, [parentSlug]) // eslint-disable-line

  useEffect(() => {
    setPageSlug(subSlug || parentSlug)
  }, [parentSlug, subSlug])

  useEffect(() => {
    if (!pageSlug) return
    setLoading(true)
    fetch(`/api/admin/page?slug=${pageSlug}`)
      .then(res => res.json())
      .then(data => {
        setTitle(data.title ?? "")
        setContent(data.content ?? "")
      })
      .catch(err => console.error("Failed to load page:", err))
      .finally(() => setLoading(false))
  }, [pageSlug])

  const handleSave = async () => {
    if (!pageSlug) return
    try {
      const res = await fetch("/api/admin/page", {
        method : "POST",
        headers: { "Content-Type": "application/json" },
        body   : JSON.stringify({ slug: pageSlug, title, content }),
      })
      const result = await res.json()
      setMessage({ text: result.message || "Saved successfully ✓", type: "success" })
    } catch {
      setMessage({ text: "Save failed. Try again.", type: "error" })
    }
    setTimeout(() => setMessage(null), 3000)
  }

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Top bar ────────────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-3 flex-wrap sticky top-0 z-40 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-800 mr-auto">Admin Panel</h1>

        {/* চেয়ারম্যান */}
        <button
          onClick={() => setPanel(p => p === "founder" ? "editor" : "founder")}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all"
          style={panel === "founder"
            ? { background: "linear-gradient(135deg, #7c3aed, #6d28d9)", color: "white" }
            : { background: "#f3f4f6", color: "#4b5563" }
          }
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
          </svg>
          চেয়ারম্যান
          {panel === "founder" && <span className="w-1.5 h-1.5 rounded-full bg-white ml-1" />}
        </button>

        {/* ব্যবস্থাপনা পরিচালক */}
        <button
          onClick={() => setPanel(p => p === "principal" ? "editor" : "principal")}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all"
          style={panel === "principal"
            ? { background: "linear-gradient(135deg, #059669, #047857)", color: "white" }
            : { background: "#f3f4f6", color: "#4b5563" }
          }
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
          ব্যবস্থাপনা পরিচালক
          {panel === "principal" && <span className="w-1.5 h-1.5 rounded-full bg-white ml-1" />}
        </button>

        {/* ব্যানার ছবি */}
        <button
          onClick={() => setPanel(p => p === "banner" ? "editor" : "banner")}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all"
          style={panel === "banner"
            ? { background: "linear-gradient(135deg, #d97706, #b45309)", color: "white" }
            : { background: "#f3f4f6", color: "#4b5563" }
          }
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
          </svg>
          ব্যানার ছবি
          {panel === "banner" && <span className="w-1.5 h-1.5 rounded-full bg-white ml-1" />}
        </button>

        {/* Back to editor */}
        {panel !== "editor" && (
          <button
            onClick={() => setPanel("editor")}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium bg-gray-800 text-white hover:bg-gray-900 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
            </svg>
            পেজ এডিটর
          </button>
        )}

        {/* Logout */}
        <button
          onClick={onLogout}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 border border-red-200 transition-colors ml-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
          </svg>
          লগআউট
        </button>
      </div>

      {/* ── Panel content ───────────────────────────────────────── */}
      {panel === "founder"   ? <AdminProfile type="founder"   label="চেয়ারম্যান" /> :
       panel === "principal" ? <AdminProfile type="principal" label="ব্যবস্থাপনা পরিচালক" /> :
       panel === "banner"    ? <AdminBannerUpload /> : (

        <div className="p-6 max-w-4xl mx-auto">

          {/* Page selector */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Page</label>
            <select
              className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={parentSlug}
              onChange={e => setParentSlug(e.target.value)}
            >
              <option value="">-- Select page --</option>
              <optgroup label="বিশেষ পেজ">
                <option value="notices">নোটিশ বোর্ড</option>
              </optgroup>
              {menu.map((item: any) => (
                <option key={item.slug} value={item.slug}>{item.title}</option>
              ))}
            </select>
          </div>

          {/* Subpage selector */}
          {submenus.length > 0 && parentSlug !== "notices" && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Subpage</label>
              <select
                className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={subSlug}
                onChange={e => setSubSlug(e.target.value)}
              >
                {submenus.map((sub: any) => (
                  <option key={sub.slug} value={sub.slug}>{sub.title}</option>
                ))}
              </select>
            </div>
          )}

          {/* Title */}
          {parentSlug !== "notices" && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Page title..."
              />
            </div>
          )}

          {/* Dynamic content area */}
          {parentSlug === "notices"      ? <AdminNotices /> :
           pageSlug   === "results"      ? <AdminResultUpload /> :
           pageSlug   === "staff"        ? <AdminStaffTable /> :
           pageSlug   === "academic-photos" ? <AdminPhotoGallery /> :
           pageSlug   === "academic-videos" ? <AdminVideoGallery />:
           pageSlug   === "class-routine" ? <AdminRoutineUpload /> :
           pageSlug   === "questions" ? <AdminAdmissionQuestions /> :
           pageSlug   === "result" ? <AdminAdmissionResult /> : (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
              {loading ? (
                <div className="border rounded-lg h-64 flex items-center justify-center text-gray-400">
                  Loading content...
                </div>
              ) : (
                <ReactQuill
                  theme="snow"
                  value={content}
                  onChange={setContent}
                  modules={quillModules}
                  formats={quillFormats}
                  placeholder="Write page content here..."
                  style={{ height: "300px", marginBottom: "50px" }}
                />
              )}
            </div>
          )}

          {/* Save button */}
          <button
            onClick={handleSave}
            disabled={!pageSlug}
            className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-40 disabled:cursor-not-allowed mt-4"
          >
            Save Changes
          </button>

          {message && (
            <p className={`mt-3 font-medium ${message.type === "success" ? "text-green-600" : "text-red-600"}`}>
              {message.text}
            </p>
          )}
        </div>
      )}
    </div>
  )
}

// ── Root: auth gate ───────────────────────────────────────────
function AdminGate() {
  const searchParams = useSearchParams()
  const adminParam   = searchParams.get("admin")
  const [authed,   setAuthed]  = useState(false)
  const [checked,  setChecked] = useState(false)

  useEffect(() => {
    if (sessionStorage.getItem("admin_authed") === "true") setAuthed(true)
    setChecked(true)
  }, [])

  const handleLogout = () => {
    sessionStorage.removeItem("admin_authed")
    setAuthed(false)
  }

  if (!checked) return null

  // Wrong / missing ?admin= param
  if (adminParam !== REQUIRED_ADMIN) return <BlockedScreen />

  // Correct param but not yet authenticated
  if (!authed) return <LoginScreen onSuccess={() => setAuthed(true)} />

  // Authenticated
  return <AdminContent onLogout={handleLogout} />
}

// ── Export: Suspense required for useSearchParams ─────────────
export default function AdminPage() {
  return (
    <Suspense>
      <AdminGate />
    </Suspense>
  )
}