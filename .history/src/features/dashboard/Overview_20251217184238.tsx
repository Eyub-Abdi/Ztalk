import { useCallback, useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import clsx from "clsx";
import {
  FiTrendingUp,
  FiActivity,
  FiCalendar,
  FiClock,
  FiUsers,
  FiPlus,
  FiHelpCircle,
  FiBookOpen,
  FiChevronUp,
  FiChevronDown,
  FiDollarSign,
} from "react-icons/fi";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { useLessonStats } from "../lessons/api/useLessons";

// Mock upcoming lessons data
const mockUpcomingLessons = [
  {
    id: "4205457368",
    studentName: "Íñigo",
    lessonTitle: "Swahili For Beginners, Travel & Tourism",
    language: "Swahili",
    duration: 60,
    scheduledAt: new Date(Date.now() + 19 * 60 * 60 * 1000 + 22 * 60 * 1000), // ~19h from now
    avatarColor: "bg-amber-400",
  },
  {
    id: "7903418668",
    studentName: "Mark Rose",
    lessonTitle: "Swahili For Beginners, Travel & Tourism",
    language: "Swahili",
    duration: 30,
    scheduledAt: new Date("2025-12-18T21:00:00"),
    avatarColor: "bg-emerald-500",
  },
  {
    id: "4336425958",
    studentName: "Cindy Tolbert",
    lessonTitle: "Swahili For Beginners, Travel & Tourism",
    language: "Swahili",
    duration: 60,
    scheduledAt: new Date("2025-12-21T18:30:00"),
    avatarColor: "bg-emerald-400",
  },
];

// Countdown hook
function useCountdown(targetDate: Date) {
  const [timeLeft, setTimeLeft] = useState(() => {
    const diff = targetDate.getTime() - Date.now();
    return Math.max(0, Math.floor(diff / 1000));
  });

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      const diff = targetDate.getTime() - Date.now();
      setTimeLeft(Math.max(0, Math.floor(diff / 1000)));
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate, timeLeft]);

  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  return { hours, minutes, seconds, isNow: timeLeft <= 0 };
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
        <span className="text-3xl font-bold bg-gradient-to-br from-brand-600 via-brand-500 to-brand-600 bg-clip-text text-transparent">
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

