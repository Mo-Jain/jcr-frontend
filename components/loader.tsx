import { cn } from "@/lib/utils";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import React from "react"

const Loader = ({className}:{className?:string}) => {
  return (
    <div>
      <DotLottieReact
              src="https://lottie.host/3083f51c-0fdb-4190-8042-64ce26af507e/V6RLCxNsch.lottie"
              loop
              autoplay
              className={cn('w-32 h-32',className)}/>
    </div>
  )
};

export default Loader;
