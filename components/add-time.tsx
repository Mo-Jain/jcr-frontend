"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export default function AddTime({
  setSelectedTime,
  className,
  selectedTime,
}: {
  setSelectedTime: React.Dispatch<React.SetStateAction<string>>;
  className?: string;
  selectedTime: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const generateTimeIntervals = () => {
    const intervals = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        intervals.push(
          `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`,
        );
      }
    }
    return intervals;
  };

  return (
    <div className="relative">
      <Select
        value={selectedTime}
        onValueChange={setSelectedTime}
        onOpenChange={(open) => setIsOpen(open)}
      >
        <SelectTrigger
          isArrow={false}
          className={cn(
            "p-1 sm:w-[60px] shadow-sm sm:text-sm text-xs m-0 h-[38px] p-[6px] border-0 focus-visible:ring-0 border-transparent border-y-4 cursor-text bg-gray-200 dark:bg-card dark:hover:bg-zinc-700 rounded-sm hover:bg-gray-300 justify-start text-left font-normal",
            isOpen && "border-b-4 border-b-blue-400",
            className,
          )}
        >
          {selectedTime}
        </SelectTrigger>
        <SelectContent className="h-40 min-w-0 z-50 p-0 border-border overflow-y-auto bg-background scrollbar-hide">
          <div className="p-1 dark:border-muted flex bg-transparent flex-col items-center scrollbar-hide overflow-x-hidden rounded-md text-popover-foreground">
            {generateTimeIntervals().map((time) => (
              <SelectItem
                key={time}
                isCheck={false}
                className="w-full sm:text-sm text-xs cursor-pointer dark:hover:bg-card rounded-md justify-start p-1 px-4"
                value={time}
              >
                {time}
              </SelectItem>
            ))}
          </div>
        </SelectContent>
      </Select>
    </div>
  );
}
