import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import clsx from "clsx";
import {
  FiCheckCircle,
  FiCircle,
  FiTrendingUp,
  FiActivity,
} from "react-icons/fi";
import { useLessonStats } from "../lessons/api/useLessons";

interface ChecklistItem {
  id: string;
  label: string;
  helper?: string;
  completed: boolean;
  action?: {
    label: string;
    to: string;
  };
}

// Stat card component
function StatCard({
  label,
  value,
  subtitle,
}: {
  label: string;
  value: string | number;
  subtitle?: string;
}) {
  return (
    <div className="group relative bg-gradient-to-br from-white via-gray-50/30 to-brand-50/10 rounded-2xl p-6 border border-gray-200/40 hover:border-brand-300/60 hover:shadow-xl hover:shadow-brand-500/10 hover:-translate-y-1 transition-all duration-300">
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
            {label}
          </span>
          <div className="p-1.5 bg-gradient-to-br from-brand-500/10 to-brand-600/5 rounded-lg opacity-60 group-hover:opacity-100 transition-opacity">
            <FiActivity className="w-3 h-3 text-brand-600" />
          </div>
        </div>
        <span className="text-3xl font-bold bg-gradient-to-br from-brand-600 via-brand-500 to-indigo-600 bg-clip-text text-transparent">
          {value}
        </span>
        {subtitle && (
          <span className="text-xs text-gray-500 mt-1 font-medium">
            {subtitle}
          </span>
        )}
      </div>
      <div className="absolute inset-0 bg-gradient-to-br from-brand-500/0 via-brand-500/0 to-brand-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>
  );
}

