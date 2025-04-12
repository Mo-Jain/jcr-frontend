"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useUserStore } from "@/lib/store";
import HomeIcon from "@/public/home.svg";
import BookingIcon from "@/public/online-booking.svg";
import CalendarIcon from "@/public/calendar.svg";
import CarIcon from "@/public/car-search.svg";


type NavItem = {
  id: string;
  href: string;
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: React.ComponentType<any> | null;
};

type ProfileIconProps = {
  selected: boolean;
  imageUrl: string | null;
  shortName: string;
};

const NAV_ITEMS: NavItem[] = [
  { id: "home", href: "/", icon: HomeIcon },
  { id: "bookings", href: "/bookings", icon: BookingIcon },
  { id: " cars", href: "/cars", icon: CarIcon },
  { id: "calendar", href: "/calendar", icon: CalendarIcon },
  { id: "profile", href: "/profile", icon: null },
];

export function BottomNav() {
  const [selectedTab, setSelectedTab] = useState<string>("home");
  const pathname = usePathname();
  const { name, imageUrl } = useUserStore();
  const gethortName = useCallback(() => {
      if (!name) return;
      const nameArray = name.trim().split(" ");
      let shortName = "";
      if (nameArray.length > 0) {
        shortName = nameArray[0][0] + nameArray[nameArray.length - 1][0];
      } else {
        shortName = nameArray[0][0];
      }
      return shortName.toLocaleUpperCase();
    },[name]);

  const [shortName, setShortName] = useState(gethortName());


  useEffect(() => {
    const matchedTab =
      NAV_ITEMS.find(
        ({ href }) => pathname === href || pathname.startsWith(`${href}/`),
      )?.id || "home";
    setSelectedTab(matchedTab);
  }, [pathname]);

  useEffect(() => {
    setShortName(gethortName());
  }, [setShortName,gethortName]);


  return (
    <div className="relative no-print pdf-mode:hidden">
      <div className="w-full h-[48px] sm:hidden"></div>
      <nav className="fixed z-[99999] bottom-0 left-0 right-0 border-t dark:border-border bg-white bg-opacity-60 dark:bg-black dark:bg-opacity-50 backdrop-blur-lg  sm:hidden">
        {name ? (
          <div className="flex justify-around py-2">
            {NAV_ITEMS.map(({ id, href, icon: Icon }) => (
              <Link key={id} href={href} className="flex flex-col items-center">
                {id === "profile" ? (
                  <ProfileIcon
                    selected={selectedTab === id}
                    imageUrl={imageUrl}
                    shortName={shortName || ""}
                  />
                ) : (
                  Icon && (
                    <Icon
                      className={`h-8 ${Icon === CarIcon ? "stroke-[12px] w-10" : "w-8"} ${getIconClasses(selectedTab === id)}`}
                    />
                  )
                )}
              </Link>
            ))}
          </div>
        ) : (
          <Link
            href="/"
            className={`flex flex-col py-2 items-center ${getTextClasses(selectedTab === "home")}`}
          >
            <HomeIcon className="h-8 w-8 fill-gray-500" />
          </Link>
        )}
      </nav>
    </div>
  );
}

function ProfileIcon({ selected, imageUrl, shortName }: ProfileIconProps) {
  return (
    <div className="max-h-8 max-w-8 flex flex-col items-center">
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt="Profile"
          width={24}
          height={24}
          className={`h-8 w-8 object-cover rounded-full border-2 ${selected ? "border-primary" : "border-transparent"}`}
        />
      ) : (
        <span
          className={`h-8 w-8 text-xs border-[2px] p-2 font-extrabold rounded-full flex justify-center items-center ${getTextClasses(selected)}`}
        >
          {shortName}
        </span>
      )}
    </div>
  );
}

function getIconClasses(selected: boolean): string {
  return selected ? " fill-primary stroke-primary" : "fill-gray-500 stroke-gray-500";
}

function getTextClasses(selected: boolean): string {
  return selected
    ? "border-primary text-primary"
    : "text-gray-500 border-gray-500";
}
