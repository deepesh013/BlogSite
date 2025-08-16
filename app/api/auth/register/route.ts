import { type NextRequest, NextResponse } from "next/server"
import { createUser } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { email, username, password } = await request.json()

    if (!email || !username || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 })
    }

    const user = await createUser(email, username, password)

    if (!user) {
      return NextResponse.json(
        { error: "Failed to create user - username or email may already exist" },
        { status: 500 },
      )
    }

    return NextResponse.json({ success: true, user: { id: user.id, username: user.username, email: user.email } })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
