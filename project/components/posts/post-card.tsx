"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Edit, Trash2, User, Calendar } from "lucide-react"
import type { Post } from "@/lib/auth"

interface PostCardProps {
  post: Post
  currentUserId?: string
  showActions?: boolean
}

export function PostCard({ post, currentUserId, showActions = true }: PostCardProps) {
  const isOwner = currentUserId === post.author_id
  const formattedDate = new Date(post.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this post?")) return

    try {
      const response = await fetch(`/api/posts/${post.id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        window.location.reload()
      } else {
        alert("Failed to delete post")
      }
    } catch (error) {
      alert("An error occurred while deleting the post")
    }
  }

  return (
    <Card className="w-full hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-xl mb-2">
              <Link href={`/posts/${post.id}`} className="hover:underline">
                {post.title}
              </Link>
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
          </div>
          {showActions && isOwner && (
            <div className="flex gap-2">
              <Link href={`/posts/${post.id}/edit`}>
                <Button variant="outline" size="sm">
                  <Edit className="w-4 h-4" />
                </Button>
              </Link>
              <Button variant="outline" size="sm" onClick={handleDelete}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground line-clamp-3">
          {post.content.length > 200 ? `${post.content.substring(0, 200)}...` : post.content}
        </p>
        <Link href={`/posts/${post.id}`}>
          <Button variant="link" className="p-0 h-auto mt-2">
            Read more
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}
