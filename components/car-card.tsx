import Image from "next/image";
import Ashoka from "@/public/ashoke-chakra.svg";

interface CarCardProps {
  name: string;
  imageUrl: string;
  plateNumber: string;
  color: string;
}

export function CarCard({ name, imageUrl, plateNumber }: CarCardProps) {
  return (
    <div className="w-full z-0 relative z-0">
      <div className="p-2 z-0 border border-border shadow-sm  bg-white dark:bg-muted rounded-md cursor-pointer">
        <div className="flex flex-col justify-between gap-1 sm:px-1">
          <div className="relative flex-shrink-0 h-24 sm:h-48">
            <Image
              src={imageUrl || "/placeholder.svg"}
              alt={name}
              fill
              style={{ objectFit: "cover" }}
              className="rounded-lg h-fit max-w-full max-h-full object-cover"
            />
          </div>
          <div className="p-0 sm:p-1 w-full flex justify-center items-center">
            <div className="flex justify-center items-center gap-2">
              <div className="flex flex-col gap-1 w-fit justify-center min-h-[56px] sm:min-h-[100px] items-center">
                <h3 className="text-lg flex items-center max-sm:text-xs px-1  w-fit overflow-hidden text-center font-semibold whitespace-wrap">
                  <span>{name.toLocaleUpperCase()}</span>
                </h3>
                <div className="max-sm:max-w-[107px] max-sm:max-h-[20px]">
                  <div className="flex justify-center sm:-mt-3 items-center gap-1 p-1 sm:p-1 border-[3.5px] w-fit scale-[0.40] sm:scale-[0.60]  border-gray-400 rounded-sm max-sm:scaled-container ">
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
