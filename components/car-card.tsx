import Image from "next/image";
import Ashoka from "@/public/ashoke-chakra.svg";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CarCardProps {
  name: string;
  imageUrl?: string;
  plateNumber: string;
  color?: string;
  ongoingBooking?: number;
  upcomingBooking?:number;
  photos:string[];
}

export function CarCard({ name, plateNumber,ongoingBooking,upcomingBooking,photos }: CarCardProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollValue,setScrollValue] = useState(0);
  const [previewImage,setPreviewImage] = useState<string | null>(photos ? photos[scrollValue]: null);

  useEffect(() => {
    setPreviewImage(photos ? photos[scrollValue]: null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [photos]);

  const handleScrollBarClick = (e:React.MouseEvent<HTMLDivElement, MouseEvent>,index:number) => {
    e.preventDefault();
    e.stopPropagation();
    setPreviewImage(photos[index]);
    setScrollValue(index);
  }

  const handleScroll = (e:React.MouseEvent<HTMLDivElement, MouseEvent>,direction: "left" | "right") => {
    e.preventDefault();
    e.stopPropagation();
    if (!scrollRef.current) return;
      if(direction === "left"){
        if(scrollValue !== 0) {
          setPreviewImage(photos[scrollValue-1]);
          setScrollValue(scrollValue - 1);
        }
      }else {
        if(scrollValue !== photos.length-1) {
          setPreviewImage(photos[scrollValue+1]);
          setScrollValue(scrollValue + 1);
        }
      }
  };

  return (
    <div className="w-full z-0 relative z-0">
      <div className="p-2 z-0 border border-border shadow-sm  bg-white dark:bg-muted rounded-md cursor-pointer">
        <div className="flex flex-col relative justify-between gap-1 sm:px-1 rounded-sm z-0">
          {upcomingBooking && ongoingBooking &&
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
          }
          <div 
          ref={scrollRef}
          className="relative border border-black/10 dark:border-white/15 bg-black/5 dark:bg-white/10 rounded-lg z-0 flex-shrink-0 h-24 sm:h-48">
            {previewImage &&
            <Image
              src={previewImage || "/placeholder.svg"}
              alt={name}
              fill
              style={{ objectFit: "cover" }}
              className="rounded-lg h-fit max-w-full max-h-full object-cover"
            />}
            {photos.length > 1 &&
              <>
              <div className="absolute bottom-0 left-0 w-full h-fit flex items-center justify-center">
                <div className="flex justify-center items-end h-fit gap-1">
                  {photos.map((image,index) => (
                    <div key={index+image} 
                    onClick={(e) => handleScrollBarClick(e,index)}
                    className={`${scrollValue===index ? "w-3 h-3 bg-white" : "w-2 h-2 bg-blue-400"} border-2 border-blue-400 rounded-full transition-all duration-300 ease-in-out`}/>
                  ))}
                </div>
              </div>
                <div 
                  onClick={(e) => handleScroll(e,"left")} 
                  className="absolute border border-transparent active:border-blue-400 top-0 opacity-60 hover:opacity-100 -left-1 flex items-center justify-center h-full rounded-sm">
                      <ChevronLeft
                      className="w-7 h-10 p-0 text-blue-400"/>
                  </div>
                <div 
                  onClick={(e) => handleScroll(e,"right")} 
                  className="absolute border border-transparent active:border-blue-400 top-0 opacity-60 hover:opacity-100 -right-1 flex items-center justify-center h-full rounded-sm">
                      <ChevronRight className="w-7 h-10 p-0 text-blue-400 "/>
                </div>
              </>}
          </div>
          <div className="p-0 sm:p-1 w-full flex justify-center items-center">
            <div className="flex justify-center items-center  border-black w-full gap-2">
              <div className="flex flex-col gap-1 w-full justify-center min-h-[56px] sm:min-h-[104px] items-center">
                <h3 className="md:text-md  lg:text-lg flex items-center justify-center max-sm:text-xs px-1  w-full overflow-hidden text-center font-semibold whitespace-wrap">
                  <span 
                  style={{ fontFamily: "var(--font-bigjohnbold), sans-serif" }}
                  className="max-w-full whitespace-wrap">{name.toLocaleUpperCase()}</span>
                </h3>
                <div 
                style={{ fontFamily: " sans-serif" }}
                className="max-sm:max-w-[107px] max-sm:max-h-[20px] ">
                  <div className="flex justify-center sm:-mt-3 items-center gap-1 p-1 sm:p-1 border-[3.5px] w-fit scale-[0.40] sm:scale-[0.50] lg:scale-[0.60]  border-gray-400 rounded-sm max-sm:scaled-container ">
                    <div className="flex flex-col items-center justify-between">
                      <Ashoka className="h-2 w-2 stroke-blue-300 stroke-[7px] fill-blue-300" />
                      <span 
                      className="h-full text-[12px] text-blue-300">
                        IND
                      </span>
                    </div>
                    <span className="text-3xl whitespace-nowrap text-gray-400 font-bold ">
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
