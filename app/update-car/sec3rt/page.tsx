'use client'

import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { BASE_URL } from "@/lib/config";
import axios from "axios";
import React from "react"

const Page = () => {
    const handleClick = async () => {
        try{
            await axios.get(`${BASE_URL}/api/v1/car/update-earnings/all`, {
                    headers: {
                      "Content-type": "application/json",
                      authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                  });
            toast({
                title: "Car earnings updated",
                description: "Car earnings updated",
                duration: 5000,
            })
        }
        catch (e){
            console.log(e);
            toast({
                title: "Error updating car",
                description: "Error updating car",
                duration: 5000,
            })
        }
    }

  return (
    <div className="min-h-screen bg-background w-full flex flex-col items-center justify-center">
        <Button onClick={handleClick}>Update car</Button>
    </div>
  )
};

export default Page;
