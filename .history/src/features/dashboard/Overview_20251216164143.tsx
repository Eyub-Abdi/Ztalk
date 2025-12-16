import { useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import clsx from "clsx";
import {
  FiTrendingUp,
  FiActivity,
  FiCalendar,
  FiClock,
  FiUsers,
  FiPlus,
} from "react-icons/fi";
import { useLessonStats } from "../lessons/api/useLessons";

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
    <div className="group relative bg-gradient-to-br from-white via-gray-50/30 to-brand-50/10 rounded-2xl p-6 border border-gray-200 hover:border-brand-300 hover:shadow-xl hover:shadow-brand-500/10 hover:-translate-y-1 transition-all duration-300">
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

// Quick action button component
function QuickAction({
  icon: Icon,
  label,
  to,
  color,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  to: string;
  color: "brand" | "green" | "purple" | "orange";
}) {
  const colorClasses = {
    brand:
      "from-brand-500 to-indigo-600 shadow-brand-500/30 hover:shadow-brand-500/40",
    green:
      "from-green-500 to-emerald-600 shadow-green-500/30 hover:shadow-green-500/40",
    purple:
      "from-purple-500 to-pink-600 shadow-purple-500/30 hover:shadow-purple-500/40",
    orange:
      "from-orange-500 to-amber-600 shadow-orange-500/30 hover:shadow-orange-500/40",
  };

  return (
    <Link
      to={to}
      className={clsx(
        "flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200",
        colorClasses[color]
      )}
    >
      <Icon className="w-5 h-5" />
      <span className="font-semibold text-sm">{label}</span>
    </Link>
  );
}

export default function Overview() {
  const { data, isLoading } = useLessonStats();

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

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <QuickAction
            icon={FiPlus}
            label="Create Lesson"
            to="/dashboard/create-lesson"
            color="brand"
          />
          <QuickAction
            icon={FiCalendar}
            label="View Bookings"
            to="/dashboard/bookings"
            color="green"
          />
          <QuickAction
            icon={FiClock}
            label="Set Availability"
            to="/dashboard/availability"
            color="purple"
          />
          <QuickAction
            icon={FiUsers}
            label="Find Students"
            to="/dashboard/find-tutors"
            color="orange"
          />
        </div>
      </div>

      {/* Upcoming lesson preview */}
      {data && data.upcoming_lessons > 0 && (
        <div className="p-4 bg-gradient-to-r from-brand-50 to-indigo-50 rounded-xl border border-brand-200/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-brand-500 to-indigo-600 rounded-lg shadow-lg shadow-brand-500/30">
              <FiCalendar className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-900">
                {data.upcoming_lessons} upcoming{" "}
                {data.upcoming_lessons === 1 ? "lesson" : "lessons"}
              </p>
              <p className="text-xs text-gray-500">Check your schedule</p>
            </div>
            <Link
              to="/dashboard/bookings"
              className="px-3 py-1.5 text-xs font-semibold text-brand-600 hover:text-white bg-white hover:bg-gradient-to-r hover:from-brand-500 hover:to-brand-600 rounded-lg transition-all duration-200 shadow-sm"
            >
              View all
            </Link>
          </div>
        </div>
      )}

      {/* Earnings */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-4">
          Earnings Snapshot
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-lg shadow-emerald-500/30">
            <p className="text-xs text-emerald-100 font-medium uppercase tracking-wider mb-1">
              Total Earned
            </p>
            <p className="text-2xl font-bold text-white">
              {formatCurrency(earningsSummary.totalEarned)}
            </p>
          </div>
          <div className="p-5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg shadow-blue-500/30">
            <p className="text-xs text-blue-100 font-medium uppercase tracking-wider mb-1">
              Pending Payout
            </p>
            <p className="text-2xl font-bold text-white">
              {formatCurrency(earningsSummary.pendingPayout)}
            </p>
          </div>
          <div className="p-5 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl shadow-lg shadow-purple-500/30">
            <p className="text-xs text-purple-100 font-medium uppercase tracking-wider mb-1">
              Month-to-Date
            </p>
            <p className="text-2xl font-bold text-white">
              {formatCurrency(earningsSummary.monthToDate)}
            </p>
          </div>
        </div>

        {/* Trend indicator */}
        <div className="mt-4 flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
          <div
            className={clsx(
              "p-2 rounded-lg",
              earningsSummary.changePercent >= 0
                ? "bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg shadow-green-500/30"
                : "bg-gradient-to-br from-red-500 to-rose-600 shadow-lg shadow-red-500/30"
            )}
          >
            <FiTrendingUp className="w-4 h-4 text-white" />
          </div>
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
          <span className="text-sm text-gray-500 font-medium">
            vs last week
          </span>
        </div>
      </div>
    </div>
  );
}
