"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useEventStore, type CalendarEventType } from "@/lib/store";
import { Input } from "@/components/ui/input";
import dayjs from "dayjs";
import { Clock, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { DatePicker } from "@/components/ui/datepicker";
import AddTime from "./add-time";
import CarFrontIcon from "@/public/car-front.svg";
import UserIcon from "@/public/user.svg";
import axios from "axios";
import { BASE_URL } from "@/lib/config";
import { toast } from "@/hooks/use-toast";
import { DialogDescription } from "@radix-ui/react-dialog";

enum Status {
  pending = "pending",
  confirmed = "confirmed",
  cancelled = "cancelled",
  inProgress = "inProgress",
  completed = "completed",
}
export const BookingStatusIcon = ({
  status,
  className,
}: {
  status?: Status;
  className?: string;
}) => {
  const statusIcons = {
    pending: <Clock className={`text-yellow-500 ${className}`} />,
    confirmed: <CheckCircle className={`text-green-500 ${className}`} />,
    cancelled: <XCircle className={`text-red-500 ${className}`} />,
    inProgress: (
      <Loader2 className={`text-blue-500 animate-spin ${className}`} />
    ),
    completed: <CheckCircle className={`text-green-500 ${className}`} />,
  };

  return status ? (
    statusIcons[status]
  ) : (
    <Clock className={`text-gray-500 ${className}`} />
  );
};
interface EventSummaryPopupProps {
  event: CalendarEventType;
  isOpen: boolean;
  onClose: () => void;
}

export function EventSummaryPopup({
  event,
  isOpen,
  onClose,
}: EventSummaryPopupProps) {
  const { events, setEvents } = useEventStore();
  const [isEditing, setIsEditing] = useState(false);
  const [startDate, setStartDate] = useState(
    new Date(event.startDate.toISOString()),
  );
  const [endDate, setEndDate] = useState(new Date(event.endDate.toISOString()));
  const [startTime, setStartTime] = useState(event.startTime);
  const [endTime, setEndTime] = useState(event.endTime);
  const [bookedBy, setBookedBy] = useState(event.customerName);
  const [action, setAction] = useState<"Delete" | "Update">("Delete");
  const [isActionDialogOpen, setIsActionDialogOpen] = useState(false);

  useEffect(() => {
    const originalStyle = document.body.style.overflow;
    document.body.style.overflow = "auto";

    return () => {
      document.body.style.overflow = originalStyle; // Restore on unmount
    };
  }, [isOpen]);

  function handleAction() {
    if (action === "Delete") {
      handleDelete();
    } else if (action === "Update") {
      handleUpdate();
    }
    return;
  }
  const handleDelete = async () => {
    try {
      await axios.delete(`${BASE_URL}/api/v1/calendar/${event.id}`, {
        headers: {
          "Content-type": "application/json",
          authorization: `Bearer ` + localStorage.getItem("token"),
        },
      });
      const updatedEvents = events.filter((e) => e.id !== event.id);
      setEvents(updatedEvents);
      toast({
        description: `Event Successfully deleted`,
        className:
          "text-black bg-white border-0 rounded-md shadow-mg shadow-black/5 font-normal",
      });
      onClose();
    } catch (error) {
      console.log(error);
      toast({
        description: `Booking failed to delete`,
        className:
          "text-black bg-white border-0 rounded-md shadow-mg shadow-black/5 font-normal",
        variant: "destructive",
        duration: 2000,
      });
    }
  };

  const handleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleUpdate = async () => {
    try {
      await axios.put(
        `${BASE_URL}/api/v1/calendar/${event.id}`,
        {
          startDate: startDate,
          endDate: endDate,
          startTime: startTime,
          endTime: endTime,
          customerName: bookedBy,
        },
        {
          headers: {
            "Content-type": "application/json",
            authorization: `Bearer ` + localStorage.getItem("token"),
          },
        },
      );
      const editedEvent = {
        id: event.id,
        startDate: dayjs(startDate),
        endDate: dayjs(endDate),
        status: event.status,
        startTime: startTime,
        endTime: endTime,
        color: event.color,
        allDay: event.allDay,
        customerName: bookedBy,
        customerContact: event.customerContact,
        carId: event.carId,
        carName: event.carName,
        isAdmin: event.isAdmin
      };
      const updatedEvents = events.map((e) =>
        e.id === event.id ? editedEvent : e,
      );
      setEvents(updatedEvents);
      setIsEditing(false);
      toast({
        description: `Event Successfully updated`,
        className:
          "text-black bg-white border-0 rounded-md shadow-mg shadow-black/5 font-normal",
      });
    } catch (error) {
      console.log(error);
      toast({
        description: `Booking failed to update`,
        className:
          "text-black bg-white border-0 rounded-md shadow-mg shadow-black/5 font-normal",
        variant: "destructive",
        duration: 2000,
      });
    }
  };

  const getBookingStatus = () => {
    if( event.status === "Upcoming"){
      return "Booking yet to Start";
    } else if(event.status === "Ongoing"){
      return "Booking in Progress";
    } else if(event.status === "Completed"){
      return "Booking Completed";
    }
  }

  return (
    <>
      <Dialog open={isOpen && !isActionDialogOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[425px] z-20 border-border max-sm:min-h-[70%] flex flex-col p-0 items-center overflow-auto">
          <DialogHeader className="flex flex-row justify-between items-center w-full px-6 py-0">
            <DialogTitle>
              <div className="flex justify-start w-full whitespace-nowrap mt-4">
                BookingId : {event.id}
              </div>
            </DialogTitle>
            {event.isAdmin &&
              <div className="flex justify-end w-full items-center w-full mr-4 mb-2">
              <div className="flex space-x-2">
                <Button variant="ghost" size="icon" onClick={handleEdit}>
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setAction("Delete");
                    setIsActionDialogOpen(true);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>}
          </DialogHeader>

          <div className="p-4 h-full w-full max-sm:mt-6">
            <div className="flex items-start space-x-4 w-[90%]">
              <div
                className={`w-6 h-6 rounded-md mt-2 ${isEditing ? "hidden" : ""}`}
                style={{ backgroundColor: event.color }}
              />
              <div className="flex-1">
                <h2 className="text-lg font-semibold mb-2">
                  Your booking starts from
                </h2>
                {isEditing ? (
                  <div className="space-y-2 flex items-center justify-around max-h-[38px]">
                    <div className="mt-[7px]">
                      <DatePicker date={startDate} setDate={setStartDate} />
                    </div>
                    {!event.allDay && (
                      <div className="mt-[-10px] mx-2">
                        <AddTime
                          className=""
                          selectedTime={startTime}
                          setSelectedTime={setStartTime}
                        />
                        <input type="hidden" name="time" value={startTime} />
                      </div>
                    )}
                    <div className="text-center mt-[-8px]"> -</div>
                    <div className="flex items-center justify-center mt-[-9px]">
                      <DatePicker date={endDate} setDate={setEndDate} />
                    </div>
                    {!event.allDay && (
                      <div className="mt-[-10px] mx-2">
                        <AddTime
                          className="z-30"
                          selectedTime={endTime}
                          setSelectedTime={setEndTime}
                        />
                        <input type="hidden" name="time" value={endTime} />
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-sm">
                    {event.allDay
                      ? `${dayjs(startDate).format("MMM D, YYYY")} - ${dayjs(endDate).format("MMM D, YYYY")}`
                      : `${dayjs(startDate).format("MMM D, YYYY")} ${startTime} - ${dayjs(endDate).format("MMM D, YYYY")} ${endTime}`}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-4 space-y-4 w-[90%]">
              <div className="flex items-start space-x-2">
                <UserIcon className="h-6 w-6 mt-1 mr-3 stroke-[12px] fill-black dark:fill-white stroke-black dark:stroke-white" />
                <div>
                  <p className="text-sm font-medium">Booked by</p>
                  {isEditing ? (
                    <Input
                      name="bookedBy"
                      value={bookedBy}
                      onChange={(e) => setBookedBy(e.target.value)}
                      className="bg-gray-200 dark:bg-card text-sm rounded-sm border-2 focus-visible:ring-0 focus-visible:border-blue-400"
                    />
                  ) : (
                    <p className="text-sm">{bookedBy}</p>
                  )}
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <CarFrontIcon className="w-7 h-4 mr-[8px] stroke-[6px] ml-[-2px] dark:stroke-blue-200 dark:fill-blue-200 stroke-black fill-black" />
                <div>
                  <p className="text-sm font-medium">Car</p>
                  <p className="text-sm">{event.carName}</p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <BookingStatusIcon
                  status={Status.pending}
                  className="h-5 w-5 mt-1 mr-3"
                />
                <div>
                  <p className="text-sm font-medium">{getBookingStatus()}</p>
                </div>
              </div>
            </div>

            {isEditing && (
              <div className="mt-4">
                <Button
                  onClick={() => {
                    setAction("Update");
                    setIsActionDialogOpen(true);
                  }}
                  className="w-full active:scale-95"
                >
                  Save Changes
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
      <Dialog
        open={isActionDialogOpen}
        onOpenChange={setIsActionDialogOpen}
        modal={true}
      >
        <DialogContent className="sm:max-w-[425px] bg-muted border-border">
          <DialogHeader>
            <DialogTitle>{action}</DialogTitle>
            <DialogDescription className="text-grey-500">
              Are you sure you want to {action} the booking?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              className="max-sm:w-full active:scale-95 bg-primary hover:bg-opacity-10 shadow-lg"
              onClick={() => {
                handleAction();
                setIsActionDialogOpen(false);
              }}
            >
              {action}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
