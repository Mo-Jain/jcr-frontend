import Link from "next/link"
import { CarSection } from "@/components/car-section";
import { TopSection } from "@/components/top-section";

export default function Home() {
  
  return (
    <div className="min-h-screen bg-gray-50">

      <main>
        <TopSection/>
        <div className="-z-2">
          <CarSection />
        </div>
        <section className="bg-[#4b6196] text-primary-foreground py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="sm:text-3xl text-xl font-bold mb-4">Ready to streamline your car rentals?</h2>
            <p className="text-xl max-sm:text-sm mb-8">Join Us today and experience hassle-free booking management.</p>
            <Link
              href="/booking"
              className="bg-card max-sm:text-sm text-card-foreground px-3 sm:px-6 py-3 rounded-md font-semibold hover:bg-muted transition duration-300"
            >
              Get Started
            </Link>
          </div>
        </section>
      </main>

      <footer className="bg-muted text-muted-foreground py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2025 Jain Car Rental. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

