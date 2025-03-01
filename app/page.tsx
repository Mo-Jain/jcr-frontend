import Link from "next/link";
import { CarSection } from "@/components/car-section";
import { TopSection } from "@/components/top-section";

export default function Home() {
  return (
    <div className="min-h-screen my-0 bg-gray-50">
      <main>
        <TopSection />
        <div className="-z-2">
          <CarSection />
        </div>
      </main>

      <footer className="bg-background container mx-auto px-4 text-muted-foreground py-8">
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
  );
}
