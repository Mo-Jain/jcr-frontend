"use client";

  import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle,  DialogFooter } from "@/components/ui/dialog"
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { CalendarEventType, useCarStore, useEventStore } from "@/lib/store";
import axios from "axios";
import { BASE_URL } from "@/lib/config";
import dayjs from "dayjs";
import { toast } from "@/hooks/use-toast";


export default function CarsFilters() {
  const {cars,setCars} = useCarStore();
  const [selectedCars, setSelectedCars] = useState<number[]>(cars.map(car => car.id));
  const [color, setColor] = useState("#000000");
  const [actionCar,setActionCar] = useState<number>();
  const [isOpen, setIsOpen] = useState(false);
  const [allEvents, setAllEvents] = useState<CalendarEventType[]>([]);
  const {setEvents} = useEventStore();

  useEffect(() => {
    async function fetchData() {
      try {
        const res1 = await axios.get(`${BASE_URL}/api/v1/calendar/all`, {
          headers: {
            authorization: `Bearer ` + localStorage.getItem('token')
            }
          })
        console.log("res1.data.bookings",res1.data.bookings);
        setAllEvents(res1.data.bookings);
        console.log("bookings",allEvents);

      }
      catch (error) {
        console.log(error);
      }
    }
    fetchData();
  },[])

  const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setColor(event.target.value)
  }

  const handleCarColorChange = (carId:number) => {
    setActionCar(carId);
    setColor(cars.find(car => car.id === carId)?.colorOfBooking || "#000000");
    setIsOpen(true);
  }

  const handleUpdate = async() => {
    // Here you would typically update the color in your application state or backend
    console.log("Updating color to:", color)
    try{
      await axios.put(`${BASE_URL}/api/v1/calendar/change-color/${actionCar}`,{
          color: color
        },
        {
          headers: {
            "Content-type": "application/json",
            authorization: `Bearer ${localStorage.getItem("token")}`
          }
      });
      setCars(cars.map(car => {
        if(car.id === actionCar){
          return {
            ...car,
            colorOfBooking: color
          }
        }
        else{
          return car;
        }
      }));
      toast({
        description: `Car color Successfully updated`,
        className: "text-black bg-white border-0 rounded-md shadow-mg shadow-black/5 font-normal",
      });
      setIsOpen(false);
    }
    catch(error){
      console.log(error);
      toast({
        description: `Car color failed to update`,
        className: "text-black bg-white border-0 rounded-md shadow-mg shadow-black/5 font-normal",
        variant: "destructive",
duration: 2000
      });
    }
   
  }
  const handleCheckboxChange = (carId: number) => {
    const newSelection = selectedCars.includes(carId)
      ? selectedCars.filter(id => id !== carId)
      : [...selectedCars, carId];
    
    const filteredEvents = allEvents.filter(event => newSelection.includes(event.carId));
    const mappedEvents: CalendarEventType[] = filteredEvents.map((event) => ({
              id: event.id,
              startDate: dayjs(event.startDate),
              status: event.status,
              startTime: event.startTime,
              endDate: dayjs(event.endDate),
              endTime: event.endTime,
              color:event.color,
              allDay: event.allDay,
              customerName: event.customerName,
              customerContact: event.customerContact,
              carId: event.carId,
              carName: event.carName,
            }));
    setEvents(mappedEvents);
    setSelectedCars(newSelection);
  };
  return (
    <div>
          {cars.map((car) => {
            console.log("car.colorOfBooking",car.colorOfBooking);
            return(
            <div className="flex items-center  space-x-3 " key={car.id}>
              <input
                type="checkbox"
                id={car.id.toString()}
                checked={selectedCars.includes(car.id)}
                onChange={() => handleCheckboxChange(car.id)}
                style={{ accentColor: car.colorOfBooking }}
                className={cn("h-4 w-4 rounded-none")}
              />
              <div className="flex items-center justify-between w-full px-[4px]">
                <label
                  htmlFor={car.id.toString()}
                  className="text-sm font-medium text-center py-2 leading-none text-gray-600 dark:text-gray-200 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {car.brand + " " + car.model}
                </label>
                <p 
                  onClick={() => handleCarColorChange(car.id)}
                  className="text-xs border bg-gray-200 hover:bg-gray-300 dark:bg-black dark:hover:bg-card cursor-pointer border-border text-center p-1 rounded-sm">
                  Change color
                </p>
              </div>
            </div>
          )})}
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Change color of bookings</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="color" className="text-right">
                    Select color
                  </Label>
                  <Input id="color" type="color" value={color} onChange={handleColorChange} className="col-span-3" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleUpdate}>Update</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
  );
}
