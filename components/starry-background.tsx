"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Sky from "@/public/blue-sky.jpg";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

const StarryBackground: React.FC = () => {
  const { theme, systemTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const stars = Array.from({ length: 150 }, (_, i) => i)

  useEffect(() => {
    setMounted(true)
  }, [])
  if (!mounted) return null;

  const currentTheme = theme === "system" ? systemTheme : theme;
  const isDarkMode = mounted && currentTheme === "dark";


  return (
    <div className="fixed no-print top-0 left-0 w-full h-full -z-50">
       <div 
       className={cn("absolute inset-0 -z-50 overflow-hidden pointer-events-none transition-opacity duration-1000",
        isDarkMode ? "opacity-100" : "opacity-0"
       )}>
         {stars.map((star) => (
           <div
             key={star}
             className={`absolute -z-50 rounded-full transition-opacity twinkle`}
             style={{
               width: `2px`,
               height: `2px`,
               top: `${Math.random() * 100}%`,
               left: `${Math.random() * 100}%`,
               backgroundColor: "white",
               boxShadow: "0 0 3px rgba(255, 255, 255, 0.5)",
               animationDelay: `${Math.random() * 5 + 5}s`,
             }}
           />
         ))}
    </div>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <Image
          src={Sky}
          alt="sky"
          className="absolute inset-0 h-screen w-screen opacity-50 dark:opacity-0 transition-opacity duration-1000 ease-in-out"
        />
      </div>
    </div>

  );
};

export default StarryBackground;
