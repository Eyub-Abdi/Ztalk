import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import clsx from "clsx";
import {
  FiCheckCircle,
  FiCircle,
  FiDollarSign,
  FiTrendingUp,
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
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="card p-4">
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{label}</p>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
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
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Overview
      </h1>

      {isLoading && (
        <p className="text-gray-500 dark:text-gray-400">Loading...</p>
      )}

      {data && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          <StatCard label="Total" value={data.total_lessons} />
          <StatCard label="Upcoming" value={data.upcoming_lessons} />
          <StatCard label="Completed" value={data.completed_lessons} />
          <StatCard label="Total Hours" value={data.total_hours} />
          <StatCard label="Month" value={data.this_month_lessons} />
          <StatCard label="Week" value={data.this_week_lessons} />
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Profile completion card */}
        <div className="card p-6">
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Profile completion
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Finishing these steps helps unlock higher placement in tutor search.
              </p>
            </div>

            <div>
              {/* Progress bar */}
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-brand-500 rounded-full transition-all duration-300"
                  style={{ width: `${completionMetrics.percent}%` }}
                />
              </div>
              <div className="flex justify-between mt-2 text-sm text-gray-500 dark:text-gray-400">
                <span>{completionMetrics.percent}% complete</span>
                <span>
                  {completionMetrics.completed}/{completionMetrics.total} tasks done
                </span>
              </div>
            </div>

            <div className="space-y-3">
              {checklist.map((item) => (
                <div key={item.id} className="flex items-start gap-3">
                  {item.completed ? (
                    <FiCheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  ) : (
                    <FiCircle className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {item.label}
                    </p>
                    {item.helper && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {item.helper}
                      </p>
                    )}
                  </div>
                  {!item.completed && item.action && (
                    <Link
                      to={item.action.to}
                      className="text-xs font-medium text-brand-500 hover:text-brand-600 transition-colors"
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
        <div className="card p-6">
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Earnings snapshot
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Estimates based on your recent lessons and a $20/hr placeholder rate.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold mb-1">
                  Total earned
                </p>
                <div className="flex items-center gap-2">
                  <FiDollarSign className="w-4 h-4 text-brand-500" />
                  <span className="text-lg font-bold text-gray-900 dark:text-white">
                    {formatCurrency(earningsSummary.totalEarned)}
                  </span>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold mb-1">
                  Pending payout
                </p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {formatCurrency(earningsSummary.pendingPayout)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold mb-1">
                  Month-to-date
                </p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {formatCurrency(earningsSummary.monthToDate)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <FiTrendingUp
                className={clsx(
                  "w-4 h-4",
                  earningsSummary.changePercent >= 0
                    ? "text-green-500"
                    : "text-red-500"
                )}
              />
              <span
                className={clsx(
                  "badge text-xs font-medium",
                  earningsSummary.changePercent >= 0
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                    : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                )}
              >
                {earningsSummary.changePercent >= 0 ? "+" : ""}
                {earningsSummary.changePercent}% vs last week
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Track more detail once payouts API is connected.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
