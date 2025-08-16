import { LoginForm } from "@/components/auth/login-form";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface LoginPageProps {
  searchParams: Promise<{ redirect?: string; message?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { redirect: redirectPath, message } = await searchParams;
  const session = await getSession();
  console.log("login_page_session", session);

  if (session) {
    redirect(redirectPath || "/");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/50">
      <div className="w-full max-w-md space-y-4">
        {message && (
          <Alert>
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}
        {redirectPath && (
          <Alert>
            <AlertDescription>
              Please log in to access this page
            </AlertDescription>
          </Alert>
        )}
        <LoginForm />
      </div>
    </div>
  );
}
