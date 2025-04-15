"use client";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Check, MoreVertical, Plus, Trash2, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { AddBookingDialog } from "@/components/add-booking";
import ArrowRight from "@/public/right_arrow.svg";
import CarIcon from "@/public/car-icon.svg";
import axios from "axios";
import { BASE_URL } from "@/lib/config";
import { cn } from "@/lib/utils";
import { useCarStore, useEventStore } from "@/lib/store";
import Booking from "@/public/online-booking.svg";
import { toast } from "@/hooks/use-toast";
import ExcelUploader from "@/components/excel-upload";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Loader from "@/components/loader";
import Loader2 from "@/components/loader2";
import LoaderOverlay from "@/components/loader-overlay";

type BookingStatus = "Requested" | "Upcoming" | "Ongoing" | "Completed" | "Cancelled" | "All";

function formatDateTime(dateString: string) {
  return new Date(dateString).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getReturnTime(startDate: string, startTime: string,status:string) {
  const [hours, minutes] = startTime.split(":").map(Number);
  const currDate = new Date();
  currDate.setHours(hours);
  currDate.setMinutes(status === "Upcoming" ? minutes-30 : minutes); // Subtract 30 minutes

  // Format back to HH:MM
  const newHours = currDate.getHours().toString().padStart(2, "0");
  const newMinutes = currDate.getMinutes().toString().padStart(2, "0");

  const pickup = new Date(startDate);

  if (newHours === "23" && Number(newMinutes) >= 30 && status === "Upcoming") {
    pickup.setDate(pickup.getDate() - 1); // Add a day
  }

  const date = pickup.toDateString().replaceAll(" ", ", ");
  return `${date} ${newHours}:${newMinutes}`;
}

function getTimeUntilBooking(startTime: string, status: string) {
  if (status === "Completed") return "Booking has ended";
  if (status === "Cancelled") return "Booking has been cancelled";
  if (status === "Ongoing") return "Booking has started";
  if( status === "Requested") return "Booking hasn't been confirmed";
  const now = new Date();
  const start = new Date(startTime);
  const diffTime = start.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return "Booking has started";
  if (diffDays === 0) return "Booking will start Today";
  if (diffDays === 1) return "Booking will start in 1 day";
  return `Booking will start in ${diffDays} days`;
}

export interface Booking {
  id: string;
  carId: number;
  carImageUrl: string;
  carName: string;
  carPlateNumber: string;
  carColor: string;
  customerContact: string;
  customerName: string;
  end: string; // ISO 8601 date string
  start: string; // ISO 8601 date string
  startTime: string;
  endTime: string;
  status: string;
  isAdmin: boolean;
  type: string;
  otp: string;
}

export default function Bookings() {
  const { cars } = useCarStore();
  const {events,setEvents} = useEventStore();
  const [selectedCar, setSelectedCar] = useState<string>("All");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<BookingStatus>("Upcoming");
  const [isAddBookingOpen, setIsAddBookingOpen] = useState(false);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBookings, setSelectedBookings] = useState<string[]>([]);
  const [isSelectionMode, setIsSelectionMode] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isDeleting,setIsDeleting] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios.get(`${BASE_URL}/api/v1/booking/all`, {
          headers: {
            authorization: `Bearer ` + localStorage.getItem("token"),
          },
        });
        
        setBookings(res.data.bookings);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
        setIsLoading(false);
      }
    }
    fetchData();
  }, [setBookings]);

  useEffect(() => {
    if (selectedBookings.length === 0) {
      setIsSelectionMode(false);
    } else {
      setIsSelectionMode(true);
    }
  }, [selectedBookings]);

  const getBookingLength = (status: string) => {
    let length = 0;
    const newBookings = bookings.filter(
      (booking) => (selectedCar === "All" || booking.carId.toString() === selectedCar))

    if (status === "All"){
      length = newBookings.length;
    }else if (status === "Upcoming"){
      length = newBookings.filter(booking => booking.status === "Upcoming").length;
    }else if (status === "Ongoing"){
      length = newBookings.filter(booking => booking.status === "Ongoing").length;
    }else if (status === "Completed"){
      length = newBookings.filter(booking => booking.status === "Completed").length;
    }else if (status === "Cancelled"){
      length = newBookings.filter(booking => booking.status === "Cancelled").length;
    }else if (status === "Requested"){
      length = newBookings.filter(booking => booking.status === "Requested").length;
    }
    return length > 0 ? ` (${length})` : "";
  }

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      if (selectedBookings.length === 0) return;
      await axios.put(
        `${BASE_URL}/api/v1/booking/delete-multiple`,
        {
          bookingIds: selectedBookings,
        },
        {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      setFilteredBookings([]);
      for (const id of selectedBookings) {
        setBookings((prev) => prev.filter((booking) => booking.id != id));
        setEvents(events.filter((event) => event.id != id));
      }
      setSelectedBookings([]);
      setIsSelectionMode(false);
      toast({
        description: "Bookings successfully deleted",
        duration: 2000,
      });
      
    } catch (error) {
      console.log(error);
      toast({
        description: "Something went wrong",
        variant: "destructive",
        duration: 2000,
      });
    }
    setIsDeleting(false);
  };

  const handleSelectAll = () => {
    const adminBookings = filteredBookings.filter(booking => booking.isAdmin);
    if (adminBookings.length === selectedBookings.length) {
      setSelectedBookings([]);
    } else {
      setSelectedBookings(adminBookings.map((booking) => booking.id));
    }
  };

  useEffect(() =>{
    console.log("selectedBookings",selectedBookings)
  },[selectedBookings])

  useEffect(() => {
    const newfilteredBookings = bookings.filter(
      (booking) =>
        (selectedCar === "All" || booking.carId.toString() === selectedCar) &&
        (selectedStatus === "All" || booking.status === selectedStatus),
    );

    setFilteredBookings(newfilteredBookings);
  }, [bookings, selectedCar, selectedStatus]);


  return (
    <div className="min-h-screen bg-background">
      {/* Add Booking Dialog */}
      {
        <AddBookingDialog
          cars={cars}
          isOpen={isAddBookingOpen}
          setIsOpen={setIsAddBookingOpen}
          setBookings={setBookings}
        />
      }
      

      <main className="container mx-auto px-2 sm:px-4 py-8 pb-16 sm:pb-8">
        <div className="flex justify-between items-center mb-6">
          <h1
            style={{ fontFamily: "var(--font-equinox)" }}
            className="text-3xl max-sm:text-xl font-black"
          >
            MY BOOKINGS
          </h1>
          <div className="flex items-center justify-between max-sm:flex-col gap-1">
            <ExcelUploader />
            <Select value={selectedCar} onValueChange={setSelectedCar}>
              <SelectTrigger className="w-[180px] rounded-sm border-border max-sm:w-[130px] hover:bg-opacity-10">
                <SelectValue placeholder="Select car" />
              </SelectTrigger>
              <SelectContent className="dark:border-border bg-muted">
                <SelectItem
                  value="All"
                  className="hover:bg-opacity-50 hover:text-black cursor-pointer"
                >
                  All Cars
                </SelectItem>
                {cars &&
                  cars.length > 0 &&
                  cars.map((car) => (
                    <SelectItem
                      key={car.id}
                      value={car.id.toString()}
                      className="hover:bg-opacity-50 cursor-pointer hover:text-black"
                    >
                      {car.brand + " " + car.model}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className=" flex justify-between scrollbar-hide">
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
            <Button
              variant={selectedStatus === "All" ? "default" : "outline"}
              className={`rounded-sm ${selectedStatus === "All" ? "bg-blue-400 active:scale-95 hover:bg-blue-500 text-white" : "hover:bg-blue-100 bg-transparent border-border dark:text-white dark:hover:bg-zinc-700 text-black"}`}
              onClick={() => setSelectedStatus("All")}
            >
              All{getBookingLength("All")}
            </Button>
            <Button
              variant={selectedStatus === "Requested" ? "default" : "outline"}
              className={
                selectedStatus === "Requested"
                  ? "bg-blue-400 hover:bg-blue-500 active:scale-95 text-white rounded-sm"
                  : "hover:bg-blue-100 rounded-sm bg-transparent border-border dark:text-white dark:hover:bg-zinc-700 text-black"
              }
              onClick={() => setSelectedStatus("Requested")}
            >Requested{getBookingLength("Requested")}</Button>
            <Button
              variant={selectedStatus === "Upcoming" ? "default" : "outline"}
              className={
                selectedStatus === "Upcoming"
                  ? "bg-blue-400 hover:bg-blue-500 active:scale-95 text-white rounded-sm"
                  : "hover:bg-blue-100 rounded-sm bg-transparent border-border dark:text-white dark:hover:bg-zinc-700 text-black"
              }
              onClick={() => setSelectedStatus("Upcoming")}
            >
              Upcoming{getBookingLength("Upcoming")}
            </Button>
            <Button
              variant={selectedStatus === "Ongoing" ? "default" : "outline"}
              className={
                selectedStatus === "Ongoing"
                  ? "bg-blue-400 hover:bg-blue-500 active:scale-95 text-white rounded-sm"
                  : "hover:bg-blue-100 rounded-sm bg-transparent border-border dark:text-white dark:hover:bg-zinc-700 text-black"
              }
              onClick={() => setSelectedStatus("Ongoing")}
            >
              Ongoing{getBookingLength("Ongoing")}
            </Button>
            <Button
              variant={selectedStatus === "Completed" ? "default" : "outline"}
              className={
                selectedStatus === "Completed"
                  ? "bg-blue-400 hover:bg-blue-500 active:scale-95 text-white rounded-sm"
                  : "hover:bg-blue-100 rounded-sm bg-transparent border-border dark:text-white dark:hover:bg-zinc-700 text-black"
              }
              onClick={() => setSelectedStatus("Completed")}
            >
              Completed{getBookingLength("Completed")}
            </Button>
            <Button
              variant={selectedStatus === "Completed" ? "default" : "outline"}
              className={
                selectedStatus === "Cancelled"
                  ? "bg-blue-400 hover:bg-blue-500 active:scale-95 text-white rounded-sm"
                  : "hover:bg-blue-100 rounded-sm bg-transparent border-border dark:text-white dark:hover:bg-zinc-700 text-black"
              }
              onClick={() => setSelectedStatus("Cancelled")}
            >
              Cancelled{getBookingLength("Cancelled")}
            </Button>
          </div>
          
        </div>
        <div className="border-t overflow-hidden border-border w-full ">
          <div
            style={{
              marginTop: selectedBookings.length === 0 ? "-39px" : "4px",
            }}
            className={`flex items-center justify-between w-full ml-0 transition-all duration-300 gap-3 ${isSelectionMode ? "mt-0" : ""} items-center mt-2`}
          >
            <div className="flex items-center gap-3">
              <Checkbox
                checked={filteredBookings.filter(booking => booking.isAdmin).length === selectedBookings.length}
                onClick={handleSelectAll}
                className={`h-5 w-5 max-sm:w-4 max-sm:h-4 transition-all  duration-300 sm:rounded-md accent-blue-300`}
              />
              <span className={` transition-all duration-300 text-sm`}>
                Select All
              </span>
            </div>
            <Button
              variant="outline"
              onClick={handleDelete}
              className="flex active:scale-95 items-center gap-2"
            >
              {isDeleting ? (
                <>
                  <span>Deleting</span>
                  <div className="flex items-end py-1 h-full">
                    <span className="sr-only">Loading...</span>
                    <div className="h-1 w-1 bg-foreground mx-[2px] border-border rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="h-1 w-1 bg-foreground mx-[2px] border-border rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="h-1 w-1 bg-foreground mx-[2px] border-border rounded-full animate-bounce"></div>
                  </div>
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" />
                  <span>Delete</span>
                </>
              )}
            </Button>
          </div>
        </div>
        {bookings.length > 0 ? (
          <div ref={containerRef} className="space-y-4 mt-2">
            {filteredBookings.map((booking, index) => (
              <BookingCard
                key={index}
                booking={booking}
                selectedBookings={selectedBookings}
                setSelectedBookings={setSelectedBookings}
                setBookings={setBookings}
              />
            ))}
            {filteredBookings.length === 0 && (
              <div className="w-full h-full py-28 gap-2 flex flex-col justify-center items-center">
                <Booking
                  className={`sm:h-16 h-12 sm:w-16 w-12 stroke-[5px] fill-gray-400 `}
                />
                <p className="text-center text-lg sm:text-2xl text-gray-400 font-bold">
                  No Bookings in this category
                </p>
              </div>
            )}
          </div>
        ) : (
          <div key={2}>
            {!isLoading ? (
              <div className="w-full h-full py-28 gap-2 flex flex-col justify-center items-center">
                <Booking
                  className={`sm:h-16 h-12 sm:w-16 w-12 stroke-[5px] fill-gray-400 `}
                />
                <p className="text-center text-lg sm:text-2xl text-gray-400 font-bold">
                  Click below to create your first booking
                </p>
                
                <div
                  onClick={() => setIsAddBookingOpen(true)}
                  className={cn(
                    "bg-primary px-[15px]  overflow-hidden text-white dark:text-black shadow-lg  rounded-md w-12 h-12 flex items-center",
                    cars && cars.length > 0 ? "cursor-pointer" : "cursor-not-allowed",
                  )}
                >
                  <Plus className="w-8 h-8 stroke-10" />
                </div>
              </div>
            ) : (
              <div className="w-full h-full py-28 gap-2 flex justify-center items-center">
                <Loader/>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

const BookingCard = ({
  booking,
  selectedBookings,
  setSelectedBookings,
  setBookings
}: {
  selectedBookings: string[];
  setSelectedBookings: React.Dispatch<React.SetStateAction<string[]>>;
  booking: Booking;
  setBookings: React.Dispatch<React.SetStateAction<Booking[]>>;
}) => {
  const [isDropDownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [action, setAction] = useState<"confirm" | "reject">("confirm");
  const [isPageLoading,setIsPageLoading] = useState(false);

  const handleCheckboxChange = (id: string) => {
    setSelectedBookings((prev) =>
      prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id],
    );
  };

  function getHeader(
    status: string,
    startDate: string,
    startTime: string,
    endDate: string,
    endTime: string,
  ) {
    let headerText = "";
    const startDateTime = new Date(startDate);
    const endDateTime = new Date(endDate);

    const [startHour, startMinute] = startTime.split(":").map(Number);
    const [endHour, endMinute] = endTime.split(":").map(Number);
    startDateTime.setHours(startHour, startMinute, 0, 0);
    endDateTime.setHours(endHour, endMinute, 0, 0);
    const currDate = new Date();
    if (status === "Upcoming") {
      if (startDateTime >= currDate) {
        headerText = "Pickup scheduled on";
      } else {
        headerText = "Pickup was scheduled on";
      }
    } else if (status === "Ongoing") {
      if (endDateTime < currDate) {
        headerText = "Return was scheduled on";
      } else {
        headerText = "Return scheduled by";
      }
    } else if (status === "Completed") {
      headerText = "Booking ended at";
    } else if (status === "Cancelled") {
      headerText = "Booking cancelled";
    }
    return headerText;
  }
  const handleConsent = async (e:React.MouseEvent<HTMLDivElement, MouseEvent>,newAction : "confirm" | "reject") => {
    if(e){
      e.preventDefault();
      e.stopPropagation();
    }
    setAction(newAction);
    try {
        setIsLoading(true);
        await axios.put(`${BASE_URL}/api/v1/booking/${booking.id}/consent`, {
            action: newAction,
        },
        {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
        toast({
            description: `Successfully ${newAction}ed`,
            duration: 2000,
        });
        setBookings((prev) => {
          const booking = prev.find(booking => booking.id === booking.id);
          if(!booking) return prev;
          if(newAction === "confirm"){
            booking.status = "Upcoming"
          }
          else if(newAction === "reject"){
            booking.status = "Cancelled"
          }
          return [...prev,booking]
        })
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

  return (
    <div
      style={{ marginTop: 0 }}
      className={cn("flex gap-2 overflow-hidden mt-0 items-center w-full",
        booking.otp && booking.otp !== "" && "pt-5 sm:pt-6"
      )}
    >
      {isPageLoading && <LoaderOverlay />}
     {booking.isAdmin && <Checkbox
        checked={selectedBookings.includes(booking.id)}
        onClick={() => handleCheckboxChange(booking.id)}
        className={`h-5 w-5 max-sm:w-4 max-sm:h-4 ${selectedBookings.length > 0 ? "ml-0" : "-ml-6"} transition-all duration-300 p-0 sm:rounded-md accent-blue-300`}
      />}
      <Card 
      onClick={() => setIsPageLoading(true)}
      className="w-full relative bg-white dark:bg-background hover:shadow-md border-border transition-shadow mb-2">
        {booking.otp && booking.otp !== "" &&
          <div className="flex gap-2 items-start text-gray-600 dark:text-gray-300  absolute -top-[20px] sm:-top-6 left-2 bg-white dark:bg-card rounded-t-sm px-2 py-[2px]">
          <p className="text-xs sm:text-sm">OTP</p>
          <p className="text-xs sm:text-sm">{booking.otp}</p>
        </div>
        }
        <Link href={`/booking/${booking.id}`}>
          <CardContent className="p-0">
            {/* Rest of the card content remains the same */}
            <div className="flex justify-between  pr-2 items-center">
              <div className="pt-1 pl-1 sm:px-4 ">
                <p className="text-sm max-sm:text-xs text-blue-500">
                  {getHeader(
                    booking.status,
                    booking.start,
                    booking.startTime,
                    booking.end,
                    booking.endTime,
                  )}
                </p>
                { booking.status ==="Upcoming" ?
                <p className="font-semibold text-[#5B4B49] max-sm:text-xs dark:text-gray-400">
                  {getReturnTime(booking.start, booking.startTime,booking.status)}{" "}
                </p>
                :
                <p className="font-semibold text-[#5B4B49] max-sm:text-xs dark:text-gray-400">
                  {getReturnTime(booking.end, booking.endTime,booking.status)}{" "}
                </p>}
              </div>
              <div className="flex items-center justify-between w-fit ">
                
                <div className="">
                  {booking.isAdmin &&
                  <DropdownMenu
                    modal={false}
                    open={isDropDownOpen}
                    onOpenChange={setIsDropdownOpen}
                  >
                    <DropdownMenuTrigger
                      asChild
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
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setIsDropdownOpen(false);
                          setSelectedBookings((prev) =>
                            prev.includes(booking.id)
                              ? prev
                              : [...prev, booking.id],
                          );
                        }}
                      >
                        <span>Select</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  }
                </div>
              </div>
            </div>
            <hr className="border-t border-border" />
            <div className=" dark:bg-background border-b border-border flex flex-row-reverse items-start justify-between">
              <div className="relative flex-1 sm:p-4 py-2 px-2">
                  <div className="absolute top-[10%] text-sm right-0 rounded-s-lg bg-blue-400 border-border p-1 px-2">
                    {booking.type}
                  </div>
                <div className="flex items-center sm:pr-10 gap-2">
                    <p className="text-sm max-sm:text-xs whitespace-nowrap text-blue-500">
                      BOOKING ID:
                    </p>
                    <p className=" text-[#5B4B49] max-sm:text-xs text-sm dark:text-gray-400">
                      {booking.id}{" "}
                    </p>
                </div>
                <div className="flex items-center sm:gap-12 gap-2">
                  <div>
                    <p className="text-xs sm:text-sm text-blue-500">FROM</p>
                    <p className="font-semibold text-[#5B4B49] text-center text-xs sm:text-sm dark:text-gray-400">
                      {formatDateTime(booking.start)} {booking.startTime}
                    </p>
                  </div>
                  <ArrowRight className="mt-4 stroke-0 sm:w-12 w-8 filter drop-shadow-[2px_2px_rgba(0,0,0,0.1)] fill-blue-400 flex-shrink-0" />
                  <div>
                    <p className="sm:text-sm text-xs text-blue-500">TO</p>
                    <p className="font-semibold text-[#5B4B49] text-center text-xs sm:text-sm dark:text-gray-400">
                      {formatDateTime(booking.end)} {booking.endTime}
                    </p>
                  </div>
                </div>
                <div className="flex items-center w-full sm:w-4/5 justify-between mt-2 sm:mt-8 sm:gap-8 gap-2">
                  <div>
                    <p className="text-xs sm:text-sm text-blue-500">
                      BOOKED BY
                    </p>
                    <p className="font-semibold text-[#5B4B49] text-xs sm:text-sm dark:text-gray-400">
                      {booking.customerName}
                    </p>
                  </div>
                  <div>
                    <p className="sm:text-sm text-xs text-blue-500">CONTACT</p>
                    <p className="font-semibold text-[#5B4B49] text-xs sm:text-sm dark:text-gray-400">
                      {booking.customerContact}
                    </p>
                  </div>
                </div>
              </div>
              <div className="text-center flex flex-col items-center p-4 max-sm:p-2  border-r border-border">
                <div className="relative sm:w-24 flex items-center sm:h-20 rounded-md border border-border w-16 h-12 mb-2">
                  {booking.carImageUrl ? (
                    <Image
                      src={booking.carImageUrl}
                      alt={booking.carName}
                      fill
                      priority={true}
                      sizes={"6"}
                      className="object-cover rounded w-full"
                    />
                  ) : (
                    <CarIcon className="w-full dark:stroke-blue-200  dark:fill-blue-200 p-1 stroke-black fill-black" />
                  )}
                </div>
                <p className="text-sm max-sm:text-xs max-sm:max-w-[80px] overflow-hidden font-semibold">
                  {booking.carName}
                </p>
                <p className="text-xs text-blue-400 max-sm:text-[10px]">
                  {booking.carPlateNumber}
                </p>
              </div>
            </div>
            <div className="p-3 max-sm:p-2 flex bg-gray-200 rounded-b-xl dark:bg-muted items-center justify-between text-green-600 dark:text-green-400 gap-2">
              <div className="flex items-center gap-2">
                <CarIcon className="w-8 h-3 stroke-green-600 dark:stroke-green-400 fill-green-600 dark:fill-green-400 stroke-[4px]" />
                <p className="text-sm max-sm:text-xs ">
                  {getTimeUntilBooking(booking.start, booking.status)}
                </p>
              </div>
              {booking.status === "Requested" && (
                <>
                {!isLoading ?
                <div className="flex items-center gap-1 sm:gap-2">
                  <div 
                  onClick={(e) => handleConsent(e,"confirm")}
                  className="active:scale-95 cursor-pointer flex gap-1 sm:gap-2 items-center rounded-sm bg-blue-500 hover:bg-blue-400 py-2 text-xs text-white px-2">
                    <Check className="w-4 h-4" />
                    <span >Accept</span>
                  </div>
                  <div
                  onClick={(e) => handleConsent(e,"reject")}
                  className="active:scale-95 cursor-pointer flex gap-1 sm:gap-2 items-center rounded-sm bg-red-500 hover:bg-red-400 text-xs py-2 text-white px-2">
                    <X className="w-4 h-4" />
                    <span>Reject</span>
                  </div>
                </div>
                :
                  <div className={cn("active:scale-95 cursor-pointer flex gap-1 sm:gap-2 items-center rounded-sm bg-red-500 hover:bg-red-400 text-xs py-2 text-white px-2",
                    action === "confirm" && "bg-blue-500"
                  )}>
                     <Loader2/>
                  </div>
                }
                </>
              )}
            </div>
          </CardContent>
        </Link>
      </Card>
    </div>
  );
};
