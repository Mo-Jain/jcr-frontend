'use client'
import { BASE_URL } from "@/lib/config";
import axios from "axios";
import { IndianRupee } from "lucide-react";
import React, { useEffect, useState } from "react"

interface Earning {
    id: number;
    brand: string;
    model: string;
    plateNumber: string;
    colorOfBooking: string;
    thisMonth: number;
}

const MonthEarnings = () => {
    const [flag,setFlag] = useState(false);
    const [earnings,setEarnings] = useState<Earning[]>([]);
    
    useEffect(() => {
        async function fetchData() {
          try {
            const res = await axios.get(`${BASE_URL}/api/v1/car/thismonth/earnings/all`, {
              headers: {
                authorization: `Bearer ` + localStorage.getItem('token')
                }
              })
            if(res.data.earnings){
              setFlag(true);
              setEarnings(res.data.earnings);
            }
          
          }
          catch (error) {
            console.log(error);
          }
        }
        fetchData();
      },[])
    
  return (
    <div className="w-full z-0 relative p-1 rounded-xl shadow-md bg-gray-200 dark:bg-[#161717] z-0 flex flex-col xs:bg-blue-500" >
            <div className="px-4 py-3 border-b border-gray-300 dark:border-border">
                <h3 className="font-semibold text-md">This Month Earnings</h3>
            </div>
            <div className="  py-1 rounded-md h-[300px]  ">
            {flag ?
                <div className="flex flex-col gap-1 scrollbar-hide overflow-y-scroll">
                {earnings.map((earning:Earning) => {
                    return(
                <div key={earning.id} className="flex items-center p-2 shadow-md justify-between w-full bg-muted gap-2 p-1 rounded-lg">
                    <div style={{backgroundColor:earning.colorOfBooking}} className="sm:w-8 z-10 flex-shrink-0 sm:h-8 w-6 h-6 rounded-md"/>
                    <div className="flex items-center w-full">
                        <div className="font-semibold text-[#5B4B49] text-xs lg:text-sm dark:text-gray-400">
                            <p className="whitespace-nowrap">{earning.brand} {earning.model}</p>
                            <p className="text-xs">{earning.plateNumber}</p>
                        </div>
                    </div>
                    <div className="font-semibold flex items-center text-[#5B4B49] text-xs lg:text-sm dark:text-gray-400">
                        <IndianRupee className="w-4 h-4"/>
                        <p className="whitespace-nowrap"> {earning.thisMonth}</p>
                    </div>
                </div>
                )})}
                </div>
            :
                  <div className="w-full h-full flex flex-col justify-center items-center">
                    <IndianRupee className={`sm:h-16 h-12 sm:w-16 w-12 stroke-[2px] text-gray-400 `}/>
                    <p className="text-center text-lg sm:text-2xl text-gray-400 font-bold">No earnings yet</p>
                  </div>
            }
            </div>
    </div>
)};

export default MonthEarnings;
