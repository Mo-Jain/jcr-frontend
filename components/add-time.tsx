'use client'

import { useState } from 'react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from '@/lib/utils'

export default function AddTime({
  setSelectedTime,
  className,
  selectedTime
}: {
  setSelectedTime: React.Dispatch<React.SetStateAction<string>>;
  className?: string;
  selectedTime:string
}) {
  const [isPopoverOpen, setIsPopoverOpen] = useState<boolean>(false);

  const generateTimeIntervals = () => {
    const intervals = []
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        intervals.push(
          `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
        )
      }
    }
    return intervals
  }

  return (
    <div className="relative" >
      <Popover onOpenChange={(open) => setIsPopoverOpen(open)} >
        <PopoverTrigger asChild >
          <div
            className={cn(
              "p-1 sm:w-[60px] shadow-sm sm:text-sm text-xs m-0 h-[36px] p-[6px] border-0 focus-visible:ring-0 border-transparent border-y-4 cursor-text bg-muted dark:hover:bg-card rounded-sm hover:bg-gray-300 justify-start text-left font-normal",
              isPopoverOpen ? "border-b-blue-400" : " ",
              className
            )}>
            {selectedTime}
          </div>
        </PopoverTrigger>
        <PopoverContent
          className="h-40 w-20 z-50 p-0 border-border overflow-y-auto  scrollbar-hide"
          style={{
            pointerEvents: "auto",
            touchAction: "auto",
            WebkitOverflowScrolling: "touch", // Smooth scrolling on iOS
          }}
        >
          <div
            className="p-1 dark:border-muted flex flex-col items-center scrollbar-hide overflow-x-hidden rounded-md border bg-popover dark:bg-gray-800 text-popover-foreground shadow-md"
            onClick={() => setIsPopoverOpen(false)}
          >
            {generateTimeIntervals().map((time) => (
              <div
                key={time}
                className="w-full sm:text-sm text-xs cursor-pointer dark:hover:bg-card rounded-md justify-start p-1 px-4"
                onClick={() => {
                  setSelectedTime(time);
                }}
              >
                {time}
              </div>
            ))}
          </div>
        </PopoverContent>


      </Popover>
    </div>
  )
}