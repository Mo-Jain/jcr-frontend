'use client'
import React, { useEffect, useMemo, useState } from "react";
import ArrowRight from "@/public/right_arrow.svg";
import Booking from "@/public/online-booking.svg"
import axios from "axios";
import { BASE_URL } from "@/lib/config";
import { useRouter } from "next/navigation";
import BookingStop from "./booking-stop";
import { Loader2 } from "lucide-react";

export interface Booking{
    id: string;
    carId: number;
    carImageUrl: string;
    carName: string;
    carPlateNumber: string;
    carColor:string;
    customerContact: string;
    customerName: string;
    end: string; // ISO 8601 date string
    start: string; // ISO 8601 date string
    startTime: string;
    endTime: string;
    status: string;
    action:string;
    odometerReading:string;
  }



const TakeAction = () => {
    const [bookings,setBookings] = useState<Booking[]>([]);
    
    useEffect(() => {
        async function fetchData() {
          try {
            const res1 = await axios.get(`${BASE_URL}/api/v1/booking/all`, {
              headers: {
                authorization: `Bearer ` + localStorage.getItem('token')
                }
              })
            const tempBookings:Booking[] = [];
            const currDate = new Date();
            currDate.setMinutes(currDate.getMinutes() + 120);
            res1.data.bookings.forEach((booking:Booking) => {
                const startDateTime = new Date(booking.start);
                const endDateTime = new Date(booking.end);

                const [startHour, startMinute] = booking.startTime.split(':').map(Number);
                const [endHour, endMinute] = booking.endTime.split(':').map(Number);

                startDateTime.setHours(startHour, startMinute, 0, 0);
                endDateTime.setHours(endHour, endMinute, 0, 0);
              if(booking.status === "Upcoming" && startDateTime <= currDate){
                tempBookings.push({...booking, action:"Start"});
              }
              else if(booking.status === "Ongoing" && endDateTime <= currDate){
                tempBookings.push({...booking, action:"End"});
              }
            })
            setBookings(tempBookings);
    
          }
          catch (error) {
            console.log(error);
          }
        }
        fetchData();
      },[])

      
      
  return (
        <div className="w-full z-0 relative p-1 rounded-xl shadow-md bg-gray-200 dark:bg-[#161717] z-0 flex flex-col" >
            <div className="px-4 py-3 border-b border-gray-300 dark:border-border">
                <h3 className="font-semibold text-md">Take Action</h3>
            </div>
            <div className="  py-1 rounded-md   h-[300px] scrollbar-hide overflow-y-scroll  ">
                {bookings && bookings.length > 0 ?
                <div key={bookings.length} className="flex flex-col gap-1">
                {bookings.map((booking,index) => (
                    <Booking booking={booking} key={index} setBookings={setBookings}/>
                ))}
                </div>
                :
                <div className="w-full h-full flex flex-col justify-center items-center">
                    <p className="text-center text-lg sm:text-2xl text-gray-400 font-bold">All Bookings are in time</p>
                </div>
                }   
            </div>
        </div>
            
  )
};


const Booking = ({booking,setBookings}:{
  booking:Booking,
  setBookings:React.Dispatch<React.SetStateAction<Booking[]>>
}) => {

  const router = useRouter();
  const [endDate,setEndDate] = useState(new Date(booking.end));
  const [endTime,setEndTime] = useState(booking.endTime);
  const initialReading  = useMemo(() => {
      if(!booking.odometerReading) return "";
      let reading = Math.floor(Number(booking.odometerReading)/1000);
      const thirdLastDigit = parseInt(booking.odometerReading[booking.odometerReading.length - 3]);
      if(thirdLastDigit === 9){
            reading = reading + 1;
        }
        return reading.toString();
    },[booking.odometerReading])
  const [endOdometerReading,setEndOdometerReading] = useState(initialReading);
  const [isOpen,setIsOpen] = useState(false);
  const [isLoading,setIsLoading] = useState(false);
  
  const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
  }

  
  return (
    <>
    <BookingStop 
      isOpen={isOpen} 
      setIsOpen={setIsOpen} 
      endDate={endDate} 
      endTime={endTime} 
      bookingId={booking.id} 
      setEndDate={setEndDate} 
      setEndTime={setEndTime} 
      odometerReading={booking.odometerReading} 
      endOdometerReading={endOdometerReading} 
      setEndOdometerReading={setEndOdometerReading} 
      setBookings={setBookings} setIsLoading ={setIsLoading}
    />
    <div key={booking.id} 
              onClick = {() => router.push(`/booking/${booking.id}`)}
              className="flex cursor-pointer items-center shadow-md justify-between w-full bg-muted gap-2 p-1 rounded-lg">
                  <div className="flex flex-col items-center">
                      <div style={{backgroundColor:booking.carColor}} className="sm:w-8 z-10 bg-green-200 flex-shrink-0 sm:h-8 w-6 h-6 rounded-md"/>
                  </div>
                  <div className="flex items-center w-full justify-between gap-1">
                      <div>
                          <p className="text-xs text-center px-4 text-blue-500">FROM</p>
                          <div className="w-full">
                              <div className="font-semibold gap-x-1 w-fit text-[#5B4B49] flex max-lg:flex-col flex-wrap lg:justify-center items-center text-center text-xs lg:text-sm dark:text-gray-400">
                                  <p className="whitespace-nowrap">{formatDate(booking.start)}</p>
                                  <p>{booking.startTime}</p>
                              </div>
                          </div>
                      </div>
                      <div className="flex flex-col items-center ">
                          <div className=" text-center text-xs w-[60px] overflow-hidden text-ellipsis">{booking.customerName.split(' ')[0]}</div>
                          <ArrowRight className=" lg:w-12 w-8 stroke-0 fill-red-400 filter drop-shadow-[2px_2px_rgba(0,0,0,0.1)] flex-shrink-0" />
                          <div className=" text-center text-xs w-[60px] overflow-hidden text-ellipsis">{booking.customerName.split(' ')[1]}</div>
                      </div>
                      <div>
                          <p className="text-xs text-center px-4 text-blue-500">TO</p>
                          <div className="w-full">
                              <div className="font-semibold gap-x-1 text-[#5B4B49] flex max-lg:flex-col flex-wrap lg:justify-center items-center text-center text-xs lg:text-sm dark:text-gray-400">
                                  <p className="whitespace-nowrap">{formatDate(booking.end)}</p>
                                  <p>{booking.endTime}</p>
                              </div>
                          </div>
                      </div>
                  </div>
                  {booking.action === "Start" ?
                  <div 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    router.push(`/booking/start/form/${booking.id}`)
                  }}
                  className="rounded-full text-sm cursor-pointer bg-red-400 hover:bg-opacity-80 text-white py-1 px-2 sm:px-3">Start</div>
                  :
                  <div 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsOpen(true)
                  }}
                  className="rounded-full text-sm cursor-pointer bg-green-400 hover:bg-opacity-80 text-white py-1 px-2 sm:px-3">
                    {!isLoading ? 
                    <span>End</span>
                    :
                    <div className=" flex items-center justify-center">
                        <Loader2 className="h-4 w-4 animate-spin text-white" />
                    </div>
                  }
                  </div>
                  }
            </div>
    </>
  )
}


export default TakeAction;
