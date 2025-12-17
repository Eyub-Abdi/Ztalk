import { useCallback, useEffect, useMemo, useState, useRef } from "react";
import {
  FiChevronLeft,
  FiChevronRight,
  FiRefreshCw,
  FiTrash2,
  FiClock,
  FiCalendar,
  FiCheck,
} from "react-icons/fi";
import clsx from "clsx";

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

// Types
interface AvailabilitySlot {
  id: string;
  dayKey: string;
  start: string;
  end: string;
}

interface LessonEvent {
  id: string;
  title: string;
  studentName: string;
  start: Date;
  end: Date;
  color: "yellow" | "blue" | "green" | "purple";
}

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const HOURS = Array.from({ length: 12 }, (_, i) => i + 7); // 7am to 6pm
const STORAGE_KEY = "tutor_availability_v2";

// Get timezone string
function getTimezoneString(): string {
  const offset = -new Date().getTimezoneOffset();
  const hours = Math.floor(Math.abs(offset) / 60);
  const minutes = Math.abs(offset) % 60;
  const sign = offset >= 0 ? "+" : "-";
  return `UTC${sign}${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}`;
}

// Format time
function formatTime(hours: number, minutes: number = 0): string {
  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}`;
}

// Parse time string to minutes
function timeToMinutes(time: string): number {
  const [hrs, mins] = time.split(":").map(Number);
  return hrs * 60 + mins;
}

// Get week dates
function getWeekDates(baseDate: Date): Date[] {
  const dates: Date[] = [];
  const startOfWeek = new Date(baseDate);
  const day = startOfWeek.getDay();
  startOfWeek.setDate(startOfWeek.getDate() - day);

  for (let i = 0; i < 7; i++) {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    dates.push(date);
  }
  return dates;
}

// Mock lessons data
const mockLessons: LessonEvent[] = [
  {
    id: "1",
    title: "Swahili Lesson",
    studentName: "סול שושה",
    start: new Date(2025, 11, 15, 14, 30),
    end: new Date(2025, 11, 15, 15, 30),
    color: "yellow",
  },
];

// Initial availability state
const createInitialAvailability = (): AvailabilitySlot[] => [];

const loadStoredAvailability = (): AvailabilitySlot[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createInitialAvailability();
    return JSON.parse(raw) as AvailabilitySlot[];
  } catch {
    return createInitialAvailability();
  }
};

export default function Availability() {
  const [availability, setAvailability] = useState<AvailabilitySlot[]>(() =>
    loadStoredAvailability()
  );
  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    const today = new Date();
    const day = today.getDay();
    const start = new Date(today);
    start.setDate(today.getDate() - day);
    return start;
  });
  const [currentTime, setCurrentTime] = useState(new Date());
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
  const calendarRef = useRef<HTMLDivElement>(null);
  const toast = useToast();

  const weekDates = useMemo(
    () => getWeekDates(currentWeekStart),
    [currentWeekStart]
  );
  const timezone = useMemo(() => getTimezoneString(), []);

  // Update current time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // Save availability to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(availability));
      setLastSavedAt(new Date().toLocaleTimeString());
    } catch (err) {
      console.warn("Failed to persist availability", err);
    }
  }, [availability]);

  // Navigation
  const goToPreviousWeek = useCallback(() => {
    setCurrentWeekStart((prev) => {
      const newDate = new Date(prev);
      newDate.setDate(prev.getDate() - 7);
      return newDate;
    });
  }, []);

  const goToNextWeek = useCallback(() => {
    setCurrentWeekStart((prev) => {
      const newDate = new Date(prev);
      newDate.setDate(prev.getDate() + 7);
      return newDate;
    });
  }, []);

  const goToToday = useCallback(() => {
    const today = new Date();
    const day = today.getDay();
    const start = new Date(today);
    start.setDate(today.getDate() - day);
    setCurrentWeekStart(start);
  }, []);

  // Toggle availability for a specific hour
  const toggleHourAvailability = useCallback(
    (dayIndex: number, hour: number) => {
      const dateKey = weekDates[dayIndex].toISOString().split("T")[0];
      const hourStr = formatTime(hour);
      const nextHourStr = formatTime(hour + 1);

      // Check if this hour is already available
      const existingSlot = availability.find(
        (slot) =>
          slot.dayKey === dateKey &&
          slot.start === hourStr &&
          slot.end === nextHourStr
      );

      if (existingSlot) {
        // Remove the slot
        setAvailability((prev) => prev.filter((s) => s.id !== existingSlot.id));
      } else {
        // Add the slot
        const newSlot: AvailabilitySlot = {
          id: `${Date.now()}`,
          dayKey: dateKey,
          start: hourStr,
          end: nextHourStr,
        };
        setAvailability((prev) => [...prev, newSlot]);
      }
    },
    [weekDates, availability]
  );

  // Clear all
  const clearAll = useCallback(() => {
    setAvailability([]);
    toast.show({
      title: "Availability cleared",
      status: "info",
    });
  }, [toast]);

  // Set default availability
  const setDefaultWeek = useCallback(() => {
    const slots: AvailabilitySlot[] = [];
    weekDates.forEach((date, idx) => {
      // Skip Sunday (0) and Saturday (6)
      if (idx !== 0 && idx !== 6) {
        slots.push({
          id: `default-${idx}`,
          dayKey: date.toISOString().split("T")[0],
          start: "09:00",
          end: "17:00",
        });
      }
    });
    setAvailability(slots);
    toast.show({
      title: "Default availability set",
      description: "Mon-Fri 09:00 - 17:00",
      status: "success",
    });
  }, [weekDates, toast]);

  // Get slots for a specific day
  const getSlotsForDay = useCallback(
    (dayIndex: number): AvailabilitySlot[] => {
      const dateKey = weekDates[dayIndex].toISOString().split("T")[0];
      return availability.filter((slot) => slot.dayKey === dateKey);
    },
    [availability, weekDates]
  );

  // Get lessons for a specific day
  const getLessonsForDay = useCallback(
    (dayIndex: number): LessonEvent[] => {
      const date = weekDates[dayIndex];
      return mockLessons.filter(
        (lesson) =>
          lesson.start.getDate() === date.getDate() &&
          lesson.start.getMonth() === date.getMonth() &&
          lesson.start.getFullYear() === date.getFullYear()
      );
    },
    [weekDates]
  );

  // Check if date is today
  const isToday = useCallback((date: Date): boolean => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  }, []);

  // Check if a specific hour on a date is in the past
  const isPastHour = useCallback((date: Date, hour: number): boolean => {
    const now = new Date();
    const cellTime = new Date(date);
    cellTime.setHours(hour, 0, 0, 0);
    return cellTime < now;
  }, []);

  // Calculate current time position
  const currentTimePosition = useMemo(() => {
    const hours = currentTime.getHours();
    const minutes = currentTime.getMinutes();
    const totalMinutes = hours * 60 + minutes;
    const startMinutes = 7 * 60; // 7am
    const endMinutes = 19 * 60; // 7pm
    if (totalMinutes < startMinutes || totalMinutes > endMinutes) return null;
    return ((totalMinutes - startMinutes) / (endMinutes - startMinutes)) * 100;
  }, [currentTime]);

  // Stats
  const totalSlots = availability.length;
  const daysWithSlots = new Set(availability.map((s) => s.dayKey)).size;
  const totalHours = availability.reduce((sum, slot) => {
    const startMins = timeToMinutes(slot.start);
    const endMins = timeToMinutes(slot.end);
    return sum + (endMins - startMins) / 60;
  }, 0);

  return (
    <div className="space-y-6">
      {/* Stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Total Slots
            </span>
            <FiClock className="w-4 h-4 text-brand-500" />
          </div>
          <span className="text-2xl font-bold text-gray-900">{totalSlots}</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Days Active
            </span>
            <FiCalendar className="w-4 h-4 text-brand-500" />
          </div>
          <span className="text-2xl font-bold text-gray-900">
            {daysWithSlots}
          </span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Hours/Week
            </span>
            <FiClock className="w-4 h-4 text-brand-500" />
          </div>
          <span className="text-2xl font-bold text-gray-900">
            {totalHours.toFixed(1)}h
          </span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Status
            </span>
            <FiCheck className="w-4 h-4 text-brand-500" />
          </div>
          <span className="text-2xl font-bold text-gray-900">
            {totalSlots > 0 ? "Active" : "Empty"}
          </span>
          {lastSavedAt && (
            <p className="text-xs text-gray-400 mt-1">Saved {lastSavedAt}</p>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={setDefaultWeek}
          className="px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 bg-brand-500 text-white hover:bg-brand-600"
        >
          <FiRefreshCw className="w-4 h-4" />
          Apply default
        </button>
        <button
          onClick={clearAll}
          className="px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
        >
          <FiTrash2 className="w-4 h-4" />
          Clear all
        </button>
      </div>

      {/* Calendar */}
      <div
        className="bg-white rounded-2xl border border-gray-200 overflow-hidden"
        ref={calendarRef}
      >
        {/* Calendar Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <button
              onClick={goToPreviousWeek}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <FiChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={goToNextWeek}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <FiChevronRight className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={goToToday}
              className="px-3 py-1.5 rounded-lg text-sm font-medium bg-gray-100 hover:bg-gray-200 transition-colors text-gray-700"
            >
              Today
            </button>
          </div>
          <h2 className="text-lg font-semibold text-gray-900">
            {weekDates[0].toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </h2>
          <div className="w-32" /> {/* Spacer for centering */}
        </div>

        {/* Calendar Grid */}
        <div className="relative">
          {/* Day Headers */}
          <div className="grid grid-cols-[70px_repeat(7,1fr)] border-b border-gray-100">
            <div className="p-3 text-xs font-medium text-gray-500">
              {timezone}
            </div>
            {weekDates.map((date, idx) => (
              <div
                key={idx}
                className={clsx(
                  "p-3 text-center border-l border-gray-100",
                  isToday(date) && "bg-brand-50/50"
                )}
              >
                <div
                  className={clsx(
                    "text-xs font-medium mb-1",
                    isToday(date) ? "text-brand-600" : "text-gray-500"
                  )}
                >
                  {DAYS_OF_WEEK[idx]}
                </div>
                <div
                  className={clsx(
                    "text-xl font-bold",
                    isToday(date) ? "text-brand-600" : "text-gray-900"
                  )}
                >
                  {date.getDate()}
                </div>
              </div>
            ))}
          </div>

          {/* Time Grid */}
          <div className="relative">
            {HOURS.map((hour) => (
              <div
                key={hour}
                className="grid grid-cols-[70px_repeat(7,1fr)] border-b border-gray-100 border-dashed"
                style={{ height: "80px" }}
              >
                {/* Time label */}
                <div className="p-2 text-xs font-medium text-gray-400 text-right pr-3">
                  {hour}
                </div>

                {/* Day columns */}
                {weekDates.map((date, dayIdx) => {
                  const daySlots = getSlotsForDay(dayIdx);
                  const dayLessons = getLessonsForDay(dayIdx);

                  // Check if this hour falls within any availability slot
                  const activeSlot = daySlots.find((slot) => {
                    const slotStart = timeToMinutes(slot.start);
                    const slotEnd = timeToMinutes(slot.end);
                    const hourStart = hour * 60;
                    const hourEnd = (hour + 1) * 60;
                    return slotStart < hourEnd && slotEnd > hourStart;
                  });

                  // Check if this is the start hour of a slot
                  const isSlotStart = daySlots.find((slot) => {
                    const slotStartHour = parseInt(slot.start.split(":")[0]);
                    return slotStartHour === hour;
                  });

                  // Check for lessons in this hour
                  const lessonInHour = dayLessons.find((lesson) => {
                    const lessonHour = lesson.start.getHours();
                    return lessonHour === hour;
                  });

                  // Check if this hour is in the past
                  const isPast = isPastHour(date, hour);

                  return (
                    <div
                      key={dayIdx}
                      className={clsx(
                        "relative border-l border-gray-100 group transition-colors",
                        isPast && "bg-gray-50 cursor-not-allowed",
                        !isPast && "cursor-pointer",
                        !isPast && isToday(date) && !activeSlot && "bg-brand-50/30",
                        !isPast && activeSlot && "bg-green-100 hover:bg-green-200",
                        !isPast && !activeSlot && "hover:bg-green-50",
                        isPast && activeSlot && "bg-green-50/50"
                      )}
                      onClick={() => {
                        if (!isPast) {
                          toggleHourAvailability(dayIdx, hour);
                        }
                      }}
                    >
                      {/* Availability time display */}
                      {activeSlot && (
                        <div className="absolute top-1 left-1 right-1 z-10">
                          <div className="px-2 py-1 text-xs text-gray-600">
                            {activeSlot.start} - {activeSlot.end}
                          </div>
                        </div>
                      )}

                      {/* Lesson event */}
                      {lessonInHour && (
                        <div
                          className={clsx(
                            "absolute left-1 right-1 rounded-lg p-2 z-20",
                            "border-l-4",
                            lessonInHour.color === "yellow" &&
                              "bg-amber-50 border-amber-400",
                            lessonInHour.color === "blue" &&
                              "bg-blue-50 border-blue-400",
                            lessonInHour.color === "green" &&
                              "bg-green-50 border-green-400",
                            lessonInHour.color === "purple" &&
                              "bg-purple-50 border-purple-400"
                          )}
                          style={{
                            top: `${
                              (lessonInHour.start.getMinutes() / 60) * 100
                            }%`,
                            height: `${
                              ((lessonInHour.end.getTime() -
                                lessonInHour.start.getTime()) /
                                (1000 * 60 * 60)) *
                              100
                            }%`,
                            minHeight: "60px",
                          }}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <div
                              className={clsx(
                                "w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold",
                                lessonInHour.color === "yellow" &&
                                  "bg-amber-500",
                                lessonInHour.color === "blue" && "bg-blue-500"
                              )}
                            >
                              {lessonInHour.studentName[0]}
                            </div>
                            <span className="text-sm font-medium text-gray-900 truncate">
                              {lessonInHour.studentName}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500">
                            {formatTime(
                              lessonInHour.start.getHours(),
                              lessonInHour.start.getMinutes()
                            )}{" "}
                            -{" "}
                            {formatTime(
                              lessonInHour.end.getHours(),
                              lessonInHour.end.getMinutes()
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}

            {/* Current time indicator */}
            {currentTimePosition !== null && (
              <div
                className="absolute left-[70px] right-0 z-30 pointer-events-none flex items-center"
                style={{ top: `${currentTimePosition}%` }}
              >
                <div className="bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded">
                  {formatTime(currentTime.getHours(), currentTime.getMinutes())}
                </div>
                <div className="flex-1 h-0.5 bg-red-500" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
