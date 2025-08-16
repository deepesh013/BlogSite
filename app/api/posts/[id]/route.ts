import { type NextRequest, NextResponse } from "next/server"
import { updatePost, deletePost } from "@/lib/posts"
import { getSession } from "@/lib/session"

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { title, content } = await request.json()

    if (!title || !content) {
      return NextResponse.json({ error: "Title and content are required" }, { status: 400 })
    }

    const post = await updatePost(Number.parseInt(id), title, content, session.user.id)

    if (!post) {
      return NextResponse.json({ error: "Failed to update post or unauthorized" }, { status: 500 })
    }

    return NextResponse.json({ post })
  } catch (error) {
    console.error("Update post error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const success = await deletePost(Number.parseInt(id), session.user.id)

    if (!success) {
      return NextResponse.json({ error: "Failed to delete post or unauthorized" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete post error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
