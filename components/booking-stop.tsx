import axios from "axios";
import { BASE_URL } from "@/lib/config";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Booking } from "./take-action";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/datepicker";
import AddTime from "@/components/add-time";
import dayjs from "dayjs";
import { useState } from "react";

const BookingStop = ({endOdometerReading,setEndOdometerReading,bookingId,endDate,setEndDate,endTime,setEndTime,setBookingStatus,isOpen,setIsOpen,odometerReading,setBookings,setIsLoading}:
    {   
        endOdometerReading:string,
        setEndOdometerReading:React.Dispatch<React.SetStateAction<string>>,
        bookingId:string,
        endDate:Date,
        setEndDate:React.Dispatch<React.SetStateAction<Date>>,
        endTime:string,
        setEndTime:React.Dispatch<React.SetStateAction<string>>,
        setBookingStatus?:React.Dispatch<React.SetStateAction<string>>,
        isOpen:boolean,
        setIsOpen:React.Dispatch<React.SetStateAction<boolean>>,
        odometerReading:string | undefined,
        setBookings?:React.Dispatch<React.SetStateAction<Booking[]>>;
        setIsLoading?:React.Dispatch<React.SetStateAction<boolean>>
      
    }) => {
        const router = useRouter();
        const [focused,setFocused] = useState(false);
        const getPlaceholder = (focused:boolean,value:string) => {
            let placeholder = "XXXXX"
            if(odometerReading) {
                if(odometerReading.length === 5 && Number(odometerReading) < 99500){
                    placeholder = "XXXXX"
                }else{
                    placeholder = "XXXXXX"
                }
            }
            if (!focused && !value) {
              return placeholder
            }
            return placeholder.slice(value.length)
          }
        
        const handleBookingStop = async () => {
          if(setIsLoading) setIsLoading(true);
            try {
              await axios.put(`${BASE_URL}/api/v1/booking/${bookingId}/end`, {
                endDate: endDate.toLocaleDateString('en-US'),
                endTime:endTime,
                odometerReading:endOdometerReading,
              },{
                headers: {
                  "Content-type": "application/json",
                  authorization: `Bearer ` + localStorage.getItem('token')
                }
              });
              if(setBookingStatus) setBookingStatus("Completed");
              if(setBookings) setBookings((prev) => prev.filter(bg => bg.id !== bookingId));
              
              toast({
                description: `Booking Successfully ended`,
                className: "text-black bg-white border-0 rounded-md shadow-mg shadow-black/5 font-normal",
              });
              router.push('/bookings');
            }
            catch(error){ 
              console.log(error);
              toast({
                description: `Booking failed to end`,
                className: "text-black bg-white border-0 rounded-md shadow-mg shadow-black/5 font-normal",
                variant: "destructive",
duration: 2000
              });
            }
            if(setIsLoading) setIsLoading(false);
        }

        
  return (
    <div>
            <div className={`${isOpen? "" : "hidden"} fixed top-0 left-0 h-screen w-screen z-10 bg-black/50 backdrop-blur-sm`}></div>
            <Dialog open={isOpen} onOpenChange={setIsOpen} modal={false}>
                <DialogContent className=" sm:w-fit border-border">
                  <DialogHeader>
                    <DialogTitle>End Your booking</DialogTitle>
                  </DialogHeader>
                  <div className="p-4 space-y-2">
                    <div className="flex flex-col gap-2 mb-2">
                        <span>End Date & Time</span>
                        <div className="flex space-x-2">
                            <div className="">
                                <DatePicker className="w-fit sm:w-fit" currDate={dayjs(endDate)} handleDateChange={(date:Date) => setEndDate(date)} dateType="end"/>
                            </div>
                            <div className=" mx-2">
                                <AddTime className="w-fit sm:w-fit px-4" selectedTime={endTime} setSelectedTime={setEndTime} />
                                <input type="hidden" name="time" value={endTime} />
                            </div>
                        </div>
                    </div>
                    <span>Odometer Reading</span>
                    <div className="flex w-fit items-center gap-2 mt-2">
                        <div className="flex items-center gap-2 ">
                        <Label htmlFor="start" className="text-left">
                            Start
                        </Label>
                        <Input 
                            id="start" 
                            type="text" readOnly 
                            disabled
                            value={odometerReading} 
                            className="bg-muted w-24 p-2 cursor-not-allowed select-none border-border text-xs sm:text-sm focus-visible:ring-0 focus-visible:ring-ring focus-visible:ring-offset-0"/>
                        </div>
                        <div className="flex items-center gap-3">
                        <Label htmlFor="stop" className="text-left">
                            End
                        </Label>
                        <div className="relative">
                            <Input id="stop" type="text"
                            value={endOdometerReading} 
                            onFocus={() => setFocused(true)}
                            onBlur={() => setFocused(false)}
                            onChange={(e) => setEndOdometerReading(e.target.value)} 
                            className= "w-24 p-2 max-sm:text-xs"/>
                            <div className="absolute -z-1 top-[1px] inset-y-0 -left-1 flex items-center pointer-events-none max-sm:text-xs">
                                <span className="pl-3 max-sm:text-[12px] text-[15px] max-sm:text-xs">
                                    {endOdometerReading}
                                    <span className="opacity-50 max-sm:text-xs">{getPlaceholder(focused,endOdometerReading)}</span>
                                </span>
                            </div>
                        </div>
                        </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleBookingStop} className="max-sm:my-2">End</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
        </div>
  )
};

export default BookingStop;
