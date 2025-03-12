"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import CarFrontIcon from "@/public/car-front.svg";
import UserIcon from "@/public/user.svg";
import Customers from "@/public/customers.svg";
import Users from "@/public/users.svg";
import { useUserStore } from "@/lib/store";
import { cn } from "@/lib/utils";


export default function Profile() {
  const router = useRouter();
  const { name, imageUrl, userId,setName, setImageUrl,setUserId } = useUserStore();


  const handleLogout = () => {
    localStorage.setItem("token", "");
    setName("");
    setImageUrl("");
    setUserId(-1);
    router.push("/");
  };

  return (
    <div className="h-full min-h-[88vh] sm:min-h-[90vh] bg-background">
      <main className="container mx-auto px-4 py-8 pb-16 sm:pb-8">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-muted flex items-center justify-center overflow-hidden">
              {imageUrl ? (
                <Image
                  src={imageUrl || "/placeholder.svg"}
                  alt="Profile"
                  fill
                  className="object-cover rounded-full"
                />
              ) : (
                <UserIcon className="w-28 h-28 stroke-[12px] stroke-blue-600 fill-blue-600" />
              )}
            </div>
          </div>

          {name !== "" ? (
            <>
              <div className="flex items-center">
                <h2 className="text-2xl font-bold text-gray-600 dark:text-white ">
                  {name}
                </h2>
              </div>
              <Button
                variant="outline"
                className="hover:bg-gray-200 border-border dark:hover:bg-zinc-700 bg-transparent"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </>
          ) : (
            <div className="space-y-2">
              <Button
                className="w-full bg-blue-600 text-white border-border"
                onClick={() => router.push("/auth")}
              >
                Login
              </Button>
            </div>
          )}
        </div>
        <div>
          {name !== "" && (
            <Card className="overflow-hidden bg-muted dark:border-border hover:shadow-md transition-shadow my-2">
              <CardContent className="p-1 text-gray-600 dark:text-gray-400">
                <div
                  className="flex items-center border-border border-b justify-between p-2 cursor-pointer rounded-md dark:hover:bg-zinc-700 hover:bg-gray-200 text-gray-600 dark:text-white"
                  onClick={() => router.push("/profile/manage-garrage")}
                >
                  <div className="flex items-center">
                    <CarFrontIcon className="w-8 h-8 fill-gray-600 stroke-gray-600 dark:fill-white dark:stroke-white stroke-[5px]" />
                    <span className="mx-2 max-sm:text-sm select-none">Manage Garrage</span>
                  </div>
                  <div className="border-t-2 border-r-2 rotate-45 sm:mr-4 mr-2 w-2 h-2 border-gray-600 dark:border-gray-400"></div>
                </div>
                <div
                  className="flex items-center border-border border-b justify-between p-2 cursor-pointer rounded-md dark:hover:bg-zinc-700 hover:bg-gray-200"
                  onClick={() => router.push("/profile/edit")}
                >
                  <div className="flex items-center">
                    <UserIcon className="w-7 h-7 stroke-[12px] fill-gray-600 stroke-gray-600 dark:fill-white dark:stroke-white " />
                    <span className="mx-2 max-sm:text-sm dark:text-white select-none">
                      Manage Profile
                    </span>
                  </div>
                  <div className="border-t-2 border-r-2 rotate-45 sm:mr-4 mr-2 w-2 h-2 border-gray-600 dark:border-gray-400"></div>
                </div>
                <div
                  className={cn("flex items-center justify-between p-2 cursor-pointer rounded-md dark:hover:bg-zinc-700 hover:bg-gray-200",
                    userId == 1 ? "border-b border-border" : ""
                  )}
                  onClick={() => router.push("/profile/manage-customer")}
                >
                  <div className="flex items-center">
                  <Customers className="w-7 h-7 stroke-0 fill-gray-600 stroke-gray-600 dark:fill-white dark:stroke-white " />
                    <span className="mx-2 max-sm:text-sm dark:text-white select-none">
                      Manage Customers
                    </span>
                  </div>
                  <div className="border-t-2 border-r-2 rotate-45 sm:mr-4 mr-2 w-2 h-2 border-gray-600 dark:border-gray-400"></div>
                </div>
                {userId == 1 &&
                  <div
                    className="flex items-center justify-between p-2 cursor-pointer rounded-md dark:hover:bg-zinc-700 hover:bg-gray-200"
                    onClick={() => router.push("/profile/manage-users")}
                  >
                    <div className="flex items-center">
                    <Users className="w-7 h-7 stroke-0 fill-gray-600 stroke-gray-600 dark:fill-white dark:stroke-white " />
                      <span className="mx-2 max-sm:text-sm dark:text-white select-none">
                        Manage Users
                      </span>
                    </div>
                    <div className="border-t-2 border-r-2 rotate-45 sm:mr-4 mr-2 w-2 h-2 border-gray-600 dark:border-gray-400"></div>
                  </div>
                }
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
