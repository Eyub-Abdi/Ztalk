import { useCallback, useEffect, useMemo, useState } from "react";
import {
  FiRefreshCw,
  FiTrash2,
  FiClock,
  FiCalendar,
  FiCheck,
} from "react-icons/fi";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import type {
  EventInput,
  DateSelectArg,
  EventClickArg,
} from "@fullcalendar/core";

// Simple toast replacement
function useToast() {
  return {
    show: (options: {
      title: string;
      description?: string;
      status?: string;
    }) => {
      console.log(
        `[${options.status}] ${options.title}: ${options.description || ""}`
      );
    },
  };
}

const DAY_DEFS = [
  { key: "monday", label: "Mon", dayIndex: 1 },
  { key: "tuesday", label: "Tue", dayIndex: 2 },
  { key: "wednesday", label: "Wed", dayIndex: 3 },
  { key: "thursday", label: "Thu", dayIndex: 4 },
  { key: "friday", label: "Fri", dayIndex: 5 },
  { key: "saturday", label: "Sat", dayIndex: 6 },
  { key: "sunday", label: "Sun", dayIndex: 0 },
] as const;

type DayKey = (typeof DAY_DEFS)[number]["key"];
type AvailabilityState = Record<DayKey, string[]>;

const STORAGE_KEY = "tutor_availability_v1";
const START_HOUR = 7;
const END_HOUR = 21;

const createInitialAvailability = (): AvailabilityState =>
  DAY_DEFS.reduce(
    (acc, day) => ({ ...acc, [day.key]: [] }),
    {} as AvailabilityState
  );

function getNextDate(baseDate: Date, targetDayKey: DayKey): Date {
  const targetDay = DAY_DEFS.find((d) => d.key === targetDayKey);
  if (!targetDay) return baseDate;

  const currentDay = baseDate.getDay();
  let daysToAdd = targetDay.dayIndex - currentDay;
  if (daysToAdd < 0) daysToAdd += 7;

  const result = new Date(baseDate);
  result.setDate(result.getDate() + daysToAdd);
  return result;
}

function getDayKeyFromDate(date: Date): DayKey {
  const dayIndex = date.getDay();
  const dayDef = DAY_DEFS.find((d) => d.dayIndex === dayIndex);
  return dayDef ? dayDef.key : "monday";
}

const DEFAULT_WEEKDAY_SLOTS = [
  "09:00",
  "10:00",
  "11:00",
  "13:00",
  "14:00",
  "15:00",
];

const loadStoredAvailability = (): AvailabilityState => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createInitialAvailability();
    const parsed = JSON.parse(raw) as AvailabilityState;
    const base = createInitialAvailability();
    (Object.keys(parsed) as DayKey[]).forEach((day) => {
      if (day in base && Array.isArray(parsed[day])) {
        base[day] = parsed[day]
          .filter((slot) => typeof slot === "string")
          .sort();
      }
    });
    return base;
  } catch (err) {
    console.warn("Failed to read availability from storage", err);
    return createInitialAvailability();
  }
};

