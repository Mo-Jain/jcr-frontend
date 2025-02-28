import {
  CalendarEventType,
  useCarStore,
  useDateStore,
  useEventStore,
} from "@/lib/store";
import dayjs, { Dayjs } from "dayjs";
import React, { useEffect, useState } from "react";

const DayHeaderEvent = ({ isEventHidden }: { isEventHidden: boolean }) => {
  const [headerEvents, setHeaderEvents] = useState<CalendarEventType[]>([]);
  const { openEventSummary } = useEventStore();
  const { cars } = useCarStore();
  const { userSelectedDate } = useDateStore();
  const { events } = useEventStore();
  const [noOfEvents, setNoOfEvents] = useState<number>(1);

  useEffect(() => {
    getAllDayEvents(events, userSelectedDate);
  }, [events, userSelectedDate]);

  const getAllDayEvents = (events: CalendarEventType[], date: Dayjs) => {
    const tempEvents = events.filter((event: CalendarEventType) => {
      return (
        (dayjs(event.startDate).isBefore(date, "days") &&
          dayjs(event.endDate).isAfter(date, "days")) ||
        (dayjs(event.startDate).isSame(date, "days") &&
          dayjs(event.endDate).isAfter(date, "days")) ||
        (dayjs(event.startDate).isBefore(date, "days") &&
          dayjs(event.endDate).isSame(date, "days")) ||
        event.allDay
      );
    });
    setNoOfEvents(tempEvents.length);
    setHeaderEvents(tempEvents);
  };

  const renderEvent = (event: CalendarEventType) => {
    const eventDuration =
      dayjs(event.endDate).diff(dayjs(event.startDate), "days") + 1;
    const currentDuration =
      userSelectedDate.diff(dayjs(event.startDate), "days") + 1;
    const car = cars.find((car) => car.id === event.carId);
    return (
      <div
        key={event.id}
        onClick={(e) => {
          e.stopPropagation();
          openEventSummary(event);
        }}
        style={{ backgroundColor: car?.colorOfBooking }}
        className={` my-[1px] w-full flex justify-center items-center cursor-pointer rounded-sm bg-[#039BE5]
            text-xs text-white`}
      >
        {event.id + " : " + event.carName} {"("} {currentDuration} /{" "}
        {eventDuration} {")"}
      </div>
    );
  };

  return (
    <div className="flex flex-col w-full h-fit">
      {noOfEvents < 4 || !isEventHidden ? (
        <>
          {headerEvents.map((event) => {
            return renderEvent(event);
          })}
        </>
      ) : (
        <>
          {headerEvents.slice(0, 3).map((event) => {
            return renderEvent(event);
          })}
          <div className="text-xs sm:text-sm px-2">+{noOfEvents - 3}</div>
        </>
      )}
    </div>
  );
};

export default DayHeaderEvent;
