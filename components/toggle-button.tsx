"use client";
import OutCircle from "@/public/theme-svg/outer-circle.svg";
import InnerCicle from "@/public/theme-svg/inner-circle.svg";
import { useEffect, useState } from "react";

export function ToggleButton({
  isToggled,
  setIsToggle,
}: {
  isToggled: boolean;
  setIsToggle: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [circlePositions, setCirclePositions] = useState<
    { x: number; y: number }[] | null
  >(null);

  useEffect(() => {
    const positions = Array.from({ length: 6 }).map((_, index) => {
      const angle = (index * Math.PI) / 3; // 60-degree increments
      return { x: 15 * Math.cos(angle), y: 15 * Math.sin(angle) };
    });
    setCirclePositions(positions);
  }, []);
  return (
    <div
      className={`flex flex-col p-1 z-0 w-12 h-12 cursor-pointer items-center justify-center relative`}
      onClick={() => setIsToggle(!isToggled)}
    >
      {/* Wrapper for circles with correct stacking order */}
      <div className="absolute inset-0 flex items-center justify-center -z-10">
        {circlePositions &&
          circlePositions.map(({ x, y }, index) => (
            <div
              key={index}
              className="absolute w-[6px] h-[6px] bg-zinc-700 dark:bg-white rounded-full transition-transform duration-400"
              style={{
                transform: `translate(${isToggled ? x : 0}px, ${isToggled ? y : 0}px)`,
                left: "50%",
                top: "50%",
                marginLeft: "-3px",
                marginTop: "-3px",
                transitionDelay: isToggled ? `${index * 80}ms` : "0ms",
                zIndex: "-1", // Now correctly behind OutCircle and InnerCircle
              }}
            />
          ))}
      </div>
      {/* Inner div */}
      <div className="w-full h-full z-10 relative">
        <OutCircle
          className={`absolute top-0 left-0 w-full h-full stroke-0 fill-zinc-700 dark:fill-white transition-all duration-500 ${
            isToggled ? "scale-[0.44]" : "scale-[0.66]"
          } z-10`}
        />
        <InnerCicle
          className={`absolute top-0 left-0 w-full h-full stroke-0 fill-zinc-700 dark:fill-white transition-all scale-[0.40] duration-500 ${
            isToggled ? "" : "translate-x-[11%] translate-y-[-9%]"
          } z-10`}
        />
        <div
          className={`absolute top-0 left-0 w-full h-full rounded-full stroke-0 bg-white dark:bg-[#202020] transition-scale duration-500 ${
            isToggled ? "scale-[0.40]" : "scale-[0.66]"
          }`}
        />
      </div>
    </div>
  );
}
