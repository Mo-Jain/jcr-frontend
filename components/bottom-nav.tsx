"use client"

import Link from "next/link"
import { Home } from "lucide-react";
import Booking from "@/public/online-booking.svg"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react";
import Calendar from "@/public/calendar.svg"
import { useUserStore } from "@/lib/store";
import Image from "next/image";

export function BottomNav() {
  const [selectedTab, setSelectedTab] = useState("home")
  const pathname = usePathname();
  const {name,imageUrl} = useUserStore();
  const gethortName = () => {
    if(!name) return;
    const nameArray = name.split(" ");
    let shortName = "";
    for(let i = 0; i < nameArray.length; i++){
      shortName += nameArray[i][0].toLocaleUpperCase();
    }
    return shortName;
  }
  const [shortName,setShortName] = useState(gethortName());

  useEffect(() => {
    if (pathname.startsWith("/booking")) {
      setSelectedTab("bookings")
    } else if (pathname.startsWith("/profile")) {
      setSelectedTab("profile")
    } else if (pathname.startsWith("/calendar")) {
      setSelectedTab("calendar")
    } else if (pathname === "/"){
      setSelectedTab("home")
    }
  }, [pathname])

  useEffect(()=>{
    setShortName(gethortName());
  },[name,gethortName])
  

  return (
    <div className="relative">
      <div className="w-full h-[56px] sm:hidden"></div>
      <nav className="fixed z-[99999] bottom-0 left-0 right-0 bg-blue-300 dark:bg-[#141414] text-primary-foreground sm:hidden">
        {name ?
        <div className="flex justify-around py-2">
          <Link href="/" className={`flex flex-col items-center ${selectedTab=="home" ? "text-[#27272A] dark:text-primary" : "text-white"} hover:text-[#27272A] dark:hover:text-primary`}>
            <Home className="h-6 w-6" />
            <span className="text-xs font-bold">Home</span>
          </Link>
          <Link href="/bookings" className={`flex flex-col items-center ${selectedTab=="bookings" ? "text-[#27272A] dark:text-primary" : "text-white"} hover:text-[#27272A] dark:hover:text-primary`}>
            <span color="white" className=" flex flex-col items-center">
              <Booking className={`h-6 w-6 ${selectedTab=="bookings" ? "fill-[#27272A] stroke-[#27272A] dark:fill-primary dark:stroke-primary" : "fill-white stroke-white"} stroke-[5px] hover:fill-[#27272A] hover:stroke-[#27272A] dark:hover:fill-primary dark:hover:stroke-primary`}/>
              <span className="text-xs font-bold">Bookings</span>
            </span>
          </Link>
          <Link href="/calendar" className={`flex flex-col items-center ${selectedTab=="calendar" ? "text-[#27272A] dark:text-primary" : "text-white"} hover:text-[#27272A] dark:hover:text-primary`}>
            <span color="white" className=" flex flex-col items-center">
              <Calendar className={`h-6 w-6 ${selectedTab=="calendar" ? "fill-[#27272A] stroke-[#27272A] dark:fill-primary dark:stroke-primary" : "fill-white stroke-white"} stroke-[6px] hover:fill-[#27272A] hover:stroke-[#27272A] dark:hover:fill-primary dark:hover:stroke-primary`}/>
              <span className="text-xs font-bold">Calendar</span>
            </span>
          </Link>
          
          <Link href="/profile" className={`flex flex-col items-center ${selectedTab=="profile" ? "text-[#27272A] dark:text-primary" : "text-white"} hover:text-[#27272A] dark:hover:text-primary`}>
            <div className="max-h-6 max-w-6">
              {imageUrl ? 
                <div className={`h-fit w-fit ${selectedTab=="profile" ? " border-[#27272A] dark:border-primary" : "border-transparent"} border-2 hover:border-[#27272A] rounded-full dark:hover:border-primary`} >
                  <Image src={imageUrl || "/placeholder.svg"} alt="Profile" width={24} height={24} className="max-h-6 max-w-6 object-cover rounded-full" />
                  <span className="text-xs font-bold">Profile</span>
                </div>
                :
                <div className={`flex w-full h-full flex-col items-center ${selectedTab=="home" ? "text-[#27272A] dark:text-primary" : "text-white"} hover:text-[#27272A] dark:hover:text-primary`}>
                  <span className={`h-6 w-6 ${selectedTab=="profile" ? " border-primary text-primary" : "border-gray-700 text-xs p-[2px] font-bold dark:border-white text-gray-700 dark:text-white"} border-2  rounded-full hover:border-primary dark:hover:text-primary dark:hover:border-primary hover:text-primary  flex justify-center items-center `}>
                  {shortName}</span>
                  <span className="text-xs font-bold">Profile</span>
                </div>
                  
                
              }
            </div>
            
          </Link>
        </div>
        :
        <Link href="/" className={`flex flex-col py-2 items-center ${selectedTab=="home" ? "text-[#27272A] dark:text-primary" : "text-white"} hover:text-[#27272A] dark:hover:text-primary`}>
            <Home className="h-6 w-6" />
            <span className="text-xs font-bold">Home</span>
          </Link>}
      </nav>
      
    </div>
  )
}

