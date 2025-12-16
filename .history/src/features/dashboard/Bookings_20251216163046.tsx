import { useCallback, useMemo, useState } from "react";
import clsx from "clsx";
import {
  FiCalendar,
  FiCheckCircle,
  FiEdit3,
  FiPlay,
  FiUser,
  FiX,
} from "react-icons/fi";
import type { LessonSummary } from "../lessons/api/lessonTypes";
import {
  useEndLesson,
  useLessons,
  useStartLesson,
} from "../lessons/api/useLessons";
import { useCreateReschedule } from "../lessons/api/useBookingReschedule";

// Toast hook replacement - simple notification system
function useToast() {
  return {
    show: (options: {
      title: string;
      description?: string;
      status?: string;
    }) => {
      // In a real app, you'd use a toast library or context
      console.log(
        `[${options.status}] ${options.title}: ${options.description || ""}`
      );
    },
  };
}

// Status badge colors
const statusColors: Record<string, { bg: string; text: string }> = {
  pending: {
    bg: "bg-gradient-to-r from-orange-100 to-amber-100 dark:from-orange-900 dark:to-amber-900 border border-orange-200/50",
    text: "text-orange-700 dark:text-orange-200 font-semibold",
  },
  awaiting_confirmation: {
    bg: "bg-gradient-to-r from-yellow-100 to-amber-100 dark:from-yellow-900 dark:to-amber-900 border border-yellow-200/50",
    text: "text-yellow-700 dark:text-yellow-200 font-semibold",
  },
  reschedule_requested: {
    bg: "bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 border border-purple-200/50",
    text: "text-purple-700 dark:text-purple-200 font-semibold",
  },
  confirmed: {
    bg: "bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900 dark:to-emerald-900 border border-green-200/50",
    text: "text-green-700 dark:text-green-200 font-semibold",
  },
  scheduled: {
    bg: "bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900 dark:to-emerald-900 border border-green-200/50",
    text: "text-green-700 dark:text-green-200 font-semibold",
  },
  in_progress: {
    bg: "bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-900 dark:to-cyan-900 border border-blue-200/50",
    text: "text-blue-700 dark:text-blue-200 font-semibold",
  },
  completed: {
    bg: "bg-gradient-to-r from-gray-100 to-slate-100 dark:from-gray-700 dark:to-slate-700 border border-gray-200/50",
    text: "text-gray-700 dark:text-gray-200 font-semibold",
  },
  cancelled: {
    bg: "bg-gradient-to-r from-red-100 to-rose-100 dark:from-red-900 dark:to-rose-900 border border-red-200/50",
    text: "text-red-700 dark:text-red-200 font-semibold",
  },
  no_show: {
    bg: "bg-gradient-to-r from-red-100 to-rose-100 dark:from-red-900 dark:to-rose-900 border border-red-200/50",
    text: "text-red-700 dark:text-red-200 font-semibold",
  },
  declined: {
    bg: "bg-gradient-to-r from-red-100 to-rose-100 dark:from-red-900 dark:to-rose-900 border border-red-200/50",
    text: "text-red-700 dark:text-red-200 font-semibold",
  },
};

const statusLabels: Record<string, string> = {
  pending: "Pending",
  awaiting_confirmation: "Awaiting confirmation",
  reschedule_requested: "Reschedule requested",
  confirmed: "Confirmed",
  scheduled: "Scheduled",
  in_progress: "In progress",
  completed: "Completed",
  cancelled: "Cancelled",
  no_show: "No show",
  declined: "Declined",
};

