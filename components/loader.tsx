import { cn } from "@/lib/utils";
import React from "react"

const Loader = ({className}:{className?:string}) => {
  return (
    <div>
      <div className={cn('flex flex-col w-16 h-16 gap-[7%] -rotate-45 m-10',className)}>
        <div className='flex w-full h-full gap-[7%]'>
          <div className='w-full h-full bg-blue-300 animate-up-right'></div>
          <div className='w-full h-full bg-blue-600 animate-down-right'></div>
        </div>
        <div className='flex w-full h-full gap-[7%]'>
          <div className='w-full h-full bg-blue-600 animate-up-left'></div>
          <div className='w-full h-full bg-blue-300 animate-down-left'></div>
        </div>
      </div>
    </div>
  )
};

export default Loader;
