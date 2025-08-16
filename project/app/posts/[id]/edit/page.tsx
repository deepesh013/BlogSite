import { notFound, redirect } from "next/navigation"
import { getPostById } from "@/lib/posts"
import { getSession } from "@/lib/session"
import { PostForm } from "@/components/posts/post-form"

interface EditPostPageProps {
  params: Promise<{ id: string }>
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const { id } = await params
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  const post = await getPostById(Number.parseInt(id))

  if (!post) {
    notFound()
  }

  // Only allow the author to edit their own post
  if (session.user.id !== post.author_id) {
    redirect("/")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <PostForm post={post} mode="edit" />
    </div>
  )
}
