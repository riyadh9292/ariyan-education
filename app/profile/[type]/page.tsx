import { connectDB } from "@/lib/mongodb"

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ type: string }>
}) {
  const { type } = await params

  const { db } = await connectDB()

  const doc = await db.collection("site_profiles").findOne({ type })

  if (!doc) {
    return <div className="p-10 text-center">Profile not found</div>
  }

  return (
    <div className="max-w-3xl mx-auto py-16 px-6 text-center">
      <h1 className="text-3xl font-bold mb-6 capitalize">{type}</h1>

      {doc.photo && (
        <img
          src={doc.photo}
          alt={doc.name}
          className="mx-auto w-48 h-48 object-cover rounded-full mb-6"
        />
      )}

      <h2 className="text-xl font-semibold mb-4">{doc.name}</h2>

      <div
        className="text-gray-700 leading-7"
        dangerouslySetInnerHTML={{ __html: doc.description || "" }}
      />
    </div>
  )
}