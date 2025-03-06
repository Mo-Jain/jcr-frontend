import { CalendarEventType, useCarStore, useEventStore } from "@/lib/store";
import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";

const EventDialog = ({
  events,
  date,
  setIsOpenEventDialog,
}: {
  events: CalendarEventType[];
  date: dayjs.Dayjs;
  setIsOpenEventDialog: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { cars } = useCarStore();
  const { openEventSummary } = useEventStore();
  const [newDate, setNewDate] = useState<dayjs.Dayjs>(date);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setNewDate(date);
  }, [date]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dialogRef.current && !dialogRef.current.contains(event.target as Node)) {
        setIsOpenEventDialog(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setIsOpenEventDialog]);

  const renderEvent = (event: CalendarEventType) => {
    const car = cars.find((car) => car.id === event.carId);
    return (
      <div
        key={event.id}
        onClick={(e) => {
          e.stopPropagation();
          openEventSummary(event);
        }}
        style={{ backgroundColor: car?.colorOfBooking }}
        className="my-[1px] w-full flex whitespace-nowrap overflow-hidden 
                text-ellipses p-1 cursor-pointer rounded-sm bg-[#039BE5]
                text-xs text-white"
      >
        {event.id + " : " + event.carName}
      </div>
    );
  };

  if (!newDate) return null;
  
  return (
    <>
    <div className="fixed top-0 left-0 w-full h-full z-10"/>
    <div
      ref={dialogRef}
      className="bg-card backdrop-blur-lg z-20 absolute shadow-lg shadow-gray-500 dark:shadow-black  p-1 pb-4 w-[250%] sm:w-[130%] h-fit top-[-45%] left-[-75%] sm:left-[-15%] rounded-xl flex flex-col items-center"
    >
      <div className="text-black dark:text-white">
        <p className="text-center text-xs sm:text-sm">{newDate.format("ddd").toUpperCase()}</p>
        <p className="text-center text-md sm:text-lg">{newDate.date()}</p>
      </div>
      {events.map((event) => renderEvent(event))}
    </div>
    </>
  );
};

export default EventDialog;
