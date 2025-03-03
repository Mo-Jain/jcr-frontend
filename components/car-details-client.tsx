"use client";
import { Button } from "@/components/ui/button";
import { Edit, IndianRupee, LogOut,  Trash2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import BackArrow from "@/public/back-arrow.svg";
import ArrowRight from "@/public/right_arrow.svg";
import axios from "axios";
import { BASE_URL } from "@/lib/config";
import LoadingScreen from "./loading-screen";
import Booking from "@/public/online-booking.svg";
import { useCarStore } from "@/lib/store";
import { toast } from "@/hooks/use-toast";
import { uploadToDrive } from "@/app/actions/upload";
import CarIcon from "@/public/car-icon.svg";

interface Car {
  id: number;
  brand: string;
  model: string;
  plateNumber: string;
  colorOfBooking: string;
  imageUrl: string;
  mileage: number;
  price: number;
  totalEarnings: number;
  carFolderId: string;
  bookings: {
    id: number;
    start: string;
    end: string;
    status: string;
    startTime: string;
    endTime: string;
    customerName: string;
    customerContact: string;
  }[];
}
interface Earnings {
  thisMonth: number;
  oneMonth: number;
  sixMonths: number;
}

export function CarDetailsClient({ carId }: { carId: number }) {
  const [car, setCar] = useState<Car | null>(null);
  const router = useRouter();
  const [isEditable, setIsEditable] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [color, setColor] = useState(car ? car.colorOfBooking : "#0000FF");
  const [price, setPrice] = useState(car?.price || 0);
  const [mileage, setMileage] = useState(car?.mileage || 0);
  const [imageUrl, setImageUrl] = useState(car?.imageUrl || "");
  const { cars, setCars } = useCarStore();
  const [earnings, setEarnings] = useState<Earnings>();
  const [action, setAction] = useState<
    "Delete booking" | "Update car" | "Delete car"
  >("Update car");
  const [deleteBookingId, setDeleteBookingId] = useState<number>(0);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isAdmin,setIsAdmin] = useState(false);

  useEffect(() => {
    if (car) {
      setColor(car.colorOfBooking || "#0000FF");
      setPrice(car.price || 0);
      setMileage(car.mileage || 0);
      setImageUrl(car.imageUrl || "");
    }
     
  }, [car]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resCar = await axios.get(`${BASE_URL}/api/v1/car/${carId}`, {
          headers: {
            "Content-type": "application/json",
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setCar(resCar.data.car);
        setIsAdmin(resCar.data.isAdmin);
        const resEarnings = await axios.get(
          `${BASE_URL}/api/v1/car/earnings/${carId}`,
          {
            headers: {
              "Content-type": "application/json",
              authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );
        setEarnings({
          ...resEarnings.data.earnings,
          total: resEarnings.data.total,
        });
      } catch (error) {
        console.log(error);
        router.push("/car-not-found");
      }
    };
    fetchData();
  }, []);

  if (!car) {
    return (
      <div>
        <LoadingScreen />
      </div>
    );
  }

  function handleAction() {
    if (action === "Delete booking" && deleteBookingId !== 0) {
      handleDeleteBooking(deleteBookingId);
    } else if (action === "Update car") {
      handleUpdate();
    } else if (action === "Delete car") {
      handleDelete();
    }
    return;
  }

  const handleDelete = async () => {
    if (!isAdmin) return;
    setIsDeleting(true);
    try {
      await axios.delete(`${BASE_URL}/api/v1/car/${car.id}`, {
        headers: {
          "Content-type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setCars(cars.filter((c) => c.id !== car.id));
      toast({
        description: `Car Successfully deleted`,
        className:
          "text-black bg-white border-0 rounded-md shadow-mg shadow-black/5 font-normal",
      });
      router.push("/");
      setIsDeleting(false);
    } catch (error) {
      console.log(error);
      toast({
        description: `Car failed to delete, please delete all bookings first`,
        className:
          "text-black bg-white border-0 rounded-md shadow-mg shadow-black/5 font-normal",
        variant: "destructive",
        duration: 2000,
      });
      setIsDeleting(false);
    }
  };

  const handleUpdate = async () => {
    if (!isAdmin) return;
    setIsLoading(true);
    let imageUrl: string | undefined = undefined;

    try {
      // Upload image only if imageFile is provided
      if (imageFile) {
        const resImage = await uploadToDrive(imageFile, car.carFolderId);
        imageUrl = resImage.url;
      }
      // Prepare data for update
      const updateData: Record<string, string | number> = {
        color: color,
        price: price,
        mileage: mileage,
      };

      // Only include imageUrl if a new image was uploaded
      if (imageUrl) {
        updateData.imageUrl = imageUrl;
      } else {
        setImageUrl(car.imageUrl || "");
      }

      await axios.put(`${BASE_URL}/api/v1/car/${car.id}`, updateData, {
        headers: {
          "Content-type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const carId = car.id;
      setCars(
        cars.map((car) => {
          if (car.id === carId) {
            const newCar: typeof car = {
              ...car,
              colorOfBooking: color,
              price,
              ...(imageUrl && { imageUrl }),
            };
            return newCar;
          } else {
            return car;
          }
        }),
      );
      setIsLoading(false);

      toast({
        description: `Car Successfully updated`,
        className:
          "text-black bg-white border-0 rounded-md shadow-mg shadow-black/5 font-normal",
      });
      setIsEditable(false);
    } catch (error) {
      console.log(error);
      toast({
        description: `Car failed to update`,
        className:
          "text-black bg-white border-0 rounded-md shadow-mg shadow-black/5 font-normal",
        variant: "destructive",
        duration: 2000,
      });
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditable(false);
    setColor(car.colorOfBooking || "#0000FF");
    setPrice(car.price || 0);
    setMileage(car.mileage || 0);
    setImageUrl(car.imageUrl || "");
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    console.log("file", file);
    if (file) {
      if (!file.type.startsWith("image/")) {
        return;
      }
      const maxSize = 10 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        toast({
          description: `File size should not exceed 5MB`,
          className:
            "text-black bg-white border-0 rounded-md shadow-mg shadow-black/5 font-normal",
          variant: "destructive",
          duration: 2000,
        });
        return;
      }
      setImageFile(file);
      setImageUrl(URL.createObjectURL(file));
    }
  };

  function getHeader(
    status: string,
    startDate: string,
    startTime: string,
    endDate: string,
    endTime: string,
  ) {
    let headerText = "";
    const startDateTime = new Date(startDate);
    const endDateTime = new Date(endDate);

    const [startHour, startMinute] = startTime.split(":").map(Number);
    const [endHour, endMinute] = endTime.split(":").map(Number);
    startDateTime.setHours(startHour, startMinute, 0, 0);
    endDateTime.setHours(endHour, endMinute, 0, 0);
    const currDate = new Date();
    if (status === "Upcoming") {
      if (startDateTime >= currDate) {
        headerText = "Pickup scheduled on";
      } else {
        headerText = "Pickup was scheduled on";
      }
    } else if (status === "Ongoing") {
      if (endDateTime < currDate) {
        headerText = "Return was scheduled on";
      } else {
        headerText = "Return scheduled by";
      }
    } else if (status === "Completed") {
      headerText = "Booking ended at";
    }

    return headerText;
  }

  function formatDateTime(dateString: string) {
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  function getReturnTime(startDate: string, startTime: string) {
    const [hours, minutes] = startTime.split(":").map(Number);
    const currDate = new Date();
    currDate.setHours(hours);
    currDate.setMinutes(minutes); // Subtract 30 minutes

    // Format back to HH:MM
    const newHours = currDate.getHours().toString().padStart(2, "0");
    const newMinutes = currDate.getMinutes().toString().padStart(2, "0");

    const pickup = new Date(startDate);

    if (newHours === "23" && Number(newMinutes) >= 30) {
      pickup.setDate(pickup.getDate() - 1); // Add a day
    }

    const date = pickup.toDateString().replaceAll(" ", ", ");
    return `${date} ${newHours}:${newMinutes}`;
  }

  function getTimeUntilBooking(startTime: string, status: string) {
    if (status === "Completed") return "Trip has ended";
    if (status === "Ongoing") return "Trip has started";
    const now = new Date();
    const start = new Date(startTime);
    const diffTime = start.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return "Trip has started";
    if (diffDays === 0) return "Trip start window opens Today";
    if (diffDays === 1) return "Trip start window opens in 1 day";
    return `Trip start window opens in ${diffDays} days`;
  }

  async function handleDeleteBooking(bookingId: number) {
    //add code to delete the booking
    if (!isAdmin) return;
    try {
      const res = await axios.delete(
        `${BASE_URL}/api/v1/booking/${bookingId}`,
        {
          headers: {
            "Content-type": "application/json",
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      setCar((prev: Car | null) => {
        if (!prev) return prev;
        return {
          ...prev,
          bookings: prev.bookings.filter((booking) => booking.id !== bookingId),
        };
      });
      toast({
        description: `Booking Successfully deleted`,
        className:
          "text-black bg-white border-0 rounded-md shadow-mg shadow-black/5 font-normal",
      });
      console.log(res.data);
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
  }

  return (
    <div>
      {isDeleting && (
        <div className=" bg-black bg-opacity-80 fixed top-0 left-0 w-screen h-screen z-50 flex items-center justify-center">
          <div className="flex space-x-2 justify-center items-center w-screen h-screen">
            <span className="sr-only">Loading...</span>
            <div className="h-8 w-8 bg-primary border-[2px] border-border rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="h-8 w-8 bg-primary border-[2px] border-border rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="h-8 w-8 bg-primary border-[2px] border-border rounded-full animate-bounce"></div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between border-b border-gray-300 dark:border-zinc-700">
        <div
          className="mr-2 rounded-md font-bold  cursor-pointer hover:bg-gray-200 dark:hover:bg-muted"
          onClick={() => router.back()}
        >
          <div className="h-12 w-12 flex justify-center items-center rounded-full  ">
            <div className="h-9 w-9 p-1 rounded-full">
              <BackArrow className="h-7 w-7 stroke-0 fill-gray-800 dark:fill-blue-300" />
            </div>
          </div>
        </div>
        <h2 className="text-lg font-semibold">{car?.brand} {car?.model}</h2>
        <div className="text-center w-5 h-5"></div>
        {isAdmin && (
        <div
          className="mr-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-muted p-2 rounded-sm"
          onClick={() => {
            setAction("Delete car");
            setIsDialogOpen(true);
          }}
        >
          <Trash2 className=" h-6 w-6" />
        </div>

          )}
      </div>

      <div>
        <div className="flex flex-col sm:flex-row gap-2 sm:border-b border-border h-full">
          <div className=" flex flex-col justify-center sm:py-4 items-center w-full min-h-full">
            <div className="relative w-full max-sm:px-2  my-2 h-fit">
              <Image
                src={imageUrl || "/placeholder.svg"}
                alt={`${car.brand} ${car.model}`}
                width={2000}
                height={1000}
                className=" rounded-md mx-auto w-full h-fit min-h-[200px] object-cover"
              />
              {isEditable && (
                <button
                  onClick={() => document.getElementById("carImage")?.click()}
                  className="absolute top-2 right-2 bg-primary text-primary-foreground p-2 rounded-full hover:bg-primary/90 transition-colors"
                >
                  <Edit size={20} />
                  <Input
                    id="carImage"
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </button>
              )}
            </div>
            <div className="flex justify-center w-full">
              {isAdmin &&
              <>
                {!isEditable ? (
                  <Button
                    onClick={() => setIsEditable(true)}
                    className="bg-primary text-primary-foreground p-2 rounded-md hover:bg-primary/90 transition-colors"
                  >
                    <Edit size={20} />
                    <span>Edit Car Details</span>
                  </Button>
                ) : (
                  <>
                    <Button
                      disabled={isLoading}
                      onClick={() => {
                        setAction("Update car");
                        setIsDialogOpen(true);
                      }}
                      className={`mx-3 flex items-center bg-primary text-primary-foreground p-2 rounded-md hover:bg-primary/90 transition-colors ${isLoading && "cursor-not-allowed opacity-50"}`}
                    >
                      {isLoading ? (
                        <>
                          <span className="text-white">Please wait</span>
                          <div className="flex items-end py-1 h-full">
                            <span className="sr-only">Loading...</span>
                            <div className="h-1 w-1 bg-white mx-[2px] border-border rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                            <div className="h-1 w-1 bg-white mx-[2px] border-border rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                            <div className="h-1 w-1 bg-white mx-[2px] border-border rounded-full animate-bounce"></div>
                          </div>
                        </>
                      ) : (
                        <span>Update</span>
                      )}
                    </Button>
                    {!isLoading && (
                      <Button
                        onClick={() => handleCancel()}
                        className="mx-3 bg-secondary text-secondary-foreground p-2 rounded-md hover:bg-secondary/90 transition-colors"
                      >
                        <span>Cancel</span>
                      </Button>
                    )}
                  </>
                )}
              </>
              }
            </div>
          </div>
          <div className="w-full h-full">
            <div className="">
              <section className="px-2 py-2 pb-0 max-sm:border-t border-gray-200 dark:border-zinc-700">
                <h2 className="text-lg font-semibold mb-4 ">Car Details</h2>
                <div className="grid grid-cols-2 gap-4 ">
                  <div className="space-y-4">
                    <p className="text-sm text-blue-500 mb-1">Brand</p>
                    <span className="font-medium">{car.brand}</span>
                    <p className="text-sm text-blue-500 mb-1">Model</p>
                    <span className="font-medium">{car.model}</span>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-blue-500">
                        {isEditable && isAdmin
                          ? "Select the Color of Booking"
                          : "Color of Bookings"
                          }
                      </p>
                      <div className="flex flex-col item-center gap-1 max-w-[214px] w-full">
                        <div
                          className={`w-8 h-8 rounded-md border border-gray-300 dark:border-zinc-700 ${isEditable ? "cursor-pointer" : ""}`}
                          style={{ backgroundColor: color }}
                          onClick={() =>
                            isEditable &&
                            document.getElementById("colorPicker")?.click()
                          }
                        />
                        <Input
                          type="color"
                          id="colorPicker"
                          value={color}
                          onChange={(e) => setColor(e.target.value)}
                          className="hidden my-0"
                        />
                      </div>
                    </div>
                    <p className="text-sm text-blue-500 mb-1">Plate Number</p>
                    <span className="font-medium">{car.plateNumber}</span>
                  </div>
                </div>
              </section>
            </div>
            <hr className="my-4 border-gray-200 dark:border-zinc-700" />
            <section className="px-2 py-2 max-sm:border-b-4 border-gray-200 dark:border-zinc-700">
                <h2 className="text-xl font-semibold mb-4">
                  Performance & Pricing
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-blue-500 mb-1">24hr Price</p>
                      {!isEditable || !price || !isAdmin  ? (
                        <span className="font-medium flex items-center text-sm">
                          <IndianRupee className="w-4 h-4" /> {car.price}
                        </span>
                      ) : (
                        <Input
                          type="number"
                          id="name"
                          value={price}
                          onChange={(e) => setPrice(Number(e.target.value))}
                          className="w-[120px] sm:w-[170px] border-0 p-0 px-1 bg-gray-200 dark:bg-gray-800 focus-visible:ring-0 border-transparent border-y-4 focus:border-b-blue-400 "
                        />
                      )}
                    </div>
                    {earnings && earnings.oneMonth != 0 && (
                      <div>
                        <p className="text-sm text-blue-500 mb-1">
                          1 month Earnings
                        </p>
                        <span className="font-medium flex items-center text-sm">
                          <IndianRupee className="w-4 h-4" />{" "}
                          {earnings.oneMonth}{" "}
                        </span>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-blue-500 mb-1">Mileage</p>
                      {!isEditable || !mileage || !isAdmin ? (
                        <span className="font-medium">{car.mileage} km/ltr</span>
                      ) : (
                        <Input
                          type="number"
                          id="name"
                          value={mileage}
                          onChange={(e) => setMileage(Number(e.target.value))}
                          className="w-[120px] sm:w-[170px] border-0 p-0 px-1 bg-gray-200 dark:bg-gray-800 focus-visible:ring-0 border-transparent border-y-4 focus:border-b-blue-400 "
                        />
                      )}
                    </div>
                  </div>
                  <div className="space-y-3">
                    {earnings && earnings.thisMonth != 0 && earnings.thisMonth && (
                      <div>
                        <p className="text-sm text-blue-500 mb-1">
                          This Month Earnings
                        </p>
                        <span className="font-medium flex items-center text-sm">
                          <IndianRupee className="w-4 h-4" />
                          {earnings.thisMonth}
                        </span>
                      </div>
                    )}
                    {earnings && earnings.sixMonths != 0 && earnings.sixMonths && (
                      <div>
                        <p className="text-sm text-blue-500 mb-1">
                          6 Month Earnings
                        </p>
                        <span className="font-medium flex items-center text-sm">
                          <IndianRupee className="w-4 h-4" />
                          {earnings.sixMonths}
                        </span>
                      </div>
                    )}
                    {car && car.totalEarnings != 0 && car.totalEarnings && (
                      <div>
                        <p className="text-sm text-blue-500 mb-1">Total Earnings</p>
                        <span className="font-medium flex items-center text-sm">
                          <IndianRupee className="w-4 h-4" />
                          {car.totalEarnings}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
            </section>
          </div>
        </div>
          <section className="px-4 py-4 ">
            <h2 className="text-xl font-semibold mb-4">Current Bookings</h2>
            {car.bookings.length > 0 ? (
              <div key={car.id} className=" gap-8 mb-4">
                {car.bookings.map((booking) => {
                  if (booking.status === "Completed") return;
                  return (
                    <Card
                      key={booking.id}
                      className="overflow-hidden hover:shadow-md dark:border-zinc-700 transition-shadow my-2"
                    >
                      <CardContent className="p-0">
                        {/* Rest of the card content remains the same */}
                        <div className="flex justify-between items-center p-1 sm:p-2 bg-muted">
                          <div className="">
                            <p className="text-sm max-sm:text-xs text-blue-500">
                              {getHeader(
                                booking.status,
                                booking.start,
                                booking.startTime,
                                booking.end,
                                booking.endTime,
                              )}
                            </p>
                            <p className="font-semibold text-[#5B4B49] max-sm:text-sm dark:text-gray-400">
                              {getReturnTime(booking.end, booking.endTime)}{" "}
                            </p>
                          </div>
                          <div className="flex items-center ml-2 gap-[2px] sm:gap-2 justify-center">
                            <span className="text-blue-500 max-sm:text-xs">Go to Booking</span>
                            <LogOut
                              onClick={() =>
                                router.push("/booking/" + booking.id)
                              }
                              className="w-6 h-6 text-blue-500 cursor-pointer hover:text-red-600 dark:hover:text-red-400"
                            />
                          </div>
                        </div>
                        <hr className="border-t border-border" />
                        <div className="p-4 max-sm:p-2 bg-white dark:bg-background flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center sm:gap-8 gap-2">
                              <div>
                                <p className="text-xs sm:text-sm text-blue-500">
                                  From
                                </p>
                                <p className="font-semibold text-[#5B4B49] text-xs sm:text-sm dark:text-gray-400">
                                  {formatDateTime(booking.start)}{" "}
                                  {booking.startTime}
                                </p>
                              </div>
                              <ArrowRight className="mt-4 w-12 stroke-0 fill-blue-400 flex-shrink-0" />
                              <div>
                                <p className="text-xs sm:text-sm text-blue-500">
                                  To
                                </p>
                                <p className="font-semibold text-[#5B4B49] text-xs sm:text-sm dark:text-gray-400">
                                  {formatDateTime(booking.end)}{" "}
                                  {booking.endTime}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center w-full sm:w-4/5 justify-between mt-2 sm:mt-8 sm:gap-8 gap-2">
                              <div>
                                <p className="text-xs sm:text-sm text-blue-500">
                                  Booked By
                                </p>
                                <p className="font-semibold text-[#5B4B49] text-xs sm:text-sm dark:text-gray-400">
                                  {booking.customerName}
                                </p>
                              </div>
                              <div>
                                <p className="sm:text-sm text-xs text-blue-500">
                                  Contact
                                </p>
                                <p className="font-semibold text-[#5B4B49] text-xs sm:text-sm dark:text-gray-400">
                                  {booking.customerContact}
                                </p>
                              </div>
                            </div>
                          </div>
                          {isAdmin && (
                          <div
                            className="text-center ml-4"
                            onClick={() => {
                              setDeleteBookingId(booking.id);
                              setAction("Delete booking");
                              setIsDialogOpen(true);
                            }}
                          >
                            <Trash2 className="h-6 w-6 hover:text-red-500" />
                          </div>
                          )}
                        </div>
                        <div className="p-3 max-sm:p-2 flex bg-gray-200 dark:bg-muted items-center text-green-600 dark:text-green-400 gap-2">
                          <CarIcon className="w-8 h-3 stroke-green-600 dark:stroke-green-400 fill-green-600 dark:fill-green-400 stroke-[4px]" />
                          <p className="text-sm max-sm:text-xs ">
                            {getTimeUntilBooking(booking.start, booking.status)}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="flex justify-center items-center w-full h-full">
                <div className="w-full h-full flex mt-4 flex-col justify-center items-center">
                  <Booking
                    className={`h-12 w-12 stroke-[5px] fill-gray-400 `}
                  />
                  <p className="text-center text-xl text-gray-400 font-bold">
                    No Bookings Yet
                  </p>
                </div>
              </div>
            )}
          </section>
        </div>
     
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-muted border-border ">
          <DialogHeader>
            <DialogTitle>{action.split(" ")[0]}</DialogTitle>
            <DialogDescription className="text-blue-500">
              Are you sure you want to {action}?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              className="max-sm:w-full hover:bg-black bg-black hover:bg-opacity-80 text-white  shadow-lg"
              onClick={() => {
                handleAction();
                setIsDialogOpen(false);
              }}
            >
              {action.split(" ")[0]}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
