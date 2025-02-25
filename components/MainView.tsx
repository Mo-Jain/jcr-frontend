"use client"
import {
  useEventStore,
  useViewStore,
} from "@/lib/store";
import MonthView from "./month-view";
import SideBar from "./sidebar/SideBar";
import WeekView from "./week-view";
import DayView from "./day-view";
import { EventSummaryPopup } from "./event-summary-popover";


export default function MainView() {
  const { selectedView } = useViewStore();

  const {
    isEventSummaryOpen,
    closeEventSummary,
    selectedEvent,
  } = useEventStore();

  return (
    <div className="flex scrollbar-hide">
      {/* SideBar */}
    
      <SideBar />

      <div className="w-full flex-1">
        {selectedView === "month" && <MonthView />}
        {selectedView === "week" && <WeekView />}
        {selectedView === "day" && <DayView />}
      </div>
      

      {isEventSummaryOpen && selectedEvent && (
        <EventSummaryPopup
          isOpen={isEventSummaryOpen}
          onClose={closeEventSummary}
          event={selectedEvent}
        />
      )}
    </div>
  );
}
