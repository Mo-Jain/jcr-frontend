import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calculateCost(
  startDate: Date | string,
  endDate: Date | string,
  startTime: string,
  endTime: string,
  pricePer24Hours: number,
) {
  const startDateTime = new Date(startDate);
  const endDateTime = new Date(endDate);

  const [startHour, startMinute] = startTime.split(":").map(Number);
  const [endHour, endMinute] = endTime.split(":").map(Number);

  startDateTime.setHours(startHour, startMinute, 0, 0);
  endDateTime.setHours(endHour, endMinute, 0, 0);

  const timeDifference = endDateTime.getTime() - startDateTime.getTime();
  const hoursDifference = timeDifference / (1000 * 60 * 60);
  const cost = (hoursDifference / 24) * pricePer24Hours;

  return Math.floor(cost);
}
