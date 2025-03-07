"use client";
import {
  CalendarEventType,
  useCarStore,
  useEventRows,
  useEventStore,
  useWrappedEvent,
  WrappedEvent,
} from "@/lib/store";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";

interface EventRendererProps {
  date: dayjs.Dayjs;
  view: "month" | "week" | "day";
  events: CalendarEventType[];
  hour?: number;
  setAllEvents?: React.Dispatch<React.SetStateAction<CalendarEventType[]>>;
  setIsOpenEventDialog?: React.Dispatch<React.SetStateAction<boolean>>;
}

export function EventRenderer({
  date,
  view,
  events,
  hour,
  setAllEvents,
  setIsOpenEventDialog
}: EventRendererProps) {
  const { openEventSummary } = useEventStore();
  const [emptyRows, setEmptyRows] = useState<number[]>([0, 1, 2, 3, 4]);
  const [isWrapped, setIsWrapped] = useState<boolean>(false);
  const [sortedEvents, setSortedEvents] = useState<CalendarEventType[]>([]);
  const { eventsRow, setEventsRow } = useEventRows();
  const { wrappedEvents } = useWrappedEvent();
  const { cars } = useCarStore();
  const [currWrappedEvents,setCurrWrappedEvents] = useState<WrappedEvent[]>([]);
  const [noOfEvents, setNoOfEvents] = useState(0);

  
  useEffect(() => {
    Initialize();
  }, [date,events]);


  const Initialize = () => {
    let filteredEvents = events.filter((event: CalendarEventType) => {
      if (view === "month") {
        return (
          dayjs(event.startDate).format("DD-MM-YY") === date.format("DD-MM-YY")
        );
      } else if (view === "week" || view === "day") {
        return dayjs(event.startDate).hour() === hour && !event.allDay;
      }
      return false;
    });

    filteredEvents = filteredEvents.map((event) => {
      return {
        ...event,
        startDate: dayjs(event.startDate),
        endDate: dayjs(event.endDate),
      };
    });

    const newSortedEvents = [...filteredEvents].sort((a, b) => {
      const durationA = a.endDate.diff(a.startDate, "minute"); // Get duration in minutes
      const durationB = b.endDate.diff(b.startDate, "minute");
      return durationB - durationA; // Sort in descending order (longest first)
    });

    setSortedEvents(newSortedEvents);

    const currentDate = date.startOf("day");

    const newExtendedEvents = events.filter((event) => {
      const eventStart = dayjs(event.startDate).startOf("day");
      const eventEnd = dayjs(event.endDate).startOf("day");
      return (
        (eventStart.isBefore(currentDate) && eventEnd.isSame(currentDate)) ||
        (eventStart.isBefore(currentDate) && eventEnd.isAfter(currentDate))
      );
    });

    const filledRows: number[] = [];
    let index = 0;
    let newCurrWrappedEvents: WrappedEvent[] = [];
    newExtendedEvents.forEach((event) => {
      const eventRow = eventsRow?.find((e) => e.id === event.id);
      
      //find eventRow in wrappedEvents
      const weekStart = date.startOf("week");
      const wrappedEvent  = wrappedEvents?.find((e) => {
        return (
          (e.startDate.isSame(weekStart, "day") &&
          (e.endDate.isSame(date, "day") || 
          e.endDate.isAfter(date, "day")))&&
          e.id === event.id
        )
      });
      if(wrappedEvent){
        newCurrWrappedEvents.push(wrappedEvent);
      }
      if (wrappedEvent || !eventRow) {
        //check if the wrapped event start today so that its top margin should be zero else it would count the margin for itself
        if (wrappedEvent && wrappedEvent.startDate.isSame(date, "day")) {
          setIsWrapped(true);
        }
        filledRows.push(index);
        index++;
      } else {
        filledRows.push(eventRow.rowIndex);
      }
    });

    if(setAllEvents) setAllEvents([...newExtendedEvents,...newSortedEvents,])

    const rows = [0, 1, 2, 3, 4];
    const newEmptyRows = rows.filter((row) => !filledRows.includes(row));
    setEmptyRows(() => {
      return newEmptyRows;
    });

    index = 0;
    const newEventsRow = eventsRow || [];
    newSortedEvents.forEach((event) => {
      if (
        event.startDate.isSame(date, "day") &&
        event.endDate.isAfter(date, "day")
      ) {
        const isPresent = newEventsRow.find((e) => e.id === event.id);
        if (!isPresent) {
          newEventsRow.push({ id: event.id, rowIndex: newEmptyRows[index] });
          index++;
        }
      }
    });

    newCurrWrappedEvents = newCurrWrappedEvents.sort((a, b) => {
      const durationA = a.endDate.diff(a.startDate, "minute"); // Get duration in minutes
      const durationB = b.endDate.diff(b.startDate, "minute");
      return durationB - durationA; // Sort in descending order (longest first)
    });
    setNoOfEvents(newExtendedEvents.length + newSortedEvents.length);

    setCurrWrappedEvents(newCurrWrappedEvents);
    if (setEventsRow) setEventsRow(newEventsRow);
  };

  const renderEvent = (
    event: CalendarEventType,
    index: number,
    width: string,
    marginTop: string | number,
  ) => {
    const car = cars.find((car) => car.id === event.carId);

    return (
      <div
        key={index}
        onClick={(e) => {
          e.stopPropagation();
          openEventSummary(event);
        }}
        style={{
          width,
          marginTop,
          backgroundColor: car?.colorOfBooking,
        }}
        className={`z-10 line-clamp-1 mb-[1px] bg-[#039BE5] max-sm:h-fit h-[18px] flex justify-start 
          items-center cursor-pointer font-semibold max-sm:p-[2.2px] p-[1px]
           rounded-[3px] sm:rounded-sm bg-[#039BE5] text-[9px] sm:text-xs text-white whitespace-nowrap overflow-ellipsis`}
      >
        {event.id + " : " + event.carName}
      </div>
    );
  };

  const getTopMargin = (index: number) => {
    let temp = emptyRows[index];
    let cnt = 0;
    while (temp > 0) {
      if (index == 0) {
        cnt = temp;
        break;
      }
      temp--;
      if (emptyRows[index - 1] == temp) break;
      cnt++;
    }
    if(emptyRows.length == 0 && sortedEvents.length === 0){
      cnt =4;
    }
    

    if (index == 0 && isWrapped) {
      cnt = 0;
    }

    return `${ cnt*19}px`;
  }

  const handleClickMore = (e:React.MouseEvent) => {
    if(setIsOpenEventDialog){
        e.stopPropagation();
        setIsOpenEventDialog(true);
    }
  }

  const findOffset = (
    index: number,
    event: CalendarEventType | WrappedEvent,
    isWrap: boolean = false,
  ) => {
    const weekEnd = event.startDate.endOf("week");
    const weekendDuration = weekEnd.diff(event.startDate, "days") + 1;
    const eventDuration = event.endDate.diff(event.startDate, "days") + 1;
    
    let width = `calc((100% + 1.5px) * ${Math.min(eventDuration, weekendDuration)} - 1px)`;
    let marginTop = getTopMargin(index);
    if (isWrap) {
      width = `calc((100% + 1.5px)*${eventDuration} - 1px)`;
      marginTop = "0";
    }
    return { width, marginTop };
  };

  return (
    <div
      className={` w-full relative flex flex-col justify-center h-full ${
        view === "month" ? "flex flex-col" : "flex"
      }`}
    >
      
      {view === "month" && (
        <>
          {currWrappedEvents.slice(0,currWrappedEvents.length > 5 ? 4 : currWrappedEvents.length)?.map((e, index) => {
            // return null;
            const event = events.find((event) => event.id === e.id);
            if (!event || !e.startDate.isSame(date, "day")) return null;
            const { width, marginTop } = findOffset(index, e, true);
            return renderEvent(event, index, width, marginTop);
          })}

          {noOfEvents <= 5 ? (
            <>
              {sortedEvents.map((event, index) => {
                const { width, marginTop } = findOffset(index, event);
                return renderEvent(event, index, width, marginTop);
              })}
            </>
          ) : (
            <>
              {currWrappedEvents.length < 4 &&
                <>
              {sortedEvents
                .slice(0, emptyRows.length - 1)
                .map((event, index) => {
                  //find difference in number of days between start and end date
                  const { width, marginTop } = findOffset(index, event);
                  return renderEvent(event, index, width, marginTop);
                })}
                </>}
              <div
                style={{marginTop: getTopMargin(emptyRows.length - 1)}}
                className={`z-10 line-clamp-1 mb-[1px] max-sm:h-fit h-[18px] flex justify-start 
                  items-center cursor-pointer font-semibold max-sm:p-[2.2px] p-[1px]
                   rounded-[3px] sm:rounded-sm text-[9px] sm:text-xs hover:bg-gray-300 dark:hover:bg-zinc-700 text-zinc-700 dark:text-gray-300 whitespace-nowrap overflow-ellipsis`}
              
                
                onClick={handleClickMore}
              >
                {`${noOfEvents -4} more`}
              </div>
            </>
          )}
        </>
      )}
      {view !== "month" &&
        sortedEvents.map((event, index) => {
          // For week and day views, calculate height, width, and positioning
          const start = dayjs(
            `${dayjs(event.startDate).format("YYYY-MM-DD")} ${event.startTime}`,
            "YYYY-MM-DD HH:mm",
          );
          const end = dayjs(
            `${dayjs(event.startDate).format("YYYY-MM-DD")} ${event.endTime}`,
            "YYYY-MM-DD HH:mm",
          );
          const noOfEvents = sortedEvents.length;
          const durationInMinutes = end.diff(start, "minute");
          const heightFactor = 16 / 60; // 16px for 1 hour
          const dynamicHeight = durationInMinutes * heightFactor * 4; // 1 hour = 64px
          const startMinutes = start.hour() * 60 + start.minute(); // Total minutes since midnight

          // Calculate total available width and width per event
          const totalGap = (noOfEvents - 1) * 1; // Total gap space
          const availableWidth = 97 - totalGap; // Remaining width for events
          const eventWidth = `${availableWidth / noOfEvents}%`;
          const leftOffset = `calc(${index} * (${availableWidth / noOfEvents}% + 1px))`; // Adjust position for gaps
          const car = cars.find((car) => car.id === event.carId);
          const topOffset = (startMinutes / 60) * 64; // Calculate the top position in pixels

          return (
            <div
              key={event.id}
              onClick={(e) => {
                e.stopPropagation();
                openEventSummary(event);
              }}
              style={{
                height: `${dynamicHeight}px`,
                width: eventWidth,
                left: leftOffset,
                top: topOffset,
                backgroundColor: car?.colorOfBooking,
              }}
              className={`absolute z-10 mx-[1px] line-clamp-1 max-sm:h-[12px] m-0 flex justify-start 
                 cursor-pointer flex-wrap rounded-sm bg-[#039BE5] p-[2px] text-[7px] 
                sm:text-sm text-white`}
            >
              {noOfEvents < 3 || view === "day"
                ? event.id + " : " + event.carName
                : ""}
            </div>
          );
        })}
    </div>
  );
}
