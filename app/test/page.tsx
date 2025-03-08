'use client'
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/datepicker";
import { toast } from "@/hooks/use-toast";
import { BASE_URL } from "@/lib/config";
import axios from "axios";
import React, { useState } from "react"

const page = () => {
    const [joiningDate, setJoiningDate] = useState<Date>(new Date());
    const handleClick = async() => {
        try{
            const res = await axios.put(`${BASE_URL}/api/v1/customer/set-joining-date/all`,
                {
                    date: joiningDate.toLocaleDateString("en-US"),
                },
                {
                    headers: {
                        "Content-type": "application/json",
                        authorization: `Bearer ` + localStorage.getItem("token"),
                },
                },
            );
              toast({
                title: "Joining date set successfully",
                description: "You can now book appointments",
                duration: 5000,
              })
        }
        catch(error){
            console.log(error)
            toast({
                title: "Error",
                description: "Something went wrong",
                duration: 5000,
            })
        }
    }
  return (
    <div className="flex bg-white/30 dark:bg-black/20 backdrop-blur-md py-24 items-start justify-center h-screen">
      <div className="flex flex-col gap-4 items-center">
        <DatePicker
            className="max-sm:w-[120px]"
            date={joiningDate}
            setDate={setJoiningDate}/>
        <Button
        onClick={handleClick}
        >Set Joining date</Button>
      </div>
    </div>
  )
};

export default page;