export default function Availability() {
  const [availability, setAvailability] = useState<AvailabilityState>(() =>
    loadStoredAvailability()
  );
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
  const toast = useToast();
  const brandColor = "#0d6efd";

  const weekStartDate = useMemo(() => new Date(), []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(availability));
      setLastSavedAt(new Date().toLocaleTimeString());
    } catch (err) {
      console.warn("Failed to persist availability", err);
      toast.show({
        title: "Could not save availability",
        description: "Storage quota may be full. Please try again later.",
        status: "warning",
      });
    }
  }, [availability, toast]);

  const events = useMemo<EventInput[]>(() => {
    const today = new Date();
    const eventsArray: EventInput[] = [];
    let eventId = 0;

    DAY_DEFS.forEach((dayDef) => {
      const slots = availability[dayDef.key];
      if (!slots || slots.length === 0) return;

      const targetDate = getNextDate(today, dayDef.key);
      const dateStr = targetDate.toISOString().split("T")[0];

      slots.forEach((timeSlot) => {
        const [hour] = timeSlot.split(":").map(Number);
        const startTime = `${dateStr}T${timeSlot}:00`;
        const endHour = hour + 1;
        const endTime = `${dateStr}T${endHour
          .toString()
          .padStart(2, "0")}:00:00`;

        eventsArray.push({
          id: `${eventId++}`,
          title: "Available",
          start: startTime,
          end: endTime,
          backgroundColor: brandColor,
          borderColor: brandColor,
          extendedProps: {
            dayKey: dayDef.key,
            timeSlot,
          },
        });
      });
    });

    return eventsArray;
  }, [availability, brandColor]);

  const handleDateSelect = useCallback(
    (selectInfo: DateSelectArg) => {
      const startDate = selectInfo.start;
      const dayKey = getDayKeyFromDate(startDate);
      const hour = startDate.getHours();
      const timeSlot = `${hour.toString().padStart(2, "0")}:00`;

      setAvailability((prev) => {
        const current = new Set(prev[dayKey]);
        if (current.has(timeSlot)) {
          current.delete(timeSlot);
          toast.show({
            title: "Slot removed",
            description: `${dayKey} at ${timeSlot} marked unavailable`,
            status: "info",
          });
        } else {
          current.add(timeSlot);
          toast.show({
            title: "Slot added",
            description: `${dayKey} at ${timeSlot} marked available`,
            status: "success",
          });
        }
        return {
          ...prev,
          [dayKey]: Array.from(current).sort(),
        };
      });

      selectInfo.view.calendar.unselect();
    },
    [toast]
  );

  const handleEventClick = useCallback(
    (clickInfo: EventClickArg) => {
      const { dayKey, timeSlot } = clickInfo.event.extendedProps as {
        dayKey: DayKey;
        timeSlot: string;
      };

      setAvailability((prev) => {
        const current = new Set(prev[dayKey]);
        current.delete(timeSlot);
        return {
          ...prev,
          [dayKey]: Array.from(current).sort(),
        };
      });

      toast.show({
        title: "Slot removed",
        description: `${dayKey} at ${timeSlot} marked unavailable`,
        status: "info",
      });
    },
    [toast]
  );

  const clearAll = useCallback(() => {
    setAvailability(createInitialAvailability());
    toast.show({
      title: "Availability cleared",
      status: "info",
    });
  }, [toast]);

  const setDefaultWeek = useCallback(() => {
    setAvailability((prev) => {
      const updated: AvailabilityState = { ...prev };
      DAY_DEFS.forEach((day, index) => {
        if (index < 5) {
          updated[day.key] = [...DEFAULT_WEEKDAY_SLOTS];
        } else {
          updated[day.key] = [];
        }
      });
      return updated;
    });
    toast.show({
      title: "Weekday template applied",
      description: "Slots added for Monday to Friday 09:00-15:00.",
      status: "success",
    });
  }, [toast]);

  // Count total slots
  const totalSlots = useMemo(() => {
    return Object.values(availability).reduce(
      (sum, slots) => sum + slots.length,
      0
    );
  }, [availability]);

  // Count days with availability
  const daysWithSlots = useMemo(() => {
    return Object.values(availability).filter((slots) => slots.length > 0)
      .length;
  }, [availability]);

  return (
    <div className="max-w-7xl mx-auto space-y-6 px-6 py-8">
      {/* Stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        <div className="group relative bg-gradient-to-br from-white via-gray-50/30 to-brand-50/10 rounded-2xl p-6 border border-gray-200 hover:border-brand-300 hover:shadow-xl hover:shadow-brand-500/10 hover:-translate-y-1 transition-all duration-300">
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Total Slots
              </span>
              <div className="p-1.5 bg-gradient-to-br from-brand-500/10 to-brand-600/5 rounded-lg opacity-60 group-hover:opacity-100 transition-opacity">
                <FiClock className="w-3 h-3 text-brand-600" />
              </div>
            </div>
            <span className="text-3xl font-bold bg-gradient-to-br from-brand-600 via-brand-500 to-brand-600 bg-clip-text text-transparent">
              {totalSlots}
            </span>
          </div>
        </div>

        <div className="group relative bg-gradient-to-br from-white via-gray-50/30 to-brand-50/10 rounded-2xl p-6 border border-gray-200 hover:border-brand-300 hover:shadow-xl hover:shadow-brand-500/10 hover:-translate-y-1 transition-all duration-300">
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Days Active
              </span>
              <div className="p-1.5 bg-gradient-to-br from-brand-500/10 to-brand-600/5 rounded-lg opacity-60 group-hover:opacity-100 transition-opacity">
                <FiCalendar className="w-3 h-3 text-brand-600" />
              </div>
            </div>
            <span className="text-3xl font-bold bg-gradient-to-br from-brand-600 via-brand-500 to-brand-600 bg-clip-text text-transparent">
              {daysWithSlots}
            </span>
          </div>
        </div>

        <div className="group relative bg-gradient-to-br from-white via-gray-50/30 to-brand-50/10 rounded-2xl p-6 border border-gray-200 hover:border-brand-300 hover:shadow-xl hover:shadow-brand-500/10 hover:-translate-y-1 transition-all duration-300">
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Hours/Week
              </span>
              <div className="p-1.5 bg-gradient-to-br from-brand-500/10 to-brand-600/5 rounded-lg opacity-60 group-hover:opacity-100 transition-opacity">
                <FiClock className="w-3 h-3 text-brand-600" />
              </div>
            </div>
            <span className="text-3xl font-bold bg-gradient-to-br from-brand-600 via-brand-500 to-brand-600 bg-clip-text text-transparent">
              {totalSlots}h
            </span>
          </div>
        </div>

        <div className="group relative bg-gradient-to-br from-white via-gray-50/30 to-brand-50/10 rounded-2xl p-6 border border-gray-200 hover:border-brand-300 hover:shadow-xl hover:shadow-brand-500/10 hover:-translate-y-1 transition-all duration-300">
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Status
              </span>
              <div className="p-1.5 bg-gradient-to-br from-brand-500/10 to-brand-600/5 rounded-lg opacity-60 group-hover:opacity-100 transition-opacity">
                <FiCheck className="w-3 h-3 text-brand-600" />
              </div>
            </div>
            <span className="text-3xl font-bold bg-gradient-to-br from-brand-600 via-brand-500 to-brand-600 bg-clip-text text-transparent">
              {totalSlots > 0 ? "Active" : "Empty"}
            </span>
            {lastSavedAt && (
              <span className="text-xs text-gray-500">Saved {lastSavedAt}</span>
            )}
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={setDefaultWeek}
          className="px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 bg-brand-500 text-white hover:bg-brand-600"
        >
          <FiRefreshCw className="w-4 h-4" />
          Apply weekday template
        </button>
        <button
          onClick={clearAll}
          className="px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300"
        >
          <FiTrash2 className="w-4 h-4" />
          Clear all
        </button>
        <p className="text-sm text-gray-500 ml-auto">
          Click on time slots to toggle availability
        </p>
      </div>

      {/* Calendar */}
      <div className="bg-white rounded-2xl p-5 border border-gray-200">
        <style>{`
          .fc {
            font-family: inherit;
          }
          .fc .fc-toolbar {
            margin-bottom: 1.5rem;
            flex-wrap: wrap;
            gap: 0.75rem;
          }
          .fc .fc-toolbar-title {
            font-size: 1.125rem;
            font-weight: 700;
            color: #111827;
          }
          .fc-button {
            background-color: ${brandColor} !important;
            border: none !important;
            text-transform: capitalize;
            font-size: 0.8125rem;
            font-weight: 500;
            padding: 0.5rem 1rem;
            border-radius: 0.5rem !important;
            outline: none !important;
            box-shadow: none !important;
            transition: all 0.2s !important;
          }
          .fc-button:hover {
            background-color: #0b5ed7 !important;
          }
          .fc-button:focus {
            outline: none !important;
            box-shadow: 0 0 0 3px rgba(13, 110, 253, 0.25) !important;
          }
          .fc-button-primary:not(:disabled).fc-button-active {
            background-color: ${brandColor} !important;
            font-weight: 600;
          }
          .fc-button-group {
            border-radius: 0.5rem;
            overflow: hidden;
          }
          .fc-button-group .fc-button {
            opacity: 0.8;
            border-radius: 0 !important;
          }
          .fc-button-group .fc-button:first-child {
            border-radius: 0.5rem 0 0 0.5rem !important;
          }
          .fc-button-group .fc-button:last-child {
            border-radius: 0 0.5rem 0.5rem 0 !important;
          }
          .fc-button-group .fc-button-active {
            opacity: 1 !important;
            font-weight: 600 !important;
          }
          .fc-col-header {
            background-color: #f9fafb;
          }
          .fc-col-header-cell {
            padding: 1rem 0.5rem;
            font-weight: 600;
            font-size: 0.75rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: #6b7280;
            border-color: #e5e7eb !important;
          }
          .fc-scrollgrid {
            border-radius: 0.5rem;
            overflow: hidden;
            border-color: #e5e7eb !important;
          }
          .fc-scrollgrid td, .fc-scrollgrid th {
            border-color: #e5e7eb !important;
          }
          .fc-timegrid-slot {
            height: 5.5rem;
          }
          .fc-timegrid-slot:hover {
            background-color: rgba(13, 110, 253, 0.05) !important;
          }
          .fc-timegrid-axis {
            width: 70px;
            padding-right: 8px;
          }
          .fc-timegrid-slot-label {
            padding-right: 8px;
            font-size: 0.75rem;
            color: #9ca3af;
            font-weight: 500;
          }
          .fc-event {
            cursor: pointer;
            font-size: 0.75rem;
            border-radius: 0 !important;
            border: none !important;
            font-weight: 500;
          }
          .fc-daygrid-day {
            cursor: pointer;
          }
          .fc-daygrid-day:hover {
            background-color: rgba(13, 110, 253, 0.05) !important;
          }
          .fc-highlight {
            background-color: ${brandColor} !important;
            opacity: 0.15;
            border-radius: 0;
          }
          .fc-timegrid-event {
            background-color: #10b981 !important;
            border: none !important;
            border-radius: 0 !important;
          }
          .fc-timegrid-event:hover {
            background-color: #059669 !important;
          }
          .fc-timegrid-now-indicator-line {
            border-color: ${brandColor};
            border-width: 2px;
          }
          .fc-timegrid-now-indicator-arrow {
            border-color: ${brandColor};
            border-width: 5px;
          }
          .fc-day-today {
            background-color: rgba(13, 110, 253, 0.03) !important;
          }
          .fc-day-today .fc-col-header-cell-cushion {
            color: ${brandColor};
            font-weight: 700;
          }
        `}</style>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          initialDate={weekStartDate}
          firstDay={weekStartDate.getDay()}
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "timeGridWeek,timeGridDay",
          }}
          slotMinTime={`${START_HOUR.toString().padStart(2, "0")}:00:00`}
          slotMaxTime={`${(END_HOUR + 1).toString().padStart(2, "0")}:00:00`}
          allDaySlot={false}
          selectable={true}
          selectMirror={true}
          select={handleDateSelect}
          eventClick={handleEventClick}
          events={events}
          height="auto"
          slotDuration="01:00:00"
          slotLabelInterval="01:00"
          nowIndicator={true}
          slotLabelFormat={{
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }}
          eventTimeFormat={{
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }}
        />
      </div>
    </div>
  );
}
