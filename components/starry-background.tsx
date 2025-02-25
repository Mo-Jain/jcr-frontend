"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import { useMediaQuery } from "react-responsive"

const StarryBackground: React.FC = () => {
  const { theme, systemTheme } = useTheme()
  const [mounted, setMounted] = useState(false);
  const isSmallScreen = useMediaQuery({ query: '(max-width: 640px)' });
  const stars = Array.from({ length: isSmallScreen ? 80 : 220 }, (_, i) => i)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null;

  const currentTheme = theme === "system" ? systemTheme : theme;
  const isDarkMode = mounted && currentTheme === "dark";

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      {stars.map((star) => (
        <div
          key={star}
          className={`absolute rounded-full transition-opacity duration-1000 ${
            isDarkMode ? "opacity-100" : "opacity-0"
          }`}
          style={{
            width: `${Math.random() * 2 + 1}px`,
            height: `${Math.random() * 2 + 1}px`,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            backgroundColor: "white",
            boxShadow: "0 0 3px rgba(255, 255, 255, 0.5)",
            animation: `twinkle ${Math.random() * 5 + 5}s infinite`,
          }}
        />
      ))}
    </div>
  )
}

export default StarryBackground

