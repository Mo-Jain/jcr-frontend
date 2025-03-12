'use client'
import { PDFViewer } from "@react-pdf/renderer";
import PDFDocument from "./pdf-document";
import { Booking } from "@/app/booking/[id]/page";

export default function PreviewPage({booking}:{booking:Booking}) {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <PDFViewer width="100%" height="100%">
        <PDFDocument booking={booking} />
      </PDFViewer>
    </div>
  );
}
