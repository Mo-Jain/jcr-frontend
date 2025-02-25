"use client";
import { useState } from "react";
import HeaderLeft from "./left-side";
import DateButtons from "./date-buttons";
import HeaderRight from "./right-side";

export default function Header() {
  const [openMonthButtons,setOpenMonthButtons] = useState(false);
  return (
    <div>
      <div className={`absolute overflow-x-hidden  z-10 top-15 border border-border left-0 w-[100%] bg-white dark:bg-background flex items-center justify-between py-2 scrollbar-hide `}>
        <HeaderLeft open={openMonthButtons} setOpen={setOpenMonthButtons}/>
        <HeaderRight setOpen={setOpenMonthButtons}/>
      </div>
      <div className="sm:h-[58px] h-[80px]"></div>
      <DateButtons open={openMonthButtons}/>
    </div>
  );
}
