"use client";
import {  Car, useSearchStore} from "@/lib/store";
import { Button } from "./ui/button";
import Calendar from "./car-calendar";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "react-responsive";
import LocationIcon from "@/public/location.svg";
import { toast } from "@/hooks/use-toast";
import axios from "axios";
import { BASE_URL } from "@/lib/config";

const smoothScrollTo = (targetY: number, duration: number = 600) => {
  const startY = window.scrollY;
  const difference = targetY - startY;
  const startTime = performance.now();

  const step = (currentTime: number) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1); // Keep progress between 0 and 1
    window.scrollTo(0, startY + difference * progress);

    if (progress < 1) {
      requestAnimationFrame(step);
    }
  };

  requestAnimationFrame(step);
};

export const CarSearch = ({setFilteredCars,setIsLoading}:{
  setFilteredCars:React.Dispatch<React.SetStateAction<Car[]>>,
  setIsLoading:React.Dispatch<React.SetStateAction<boolean>>
}) => {
  const [selectDate, setSelectDate] = useState<"start"|"end">("start");
  const [isOpen, setIsOpen] = useState(false);
  const isSmallScreen = useMediaQuery({ maxWidth: 640 });
  const {startDate,endDate,startTime,endTime,setIsSearching} = useSearchStore();  
  const calendarRef = useRef<HTMLDivElement>(null);
  

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  function convertTime(time:string){
    const [hour, minute] = time.split(" ")[0].split(':').map(Number);
    const period = time.split(" ")[1];
    if(period === "PM") {
        return `${hour+12}:${minute}`
    }
    else{
      if (hour < 10 ) return `0${hour}:${minute}`
        return `${hour}:${minute}`
    }
  }

  const handleSearch = async() => {
    if(!endDate || endDate === null) {
      toast({
        description: "Please select trip end date",
        duration:2000
      })
      return;
    };
    setIsSearching(false);
    const scrollY = window.scrollY;
    const end = isSmallScreen ? 110 : 130;
    const duration = 200 * (200 - scrollY) / end;
    smoothScrollTo(end,duration);
    try{
      setIsLoading(true);
      const start  = startDate.toDateString()
      const end = endDate.toDateString()
      const newStartTime = convertTime(startTime);
      const newEndTime = convertTime(endTime);
      const user:string = "admin";
      const res =  await axios.get(`${BASE_URL}/api/v1/customer/filtered-cars?startDate=${start}&endDate=${end}&startTime=${newStartTime}&endTime=${newEndTime}&user=${user}`,{
                      headers: {
                        'Content-type': 'application/json',
                        authorization: ` Bearer ${localStorage.getItem("token")}`
                      }
                    })
      setFilteredCars(res.data.cars);
      setIsSearching(true);
    }catch(e){
      console.log(e);
      toast({
        description: "Something went wrong",
        duration:2000
      })
    }
    setIsLoading(false);
  }

  return (
      <section className=" max-sm:mt-[60px] mt-12">
        {/* Background Components */}
          
        <div className="container h-fit ">
          <div className=" ">
            <div className="py-8 pb-12 max-sm:my-6 max-sm:mt-16 flex flex-col items-center justify-center">
              <div className="relative w-fit bg-white/20 dark:bg-muted backdrop-blur-lg rounded-md px-5 py-3 sm:px-10 sm:py-6 flex flex-col items-center">
                <h1
                  className="sm:text-xl text-md font-bold text-gray-500 dark:text-gray-400 mb-1"
                  style={{ fontFamily: "var(--font-alma), sans-serif" }}
                >
                  SELECT TRIP PERIOD
                </h1>
                <div className="w-full flex items-center gap-2 border rounded-sm border-black/10 dark:border-white/15 p-2 mb-4">
                  <LocationIcon className="w-7 h-6 mr-3 stroke-[20px] stroke-gray-500 fill-gray-500 dark:stroke-gray-400 dark:fill-gray-400" />
                  <p className="text-sm sm:text-md text-gray-500 dark:text-gray-400">Ahmedabad</p>
                </div>
                <div ref={calendarRef} 
                className="relative z-10 flex items-center gap-2 sm:gap-8 w-full h-fit justify-center mb-6">
                  <div 
                  onClick={() => {
                    setIsOpen(true)
                    setSelectDate("start")
                  }}
                  className={cn("flex flex-col rounded-sm p-4 sm:px-6 min-w-[136px] sm:min-w-[220px] text-xs sm:text-xl border-2 cursor-pointer border-black/10 dark:border-white/15",
                                isOpen && selectDate === "start" && "border-2 border-blue-400 dark:border-blue-400 shadow-md shadow-black/25 dark:shadow-black/40"
                  )}>
                    <p >FROM</p>
                    <p 
                    style={{ fontFamily: "var(--font-bigjohnbold), sans-serif" }} 
                    className="text-md font-semibold whitespace-nowrap">{startDate.toLocaleString("en-US", {month:"short",day:"numeric"})}, {startTime}</p>
                  </div>
                  <div 
                  onClick={() => {
                    setIsOpen(true)
                    setSelectDate("end")
                  }}
                  
                  className={cn("flex flex-col rounded-sm p-4 sm:px-6 min-w-[136px] sm:min-w-[220px] text-xs sm:text-xl border-2 cursor-pointer border-black/10 dark:border-white/15 ",
                                isOpen && selectDate === "end" && "border-2 border-blue-400 dark:border-blue-400 shadow-md shadow-black/25 dark:shadow-black/40"
                  )}>
                    <p>TO</p>
                    {endDate ?
                    <p 
                    style={{ fontFamily: "var(--font-bigjohnbold), sans-serif" }} 
                    className="text-md font-semibold whitespace-nowrap">{endDate.toLocaleString("en-US", {month:"short",day:"numeric"})}, {endTime}</p>
                    :
                    <p 
                    style={{ fontFamily: "var(--font-bigjohnbold), sans-serif" }} 
                    className="text-md font-semibold whitespace-nowrap">Select Date</p>
                    }
                  </div>
                  <Calendar 
                    selectDate={selectDate}
                    setSelectDate={setSelectDate}
                    className={`absolute top-[105%] ${selectDate==="start"? "left-0" : "left-[90px] sm:left-56"} z-100 transition-all duration-300 ${!isOpen && "hidden"}`}
                    />
                </div>
                <div className="absolute -bottom-[10%] sm:-bottom-[8%] text-white left-0 w-full flex items-center justify-center">
                  <Button 
                  onClick={handleSearch}
                  style={{ fontFamily: "var(--font-bigjohnbold), sans-serif" }}
                  className="px-8 rounded-full active:scale-[0.95] sm:text-lg text-white">Search</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
  );
};
