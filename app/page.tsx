'use client';

import Link from "next/link";
import { CarSection } from "@/components/car-section";
import { TopSection } from "@/components/top-section";
import { useEffect, useState } from "react";

const smoothScrollTo = (targetY: number, duration: number = 600) => {
  const startY = window.scrollY;
  const difference = targetY - startY;
  const startTime = performance.now();

  const step = (currentTime: number) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1); // Keep progress between 0 and 1
    window.scrollTo(0, startY + difference * progress);

    if (progress < 1) {
      requestAnimationFrame(step);
    }
  };

  requestAnimationFrame(step);
};


export default function Home() {
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY; // Get the vertical scroll position
      const fadeStart = 0; // Start fading from the top
      const fadeEnd = 200; // Fully invisible at 200px scroll

      // Calculate opacity (1 at fadeStart, 0 at fadeEnd)
      let newOpacity = 1 - (scrollY - fadeStart) / (fadeEnd - fadeStart);
      newOpacity = Math.max(newOpacity, 0); // Ensure it doesn't go below 0

      setOpacity(newOpacity);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    console.log("opacity", opacity);
  }, [opacity]);
  return (
    <div className="min-h-screen z-0 my-0 bg-transparent">
      <main>
        <div 
        style={{ opacity }}
        className="z-0 transition-opacity duration-500 ease-in-out">
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
