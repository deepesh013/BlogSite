import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { User, Calendar, Lock } from "lucide-react"
import type { Post } from "@/lib/auth"

interface PostPreviewProps {
  post: Post
  isAuthenticated: boolean
}

export function PostPreview({ post, isAuthenticated }: PostPreviewProps) {
  const formattedDate = new Date(post.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  const previewContent = post.content.length > 150 ? `${post.content.substring(0, 150)}...` : post.content

  return (
    <Card className="w-full hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="text-xl mb-2">
          {isAuthenticated ? (
            <Link href={`/posts/${post.id}`} className="hover:underline">
              {post.title}
            </Link>
          ) : (
            <span>{post.title}</span>
          )}
        </CardTitle>
        <CardDescription className="flex items-center gap-4 text-sm">
          <span className="flex items-center gap-1">
            <User className="w-3 h-3" />
            {post.author_name}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {formattedDate}
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">{previewContent}</p>

        {isAuthenticated ? (
          <Link href={`/posts/${post.id}`}>
            <Button variant="link" className="p-0 h-auto">
              Read full post
            </Button>
          </Link>
        ) : (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Lock className="w-4 h-4" />
            <span>
              <Link href="/login" className="text-primary hover:underline">
                Login
              </Link>{" "}
              to read the full post
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
