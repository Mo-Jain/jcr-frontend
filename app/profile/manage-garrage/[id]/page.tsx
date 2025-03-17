"use client";
import { Suspense } from "react";
import { CarDetailsClient } from "@/components/car-details-client";
import LoadingScreen from "@/components/loading-screen";
import { useParams, useRouter } from "next/navigation";

export default function Page() {
  const Car = useParams();
  const router = useRouter();

  if (!Car) {
    router.push("/car-not-found");
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
