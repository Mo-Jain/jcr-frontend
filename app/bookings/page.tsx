"use client"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { MoreVertical, Plus,  PlusSquare, Trash2 } from "lucide-react"
import Image from "next/image"
import {  useEffect, useRef, useState } from "react"
import { AddBookingDialog } from "@/components/add-booking";
import ArrowRight from "@/public/right_arrow.svg";
import CarIcon from "@/public/car-icon.svg"
import axios from "axios"
import { BASE_URL } from "@/lib/config"
import { cn } from "@/lib/utils"
import { useCarStore } from "@/lib/store"
import Booking from "@/public/online-booking.svg"
import { toast } from "@/hooks/use-toast"
import ExcelUploader from "@/components/excel-upload"
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"


type BookingStatus = "Upcoming" | "Ongoing" | "Completed" | "Cancelled" | "All"

function formatDateTime(dateString: string) {
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
}

function getPickupTime(startDate: string,startTime: string) {
  
  const [hours, minutes] = startTime.split(":").map(Number);
  const currDate = new Date();
  currDate.setHours(hours);
  currDate.setMinutes(minutes - 30); // Subtract 30 minutes

  // Format back to HH:MM
  const newHours = currDate.getHours().toString().padStart(2, "0");
  const newMinutes = currDate.getMinutes().toString().padStart(2, "0");

  const pickup = new Date(startDate); 
  
  if (newHours === "23" && Number(newMinutes) >= 30) {
    pickup.setDate(pickup.getDate() - 1); // Add a day
  }

  const date = pickup.toDateString().replaceAll(' ',', ');
  return `${date} ${newHours}:${newMinutes}`;
}


function getReturnTime(startDate: string,startTime: string) {
  
  const [hours, minutes] = startTime.split(":").map(Number);
  const currDate = new Date();
  currDate.setHours(hours);
  currDate.setMinutes(minutes ); // Subtract 30 minutes

  // Format back to HH:MM
  const newHours = currDate.getHours().toString().padStart(2, "0");
  const newMinutes = currDate.getMinutes().toString().padStart(2, "0");

  const pickup = new Date(startDate); 
  
  if (newHours === "23" && Number(newMinutes) >= 30) {
    pickup.setDate(pickup.getDate() - 1); // Add a day
  }

  const date = pickup.toDateString().replaceAll(' ',', ');
  return `${date} ${newHours}:${newMinutes}`;
}

function getTimeUntilBooking(startTime: string,status:string) {
  if(status === "Completed") return "Trip has ended";
  if(status === "Ongoing") return "Trip has started";
  const now = new Date()
  const start = new Date(startTime)
  const diffTime = start.getTime() - now.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays < 0) return "Trip has started"
  if (diffDays === 0) return "Trip start window opens Today"
  if (diffDays === 1) return "Trip start window opens in 1 day"
  return `Trip start window opens in ${diffDays} days`
}




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
}

