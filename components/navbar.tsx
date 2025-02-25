"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import Logo1 from "@/public/logo1.svg"
import LogoText from "@/public/logo_text.svg"
import { usePathname, useRouter } from "next/navigation"
import { ThemeToggle } from "./theme-toggle"
import { useEffect, useState } from "react"
import { useUserStore } from "@/lib/store"
import Redirect from "./redirect"
import Image from "next/image"

export function NavBar() {
  const [selectedTab, setSelectedTab] = useState("home")
  const pathname = usePathname()
  const router = useRouter();
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

  useEffect(()=>{
    setShortName(gethortName());
  },[name])
  


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


  return (
    <div className="relative">
      <Redirect/>
    <nav className="fixed w-full dark:border-b-muted border-b-[1px] top-0 left-0 z-[99999] py-1 flex items-center rounded-none cursor-normal bg-gray-100 dark:bg-black justify-between px-4  text-primary-foreground">
      <div className="flex max-sm:flex-row-reverse w-full transition-all duration-300">
        {name &&
        <div className="max-sm:w-25 flex sm:hidden items-center">
          <span className="h-6 w-6 px-5 mr-[6px]"></span>
        </div>}
        <Link href="/" className={`flex-grow rounded-none flex sm:ml-4 justify-center items-center sm:justify-start`}>
          <div className="flex items-start">
            <Logo1 className="h-[50px] fill-[#039BE5] stroke-[1px]"/>
          </div>
          <LogoText className="ml-[-5px] dark:stroke-white w-14 h-7"/> 
        </Link>
        <div className={`sm:w-full ${name ? "sm:ml-48" : ""} flex justify-center items-center`}>
            <ThemeToggle />
        </div>
      </div>
      {!name ?
        <div className="py-2">
          <Button  className="w-full bg-blue-600 text-white dark:text-black" onClick={() => router.push("/login")}>
            Login
          </Button>
        </div>
      :
        <div className="w-18 space-x-2  flex text-right ">
        <div className="flex items-center text-gray-700 dark:text-gray-200 max-sm:hidden space-x-2 justify-around">
          <div className={`px-2 hover:text-blue-700 ${selectedTab == "home" ? "text-blue-700 border-b-blue-700": ""} border-transparent transition-all border duration-300 border-y-4 p-2 cursor-pointer font-bold`} 
                onClick={() => router.push('/')}>Home</div>
          <div className={`px-2 hover:text-blue-700 ${selectedTab == "bookings" ? "text-blue-700 border-b-blue-700": ""} border-transparent transition-all border duration-300 border-y-4 p-2 cursor-pointer font-bold`} 
                onClick={() => router.push('/bookings')}>Bookings</div>
          <div className={`px-2 hover:text-blue-700 ${selectedTab == "calendar" ? "text-blue-700 border-b-blue-700": ""} border-transparent transition-all border duration-300 border-y-4 p-2 cursor-pointer font-bold`} 
                onClick={() => router.push('/calendar')}> Calendar</div>
        </div>
        <div className={`flex flex-col items-center px-2 hover:text-blue-700 max-sm:hidden ${selectedTab == "profile" ? "text-blue-700 border-b-blue-700": ""} border-transparent transition-all border duration-300 border-y-4 p-2 cursor-pointer font-bold`} 
          onClick={() => router.push('/profile')}>
            {imageUrl ? 
                <div className={`h-fit w-fit ${selectedTab=="profile" ? " border-primary" : "border-transparent"} border-2  rounded-full hover:border-primary`} >
                  <Image src={imageUrl || "/placeholder.svg"} alt="Profile" width={32} height={32} className="max-h-8 min-w-8 object-cover rounded-full" />
                </div>
              : 
            <span className={`h-8 w-8 ${selectedTab=="profile" ? " border-primary text-primary" : "border-gray-700 dark:border-white text-gray-700 dark:text-white"} border-2  rounded-full hover:border-primary hover:dark:text-primary hover:dark:border-primary hover:text-primary  flex justify-center items-center `}>
            {shortName}</span>
          }
        </div>
        
      </div>}
    </nav>
    <div className="w-full h-[60px]"></div>
         
    </div>
  )
}

