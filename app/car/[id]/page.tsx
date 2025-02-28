"use client";
import { Suspense } from "react";
import { CarDetailsClient } from "@/components/car-details-client";
import LoadingScreen from "@/components/loading-screen";
import { useParams } from "next/navigation";

export default function CarDetails() {
  const Car = useParams();

  if (!Car) {
    return (
      <div>
        <LoadingScreen />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto w-full px-0 py-2 pb-16 sm:pb-8">
        <Suspense
          fallback={
            <div>
              <LoadingScreen />
            </div>
          }
        >
          <CarDetailsClient carId={Number(Car.id)} />
        </Suspense>
      </main>
    </div>
  );
}
