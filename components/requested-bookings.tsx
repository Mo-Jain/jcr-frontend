"use client";
import React, { useEffect,  useState } from "react";
import ArrowRight from "@/public/right_arrow.svg";
import BookingIcon from "@/public/online-booking.svg";
import axios from "axios";
import { BASE_URL } from "@/lib/config";
import { Check, Loader2, X } from "lucide-react";
import {  useCarStore } from "@/lib/store";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { BookingSummaryDialog } from "./booking-summary";

export interface Booking {
  id: string;
  carId: number;
  customerContact: string;
  customerName: string;
  end: string; // ISO 8601 date string
  start: string; // ISO 8601 date string
  startTime: string;
  endTime: string;
  status: string;
}

const RequestedBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios.get(`${BASE_URL}/api/v1/booking/requested`, {
          headers: {
            authorization: `Bearer ` + localStorage.getItem("token"),
          },
        });
        setBookings(res.data.bookings);
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, []);



  return (
    <div 
    
    className="w-full z-0 relative p-1 rounded-md shadow-sm bg-white dark:bg-muted z-0 flex flex-col">
      
      <div className="px-4 py-3 border-b border-gray-300 dark:border-border">
        <h3 className="font-semibold text-md">Accept Bookings</h3>
      </div>
      <div className="  py-1 rounded-md   h-[300px] scrollbar-hide overflow-y-scroll  ">
        {bookings && bookings.length > 0 ? (
          <div 
          key={bookings.length} className="flex flex-col gap-1">
            {bookings.map((booking, index) => (
              <Booking
                booking={booking}
                key={index}
                setBookings={setBookings}
              />
            ))}
          </div>
        ) : (
          <div className="w-full h-full flex flex-col justify-center items-center">
            <BookingIcon
              className={`sm:h-16 h-12 sm:w-16 w-12 stroke-[2px] fill-gray-400 stroke-gray-400`}
            />
            <p className="text-center mb-4 text-lg sm:text-2xl text-gray-400 font-bold">
              No Requested Bookings
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const Booking = ({
  booking,
  setBookings
}: {
  booking: Booking;
  setBookings: React.Dispatch<React.SetStateAction<Booking[]>>;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const {cars} = useCarStore();
  const car = cars.find((car) => car.id === booking.carId);
  const [action, setAction] = useState<"confirm" | "reject">("confirm");
  const [open, setOpen] = useState(false)


  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleConsent = async (action : "confirm" | "reject",e?:React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if(e){
      e.preventDefault();
      e.stopPropagation();
    }
    try {
        setAction(action);
        setIsLoading(true);
        await axios.put(`${BASE_URL}/api/v1/booking/${booking.id}/consent`, {
            action: action,
        },
        {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
        toast({
            description: `Successfully ${action}ed`,
            duration: 2000,
        });
        setBookings(prev => prev.filter(booking => booking.id !== booking.id));
        setOpen(false)
    } catch (error) {
        console.log(error);
        toast({
            description: "Failed to confirm",
            variant: "destructive",
            duration: 2000,
        });
        setIsLoading(false);
    }
    setIsLoading(false);
  }

  const handleAccept = () => {
    handleConsent("confirm")
  }

  const handleReject = () => {
    handleConsent("reject")
  }

  return (
    <>
      <BookingSummaryDialog 
        open={open} 
        setOpen={setOpen} 
        booking={booking} 
        onAccept={handleAccept}
        onReject={handleReject}
        action={action}
        isLoading={isLoading}
        />
      <div
        key={booking.id}
        onClick = {() => setOpen(true)}
        className="flex cursor-pointer items-center shadow-sm justify-between w-full bg-gray-100 dark:bg-background rounded-sm p-1 gap-1 sm:p-2 "
      >
        <div className="flex items-center w-full justify-between  gap-1">
          <div>
            <p className="text-xs text-center px-4 text-blue-500">FROM</p>
            <div className="w-full">
              <div className="font-semibold gap-x-1 w-fit text-[#5B4B49] flex max-lg:flex-col flex-wrap lg:justify-center items-center text-center text-xs dark:text-gray-400">
                <p className="whitespace-nowrap">{formatDate(booking.start)}</p>
                <p>{booking.startTime}</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center w-full">
            <div className=" text-center text-xs w-[60px] overflow-hidden text-ellipsis">
              {car?.brand}
            </div>
            <ArrowRight className=" lg:w-12 w-8 stroke-0 fill-blue-400 filter drop-shadow-[2px_2px_rgba(0,0,0,0.1)] flex-shrink-0" />
            <div className=" text-center text-xs w-[60px] overflow-hidden text-ellipsis">
              {car?.model.split(" ")[1]}
            </div>
          </div>
          <div>
            <p className="text-xs text-center px-4 text-blue-500">TO</p>
            <div className="w-full">
              <div className="font-semibold gap-x-1 text-[#5B4B49] flex max-lg:flex-col flex-wrap lg:justify-center items-center text-center text-xs dark:text-gray-400">
                <p className="whitespace-nowrap">{formatDate(booking.end)}</p>
                <p>{booking.endTime}</p>
              </div>
            </div>
          </div>
        </div>
        {!isLoading ?
            <div className="flex items-center w-fit justify-end gap-2 flex-wrap">
                <div 
                onClick ={(e) => handleConsent("confirm",e)}
                className="flex items-center gap-2 py-1 px-2 rounded-sm cursor-pointer bg-blue-500 text-white">
                    <Check className="w-4 h-4" />
                </div>
                <div 
                  onClick ={(e) => handleConsent("reject",e)}
                  className="flex items-center gap-2 py-1 px-2 rounded-sm cursor-pointer bg-red-400 text-white">
                    <X className="w-4 h-4" />
                </div>
            </div>
            :
            <div 
            className={cn("flex items-center gap-2 py-1 px-2 bg-opacity-50 cursor-not-allowed rounded-sm bg-blue-400 text-white",
                action === "reject" && "bg-red-400"
            )}>
                <Loader2 className="w-4 h-4 animate-spin" />
            </div>
        }
      </div>
    </>
  );
};

export default RequestedBookings;
