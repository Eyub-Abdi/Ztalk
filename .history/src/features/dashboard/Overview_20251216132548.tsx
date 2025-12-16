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
  subtitle,
}: {
  label: string;
  value: string | number;
  subtitle?: string;
}) {
  return (
    <div className="bg-white rounded-xl p-5 border border-gray-100 hover:border-gray-200 transition-all duration-200">
      <div className="flex flex-col gap-1">
        <span className="text-sm text-gray-500 font-medium">{label}</span>
        <span className="text-2xl font-semibold text-gray-900">{value}</span>
        {subtitle && (
          <span className="text-xs text-gray-400 mt-0.5">{subtitle}</span>
        )}
      </div>
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
    <div className="max-w-7xl mx-auto space-y-6 px-6 py-8">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-1">
          Good morning, Teacher
        </h1>
        <p className="text-gray-500">Here's your teaching summary for today</p>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
        </div>
      )}

      {data && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
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
        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <div className="space-y-5">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-1">
                Complete Your Profile
              </h2>
              <p className="text-sm text-gray-500">
                Finishing these steps helps unlock higher placement in tutor
                search
              </p>
            </div>

            <div>
              {/* Progress bar */}
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-brand-500 to-brand-600 rounded-full transition-all duration-500"
                  style={{ width: `${completionMetrics.percent}%` }}
                />
              </div>
              <div className="flex justify-between mt-2.5 text-sm">
                <span className="font-semibold text-gray-900">
                  {completionMetrics.percent}% complete
                </span>
                <span className="text-gray-500">
                  {completionMetrics.completed} of {completionMetrics.total}{" "}
                  completed
                </span>
              </div>
            </div>

            <div className="space-y-3">
              {checklist.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {item.completed ? (
                    <FiCheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  ) : (
                    <FiCircle className="w-5 h-5 text-gray-300 mt-0.5 flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {item.label}
                    </p>
                    {item.helper && (
                      <p className="text-xs text-gray-500 mt-0.5">
                        {item.helper}
                      </p>
                    )}
                  </div>
                  {!item.completed && item.action && (
                    <Link
                      to={item.action.to}
                      className="text-sm font-medium text-brand-500 hover:text-brand-600 transition-colors whitespace-nowrap"
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
        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <div className="space-y-5">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-1">
                Earnings Snapshot
              </h2>
              <p className="text-sm text-gray-500">
                Estimates based on your recent lessons and a $20/hr placeholder
                rate
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="space-y-1.5">
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                  Total earned
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  {formatCurrency(earningsSummary.totalEarned)}
                </p>
              </div>
              <div className="space-y-1.5">
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                  Pending payout
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  {formatCurrency(earningsSummary.pendingPayout)}
                </p>
              </div>
              <div className="space-y-1.5">
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                  Month-to-date
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  {formatCurrency(earningsSummary.monthToDate)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3.5 bg-gray-50 rounded-lg">
              <div
                className={clsx(
                  "p-2 rounded-lg",
                  earningsSummary.changePercent >= 0
                    ? "bg-green-100"
                    : "bg-red-100"
                )}
              >
                <FiTrendingUp
                  className={clsx(
                    "w-4 h-4",
                    earningsSummary.changePercent >= 0
                      ? "text-green-600"
                      : "text-red-600"
                  )}
                />
              </div>
              <div className="flex-1">
                <span
                  className={clsx(
                    "text-lg font-semibold",
                    earningsSummary.changePercent >= 0
                      ? "text-green-600"
                      : "text-red-600"
                  )}
                >
                  {earningsSummary.changePercent >= 0 ? "+" : ""}
                  {earningsSummary.changePercent}%
                </span>
                <span className="text-sm text-gray-500 ml-2">vs last week</span>
              </div>
            </div>
            <p className="text-xs text-gray-400">
              Track more detail once payouts API is connected
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
