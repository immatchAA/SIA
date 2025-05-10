import { RegisterForm } from "@/components/register-form"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-2xl">
          <RegisterForm />
        </div>
      </main>
      <Footer />
    </div>
  )
}
