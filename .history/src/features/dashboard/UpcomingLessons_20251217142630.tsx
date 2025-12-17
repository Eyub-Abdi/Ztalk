import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import clsx from "clsx";
import { FiArrowLeft, FiCalendar, FiClock } from "react-icons/fi";

// Mock upcoming lessons data
const mockUpcomingLessons = [
  {
    id: "4205457368",
    studentName: "Íñigo",
    lessonTitle: "Swahili For Beginners, Travel & Tourism",
    language: "Swahili",
    duration: 60,
    scheduledAt: new Date(Date.now() + 19 * 60 * 60 * 1000 + 22 * 60 * 1000),
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
  {
    id: "5847291034",
    studentName: "James Wilson",
    lessonTitle: "Business Swahili Essentials",
    language: "Swahili",
    duration: 45,
    scheduledAt: new Date("2025-12-22T14:00:00"),
    avatarColor: "bg-blue-500",
  },
  {
    id: "9182736450",
    studentName: "Sarah Chen",
    lessonTitle: "Swahili Pronunciation Mastery",
    language: "Swahili",
    duration: 30,
    scheduledAt: new Date("2025-12-23T10:30:00"),
    avatarColor: "bg-purple-500",
  },
  {
    id: "6473829156",
    studentName: "Ahmed Hassan",
    lessonTitle: "Swahili For Beginners, Travel & Tourism",
    language: "Swahili",
    duration: 60,
    scheduledAt: new Date("2025-12-24T16:00:00"),
    avatarColor: "bg-rose-500",
  },
  {
    id: "3829475610",
    studentName: "Maria Garcia",
    lessonTitle: "Conversational Swahili Practice",
    language: "Swahili",
    duration: 45,
    scheduledAt: new Date("2025-12-25T11:00:00"),
    avatarColor: "bg-orange-500",
  },
  {
    id: "7584920316",
    studentName: "David Kim",
    lessonTitle: "Swahili Grammar Deep Dive",
    language: "Swahili",
    duration: 60,
    scheduledAt: new Date("2025-12-26T09:00:00"),
    avatarColor: "bg-teal-500",
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

export default function UpcomingLessons() {
  const [visibleCount, setVisibleCount] = useState(5);

  const showMore = () => {
    setVisibleCount((prev) => Math.min(prev + 5, mockUpcomingLessons.length));
  };

  const visibleLessons = mockUpcomingLessons.slice(0, visibleCount);
  const hasMore = visibleCount < mockUpcomingLessons.length;

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Upcoming Lessons</h1>
        <p className="text-sm text-gray-500">
          {mockUpcomingLessons.length} lessons scheduled
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-brand-50 rounded-xl">
              <FiCalendar className="w-5 h-5 text-brand-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {mockUpcomingLessons.length}
              </p>
              <p className="text-xs text-gray-500">Total Upcoming</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-50 rounded-xl">
              <FiClock className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {mockUpcomingLessons.reduce((acc, l) => acc + l.duration, 0)}{" "}
                min
              </p>
              <p className="text-xs text-gray-500">Total Duration</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-purple-50 rounded-xl">
              <FiCalendar className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">This Week</p>
              <p className="text-xs text-gray-500">Next lesson</p>
            </div>
          </div>
        </div>
      </div>

      {/* Lessons List */}
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
          {visibleLessons.map((lesson, index) => (
            <UpcomingLessonCard
              key={lesson.id}
              lesson={lesson}
              isFirst={index === 0}
            />
          ))}
        </div>

        {hasMore && (
          <div className="mt-5 flex justify-center">
            <button
              onClick={showMore}
              className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-sm transition-all"
            >
              Show more ({mockUpcomingLessons.length - visibleCount} remaining)
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
