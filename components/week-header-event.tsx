import {
  CalendarEventType,
  useCarStore,
  useEventRows,
  useEventStore,
  useWrappedEvent,
  WrappedEvent,
} from "@/lib/store";
import { cn } from "@/lib/utils";
import dayjs, { Dayjs } from "dayjs";
import React, { useCallback, useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";

const HeaderEvent = ({
  index,
  date,
  today,
  isEventHidden,
}: {
  index: number;
  date: Dayjs;
  today: boolean;
  isEventHidden: boolean;
}) => {
  const { openEventSummary } = useEventStore();
  const { events } = useEventStore();
  const currentDate = date.startOf("day");
  const [sortedEvents, setSortedEvents] = useState<CalendarEventType[]>([]);
  const [isWrapped, setIsWrapped] = useState<boolean>(false);
  const [emptyRows, setEmptyRows] = useState<number[]>([
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
  ]);
  const { eventsRow } = useEventRows();
  const { wrappedEvents } = useWrappedEvent();
  const [noOfEvents, setNoOfEvents] = useState(0);
  const isSmallScreen = useMediaQuery({ query: "(max-width: 640px)" });
  const { cars } = useCarStore();
  const [currWrappedEvents,setCurrWrappedEvents] = useState<WrappedEvent[]>([]);
  const [extendedEvents,setExtendedEvents] = useState<CalendarEventType[]>([]);

  const Initialize = useCallback(() => {
    const filteredEvents = events.filter((event: CalendarEventType) => {
      return (
        dayjs(event.startDate).isSame(date, "days") &&
        event.endDate.isAfter(date, "days")
      );
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

    setExtendedEvents(newExtendedEvents);
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

    newCurrWrappedEvents = newCurrWrappedEvents.sort((a, b) => {
      const durationA = a.endDate.diff(a.startDate, "minute"); // Get duration in minutes
      const durationB = b.endDate.diff(b.startDate, "minute");
      return durationB - durationA; // Sort in descending order (longest first)
    });
    setCurrWrappedEvents(newCurrWrappedEvents);


    const rows = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    const newEmptyRows = rows.filter((row) => !filledRows.includes(row));
    setNoOfEvents(newExtendedEvents.length + newSortedEvents.length);
    setEmptyRows(newEmptyRows);
  },[date, events,eventsRow,wrappedEvents]);

  useEffect(() => {
    Initialize();
  }, [Initialize]);

  const findOffset = (
    index: number,
    event: CalendarEventType | WrappedEvent,
    isWrap: boolean = false,
  ) => {
    const weekEnd = dayjs(event.startDate).endOf("week");
    const weekendDuration = weekEnd.diff(dayjs(event.startDate), "days") + 1;
    const eventDuration =
      dayjs(event.endDate).diff(dayjs(event.startDate), "days") + 1;
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

    if (index == 0 && isWrapped) {
      cnt = 0;
    }

    const singleEventWidth = "100%";

    let width = `calc(${singleEventWidth} * ${Math.min(eventDuration, weekendDuration)} - 1px)`;
    let marginTop = `${cnt * 19}px`;
    if (isWrap) {
      width = `calc(${singleEventWidth}*${eventDuration} - 1px)`;
      marginTop = "0";
    }
    // width = "100%"
    return { width, marginTop };
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
        key={event.id}
        onClick={(e) => {
          e.stopPropagation();
          openEventSummary(event);
        }}
        style={{
          width,
          marginTop,
          minWidth: "30px",
          backgroundColor: car?.colorOfBooking,
        }}
        className={cn(
          "my-[1px]  h-[18px] w-full flex items-center justify-center cursor-pointer rounded-[3px] sm:rounded-sm bg-[#039BE5] text-[8px] sm:text-xs text-white overflow-hidden whitespace-nowrap",
          isSmallScreen ? "" : "px-2 ",
        )}
      >
        <span className="truncate">{event.id + " : " + event.carName}</span>
      </div>
    );
  };

  return (
    <div
      key={index}
      className="flex flex-col min-w-[30px] h-fit tnansition-all duration-300 ease-in-out items-center justify-start w-full"
    >
      <div className={cn("text-xs mt-6 sm:mt-8", today && "text-blue-600")}>
        {currentDate.format("ddd")}
      </div>
      <div
        className={cn(
          "h-8 w-8 sm:h-10 sm:w-10 text-center flex items-center rounded-full p-2 text-sm sm:text-lg",
          today && "bg-blue-600 text-white min-w-[30px]",
        )}
      >
        {currentDate.format("DD")}{" "}
      </div>
      <div
        className="flex flex-col w-full min-h-[39px] sm:min-h-[57px] transition-all duration-500 ease-in-out"
        style={{ maxHeight: isEventHidden ? "40px sm:60px" : "" }}
      >
        {noOfEvents  < 4 || !isEventHidden ? (
          <>
            {currWrappedEvents?.map((e, index) => {
              const event = events.find((event) => event.id === e.id);
              if (!event || !e.startDate.isSame(date, "day")) return null;
              const { width, marginTop } = findOffset(index, e, true);
              return renderEvent(event, index, width, marginTop);
            })}
            {sortedEvents.map((event, index) => {
              const { width, marginTop } = findOffset(index, event);
              return renderEvent(event, index, width, marginTop);
            })}
          </>
        ) : (
          <>
            {currWrappedEvents.slice(0,2).map((e, index) => {
              const event = events.find((event) => event.id === e.id);
              if (!event || !e.startDate.isSame(date, "day")) return null;

              const { width, marginTop } = findOffset(index, e, true);
              return renderEvent(event, index, width, marginTop);
            })}
            {sortedEvents.slice(0, (2 - extendedEvents.length) | 0).map((event, index) => {
              const { width, marginTop } = findOffset(index, event);
              return renderEvent(event, index, width, marginTop);
            })}
          </>
        )}
      </div>
      {!(noOfEvents  < 4 || !isEventHidden) && (
        <div className="text-xs sm:text-sm px-2">
          +{noOfEvents - 2}
        </div>
      )}
    </div>
  );
};

export default HeaderEvent;
