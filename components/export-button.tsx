'use client'

import { PDFDownloadLink } from "@react-pdf/renderer";
import PdfDocument from "./pdf-document";
import { Booking } from "@/app/booking/[id]/page";

export default function ExportButton({booking}:{booking:Booking}) {
  return (
    <PDFDownloadLink document={<PdfDocument booking={booking}/>} fileName="exported.pdf">
      {({ loading }) => (loading ? "Preparing document..." : "Export agreement")}
    </PDFDownloadLink>
  );
}
