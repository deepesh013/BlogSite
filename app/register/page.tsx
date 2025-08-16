import { RegisterForm } from "@/components/auth/register-form"
import { getSession } from "@/lib/session"
import { redirect } from "next/navigation"

export default async function RegisterPage() {
  const session = await getSession()

  if (session) {
    redirect("/")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/50">
      <RegisterForm />
    </div>
  )
}
