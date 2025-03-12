"use client";
import { BASE_URL } from "@/lib/config";
import {
  CalendarEventType,
  useCarStore,
  useEventStore,
  useServerStore,
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
import ServerLoading from "./server-loading";

const Initiate = () => {
  const { setName, setImageUrl,setUserId } = useUserStore();
  const { setCars } = useCarStore();
  const [isLoading, setIsLoading] = useState(false);
  const { setEvents } = useEventStore();
  const { setWrappedEvents } = useWrappedEvent();
  const router = useRouter();
  const { isServerLoading, setIsServerLoading,isInitiateComplete } = useServerStore();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setIsServerLoading(true);
        const res = await axios.get(`${BASE_URL}/api/v1/me`, {
          headers: {
            "Content-type": "application/json",
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setName(res.data.name);
        console.log("name",res.data.name);
        setImageUrl(res.data.imageUrl);
        setUserId(res.data.id);
        const res1 = await axios.get(`${BASE_URL}/api/v1/car/all`, {
          headers: {
            authorization: `Bearer ` + localStorage.getItem("token"),
          },
        });
        setCars(res1.data.cars);
        const resBook = await axios.get(`${BASE_URL}/api/v1/calendar/all`, {
          headers: {
            authorization: `Bearer ` + localStorage.getItem("token"),
          },
        });
        const newEventsData = resBook.data.bookings;
        const newWrappedEvents: WrappedEvent[] = [];
        const mappedEvents: CalendarEventType[] = [];
        newEventsData.map((event:CalendarEventType) => {
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
        setIsLoading(false);
        setIsServerLoading(false);
      } catch (error) {
        console.log(error);
        router.push('/auth')
        setIsLoading(false);
        setIsServerLoading(false);
      }
    };
    fetchData();
  }, [router,setCars,setName,setImageUrl,setEvents,setWrappedEvents,setIsServerLoading,setUserId]);


  if(isInitiateComplete && isServerLoading) {
    return <ServerLoading />
  } 
  else if (isLoading && !isInitiateComplete){
    return <SplashScreen />
  }  
  return <InitiateScreen />;
};

export default Initiate;
