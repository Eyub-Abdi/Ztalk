import { useCallback, useEffect, useMemo, useState } from "react";
import { FiRefreshCw, FiTrash2 } from "react-icons/fi";
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

  return (
    <div className="space-y-6">
      {/* Header card */}
      <div className="card p-6">
        <div className="space-y-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Availability Calendar
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Click on time slots to toggle your availability. Click existing
              slots to remove them.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={setDefaultWeek}
              className="btn btn-outline flex items-center gap-2"
            >
              <FiRefreshCw className="w-4 h-4" />
              Apply weekday template
            </button>
            <button
              onClick={clearAll}
              className="btn btn-outline text-red-600 border-red-300 hover:bg-red-50 flex items-center gap-2"
            >
              <FiTrash2 className="w-4 h-4" />
              Clear all
            </button>
            {lastSavedAt && (
              <span className="inline-flex items-center px-3 py-2 text-sm font-medium rounded-md bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                Auto-saved at {lastSavedAt}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Calendar */}
      <div className="card p-4 md:p-5">
        <style>{`
          .fc {
            font-family: inherit;
          }
          .fc-button {
            background-color: ${brandColor} !important;
            border: none !important;
            text-transform: capitalize;
            font-size: 0.875rem;
            padding: 0.5rem 1rem;
            outline: none !important;
            box-shadow: none !important;
          }
          .fc-button:hover {
            opacity: 0.9;
          }
          .fc-button:focus {
            outline: none !important;
            box-shadow: none !important;
          }
          .fc-button-primary:not(:disabled).fc-button-active {
            background-color: ${brandColor} !important;
            opacity: 1;
            font-weight: 600;
          }
          .fc-button-group .fc-button {
            opacity: 0.7;
          }
          .fc-button-group .fc-button-active {
            opacity: 1 !important;
            font-weight: 600 !important;
          }
          .fc-col-header-cell {
            padding: 0.75rem;
            font-weight: 600;
            font-size: 0.875rem;
            text-transform: uppercase;
          }
          .fc-timegrid-slot {
            height: 2rem;
          }
          .fc-timegrid-axis {
            width: 90px;
            padding-right: 16px;
          }
          .fc-timegrid-slot-label {
            padding-right: 16px;
          }
          .fc-event {
            cursor: pointer;
            font-size: 0.75rem;
          }
          .fc-daygrid-day {
            cursor: pointer;
          }
          .fc-highlight {
            background-color: ${brandColor} !important;
            opacity: 0.3;
          }
          .fc-timegrid-event {
            background-color: #48BB78 !important;
            border-color: #48BB78 !important;
          }
          .fc-timegrid-now-indicator-line {
            border-color: #E53E3E;
            border-width: 2px;
          }
          .fc-timegrid-now-indicator-arrow {
            border-color: #E53E3E;
            border-width: 2px;
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
          slotDuration="00:30:00"
          slotLabelInterval="00:30"
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
