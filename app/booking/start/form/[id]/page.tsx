"use client"
import { Suspense,  useEffect, useState } from "react"
import LoadingScreen from "@/components/loading-screen"
import { useParams, useRouter } from "next/navigation"
import axios from "axios"
import { BASE_URL } from "@/lib/config"
import BookingStartClient from "./booking-start-client"

export interface Document{
  id: number;
  customerId: number;
  name: string;
  url: string;
  type: string;
}

export interface CarImage{
  id: number;
  name: string;
  url: string;
  bookingId: string;
}

export interface Booking {
  id: string;
  start: string;
  end: string;
  startTime: string;
  endTime: string;
  status: string;
  customerName: string;
  customerContact: string;
  carId:number;
  carName: string;
  carPlateNumber: string;
  carImageUrl: string;
  dailyRentalPrice: number;
  securityDeposit?: string;
  totalPrice?: number;
  advancePayment?: number;
  customerAddress?: string;
  paymentMethod?: string;
  drivingLicence?: string;
  aadharCard?: string;
  odometerReading?: string;
  notes?: string;
  selfieUrl?:string,
  documents:Document[],
  carImages:CarImage[],
  folderId:string,
  bookingFolderId: string,
  currOdometerReading: string
}


export default function BookingDetails() {
  // const bookingId = await Number(params.id); // Resolve params.id synchronously after awaiting params
  const Booking =  useParams(); 
  const [booking,setBooking] = useState<Booking>(); 
  const router = useRouter();
  useEffect(() => {
    if (!Booking) return;
    const fetchData = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/v1/booking/${Booking.id}`, {
          headers: {
            authorization: `Bearer ` + localStorage.getItem('token')
            }
          })
          setBooking(res.data.booking);
      }
      catch (error) {
        console.log(error);
        router.push('/booking-not-found');
      }
    };
    fetchData();
  }, [Booking,router]);

  if(!Booking) return null

  if (!booking) {
  return <div><LoadingScreen/></div>
  }

  return (
    <div className="min-h-screen bg-background">
      
      <main className="container mx-auto px-0 py-2 pb-16 sm:pb-8">
        <Suspense fallback={<div><LoadingScreen/></div>}>
          <BookingStartClient booking={booking} bookingId={Booking?.id || ""}  />
        </Suspense>
      </main>
    </div>
  )
}
