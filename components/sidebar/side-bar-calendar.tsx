import { getWeeks } from "@/lib/getTime";
import { useDateStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import dayjs from "dayjs";
import React, { Fragment } from "react";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";

export default function SideBarCalendar() {
  const { userSelectedDate,setMonth, setDate, selectedMonthIndex, twoDMonthArray } = useDateStore();

  const weeksOfMonth = getWeeks(selectedMonthIndex);

  const handleDateClick = (day:dayjs.Dayjs) => {
    setDate(day);
  }

  const handlePrevClick = () => {
    setMonth(selectedMonthIndex - 1);
    setDate(userSelectedDate.subtract(1, "month"));
  };

  const handleNextClick = () => {
    setMonth(selectedMonthIndex + 1);
    setDate(userSelectedDate.add(1, "month"));
    
  };

  return (
    <div className="my-6 p-2">
      <div className="flex items-center font-bold  justify-between">
        <h4 className="text-sm">
          {dayjs(new Date(dayjs().year(), selectedMonthIndex)).format(
            "MMMM YYYY",
          )}
        </h4>
       
        <div className="flex items-center gap-3">
          <MdKeyboardArrowLeft
            className="size-5 cursor-pointer font-bold"
            onClick={handlePrevClick}
          />
          <MdKeyboardArrowRight
            className="size-5 cursor-pointer font-bold"
            onClick={handleNextClick}
          />
        </div>
      </div>

      {/* Header Row: Days of the Week */}
      <div className="mt-2 grid grid-cols-[auto_1fr] font-semibold">
        <div className="w-6"></div>
        <div className="grid grid-cols-7 text-xs">
          {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
            <span key={i} className="py-1 text-center">
              {day}
            </span>
          ))}
        </div>
      </div>

      {/* Main Content: Weeks and Days */}
      <div className="mt-2 grid grid-cols-[auto_1fr] font-medium text-gray-600 dark:text-gray-400 text-xs">
        {/* Week Number  column */}
        <div className="grid w-6 grid-rows-5 gap-1 gap-y-1 rounded-sm bg-gray-100 dark:bg-muted p-1">
          {weeksOfMonth.map((week, i) => (
            <span key={i} className="flex h-5 w-5 items-center">
              {week}
            </span>
          ))}
        </div>

        {/* Dates grid */}

        <div className="grid grid-cols-7 grid-rows-5 gap-1 gap-y-1 justify-items-center rounded-sm p-1 text-xs">
          {twoDMonthArray.map((row, i) => (
            <Fragment key={i}>
              {row.map((day, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex h-5 w-5 flex items-center justify-center rounded-full",
                    day.format("DD-MM-YY") === dayjs().format("DD-MM-YY") &&
                      "bg-blue-600 text-white",
                  )}
                  onClick={() => handleDateClick(day)}
                >
                  <span>{day.format("D")}</span>
                </div>
              ))}
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