export default function Overview() {
  const { data, isLoading } = useLessonStats();

  const computeChecklist = useCallback((): ChecklistItem[] => {
    let hasPhoto = false;
    let hasDescription = false;
    let hasAvailability = false;

    if (typeof window !== "undefined") {
      const profileRaw = localStorage.getItem("tutorProfile");
      if (profileRaw) {
        try {
          const profile = JSON.parse(profileRaw);
          hasPhoto = Boolean(profile.photoUrl);
          hasDescription = Boolean(profile.description?.trim());
        } catch {
          // ignore
        }
      }
      const availRaw = localStorage.getItem("tutor_availability_v1");
      if (availRaw) {
        try {
          const avail = JSON.parse(availRaw);
          hasAvailability = Object.values(avail).some(
            (slots) => Array.isArray(slots) && slots.length > 0
          );
        } catch {
          // ignore
        }
      }
    }

    return [
      {
        id: "photo",
        label: "Upload a profile photo",
        helper: "Profiles with photos get 4× more bookings.",
        completed: hasPhoto,
        action: {
          label: hasPhoto ? "Change" : "Upload",
          to: "/dashboard/settings",
        },
      },
      {
        id: "description",
        label: "Write a tutor description",
        helper: "Tell students about your teaching style.",
        completed: hasDescription,
        action: {
          label: hasDescription ? "Edit" : "Write now",
          to: "/dashboard/settings",
        },
      },
      {
        id: "availability",
        label: "Publish weekly availability",
        helper: "Open slots so students can book you right away.",
        completed: hasAvailability,
        action: {
          label: hasAvailability ? "Adjust" : "Set availability",
          to: "/dashboard/availability",
        },
      },
    ];
  }, []);

  const [checklist, setChecklist] = useState<ChecklistItem[]>(() =>
    computeChecklist()
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    const sync = () => setChecklist(computeChecklist());
    sync();
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("storage", sync);
    };
  }, [computeChecklist]);

  const completionMetrics = useMemo(() => {
    const total = checklist.length;
    const completed = checklist.filter((item) => item.completed).length;
    const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
    return { total, completed, percent };
  }, [checklist]);

  const earningsSummary = useMemo(() => {
    const averageRate = 20; // USD per lesson placeholder
    const completedLessons = data?.completed_lessons ?? 0;
    const upcomingLessons = data?.upcoming_lessons ?? 0;
    const monthLessons = data?.this_month_lessons ?? 0;
    const weekLessons = data?.this_week_lessons ?? 0;

    const totalEarned = completedLessons * averageRate;
    const pendingPayout = upcomingLessons * averageRate;
    const monthToDate = monthLessons * averageRate;

    const assumedWeeks = 4;
    const previousLessonCount = Math.max(monthLessons - weekLessons, 0);
    const previousWeeklyAverage =
      previousLessonCount > 0
        ? previousLessonCount / Math.max(assumedWeeks - 1, 1)
        : 0;
    const changeBase =
      previousWeeklyAverage || (monthLessons ? monthLessons / assumedWeeks : 0);
    const changePercent = changeBase
      ? Math.round(((weekLessons - changeBase) / changeBase) * 100)
      : 0;

    return {
      totalEarned,
      pendingPayout,
      monthToDate,
      changePercent,
    };
  }, [data]);

  const currencyFormatter = useMemo(
    () =>
      new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }),
    []
  );

  const formatCurrency = useCallback(
    (value: number) => currencyFormatter.format(value),
    [currencyFormatter]
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8 px-6 py-8">
      {/* Welcome Header */}
      <div className="mb-10 relative">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-brand-50 to-indigo-50 border border-brand-200/50 rounded-full mb-4">
          <div className="w-2 h-2 bg-gradient-to-r from-brand-500 to-indigo-500 rounded-full animate-pulse" />
          <span className="text-xs font-bold text-brand-700 uppercase tracking-wider">
            Live Dashboard
          </span>
        </div>
        <h1 className="text-4xl font-black bg-gradient-to-r from-gray-900 via-brand-600 to-indigo-600 bg-clip-text text-transparent mb-3">
          Good morning, Teacher
        </h1>
        <p className="text-gray-600 text-lg font-medium">
          Here&apos;s your teaching summary for today
        </p>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
        </div>
      )}

      {data && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
          <StatCard label="Total Lessons" value={data.total_lessons} />
          <StatCard label="Upcoming" value={data.upcoming_lessons} />
          <StatCard label="Completed" value={data.completed_lessons} />
          <StatCard label="Total Hours" value={`${data.total_hours}h`} />
          <StatCard label="This Month" value={data.this_month_lessons} />
          <StatCard label="This Week" value={data.this_week_lessons} />
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Profile completion card */}
        <div className="relative overflow-hidden bg-gradient-to-br from-white via-blue-50/20 to-indigo-50/30 rounded-2xl p-8 border border-blue-200/30 shadow-lg shadow-blue-900/5 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300">
          <div className="relative z-10 space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100/80 border border-blue-200/50 rounded-full mb-3">
                <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">
                  Profile Setup
                </span>
              </div>
              <h2 className="text-2xl font-black bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                Complete Your Profile
              </h2>
              <p className="text-sm text-gray-600 font-medium">
                Finishing these steps helps unlock higher placement in tutor
                search
              </p>
            </div>

            <div className="bg-white/60 rounded-xl p-5 border border-blue-200/30">
              {/* Progress bar */}
              <div className="relative h-4 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full overflow-hidden shadow-inner">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full transition-all duration-700 shadow-lg shadow-blue-500/50 relative overflow-hidden"
                  style={{ width: `${completionMetrics.percent}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
                </div>
              </div>
              <div className="flex justify-between mt-4 text-sm">
                <span className="font-black text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text">
                  {completionMetrics.percent}% complete
                </span>
                <span className="text-gray-600 font-semibold">
                  {completionMetrics.completed} of {completionMetrics.total}{" "}
                  completed
                </span>
              </div>
            </div>

            <div className="space-y-2">
              {checklist.map((item) => (
                <div
                  key={item.id}
                  className="group flex items-start gap-4 p-4 rounded-xl hover:bg-white/80 hover:shadow-md transition-all duration-200 border border-transparent hover:border-gray-100"
                >
                  {item.completed ? (
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/20">
                      <FiCheckCircle className="w-4 h-4 text-white" />
                    </div>
                  ) : (
                    <FiCircle className="w-6 h-6 text-gray-300 mt-0.5 flex-shrink-0 group-hover:text-gray-400 transition-colors" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900">
                      {item.label}
                    </p>
                    {item.helper && (
                      <p className="text-xs text-gray-500 mt-1">
                        {item.helper}
                      </p>
                    )}
                  </div>
                  {!item.completed && item.action && (
                    <Link
                      to={item.action.to}
                      className="px-3 py-1.5 text-xs font-semibold text-brand-600 hover:text-white bg-brand-50 hover:bg-gradient-to-r hover:from-brand-500 hover:to-brand-600 rounded-lg transition-all duration-200 whitespace-nowrap shadow-sm hover:shadow-lg hover:shadow-brand-500/30"
                    >
                      {item.action.label}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Earnings snapshot card */}
        <div className="relative overflow-hidden bg-gradient-to-br from-white via-emerald-50/30 to-green-50/20 rounded-2xl p-8 border border-emerald-200/30 shadow-lg shadow-emerald-900/5 hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-300">
          <div className="relative z-10 space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100/80 border border-emerald-200/50 rounded-full mb-3">
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                  Revenue
                </span>
              </div>
              <h2 className="text-2xl font-black bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent mb-2">
                Earnings Snapshot
              </h2>
              <p className="text-sm text-gray-600 font-medium">
                Estimates based on your recent lessons and a $20/hr placeholder
                rate
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="space-y-2">
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">
                  Total earned
                </p>
                <p className="text-2xl font-bold bg-gradient-to-br from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  {formatCurrency(earningsSummary.totalEarned)}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">
                  Pending payout
                </p>
                <p className="text-2xl font-bold bg-gradient-to-br from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  {formatCurrency(earningsSummary.pendingPayout)}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">
                  Month-to-date
                </p>
                <p className="text-2xl font-bold bg-gradient-to-br from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {formatCurrency(earningsSummary.monthToDate)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-white/50 to-gray-50/50 rounded-xl border border-gray-100/50 backdrop-blur-sm">
              <div
                className={clsx(
                  "p-2.5 rounded-xl shadow-lg",
                  earningsSummary.changePercent >= 0
                    ? "bg-gradient-to-br from-green-500 to-emerald-600 shadow-green-500/30"
                    : "bg-gradient-to-br from-red-500 to-rose-600 shadow-red-500/30"
                )}
              >
                <FiTrendingUp className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <span
                  className={clsx(
                    "text-xl font-bold",
                    earningsSummary.changePercent >= 0
                      ? "text-green-600"
                      : "text-red-600"
                  )}
                >
                  {earningsSummary.changePercent >= 0 ? "+" : ""}
                  {earningsSummary.changePercent}%
                </span>
                <span className="text-sm text-gray-600 ml-2 font-medium">
                  vs last week
                </span>
              </div>
            </div>
            <p className="text-xs text-gray-500 italic">
              Track more detail once payouts API is connected
            </p>
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-500/10 to-transparent rounded-2xl -mr-16 -mt-16" />
        </div>
      </div>
    </div>
  );
}
