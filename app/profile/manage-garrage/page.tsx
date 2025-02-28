"use client";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Edit } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import BackArrow from "@/public/back-arrow.svg";
import LoadingScreen from "@/components/loading-screen";
import { useCarStore } from "@/lib/store";
import CarIcon from "@/public/car-icon.svg";

const Page = () => {
  const { cars } = useCarStore();
  const router = useRouter();

  if (!cars) {
    return <LoadingScreen />;
  }

  return (
    <div className="py-6 px-2 sm:px-4 h-screen bg-background ">
      <div className="w-full flex gap-6 h-fit items-start">
        <Button
          onClick={() => router.push("/profile")}
          className=" sm:mt-2 flex bg-transparent shadow-none justify-start text-black border dark:border-card border-gray-200 hover:bg-gray-200 dark:hover:bg-card "
        >
          <BackArrow className="h-7 w-7 stroke-0 fill-gray-800 dark:fill-blue-300" />
        </Button>
        <div className="flex justify-start sm:mt-2 mt-[4px] items-center h-full mb-8 ">
          <h1
            style={{ fontFamily: "var(--font-equinox), sans-serif" }}
            className="text-3xl max-sm:text-xl font-black text-black dark:text-white font-myfont"
          >
            MANAGE YOUR GARRAGE
          </h1>
        </div>
      </div>
      {cars.length > 0 ? (
        <div
          key={cars.length}
          className="grid grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-6"
        >
          {cars.map((car) => (
            <Link
              href={`/car/${car.id}`}
              key={car.id}
              className="transform transition-all duration-300 hover:scale-105"
            >
              <Card className="w-full border-0">
                <CardContent className="p-2 border-0 bg-muted  rounded-md cursor-pointer">
                  <div className="flex flex-col justify-between gap-1 sm:px-1">
                    <div className="relative flex-shrink-0 w-full h-24 sm:h-48">
                      <Image
                        src={car.imageUrl || "/placeholder.svg"}
                        alt={car.brand + " " + car.model}
                        fill
                        style={{ objectFit: "cover" }}
                        className="rounded-lg w-full "
                      />
                    </div>
                    <div
                      className="p-1 sm:p-4 w-full flex justify-center items-center"
                      onClick={() => router.push(`/magane-garrage/${car.id}`)}
                    >
                      <Edit className="w-4 h-4 text-black dark:text-white mx-2" />
                      <h3 className="text-lg max-sm:text-sm font-semibold text-black dark:text-white">
                        {car.brand + " " + car.model}
                      </h3>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex flex-col pt-20 items-center justify-center">
          <CarIcon className="w-48 h-20 stroke-gray-400 fill-gray-400 mb-4 mb-4 stroke-[1px]" />
          <h1 className="text-center text-3xl mb-3 text-gray-400 font-bold">
            No Cars in garrage yet
          </h1>
        </div>
      )}
    </div>
  );
};

export default Page;
