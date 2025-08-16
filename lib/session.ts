import { cookies } from "next/headers"
import { sql } from "./db"
import type { User } from "./auth"

export async function createSession(userId: string): Promise<string> {
  const sessionId = crypto.randomUUID()
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days

  try {
    await sql`
      INSERT INTO sessions (id, user_id, expires_at)
      VALUES (${sessionId}, ${userId}, ${expiresAt})
      ON CONFLICT (id) DO UPDATE SET
        user_id = ${userId},
        expires_at = ${expiresAt}
    `

    console.log("[v0] Created session:", sessionId)
    return sessionId
  } catch (error) {
    console.error("Session creation error:", error)
    throw new Error("Failed to create session")
  }
}

export async function getSession(): Promise<{ user: User; sessionId: string } | null> {
  const cookieStore = await cookies()
  const sessionId = cookieStore.get("session")?.value

  console.log("[v0] Looking for session:", sessionId)

  if (!sessionId) {
    console.log("[v0] No session cookie found")
    return null
  }

  try {
    const sessions = await sql`
      SELECT s.*, u.id as user_id, u.username, u.email
      FROM sessions s
      JOIN users u ON s.user_id = u.id::text
      WHERE s.id = ${sessionId} AND s.expires_at > NOW()
      LIMIT 1
    `

    console.log("[v0] Session query result:", sessions)

    if (!sessions[0]) {
      console.log("[v0] No valid session found")
      return null
    }

    const session = sessions[0]
    const user: User = {
      id: session.user_id,
      username: session.username,
      email: session.email,
    }

    console.log("[v0] Session found for user:", user.username)
    return { user, sessionId }
  } catch (error) {
    console.error("Session retrieval error:", error)
    return null
  }
}

export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies()
  const sessionId = cookieStore.get("session")?.value

  if (sessionId) {
    try {
      await sql`DELETE FROM sessions WHERE id = ${sessionId}`
    } catch (error) {
      console.error("Session deletion error:", error)
    }
  }

  cookieStore.delete("session")
}
