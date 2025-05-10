import { Button } from "@/components/ui/button"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative bg-red-600 text-white py-20">
      <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">Donate Blood, Save Lives</h1>
          <p className="text-xl opacity-90">
            Your donation can make a difference. Join our community of donors and help those in need.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button asChild size="lg" className="bg-white text-red-600 hover:bg-gray-100">
              <Link href="/register">Become a Donor</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-red-700">
              <Link href="/dashboard/blood-requests/create">Request Blood</Link>
            </Button>
          </div>
        </div>
        <div className="hidden md:block">
          <img
            src="/logo.png?height=400&width=500"
            alt="Blood donation illustration"
            className="rounded-lg shadow-lg"
          />
        </div>
      </div>
    </section>
  )
}
