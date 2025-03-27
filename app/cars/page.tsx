'use client'

import Loader from "@/components/loader";
import Link from "next/link";
import ArrowRight from "@/public/right_arrow.svg";
import { CarCard } from "@/components/car-card";
import { CarSearch } from "@/components/car-search";    
import { Plus, PlusSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AddBookingDialog } from "./add-booking";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { Car, useCarStore, useSearchStore } from "@/lib/store";
import { useState,useEffect } from "react";

const Page = () => {
    const {cars} = useCarStore();
    const [filteredCars, setFilteredCars] = useState<Car[]>(cars);
    const [isLoading, setIsLoading] = useState(false);
    const {startDate,endDate,startTime,endTime,isSearching} = useSearchStore();
    const [isAddBookingOpen, setIsAddBookingOpen] = useState(false);

    function formatDateTime(dateString: Date | null) {
        if(!dateString) return "";
        return dateString.toLocaleString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });
      }
    
    useEffect(() => {
        setFilteredCars(cars);
    },[cars])

    const handleAddBooking = () => {
        if (cars.length === 0) {
          toast({
            description: `Please add cars`,
            className:
              "text-black bg-white border-0 rounded-md shadow-mg shadow-black/5 font-normal",
            variant: "destructive",
            duration: 2000,
          });
          return;
        }
        setIsAddBookingOpen(true);
      };
    
    
  return (
    <div className="">
        {/* Add Booking button */}
        <div
        className="fixed z-[50] sm:hidden bottom-[70px] right-5 flex items-center justify-start whitespace-nowrap"
        onClick={handleAddBooking}
        >
            <div
                className={cn(
                "bg-primary px-[15px] active:scale-95 overflow-hidden text-white dark:text-black shadow-lg  rounded-md w-12 h-12 flex items-center",
                cars && cars.length > 0 ? "cursor-pointer" : "cursor-not-allowed",
                )}
            >
                <Plus className="w-8 h-8 stroke-10" />
            </div>
        </div>
        <AddBookingDialog isOpen={isAddBookingOpen} setIsOpen={setIsAddBookingOpen} cars={filteredCars}/>
        <div className="relative z-10">
            <CarSearch setFilteredCars={setFilteredCars} setIsLoading={setIsLoading}/>
        </div>
        <section className="py-6 relative z-0 mb-1 bg-white bg-opacity-30 dark:bg-opacity-10 rounded-t-md backdrop-blur-lg sm:px-4 px-2">
        <div className="flex justify-between w-full pb-3 border-b border-border">
            <div className="flex flex-col sm:gap-4">
                <h1
                style={{ fontFamily: "var(--font-equinox), sans-serif" }}
                className="sm:text-3xl text-xl font-black font-myfont w-fit whitespace-nowrap "
                >
                Avaliable Cars
                </h1>
                {isSearching &&
                <div className="flex items-center gap-2 ">
                    <div className="">
                        <p className="font-semibold sm:whitespace-nowrap text-center text-xs sm:text-sm">
                        {formatDateTime(startDate)} {startTime}
                        </p>
                    </div>
                    <ArrowRight className="stroke-0 sm:w-12 w-8 filter drop-shadow-[2px_2px_rgba(0,0,0,0.1)] fill-blue-400 flex-shrink-0" />
                    <div className="">
                        <p className="font-semibold sm:whitespace-nowrap text-center text-xs sm:text-sm">
                        {formatDateTime(endDate)} {endTime}
                        </p>
                    </div>
                </div>}
            </div>
            <Button
                style={{ fontFamily: "var(--font-pier), sans-serif" }}
                    className="max-sm:hidden bg-primary active:scale-95 text-white hover:bg-opacity-10 shadow-lg"
                    onClick={handleAddBooking}
                >
                    <PlusSquare className="h-12 w-12" />
                    <span className="">Add Booking</span>
                </Button>
        </div>
        {!isLoading ?
        <div
            key={filteredCars.length}
            className="grid grid-cols-2 mt-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3"
        >
            {filteredCars.map((car,index) => (
            <Link
                href={`/car/${car.id}`}
                key={index}
                className="transform transition-all duration-300 hover:scale-105"
            >
                <CarCard
                name={car.brand + " " + car.model}
                photos={car.photos}
                plateNumber={car.plateNumber}
                />
            </Link>
            ))}
        </div>
        :
        <div className="flex justify-center items-center w-full min-h-[185px] sm:min-h-[300px]">
            <Loader/>
        </div>
        }
        </section>
    </div>
  )
};

export default Page;
