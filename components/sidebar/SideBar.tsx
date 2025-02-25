import { cn } from "@/lib/utils";
import React from "react";
import SideBarCalendar from "./side-bar-calendar";
import SearchUsers from "./search-users";
import MyCars from "./my-cars";
import { useToggleSideBarStore } from "@/lib/store";

export default function SideBar() {
  const { isSideBarOpen } = useToggleSideBarStore();
  return (
      <aside
        className={cn(
          "border-border py-3 transition-all  max-lg:w-0 duration-300 ease-in-out",
            isSideBarOpen === false ? "lg:ml-[-220px] opacity-0 " : "ml-0"
          
        )}
        style={{ overflow: 'hidden' }}
      >
      <SideBarCalendar />
      <SearchUsers />
      <MyCars />
    </aside>    
  );
}
