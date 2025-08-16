import { LoginForm } from "@/components/auth/login-form"
import { getSession } from "@/lib/session"
import { redirect } from "next/navigation"

interface LoginPageProps {
  searchParams: Promise<{ redirect?: string }>
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { redirect: redirectPath } = await searchParams
  const session = await getSession()
  console.log("login_page_session", session)

  if (session) {
    redirect(redirectPath || "/")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/50">
      <div className="w-full max-w-md">
        {redirectPath && (
          <div className="text-center mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-sm text-blue-800">Please log in to access this page</p>
          </div>
        )}
        <LoginForm />
      </div>
    </div>
  )
}
