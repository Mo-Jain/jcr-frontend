import { CalendarEventType, useDateStore, useEventStore, useViewStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import dayjs from "dayjs";
import React, { useState } from "react";
import { EventRenderer } from "./event-renderer";
import EventDialog from "./event-dialog";

export default function MonthViewBox({
  day,
  rowIndex,
}: {
  day: dayjs.Dayjs | null;
  rowIndex: number;
}) {
  const { events } = useEventStore();
  const [isOpenEventDialog,setIsOpenEventDialog] = useState(false);
  const { setDate } = useDateStore();
  const {setView} = useViewStore();
  const [allEvents,setAllEvents] = useState<CalendarEventType[]>([]);

  if (!day) {
    return (
      <div className="h-12 w-full border md:h-28 md:w-full lg:h-full"></div>
    );
  }
  const isFirstDayOfMonth = day.date() === 1;

  const isToday = day.format("DD-MM-YY") === dayjs().format("DD-MM-YY");

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDate(day);
    handleClickOutside(e);
    setView("week");
  };

  const handleClickOutside = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target instanceof HTMLElement) {
      if (
        !e.target.closest("#eventDialog") 
      ) {
        setIsOpenEventDialog(false);
      }
    }
  };

  return (
    <>
    
    <div
      className={cn(
        "group  relative min-h-28 flex flex-col items-center border border-border",
        "transition-all hover:bg-gray-100 dark:hover:bg-muted",
      )}
      onClick={handleClick}
    >
      {isOpenEventDialog &&
      <EventDialog events={allEvents} date={day} setIsOpenEventDialog={setIsOpenEventDialog}/>}
      <div className=" flex flex-col min-h-6 items-center">
        {rowIndex === 0 && (
          <h4 className="text-[10px] font-medium sm:text-xs text-gray-500">
            {day.format("ddd").toUpperCase()}
          </h4>
        )}
        <h4
          className={cn(
            "text-center text-xs sm:text-sm",
            isToday &&
              "flex  h-6 w-6 sm:h-6 sm:w-6 p-[1px] items-center justify-center rounded-full bg-blue-800 text-white",
          )}
        >
          {isFirstDayOfMonth ? day.format("MMM D") : day.format("D")}
        </h4>
      </div>
      
      <div className="flex items-center w-full">
        <EventRenderer date={day} view="month" events={events} setAllEvents={setAllEvents} setIsOpenEventDialog={setIsOpenEventDialog}/>
      </div>
    </div>
    </>
  );
}
