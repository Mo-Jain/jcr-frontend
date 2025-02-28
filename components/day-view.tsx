"use client";
import { CalendarEventType, useDateStore, useEventStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import dayjs, { Dayjs } from "dayjs";
import React, { useEffect, useState } from "react";
import { ScrollArea } from "./ui/scroll-area";
import { getHours, isCurrentDay } from "@/lib/getTime";
import { EventRenderer } from "./event-renderer";
import { ChevronDown, ChevronUp } from "lucide-react";
import DayHeaderEvent from "./day-header-event";

export default function DayView() {
  const [currentTime, setCurrentTime] = useState(dayjs());
  const { events } = useEventStore();
  const { userSelectedDate, setDate } = useDateStore();
  const [filteredEvents, setFilteredEvents] = useState<CalendarEventType[]>([]);

  const [isEventHidden, setIsEventHidden] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(dayjs());
    }, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    getFormatedEvents(events, userSelectedDate);
  }, [events, userSelectedDate]);

  const getFormatedEvents = (events: CalendarEventType[], date: Dayjs) => {
    const selectedEvents = events.filter((event: CalendarEventType) => {
      return (
        dayjs(event.startDate).isSame(date, "days") &&
        dayjs(event.endDate).isSame(date, "days")
      );
    });

    setFilteredEvents(selectedEvents);
  };

  const isToday =
    userSelectedDate.format("DD-MM-YY") === dayjs().format("DD-MM-YY");

  return (
    <>
      <div
        className={`flex py-1 px-4 border-b border-border  ${isEventHidden ? "h-[90px]" : "h-fit"} transition-all duration-300 ease-in-out`}
      >
        <div className="flex w-16 flex-col items-center ">
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
          {isEventHidden ? (
            <ChevronDown
              className="size-4 cursor-pointer"
              onClick={() => setIsEventHidden(false)}
            />
          ) : (
            <ChevronUp
              className="size-4 cursor-pointer"
              onClick={() => setIsEventHidden(true)}
            />
          )}
        </div>
        <DayHeaderEvent isEventHidden={isEventHidden} />
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
