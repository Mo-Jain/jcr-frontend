"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Upload } from "lucide-react";
import * as XLSX from "xlsx";
import { toast } from "@/hooks/use-toast";
import axios from "axios";
import { BASE_URL } from "@/lib/config";

interface BookingData {
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  allDay: boolean;
  status: string;
  carId: number;
  securityDeposit?: string;
  dailyRentalPrice: number;
  advancePayment?: number;
  totalEarnings?: number;
  paymentMethod?: string;
  odometerReading?: string;
  notes?: string;
  customerName: string;
  customerContact: string;
  customerAddress?: string;
}

export interface Booking{
    id: string;
    carId: number;
    carImageUrl: string;
    carName: string;
    carPlateNumber: string;
    carColor:string;
    customerContact: string;
    customerName: string;
    end: string; // ISO 8601 date string
    start: string; // ISO 8601 date string
    startTime: string;
    endTime: string;
    status: string;
  }

const REQUIRED_FIELDS = [
  'startDate',
  'endDate',
  'startTime',
  'endTime',
  'allDay',
  'status',
  'carId',
  'dailyRentalPrice',
  'customerName',
  'customerContact'
];

function isValidDate(dateStr: string): boolean {
  const regex = /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-\d{4}$/;
  if (!regex.test(dateStr)) return false;
  
  const [day, month, year] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.getDate() === day && date.getMonth() === month - 1 && date.getFullYear() === year;
}

