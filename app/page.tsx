'use client';

import Link from "next/link";
import { CarSection } from "@/components/car-section";
import { TopSection } from "@/components/top-section";
import { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";

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
  const isSmallScreen = useMediaQuery({ maxWidth: 640 });
  const fadeStart = 0;  // Start fading from the top
  const fadeEnd = isSmallScreen ? 150 : 200; // Fully invisible at 300px scroll
  const snapThreshold = (fadeEnd - fadeStart) / 2; // Halfway point

  const [opacity, setOpacity] = useState(1);
  let timeout: NodeJS.Timeout | null = null;


  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      let newOpacity = 1 - (scrollY - fadeStart) / (fadeEnd - fadeStart);
      newOpacity = Math.max(newOpacity, 0); // Ensure it doesn't go below 0
      const duration = 200 * (fadeEnd - scrollY) / (fadeEnd - fadeStart);
      setOpacity(newOpacity);

      // Clear any previous timeout to prevent unnecessary snapping
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => {
        if (scrollY > fadeStart + snapThreshold && scrollY < fadeEnd) {
          smoothScrollTo(fadeEnd, Math.floor(duration));
        } 
      }, 300); // Wait 100ms to detect if scrolling stops
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      if (timeout) clearTimeout(timeout);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="min-h-screen z-0 my-0 bg-transparent">
      <main>
        <div 
        style={{ opacity }}
        className="z-0 transition-opacity duration-300 ease-in-out">
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
