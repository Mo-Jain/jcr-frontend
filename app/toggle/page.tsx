"use client";

import OutCircle from "@/public/theme-svg/outer-circle.svg";
import InnerCicle from "@/public/theme-svg/inner-circle.svg";
import { useState, useEffect } from "react";

export default function Page() {
  const [theme, setTheme] = useState("light");
  const [circlePositions, setCirclePositions] = useState<{ x: number; y: number }[] | null>(null);

  useEffect(() => {
    const positions = Array.from({ length: 6 }).map((_, index) => {
      const angle = (index * Math.PI) / 3; // 60-degree increments
      return { x: 35 * Math.cos(angle), y: 35 * Math.sin(angle) };
    });
    setCirclePositions(positions);
  }, []);

  

  return (
    <div
      className={`flex flex-col p-1 ml-10 mt-10 z-0 w-20 h-20 cursor-pointer items-center justify-center relative`}
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      {/* Wrapper for circles with correct stacking order */}
      <div className="absolute inset-0 flex items-center justify-center -z-10">
        {circlePositions &&
          circlePositions.map(({ x, y }, index) => (
            <div
              key={index}
              className="absolute w-[15px] h-[15px] bg-black dark:bg-white rounded-full transition-all duration-400"
              style={{
                transform: `translate(${theme === "light" ? x : 0}px, ${theme === "light" ? y : 0}px)`,
                left: "50%",
                top: "50%",
                marginLeft: "-7.5px",
                marginTop: "-7.5px",
                transitionDelay: theme === "light" ? `${index * 50}ms` : "0ms",
                zIndex: "-1", // Now correctly behind OutCircle and InnerCircle
              }}
            />
          ))}
      </div>
      {/* Inner div */}
      <div className="w-full h-full z-10 relative">
        <OutCircle
          className={`absolute top-0 left-0 w-full h-full stroke-0 fill-black dark:fill-white transition-all duration-500 ${
            theme === "light" ? "scale-[0.44]" : "scale-[0.66]"
          } z-10`}
        />
        <InnerCicle
          className={`absolute top-0 left-0 w-full h-full stroke-0 fill-black dark:fill-white transition-all scale-[0.40] duration-500 ${
            theme === "light" ? "" : "translate-x-[11%] translate-y-[-9%]"
          } z-10`}
        />
        
        <div className={`absolute top-0 left-0 w-full h-full rounded-full stroke-0 bg-white transition-all duration-500 ${
                    theme === "light" ? "scale-[0.44]" : "scale-[0.66]"
                  }`}/>
      </div>
    </div>
  );
}




