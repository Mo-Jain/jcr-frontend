import { useDateStore, useEventStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import dayjs from "dayjs";
import React from "react";
import { EventRenderer } from "./event-renderer";


export default function MonthViewBox({
  day,
  rowIndex
}: {
  day: dayjs.Dayjs | null;
  rowIndex: number;
}) {
  const {  events } = useEventStore();
  
  const { setDate } = useDateStore();

  if (!day) {
    return (
      <div className="h-12 w-full border md:h-28 md:w-full lg:h-full"></div>
    );
  }

  const isFirstDayOfMonth = day.date() === 1;

  const isToday = day.format("DD-MM-YY") === dayjs().format("DD-MM-YY");

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setDate(day);
  };

  return (
    <div
      className={cn(
        "group  relative min-h-28 flex flex-col items-center border border-border",
        "transition-all hover:bg-violet-50 dark:hover:bg-background ",
      )}
      onClick={handleClick}
    >
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
        <EventRenderer date={day} view="month" events={events} />
      </div>
    </div>
  );
}
