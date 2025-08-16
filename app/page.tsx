import { getAllPosts } from "@/lib/posts"
import { getSession } from "@/lib/session"
import { Header } from "@/components/header"
import { PostsList } from "@/components/posts/posts-list"
import { PostPreview } from "@/components/posts/post-preview"
import { SearchBar } from "@/components/search/search-bar"
import { SearchFilters } from "@/components/search/search-filters"
import { Pagination } from "@/components/pagination"
import { Button } from "@/components/ui/button"
import { PenTool } from "lucide-react"
import Link from "next/link"

interface HomePageProps {
  searchParams: Promise<{ page?: string; search?: string }>
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const { page, search } = await searchParams
  const currentPage = Number.parseInt(page || "1")
  const session = await getSession()

  const { posts, total } = await getAllPosts(currentPage, 10, search)
  const totalPages = Math.ceil(total / 10)

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Welcome to BlogSite</h1>
          <p className="text-xl text-muted-foreground mb-6">
            Discover amazing stories and share your own thoughts with the world
          </p>
          {session ? (
            <Link href="/create-post">
              <Button size="lg">
                <PenTool className="w-5 h-5 mr-2" />
                Write Your First Post
              </Button>
            </Link>
          ) : (
            <div className="space-y-2">
              <p className="text-muted-foreground">Join our community to read and write posts</p>
              <div className="flex gap-2 justify-center">
                <Link href="/login">
                  <Button size="lg">Login</Button>
                </Link>
                <Link href="/register">
                  <Button variant="outline" size="lg">
                    Register
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <SearchBar />
        </div>

        {/* Search Filters */}
        <SearchFilters />

        {/* Search Results Header */}
        {search && (
          <div className="mb-6">
            <h2 className="text-2xl font-semibold">
              Search results for "{search}" ({total} {total === 1 ? "post" : "posts"})
            </h2>
          </div>
        )}

        {/* Posts List - Different rendering based on authentication */}
        {session ? (
          <PostsList
            posts={posts}
            currentPage={currentPage}
            totalPages={totalPages}
            currentUserId={session.user.id}
            searchQuery={search}
            emptyMessage={
              search
                ? `No posts found matching "${search}". Try a different search term.`
                : "No posts have been created yet. Be the first to share your story!"
            }
          />
        ) : (
          <div className="space-y-6">
            {posts.length === 0 ? (
              <div className="text-center py-12">
                <h2 className="text-2xl font-semibold mb-2">No posts found</h2>
                <p className="text-muted-foreground">
                  {search
                    ? `No posts found matching "${search}". Try a different search term.`
                    : "No posts have been created yet. Be the first to share your story!"}
                </p>
              </div>
            ) : (
              <>
                <div className="grid gap-6">
                  {posts.map((post) => (
                    <PostPreview key={post.id} post={post} isAuthenticated={false} />
                  ))}
                </div>
                <Pagination currentPage={currentPage} totalPages={totalPages} searchQuery={search} />
              </>
            )}
          </div>
        )}

        {/* Stats */}
        {!search && total > 0 && (
          <div className="text-center mt-12 pt-8 border-t">
            <p className="text-muted-foreground">
              Showing {posts.length} of {total} total posts
              {!session && " (Login to read full content)"}
            </p>
          </div>
        )}
      </main>
    </div>
  )
}
