"use client";
import Sunlight from "@/public/sunlight.png";
import Image from "next/image";

const  SunImage = () => {
  return (
    <div className="relative max-w-96 h-80">
      <div
        className={`absolute top-0 left-0 scale-[0.8] dark:scale-[0.3] transition-scale duration-1000 ease-in-out`}
      >
        <Image src={Sunlight} alt="sun" className="w-fit h-80" />
      </div>
      <div className={`absolute  top-[35%] left-[39%] `}>
        <div className="w-20 h-20 cursor-pointer transition-all duration-300 ease-in-out bg-yellow-500 opacity-90 backdrop-blur-lg rounded-full" />
      </div>
    </div>
  );
};

export default SunImage;
