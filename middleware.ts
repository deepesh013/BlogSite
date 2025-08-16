import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getSession } from "@/lib/session"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Protected routes that require authentication
  const protectedRoutes = ["/create-post", "/posts/*/edit"]

  // API routes that require authentication
  const protectedApiRoutes = ["/api/posts"]

  // Check if the current path matches any protected route
  const isProtectedRoute = protectedRoutes.some((route) => {
    if (route.includes("*")) {
      const pattern = route.replace("*", "[^/]+")
      return new RegExp(`^${pattern}$`).test(pathname)
    }
    return pathname.startsWith(route)
  })

  const isProtectedApiRoute = protectedApiRoutes.some((route) => pathname.startsWith(route))

  // If it's a protected route or API route, check authentication
  if (isProtectedRoute || isProtectedApiRoute) {
    const session = await getSession()

    if (!session) {
      if (isProtectedApiRoute) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }

      // Redirect to login page for protected routes
      const loginUrl = new URL("/login", request.url)
      loginUrl.searchParams.set("redirect", pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/create-post", "/posts/:path*/edit", "/api/posts/:path*"],
}
