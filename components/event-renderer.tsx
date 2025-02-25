"use client";
import { CalendarEventType, useCarStore, useEventRows, useEventStore, useWrappedEvent, WrappedEvent } from "@/lib/store";
import dayjs from "dayjs";
import React, {  useEffect, useState } from "react";
import { useMediaQuery } from 'react-responsive';

interface EventRendererProps  {
  date: dayjs.Dayjs;
  view: "month" | "week" | "day";
  events: CalendarEventType[];
  hour?: number;
};

export function EventRenderer({ date, view, events, hour}: EventRendererProps) {
  const { openEventSummary } = useEventStore();
  const isSmallScreen = useMediaQuery({ query: '(max-width: 640px)' });
  const [emptyRows,setEmptyRows] = useState<number[]>([0,1,2,3,4]);
  const [isWrapped, setIsWrapped] = useState<boolean>(false);
  const [sortedEvents, setSortedEvents] = useState<CalendarEventType[]>([]);
  const {eventsRow,setEventsRow} = useEventRows();
  const {wrappedEvents,setWrappedEvents} = useWrappedEvent();
  const {cars} = useCarStore();

  useEffect(() => {
    Initialize();
  }, [date,events]);


  const noOfEvents = emptyRows.length -  sortedEvents.length;

  const Initialize = () => {

    let filteredEvents = events.filter((event: CalendarEventType) => {
      if (view === "month") {
        return dayjs(event.startDate).format("DD-MM-YY") === date.format("DD-MM-YY");
      } else if (view === "week" || view === "day") {
        return dayjs(event.startDate).hour() === hour && !event.allDay;
      }
      return false;
    });
    

    filteredEvents = filteredEvents.map((event) => {
              return (
                {
                  ...event,
                  startDate:dayjs(event.startDate),
                  endDate:dayjs(event.endDate)
                }
              )
            })
    
    const newSortedEvents = [...filteredEvents].sort((a, b) => {
      const durationA = a.endDate.diff(a.startDate, "minute"); // Get duration in minutes
      const durationB = b.endDate.diff(b.startDate, "minute");
      return durationB - durationA; // Sort in descending order (longest first)
    });

    setSortedEvents(newSortedEvents);

    const newWrappedEvents = wrappedEvents || [];
    newSortedEvents.forEach((event) => {
      const newEventsRow = eventsRow || [];
      const isPresent = newEventsRow.find(e => e.id === event.id);
      let startDate = event.startDate.startOf("day");
      const endDate = event.endDate.startOf("day");
      let weekEnd = startDate.endOf("week").startOf("day");
      let weekendDuration = weekEnd.diff(startDate, "days");
      let eventDuration = endDate.diff(startDate, "days");
      if(eventDuration < weekendDuration || isPresent ) return;

      while (!startDate.isAfter(endDate)) {
        startDate = weekEnd.add(1, "day").startOf("day");
        if(startDate.isAfter(endDate)) break;
        weekEnd = startDate.endOf("week").startOf("day");
        weekendDuration = weekEnd.diff(startDate, "days");
        eventDuration = endDate.diff(startDate, "days");
        const endDate1 = weekEnd.isAfter(event.endDate,"day") 
                  ? event.endDate.startOf("day") 
                  : weekEnd;
    
        newWrappedEvents.push({ id: event.id, startDate, endDate: endDate1 });
      }
    });
        
    if(setWrappedEvents) setWrappedEvents(newWrappedEvents);
    const currentDate = date.startOf("day");

    const extendedEvents = events.filter((event) => {
      const eventStart = dayjs(event.startDate).startOf("day");
      const eventEnd = dayjs(event.endDate).startOf("day");
      return (eventStart.isBefore(currentDate) && eventEnd.isSame(currentDate))
      || (eventStart.isBefore(currentDate) && eventEnd.isAfter(currentDate));
    });

    const filledRows:number[] = [];
    let index=0;
    extendedEvents.forEach((event) => {
      const eventRow = eventsRow?.find(e => e.id === event.id);
      //find eventRow in wrappedEvents
      if(!eventRow) return;
      const wrappedEvent = wrappedEvents?.find(e => e.id === eventRow?.id);
      if(wrappedEvent){
        if((wrappedEvent.startDate.isBefore(date,"day") && wrappedEvent.endDate.isAfter(date,"day"))|| wrappedEvent.endDate.isSame(date,"day") || wrappedEvent.startDate.isSame(date,"day") ){
          if(wrappedEvent.startDate.isSame(date,"day")){
            setIsWrapped(true);
          }
          filledRows.push(index);
          index++;
        }
        else{
          filledRows.push(eventRow.rowIndex);
        }
      }
      else{
        filledRows.push(eventRow.rowIndex);
      }
    });

    const rows=  [0,1,2,3,4]
    const newEmptyRows = rows.filter(row => !filledRows.includes(row));
    setEmptyRows(()=>{
      return newEmptyRows;
    });

    index = 0;
    const newEventsRow = eventsRow || [];
    newSortedEvents.forEach((event) => {
      if (event.startDate.isSame(date, "day") && event.endDate.isAfter(date, "day")) {
        newEventsRow.push({ id: event.id, rowIndex: newEmptyRows[index] });
        index++;
      }
    });

    if(setEventsRow) setEventsRow(newEventsRow);    
  };

  const renderEvent = (event:CalendarEventType,index:number,width:string,marginTop:string|number) => {
    const car = cars.find(car => car.id === event.carId);

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
          backgroundColor: car?.colorOfBooking,
        }}
        className={`z-10 line-clamp-1 my-[1px] bg-[#039BE5] max-sm:h-[12px] h-[18px] flex justify-start 
          items-center cursor-pointer rounded-sm  font-semibold p-[1px] text-[7px] 
          sm:text-xs text-white whitespace-nowrap overflow-ellipsis`}
      >
        {event.id + " : " + event.carName}
      </div>
    );
  }

  const findOffset  = (index:number,event:CalendarEventType | WrappedEvent,isWrap:boolean=false) => {
    const weekEnd = event.startDate.endOf("week");
    const weekendDuration = weekEnd.diff(event.startDate, "days")+1;
    const eventDuration = event.endDate.diff(event.startDate, "days")+1;
    let temp = emptyRows[index];
    let cnt = 0;
    while(temp > 0){
      if(index==0){
        cnt = temp;
        break;
      }
      temp--;
      if(emptyRows[index-1] == temp) break;
      cnt++;
    }

    if(index==0 && isWrapped){
      cnt = 0;
    }
    
    let width = `calc((100% + 2px) * ${Math.min(eventDuration, weekendDuration)} - 1px)`;;
    let marginTop = `${isSmallScreen ? cnt * 13 : cnt * 19}px`;
    if(isWrap){
      width=`calc((100% + 2px)*${eventDuration} - 1px)`
      marginTop = "0"
    }
    return {width,marginTop};
  }



  return (
    <div
      className={` w-full relative flex flex-col justify-center h-full ${
        view === "month" ? "flex flex-col" : "flex"
      }`}
    >
      {view === "month" &&
        <>
        {
          wrappedEvents?.map((e,index) => {
              // return null;
              const event = events.find((event) => event.id === e.id);
              if(!event || !e.startDate.isSame(date,"day")) return null;
              const {width,marginTop} = findOffset(index,e,true);
              return renderEvent(event,index,width,marginTop);
          })
        }
        
        {noOfEvents>=0 ?
          <> 
            {sortedEvents.map((event, index) => {
              const {width,marginTop} = findOffset(index,event);
              return renderEvent(event,index,width,marginTop);
              })}
          </>
          :
          <>
            {sortedEvents.slice(0, emptyRows.length-1).map((event, index) => {
              //find difference in number of days between start and end date
              const {width,marginTop} = findOffset(index,event);
              return renderEvent(event,index,width,marginTop);
              })}
            <div
              className="z-10 line-clamp-1 h-[18px] max-sm:h-[12px] w-full m-0 flex justify-start 
                items-center cursor-pointer rounded-sm hover:bg-gray-300 dark:hover:bg-gray-700 text-[7px] font-semibold sm:text-xs p-[2px]
                text-gray-700 dark:text-gray-300 px-1"
              onClick={(e) => {
                e.stopPropagation();
                // Add logic to open a modal or show more events for the day
              }}
            >
              {`${noOfEvents*(-1)+1} more`}
            </div>
          </>
        }
      
      </>
        }
      {view !== "month" &&
        sortedEvents.map((event, index) => {
          // For week and day views, calculate height, width, and positioning
          const start = dayjs(
            `${dayjs(event.startDate).format("YYYY-MM-DD")} ${event.startTime}`,
            "YYYY-MM-DD HH:mm"
          );
          const end = dayjs(
            `${dayjs(event.startDate).format("YYYY-MM-DD")} ${event.endTime}`,
            "YYYY-MM-DD HH:mm"
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
          const car = cars.find(car => car.id === event.carId);
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
                backgroundColor: car?.colorOfBooking
              }}
              className={`absolute z-10 mx-[1px] line-clamp-1 max-sm:h-[12px] m-0 flex justify-start 
                 cursor-pointer flex-wrap rounded-sm bg-[#039BE5] p-[2px] text-[7px] 
                sm:text-sm text-white`}
            >
              {noOfEvents < 3 || view === "day" ? event.id + " : " + event.carName : ""}
            </div>
          );
        })}
    </div>
  );
}