export default function Bookings() {
  const {cars} = useCarStore();
  const [selectedCar, setSelectedCar] = useState<string>("All")
  const [bookings,setBookings] = useState<Booking[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<BookingStatus>("All");
  const [isHovered, setIsHovered] = useState(false);
  const [isAddBookingOpen,setIsAddBookingOpen] = useState(false);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [isLoading,setIsLoading] = useState(true);
  const [selectedBookings, setSelectedBookings] = useState<string[]>([]);
  const [isSelectionMode, setIsSelectionMode] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res1 = await axios.get(`${BASE_URL}/api/v1/booking/all`, {
          headers: {
            authorization: `Bearer ` + localStorage.getItem('token')
          }
        })
        setBookings(res1.data.bookings);
        setIsLoading(false);

      }
      catch (error) {
        console.log(error);
        setIsLoading(false);
      }
    }
    fetchData();
  },[setBookings])


  useEffect(() => {
    if(selectedBookings.length === 0){
      setIsSelectionMode(false);
    }else {
      setIsSelectionMode(true);
    }
  },[selectedBookings])


  const handleDelete = async () => {
    try {
      if(selectedBookings.length === 0) return;
      await axios.put(`${BASE_URL}/api/v1/booking/delete-multiple`, {
        bookingIds: selectedBookings
      }, {
          headers: {
              'Content-Type': 'application/json',
              authorization: `Bearer ${localStorage.getItem('token')}`
          }
      });
      setFilteredBookings([]);
      for(const id of selectedBookings){
        setBookings((prev) => prev.filter(booking => booking.id != id))
      }
      toast({
        description: "Bookings successfully deleted",
        duration: 2000
      })
    }
    catch(error) {
      console.log(error);
      toast({
        description: "Something went wrong",
        variant: "destructive",
        duration: 2000
      })
    }
  }

  const handleSelectAll = () => {
    if (filteredBookings.length === selectedBookings.length) {
      setSelectedBookings([]);
    } else {
      setSelectedBookings(filteredBookings.map((booking) => booking.id));
    }
  };


  const handleAddBooking = () =>{
    if(cars.length === 0){
      toast({
        description: `Please add cars`,
        className: "text-black bg-white border-0 rounded-md shadow-mg shadow-black/5 font-normal",
        variant: "destructive",
duration: 2000
      });
      return;
    }
    setIsAddBookingOpen(true);
  }

  useEffect(() => {
    const newfilteredBookings = bookings.filter(
      (booking) =>
        (selectedCar === "All" || booking.carId.toString() === selectedCar) &&
        (selectedStatus === "All" || booking.status === selectedStatus),
    )

    setFilteredBookings(newfilteredBookings);
  },[bookings,selectedCar,selectedStatus])


  return (
    <div className="min-h-screen bg-background">

      {/* Add Booking Dialog */}
        {
          <AddBookingDialog cars={cars} isOpen={isAddBookingOpen} setIsOpen={setIsAddBookingOpen} setBookings={setBookings} />
        }
        {/* Add Booking button */}
        {bookings.length > 0 && (
        <div className="fixed z-[50] sm:hidden bottom-[70px] right-5 flex items-center justify-start whitespace-nowrap"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={handleAddBooking}
          >
          <div className={cn("bg-black px-[15px] overflow-hidden  text-blue-100 hover:border hover:border-gray-700  shadow-lg  rounded-xl w-12 h-12 flex items-center shadow-lg transition-all duration-300 hover:w-40",
            cars && cars.length > 0 ? "cursor-pointer" : "cursor-not-allowed"
          )}>
            {/*<span className={`text-[30px] mt-[-3px] transition-rotate rotate-0 hover:rotate-180 duration-400 flex items-center `}>+</span> */}
            <Plus className="w-8 h-8 stroke-10" />
            <span className={` ${isHovered ? "opacity-100" : "hidden opacity-0"} ml-2 transition-opacity font-bold duration-300`}
            >Add Booking</span>
          </div>
        </div>
      )}

      
      <main className="container mx-auto px-4 py-8 pb-16 sm:pb-8">
        <div className="flex justify-between items-center mb-6">
          <h1 style={{fontFamily:"var(--font-equinox)"}} className="text-3xl max-sm:text-xl font-black">MY BOOKINGS</h1>
          <div className="flex items-center justify-between max-sm:flex-col gap-1">
            <ExcelUploader />
            <Select value={selectedCar} onValueChange={setSelectedCar} >
              <SelectTrigger className="w-[180px] max-sm:w-[130px] hover:bg-gray-200 dark:hover:bg-gray-700">
                <SelectValue placeholder="Select car"/>
              </SelectTrigger>
              <SelectContent className="dark:border-gray-700">
                <SelectItem value="All" className="hover:bg-blue-100 hover:text-black cursor-pointer">All Cars</SelectItem>
                {cars && cars.length > 0 && cars.map((car) => (
                  <SelectItem key={car.id} value={car.id.toString()} className="hover:bg-blue-100 cursor-pointer hover:text-black">
                    {car.brand + " " + car.model}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className=" flex justify-between scrollbar-hide">
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
            <Button variant={selectedStatus === "All" ? "default" : "outline"} className={selectedStatus === "All" ? "bg-blue-400 hover:bg-blue-500 text-white dark:text-black" : "hover:bg-blue-100 bg-transparent dark:text-white dark:hover:bg-gray-700 text-black"} 
              onClick={() => setSelectedStatus("All")}>
              All
            </Button>
            <Button
              variant={selectedStatus === "Upcoming" ? "default" : "outline"} className={selectedStatus === "Upcoming" ? "bg-blue-400 hover:bg-blue-500 text-white dark:text-black" : "hover:bg-blue-100 bg-transparent dark:text-white dark:hover:bg-gray-700 text-black"} 
              onClick={() => setSelectedStatus("Upcoming")}
            >
              Upcoming
            </Button>
            <Button
              variant={selectedStatus === "Ongoing" ? "default" : "outline"} className={selectedStatus === "Ongoing" ? "bg-blue-400 hover:bg-blue-500 text-white dark:text-black" : "hover:bg-blue-100 bg-transparent dark:text-white dark:hover:bg-gray-700 text-black"} 
              onClick={() => setSelectedStatus("Ongoing")}
            >
              Ongoing
            </Button>
            <Button
              variant={selectedStatus === "Completed" ? "default" : "outline"} className={selectedStatus === "Completed" ? "bg-blue-400 hover:bg-blue-500 text-white dark:text-black" : "hover:bg-blue-100 bg-transparent dark:text-white dark:hover:bg-gray-700 text-black"} 
              onClick={() => setSelectedStatus("Completed")}
            >
              Completed
            </Button>
           
          </div>
          {filteredBookings.length > 0 && (
          <Button className="max-sm:hidden bg-blue-600 text-white hover:bg-opacity-10 dark:text-black shadow-lg"
            onClick={handleAddBooking}>
            <PlusSquare className="h-12 w-12" />
            <span className="">Add Booking</span> 
          </Button>
          )}
        </div>
        <div className="border-t overflow-hidden border-border w-full ">
              <div 
              style={{marginTop:selectedBookings.length === 0 ? "-38px" : "4px"}}
              className={`flex items-center justify-between w-full ml-0 transition-all duration-300 gap-3 ${isSelectionMode ? "mt-0" : "" } items-center mt-2`}>
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={filteredBookings.length === selectedBookings.length}
                    onClick ={handleSelectAll}
                    className={`h-5 w-5 max-sm:w-4 max-sm:h-4 transition-all  duration-300 sm:rounded-md accent-blue-300`}
                  />
                  <span className={` transition-all duration-300 text-sm`}>Select All</span>
                </div>
                <Button variant="outline" 
                onClick = {handleDelete}
                className="flex items-center gap-2">
                  <Trash2 className="w-4 h-4"/>
                  <span>Delete</span>
                </Button>
              </div>
        </div>
        {bookings.length > 0 ? (
        <div ref={containerRef} className="space-y-4">
          {filteredBookings.map((booking,index) => (
            <BookingCard key={index} booking={booking} selectedBookings={selectedBookings} setSelectedBookings={setSelectedBookings}/>
          ))}
          {filteredBookings.length === 0 && <div className="w-full h-full py-28 gap-2 flex flex-col justify-center items-center">
            <Booking className={`sm:h-16 h-12 sm:w-16 w-12 stroke-[5px] fill-gray-400 `}/>
            <p className="text-center text-lg sm:text-2xl text-gray-400 font-bold">No Bookings in this category</p>
          </div>}
        </div>
        ) : (
        <div key={2}>
          {!isLoading ? <div className="w-full h-full py-28 gap-2 flex flex-col justify-center items-center">
            <Booking className={`sm:h-16 h-12 sm:w-16 w-12 stroke-[5px] fill-gray-400 `}/>
            <p className="text-center text-lg sm:text-2xl text-gray-400 font-bold">Click below to create your first booking</p>
            <Button className="bg-blue-600 text-white dark:text-black hover:bg-opacity-80  shadow-lg"
              onClick={() => setIsAddBookingOpen(true)}>
              <Plus className="text-20 h-60 w-60 stroke-[4px]" />
            </Button> 
          </div>
          :
          <div className="w-full h-full py-28 gap-2 flex justify-center items-center">
            <span className="sr-only">Loading...</span>
            <div className="h-8 w-8 bg-primary border-[2px] border-border rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="h-8 w-8 bg-primary border-[2px] border-border rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="h-8 w-8 bg-primary border-[2px] border-border rounded-full animate-bounce"></div>
          </div>
          }
        </div>
        )}
      </main>
    </div>
  )
}


const BookingCard =({booking,selectedBookings,setSelectedBookings}:{
  selectedBookings:string[],
  setSelectedBookings:React.Dispatch<React.SetStateAction<string[]>>,
  booking:Booking
}) => {

  const [isDropDownOpen,setIsDropdownOpen] = useState(false);
  const handleCheckboxChange = (id: string) => {
    setSelectedBookings((prev) =>
      prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id]
    );
  };

  function getHeader(status:string,startDate:string,startTime:string,endDate:string,endTime:string) {
    let headerText="";
    const startDateTime = new Date(startDate);
    const endDateTime = new Date(endDate);
  
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);
    startDateTime.setHours(startHour, startMinute, 0, 0);
    endDateTime.setHours(endHour, endMinute, 0, 0);
    const currDate = new Date();
    if(status === "Upcoming") {
      if(startDateTime >= currDate) {
        headerText="Guest shall pickup car by";
      } else {
        headerText="Guest was scheduled to pickup car by";
      }
    } else if(status === "Ongoing") {
      if(endDateTime < currDate) {
        headerText="Guest was scheduled to return by";
      } else {
        headerText="Guest shall return by";
      }
  
    } else if(status === "Completed") {
      headerText="Guest returned at";
    };
  
    return headerText;
  
  }

  return (
      <div style={{marginTop:0}} className="flex gap-2 overflow-hidden mt-0 items-center w-full">
          <Checkbox
          checked={selectedBookings.includes(booking.id)}
          onClick={() => handleCheckboxChange(booking.id)}
          className={`h-5 w-5 max-sm:w-4 max-sm:h-4 ${selectedBookings.length > 0 ? "ml-0" : "-ml-6"} transition-all duration-300 p-0 sm:rounded-md accent-blue-300`}
        />
        <Card className="w-full overflow-hidden hover:shadow-md dark:border-card transition-shadow my-2">
            <Link href={`/booking/${booking.id}`} >
            <CardContent className="p-0">
              {/* Rest of the card content remains the same */}
              <div className="flex justify-between bg-gray-100   dark:bg-muted pr-2 items-center">
                {booking.status === "Upcoming" 
                ? 
                <div className="px-2 sm:px-4 ">
                  <p className="text-sm max-sm:text-xs text-blue-500">{getHeader(booking.status,booking.start,booking.startTime,booking.end,booking.endTime)}</p>
                  <p className="font-semibold text-[#5B4B49] max-sm:text-xs dark:text-gray-400">{getPickupTime(booking.start,booking.startTime)} </p>
                </div>
                :
                <div className="px-2 sm:px-4 ">
                  <p className="text-sm max-sm:text-xs text-blue-500">{getHeader(booking.status,booking.start,booking.startTime,booking.end,booking.endTime)}</p>
                  <p className="font-semibold text-[#5B4B49] max-sm:text-xs dark:text-gray-400">{getReturnTime(booking.end,booking.endTime)} </p>
                </div>
                }
                <div className="flex items-center justify-between w-fit ">
                  <div className="flex items-center sm:pr-10">
                    <div style={{backgroundColor:booking.carColor}} className="sm:w-8 z-0 bg-green-200 flex-shrink-0 sm:h-8 w-6 h-6 rounded-md"/>
                    <div className="p-4 max-sm:p-1">
                      <p className="text-sm max-sm:text-xs text-blue-500">BOOKING ID:</p>
                      <p className=" text-[#5B4B49] max-sm:text-xs text-sm dark:text-gray-400">{booking.id} </p>
                    </div>

                  </div>
                  <div className="">
                      <DropdownMenu modal={false} open={isDropDownOpen} onOpenChange={setIsDropdownOpen}>
                        <DropdownMenuTrigger asChild
                          onClick={(e) => {
                            e.preventDefault(); 
                            e.stopPropagation();
                          }}
                        >
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreVertical className="h-4 w-4 sm:w-6 sm:h-6" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="border-border">
                          <DropdownMenuItem className="cursor-pointer" 
                              onClick={(e) => {
                                e.preventDefault(); 
                                e.stopPropagation();
                                setIsDropdownOpen(false);
                                setSelectedBookings((prev) =>
                                  prev.includes(booking.id) ? prev : [...prev, booking.id]
                                );
                              }}  
                          >
                            <span>Select</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                  </div>
                </div>
              </div>
              <hr className="border-t border-border" />
              <div className=" bg-white dark:bg-background flex flex-row-reverse items-start justify-between">
                <div className="flex-1 sm:p-4 py-2 px-2">
                  <div className="flex items-center sm:gap-12 gap-2">
                    <div >
                      <p className="text-xs sm:text-sm text-blue-500">FROM</p>
                      <p className="font-semibold text-[#5B4B49] text-center text-xs sm:text-sm dark:text-gray-400">{formatDateTime(booking.start)} {booking.startTime}</p>
                    </div>
                    <ArrowRight className="mt-4 stroke-0 sm:w-12 w-8 filter drop-shadow-[2px_2px_rgba(0,0,0,0.1)] fill-blue-400 flex-shrink-0" />
                    <div>
                      <p className="sm:text-sm text-xs text-blue-500">TO</p>
                      <p className="font-semibold text-[#5B4B49] text-center text-xs sm:text-sm dark:text-gray-400">{formatDateTime(booking.end)} {booking.endTime}</p>
                    </div>
                  </div>
                  <div className="flex items-center w-full sm:w-4/5 justify-between mt-2 sm:mt-8 sm:gap-8 gap-2">
                    <div>
                      <p className="text-xs sm:text-sm text-blue-500">BOOKED BY</p>
                      <p className="font-semibold text-[#5B4B49] text-xs sm:text-sm dark:text-gray-400">{booking.customerName}</p>
                    </div>
                    <div>
                      <p className="sm:text-sm text-xs text-blue-500">CONTACT</p>
                      <p className="font-semibold text-[#5B4B49] text-xs sm:text-sm dark:text-gray-400">{booking.customerContact}</p>
                    </div>
                  </div>
                </div>
                <div className="text-center flex flex-col items-center p-4 max-sm:p-2  border-r border-border">
                  <div className="relative sm:w-24 flex items-center sm:h-20 rounded-md border border-border w-16 h-12 mb-2"> 
                    { booking.carImageUrl ?
                      <Image
                      src={booking.carImageUrl}
                      alt={booking.carName}
                      fill
                      priority={true}
                      sizes={'6'}
                      className="object-cover rounded w-full"
                    />
                    :
                    <CarIcon className="w-full dark:stroke-blue-200  dark:fill-blue-200 p-1 stroke-black fill-black" /> 
                    }
                  </div>
                  <p className="text-sm max-sm:text-xs max-sm:max-w-[80px] overflow-hidden font-semibold">{booking.carName}</p>
                  <p className="text-xs text-blue-400 max-sm:text-[10px]">{booking.carPlateNumber}</p>
                </div>
              </div>
              <div className="p-4 max-sm:p-2 bg-green-100 flex dark:bg-secondary items-center text-green-600 dark:text-green-400 gap-2">
                <CarIcon className="w-8 h-3 stroke-green-600 dark:stroke-green-400 fill-green-600 dark:fill-green-400 stroke-[4px]" />
                <p className="text-sm max-sm:text-xs ">{getTimeUntilBooking(booking.start,booking.status)}</p>
                
              </div>
            </CardContent>
            </Link>
          </Card>
      </div>

  )
}

