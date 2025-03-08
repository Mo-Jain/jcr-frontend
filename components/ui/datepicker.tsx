"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "./input";

export function DatePicker({
  dateType,
  handleDateChange,
  className,
  date,
  setDate,
}: {
  dateType?: string;
  handleDateChange?: (type: string) => void;
  className?: string;
  date: Date;
  setDate: React.Dispatch<React.SetStateAction<Date>>;
}) {
  const [dateText, setDateText] = useState<string>(format(date, "MMM d, yyyy"));
  const [isPopoverOpen, setIsPopoverOpen] = useState<boolean>(false);

  useEffect(() => {
    if (handleDateChange && dateType) handleDateChange(dateType);
    setDateText(format(date, "MMM d, yyyy"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date, dateType]);

  const handleDateTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDateText = e.target.value;
    setDateText(newDateText);
    const newDate = new Date(newDateText);
    setDate(newDate);
  };

  return (
    <div>
      <Popover onOpenChange={(open) => setIsPopoverOpen(open)}>
        <PopoverTrigger asChild>
          <Input
            value={dateText}
            onChange={handleDateTextChange}
            type="text"
            className={cn(
              "p-1 sm:w-[110px] w-[80px] shadow-sm m-0 border-0 focus-visible:ring-0 border-y-4 max-sm:text-xs text-sm border-transparent cursor-text bg-gray-200 dark:bg-card dark:hover:bg-zinc-700 rounded-sm hover:bg-gray-300 justify-start text-left font-normal",
              isPopoverOpen ? " border-b-blue-400" : "",
              !date && "text-muted-foreground",
              className,
            )}
          ></Input>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 border-border" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(date) => setDate(date || new Date())}
            initialFocus
            style={{ pointerEvents: "auto" }}
            className="bg-background"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
