"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Price from "@/public/price-tag.svg";
import CarFrontIcon from "@/public/car-front.svg";
import Calendar from "@/public/date-and-time.svg";
import Rupee from "@/public/rupee-symbol.svg";
import Booking from "@/public/online-booking.svg";
import axios from "axios";
import { BASE_URL } from "@/lib/config";
import { toast } from "@/hooks/use-toast";
import { Car, useSearchStore } from "@/lib/store";
import { DatePicker } from "@/components/ui/datepicker";
import AddTime from "@/components/add-time";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import Advance from "@/public/advance.svg";
import CustomerName from "@/components/customer-name";
import UserIcon from "@/public/user.svg";

interface FormErrors {
  [key: string]: string;
}

interface Customer {
  id: number;
  name: string;
  contact: string;
  address: string;
  imageUrl: string;
  folderId: string;
}

export function calculateCost(
  startDate: Date,
  endDate: Date,
  startTime: string,
  endTime: string,
  pricePer24Hours: number,
) {
  const startDateTime = new Date(startDate);
  const endDateTime = new Date(endDate);

  const [startHour, startMinute] = startTime.split(":").map(Number);
  const [endHour, endMinute] = endTime.split(":").map(Number);

  startDateTime.setHours(startHour, startMinute, 0, 0);
  endDateTime.setHours(endHour, endMinute, 0, 0);

  const timeDifference = endDateTime.getTime() - startDateTime.getTime();
  const hoursDifference = timeDifference / (1000 * 60 * 60);
  const cost = (hoursDifference / 24) * pricePer24Hours;

  return Math.floor(cost);
}
function convertTime(time:string){
  const [hour, minute] = time.split(" ")[0].split(':').map(Number);
  const period = time.split(" ")[1];
  if(period === "PM") {
      return `${hour+12}:${minute}`
  }
  else{
      if (hour < 10 ) return `0${hour}:${minute}`
      return `${hour}:${minute}`
  }
}
export function AddBookingDialog({
  isOpen,
  setIsOpen,
  cars
}: {
  isOpen: boolean,
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
  cars: Car[],
}) {
  const {startDate,endDate,startTime,endTime} = useSearchStore();
  const [newStartDate, setNewStartDate] = useState<Date>(startDate);
  const [newEndDate, setNewEndDate] = useState<Date>(endDate ? endDate : startDate);
  const [newStartTime, setNewStartTime] = useState<string>(convertTime(startTime));
  const [newEndTime, setNewEndTime] = useState<string>(convertTime(endTime));
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [carId, setCarId] = useState<number>(cars[0] ? cars[0].id : 0);
  const [price, setPrice] = useState<number>(0);
  const [buttonText, setButtonText] = useState<"Book Now" | "Not available" | "Checking availability" | "Please wait">("Book Now");
  const [advance, setAdvance] = useState<number>(0);
  const [name, setName] = useState<string>("");
  const [contact, setContact] = useState<string>("");
  const [customerId, setCustomerId] = useState<number>();
  const [customers, setCustomers] = useState<Customer[]>();
  
  useEffect(() => {
    const cost = calculateCost(newStartDate, newEndDate, newStartTime, newEndTime, price);
    setTotalAmount(cost);
  }, [newStartDate, newEndDate, newStartTime, newEndTime,price]);

  useEffect(()=> {
    setNewStartDate(startDate);
    setNewEndDate(endDate ? endDate : startDate);
    setNewStartTime(convertTime(startTime));
    setNewEndTime(convertTime(endTime));
  },[startDate,endDate,startTime,endTime])

  const validateDate = () => {
    if (newStartDate < newEndDate) return true;

    const startDateTime = new Date(newStartDate);
    const endDateTime = new Date(newEndDate);

    const [startHour, startMinute] = newStartTime.split(":").map(Number);
    const [endHour, endMinute] = newEndTime.split(":").map(Number);

    startDateTime.setHours(startHour, startMinute, 0, 0);
    endDateTime.setHours(endHour, endMinute, 0, 0);

    return startDateTime < endDateTime;
  };

 

  const validateForm = () => {
    const newErrors: FormErrors = {};
    if (price === 0) newErrors.price = "Price can't be zero";
    if (totalAmount === 0) newErrors.totalAmount = "Total Amount can't be zero";
    if (!startDate) newErrors.startDate = "This field is mandatory";
    if (!endDate) newErrors.endDate = "This field is mandatory";
    if (carId === 0) newErrors.car = "Please select a car";
    if (name === "") newErrors.name = "This field is mandatory";
    if (contact === "") newErrors.contact = "This field is mandatory";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  useEffect(() => {
    if (carId === 0) return;
    const currCar = cars.find((car) => car.id === carId);
    if (currCar) {
      setPrice(currCar.price);
    }
  }, [carId, cars]);

  useEffect(() => {
    setCarId(cars[0] ? cars[0].id : 0);
  }, [cars]);

  useEffect(() =>{
    if(!isOpen) return;
    setButtonText("Book Now");
},  [isOpen, newStartDate, newEndDate, newStartTime, newEndTime]);

  useEffect(() => {
      async function fetchData() {
        try {
          const res = await axios.get(`${BASE_URL}/api/v1/customer/all`, {
          headers: {
            authorization: `Bearer ` + localStorage.getItem("token"),
          },
        });
        setCustomers(res.data.customers);
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, []);

  const checkCarAvailability = async () => {
    
    try {
      const user:string = "admin";
      const response = await axios.get(`${BASE_URL}/api/v1/car/availability/${carId}?startDate=${newStartDate}&endDate=${newEndDate}&startTime=${newStartTime}&endTime=${newEndTime}&user=${user}`,
      {
        headers: {
          "Content-type": "application/json",
          authorization: `Bearer ` + localStorage.getItem("token"),
        },
      }
      );
      if (response.data.isAvailable) {
        setButtonText("Book Now");
        return true;
      } else {
        setButtonText("Not available");
        return false;
      }
    } catch (error) {
      console.log(error);
      toast({
        description: "Something went wrong",
        className:
          "text-black bg-white border-0 rounded-md shadow-mg shadow-black/5 font-normal",
        variant: "destructive",
        duration: 2000,
      });
      setNewStartDate(startDate);
      setNewStartTime(convertTime(startTime));
      setNewEndDate(endDate ? endDate : startDate);
      setNewEndTime(convertTime(endTime));
      setButtonText("Book Now");
      return false;
    }
  }
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validateDate()) {
      toast({
        description: `End date can't be equal or before start date`,
        className:
          "text-black bg-white border-0 rounded-md shadow-mg shadow-black/5 font-normal",
        variant: "destructive",
        duration: 2000,
      });
      setErrors((prev) => ({
        ...prev,
        endDate: "End date can't be equal or before start date",
      }));
      return;
    }
    if (!validateForm()) {
      toast({
        description: `Please fill all mandatory fields`,
        className:
          "text-black bg-white border-0 rounded-md shadow-mg shadow-black/5 font-normal",
        variant: "destructive",
        duration: 2000,
      });
      return;
    }
    setIsLoading(true);
    setButtonText("Checking availability");
    const isAvailable = await checkCarAvailability();
    if(!isAvailable) {
      setIsLoading(false);
      return;
    }
    setButtonText("Please wait")
   
    try {
      const res = await axios.post(
        `${BASE_URL}/api/v1/booking`,
        {
          startDate: newStartDate.toLocaleDateString("en-US"),
          endDate: newEndDate.toLocaleDateString("en-US"),
          startTime: newStartTime,
          endTime: newEndTime,
          allDay: false,
          carId,
          customerName: name,
          customerContact: contact,
          dailyRentalPrice: price,
          totalAmount: totalAmount,
          customerId: customerId,
          advance
        },
        {
          headers: {
            "Content-type": "application/json",
            authorization: `Bearer ` + localStorage.getItem("token"),
          },
        },
      );
      setIsOpen(false);
      setIsLoading(false);
      toast({
        description: `Booking Successfully created`,
        className:
          "text-black bg-white border-0 rounded-md shadow-mg shadow-black/5 font-normal",
      });
      console.log(res.data);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      toast({
        description: `Booking failed to create`,
        className:
          "text-black bg-white border-0 rounded-md shadow-mg shadow-black/5 font-normal",
        variant: "destructive",
        duration: 2000,
      });
    }
  };

  const handleDateChange = async(type: string) => {
    if (type === "start") {
      setErrors((prev) => ({ ...prev, startDate: "" }));
    } else if (type === "end") {
      setErrors((prev) => ({ ...prev, endDate: "" }));
    }
  };

  return (
    <>
    
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-sm:p-2 max-sm:py-4 bg-white dark:bg-muted dark:border-zinc-700 sm:top-[55%] sm:h-auto overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center max-sm:space-y-0 gap-2 mt-30 text-blue-700 dark:text-blue-600">
              <Booking className="w-6 h-6 flex-shrink-0 stroke-[6px] stroke-blue-600 fill-blue-600" />
              Add Booking
            </DialogTitle>
          </DialogHeader>
          <form  className="space-y-4">
            <div className="flex items-center gap-4">
              <CarFrontIcon className="w-6 h-4 dark:stroke-blue-200 dark:fill-blue-200 stroke-[6px] stroke-black fill-black flex-shrink-0" />
              <Label htmlFor="car" className="w-1/3">
                Selected car
              </Label>
              <Select
                value={carId != 0 ? carId.toString() : undefined} // Ensures placeholder shows when carId is 0 or undefined
                onValueChange={(value) => {
                  setCarId(Number(value));
                  setErrors((prev) => ({ ...prev, car: "" }));
                }}
              >
                <SelectTrigger
                  id="car"
                  className="w-2/3 border-input focus:border-blue-400 focus:ring-blue-400 max-sm:max-w-[190px] focus-visible:ring-blue-400 focus:outline-none"
                >
                  <SelectValue placeholder="Select a car" />
                </SelectTrigger>
                <SelectContent
                  className="bg-background border-border"
                  aria-modal={false}
                >
                  {cars &&
                    cars.length > 0 &&
                    cars.map((car) => (
                      <SelectItem
                        key={car.id}
                        className="focus:bg-blue-300 dark:focus:bg-blue-900 cursor-pointer"
                        value={car.id.toString()}
                      >
                        {car.brand + " " + car.model}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-4">
                <Calendar className="h-5 w-5 flex-shrink-0 fill-black dark:fill-white stroke-black dark:stroke-white stroke-[1px]" />
                <Label className="w-1/3">Date and time</Label>
              </div>
              <div className="flex items-center gap-2 ml-9">
                <Label htmlFor="fromDate" className="w-1/6">
                  From
                </Label>
                <div>
                  <div className="flex space-x-4">
                    <div className="">
                      <DatePicker
                        className="max-sm:w-[120px]"
                        date={newStartDate}
                        setDate={setNewStartDate}
                        handleDateChange={handleDateChange}
                        dateType="start"
                      />
                    </div>
                    <div className=" mx-2">
                      <AddTime
                        className="max-sm:px-4 px-2 w-fit"
                        selectedTime={newStartTime}
                        setSelectedTime={setNewStartTime}
                      />
                    </div>
                  </div>
                  
                </div>
              </div>
              <div className="flex items-center gap-2 ml-9">
                <Label htmlFor="toDate" className="w-1/6">
                  To
                </Label>
                <div>
                  <div className="flex space-x-4">
                    <div className="">
                      <DatePicker
                        className="max-sm:w-[120px]"
                        date={newEndDate}
                        setDate={setNewEndDate}
                        handleDateChange={handleDateChange}
                        dateType="end"
                      />
                    </div>
                    <div className=" mx-2">
                      <AddTime
                        className="max-sm:px-4 px-2 w-fit"
                        selectedTime={newEndTime}
                        setSelectedTime={setNewEndTime}
                      />
                    </div>
                  </div>
                  {errors.endDate && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.endDate}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
                <UserIcon className="h-5 w-5 flex-shrink-0 stroke-[12px] stroke-black fill-black dark:stroke-white dark:fill-white" />
                <div className="flex w-full gap-2 sm:gap-4">
                  <div>
                    <Label htmlFor="name" className="w-1/3">
                      Customer Name
                    </Label>
                    <CustomerName
                      name={name}
                      contact={contact}
                      onChangeInput={(e) => {
                        setName(e.target.value);
                        setErrors((prev) => ({ ...prev, name: "" }));
                      }}
                      setCustomerId={setCustomerId}
                      customerId={customerId}
                      setName={setName}
                      setContact={setContact}
                      customers={customers}
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="name" className="w-1/3">
                      Contact
                    </Label>
                    <Input
                      value={contact}
                      type="number"
                      id="contact"
                      maxLength={9999999999}
                      onChange={(e) => {
                        if (e.target.value.length <= 10) {
                          setContact(e.target.value);
                          setErrors((prev) => ({ ...prev, contact: "" }));
                        }
                      }}
                      className="w-2/3 border-input max-sm:text-xs max-sm:placeholder:text-xs sm:min-w-[130px] w-full focus:border-blue-400 focus-visible:ring-blue-400 
                    [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
                  "
                    />
  
                    {errors.contact && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.contact}
                      </p>
                    )}
                  </div>
                </div>
              </div>

            <div className="flex items-center gap-4">
              <Price className="h-6 w-6 mr-[-2px] flex-shrink-0 stroke-[12px] stroke-black fill-black dark:stroke-white dark:fill-white" />
              <Label htmlFor="price" className="w-1/3">
                Price
              </Label>
              <Input
                type="text"
                id="price"
                className="w-2/3 border-input max-sm:text-xs  focus:border-blue-400 focus-visible:ring-blue-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                value={price}
                placeholder="0"
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d*$/.test(value)) {
                    setPrice(Number(value));
                    setErrors((prev) => ({ ...prev, price: "" }));
                  }
                }}
              />
              {errors.price && (
                <p className="text-red-500 text-sm mt-1">{errors.price}</p>
              )}
            </div>

            <div className="flex items-center gap-4">
              <Advance className="h-6 w-6 mr-[-2px] flex-shrink-0 stroke-[2px] stroke-black fill-black dark:stroke-white dark:fill-white" />
              <Label htmlFor="advance" className="w-1/3">
                Advance Payment
              </Label>
              <Input
                type="text"
                id="price"
                className="w-2/3 border-input max-sm:text-xs  focus:border-blue-400 focus-visible:ring-blue-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                value={advance}
                placeholder="0"
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d*$/.test(value)) {
                    setAdvance(Number(value));
                    setErrors((prev) => ({ ...prev, advance: "" }));
                  }
                }}
              />
              {errors.advance && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.advance}
                </p>
              )}
            </div>

            <div className="flex items-center gap-4">
              <Rupee className="h-6 w-6 mr-[-2px] flex-shrink-0 stroke-[2px] stroke-black fill-black dark:stroke-white dark:fill-white" />
              <Label htmlFor="totalAmount" className="w-1/3">
                Total amount
              </Label>
              <p className="text-xs sm:text-sm">{totalAmount}</p>
              {errors.totalAmount && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.totalAmount}
                </p>
              )}
            </div>
            
            <div className="flex items-center gap-2 sm:gap-4">
              <Button
                onClick={handleSubmit}
                disabled={buttonText !== "Book Now"}
                className={`bg-blue-600 active:scale-95 dark:text-white hover:bg-opacity-80 ${buttonText !== "Book Now" && "bg-opacity-50 cursor-not-allowed hover:bg-opacity-50"} w-full`}
              >
                <span>{buttonText}</span>
                {isLoading && (
                  <>
                    <div className="flex items-end py-1 h-full">
                      <span className="sr-only">Loading...</span>
                      <div className="h-1 w-1 bg-white mx-[2px] border-border rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                      <div className="h-1 w-1 bg-white mx-[2px] border-border rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                      <div className="h-1 w-1 bg-white mx-[2px] border-border rounded-full animate-bounce"></div>
                    </div>
                  </>
                )}
              </Button>
              {!isLoading &&
              <Button
                variant="outline"
                onClick={(e) => {
                  e.preventDefault()
                  setIsOpen(false)
                }}
                className="border active:scale-95 bg-transparent hover:bg-gray-300 dark:hover:bg-zinc-600 border-input w-full w-full"
              >
                Cancel
              </Button> }
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
