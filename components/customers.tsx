"use client";
import { BASE_URL } from "@/lib/config";
import axios from "axios";
import { IndianRupee, Users } from "lucide-react";
import React, { useEffect, useState } from "react";
import DoughnutGraph from "./doughnut-graph";
import Image from "next/image";

interface Car {
  id: number;
  brand: string;
  model: string;
  plateNumber: string;
  imageUrl: string;
  totalCustomers: number;
  uniqueCustomers: number;
}

const Customers = () => {
  const [flag, setFlag] = useState(false);
  const [cars, setCars] = useState<Car[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios.get(
          `${BASE_URL}/api/v1/car/customer/all`,
          {
            headers: {
              authorization: `Bearer ` + localStorage.getItem("token"),
            },
          },
        );
        if (res.data.cars) {
          setFlag(true);
          setCars(res.data.cars);
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="w-full  relative p-1 rounded-md shadow-sm bg-white dark:bg-muted z-0 flex flex-col xs:bg-blue-500">
      <div className="px-4 py-1 sm:py-3 flex items-center justify-between border-b border-gray-300 dark:border-border">
        <div className="sm:flex items-center">
            <h3 className="font-semibold text-md">Customers</h3>
            <span className="text-xs ">{"(Last 3 months)"}</span>
        </div>
        <div className="flex flex-col items-start">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-blue-500 rounded-sm"/>
            <span className="text-xs">Repeat</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-500 rounded-sm"/>
            <span className="text-xs">First Timer</span>
          </div>
        </div>
      </div>
      <div className="  py-1 rounded-md h-[300px] scrollbar-hide overflow-y-scroll ">
        {flag ? (
          <div className="flex flex-col gap-1 scrollbar-hide rounded-lg overflow-y-scroll">
            {cars.map((car,index) => {
                if(car.totalCustomers == 0) return;
                return (
                    <div key={index} className="flex items-center px-2 shadow-sm justify-between w-full bg-gray-100 dark:bg-background gap-0 sm:gap-2 h-fit ">
                        <div className="z-0 flex-shrink-0 h-12 w-16 sm:h-20 sm:w-32">
                            <Image
                                src={car.imageUrl || "/placeholder.svg"}
                                alt={car.model}
                                height={100}
                                width={100}
                                className="rounded-lg w-full h-full object-cover"
                            />
                        </div>
                        <div className="flex items-center w-full max-sm:max-w-[120px]">
                            <div className="font-semibold text-[#5B4B49]  text-xs lg:text-md dark:text-gray-400">
                                <p className="whitespace ">
                                    {car.brand} {car.model}
                                </p>
                                <p className="text-xs lg:text-sm whitespace-nowrap w-fit">{car.plateNumber}</p>
                            </div>
                        </div>
                        <div className="p-1">
                            <DoughnutGraph className="m-0 " data={[car.uniqueCustomers,car.totalCustomers-car.uniqueCustomers]}/>
                        </div>
                    </div>
            )})}
          </div>
        ) : (
          <div className="w-full h-full flex flex-col justify-center items-center">
            <Users
              className={`sm:h-16 h-12 sm:w-16 w-12 stroke-[2px] text-gray-400`}
            />
            <p className="text-center text-lg sm:text-2xl text-gray-400 font-bold">
              No Customers yet
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Customers;
