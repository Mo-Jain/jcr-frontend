"use client"

import {  useState } from "react"
import { Button } from "@/components/ui/button"
import {   Plus, PlusSquare } from "lucide-react"
import { CarCard } from "./car-card"
import Link from "next/link";
import LoadingScreen from "./loading-screen"
import { AddCarDialog } from "./add-car"
import {  useCarStore, useUserStore } from "@/lib/store"
import CarIcon from "@/public/car-icon.svg";
import Calendar from "@/public/calendar.svg"
import UserIcon from "@/public/user.svg"
import TakeAction from "./take-action"
import MonthEarnings from "./month-earnings"


export function CarSection() {
  const [isOpen,setIsOpen] = useState(false);
  const {cars} = useCarStore();
  const {name} = useUserStore();

  if(!cars) {
    return <LoadingScreen/>;
  }

  return (
    <>
    <AddCarDialog isOpen={isOpen} setIsOpen={setIsOpen} />
    { name ?
      <div>
        <section className="py-6 bg-muted px-4">
            <div className="flex justify-between items-center border-b border-border pb-5 mb-3 px-4">
                <h1 style={{ fontFamily: "var(--font-equinox), sans-serif",
                 }} className="sm:text-3xl text-xl font-black font-myfont">{name.split(' ')[0]}&apos;s GARRAGE</h1>
                {cars.length > 0 &&
                <Button className="bg-blue-600 text-white dark:text-black hover:bg-opacity-80  shadow-lg"
                  onClick={() => setIsOpen(true)}>
                  <PlusSquare className="text-20 h-12 w-12" />
                  <span className="">Add Car</span> 
                </Button>
                }
            </div>
            {cars.length > 0 ? (
            <div key={cars.length} className="grid z-0 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {cars.map((car) => (
                <Link
                    href={`/car/${car.id}`}
                    key={car.id}
                    className="transform transition-all z-0 duration-300 hover:scale-105"
                >
                    
                    <CarCard name={car.brand + " " + car.model} imageUrl={car.imageUrl} plateNumber={car.plateNumber} color={car.colorOfBooking} />
                </Link>
                ))}
            </div>
            ) : (
            <div className="flex flex-col items-center justify-center">
              <CarIcon className="w-48 h-20 stroke-gray-400 fill-gray-400 mb-4 mb-4 stroke-[1px]" />
              <h1 className="text-center text-3xl mb-3 text-gray-400 font-bold">Click below to add your first car</h1>
              <Button className="bg-blue-600 text-white dark:text-black hover:bg-opacity-80  shadow-lg"
                  onClick={() => setIsOpen(true)}>
                  <Plus className="text-20 h-60 w-60 stroke-[4px]" />
               </Button> 
            </div>
            )}
        </section>
        <section className="py-6 bg-muted px-2 sm:px-4">
        <h1 style={{ fontFamily: "var(--font-equinox), sans-serif",
                 }} className="sm:text-3xl border-b border-border pb-5 mb-3 text-xl font-black font-myfont">CARs INFO</h1>
          <div className="grid z-0 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <MonthEarnings/>
            <TakeAction/>
          </div>
        </section>
        </div>
        :
        <section className="sm:py-12 py-6 bg-muted">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center bg-card p-6 rounded-lg shadow-md">
                <CarIcon className="w-28 h-12 stroke-primary fill-primary mb-4 mb-4 stroke-[6px]" /> 
                <h3 className="text-xl font-semibold mb-2">Easy Booking</h3>
                <p className="text-muted-foreground">Book your desired car with just a few clicks.</p>
              </div>
              <div className="flex flex-col items-center bg-card p-6 rounded-lg shadow-md">
                <Calendar className="w-12 h-12 stroke-primary fill-primary mb-4 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Calendar View</h3>
                <p className="text-muted-foreground">Visualize all bookings in an intuitive calendar interface.</p>
              </div>
              <div className="flex flex-col items-center bg-card p-6 rounded-lg shadow-md">
                <UserIcon className="w-12 h-12 stroke-[20px] stroke-primary fill-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">User Profiles</h3>
                <p className="text-muted-foreground">Manage your account and booking history with ease.</p>
              </div>
            </div>
          </div>
        </section>
      }
    </>
  )
}