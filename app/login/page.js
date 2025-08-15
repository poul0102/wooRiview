// app/login/page.js
import LoginForm from "@/components/auth/LoginForm"
import { redirectIfAuthenticated } from "@/lib/auth";

export default async function LoginPage() {
  await redirectIfAuthenticated();
  
  return (
    <div>
      <LoginForm />
    </div>
  )
}