export default function Bookings() {
  const toast = useToast();
  const { data, isLoading, isError, error } = useLessons({
    mine: true,
  });
  const bookings = useMemo(() => data ?? [], [data]);

  const startLesson = useStartLesson();
  const endLesson = useEndLesson();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<LessonSummary | null>(
    null
  );
  const [newStart, setNewStart] = useState("");
  const [newEnd, setNewEnd] = useState("");
  const [reason, setReason] = useState("");
  const { mutateAsync: rescheduleAsync, isPending } = useCreateReschedule();

  const attentionStatuses = useMemo(
    () => new Set(["pending", "awaiting_confirmation", "reschedule_requested"]),
    []
  );
  const pastStatuses = useMemo(
    () => new Set(["completed", "cancelled", "no_show", "declined"]),
    []
  );

  type FilterOption = "attention" | "upcoming" | "past" | "all";
  const [filter, setFilter] = useState<FilterOption>("attention");

  const stats = useMemo(() => {
    const now = Date.now();
    const startOfWeek = new Date();
    startOfWeek.setHours(0, 0, 0, 0);
    const day = startOfWeek.getDay();
    startOfWeek.setDate(startOfWeek.getDate() - day);

    let upcoming = 0;
    let attention = 0;
    let completedThisWeek = 0;
    let past = 0;
    let nextLesson: LessonSummary | null = null;

    bookings.forEach((booking) => {
      const status = (booking.status ?? "").toLowerCase();
      const startMs = Date.parse(booking.scheduled_start);
      if (Number.isNaN(startMs)) return;

      if (!pastStatuses.has(status) && startMs >= now) {
        upcoming += 1;
        if (!nextLesson || startMs < Date.parse(nextLesson.scheduled_start)) {
          nextLesson = booking;
        }
      }

      if (attentionStatuses.has(status)) {
        attention += 1;
      }

      if (status === "completed" && startMs >= startOfWeek.getTime()) {
        completedThisWeek += 1;
      }

      if (pastStatuses.has(status) || startMs < now) {
        past += 1;
      }
    });

    return { upcoming, attention, completedThisWeek, nextLesson, past };
  }, [attentionStatuses, bookings, pastStatuses]);

  const filters = useMemo(
    () => [
      {
        label: "Needs attention",
        value: "attention" as const,
        count: stats.attention,
      },
      { label: "Upcoming", value: "upcoming" as const, count: stats.upcoming },
      { label: "Past", value: "past" as const, count: stats.past },
      { label: "All", value: "all" as const, count: bookings.length },
    ],
    [bookings.length, stats.attention, stats.past, stats.upcoming]
  );

  const formatDateTime = useMemo(
    () =>
      new Intl.DateTimeFormat(undefined, {
        weekday: "short",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      }),
    []
  );

  const relativeLabel = useCallback((iso: string) => {
    const targetMs = Date.parse(iso);
    if (Number.isNaN(targetMs)) return "";
    const diffMs = targetMs - Date.now();
    const diffMinutes = Math.round(diffMs / 60000);
    if (Math.abs(diffMinutes) < 60) {
      if (diffMinutes === 0) return "happening now";
      return diffMinutes > 0
        ? `in ${diffMinutes} min`
        : `${Math.abs(diffMinutes)} min ago`;
    }
    const diffHours = Math.round(diffMinutes / 60);
    if (Math.abs(diffHours) < 24) {
      return diffHours > 0
        ? `in ${diffHours} hr`
        : `${Math.abs(diffHours)} hr ago`;
    }
    const diffDays = Math.round(diffHours / 24);
    return diffDays > 0
      ? `in ${diffDays} days`
      : `${Math.abs(diffDays)} days ago`;
  }, []);

  const filteredBookings = useMemo(() => {
    const now = Date.now();
    const sorted = [...bookings].sort((a, b) => {
      const diff =
        Date.parse(a.scheduled_start) - Date.parse(b.scheduled_start);
      return filter === "past" ? -diff : diff;
    });

    return sorted.filter((booking) => {
      const status = (booking.status ?? "").toLowerCase();
      const startMs = Date.parse(booking.scheduled_start);
      if (filter === "attention") return attentionStatuses.has(status);
      if (filter === "upcoming") {
        return (
          !Number.isNaN(startMs) && startMs >= now && !pastStatuses.has(status)
        );
      }
      if (filter === "past") {
        return (
          pastStatuses.has(status) || (!Number.isNaN(startMs) && startMs < now)
        );
      }
      return true;
    });
  }, [attentionStatuses, bookings, filter, pastStatuses]);

  const openReschedule = useCallback((booking: LessonSummary) => {
    setSelectedBooking(booking);
    const startValue = formatDatetimeLocal(booking.scheduled_start);
    const endValue = formatDatetimeLocal(booking.scheduled_end);
    setNewStart(startValue);
    setNewEnd(endValue);
    setReason("");
    setIsModalOpen(true);
  }, []);

  const resetRescheduleState = useCallback(() => {
    setSelectedBooking(null);
    setNewStart("");
    setNewEnd("");
    setReason("");
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    resetRescheduleState();
  }, [resetRescheduleState]);

  const submitReschedule = useCallback(async () => {
    if (!selectedBooking) return;

    if (!newStart || !newEnd) {
      toast.show({
        title: "Missing times",
        description: "Add both a start and end time before submitting.",
        status: "warning",
      });
      return;
    }

    const startIso = toIsoString(newStart);
    const endIso = toIsoString(newEnd);
    if (!startIso || !endIso) {
      toast.show({
        title: "Invalid times",
        description: "Double-check the dates you selected and try again.",
        status: "error",
      });
      return;
    }

    if (Date.parse(endIso) <= Date.parse(startIso)) {
      toast.show({
        title: "End time must be after start time",
        status: "error",
      });
      return;
    }

    try {
      await rescheduleAsync({
        lesson_id: selectedBooking.id,
        new_start: startIso,
        new_end: endIso,
        reason,
      });
      toast.show({
        title: "Reschedule requested",
        description: "We'll notify the student about the proposed change.",
        status: "success",
      });
      handleCloseModal();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong.";
      toast.show({
        title: "Unable to submit",
        description: message,
        status: "error",
      });
    }
  }, [
    handleCloseModal,
    newEnd,
    newStart,
    reason,
    rescheduleAsync,
    selectedBooking,
    toast,
  ]);

  const handleStartLesson = useCallback(
    (booking: LessonSummary) => {
      startLesson.mutate(booking.id, {
        onSuccess: () => {
          toast.show({
            title: "Lesson started",
            description: "Good luck with your session!",
            status: "success",
          });
        },
        onError: (err: unknown) => {
          const message =
            err instanceof Error ? err.message : "Unable to start the lesson.";
          toast.show({
            title: "Start failed",
            description: message,
            status: "error",
          });
        },
      });
    },
    [startLesson, toast]
  );

  const handleEndLesson = useCallback(
    (booking: LessonSummary) => {
      endLesson.mutate(booking.id, {
        onSuccess: () => {
          toast.show({
            title: "Lesson completed",
            description: "Nice work—log any notes while it's fresh.",
            status: "success",
          });
        },
        onError: (err: unknown) => {
          const message =
            err instanceof Error
              ? err.message
              : "Unable to complete the lesson.";
          toast.show({
            title: "Complete failed",
            description: message,
            status: "error",
          });
        },
      });
    },
    [endLesson, toast]
  );

  const nextLessonText = stats.nextLesson
    ? `${formatDateTime.format(
        new Date((stats.nextLesson as LessonSummary).scheduled_start)
      )}`
    : "No upcoming lessons";

  const nextLessonRelative = stats.nextLesson
    ? relativeLabel((stats.nextLesson as LessonSummary).scheduled_start)
    : "Add availability so students can book you.";

  const errorMessage = error instanceof Error ? error.message : null;

  return (
    <div className="max-w-7xl mx-auto space-y-6 px-6 py-8">
      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Upcoming */}
        <div className="group bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 border border-gray-200/60 dark:border-gray-700/50 transition-all hover:shadow-xl hover:shadow-brand-500/10 hover:border-brand-300/50 hover:-translate-y-0.5">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-brand-500 to-brand-600 rounded-xl text-white shadow-lg shadow-brand-500/30">
              <FiCalendar className="w-5 h-5" />
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-400 font-semibold uppercase tracking-wide">
              Upcoming lessons
            </span>
          </div>
          <p className="text-4xl font-bold bg-gradient-to-br from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            {stats.upcoming}
          </p>
        </div>

        {/* Needs attention */}
        <div className="group bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 border border-gray-200/60 dark:border-gray-700/50 transition-all hover:shadow-xl hover:shadow-orange-500/10 hover:border-orange-300/50 hover:-translate-y-0.5">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl text-white shadow-lg shadow-orange-500/30">
              <FiEdit3 className="w-5 h-5" />
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-400 font-semibold uppercase tracking-wide">
              Needs attention
            </span>
          </div>
          <p className="text-4xl font-bold bg-gradient-to-br from-orange-600 to-amber-600 bg-clip-text text-transparent">
            {stats.attention}
          </p>
        </div>

        {/* Completed this week */}
        <div className="group bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 border border-gray-200/60 dark:border-gray-700/50 transition-all hover:shadow-xl hover:shadow-green-500/10 hover:border-green-300/50 hover:-translate-y-0.5">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl text-white shadow-lg shadow-green-500/30">
              <FiCheckCircle className="w-5 h-5" />
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-400 font-semibold uppercase tracking-wide">
              Completed this week
            </span>
          </div>
          <p className="text-4xl font-bold bg-gradient-to-br from-green-600 to-emerald-600 bg-clip-text text-transparent">
            {stats.completedThisWeek}
          </p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-3">
        {filters.map((item) => (
          <button
            key={item.value}
            onClick={() => setFilter(item.value)}
            className={clsx(
              "px-5 py-3 rounded-xl font-semibold text-sm transition-all flex items-center gap-2.5 backdrop-blur-sm",
              filter === item.value
                ? "bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-lg shadow-brand-500/30 scale-105"
                : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:border-brand-300 hover:shadow-md"
            )}
          >
            {item.label}
            <span
              className={clsx(
                "px-2.5 py-1 text-xs font-bold rounded-lg",
                filter === item.value
                  ? "bg-white/25 text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
              )}
            >
              {item.count}
            </span>
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg shadow-gray-900/5 border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-50 via-gray-50/80 to-gray-100 dark:from-gray-800 dark:to-gray-900 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">
                  Student
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">
                  Lesson window
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">
                  Status
                </th>
                <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
              {isLoading &&
                [0, 1, 2].map((index) => (
                  <tr key={`skeleton-${index}`}>
                    <td colSpan={4} className="px-6 py-4">
                      <div className="animate-pulse space-y-2">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                      </div>
                    </td>
                  </tr>
                ))}

              {!isLoading && filteredBookings.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <div className="space-y-2">
                      <FiCalendar className="w-8 h-8 mx-auto text-gray-400" />
                      <p className="font-medium text-gray-900 dark:text-white">
                        No bookings to show
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Adjust your filter or add availability so students can
                        book you.
                      </p>
                    </div>
                  </td>
                </tr>
              )}

              {!isLoading &&
                filteredBookings.map((booking) => {
                  const statusKey = (booking.status ?? "").toLowerCase();
                  const colors = statusColors[statusKey] || {
                    bg: "bg-gray-100",
                    text: "text-gray-800",
                  };
                  const label = statusLabels[statusKey] || booking.status;
                  const durationMinutes = computeDurationMinutes(
                    booking.scheduled_start,
                    booking.scheduled_end
                  );
                  const canStart = !pastStatuses.has(statusKey);
                  const canComplete = ![
                    "completed",
                    "cancelled",
                    "pending",
                  ].includes(statusKey);
                  const isStarting =
                    startLesson.isPending &&
                    startLesson.variables === booking.id;
                  const isCompleting =
                    endLesson.isPending && endLesson.variables === booking.id;

                  return (
                    <tr
                      key={booking.id}
                      className="group hover:bg-gradient-to-r hover:from-gray-50 hover:to-transparent dark:hover:from-gray-800/50 dark:hover:to-transparent transition-all"
                    >
                      <td className="px-6 py-5">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-3">
                            <div className="bg-gradient-to-br from-brand-500 to-brand-600 p-2.5 rounded-xl shadow-md shadow-brand-500/20">
                              <FiUser className="w-4 h-4 text-white" />
                            </div>
                            <span className="font-bold text-sm text-gray-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                              {booking.student_name || "Unassigned student"}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 ml-12 font-medium">
                            {booking.lesson_type}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="space-y-1.5">
                          <p className="font-semibold text-sm text-gray-900 dark:text-white">
                            {formatDateTime.format(
                              new Date(booking.scheduled_start)
                            )}
                          </p>
                          <p className="text-xs bg-gradient-to-r from-brand-600 to-brand-500 bg-clip-text text-transparent font-bold">
                            {relativeLabel(booking.scheduled_start)}
                          </p>
                          {durationMinutes && (
                            <span className="inline-flex px-2.5 py-1 text-xs font-bold rounded-lg bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 text-purple-700 dark:text-purple-200 border border-purple-200/50">
                              {durationMinutes} min
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span
                          className={clsx(
                            "inline-flex px-3.5 py-1.5 text-xs rounded-lg shadow-sm",
                            colors.bg,
                            colors.text
                          )}
                        >
                          {label}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="flex items-center justify-end gap-2.5">
                          <button
                            onClick={() => handleStartLesson(booking)}
                            disabled={!canStart || isStarting}
                            className="px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-1.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/25 hover:shadow-xl hover:shadow-green-500/30 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-lg"
                          >
                            {isStarting ? (
                              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <FiPlay className="w-4 h-4" />
                            )}
                            Start
                          </button>
                          <button
                            onClick={() => handleEndLesson(booking)}
                            disabled={!canComplete || isCompleting}
                            className="px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-1.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-lg"
                          >
                            {isCompleting ? (
                              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <FiCheckCircle className="w-4 h-4" />
                            )}
                            Complete
                          </button>
                          <button
                            onClick={() => openReschedule(booking)}
                            className="px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-1.5 bg-white dark:bg-gray-800 border-2 border-brand-200 dark:border-brand-700 text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-900/20 hover:border-brand-400 hover:shadow-md"
                          >
                            <FiEdit3 className="w-4 h-4" />
                            Reschedule
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-md"
            role="button"
            tabIndex={0}
            aria-label="Close reschedule modal"
            onClick={handleCloseModal}
            onKeyDown={(e) => {
              if (e.key === "Escape" || e.key === "Enter" || e.key === " ") {
                handleCloseModal();
              }
            }}
          />
          <div className="relative bg-gradient-to-br from-white via-gray-50/50 to-brand-50/10 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-2xl shadow-gray-900/20 border border-gray-200/50 dark:border-gray-700/50 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200/60 dark:border-gray-700/60">
              <h2 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                Request reschedule
              </h2>
              <button
                onClick={handleCloseModal}
                className="p-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all hover:shadow-md"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {selectedBooking && (
                <div className="bg-gradient-to-r from-brand-50 to-brand-100/50 dark:from-brand-900/30 dark:to-brand-800/20 p-5 rounded-xl border border-brand-200/50 dark:border-brand-700/50">
                  <p className="font-bold text-gray-900 dark:text-white mb-1.5">
                    {selectedBooking.student_name || "Unassigned student"}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Current time:{" "}
                    <span className="font-semibold text-brand-600 dark:text-brand-400">
                      {formatDateTime.format(
                        new Date(selectedBooking.scheduled_start)
                      )}
                    </span>
                  </p>
                </div>
              )}

              <div className="space-y-5">
                <div>
                  <label
                    htmlFor="reschedule-start"
                    className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                  >
                    New start time
                  </label>
                  <input
                    id="reschedule-start"
                    type="datetime-local"
                    value={newStart}
                    onChange={(e) => setNewStart(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/20 transition-all font-medium"
                  />
                </div>
                <div>
                  <label
                    htmlFor="reschedule-end"
                    className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                  >
                    New end time
                  </label>
                  <input
                    id="reschedule-end"
                    type="datetime-local"
                    value={newEnd}
                    onChange={(e) => setNewEnd(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/20 transition-all font-medium"
                  />
                </div>
                <div>
                  <label
                    htmlFor="reschedule-reason"
                    className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Reason (optional)
                  </label>
                  <textarea
                    id="reschedule-reason"
                    placeholder="Let the student know why you need to move the session..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    rows={4}
                    className="input w-full resize-y"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200/60 dark:border-gray-700/60 bg-gray-50/50 dark:bg-gray-800/50 rounded-b-2xl">
              <button
                onClick={handleCloseModal}
                className="px-5 py-2.5 rounded-xl font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={submitReschedule}
                disabled={isPending}
                className="px-6 py-2.5 rounded-xl font-semibold flex items-center gap-2 bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-lg shadow-brand-500/30 hover:shadow-xl hover:shadow-brand-500/40 hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                {isPending && (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                )}
                Submit request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function formatDatetimeLocal(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const pad = (value: number) => value.toString().padStart(2, "0");
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function toIsoString(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function computeDurationMinutes(startIso: string, endIso: string) {
  const startMs = Date.parse(startIso);
  const endMs = Date.parse(endIso);
  if (Number.isNaN(startMs) || Number.isNaN(endMs)) return null;
  const diff = Math.round((endMs - startMs) / 60000);
  return diff > 0 ? diff : null;
}
