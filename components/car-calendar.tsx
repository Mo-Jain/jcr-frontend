'use client'
import { useDateStore, useSearchStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import dayjs from "dayjs";
import React, { Fragment, useEffect, useMemo, useRef, useState} from "react";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";

export default function Calendar({
    selectDate,
    setSelectDate,
    className,
}:{
    selectDate:"start" | "end",
    setSelectDate:React.Dispatch<React.SetStateAction<"start" | "end">>,
    className?:string,
}) {
  const {
    setMonth,
    selectedMonthIndex,
    twoDMonthArray,
  } = useDateStore();

  const timeListRef = useRef<HTMLDivElement | null>(null);
  
  const timeArr = useMemo(() => [
        "12:30","1:00","1:30","2:00","2:30","3:00","3:30","4:00","4:30",
        "5:00","5:30","6:00","6:30","7:00","7:30","8:00","8:30","9:00","9:30",
        "10:00","10:30","11:00","11:30","12:00"
    ],[])

    const [selectedTime, setSelectedTime] = useState<string>(timeArr[16]);
    const [period,setPeriod] = useState<"AM" | "PM">("AM");

    const {startDate,setStartDate,endDate,setEndDate,startTime,setStartTime,endTime,setEndTime} = useSearchStore();

    useEffect(() => {
        if (timeListRef.current) {
          const index = timeArr.indexOf(selectedTime);
      
          if (index !== -1) {
            const isSmallScreen = window.innerWidth <= 640; // Adjust breakpoint if needed
            const parentSize = isSmallScreen ? 200 : 220; // Width for small screens, height for large screens
            const itemSize = isSmallScreen ? 45 : 28; // Approximate size of each item
      
            timeListRef.current.scrollTo({
              [isSmallScreen ? "left" : "top"]: index * itemSize - (parentSize / 2) + (itemSize / 2),
              behavior: "smooth",
            });
          }
        }
      }, [selectedTime, timeArr]);

    useEffect(() => {
        if(selectDate === "start"){
            setSelectedTime(startTime.split(" ")[0]);
            if(startTime.split(" ")[1] === "AM"){
                setPeriod("AM");
            }else{
                setPeriod("PM");
            }
        }else {
            setSelectedTime(endTime.split(" ")[0]);
            if(endTime.split(" ")[1] === "AM"){
                setPeriod("AM");
            }else{
                setPeriod("PM");
            }
        }
      },[selectDate,startTime,endTime])
      

  const handleTimeClick = (time: string) => {
    setSelectedTime(time);
    if(selectDate==="start"){
        setStartTime(time + " " + period);
    }else {
        setEndTime(time + " " + period);
    }
  };

  const handlePeriodClick = (period: "AM" | "PM") => {
    setPeriod(period);
    if(selectDate==="start"){
        setStartTime(startTime.split(" ")[0] + " " + period);
    }else {
        setEndTime(endTime.split(" ")[0] + " " + period);
    }
  }
    
  const handleDateClick = (day: dayjs.Dayjs) => {
    if(checkPrevDate(day)) return;
    if(selectDate === "start"){
        setStartDate(day.toDate());
        if(!endDate || day.toDate().getTime() > endDate.getTime()){
          setEndDate(null);
        }
        setSelectDate("end");
    }
    else{
        setEndDate(day.toDate());
        setSelectDate("start");
    }
  };

  const handlePrevClick = () => {
    setMonth(selectedMonthIndex - 1);
  };

  const handleNextClick = () => {
    setMonth(selectedMonthIndex + 1);
  };

  const checkPrevDate = (day:dayjs.Dayjs) => {
    const currDate = dayjs();
    let flag = false;
    if((
        day.date() < currDate.date() && 
        day.month() === currDate.month() && 
        day.year() === currDate.year()
    ) ||  
        day.month() < currDate.month() || 
        day.year() < currDate.year()
    ){
      flag = true;
    }
    return flag;
  }

  return (
    <div 
    style={{ fontFamily: "var(--font-leoscar), sans-serif" }}
    className={cn("p-3 bg-background rounded-md", className)}>
      <div className="flex items-center font-bold  justify-between">
        <h4 className="text-sm sm:text-md">
          {dayjs(new Date(dayjs().year(), selectedMonthIndex)).format(
            "MMMM YYYY",
          )}
        </h4>

        <div className="flex items-center gap-3">
          <MdKeyboardArrowLeft
            className="size-5 cursor-pointer font-bold"
            onClick={handlePrevClick}
          />
          <MdKeyboardArrowRight
            className="size-5 cursor-pointer font-bold"
            onClick={handleNextClick}
          />
        </div>
      </div>

      

      {/* Main Content: Weeks and Days */}
      <div className=" flex max-sm:flex-col items-center gap-2 text-gray-600 dark:text-gray-400 text-xs sm:text-sm">
        <div>
            {/* Header Row: Days of the Week */}
            <div className="mt-2 font-semibold">
                <div className="grid grid-cols-7 text-xs sm:text-sm">
                {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
                    <span key={i} className="py-1 text-center">
                    {day}
                    </span>
                ))}
                </div>
            </div>
            {/* Dates grid */}
            <div className="grid grid-cols-7 w-[200px] sm:min-w-[246px] gap-x-0 grid-rows-5 gap-y-1 justify-items-center rounded-sm p-1 text-xs sm:text-sm">
            {twoDMonthArray.map((row, i) => (
                <Fragment key={i}>
                {row.map((day, index) => {
                    return(
                    <div
                    key={index}
                    className={cn(
                        "flex h-5 w-full p-3 sm:p-4 relative flex items-center justify-center rounded-sm ",
                        checkPrevDate(day) ? "" : " hover:bg-blue-600 hover:text-white cursor-pointer",
                        day.format("DD-MM-YY") === dayjs(startDate).format("DD-MM-YY") &&
                        "bg-blue-600 text-white rounded-r-none",
                        day.format("DD-MM-YY") === dayjs(endDate).format("DD-MM-YY") &&
                        "bg-blue-600 text-white rounded-l-none",
                        day.isAfter(dayjs(startDate)) && day.isBefore(dayjs(endDate)) && endDate!==null && "bg-blue-600 text-white rounded-none",
                    )}
                    onClick={() => handleDateClick(day)}
                    >
                    <div className={checkPrevDate(day) ? "opacity-30" : ""}>
                      <span>{day.format("D")}</span>
                      <span className={cn("flex justify-center items-center text-center px-1 max-sm:w-full ",
                          checkPrevDate(day) ? "" : "hidden"
                      )}>
                          <span className="border-t absolute top-[45%] left-0 border-gray-600 dark:border-gray-400 w-6 h-1"/>
                      </span>
                    </div>
                    </div>
                )})}
                </Fragment>
            ))}
            </div>
        </div>

        {/* Time Input */}
        <div 
        ref={timeListRef}
        className="flex sm:flex-col h-full max-h-[175px] sm:max-h-[220px] max-w-[200px] overflow-scroll scrollbar-hide">
            {timeArr.map((time, index) => (
            <p
              key={index}
              onClick={() => handleTimeClick(time)}
              style={{ fontFamily: "var(--font-bigjohnbold), sans-serif" }}
              className={cn(
                "text-sm sm:text-md max-sm:w-[45px] font-semibold whitespace-nowrap px-2 py-1 cursor-pointer",
                time === selectedTime ? "bg-blue-500 text-white rounded-sm" : ""
              )}
            >
              {time}
            </p>
          ))}
        </div>
        <div className="h-full flex sm:flex-col gap-4 items-center justify-center">
            <p 
            onClick={() => handlePeriodClick("AM")}
            className={`cursor-pointer p-2 ${period === "AM" ? "bg-blue-500 text-white rounded-sm" : ""}`}>AM</p>
            <p 
            onClick={() => handlePeriodClick("PM")}
            className={`cursor-pointer p-2 ${period === "PM" ? "bg-blue-500 text-white rounded-sm" : ""}`}>PM</p>
        </div>
      </div>
    </div>
  );
}