function isValidTime(timeStr: string): boolean {
  const regex = /^([01][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$/;
  return regex.test(timeStr);
}

function formatDate(date: string | number): string {
  try {
    let jsDate;
    if (typeof date === 'number') {
      jsDate = new Date((date - 25569) * 86400 * 1000);
    } else {
      jsDate = new Date(date);
    }

    if (isNaN(jsDate.getTime())) {
      throw new Error('Invalid date');
    }

    const day = String(jsDate.getDate()).padStart(2, '0');
    const month = String(jsDate.getMonth() + 1).padStart(2, '0');
    const year = jsDate.getFullYear();
    
    return `${day}-${month}-${year}`;
  } catch {
    throw new Error(`Invalid date format: ${date}`);
  }
}

function formatTime(time: string | number): string {
  if (typeof time === 'number') {
    const seconds = Math.round(time * 86400);
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }
  
  if (typeof time === 'string' && /^\d{2}:\d{2}:\d{2}$/.test(time)) {
    return time;
  }
  
  try {
    const [hours, minutes, seconds] = time.split(':').map(Number);
    if (isNaN(hours) || isNaN(minutes) || (seconds !== undefined && isNaN(seconds))) {
      throw new Error('Invalid time components');
    }
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds || 0).padStart(2, '0')}`;
  } catch {
    throw new Error(`Invalid time format: ${time}`);
  }
}

//eslint-disable-next-line @typescript-eslint/no-explicit-any
function validateData(data: any): BookingData {
  // Check required fields
  for (const field of REQUIRED_FIELDS) {
    if (data[field] === undefined || data[field] === '') {
      throw new Error(`Missing required field: ${field}`);
    }
  }

  // Format and validate dates and times
  const startDate = formatDate(data.startDate);
  const endDate = formatDate(data.endDate);
  const startTime = formatTime(data.startTime);
  const endTime = formatTime(data.endTime);

  if (!isValidDate(startDate)) throw new Error(`Invalid start date: ${startDate}`);
  if (!isValidDate(endDate)) throw new Error(`Invalid end date: ${endDate}`);
  if (!isValidTime(startTime)) throw new Error(`Invalid start time: ${startTime}`);
  if (!isValidTime(endTime)) throw new Error(`Invalid end time: ${endTime}`);

  // Validate numeric fields
  if (isNaN(Number(data.carId))) throw new Error('Car ID must be a number');
  if (isNaN(Number(data.dailyRentalPrice))) throw new Error('Daily rental price must be a number');
  if (data.advancePayment !== undefined && isNaN(Number(data.advancePayment))) {
    throw new Error('Advance payment must be a number');
  }
  if (data.totalEarnings !== undefined && isNaN(Number(data.totalEarnings))) {
    throw new Error('Total earnings must be a number');
  }

  return {
    startDate,
    endDate,
    startTime,
    endTime,
    allDay: Boolean(data.allDay),
    status: String(data.status),
    carId: Number(data.carId),
    dailyRentalPrice: Number(data.dailyRentalPrice),
    customerName: String(data.customerName),
    customerContact: String(data.customerContact),
    customerAddress: data.customerAddress ? String(data.customerAddress) : undefined,
    securityDeposit: data.securityDeposit?.toString(),
    advancePayment: data.advancePayment ? Number(data.advancePayment) : undefined,
    totalEarnings: data.totalEarnings ? Number(data.totalEarnings) : undefined,
    paymentMethod: data.paymentMethod?.toString(),
    odometerReading: data.odometerReading?.toString(),
    notes: data.notes?.toString(),
  };
}

export default function ExcelUploader() {
  const [isOpen, setIsOpen] = useState(false);
  const [excelData, setExcelData] = useState<BookingData[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const fileType = file.name.split('.').pop()?.toLowerCase();
    if (!['xlsx', 'xls'].includes(fileType || '')) {
      toast({
        description:"Please upload a valid Excel file (.xlsx or .xls)",
        className: "text-black bg-white border-0 rounded-md shadow-mg shadow-black/5 font-normal",
        variant: "destructive",
duration: 2000
      })
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        // Validate and format each row
        const validatedData: BookingData[] = [];
        const errors: string[] = [];

        jsonData.forEach((row, index) => {
          try {
            const validatedRow = validateData(row);
            validatedData.push(validatedRow);
          } catch (error) {
            errors.push(`Row ${index + 2}: ${(error as Error).message}`);
          }
        });

        if (errors.length > 0) {
          toast({
            description:<div>
                            <div>Found {errors.length} errors in the Excel file:</div>
                            <ul className="mt-2 list-disc pl-4">
                            {errors.slice(0, 3).map((error, i) => (
                                <li key={i}>{error}</li>
                            ))}
                            {errors.length > 3 && <li>...and {errors.length - 3} more errors</li>}
                            
                            </ul>
                        </div>,
            className: "text-black bg-white border-0 rounded-md shadow-mg shadow-black/5 font-normal",
            variant: "destructive",
duration: 2000
          })
          return;
        }

        setExcelData(validatedData);
        setIsOpen(true);
      } catch (error) {
        toast({
            description:'Error parsing Excel file: ' + (error as Error).message,
            variant:'destructive'
        })
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };
    reader.readAsBinaryString(file);
  };

  const handleUpload = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${BASE_URL}/api/v1/booking/multiple`,excelData, {
        headers: {
          "Content-Type": "application/json",
            authorization: `Bearer ` + localStorage.getItem('token')
        },
      });

      if (response.status !== 200) {
        throw new Error("Failed to upload data");
      }

      toast({
        description:'Data uploaded successfully',
      })
      setIsOpen(false);
      setExcelData([]);
            
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      toast({
        description:'Error uploading data: ' + (error as Error).message,
        variant:'destructive'
      })
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <input
        type="file"
        accept=".xlsx,.xls"
        onChange={handleFileUpload}
        className="hidden"
        ref={fileInputRef}
      />
      <Button
        onClick={() => fileInputRef.current?.click()}
        className="flex items-center gap-2"
      >
        <Upload className="h-4 w-4" />
        Import
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[90vw] max-sm:w-[100vw]">
          <DialogHeader>
            <DialogTitle>Preview Excel Data</DialogTitle>
          </DialogHeader>
          <div className="h-[60vh] w-full overflow-auto rounded-md border border-border">
            <Table>
              <TableHeader>
                <TableRow className="border-border">
                  <TableHead className="whitespace-nowrap">Start Date</TableHead>
                  <TableHead className="whitespace-nowrap">End Date</TableHead>
                  <TableHead className="whitespace-nowrap">Start Time</TableHead>
                  <TableHead className="whitespace-nowrap">End Time</TableHead>
                  <TableHead className="whitespace-nowrap">All Day</TableHead>
                  <TableHead className="whitespace-nowrap">Status</TableHead>
                  <TableHead className="whitespace-nowrap">Car ID</TableHead>
                  <TableHead className="whitespace-nowrap">Customer Name</TableHead>
                  <TableHead className="whitespace-nowrap">Customer Contact</TableHead>
                  <TableHead className="whitespace-nowrap">Customer Address</TableHead>
                  <TableHead className="whitespace-nowrap">Security Deposit</TableHead>
                  <TableHead className="whitespace-nowrap">Daily Rental</TableHead>
                  <TableHead className="whitespace-nowrap">Advance</TableHead>
                  <TableHead className="whitespace-nowrap">Total</TableHead>
                  <TableHead className="whitespace-nowrap">Payment Method</TableHead>
                  <TableHead className="whitespace-nowrap">Odometer</TableHead>
                  <TableHead className="whitespace-nowrap">Notes</TableHead>
              
                </TableRow>
              </TableHeader>
              <TableBody>
                {excelData.map((row, index) => (
                  <TableRow key={index} className="border-border">
                    <TableCell className="border-border">{row.startDate}</TableCell>
                    <TableCell className="border-border">{row.endDate}</TableCell>
                    <TableCell className="border-border">{row.startTime}</TableCell>
                    <TableCell className="border-border">{row.endTime}</TableCell>
                    <TableCell className="border-border">{row.allDay ? "Yes" : "No"}</TableCell>
                    <TableCell className="border-border">{row.status}</TableCell>
                    <TableCell className="border-border">{row.carId}</TableCell>
                    <TableCell className="border-border">{row.customerName}</TableCell>
                    <TableCell className="border-border">{row.customerContact}</TableCell>
                    <TableCell className="border-border">{row.customerAddress}</TableCell>
                    <TableCell className="border-border">{row.securityDeposit}</TableCell>
                    <TableCell className="border-border">{row.dailyRentalPrice}</TableCell>
                    <TableCell className="border-border">{row.advancePayment}</TableCell>
                    <TableCell className="border-border">{row.totalEarnings}</TableCell>
                    <TableCell className="border-border">{row.paymentMethod}</TableCell>
                    <TableCell className="border-border">{row.odometerReading}</TableCell>
                    <TableCell className="border-border">{row.notes}</TableCell>

                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="flex justify-end">
            <Button
              onClick={handleUpload}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              {isLoading ? "Uploading..." : "Upload Data"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}