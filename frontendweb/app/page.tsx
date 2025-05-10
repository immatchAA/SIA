import { Button } from "@/components/ui/button"
import Link from "next/link"
import { HeroSection } from "@/components/hero-section"
import { Features } from "@/components/features"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <HeroSection />
        <Features />
        <section className="py-16 bg-red-50">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to make a difference?</h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto">
              Join our community today and help save lives through blood donation.
            </p>
            <div className="flex justify-center gap-4">
              <Button asChild size="lg" className="bg-red-600 hover:bg-red-700">
                <Link href="/register">Register Now</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/login">Sign In</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
