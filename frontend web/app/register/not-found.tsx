import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Droplet } from "lucide-react"

export default function RegisterNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-8 bg-gray-50">
      <div className="flex items-center mb-6 text-red-600">
        <Droplet className="mr-2 h-8 w-8" />
        <span className="text-2xl font-bold">RedWeb</span>
      </div>
      
      <h1 className="text-4xl font-bold text-center mb-2">404</h1>
      <h2 className="text-2xl font-semibold text-center mb-8">Registration Page Not Found</h2>
      
      <p className="text-center text-gray-600 max-w-md mb-8">
        The registration page you're looking for couldn't be found. It might have been moved or doesn't exist.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Button asChild variant="default">
          <Link href="/register">Return to Registration</Link>
        </Button>
        
        <Button asChild variant="outline">
          <Link href="/login">Go to Login</Link>
        </Button>
      </div>
    </div>
  )
}
