"use client"
import { BASE_URL } from "@/lib/config";
import { CalendarEventType, useCarStore, useEventStore, useUserStore } from "@/lib/store";
import axios from "axios";
import SplashScreen from "./SplashScreen";
import InitiateScreen from "./InitiateScreen";
import { useEffect, useState } from "react";
import dayjs from "dayjs";

const Initiate = () => {
    const {setName,setImageUrl} = useUserStore();
    const {setCars} = useCarStore();
    const [isLoading, setIsLoading] = useState(true);
    const {setEvents} = useEventStore();
    const [eventsData, setEventsData] = useState<CalendarEventType[]>([]);


    useEffect(() => {
        setIsLoading(true);
        const fetchData = async () => {
                try{
                const res = await axios.get(`${BASE_URL}/api/v1/me/name`,{
                    headers: {
                        "Content-type": "application/json",
                        authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                });
                setName(res.data.name);
                setImageUrl(res.data.imageUrl);
                const res1 = await axios.get(`${BASE_URL}/api/v1/car/all`, {
                    headers: {
                      authorization: `Bearer ` + localStorage.getItem('token')
                      }
                    })
                setCars(res1.data.cars);
                }
                catch(error){
                    console.log(error);
                }
            }
            setIsLoading(false);
            fetchData();
    }, []);
    
      
      useEffect(() => {
        const fetchData = async () => {
          try{
            const res = await axios.get(`${BASE_URL}/api/v1/calendar/all`, {
              headers: {
                authorization: `Bearer ` + localStorage.getItem('token')
                }
              })
              setEventsData(res.data.bookings);
            }
          catch(error){
            console.log(error);
          }
        };
        fetchData();
      }, []);
      
      
      useEffect(() => {
        const mappedEvents: CalendarEventType[] = eventsData.map((event) => ({
          id: event.id,
          startDate: dayjs(event.startDate),
          status: event.status,
          startTime: event.startTime,
          endDate: dayjs(event.endDate),
          endTime: event.endTime,
          color:event.color,
          allDay: event.allDay,
          customerName: event.customerName,
          customerContact: event.customerContact,
          carId: event.carId,
          carName: event.carName,
        }));
    
        setEvents(mappedEvents);
      }, [eventsData, setEvents]);

    if(!isLoading) return <SplashScreen/>
    return <InitiateScreen/>
};

export default Initiate;
