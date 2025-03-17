"use client";

import { useEffect, useState } from "react";
import SunImage from "./sun-image";
import Moonlight_small from "@/public/night-bg/moonlight_small.svg";
import Moon from "@/public/night-bg/moon.png";
import Image from "next/image";

const ThemeBg = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-10 left-0 -z-10 pointer-events-none opacity-80">
    <div className="-mt-7 -ml-20 max-sm:-ml-24 dark:mt-48  transition-mt dark:opacity-0 duration-500">
      <SunImage />
    </div>
    <div className="absolute top-[-30%] dark:top-[5%] left-0  transition-top duration-300 ease-in-out pointer-events-none">
      <div className="w-48 h-48 relative scale-[5]">
        <div className="relative w-full h-full">
          <Moonlight_small className="w-1/3 h-1/3 scale-0 dark:scale-[1] transition-all duration-1000 ease-in-out absolute top-[34%] left-[34%] opacity-100" />
          <Image src={Moon} alt="moon" className="w-[8%] h-[8%] sm:w-[8%] sm:h-[8%] absolute top-[46%] left-[46%] opacity-80" />
        </div>
      </div>
    </div>
  </div>
  );
};

export default ThemeBg;
