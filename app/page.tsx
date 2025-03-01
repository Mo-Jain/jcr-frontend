import Link from "next/link";
import { CarSection } from "@/components/car-section";
import { TopSection } from "@/components/top-section";

export default function Home() {
  return (
    <div className="min-h-screen z-0 my-0 bg-transparent">
      <main>
        <div className="z-0">
          <TopSection />
        </div>
        <div className="z-100">
          <CarSection />
        </div>
      </main>
      <div className="mx-2">
        <footer className="bg-white bg-opacity-40 dark:bg-opacity-20 backdrop-blur-lg container mx-auto px-4 text-muted-foreground py-8">
          <div className=" text-center">
            <p>&copy; 2025 Jain Car Rentals. All rights reserved.</p>
          </div>
          <Link
            href="/terms-and-conditions"
            target="_blank"
            className="text-center underline cursor-pointer text-black dark:text-white"
          >
            <p>Terms and Conditions</p>
          </Link>
        </footer>
      </div>
    </div>
  );
}
