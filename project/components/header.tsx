import Link from "next/link";
import { getSession, deleteSession } from "@/lib/session";
import { Button } from "@/components/ui/button";
import { User, LogOut, PenTool, Home } from "lucide-react";
import { redirect } from "next/navigation";

export async function Header() {
  const session = await getSession();

  const handleLogout = async () => {
    "use server";
    await deleteSession();
    redirect("/");
  };

  return (
    <header className="border-b bg-background sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="text-2xl font-bold hover:text-primary transition-colors"
        >
          BlogSite
        </Link>

        <nav className="flex items-center gap-4">
          {session ? (
            <>
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <Home className="w-4 h-4 mr-2" />
                  Home
                </Button>
              </Link>
              <Link href="/create-post">
                <Button variant="outline" size="sm">
                  <PenTool className="w-4 h-4 mr-2" />
                  Write Post
                </Button>
              </Link>
              <div className="flex items-center gap-2 px-3 py-1 bg-muted rounded-md">
                <User className="w-4 h-4" />
                <span className="text-sm font-medium">{session.user.name}</span>
              </div>
              <form action={handleLogout}>
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
  );
}
