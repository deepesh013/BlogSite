import { type NextRequest, NextResponse } from "next/server"
import { authenticateUser } from "@/lib/auth"
import { createSession } from "@/lib/session"

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json({ error: "Username and password are required" }, { status: 400 })
    }

    const user = await authenticateUser(username, password)

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    console.log("[v0] User authenticated:", user)
    const sessionId = await createSession(user.id)

    const response = NextResponse.json({
      success: true,
      user: { id: user.id, username: user.username, email: user.email },
    })

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    response.cookies.set("session", sessionId, {
      expires: expiresAt,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    })

    console.log("[v0] Session cookie set:", sessionId)
    return response
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
