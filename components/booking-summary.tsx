"use client"
import Image from "next/image"
import { Check, X } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
  } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { useCarStore } from "@/lib/store"
import { Booking } from "./requested-bookings"
import { cn } from "@/lib/utils"


interface BookingSummaryProps {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onAccept?: () => void
  onReject?: () => void
  booking: Booking
  action: "confirm" | "reject"
  isLoading: boolean
}

export function BookingSummaryDialog({ open, setOpen,onAccept, onReject, booking,action,isLoading }: BookingSummaryProps) {
    
    const {cars} = useCarStore();
    const car = cars.find((car) => car.id === booking.carId);

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
        })
    }


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className=" md:max-w-[700px]">
        <DialogHeader>
          <DialogTitle className="text-xl">Requested Booking</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>

        <div className="flex justify-between items-center gap-4 ">
          {/* Car Details */}
          <div className="space-y-4 flex-shrink-0">
            <div className="relative h-40 sm:w-40 md:w-52 w-full overflow-hidden rounded-lg">
              <Image
                src={car?.photos[0] || "/placeholder.svg?height=200&width=400"}
                alt={car?.brand || ""}
                fill
                className="object-cover"
              />
              <Badge className="absolute right-1 top-1">{car?.plateNumber}</Badge>
            </div>
            <h3 className="text-lg font-semibold">{car?.brand+" "+car?.model}</h3>
          </div>

            <div className="space-y-2 py-4 w-full">
            {/* Booking Details */}
            <div className="space-y-2 w-fit max-sm:text-xs">
                <h4 className="font-medium text-muted-foreground">Booking Details</h4>
                <div className="grid grid-cols-2 gap-1 sm:gap-2 text-xs sm:text-sm">
                    <div className="font-medium">Booking ID:</div>
                    <div>{booking.id}</div>
                    <div className="font-medium">From:</div>
                    <div className="flex items-center gap-1 sm:gap-2">
                        <div>{formatDate(booking.start)}</div>
                        <div>{booking.startTime}</div>
                    </div>
                    <div className="font-medium">To:</div>
                    <div className="flex items-center gap-1 sm:gap-2">
                        <div>{formatDate(booking.end)}</div>
                        <div>{booking.endTime}</div>
                    </div>
                </div>
            </div>

            <Separator />

            {/* Customer Details */}
            <div className="space-y-2 w-fit max-sm:text-xs">
                <h4 className="font-medium text-muted-foreground">Customer Details</h4>
                <div className="grid grid-cols-2 gap-1 sm:gap-2 text-xs sm:text-sm">
                    <div className="font-medium">Name:</div>
                    <div>{booking.customerName}</div>
                    <div className="font-medium">Contact:</div>
                    <div>{booking.customerContact}</div>
                </div>
            </div>
            </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2">
        {!isLoading ?
        <>
          <Button variant="destructive" onClick={onReject} className="gap-1 text-white">
            <X className="h-4 w-4" />
            Reject
          </Button>
          <Button onClick={onAccept} className="gap-1 tex-white">
            <Check className="h-4 w-4" />
            Accept
          </Button>
        </>
        :
        <Button 
            className={cn(" bg-opacity-50 min-w-[100px] cursor-not-allowed bg-primary text-white",
                action === "reject" && "bg-red-500"
            )}>
                <div className="flex items-end py-1 h-full">
                    <span className="sr-only">Loading...</span>
                    <div className="h-[6px] w-[6px] bg-white mx-[2px] border-border rounded-full animate-bounceY [animation-delay:-0.5s]"></div>
                    <div className="h-[6px] w-[6px] bg-white mx-[2px] border-border rounded-full animate-bounceY [animation-delay:-0.3s]"></div>
                    <div className="h-[6px] w-[6px] bg-white mx-[2px] border-border rounded-full animate-bounceY"></div>
                </div>
        </Button>
        }
        </div>
      </DialogContent>
    </Dialog>
  )
}

