import { LoginForm } from "@/components/login-form"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow flex items-center justify-center py-12">
        <div className="w-full max-w-md">
          <LoginForm />
        </div>
      </main>
      <Footer />
    </div>
  )
}
