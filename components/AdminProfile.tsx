/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import dynamic from "next/dynamic"
import "react-quill-new/dist/quill.snow.css"

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

interface Props {
  type : "founder" | "principal"
  label: string
}

export default function AdminProfile({ type, label }: Props) {
  const [name,        setName]        = useState("")
  const [description, setDescription] = useState("")
  const [bani,        setBani]        = useState("")   // ← new
  const [photo,       setPhoto]       = useState("")
  const [file,        setFile]        = useState<File | null>(null)
  const [preview,     setPreview]     = useState<string | null>(null)
  const [loading,     setLoading]     = useState(true)
  const [saving,      setSaving]      = useState(false)
  const [message,     setMessage]     = useState<{ text: string; type: "success" | "error" } | null>(null)
  const fileRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    fetch(`/api/admin/profile?type=${type}`)
      .then(r => r.json())
      .then(data => {
        setName(data.name               ?? "")
        setDescription(data.description ?? "")
        setBani(data.bani               ?? "")   // ← new
        setPhoto(data.photo             ?? "")
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [type])

  const showMsg = (text: string, t: "success" | "error") => {
    setMessage({ text, type: t })
    setTimeout(() => setMessage(null), 3500)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null
    setFile(f)
    setPreview(f ? URL.createObjectURL(f) : null)
  }

  const handleSave = async () => {
    if (!name.trim()) return showMsg("নাম লিখুন।", "error")
    setSaving(true)

    const formData = new FormData()
    formData.append("type",        type)
    formData.append("name",        name)
    formData.append("description", description)
    formData.append("bani",        bani)   // ← new
    if (file) formData.append("photo", file)

    try {
      const res  = await fetch("/api/admin/profile", { method: "POST", body: formData })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      if (preview) setPhoto(preview)
      setFile(null)
      setPreview(null)
      if (fileRef.current) fileRef.current.value = ""
      showMsg(data.message, "success")
    } catch (e: any) {
      showMsg(e.message ?? "সংরক্ষণ ব্যর্থ হয়েছে।", "error")
    } finally {
      setSaving(false)
    }
  }

  const currentPhoto = preview || photo

  if (loading) {
    return (
      <div className="p-6 max-w-4xl mx-auto flex items-center justify-center h-64 text-gray-400 text-sm">
        লোড হচ্ছে...
      </div>
    )
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
          <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-800">{label} পরিচিতি</h2>
          <p className="text-xs text-gray-400">নাম, ছবি, বিবরণ ও বাণী আপডেট করুন</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-6">

        {/* Photo */}
        <div className="flex items-center gap-5">
          <div
            onClick={() => fileRef.current?.click()}
            className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-amber-100 bg-gray-100 cursor-pointer shrink-0 hover:opacity-90 transition-opacity"
          >
            {currentPhoto ? (
              <Image src={currentPhoto} alt={label} fill className="object-cover" sizes="96px" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50">
                <svg className="w-8 h-8 text-amber-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
                </svg>
              </div>
            )}
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded-full">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-700 mb-1">ছবি</p>
            <p className="text-xs text-gray-400 mb-2">বৃত্তাকার ছবিতে ক্লিক করে পরিবর্তন করুন</p>
            <button
              onClick={() => fileRef.current?.click()}
              className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
            >
              {file ? file.name : "ছবি বেছে নিন"}
            </button>
            <input type="file" accept="image/*" ref={fileRef} onChange={handleFileChange} className="hidden" />
          </div>
        </div>

        <div className="border-t border-gray-100" />

        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            নাম <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder={`${label}-এর পূর্ণ নাম লিখুন`}
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 transition-shadow"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">বিবরণ</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={4}
            placeholder={`${label} সম্পর্কে বিস্তারিত লিখুন...`}
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 transition-shadow resize-none leading-relaxed"
          />
        </div>

        {/* Bani — rich text editor */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            বাণী
            <span className="ml-2 text-xs font-normal text-gray-400">(উদ্ধৃতি হিসেবে প্রদর্শিত হবে)</span>
          </label>
          <textarea name="" value={bani}
            onChange={e => setBani(e.target.value)} id="" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 transition-shadow resize-none leading-relaxed" placeholder={`${label}-এর বিশেষ বাণী বা উক্তি লিখুন...`} rows={4}></textarea>
          {/* <ReactQuill
            theme="snow"
            value={bani}
            onChange={setBani}
            modules={quillModules}
            formats={quillFormats}
            placeholder={`${label}-এর বিশেষ বাণী বা উক্তি লিখুন...`}
            style={{ height: "160px", marginBottom: "50px" }}
          /> */}
        </div>

        {/* Save */}
        <div className="flex items-center gap-4 pt-10">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            )}
            {saving ? "সংরক্ষণ হচ্ছে..." : "সংরক্ষণ করুন"}
          </button>

          {message && (
            <p className={`text-sm font-medium ${message.type === "success" ? "text-green-600" : "text-red-600"}`}>
              {message.text}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}