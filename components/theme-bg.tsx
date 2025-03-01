"use client";

import { useEffect, useState } from "react";
import MoonStar from "@/public/moon-stars.svg";
import SunImage from "./sun-image";

const ThemeBg = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-10 left-0 -z-50 pointer-events-none opacity-80">
      <div className="-mt-5 -ml-12 max-sm:-ml-24 dark:mt-48 left-5 transition-all dark:opacity-0 duration-500">
        <SunImage />
      </div>
      <div className="absolute top-[-60%] dark:top-5 left-5 transition-all duration-500">
        <MoonStar className="w-40 h-40 max-sm:w-28 max-sm:h-28 dark:fill-white" />
      </div>
    </div>
  );
};

export default ThemeBg;
