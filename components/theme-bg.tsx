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
    <div>
      <div
        className={`-mt-5 -ml-12 max-sm:-ml-24 dark:mt-48 left-5 z-20 transition-all duration-500  pointer-events-none`}
      >
        <SunImage />
      </div>
      <div
        className={` absolute overflow-hidden top-[-60%] dark:top-5 left-5 z-0 transition-all duration-500  pointer-events-none`}
      >
        <MoonStar className="w-40 h-40 max-sm:w-28 max-sm:h-28 dark:fill-white" />
      </div>
    </div>
  );
};

export default ThemeBg;
