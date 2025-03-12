'use client'
import { Booking } from "@/app/booking/[id]/page";
import Image from "next/image";
import React from "react"
import CarIcon from "@/public/car-icon.svg";
import ArrowRight from "@/public/right_arrow.svg";
import { BsFilePdfFill } from "react-icons/bs";
import { ImageIcon } from "lucide-react";

const TestPdfDoc = ({booking}:{booking:Booking}) => {
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
        }
    
        return headerText;
      }

    function formatDateTime(date: string) {
    return new Date(date).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
    }

     const getFileIcon = (type: string) => {
        if (!type.startsWith("image/")) {
          return <BsFilePdfFill className="w-4 h-4" />;
        }
        return <ImageIcon className="w-4 h-4" />;
      };

    function renderList(url: string, name: string, type: string,index:number) {
        return (
            <a
                href={url}
                key={index}
                target="_blank"
                className="flex w-fit max-w-[130px] max-h-[30px] sm:max-w-[200px] sm:max-h-[40px] my-1 items-center gap-2 bg-gray-200 dark:bg-muted p-2 rounded-md"
                >
                <span className="min-w-4">{getFileIcon(type)}</span>
                <span className="whitespace-nowrap overflow-hidden text-ellipsis text-xs sm:text-sm">
                    {name}
                </span>
            </a>
        )
    }
      
  return (
    <div className="flex flex-col z-0 bg-background items-center justify-center w-screen h-screen">
            <div className="flex items-center justify-center px-2 pb-2 border-b border-gray-300 dark:border-muted dark:text-white">
              <div className="text-center">
                <h2 className="text-xl font-bold">Booking {booking.status}</h2>
                <p className="text-sm text-blue-500">Booking ID: {booking.id}</p>
              </div>
            </div>
      
            <div className="px-1 sm:px-4 py-4 border-b-4 border-gray-200 dark:border-muted">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-blue-500">
                    {getHeader(
                      booking.status,
                      booking.start,
                      booking.startTime,
                      booking.end,
                      booking.endTime,
                    )}
                  </p>
                  <p className="font-semibold max-sm:text-sm">
                    {formatDateTime(
                      booking.status === "Upcoming" ? booking.start : booking.end,
                    )}
                  </p>
                </div>
                <div className="text-right flex flex-col items-end w-fit">
                  <div className="relative flex items-center sm:h-24 sm:w-36 rounded-md border border-border h-20 w-32 mb-2">
                    {booking.carImageUrl !== "" ? (
                      <Image 
                        src={booking.carImageUrl}
                        alt={booking.carName}
                        fill
                        sizes="6"
                        priority={true}
                        className="object-cover rounded w-full"
                      />
                    ) : (
                      <CarIcon className="w-full dark:stroke-blue-200 p-1  dark:fill-blue-200 stroke-black fill-black" />
                    )}
                  </div>
                  <p className="text-sm font-semibold text-[#4B4237] max-sm:max-w-[180px] dark:text-gray-400">
                    {booking.carName}
                  </p>
                  <p className="text-xs text-blue-500">{booking.carPlateNumber}</p>
                </div>
              </div>
            </div>
      
            <div className="px-1 sm:px-4 py-4 border-b-4 border-gray-200 dark:border-muted">
              <h3 className="text-lg font-semibold mb-4 ">Booking Details</h3>
              <div className="flex items-center justify-center gap-8 max-sm:gap-2 mb-4">
                <div>
                  <p className="text-sm text-blue-500">From</p>
                    <p className="font-semibold max-sm:text-sm">
                      {formatDateTime(booking.start)} {booking.startTime}
                    </p>
                </div>
                <ArrowRight className="mt-4 w-12 stroke-0 fill-blue-400 flex-shrink-0" />
                <div>
                  <p className="text-sm text-blue-500">To</p>
                    <p className="font-semibold max-sm:text-sm">
                      {formatDateTime(booking.end)} {booking.endTime}
                    </p>
                </div>
              </div>
              <hr className="my-4 border-gray-200 dark:border-muted" />
              <div className="grid grid-cols-2 items-center sm:gap-6">
                <div>
                  <p className="text-sm text-blue-500 mb-1">Booked by</p>
                      <p className="font-semibold">{booking.customerName}</p>
                      <p className="text-sm">{booking.customerContact}</p>
                </div>
                <div>
                  {booking.customerAddress && (
                    <div>
                      <p className="text-sm text-blue-500">Address</p>
                        <span className="text-sm whitespace-wrap max-w-[120px]">
                          {booking.customerAddress}
                        </span>
                    </div>
                  )}
                </div>
              </div>
              <hr className="my-4 border-gray-200 dark:border-muted" />
              <div>
                <p className="text-sm text-blue-500 mb-1">Booking Status</p>
                <p className={` `}>{booking.status}</p>
              </div>
            </div>
            <div className="px-1 sm:px-4 py-4 border-b-4 border-gray-200 dark:border-muted">
              <h3 className="text-lg font-semibold mb-4 ">
                Price and Payment Details
              </h3>
              <div className="grid grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <p className="text-sm text-blue-500 mb-1">24 Hr Price</p>
                    <p className="text-sm">{booking.dailyRentalPrice}</p>
                </div>
                {booking.securityDeposit && (
                  <div>
                    <p className="text-sm text-blue-500">Security Deposit</p>
                      <span className="text-sm">{booking.securityDeposit}</span>
                   
                  </div>
                )}
              </div>
              <hr className="my-4 border-gray-200 dark:border-muted" />
              <div className="grid grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-blue-500">Payment Amount</p>
                    <span className="text-sm">{booking.totalPrice}</span>
                  </div>
                  {booking.paymentMethod && (
                    <div>
                      <p className="text-sm text-blue-500">Payment Method</p>
                        <>
                          <span className="text-sm">{booking.paymentMethod}</span>
                        </>
                      
                    </div>
                  )}
                </div>
                <div className="space-y-3">
                  <p className="text-sm text-blue-500">Payment Remaining</p>
                  <span className="text-sm">
                    {(booking.totalPrice ? booking.totalPrice : 0) -
                      (booking.advancePayment ? booking.advancePayment : 0)}
                  </span>
                  {booking.advancePayment && (
                    <div>
                      <p className="text-sm text-blue-500">Payment Done</p>
                          <span className="text-sm">{booking.advancePayment}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="px-1 sm:px-4 py-4 border-b-4 border-gray-200 dark:border-muted">
              <h3 className="text-lg font-semibold mb-4 ">Some more details</h3>
              <div className="grid grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-4">
                  {booking.odometerReading && (
                    <div>
                      <p className="text-sm text-blue-500">Odometer Reading</p>
                        <span className="text-sm">{booking.odometerReading}</span>
                    </div>
                  )}
                  {booking.status !== "Upcoming" && booking.selfieUrl && (
                    <div>
                      <p className="text-xs sm:text-sm text-blue-500">
                        Selfie with car
                      </p>
                      <div>{renderList(booking.selfieUrl,"Selfie","image/jpeg",0)}</div>
                    </div>
                  )}
      
                  <div>
                    <div className="flex sm:gap-1 items-center">
                      <p className="text-xs sm:text-sm text-blue-500">
                        Aadhar Card and Driving License
                      </p>
                    </div>
                    {booking.documents && (
                      <div>
                        <div className="mt-2 text-sm">
                          {booking.documents.map((document, index) => {
                            return renderList(document.url, document.name, document.type,index);
                          })}
                        </div>
                      </div>
                    )}
                    
                  </div>
                </div>
                <div className="space-y-4">
                  {booking.endodometerReading && (
                    <div>
                      <p className="text-sm text-blue-500">End Odometer Reading</p>
                        <span className="text-sm">{booking.endodometerReading}</span>
                    </div>
                  )}
                  {booking.odometerReading &&
                    Number(booking.endodometerReading) > Number(booking.odometerReading) && (
                      <div>
                        <p className="text-sm text-blue-500">Kilometer travelled</p>
                        <span className="text-sm">
                          {Number(booking.endodometerReading) - Number(booking.odometerReading)}
                        </span>
                      </div>
                    )}
                  {booking.notes && (
                    <div>
                      <p className="text-sm text-blue-500">Notes if any</p>
                        <span className="text-sm">{booking.notes}</span>
                    </div>
                  )}
                  {booking.status !== "Upcoming" && (
                    <div>
                      <div className="flex sm:gap-1 items-center">
                        <p className="text-xs sm:text-sm text-blue-500">
                          Photos Before pick-up
                        </p>
                      </div>
                      {booking.carImages && booking.carImages.length > 0 && (
                        <div>
                          <div className="mt-2 text-sm">
                            {booking.carImages.map((image, index) => {
                              return renderList(image.url, image.name, "image/jpeg",index);
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
        </div>
    </div>
  )
};

export default TestPdfDoc;
