/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import "react-quill-new/dist/quill.snow.css"
import AdminResultUpload from "@/components/AdminResultUpload"
import AdminStaffTable from "@/components/Adminstafftable"
import AdminNotices from "@/components/AdminNotices"
import AdminVideoGallery from "@/components/AdminVideoGallery"
import AdminPhotoGallery from "@/components/AdminPhotoGallery"
import AdminBannerUpload from "@/components/AdminBannerUpload"

// ✅ React Quill must be dynamically imported — it breaks on SSR
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false })

// Full toolbar config
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
  "align",
  "list", "indent",
  "blockquote", "code-block",
  "link", "image",
]

export default function AdminPage() {
  const [menu, setMenu] = useState<any[]>([])
  const [parentSlug, setParentSlug] = useState("")
  const [subSlug, setSubSlug] = useState("")
  const [pageSlug, setPageSlug] = useState("")
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null)
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showBanner, setShowBanner] = useState(false)
  

  useEffect(() => { setMounted(true) }, [])

  // Fetch menu
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

  // Fetch page content when slug changes
  useEffect(() => {
    if (!pageSlug) return
    setLoading(true)
    fetch(`/api/admin/page?slug=${pageSlug}`)
      .then(res => res.json())
      .then(data => {
        console.log(data,"data");
        
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
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: pageSlug, title, content }),
      })
      const result = await res.json()
      setMessage({ text: result.message || "Saved successfully ✓", type: "success" })
    } catch {
      setMessage({ text: "Save failed. Try again.", type: "error" })
    }
    setTimeout(() => setMessage(null), 3000)
  }

  if (!mounted) return null

  console.log(parentSlug,"parentSlug");
  

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Admin Panel</h1>
 
        <button
          onClick={() => setShowBanner((v) => !v)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors
            ${showBanner
              ? "bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
              : "bg-indigo-600 text-white hover:bg-indigo-700"
            }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {showBanner ? "← পেজ এডিটরে ফিরুন" : "ব্যানার ছবি"}
        </button>
      </div>
      {showBanner ? (
        <AdminBannerUpload />
      ) : (
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
      { parentSlug !== "notices" && (<div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
        <input
          className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Page title..."
        />
      </div>)
      }

      { parentSlug === "notices" ? <AdminNotices /> :
       pageSlug === "results"
        ? <AdminResultUpload /> :
        pageSlug === "staff" ? <AdminStaffTable /> :
        pageSlug === "academic-photos" ? <AdminPhotoGallery /> :
        pageSlug === "academic-videos" ? <AdminVideoGallery /> :
        (<div className="mb-6">
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
    )
}
</div>
      )}

      {/* Save button */}
      <button
        onClick={handleSave}
        disabled={!pageSlug}
        className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Save Changes
      </button>


      {/* Feedback message */}
      {message && (
        <p className={`mt-3 font-medium ${message.type === "success" ? "text-green-600" : "text-red-600"}`}>
          {message.text}
        </p>
      )}
    </div>
  )
}