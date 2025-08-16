import Link from "next/link"
import { getSession, deleteSession } from "@/lib/session"
import { Button } from "@/components/ui/button"
import { User, LogOut, PenTool } from "lucide-react"

export async function Header() {
  const session = await getSession()

  return (
    <header className="border-b bg-background">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold">
          BlogSite
        </Link>

        <nav className="flex items-center gap-4">
          {session ? (
            <>
              <Link href="/create-post">
                <Button variant="outline" size="sm">
                  <PenTool className="w-4 h-4 mr-2" />
                  Write Post
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span className="text-sm">{session.user.name}</span>
              </div>
              <form
                action={async () => {
                  "use server"
                  await deleteSession()
                }}
              >
                <Button variant="ghost" size="sm" type="submit">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </form>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <Link href="/login">
                <Button variant="outline" size="sm">
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Register</Button>
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  )
}
