"use client"
import { CalendarEventType, useCarStore, useDateStore, useEventStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import dayjs, { Dayjs } from "dayjs";
import React, { useEffect, useState } from "react";
import { ScrollArea } from "./ui/scroll-area";
import { getHours, isCurrentDay } from "@/lib/getTime";
import { EventRenderer } from "./event-renderer";
import { ChevronDown, ChevronUp } from "lucide-react";


export default function DayView() {
  const [currentTime, setCurrentTime] = useState(dayjs());
  const {  events } = useEventStore();
  const { userSelectedDate, setDate } = useDateStore();
  const { openEventSummary } = useEventStore();
  const [filteredEvents,setFilteredEvents] = useState<CalendarEventType[]>([]);
  const [headerEvents,setHeaderEvents] = useState<CalendarEventType[]>([]);
  const [noOfEvents, setNoOfEvents] = useState<number>(0);
  const [isEventHidden, setIsEventHidden] = useState(true);
  const {cars} = useCarStore();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(dayjs());
    }, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    getFormatedEvents(events,userSelectedDate);
  }, [events,userSelectedDate]);

  useEffect(() => {
    getAllDayEvents(events,userSelectedDate);
  }, [events,isEventHidden,userSelectedDate]);

  const getFormatedEvents = (events:CalendarEventType[], date:Dayjs) => {
    const selectedEvents = events.filter((event: CalendarEventType) => {
        return dayjs(event.startDate).isSame(date,"days")
            && dayjs(event.endDate).isSame(date,"days")
      });

    setFilteredEvents(selectedEvents);
  }

  const getAllDayEvents = (events:CalendarEventType[], date:Dayjs) => {
      let tempEvents = events.filter((event: CalendarEventType) => {
          return (dayjs(event.startDate).isBefore(date,"days") && dayjs(event.endDate).isAfter(date,"days"))
          || (dayjs(event.startDate).isSame(date,"days") && dayjs(event.endDate).isAfter(date,"days"))
          || (dayjs(event.startDate).isBefore(date,"days") && dayjs(event.endDate).isSame(date,"days"))
          || (event.allDay);
        });

      tempEvents = (noOfEvents < 5 || !isEventHidden) ? tempEvents : tempEvents.slice(0,3)
      setNoOfEvents(tempEvents.length);
      setHeaderEvents(tempEvents);
    }
  

  const isToday =
    userSelectedDate.format("DD-MM-YY") === dayjs().format("DD-MM-YY");

  return (
    <>
      <div className="flex px-4">
        <div className="flex w-16 flex-col items-center">
          <div className={cn("text-xs", isToday && "text-blue-600")}>
            {userSelectedDate.format("ddd")}{" "}
          </div>{" "}
          <div
            className={cn(
              "h-12 w-12 rounded-full p-2 text-2xl",
              isToday && "bg-blue-600 text-white",
            )}
          >
            {userSelectedDate.format("DD")}{" "}
          </div>
          {isEventHidden ?
          <ChevronDown className="size-4 cursor-pointer" onClick={()=> setIsEventHidden(false)}/>
          :
          <ChevronUp className="size-4 cursor-pointer" onClick={()=> setIsEventHidden(true)}/>
          }
          
        </div>
        <div className="flex flex-col w-full">
            {
               headerEvents.map((event) => {
                const eventDuration = dayjs(event.endDate).diff(dayjs(event.startDate),"days") + 1;
                const currentDuration  = userSelectedDate.diff(dayjs(event.startDate),"days") + 1;
                const car = cars.find(car => car.id === event.carId);
                return(
                <div
                  key={event.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    openEventSummary(event);
                  }}
                  style= {{backgroundColor: car?.colorOfBooking}}
                  className={` my-[1px] max-sm:h-[12px] w-full flex justify-center items-center cursor-pointer rounded-sm bg-[#039BE5] text-[7px] 
                      sm:text-xs text-white`}
                      >
                  {event.id + " : " + event.carName}  {"("} {currentDuration} / {eventDuration} {")"}
                </div>
              )})
            }          
          </div>
      </div>

      <ScrollArea className="h-[70vh]">
        <div className="grid grid-cols-[auto_1fr] p-4">
          {/* Time Column */}
          <div className="w-16 border-r border-muted">
            {getHours.map((hour, index) => (
              <div key={index} className="relative h-[64px]">
                <div className="absolute -top-2 text-xs text-gray-600">
                  {hour.format("HH:mm")}
                </div>
              </div>
            ))}
          </div>

          {/* Day/Boxes Column */}
          <div className="relative border-r border-muted">
            {getHours.map((hour, i) => (
              <div
                key={i}
                className="relative flex h-[64px] cursor-pointer flex-col items-center gap-y-2 border-b border-muted hover:bg-background"
                onClick={() => {
                  setDate(userSelectedDate.hour(hour.hour()));
                }}
              >
                <EventRenderer
                  events={filteredEvents}
                  date={userSelectedDate.hour(hour.hour())}
                  view="day"
                  hour={hour.hour()}
                />
              </div>
            ))}

            {/* Current time indicator */}
            {isCurrentDay(userSelectedDate) && (
              <div
                className={cn("absolute h-0.5 w-full bg-red-500")}
                style={{
                  top: `${(currentTime.hour() / 24) * 100}%`,
                }}
              />
            )}
          </div>
        </div>
      </ScrollArea>
    </>
  );
}
