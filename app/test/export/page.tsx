import ExportButton from "@/components/export-button";
import React from "react"

interface Document {
    id: number;
    customerId: number;
    name: string;
    url: string;
    type: string;
  }
  
  interface CarImage {
    id: number;
    name: string;
    url: string;
    bookingId: string;
  }
  
  interface Booking {
    id: string;
    start: string;
    end: string;
    startTime: string;
    endTime: string;
    status: string;
    customerName: string;
    customerContact: string;
    carId: number;
    carName: string;
    carPlateNumber: string;
    carImageUrl: string;
    dailyRentalPrice: number;
    securityDeposit?: string;
    totalPrice?: number;
    advancePayment?: number;
    customerAddress?: string;
    paymentMethod?: string;
    odometerReading?: string;
    endodometerReading?: string;
    notes?: string;
    selfieUrl?: string;
    documents?: Document[];
    carImages?: CarImage[];
    customerId: number;
    folderId: string;
    bookingFolderId: string;
  }
  const dummyDocuments: Document[] = [
      {
        id: 1,
        customerId: 1001,
        name: "Driving License",
        url: "https://example.com/documents/driving-license.pdf",
        type: "ID"
      },
      {
        id: 2,
        customerId: 1001,
        name: "Insurance Document",
        url: "https://example.com/documents/insurance.pdf",
        type: "Insurance"
      }
    ];
    
    const dummyCarImages: CarImage[] = [
      {
        id: 1,
        name: "Front View",
        url: "https://example.com/images/car-front.jpg",
        bookingId: "B12345"
      },
      {
        id: 2,
        name: "Back View",
        url: "https://example.com/images/car-back.jpg",
        bookingId: "B12345"
      }
    ];
    
    const dummyBooking: Booking = {
      id: "B12345",
      start: "2025-03-01",
      end: "2025-03-05",
      startTime: "10:00 AM",
      endTime: "6:00 PM",
      status: "Confirmed",
      customerName: "John Doe",
      customerContact: "+91 9876543210",
      carId: 101,
      carName: "Toyota Corolla",
      carPlateNumber: "GJ05AB1234",
      carImageUrl: "https://example.com/images/car.jpg",
      dailyRentalPrice: 2000,
      securityDeposit: "5000",
      totalPrice: 10000,
      advancePayment: 2000,
      customerAddress: "123, Main Street, Mundra, Gujarat",
      paymentMethod: "Credit Card",
      odometerReading: "15000 km",
      endodometerReading: "15500 km",
      notes: "Customer requested child seat",
      selfieUrl: "https://example.com/selfies/customer.jpg",
      documents: dummyDocuments,
      carImages: dummyCarImages,
      customerId: 1001,
      folderId: "F001",
      bookingFolderId: "BF001"
    };
    
const Page = () => {
  return (
    <div className="flex flex-col z-0 bg-background items-center justify-center w-screen h-screen">
      <div>
        <ExportButton booking={dummyBooking}/>
      </div>
    </div>
  )
};

export default Page;
