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
  subtitle 
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
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Overview</h1>
        <p className="text-gray-600">
          Track your learning progress and manage your lessons
        </p>
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
          <StatCard label="Total Hours" value={data.total_hours} />
          <StatCard label="This Month" value={data.this_month_lessons} />
          <StatCard label="This Week" value={data.this_week_lessons} />
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Profile completion card */}
        <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Complete Your Profile
              </h2>
              <p className="text-sm text-gray-600">
                Finishing these steps helps unlock higher placement in tutor
                search.
              </p>
            </div>

            <div>
              {/* Progress bar */}
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-brand-500 to-brand-600 rounded-full transition-all duration-500"
                  style={{ width: `${completionMetrics.percent}%` }}
                />
              </div>
              <div className="flex justify-between mt-3 text-sm">
                <span className="font-bold text-gray-900">
                  {completionMetrics.percent}% complete
                </span>
                <span className="text-gray-500 font-medium">
                  {completionMetrics.completed}/{completionMetrics.total} tasks
                </span>
              </div>
            </div>

            <div className="space-y-4">
              {checklist.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  {item.completed ? (
                    <FiCheckCircle className="w-6 h-6 text-green-500 mt-0.5 flex-shrink-0" />
                  ) : (
                    <FiCircle className="w-6 h-6 text-gray-300 mt-0.5 flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900">
                      {item.label}
                    </p>
                    {item.helper && (
                      <p className="text-xs text-gray-600 mt-1">
                        {item.helper}
                      </p>
                    )}
                  </div>
                  {!item.completed && item.action && (
                    <Link
                      to={item.action.to}
                      className="text-sm font-bold text-brand-500 hover:text-brand-600 transition-colors whitespace-nowrap"
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
        <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Earnings Snapshot
              </h2>
              <p className="text-sm text-gray-600">
                Estimates based on your recent lessons and a $20/hr placeholder
                rate.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="space-y-2">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Total earned
                </p>
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-brand-100 rounded-xl">
                    <FiDollarSign className="w-5 h-5 text-brand-500" />
                  </div>
                  <span className="text-2xl font-bold text-gray-900">
                    {formatCurrency(earningsSummary.totalEarned)}
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Pending payout
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(earningsSummary.pendingPayout)}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Month-to-date
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(earningsSummary.monthToDate)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
              <div
                className={clsx(
                  "p-2 rounded-xl",
                  earningsSummary.changePercent >= 0
                    ? "bg-green-100"
                    : "bg-red-100"
                )}
              >
                <FiTrendingUp
                  className={clsx(
                    "w-5 h-5",
                    earningsSummary.changePercent >= 0
                      ? "text-green-600"
                      : "text-red-600"
                  )}
                />
              </div>
              <div className="flex-1">
                <span
                  className={clsx(
                    "text-lg font-bold",
                    earningsSummary.changePercent >= 0
                      ? "text-green-600"
                      : "text-red-600"
                  )}
                >
                  {earningsSummary.changePercent >= 0 ? "+" : ""}
                  {earningsSummary.changePercent}%
                </span>
                <span className="text-sm text-gray-600 ml-2">vs last week</span>
              </div>
            </div>
            <p className="text-xs text-gray-500">
              Track more detail once payouts API is connected.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