// Upcoming Lesson Card component
function UpcomingLessonCard({
  lesson,
  isFirst,
}: {
  lesson: (typeof mockUpcomingLessons)[0];
  isFirst: boolean;
}) {
  const countdown = useCountdown(lesson.scheduledAt);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="bg-white rounded-xl border-l-4 border-l-brand-500 p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <div
          className={clsx(
            "w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg",
            lesson.avatarColor
          )}
        >
          {lesson.studentName.charAt(0).toUpperCase()}
        </div>

        {/* Student & Lesson Info */}
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900">{lesson.studentName}</p>
          <p className="text-xs text-gray-400">Lesson ID: {lesson.id}</p>
        </div>

        {/* Lesson Details */}
        <div className="hidden md:block text-right flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-700 truncate">
            {lesson.lessonTitle}
          </p>
          <p className="text-xs text-gray-400">
            {lesson.language} - {lesson.duration} min
          </p>
        </div>

        {/* Time / Countdown */}
        <div className="text-right min-w-[140px]">
          {isFirst ? (
            <div>
              <p className="text-xs text-gray-500">Your lesson will start in</p>
              <p className="text-lg font-bold text-brand-500">
                {countdown.hours}h {countdown.minutes}m {countdown.seconds}s
              </p>
            </div>
          ) : (
            <div className="flex items-center gap-2 justify-end">
              <span className="text-xl font-bold text-gray-700">
                {formatTime(lesson.scheduledAt)}
              </span>
              <span className="text-gray-300">•</span>
              <span className="text-sm text-gray-400">
                {formatDate(lesson.scheduledAt)}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Mobile lesson details */}
      <div className="md:hidden mt-3 pt-3 border-t border-gray-100">
        <p className="text-sm font-medium text-gray-700 truncate">
          {lesson.lessonTitle}
        </p>
        <p className="text-xs text-gray-400">
          {lesson.language} - {lesson.duration} min
        </p>
      </div>
    </div>
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

      {/* Upcoming Lessons List */}
      <div className="bg-gray-50 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-5">
          <span className="w-2.5 h-2.5 rounded-full bg-brand-500"></span>
          <h2 className="text-lg font-semibold text-gray-700">Upcoming</h2>
          <span className="text-lg text-gray-400">•</span>
          <span className="text-lg font-semibold text-gray-700">
            {mockUpcomingLessons.length}
          </span>
        </div>

        <div className="space-y-3">
          {mockUpcomingLessons.map((lesson, index) => (
            <UpcomingLessonCard
              key={lesson.id}
              lesson={lesson}
              isFirst={index === 0}
            />
          ))}
        </div>

        <div className="mt-5 flex justify-center">
          <Link
            to="/dashboard/upcoming"
            className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-sm transition-all"
          >
            Show more
          </Link>
        </div>
      </div>

      {/* Profile Performance */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200">
        <div className="flex items-center gap-2 mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            My profile performance
          </h2>
          <div className="w-5 h-5 rounded-full border border-gray-300 flex items-center justify-center text-gray-400 text-xs cursor-help">
            ?
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Stats */}
          <div className="flex-shrink-0">
            <p className="text-sm text-gray-500 mb-6">
              Updated daily at UTC+0 4am
            </p>

            <div className="grid grid-cols-2 gap-x-12 gap-y-6">
              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-gray-900">11</span>
                  <FiTrendingUp className="w-4 h-4 text-brand-500" />
                </div>
                <p className="text-sm text-gray-500 mt-1">Profile Views</p>
              </div>
              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-gray-900">19</span>
                  <FiTrendingUp className="w-4 h-4 text-brand-500" />
                </div>
                <p className="text-sm text-gray-500 mt-1">Video Plays</p>
              </div>
              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-gray-900">4</span>
                  <FiTrendingUp className="w-4 h-4 text-brand-500" />
                </div>
                <p className="text-sm text-gray-500 mt-1">Booking Starts</p>
              </div>
              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-gray-900">1</span>
                  <FiTrendingUp className="w-4 h-4 text-brand-500" />
                </div>
                <p className="text-sm text-gray-500 mt-1">New Bookings</p>
              </div>
            </div>
          </div>

          {/* Chart */}
          <div className="flex-1 min-w-0">
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={[
                    { date: "11/09", videoPlays: 0, bookings: 0 },
                    { date: "11/12", videoPlays: 1, bookings: 0 },
                    { date: "11/15", videoPlays: 2, bookings: 1 },
                    { date: "11/18", videoPlays: 1, bookings: 0 },
                    { date: "11/21", videoPlays: 2, bookings: 1 },
                    { date: "11/24", videoPlays: 1, bookings: 0 },
                    { date: "11/27", videoPlays: 1, bookings: 1 },
                    { date: "11/30", videoPlays: 2, bookings: 0 },
                    { date: "12/03", videoPlays: 3, bookings: 0 },
                    { date: "12/06", videoPlays: 2, bookings: 1 },
                    { date: "12/09", videoPlays: 1, bookings: 0 },
                    { date: "12/12", videoPlays: 2, bookings: 1 },
                    { date: "12/16", videoPlays: 1, bookings: 1 },
                  ]}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="colorVideoPlays"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                      <stop
                        offset="95%"
                        stopColor="#f59e0b"
                        stopOpacity={0.05}
                      />
                    </linearGradient>
                    <linearGradient
                      id="colorBookings"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="#ef4444"
                        stopOpacity={0.25}
                      />
                      <stop
                        offset="95%"
                        stopColor="#ef4444"
                        stopOpacity={0.05}
                      />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#9ca3af" }}
                    interval="preserveStartEnd"
                  />
                  <YAxis
                    orientation="right"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#9ca3af" }}
                    domain={[0, 3]}
                    ticks={[0, 1, 2, 3]}
                    tickFormatter={(value) => `— ${value}`}
                  />
                  <ReferenceLine y={3} stroke="#86efac" strokeDasharray="4 4" />
                  <ReferenceLine y={2} stroke="#e5e7eb" strokeDasharray="4 4" />
                  <ReferenceLine y={1} stroke="#e5e7eb" strokeDasharray="4 4" />
                  <Area
                    type="monotone"
                    dataKey="videoPlays"
                    stroke="#f59e0b"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorVideoPlays)"
                  />
                  <Area
                    type="monotone"
                    dataKey="bookings"
                    stroke="#ef4444"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorBookings)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Students interested in my profile */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Students interested in my profile
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Timezones */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Timezones
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Students often prefer teachers in the same time zone.
            </p>
            <div className="flex flex-wrap gap-3">
              <img
                src="https://flagcdn.com/48x36/us.png"
                alt="USA"
                className="w-12 h-9 rounded-lg shadow-sm"
              />
              <img
                src="https://flagcdn.com/48x36/gb.png"
                alt="UK"
                className="w-12 h-9 rounded-lg shadow-sm"
              />
              <img
                src="https://flagcdn.com/48x36/at.png"
                alt="Austria"
                className="w-12 h-9 rounded-lg shadow-sm"
              />
              <img
                src="https://flagcdn.com/48x36/de.png"
                alt="Germany"
                className="w-12 h-9 rounded-lg shadow-sm"
              />
              <img
                src="https://flagcdn.com/48x36/br.png"
                alt="Brazil"
                className="w-12 h-9 rounded-lg shadow-sm"
              />
            </div>
          </div>

          {/* Speaking languages */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Speaking languages
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              A1–B1 students often prefer teachers who speak their languages.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-4 py-2 bg-brand-500 text-white text-sm font-medium rounded-full">
                English
              </span>
              <span className="px-4 py-2 bg-amber-500 text-white text-sm font-medium rounded-full">
                Swahili
              </span>
              <span className="px-4 py-2 bg-green-500 text-white text-sm font-medium rounded-full">
                Arabic
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="mt-8">
        <div className="flex items-center gap-2 mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Statistics</h2>
          <FiHelpCircle className="w-5 h-5 text-gray-400" />
        </div>

        {/* Main Statistics Card */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Lesson Overview Chart */}
            <div className="lg:col-span-5">
              <div className="flex items-center gap-2 mb-4">
                <FiTrendingUp className="w-5 h-5 text-gray-700" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Lesson overview
                </h3>
              </div>

              {/* Legend */}
              <div className="flex gap-6 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-teal-400"></div>
                  <span className="text-sm text-gray-600">
                    Total lesson requests
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-teal-600"></div>
                  <span className="text-sm text-gray-600">
                    Completed lessons
                  </span>
                </div>
              </div>

              {/* Chart */}
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={[
                      { month: "Oct", requests: 40, completed: 30 },
                      { month: "Nov", requests: 35, completed: 25 },
                      { month: "Dec", requests: 12, completed: 10 },
                    ]}
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient
                        id="colorRequests"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#2dd4bf"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="#2dd4bf"
                          stopOpacity={0}
                        />
                      </linearGradient>
                      <linearGradient
                        id="colorCompleted"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#0d9488"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="#0d9488"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey="month"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#6b7280", fontSize: 12 }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#6b7280", fontSize: 12 }}
                      ticks={[5, 10, 15, 20, 25, 30, 35, 40]}
                    />
                    <Area
                      type="monotone"
                      dataKey="requests"
                      stroke="#2dd4bf"
                      strokeWidth={2}
                      fill="url(#colorRequests)"
                      dot={{ fill: "#2dd4bf", strokeWidth: 2, r: 4 }}
                    />
                    <Area
                      type="monotone"
                      dataKey="completed"
                      stroke="#0d9488"
                      strokeWidth={2}
                      fill="url(#colorCompleted)"
                      dot={{ fill: "#0d9488", strokeWidth: 2, r: 4 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Stats Tables */}
            <div className="lg:col-span-4 grid grid-cols-2 gap-4">
              {/* Expiration */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm font-medium text-gray-700">
                    Expiration
                  </span>
                  <FiHelpCircle className="w-4 h-4 text-gray-400" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Dec</span>
                    <span className="text-gray-900 font-medium">0</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Nov</span>
                    <span className="text-gray-900 font-medium">0</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Oct</span>
                    <span className="text-gray-900 font-medium">0</span>
                  </div>
                </div>
              </div>

              {/* Declined */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm font-medium text-gray-700">
                    Declined
                  </span>
                  <FiHelpCircle className="w-4 h-4 text-gray-400" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Dec</span>
                    <span className="text-gray-900 font-medium">0</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Nov</span>
                    <span className="text-gray-900 font-medium">0</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Oct</span>
                    <span className="text-gray-900 font-medium">0</span>
                  </div>
                </div>
              </div>

              {/* Canceled */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm font-medium text-gray-700">
                    Canceled
                  </span>
                  <FiHelpCircle className="w-4 h-4 text-gray-400" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Dec</span>
                    <span className="text-gray-900 font-medium">0</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Nov</span>
                    <span className="text-gray-900 font-medium">1</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Oct</span>
                    <span className="text-gray-900 font-medium">0</span>
                  </div>
                </div>
              </div>

              {/* Absence */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm font-medium text-gray-700">
                    Absence
                  </span>
                  <FiHelpCircle className="w-4 h-4 text-gray-400" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Dec</span>
                    <span className="text-gray-900 font-medium">1</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Nov</span>
                    <span className="text-gray-900 font-medium">3</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Oct</span>
                    <span className="text-gray-900 font-medium">3</span>
                  </div>
                </div>
              </div>
            </div>

            {/* My popular lessons */}
            <div className="lg:col-span-3">
              <div className="flex items-center gap-2 mb-4">
                <FiBookOpen className="w-5 h-5 text-gray-700" />
                <h3 className="text-lg font-semibold text-gray-900">
                  My popular lessons
                </h3>
              </div>

              {/* December Dropdown */}
              <div className="border border-gray-200 rounded-xl mb-3">
                <button className="w-full flex items-center justify-between p-3 text-left">
                  <span className="text-sm font-medium text-gray-900">
                    December
                  </span>
                  <FiChevronUp className="w-4 h-4 text-gray-400" />
                </button>
                <div className="px-3 pb-3 space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-orange-500">🔥</span>
                    <span className="text-gray-700 truncate">
                      Swahili for beginners, travel &...
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-orange-500">🔥</span>
                    <span className="text-gray-700 truncate">
                      English for Beginners
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-red-500">🔥</span>
                    <span className="text-gray-700 truncate">
                      English Conversational & Zanzibar,...
                    </span>
                  </div>
                </div>
              </div>

              {/* November Dropdown */}
              <div className="border border-gray-200 rounded-xl mb-3">
                <button className="w-full flex items-center justify-between p-3 text-left">
                  <span className="text-sm font-medium text-gray-900">
                    November
                  </span>
                  <FiChevronDown className="w-4 h-4 text-gray-400" />
                </button>
              </div>

              {/* October Dropdown */}
              <div className="border border-gray-200 rounded-xl">
                <button className="w-full flex items-center justify-between p-3 text-left">
                  <span className="text-sm font-medium text-gray-900">
                    October
                  </span>
                  <FiChevronDown className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Students & Earnings Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Students Card */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-2">
              <FiUsers className="w-5 h-5 text-gray-700" />
              <h3 className="text-lg font-semibold text-gray-900">Students</h3>
            </div>
            <p className="text-sm text-gray-500 mb-6">
              students who have completed at least one 1-on-1 lesson with you
            </p>

            <div className="grid grid-cols-2 gap-8">
              {/* Total */}
              <div>
                <p className="text-sm text-gray-500 mb-1">Total</p>
                <p className="text-5xl font-bold text-gray-900">489</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-gray-500">Dec</span>
                  <span className="px-2 py-0.5 bg-teal-100 text-teal-700 text-xs font-medium rounded">
                    +1
                  </span>
                  <span className="text-sm text-gray-600">6</span>
                </div>
              </div>

              {/* Retention Chart */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <p className="text-sm text-gray-500">Retention (%)</p>
                  <FiHelpCircle className="w-4 h-4 text-gray-400" />
                </div>
                <div className="h-24">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={[
                        { month: "Oct", value: 34 },
                        { month: "Nov", value: 36 },
                        { month: "Dec", value: 38 },
                      ]}
                      margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                    >
                      <defs>
                        <linearGradient
                          id="retentionGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#fcd34d"
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="95%"
                            stopColor="#fcd34d"
                            stopOpacity={0.2}
                          />
                        </linearGradient>
                      </defs>
                      <YAxis
                        domain={[34, 40]}
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#9ca3af", fontSize: 10 }}
                        width={25}
                      />
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke="#fcd34d"
                        strokeWidth={2}
                        fill="url(#retentionGradient)"
                        dot={{ fill: "#fcd34d", strokeWidth: 2, r: 3 }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          {/* Earnings Card */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-2">
              <FiDollarSign className="w-5 h-5 text-gray-700" />
              <h3 className="text-lg font-semibold text-gray-900">Earnings</h3>
            </div>
            <p className="text-sm text-gray-500 mb-6">
              1-on-1 lesson income after commission, since Jan.1, 2020
            </p>

            <div className="grid grid-cols-2 gap-8">
              {/* Total */}
              <div>
                <p className="text-sm text-gray-500 mb-1">Total (USD)</p>
                <div className="flex items-baseline">
                  <p className="text-5xl font-bold text-gray-900">10.57</p>
                  <span className="text-2xl font-bold text-gray-500 ml-1">
                    K
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-gray-500">Dec</span>
                  <div className="w-6 h-4 bg-teal-400 rounded-sm"></div>
                  <span className="text-sm text-gray-600">60.09</span>
                </div>
              </div>

              {/* Unit Rate Chart */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <p className="text-sm text-gray-500">Unit rate (USD/h)</p>
                  <FiHelpCircle className="w-4 h-4 text-gray-400" />
                </div>
                <div className="h-24">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={[
                        { month: "Oct", value: 6.8 },
                        { month: "Nov", value: 7.0 },
                        { month: "Dec", value: 7.4 },
                      ]}
                      margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                    >
                      <defs>
                        <linearGradient
                          id="rateGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#fcd34d"
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="95%"
                            stopColor="#fcd34d"
                            stopOpacity={0.2}
                          />
                        </linearGradient>
                      </defs>
                      <YAxis
                        domain={[6.8, 7.4]}
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#9ca3af", fontSize: 10 }}
                        width={25}
                      />
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke="#fcd34d"
                        strokeWidth={2}
                        fill="url(#rateGradient)"
                        dot={{ fill: "#fcd34d", strokeWidth: 2, r: 3 }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
