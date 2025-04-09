import Link from "next/link";
import React from "react";
import { PausedCar } from "./car-section";
import Image from "next/image";
import { Badge } from "./ui/badge";
import axios from "axios";
import { BASE_URL } from "@/lib/config";
import { toast } from "@/hooks/use-toast";

const PausedCars = ({cars,setCars}:{cars:PausedCar[],setCars:React.Dispatch<React.SetStateAction<PausedCar[]>>}) => {
    const handleBookingAction = async (e:React.MouseEvent<HTMLDivElement, MouseEvent>,id:number) => {
        e.preventDefault();
        try{
            await axios.put(`${BASE_URL}/api/v1/car/${id}/action`, {
              action: "active"
            },{
              headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            });
            setCars(cars.filter(car => car.id !== id));
         
        } catch (error) {
          console.log(error);
          toast({
            description: `Booking failed to update`,
            className:
              "text-black bg-white border-0 rounded-md shadow-mg shadow-black/5 font-normal",
            variant: "destructive",
            duration: 2000,
          }); 
        }
      }
  return (
    <div>
      <section className="py-6 bg-white bg-opacity-30 dark:bg-opacity-10 rounded-t-md backdrop-blur-lg sm:px-4 px-2">
        <div className="flex justify-between items-center sm:px-4 px-2">
            <h1
            style={{ fontFamily: "var(--font-equinox), sans-serif" }}
            className="sm:text-3xl text-xl font-bold"
            >
            Paused Cars
            </h1>
        </div>
        <div
            key={cars.length}
            className="grid z-0 grid-cols-2 mt-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3"
        >
            {cars.map((car) => (
            <Link
                href={`/car/${car.id}`}
                key={car.id}
                className="transform transition-all z-0 duration-300 hover:scale-105"
            >
                
                <div className="p-2 z-0 border border-border shadow-sm  bg-white dark:bg-muted rounded-md cursor-pointer space-y-2 flex-shrink-0">
                    <div className="relative border border-black/10 dark:border-white/15 bg-black/5 dark:bg-white/10 h-40 w-full overflow-hidden rounded-lg">
                        <Image
                            src={car.photos[0] || "/placeholder.svg"}
                            alt={car.brand}
                            fill
                            style={{ objectFit: "cover" }}
                            className="rounded-lg h-fit max-w-full max-h-full object-cover"
                        />
                        <Badge className="absolute right-1 top-1">{car.plateNumber}</Badge>
                        <div 
                        onClick={(e) => handleBookingAction(e,car.id)}
                        className="p-1 px-2 text-xs sm:text-sm absolute bottom-1 right-1 sm:bottom-1 sm:right-1 bg-blue-400 text-white rounded-full">
                            <span>Resume</span>
                        </div>
                    </div>
                    <div className="flex justify-center items-center gap-2 min-h-[48px] sm:min-h-[56px]">
                        <h3 className="md:text-md  lg:text-lg flex items-center justify-center max-sm:text-xs px-1  w-full overflow-hidden text-center font-semibold whitespace-wrap">
                            <span 
                            style={{ fontFamily: "var(--font-bigjohnbold), sans-serif" }}
                            className="max-w-full whitespace-wrap">{(car.brand + " " + car.model).toLocaleUpperCase()}</span>
                        </h3>
                    </div>
                </div>
            </Link>
            ))}
        </div>
      </section>
    </div>
  );
};

export default PausedCars;
