import { Input } from "../ui/input";
import  CarFrontIcon  from "@/public/car-front.svg";

export default function SearchUsers() {
  return (
    <div className="relative ">
      <CarFrontIcon className="absolute stroke-[6px] left-1 top-2 h-4 w-6 fill-slate-600 stroke-slate-600 dark:fill-slate-300 dark:stroke-slate-300" />
      <Input
        type="search"
        placeholder="Search for Cars"
        className="w-full rounded-lg pl-8 bg-slate-100 dark:bg-muted dark:placeholder:text-slate-300 dark:text-slate-300 placeholder:text-slate-600 border-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-ring focus-visible:ring-offset-0"
      />
    </div>
  )
}
