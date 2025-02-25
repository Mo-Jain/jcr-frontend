"use client"

import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { useRouter } from "next/navigation";
import CarFrontIcon from "@/public/car-front.svg";
import UserIcon from "@/public/user.svg"
import { useUserStore } from "@/lib/store"
import { Users } from "lucide-react";

export default function Profile() {
  const router = useRouter();
  const {name,imageUrl,setName,setImageUrl} = useUserStore();

  const handleLogout = () => {
    localStorage.setItem("token","");
    setName("");
    setImageUrl("");
    router.push("/");
  }

  return (
    <div className="min-h-screen bg-background">
      
      <main className="container mx-auto px-4 py-8 pb-16 sm:pb-8">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-muted flex items-center justify-center overflow-hidden">
              {imageUrl ? (
                <Image src={imageUrl || "/placeholder.svg"} alt="Profile" fill className="object-cover rounded-full" />
              ) : (
                <UserIcon className="w-28 h-28 stroke-[12px] stroke-blue-600 fill-blue-600" />
              )}
            </div>
            
          </div>

          {name !== "" ? (
            <>
              <div className="flex items-center">
                <h2 className="text-2xl font-bold ">{name}</h2>
            
              </div>
              <Button variant="outline" className="hover:bg-gray-200 dark:hover:bg-gray-700 bg-transparent" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <div className="space-y-2">
              <Button  className="w-full bg-blue-600 text-white dark:text-black" onClick={() => router.push("/login")}>
                Login
              </Button>
            </div>
          )}
        </div>
        <div>
          {name !== "" &&
          <Card className="overflow-hidden bg-muted dark:border-gray-700 hover:shadow-md transition-shadow my-2">
            <CardContent className="p-4 text-black dark:text-gray-400">
              <div 
                className="flex items-center border-border border-b justify-between p-2 cursor-pointer dark:hover:bg-gray-700 hover:bg-gray-200"
                onClick={() => router.push("/profile/manage-garrage")}>
                <div className="flex items-center" >
                  <span className="w-8 h-8 mx-2 p-[6px] rounded-full bg-gray-300 dark:bg-gray-900">
                    <CarFrontIcon  className="w-5 h-4 fill-blue-700 stroke-blue-700 dark:fill-green-500 dark:stroke-green-500 stroke-[10px]"/>
                  </span>
                  <span className="mx-2 max-sm:text-sm">Manage Garrage</span>
                </div>
                <div className="border-t-2 border-r-2 rotate-45 sm:mr-4 mr-2 w-2 h-2 border-black dark:border-gray-400"></div>
              </div>
              <div className="flex items-center border-border border-b justify-between p-2 cursor-pointer dark:hover:bg-gray-700 hover:bg-gray-200"
                    onClick={() => router.push("/profile/edit")}>
                <div className="flex items-center">
                  <span className="w-8 h-8 mx-2 p-[6px] rounded-full bg-gray-300 dark:bg-gray-900">
                    <UserIcon  className="w-5 h-5 stroke-[12px] stroke-blue-700 dark:stroke-green-500 fill-blue-700 dark:fill-green-500 "/>
                  </span>
                  <span className="mx-2 max-sm:text-sm">Manage Profile</span>
                </div>
                <div className="border-t-2 border-r-2 rotate-45 sm:mr-4 mr-2 w-2 h-2 border-black dark:border-gray-400"></div>
              </div>
              <div className="flex items-center border-border border-b justify-between p-2 cursor-pointer dark:hover:bg-gray-700 hover:bg-gray-200"
                    onClick={() => router.push("/profile/manage-customer")}>
                <div className="flex items-center">
                  <span className="w-8 h-8 mx-2 p-[6px] rounded-full bg-gray-300 dark:bg-gray-900">
                    <Users className="w-5 h-5 text-blue-500 dark:text-green-500 "/>
                  </span>
                  <span className="mx-2 max-sm:text-sm">Manage Customers</span>
                </div>
                <div className="border-t-2 border-r-2 rotate-45 sm:mr-4 mr-2 w-2 h-2 border-black dark:border-gray-400"></div>
              </div>
              
            </CardContent>
          </Card>
          }
        </div>
      </main>
    </div>
  )
}

