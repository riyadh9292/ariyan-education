import { MongoClient, GridFSBucket, Db } from "mongodb"

const MONGODB_URI = process.env.MONGODB_URI!

if (!MONGODB_URI) {
  throw new Error("Please define MONGODB_URI in .env.local")
}

let cachedClient: MongoClient | null = null
let cachedDb: Db | null = null

export async function connectDB(): Promise<{ client: MongoClient; db: Db }> {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb }
  }
  const client = await MongoClient.connect(MONGODB_URI)
  const db = client.db()
  cachedClient = client
  cachedDb = db
  return { client, db }
}


export async function getGridFSBucket(): Promise<GridFSBucket> {
  const { db } = await connectDB()
  return new GridFSBucket(db, { bucketName: "results" })
}

export async function getNoticesBucket(): Promise<GridFSBucket> {
  const { db } = await connectDB()
  return new GridFSBucket(db, { bucketName: "noticesFiles" })
}

export async function getCollection(name: string) {
  const { db } = await connectDB()
  return db.collection(name)
}