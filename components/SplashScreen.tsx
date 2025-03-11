"use client";
import { useEffect, useState } from "react";
import Logo1 from "@/public/logo1.svg";
import { usePathname } from "next/navigation";
import { useServerStore } from "@/lib/store";

const SplashScreen = () => {
  const [isLoading, setIsLoading] = useState(true);
  const {setIsInitiateComplete} = useServerStore();
  const pathname = usePathname();
  useEffect(() => {
    // Hide the splash screen after 3 seconds
    const timer = setTimeout(() => {
      setIsLoading(false);
      setIsInitiateComplete(true);
    }, 1200);
    return () => clearTimeout(timer);
  }, [setIsInitiateComplete]);

  if (!isLoading || pathname != "/") return null;

  return (
    <div className="relative">
      <div className="fixed top-0 left-0 z-[999999] w-full h-full flex items-center justify-center bg-black/60 backdrop-blur-xl">
        <Logo1 id="water" className="h-[120px] w-[140px] stroke-[1px]" />
        <Logo1 className="h-[120px] w-[140px] z-10 ml-[-140px] stroke-[1px] stroke-white" />
      </div>
    </div>
  );
};

export default SplashScreen;
