"use client"
import { useEffect, useRef, useState } from "react"

interface StaffMember {
  id: string
  name: string
  photo: string
  address: string
  email: string
  mobile: string
}

const EMPTY_ROW = (): StaffMember => ({
  id: Date.now().toString() + Math.random(),
  name: "",
  photo: "",
  address: "",
  email: "",
  mobile: "",
})

export default function AdminStaffTable() {
  const [staff, setStaff] = useState<StaffMember[]>([])
  const [loading, setLoading] = useState(true)
  const [savingId, setSavingId] = useState<string | null>(null)
  const [uploadingId, setUploadingId] = useState<string | null>(null)
  const [errors, setErrors] = useState<Record<string, string[]>>({})
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null)
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({})

  useEffect(() => {
    fetch("/api/admin/staff")
      .then((r) => r.json())
      .then((data) => setStaff(Array.isArray(data) ? data : []))
      .catch(() => setStaff([]))
      .finally(() => setLoading(false))
  }, [])

  const updateField = (id: string, field: keyof StaffMember, value: string) => {
    setStaff((prev) => prev.map((s) => (s.id === id ? { ...s, [field]: value } : s)))
    // Clear error for that field when user types
    setErrors((prev) => {
      const rowErrors = (prev[id] || []).filter((f) => f !== field)
      return { ...prev, [id]: rowErrors }
    })
  }

  const handlePhotoUpload = async (id: string, file: File) => {
    setUploadingId(id)
    try {
      const formData = new FormData()
      formData.append("image", file)
      const res = await fetch("/api/admin/upload-image", { method: "POST", body: formData })
      const data = await res.json()
      if (!data.url) throw new Error("No URL returned")
      updateField(id, "photo", data.url)
    } catch {
      setMessage({ text: "ছবি আপলোড ব্যর্থ হয়েছে। আবার চেষ্টা করুন।", type: "error" })
      setTimeout(() => setMessage(null), 3000)
    } finally {
      setUploadingId(null)
    }
  }

  const addRow = () => {
    setStaff((prev) => [...prev, EMPTY_ROW()])
  }

  const deleteRow = async (id: string) => {
    const updated = staff.filter((s) => s.id !== id)
    setStaff(updated)
    setErrors((prev) => {
      const next = { ...prev }
      delete next[id]
      return next
    })
    try {
      await fetch("/api/admin/staff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      })
      setMessage({ text: "সারি মুছে ফেলা হয়েছে।", type: "success" })
    } catch {
      setMessage({ text: "মুছতে ব্যর্থ হয়েছে। আবার চেষ্টা করুন।", type: "error" })
    }
    setTimeout(() => setMessage(null), 3000)
  }

  const handleSaveRow = async (id: string) => {
    const member = staff.find((s) => s.id === id)
    if (!member) return
    const missing: string[] = []
    if (!member.name.trim()) missing.push("name")
    if (!member.photo.trim()) missing.push("photo")
    if (!member.address.trim()) missing.push("address")
    if (!member.email.trim()) missing.push("email")
    if (!member.mobile.trim()) missing.push("mobile")
    if (missing.length > 0) {
      setErrors((prev) => ({ ...prev, [id]: missing }))
      setMessage({ text: "সারির সকল তথ্য পূরণ করুন।", type: "error" })
      setTimeout(() => setMessage(null), 3000)
      return
    }
    setSavingId(id)
    try {
      await fetch("/api/admin/staff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(staff),
      })
      setMessage({ text: "সফলভাবে সংরক্ষিত হয়েছে ✓", type: "success" })
    } catch {
      setMessage({ text: "সংরক্ষণ ব্যর্থ হয়েছে। আবার চেষ্টা করুন।", type: "error" })
    } finally {
      setSavingId(null)
      setTimeout(() => setMessage(null), 3000)
    }
  }

  const hasError = (id: string, field: string) => errors[id]?.includes(field)

  if (loading) {
    return (
      <div className="border rounded-lg h-40 flex items-center justify-center text-gray-400 text-sm">
        লোড হচ্ছে...
      </div>
    )
  }

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">শিক্ষক ও কর্মচারী তালিকা</label>

      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left px-3 py-3 font-semibold text-gray-600 w-8">#</th>
              <th className="text-left px-3 py-3 font-semibold text-gray-600 min-w-[140px]">নাম</th>
              <th className="text-left px-3 py-3 font-semibold text-gray-600 min-w-[110px]">ছবি</th>
              <th className="text-left px-3 py-3 font-semibold text-gray-600 min-w-[160px]">ঠিকানা</th>
              <th className="text-left px-3 py-3 font-semibold text-gray-600 min-w-[170px]">ইমেইল</th>
              <th className="text-left px-3 py-3 font-semibold text-gray-600 min-w-[130px]">মোবাইল</th>
              <th className="px-3 py-3 w-20"></th>
            </tr>
          </thead>

          <tbody>
            {staff.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-8 text-gray-400 text-sm">
                  কোনো তথ্য নেই। নিচের + বাটনে ক্লিক করে নতুন সারি যোগ করুন।
                </td>
              </tr>
            )}

            {staff.map((member, index) => (
              <tr key={member.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                {/* Index */}
                <td className="px-3 py-2 text-gray-400 text-xs">{index + 1}</td>

                {/* নাম */}
                <td className="px-3 py-2">
                  <input
                    type="text"
                    value={member.name}
                    onChange={(e) => updateField(member.id, "name", e.target.value)}
                    placeholder="পূর্ণ নাম"
                    className={`w-full border rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                      hasError(member.id, "name") ? "border-red-400 bg-red-50" : "border-gray-200"
                    }`}
                  />
                </td>

                {/* ছবি */}
                <td className="px-3 py-2">
                  <div className="flex items-center gap-2">
                    {member.photo ? (
                      <img
                        src={member.photo}
                        alt="ছবি"
                        className="w-9 h-9 rounded-full object-cover border border-gray-200 shrink-0"
                      />
                    ) : (
                      <div
                        className={`w-9 h-9 rounded-full border-2 border-dashed flex items-center justify-center shrink-0 ${
                          hasError(member.id, "photo") ? "border-red-400 bg-red-50" : "border-gray-300 bg-gray-50"
                        }`}
                      >
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                    )}

                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      ref={(el) => { fileRefs.current[member.id] = el }}
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) handlePhotoUpload(member.id, file)
                      }}
                    />

                    <button
                      onClick={() => fileRefs.current[member.id]?.click()}
                      disabled={uploadingId === member.id}
                      className="text-xs px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors disabled:opacity-50 whitespace-nowrap"
                    >
                      {uploadingId === member.id ? "আপলোড..." : member.photo ? "বদলান" : "আপলোড"}
                    </button>
                  </div>
                </td>

                {/* ঠিকানা */}
                <td className="px-3 py-2">
                  <input
                    type="text"
                    value={member.address}
                    onChange={(e) => updateField(member.id, "address", e.target.value)}
                    placeholder="বর্তমান ঠিকানা"
                    className={`w-full border rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                      hasError(member.id, "address") ? "border-red-400 bg-red-50" : "border-gray-200"
                    }`}
                  />
                </td>

                {/* ইমেইল */}
                <td className="px-3 py-2">
                  <input
                    type="email"
                    value={member.email}
                    onChange={(e) => updateField(member.id, "email", e.target.value)}
                    placeholder="example@email.com"
                    className={`w-full border rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                      hasError(member.id, "email") ? "border-red-400 bg-red-50" : "border-gray-200"
                    }`}
                  />
                </td>

                {/* মোবাইল */}
                <td className="px-3 py-2">
                  <input
                    type="tel"
                    value={member.mobile}
                    onChange={(e) => updateField(member.id, "mobile", e.target.value)}
                    placeholder="01XXXXXXXXX"
                    className={`w-full border rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                      hasError(member.id, "mobile") ? "border-red-400 bg-red-50" : "border-gray-200"
                    }`}
                  />
                </td>

                {/* Save + Delete */}
                <td className="px-3 py-2">
                  <div className="flex items-center gap-1">
                    {/* Checkmark — save this row */}
                    <button
                      onClick={() => handleSaveRow(member.id)}
                      disabled={savingId === member.id}
                      className="text-green-500 hover:text-green-700 transition-colors p-1 rounded hover:bg-green-50 disabled:opacity-40"
                      title="সংরক্ষণ করুন"
                    >
                      {savingId === member.id ? (
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => deleteRow(member.id)}
                      className="text-red-400 hover:text-red-600 transition-colors p-1 rounded hover:bg-red-50"
                      title="মুছুন"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add row button */}
      <button
        onClick={addRow}
        className="mt-3 flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 font-medium px-3 py-2 rounded-lg hover:bg-blue-50 transition-colors border border-dashed border-blue-300 w-full justify-center"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        নতুন সারি যোগ করুন
      </button>

      {/* Feedback toast */}
      {message && (
        <p className={`mt-3 text-sm font-medium ${message.type === "success" ? "text-green-600" : "text-red-600"}`}>
          {message.text}
        </p>
      )}
    </div>
  )
}