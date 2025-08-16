import { notFound } from "next/navigation"
import { getPostById } from "@/lib/posts"
import { getSession } from "@/lib/session"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Edit, Trash2, User, Calendar } from "lucide-react"
import Link from "next/link"

interface PostPageProps {
  params: Promise<{ id: string }>
}

export default async function PostPage({ params }: PostPageProps) {
  const { id } = await params
  const session = await getSession()

  if (!session) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
        <p className="text-muted-foreground mb-4">You must be logged in to view posts.</p>
        <Link href="/login">
          <Button>Login</Button>
        </Link>
      </div>
    )
  }

  const post = await getPostById(Number.parseInt(id))

  if (!post) {
    notFound()
  }

  const isOwner = session.user.id === post.author_id
  const formattedDate = new Date(post.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-3xl mb-4">{post.title}</CardTitle>
              <CardDescription className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  {post.author_name}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {formattedDate}
                </span>
              </CardDescription>
            </div>
            {isOwner && (
              <div className="flex gap-2">
                <Link href={`/posts/${post.id}/edit`}>
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                </Link>
                <form
                  action={async () => {
                    "use server"
                    // Delete functionality will be implemented
                  }}
                >
                  <Button variant="destructive" size="sm" type="submit">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </form>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none">
            <p className="whitespace-pre-wrap text-foreground leading-relaxed">{post.content}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
