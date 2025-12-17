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
} from "react-icons/fi";
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
          <h2 className="text-xl font-bold text-gray-900">My profile performance</h2>
          <div className="w-5 h-5 rounded-full border border-gray-300 flex items-center justify-center text-gray-400 text-xs cursor-help">
            ?
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Stats */}
          <div className="flex-shrink-0">
            <p className="text-sm text-gray-500 mb-6">Updated daily at UTC+0 4am</p>
            
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
            <div className="relative h-48">
              {/* Y-axis labels */}
              <div className="absolute right-0 top-0 bottom-0 flex flex-col justify-between text-xs text-gray-400 w-8">
                <span>— 3</span>
                <span>— 2</span>
                <span>— 1</span>
                <span>— 0</span>
              </div>
              
              {/* Chart area */}
              <div className="mr-10 h-full relative">
                {/* Grid lines */}
                <div className="absolute inset-0 flex flex-col justify-between">
                  <div className="border-t border-dashed border-green-200"></div>
                  <div className="border-t border-dashed border-gray-200"></div>
                  <div className="border-t border-dashed border-gray-200"></div>
                  <div className="border-t border-gray-200"></div>
                </div>
                
                {/* SVG Chart */}
                <svg className="w-full h-full" viewBox="0 0 400 150" preserveAspectRatio="none">
                  {/* Yellow line (Video plays) with fill */}
                  <defs>
                    <linearGradient id="yellowGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.3"/>
                      <stop offset="100%" stopColor="#fbbf24" stopOpacity="0.05"/>
                    </linearGradient>
                    <linearGradient id="redGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#ef4444" stopOpacity="0.2"/>
                      <stop offset="100%" stopColor="#ef4444" stopOpacity="0.05"/>
                    </linearGradient>
                  </defs>
                  
                  {/* Yellow area fill */}
                  <path d="M0,120 Q30,80 60,90 T120,60 T180,100 T240,40 T300,80 T360,50 T400,70 L400,150 L0,150 Z" fill="url(#yellowGradient)" />
                  
                  {/* Yellow line */}
                  <path d="M0,120 Q30,80 60,90 T120,60 T180,100 T240,40 T300,80 T360,50 T400,70" fill="none" stroke="#f59e0b" strokeWidth="2.5" />
                  
                  {/* Red area fill */}
                  <path d="M0,140 Q50,135 100,130 T200,125 T300,140 T350,120 T400,130 L400,150 L0,150 Z" fill="url(#redGradient)" />
                  
                  {/* Red line */}
                  <path d="M0,140 Q50,135 100,130 T200,125 T300,140 T350,120 T400,130" fill="none" stroke="#ef4444" strokeWidth="2" />
                </svg>
              </div>
              
              {/* X-axis labels */}
              <div className="flex justify-between mt-2 mr-10 text-xs text-gray-400">
                <span>11/09</span>
                <span>12/16</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Students interested in my profile */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Students interested in my profile</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Timezones */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Timezones</h3>
            <p className="text-sm text-gray-500 mb-4">
              Students often prefer teachers in the same time zone.
            </p>
            <div className="flex flex-wrap gap-3">
              <img src="https://flagcdn.com/48x36/us.png" alt="USA" className="w-12 h-9 rounded-lg shadow-sm" />
              <img src="https://flagcdn.com/48x36/gb.png" alt="UK" className="w-12 h-9 rounded-lg shadow-sm" />
              <img src="https://flagcdn.com/48x36/at.png" alt="Austria" className="w-12 h-9 rounded-lg shadow-sm" />
              <img src="https://flagcdn.com/48x36/de.png" alt="Germany" className="w-12 h-9 rounded-lg shadow-sm" />
              <img src="https://flagcdn.com/48x36/br.png" alt="Brazil" className="w-12 h-9 rounded-lg shadow-sm" />
            </div>
          </div>

          {/* Speaking languages */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Speaking languages</h3>
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
    </div>
  );
}
