'use client'
import React, { useState } from 'react';
import {  pdf } from '@react-pdf/renderer';
import * as Dialog from '@radix-ui/react-dialog';
import { Mail, Share2 } from 'lucide-react';
import PDFDocument from '@/components/pdf-document';

const dummyDocuments = [
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

const dummyCarImages = [
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

const dummyBooking = {
  id: "B12345",
  start: "2025-03-01",
  end: "2025-03-05",
  startTime: "10:00",
  endTime: "18:00",
  status: "Confirmed",
  customerName: "John Doe",
  customerContact: "+91 9876543210",
  carId: 101,
  carName: "Toyota Corolla",
  carPlateNumber: "GJ05AB1234",
  carImageUrl: "https://images.unsplash.com/photo-1590362891991-f776e747a588?q=80&w=300",
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

function App() {
  const [open, setOpen] = useState(false);

  const handleEmailShare = async () => {
    try {
      // Generate PDF blob
        const doc = <PDFDocument booking={dummyBooking} />;
        console.log("doc",doc)
        const asPdf = await pdf(doc).toBlob();
        console.log("asPdf",asPdf)
        // Create a temporary URL for the blob

        // Convert Blob to ArrayBuffer
        const arrayBuffer = await asPdf.arrayBuffer();

        // Convert ArrayBuffer to Base64 (to send via API)
        const base64Pdf = Buffer.from(arrayBuffer).toString("base64");

        console.log("base64Pdf",base64Pdf)

        const pdfUrl = URL.createObjectURL(asPdf);
        
        // Create email content
        const subject = encodeURIComponent(`Booking Details - ${dummyBooking.id}`);
        const body = encodeURIComponent(`Please find attached the booking details for ${dummyBooking.carName}.`);
        
        // Open Gmail compose in a new window
        window.open(`https://mail.google.com/mail/?view=cm&fs=1&su=${subject}&body=${body}&attach=${arrayBuffer}`, '_blank');
        
        // Clean up the temporary URL after a delay
        setTimeout(() => URL.revokeObjectURL(pdfUrl), 60000);
        
        setOpen(false);
    } catch (error) {
        console.error('Error generating PDF:', error);
    }
  };

  return (
    <div className="relative w-full h-screen bg-gray-100">
      {/* Share Button */}
      <div className="absolute top-4 right-4 z-10">
        <Dialog.Root open={open} onOpenChange={setOpen}>
          <Dialog.Trigger asChild>
            <button className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors">
              <Share2 className="w-5 h-5" />
            </button>
          </Dialog.Trigger>
          
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/50" />
            <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 w-80">
              <Dialog.Title className="text-lg font-semibold mb-4">
                Share Booking Details
              </Dialog.Title>
              
              <button
                onClick={handleEmailShare}
                className="w-full flex items-center justify-center gap-2 p-3 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Mail className="w-5 h-5 text-gray-600" />
                <span>Share via Email</span>
              </button>
              
              <Dialog.Close asChild>
                <button
                  className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                  aria-label="Close"
                >
                  ✕
                </button>
              </Dialog.Close>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>

      {/* PDF Viewer */}
      {/* <PDFViewer className="w-full h-full">
        <PDFDocument booking={dummyBooking} />
      </PDFViewer> */}
    </div>
  );
}

export default App;