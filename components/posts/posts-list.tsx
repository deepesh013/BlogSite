import { PostCard } from "./post-card"
import { Pagination } from "../pagination"
import type { Post } from "@/lib/auth"

interface PostsListProps {
  posts: Post[]
  currentPage: number
  totalPages: number
  currentUserId?: string
  emptyMessage?: string
  searchQuery?: string
}

export function PostsList({
  posts,
  currentPage,
  totalPages,
  currentUserId,
  emptyMessage,
  searchQuery,
}: PostsListProps) {
  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold mb-2">No posts found</h2>
        <p className="text-muted-foreground">{emptyMessage || "Be the first to create a post!"}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} currentUserId={currentUserId} />
        ))}
      </div>
      <Pagination currentPage={currentPage} totalPages={totalPages} searchQuery={searchQuery} />
    </div>
  )
}
