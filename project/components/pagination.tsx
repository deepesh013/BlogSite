import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface PaginationProps {
  currentPage: number
  totalPages: number
  baseUrl?: string
  searchQuery?: string
}

export function Pagination({ currentPage, totalPages, baseUrl = "/", searchQuery }: PaginationProps) {
  if (totalPages <= 1) return null

  const getPageUrl = (page: number) => {
    const params = new URLSearchParams()

    if (page > 1) {
      params.set("page", page.toString())
    }

    if (searchQuery) {
      params.set("search", searchQuery)
    }

    const queryString = params.toString()
    return queryString ? `${baseUrl}?${queryString}` : baseUrl
  }

  const pages = []
  const showPages = 5 // Show 5 page numbers at most

  let startPage = Math.max(1, currentPage - Math.floor(showPages / 2))
  const endPage = Math.min(totalPages, startPage + showPages - 1)

  // Adjust start page if we're near the end
  if (endPage - startPage + 1 < showPages) {
    startPage = Math.max(1, endPage - showPages + 1)
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i)
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      {/* Previous button */}
      {currentPage > 1 && (
        <Link href={getPageUrl(currentPage - 1)}>
          <Button variant="outline" size="sm">
            <ChevronLeft className="w-4 h-4 mr-1" />
            Previous
          </Button>
        </Link>
      )}

      {/* First page if not visible */}
      {startPage > 1 && (
        <>
          <Link href={getPageUrl(1)}>
            <Button variant={1 === currentPage ? "default" : "outline"} size="sm">
              1
            </Button>
          </Link>
          {startPage > 2 && <span className="px-2">...</span>}
        </>
      )}

      {/* Page numbers */}
      {pages.map((page) => (
        <Link key={page} href={getPageUrl(page)}>
          <Button variant={page === currentPage ? "default" : "outline"} size="sm">
            {page}
          </Button>
        </Link>
      ))}

      {/* Last page if not visible */}
      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && <span className="px-2">...</span>}
          <Link href={getPageUrl(totalPages)}>
            <Button variant={totalPages === currentPage ? "default" : "outline"} size="sm">
              {totalPages}
            </Button>
          </Link>
        </>
      )}

      {/* Next button */}
      {currentPage < totalPages && (
        <Link href={getPageUrl(currentPage + 1)}>
          <Button variant="outline" size="sm">
            Next
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </Link>
      )}
    </div>
  )
}
