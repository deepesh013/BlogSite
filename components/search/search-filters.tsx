"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"

export function SearchFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentSearch = searchParams.get("search")

  if (!currentSearch) return null

  const clearSearch = () => {
    router.push("/")
  }

  return (
    <div className="flex items-center gap-2 mb-6">
      <span className="text-sm text-muted-foreground">Active filters:</span>
      <Badge variant="secondary" className="flex items-center gap-1">
        Search: "{currentSearch}"
        <Button variant="ghost" size="sm" onClick={clearSearch} className="h-4 w-4 p-0 hover:bg-transparent">
          <X className="w-3 h-3" />
        </Button>
      </Badge>
      <Button variant="outline" size="sm" onClick={clearSearch}>
        Clear all filters
      </Button>
    </div>
  )
}
