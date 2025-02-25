"use client";
import { useDateStore, useViewStore } from "@/lib/store";
import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";
import SideBarCalendar from "../sidebar/side-bar-calendar";
import { useMediaQuery } from "react-responsive";

const DateButtons = ({open}:{open:boolean}) => {
    const months = useMemo(() => ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Nov","Dec"], []);
    const todaysDate = dayjs();
    const { userSelectedDate, setDate, setMonth, selectedMonthIndex } =
        useDateStore();
    const [selectedMonth,setSelectedMonth] = useState(todaysDate.format("MMM"));
    const { selectedView } = useViewStore();
    const isSmallScreen = useMediaQuery({ query: '(max-width: 640px)' }); 
    const [hydrated, setHydrated] = useState(false);

    useEffect(() => {
      setHydrated(true);
    }, []);

    useEffect(() => {
        setSelectedMonth(months[selectedMonthIndex]);
    }, [selectedMonthIndex]);

    if (!hydrated) {
      return null; // Render nothing on the first render to match server and client HTML
    }
    
    const handleClick = (month:string,index:number) => {
        setSelectedMonth(month);
        const difference = index-selectedMonthIndex;
        setMonth(index);
        if(difference>0){
          setDate(userSelectedDate.add(difference, "month"));
        }else if(difference<0){
          setDate(userSelectedDate.subtract(difference*(-1), "month"));
        }
    }
    return (
        <>
          {
            isSmallScreen && 
            <div className={`${open ? "mt-0 " : "sm:mt-[-58px] mt-[-60px] opacity-0 " }  duration-300 ease-in-out`}>
              <div className={`${(selectedView != "month" && !open) ? "mt-[-290px] opacity-0" : "mt-[-30px] mb-[0]" } my-0 duration-300 ease-in-out`} >
                  {selectedView != "month" &&
                    <SideBarCalendar/>}
              </div>
              <div className=" flex mt-[-25px] w-full justify-around p-2 overflow-scroll scrollbar-hide">
                  { 
                  months.map((month,index) => (
                      <div key={index} className={`p-1 text-sm ${selectedMonth===month ?"bg-primary":"bg-transparent"} cursor-pointer px-2 border border-border rounded-md`}
                      onClick = {() => handleClick(month,index)}
                      >
                      {month}
                      </div>
                  ))
                  }
              </div>
            </div>
          }
        </>
    )
}

export default DateButtons;