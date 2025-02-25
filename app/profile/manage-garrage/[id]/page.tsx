"use client"
import { Suspense } from "react"
import { CarDetailsClient } from "@/components/car-details-client";
import LoadingScreen from "@/components/loading-screen";
import CarNotFound from "@/components/car-not-found";
import { useParams } from "next/navigation";



export default function Page() {
  const Car = useParams();
  
  if (!Car) {
    return <div><CarNotFound /></div>;
  }
  
  return (
    <div className="min-h-screen bg-background">
      
      <main className="container mx-auto w-full px-0 py-2 pb-16 sm:pb-8">
        <Suspense fallback={<div><LoadingScreen/></div>}>
          <CarDetailsClient carId={Number(Car.id)}  />
        </Suspense>
      </main>
    </div>
  )
}
