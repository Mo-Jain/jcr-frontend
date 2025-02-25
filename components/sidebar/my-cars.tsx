"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import CarsFilters from "./cars-filter";



export default function MyCars() {
 
  
  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="item-1" className="border-border">
        <AccordionTrigger className="justify-normal gap-32 text-sm hover:no-underline">
          My Cars
        </AccordionTrigger>
        <AccordionContent className="grid gap-2 ">
          <CarsFilters/>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
