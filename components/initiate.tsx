"use client";
import { BASE_URL } from "@/lib/config";
import {
  CalendarEventType,
  useCarStore,
  useEventStore,
  useUserStore,
  useWrappedEvent,
  WrappedEvent,
} from "@/lib/store";
import axios from "axios";
import SplashScreen from "./SplashScreen";
import InitiateScreen from "./InitiateScreen";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";

const Initiate = () => {
  const { setName, setImageUrl } = useUserStore();
  const { setCars } = useCarStore();
  const [isLoading, setIsLoading] = useState(true);
  const { setEvents } = useEventStore();
  const [eventsData, setEventsData] = useState<CalendarEventType[]>([]);
  const { setWrappedEvents } = useWrappedEvent();
  const router = useRouter();

  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/v1/me/name`, {
          headers: {
            "Content-type": "application/json",
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setName(res.data.name);
        setImageUrl(res.data.imageUrl);
        const res1 = await axios.get(`${BASE_URL}/api/v1/car/all`, {
          headers: {
            authorization: `Bearer ` + localStorage.getItem("token"),
          },
        });
        setCars(res1.data.cars);
      } catch (error) {
        console.log(error);
        router.push('/login')
      }
    };
    setIsLoading(false);
    fetchData();
  }, [router,setCars,setName,setImageUrl]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/v1/calendar/all`, {
          headers: {
            authorization: `Bearer ` + localStorage.getItem("token"),
          },
        });
        setEventsData(res.data.bookings);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const newWrappedEvents: WrappedEvent[] = [];
    const mappedEvents: CalendarEventType[] = [];
    eventsData.map((event) => {
      const newEvent ={
          id: event.id,
          startDate: dayjs(event.startDate),
          status: event.status,
          startTime: event.startTime,
          endDate: dayjs(event.endDate),
          endTime: event.endTime,
          color: event.color,
          allDay: event.allDay,
          customerName: event.customerName,
          customerContact: event.customerContact,
          carId: event.carId,
          carName: event.carName,
          isAdmin: event.isAdmin,
          }
      mappedEvents.push(newEvent);
      let startDate = newEvent.startDate.startOf("day");
      const endDate = newEvent.endDate.startOf("day");
      let weekEnd = startDate.endOf("week").startOf("day");
      let weekendDuration = weekEnd.diff(startDate, "days");
      let eventDuration = endDate.diff(startDate, "days");
      if (eventDuration < weekendDuration) return;

      //breaking events into multiple rows and adding them to the newWrappedEvents array
      while (!startDate.isAfter(endDate)) {
        startDate = weekEnd.add(1, "day").startOf("day");
        if (startDate.isAfter(endDate)) break;
        weekEnd = startDate.endOf("week").startOf("day");
        weekendDuration = weekEnd.diff(startDate, "days");
        eventDuration = endDate.diff(startDate, "days");
        const endDate1 = weekEnd.isAfter(newEvent.endDate, "day")
          ? newEvent.endDate.startOf("day")
          : weekEnd;
        const isPresent = newWrappedEvents.find((e) =>  (
          e.id === newEvent.id &&
          e.startDate.date() === startDate.date()
        ));

        if(isPresent) continue;
        const wrappedEvent = {
          id: newEvent.id,
          startDate,
          endDate: endDate1
        };
        newWrappedEvents.push(wrappedEvent);
      }
    });


    setWrappedEvents(newWrappedEvents);
    setEvents(mappedEvents);
  }, [eventsData, setEvents,setWrappedEvents]);

  if (!isLoading) return <SplashScreen />;
  return <InitiateScreen />;
};

export default Initiate;
