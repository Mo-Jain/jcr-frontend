"use client";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Fuel, Upload, X } from "lucide-react";
import CarFrontIcon from "@/public/car-front.svg";
import Color from "@/public/color.svg";
import Price from "@/public/price-tag.svg";
import Seats from "@/public/seats.svg";
import { BASE_URL } from "@/lib/config";
import axios from "axios";
import { useCarStore } from "@/lib/store";
import Image from "next/image";
import { toast } from "@/hooks/use-toast";
import CarNumberPlateInput from "./car-number-input";
import { createFolder } from "@/app/actions/folder";
import { uploadToDrive } from "@/app/actions/upload";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

interface AddCarDialogProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

interface FormErrors {
  [key: string]: string;
}

export function AddCarDialog({ isOpen, setIsOpen }: AddCarDialogProps) {
  const [price, setPrice] = useState<string>("");
  const [mileage, setMileage] = useState<string>("");
  const [carBrand, setCarBrand] = useState<string>("");
  const [carModel, setCarModel] = useState<string>("");
  const [color, setColor] = useState<string>("#0000FF");
  const [carNumber, setCarNumber] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const { cars, setCars } = useCarStore();
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [seats, setSeats] = useState<string>("5");
  const [fuel,setFuel] = useState<string>("petrol");
  const validateForm = () => {
    const newErrors: FormErrors = {};
    if (price === "") newErrors.price = "Price can't be empty";
    if (mileage === "") newErrors.mileage = "Mileage can't be empty";
    if (!carBrand) newErrors.carBrand = "This field is mandatory";
    if (!carModel) newErrors.carModel = "This field is mandatory";
    if (!color) newErrors.color = "This field is mandatory";
    if (!carNumber) newErrors.carNumber = "This field is mandatory";
    if (!imageFile) newErrors.imageFile = "No Image selected";
    if (!seats) newErrors.seats = "No.of seats can't be empty"; 
    if (!fuel) newErrors.fuel = "Fuel can't be empty";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validateForm()) {
      toast({
        description: `Please fill all mandatory fields`,
        className:
          "text-black bg-white border-0 rounded-md shadow-mg shadow-black/5 font-normal",
        variant: "destructive",
        duration: 2000,
      });
      return;
    }

    if (!imageFile) return;

    setIsLoading(true);

    try {
      const currentDate = new Date();
      const unixTimestamp = Math.floor(currentDate.getTime() / 1000);

      const createdFolder = await createFolder(
        carBrand + " " + carModel + unixTimestamp,
        "car",
      );

      if (!createdFolder.folderId || createdFolder.error) {
        toast({
          description: `Failed to create folder`,
          className:
            "text-black bg-white border-0 rounded-md shadow-mg shadow-black/5 font-normal",
          variant: "destructive",
          duration: 2000,
        });
        setIsLoading(false);
        return;
      }

      const resImage = await uploadToDrive(imageFile, createdFolder.folderId);

      console.log("response Image", resImage);

      const body = {
        brand: carBrand,
        model: carModel,
        plateNumber: carNumber,
        color: color,
        price: parseInt(price),
        mileage: parseInt(mileage),
        imageUrl: resImage.url ? resImage.url : "",
        carFolderId: resImage.folderId,
        seats : parseInt(seats),
        fuel
      };
      const res = await axios.post(`${BASE_URL}/api/v1/car`, body, {
        headers: {
          "Content-type": "application/json",
          authorization: `Bearer ` + localStorage.getItem("token"),
        },
      });
      const car = {
        id: res.data.carId,
        brand: carBrand,
        model: carModel,
        plateNumber: carNumber,
        imageUrl: selectedImage ? selectedImage : "",
        colorOfBooking: color,
        price: parseInt(price),
        upcomingBooking: 0,
        ongoingBooking: 0,
        photos:selectedImage ? [selectedImage] : [],
      };
      setCars([...cars, car]);
      setCarBrand("");
      setCarModel("");
      setColor("#0000FF");
      setCarNumber("");
      setPrice("");
      setMileage("");
      setSelectedImage(null);
      setImageFile(null);
      setIsLoading(false);
      setIsOpen(false);
      toast({
        description: `Car Successfully added`,
        className:
          "text-black bg-white border-0 rounded-md shadow-mg shadow-black/5 font-normal",
      });
    } catch (error) {
      console.log(error);
      toast({
        description: `Failed to submit form`,
        className:
          "text-black bg-white border-0 rounded-md shadow-mg shadow-black/5 font-normal",
        variant: "destructive",
        duration: 2000,
      });
      setIsLoading(false);
    }
  };

  const handleFilUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setErrors((prev) => ({
          ...prev,
          imageFile: "Please select an image file",
        }));
        setSelectedImage(null);
        return;
      }

      const maxSize = 6 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        setErrors((prev) => ({
          ...prev,
          imageFile: "File size should not exceed 5MB",
        }));
        setSelectedImage(null);
        return;
      }
      setImageFile(file);
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
    }
    setErrors((prev) => ({ ...prev, imageFile: "" }));
  };

  const handleRemoveImage = () => {
    if (selectedImage) {
      URL.revokeObjectURL(selectedImage);
    }
    setSelectedImage(null);
    setImageFile(null);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="h-auto overflow-y-auto dark:border-gray-800 ">
          <form  className="space-y-4">
            <DialogHeader>
              <DialogTitle>
                <div></div>
              </DialogTitle>
            </DialogHeader>
            <div className="text-[50px] font-bold">
              <Input
                type="text"
                name="title"
                value={carBrand}
                onChange={(e) => {
                  setCarBrand(e.target.value);
                  setErrors((prev) => ({ ...prev, carBrand: "" }));
                }}
                placeholder="ADD CAR BRAND"
                className="my-4 rounded-none placeholder:text-[30px] text-[30px] max-sm:placeholder:text-[24px]  md:text-[30px] file:text-[30px] placeholder:text-zinc-700 dark:placeholder:text-gray-400  border-0 border-b focus-visible:border-b-2 border-b-gray-400 focus-visible:border-b-blue-600  focus-visible:ring-0 focus-visible:ring-offset-0 w-full"
              />
              {errors.carBrand && (
                <p className="text-red-500 text-sm mt-1">{errors.carBrand}</p>
              )}
            </div>

            <div className="gap-4 w-10/11">
              <div className="flex justify-between gap-4 sm:gap-6 items-center">
                <CarFrontIcon className="w-10 h-4 stroke-[6px] dark:stroke-white dark:fill-white  stroke-black fill-black" />
                <div>
                  <Input
                    type="text"
                    name="title"
                    placeholder="ADD CAR MODEL"
                    value={carModel}
                    onChange={(e) => {
                      setCarModel(e.target.value);
                      setErrors((prev) => ({ ...prev, carModel: "" }));
                    }}
                    className="my-4 w-full rounded-none placeholder:text-[14px] max-sm:placeholder:text-[12px] max-sm:text-[12px] text-[14px] md:text-[14px] placeholder:text-zinc-700 dark:placeholder:text-gray-400  border-0 border-b focus-visible:border-b-2 border-b-gray-400 focus-visible:border-b-blue-600  focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                  {errors.carModel && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.carModel}
                    </p>
                  )}
                </div>
                <div>
                  <CarNumberPlateInput
                    value={carNumber}
                    onChange={(value) => {
                      setCarNumber(value);
                      setErrors((prev) => ({ ...prev, carModel: "" }));
                    }}
                  />
                  {errors.carNumber && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.carNumber}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex justify-between items-center gap-6 items-end">
                <Color className="w-16 h-16 stroke-[6px] dark:stroke-white dark:fill-white  stroke-black fill-black" />
                <div className="flex flex-col item-center gap-1 max-w-[214px] w-full">
                  <Label htmlFor="color" className="max-sm:text-xs">
                    Select color for booking
                  </Label>
                  <div className="w-2/3 flex  items-center">
                    <div
                      className="w-8 h-8 rounded-md border border-gray-300 dark:border-black cursor-pointer"
                      style={{ backgroundColor: color }}
                      onClick={() =>
                        document.getElementById("colorPicker")?.click()
                      }
                    />
                    <Input
                      type="color"
                      id="colorPicker"
                      value={color}
                      onChange={(e) => {
                        setColor(e.target.value);
                        setErrors((prev) => ({ ...prev, color: "" }));
                      }}
                      className="hidden"
                    />
                    {errors.color && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.color}
                      </p>
                    )}
                  </div>
                </div>
                <div className=" w-full">
                  <Label
                    htmlFor="carImage"
                    className="cursor-pointer max-sm:text-xs"
                  >
                    Upload image
                  </Label>
                  <div
                    onClick={() => {
                      document.getElementById("carImage")?.click();
                      setIsOpen(true);
                    }}
                    className="flex items-center justify-center whitespace-nowrap  bg-gray-300 max-sm:text-sm hover:bg-gray-400 dark:bg-muted dark:hover:bg-gray-900 w-fit cursor-pointer text-secondary-foreground px-2 py-1 rounded-sm hover:bg-gray-200 transition-colors"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    <span>Choose file</span>
                  </div>
                  <div>
                    <Input
                      id="carImage"
                      type="file"
                      accept="image/*"
                      onChange={handleFilUpload}
                      className="hidden"
                    />
                    {errors.imageFile && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.imageFile}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Seats className="w-7 h-7 dark:stroke-white dark:fill-white mr-4  stroke-black fill-black" />
                    <Label htmlFor="totalAmount" className=" max-sm:text-xs">
                      No.of seats
                    </Label>
                  </div>
                  <Input
                    type="number"
                    id="mileage"
                    value={seats}
                    onChange={(e) => {
                      const value = e.target.value;
                      setSeats(value);
                      setErrors((prev) => ({ ...prev, seats: "" }));
                    }}
                    className="w-1/3 max-sm:text-xs placeholder:text-zinc-700 dark:placeholder:text-gray-400  border-black dark:border-zinc-700 focus:border-blue-400 focus-visible:ring-blue-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none "
                  />
                  {errors.seats && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.seats}
                    </p>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <Fuel className="w-7 h-7 text-black dark:text-white mr-4" />
                  <Label htmlFor="totalAmount" className="w-1/3 max-sm:text-xs">
                    Fuel
                  </Label>
                  <Select
                    value={fuel} // Ensures placeholder shows when carId is 0 or undefined
                    onValueChange={(value) => {
                      setFuel(value)
                      setErrors((prev) => ({ ...prev, car: "" }));
                    }}
                  >
                    <SelectTrigger
                      id="car"
                      className="w-1/2 text-xs sm:text-sm border-black dark:border-zinc-700 focus:border-blue-400 focus-visible:ring-blue-400 max-sm:max-w-[190px] focus-visible:ring-blue-400 focus:outline-none"
                    >
                      <SelectValue placeholder="Select fuel" />
                    </SelectTrigger>
                    <SelectContent
                      className="bg-background border-border"
                      aria-modal={false}
                    >
                      <SelectItem
                        className="focus:bg-blue-300 dark:focus:bg-blue-900 cursor-pointer"
                        value={"petrol"}
                      >
                        Petrol
                      </SelectItem>
                      <SelectItem
                        className="focus:bg-blue-300 dark:focus:bg-blue-900 cursor-pointer"
                        value={"diesel"}
                      >
                        Diesel
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.fuel && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.fuel}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="w-[140px] h-[100px] border border-black dark:border-zinc-700 relative">
                {selectedImage && (
                  <>
                    <Image
                      src={selectedImage}
                      alt="Preview"
                      width={140}
                      height={100}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-zinc-700"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </>
                )}
              </div>
            </div>
            <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-4 sm:gap-6">
                  <Price className="w-7 h-7 stroke-[6px] dark:stroke-white dark:fill-white  stroke-black fill-black" />
                  <Input
                    type="text"
                    id="price"
                    placeholder="Enter 24 hr price"
                    className="w-full border-black max-sm:text-xs dark:border-zinc-700 placeholder:text-zinc-700 dark:placeholder:text-gray-400  focus:border-blue-400 focus-visible:ring-blue-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    value={price}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d*$/.test(value)) {
                        setPrice(value);
                        setErrors((prev) => ({ ...prev, price: "" }));
                      }
                    }}
                  />
                  {errors.price && (
                    <p className="text-red-500 text-sm mt-1">{errors.price}</p>
                  )}
                </div>

                <div className="flex items-center gap-4 sm:gap-6">
                  <Input
                    type="number"
                    id="mileage"
                    placeholder="Enter mileage"
                    value={mileage}
                    onChange={(e) => {
                      const value = e.target.value;
                      setMileage(value);
                      setErrors((prev) => ({ ...prev, mileage: "" }));
                    }}
                    className="w-full max-sm:text-xs placeholder:text-zinc-700 dark:placeholder:text-gray-400  border-black dark:border-zinc-700 focus:border-blue-400 focus-visible:ring-blue-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none "
                  />
                  {errors.mileage && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.mileage}
                    </p>
                  )}
                </div>
              </div>
            <div className="flex gap-1 items-center">
              <Button
                onClick={handleSubmit}
                disabled={isLoading}
                className={`bg-blue-600 active:scale-95 dark:text-white hover:bg-opacity-80 w-full ${isLoading && "cursor-not-allowed opacity-50"}`}
              >
                {isLoading ? (
                  <>
                    <span>Please wait</span>
                    <div className="flex items-end py-1 h-full">
                      <span className="sr-only">Loading...</span>
                      <div className="h-1 w-1 bg-white mx-[2px] border-border rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                      <div className="h-1 w-1 bg-white mx-[2px] border-border rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                      <div className="h-1 w-1 bg-white mx-[2px] border-border rounded-full animate-bounce"></div>
                    </div>
                  </>
                ) : (
                  <span>Create</span>
                )}
              </Button>
              {!isLoading &&
              <Button
                variant="destructive"
                onClick={(e) => {
                  e.preventDefault()
                  setIsOpen(false)
                }}
                className="border active:scale-95 border-input w-full sm:hidden w-full"
              >
                Cancel
              </Button>}
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
