import { PostForm } from "@/components/posts/post-form"
import { getSession } from "@/lib/session"
import { redirect } from "next/navigation"

export default async function CreatePostPage() {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <PostForm mode="create" />
    </div>
  )
}
