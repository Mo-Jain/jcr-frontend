import Image from "next/image";
import Ashoka from "@/public/ashoke-chakra.svg";
import { cn } from "@/lib/utils";

interface CarCardProps {
  name: string;
  imageUrl: string;
  plateNumber: string;
  color: string;
  ongoingBooking: number;
  upcomingBooking:number;
}

export function CarCard({ name, imageUrl, plateNumber,ongoingBooking,upcomingBooking }: CarCardProps) {

  return (
    <div className="w-full z-0 relative z-0">
      <div className="p-2 z-0 border border-border shadow-sm  bg-white dark:bg-muted rounded-md cursor-pointer">
        <div className="flex flex-col relative justify-between gap-1 sm:px-1 rounded-sm z-0">
          <div className="absolute -top-1 -right-1 flex items-center gap-1 z-10">
            {/* upcoming booking */}
            {upcomingBooking >0 &&
            <span
            className={cn("h-2 w-2 sm:h-3 sm:w-3 flex justify-center items-center text-xs p-1 text-center bg-blue-400 text-white rounded-full shadow-sm font-extrabold",
            )}
            >{upcomingBooking > 1 ? upcomingBooking : ""}</span>}
            {/* ongoing booking */}
            {ongoingBooking >0 &&
            <span
            className={cn("h-2 w-2 sm:h-3 sm:w-3 flex justify-center items-center text-xs p-1 text-center bg-green-400 text-white rounded-full shadow-sm font-extrabold",
            )}
            ></span>}
          </div>
          <div className="relative z-0 flex-shrink-0 h-24 sm:h-48">
            <Image
              src={imageUrl || "/placeholder.svg"}
              alt={name}
              fill
              style={{ objectFit: "cover" }}
              className="rounded-lg h-fit max-w-full max-h-full object-cover"
            />
          </div>
          <div className="p-0 sm:p-1 w-full flex justify-center items-center">
            <div className="flex justify-center items-center  border-black w-full gap-2">
              <div className="flex flex-col gap-1 w-full justify-center min-h-[56px] sm:min-h-[104px] items-center">
                <h3 className="md:text-md  lg:text-lg flex items-center justify-center max-sm:text-xs px-1  w-full overflow-hidden text-center font-semibold whitespace-wrap">
                  <span className="max-w-full whitespace-wrap">{name.toLocaleUpperCase()}</span>
                </h3>
                <div className="max-sm:max-w-[107px] max-sm:max-h-[20px] ">
                  <div className="flex justify-center sm:-mt-3 items-center gap-1 p-1 sm:p-1 border-[3.5px] w-fit scale-[0.40] sm:scale-[0.50] lg:scale-[0.60]  border-gray-400 rounded-sm max-sm:scaled-container ">
                    <div className="flex flex-col items-center justify-between">
                      <Ashoka className="h-2 w-2 stroke-blue-300 stroke-[7px] fill-blue-300" />
                      <span className="h-full text-[0.001px] text-blue-300">
                        IND
                      </span>
                    </div>
                    <span className="text-3xl whitespace-nowrap text-gray-400 font-semibold ">
                      {plateNumber}
                    </span>
                  </div>
                    
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
