import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Droplet } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-8 bg-gray-50">
      <div className="flex items-center mb-6 text-red-600">
        <Droplet className="mr-2 h-8 w-8" />
        <span className="text-2xl font-bold">RedWeb</span>
      </div>
      
      <h1 className="text-4xl font-bold text-center mb-2">404</h1>
      <h2 className="text-2xl font-semibold text-center mb-8">Page Not Found</h2>
      
      <p className="text-center text-gray-600 max-w-md mb-8">
        Sorry, we couldn't find the page you're looking for. It might have been moved or doesn't exist.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Button asChild variant="default">
          <Link href="/">Go Home</Link>
        </Button>
        
        <Button asChild variant="outline">
          <Link href="/dashboard">Dashboard</Link>
        </Button>
      </div>
    </div>
  )
}
