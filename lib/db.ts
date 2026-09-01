import { env } from 'cloudflare:workers'
import { drizzle } from 'drizzle-orm/d1'

let db: D1Database | null = null

export function getDB(): D1Database {
  if (!db) {
    db = env.DB
  }
  return db
}

let drizzleInstance: ReturnType<typeof drizzle> | null = null

export function getDrizzle() {
  if (!drizzleInstance) {
    drizzleInstance = drizzle(getDB())
  }
  return drizzleInstance
}

export function getR2(): R2Bucket {
  return env.MEDIA
}
