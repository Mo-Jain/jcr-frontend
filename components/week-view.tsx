"use client"
import { getHours, getWeekDays } from "@/lib/getTime";
import { useDateStore, useEventStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import dayjs, { Dayjs } from "dayjs";
import React, { useEffect, useState } from "react";
import { ScrollArea } from "./ui/scroll-area";
import { EventRenderer } from "./event-renderer";
import {CalendarEventType} from "@/lib/store";
import { ChevronDown, ChevronUp } from "lucide-react";
import HeaderEvent from "./week-header-event";

export default function WeekView() {
  const [currentTime, setCurrentTime] = useState(dayjs());
  const { events } = useEventStore();
  const [isEventHidden, setIsEventHidden] = useState(true);
  const { userSelectedDate, setDate } = useDateStore();


  useEffect(() => {
    
    const interval = setInterval(() => {
      setCurrentTime(dayjs());
    }, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);



  const getFormatedEvents = (events:CalendarEventType[], date:Dayjs) => {
    const filteredEvents = events.filter((event: CalendarEventType) => {
      return dayjs(event.startDate).isSame(date,"days")
      && dayjs(event.endDate).isSame(date,"days")
    })

    return filteredEvents;
  }

  return (
    <>
      <div className="grid grid-cols-[auto_1fr_1fr_1fr_1fr_1fr_1fr_1fr] border-b border-border px-4  py-2">
        <div className="w-16 border-r border-border flex flex-col items-center justify-between">
          <div className="relative h-[64px]">
            <div className="absolute top-2 text-xs text-gray-600 dark:text-gray-300">GMT +2</div>
          </div>
          <div>
          {isEventHidden ?
          <ChevronDown className="size-4 cursor-pointer" onClick={()=> setIsEventHidden(false)}/>
          :
          <ChevronUp className="size-4 cursor-pointer" onClick={()=> setIsEventHidden(true)}/>
          }
          </div>
        </div>

        {/* Week View Header */}

        {getWeekDays(userSelectedDate).map(({ currentDate, today }, index) =>{
            return(
              <HeaderEvent key={index} index={index} date={currentDate} today={today} isEventHidden={isEventHidden}/>
        )})}
        
      </div>

      {/* Time Column & Corresponding Boxes of time per each date  */}

      <ScrollArea className="h-[70vh]">
        <div className="grid grid-cols-[auto_1fr_1fr_1fr_1fr_1fr_1fr_1fr] px-4 py-2">
          {/* Time Column */}
          <div className="w-16 border-r border-border">
            {getHours.map((hour, index) => (
              <div key={index} className="relative h-[64px]">
                <div className="absolute -top-2 text-xs text-gray-600 dark:text-gray-300">
                  {hour.format("HH:mm")}
                </div>
              </div>
            ))}
          </div>

          {/* Week Days Corresponding Boxes */}

          {getWeekDays(userSelectedDate).map(
            ({ isCurrentDay, today }, index) => {
              const dayDate = userSelectedDate
                .startOf("week")
                .add(index, "day");
                return (
                  <div key={index} className="relative border-1 border-black border-r border-border">
                  {getHours.map((hour, i) => {
                    const filteredEvents = getFormatedEvents(events,dayDate.hour(hour.hour()));
                    return(
                    <div
                      key={i}
                      style={{ overflow: 'visible' }} // Add this style
                      className="relative flex h-[64px]  cursor-pointer flex-col items-center gap-y-2 border-b border-border hover:bg-gray-100 dark:hover:bg-background"
                      onClick={() => {
                        setDate(dayDate.hour(hour.hour()));
                      }}
                    > 
                      <EventRenderer
                        events={filteredEvents}
                        date={dayDate}
                        hour={hour.hour()}
                        view="week"
                      />
                    </div>
                  )})}
                  {/* Current time indicator */}

                  {isCurrentDay(dayDate) && today && (
                    <div
                      className={cn("absolute h-0.5 w-full bg-red-500")}
                      style={{
                        top: `${(currentTime.hour() / 24) * 100}%`,
                      }}
                    />
                  )}
                </div>
              );
            },
          )}
        </div>
      </ScrollArea>
    </>
  );
}
