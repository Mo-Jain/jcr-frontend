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
    <div className="fixed inset-10 left-0 -z-40 pointer-events-none opacity-80">
      <div className="-mt-5 -ml-12 max-sm:-ml-24 dark:mt-48 left-5 transition-mt dark:opacity-0 duration-500">
        <SunImage />
      </div>
      <div className="absolute top-[-30%] dark:top-[10%] left-[5%] transition-top duration-300 ease-in-out">
        {/* <MoonStar className="w-40 h-40 max-sm:w-28 max-sm:h-28 dark:fill-white" /> */}
        <div className="w-48 h-48 relative scale-[5] z-0">
          <div className={`relative w-full h-full  z-0`}>
            {/* <Moonlight_large className={`w-full h-full scale-0 dark:scale-[1]  transition-all duration-1000 ease-in-out absolute top-0 left-0 `} /> */}
            <Moonlight_small className={`w-1/3 h-1/3 scale-0 dark:scale-[1] transition-all duration-1000 ease-in-out absolute top-[34%] left-[34%] opacity-100 `} />
            <Image src={Moon} alt="moon" className={`w-[10%] h-[10%] absolute top-[45%]   left-[45%] opacity-70`} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeBg;
