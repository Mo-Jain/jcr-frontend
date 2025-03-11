'use client'
import React from "react"
import Rocket from './RocketSVG';
import Server from '@/public/server.svg'

const Page = () => {
  return (
    <div className="flex flex-col z-0 bg-background items-center justify-center w-screen h-screen">
        <div className="relative">
          <div className = "absolute top-[-15%] left-[32%] w-20 h-28 flex items-center justify-center ">
              <Rocket className="fill-black dark:fill-white  stroke-black dark:stroke-white"/>
          </div>
          <Server className="w-44 h-44 stroke-black dark:stroke-white fill-black dark:fill-white"/>
        </div>
    </div>
  )
};

export default Page;
