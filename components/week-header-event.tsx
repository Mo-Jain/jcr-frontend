import { CalendarEventType, useCarStore, useEventRows, useEventStore, useWrappedEvent, WrappedEvent } from "@/lib/store";
import { cn } from "@/lib/utils";
import dayjs, { Dayjs } from "dayjs";
import React, { useEffect, useState } from "react"
import { useMediaQuery } from "react-responsive";

const HeaderEvent = ({index,date,today,isEventHidden}:{index:number,date:Dayjs,today:boolean,isEventHidden:boolean}) => {
    const { openEventSummary } = useEventStore();
    const { events } = useEventStore();
    const currentDate = date.startOf("day");
    const [sortedEvents, setSortedEvents] = useState<CalendarEventType[]>([]);
    const [isWrapped, setIsWrapped] = useState<boolean>(false);
    const [emptyRows,setEmptyRows] = useState<number[]>([0,1,2,3,4,5,6,7,8,9]);
    const {eventsRow} = useEventRows();
    const {wrappedEvents} = useWrappedEvent();
    const [noOfEvents,setNoOfEvents] = useState(0);
    const isSmallScreen = useMediaQuery({ query: '(max-width: 640px)' });
    const {cars} = useCarStore();

    useEffect(() => {
      Initialize();
    }, [date,events]);
        
    const Initialize = () => {
      const filteredEvents = events.filter((event: CalendarEventType) => {
        return dayjs(event.startDate).isSame(date,"days") && event.endDate.isAfter(date,"days");
      });
        
      const currentDate = date.startOf("day");
      const extendedEvents = events.filter((event) => {
        const eventStart = dayjs(event.startDate).startOf("day");
        const eventEnd = dayjs(event.endDate).startOf("day");
        return (eventStart.isBefore(currentDate) && eventEnd.isSame(currentDate))
        || (eventStart.isBefore(currentDate) && eventEnd.isAfter(currentDate));
      });

      const newSortedEvents = [...filteredEvents].sort((a, b) => {
        const durationA = dayjs(a.endDate).diff(dayjs(a.startDate), "minute"); // Get duration in minutes
        const durationB = dayjs(b.endDate).diff(dayjs(b.startDate), "minute");
        return durationB - durationA; // Sort in descending order (longest first)
      });

      setSortedEvents(newSortedEvents);
      
      const filledRows:number[] = [];
      let index=0;
      extendedEvents.forEach((event) => {
        const eventRow = eventsRow?.find(e => e.id === event.id);
        //find eventRow in wrappedEvents
        if(!eventRow) return;
        const wrappedEvent = wrappedEvents?.find(e => e.id === eventRow?.id);
        if(wrappedEvent){
            if((dayjs(wrappedEvent.startDate).isBefore(date,"day") && dayjs(wrappedEvent.endDate).isAfter(date,"day"))|| dayjs(wrappedEvent.endDate).isSame(date,"day") || dayjs(wrappedEvent.startDate).isSame(date,"day") ){
              if(dayjs(wrappedEvent.startDate).isSame(date,"day")){
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

      setNoOfEvents(filledRows.length);
  
      const rows=  [0,1,2,3,4,5,6,7,8,9]
      const newEmptyRows = rows.filter(row => !filledRows.includes(row));
      setEmptyRows(newEmptyRows);
    }

    const findOffset  = (index:number,event:CalendarEventType | WrappedEvent,isWrap:boolean=false) => {
      const weekEnd = dayjs(event.startDate).endOf("week");
      const weekendDuration = weekEnd.diff(dayjs(event.startDate), "days")+1;
      const eventDuration = dayjs(event.endDate).diff(dayjs(event.startDate), "days")+1;
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

      const singleEventWidth =  "100%";
      
      let width = `calc(${singleEventWidth} * ${Math.min(eventDuration, weekendDuration)} - 1px)`;
      let marginTop = `${isSmallScreen ? cnt * 13 : cnt * 19}px`;
      if(isWrap){
        width=`calc(${singleEventWidth}*${eventDuration} - 1px)`
        marginTop = "0"
      }
      // width = "100%"
      return {width,marginTop};
    }

    const renderEvent = (event: CalendarEventType, index: number, width: string, marginTop: string | number) => {
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
            minWidth:"30px",
            backgroundColor: car?.colorOfBooking
          }}
          className={cn(
            "my-[1px] max-sm:h-[12px] h-[18px] w-full flex items-center justify-center cursor-pointer rounded-[3px] sm:rounded-sm bg-[#039BE5] text-[7px] sm:text-xs text-white overflow-hidden whitespace-nowrap",
            isSmallScreen ? "text-[9px]" : "px-2 text-[12px]"
          )}
        >
          <span className="truncate">{event.id + " : " + event.carName}</span>
        </div>
      );
    };
  
    return (
      <div key={index} className="flex flex-col min-w-[30px] items-center justify-start w-full">
        <div className={cn("text-xs mt-6 sm:mt-8", today && "text-blue-600")}>
          {currentDate.format("ddd")}
        </div>
        <div
          className={cn(
            "h-8 w-8 sm:h-10 sm:w-10 text-center flex items-center rounded-full p-2 text-sm sm:text-lg",
            today && "bg-blue-600 text-white min-w-[30px]"
          )}
        >
          {currentDate.format("DD")}{" "}
        </div>
        <div
          className="flex flex-col w-full min-h-[39px] sm:min-h-[57px] transition-all duration-500 ease-in-out"
          style={{ maxHeight: isEventHidden ? "40px sm:60px" : "" }}
        >
          
          {noOfEvents+sortedEvents.length < 4 || !isEventHidden ? (
            <>
            {wrappedEvents?.map((e, index) => {
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
              {wrappedEvents?.slice(0, 2).map((e, index) => {
              const event = events.find((event) => event.id === e.id);
              if (!event || !e.startDate.isSame(date, "day")) return null;
                const { width, marginTop } = findOffset(index, e, true);
                return renderEvent(event, index, width, marginTop);
              })}
              {sortedEvents.slice(0, 2-noOfEvents | 0).map((event, index) => {
                const { width, marginTop } = findOffset(index, event);
                return renderEvent(event, index, width, marginTop);
              })}
            </>
          )}
        </div>
        {noOfEvents+sortedEvents.length >= 4 && isEventHidden &&
          <div  className="text-xs sm:text-sm px-2">+{noOfEvents+sortedEvents.length-2}</div>}
      </div>
    );
  };
  
  export default HeaderEvent;