import { Link } from "react-router-dom";
import {
  FiSearch,
  FiCalendar,
  FiBookOpen,
  FiStar,
  FiClock,
  FiTrendingUp,
  FiAward,
} from "react-icons/fi";
import clsx from "clsx";

// Mock data
const mockUpcomingLessons = [
  {
    id: "1",
    tutorName: "Sarah Johnson",
    tutorAvatar: "SJ",
    lessonTitle: "Advanced Swahili Conversation",
    language: "Swahili",
    duration: 60,
    scheduledAt: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
    avatarColor: "bg-purple-500",
  },
  {
    id: "2",
    tutorName: "James Miller",
    tutorAvatar: "JM",
    lessonTitle: "Swahili Grammar Basics",
    language: "Swahili",
    duration: 30,
    scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
    avatarColor: "bg-blue-500",
  },
  {
    id: "3",
    tutorName: "Maria Garcia",
    tutorAvatar: "MG",
    lessonTitle: "Travel Swahili",
    language: "Swahili",
    duration: 45,
    scheduledAt: new Date(Date.now() + 48 * 60 * 60 * 1000), // 2 days from now
    avatarColor: "bg-green-500",
  },
];

const mockRecentTutors = [
  {
    id: "1",
    name: "Sarah Johnson",
    avatar: "SJ",
    rating: 4.9,
    lessons: 24,
    specialty: "Conversation Expert",
    avatarColor: "bg-purple-500",
  },
  {
    id: "2",
    name: "James Miller",
    avatar: "JM",
    rating: 4.8,
    lessons: 12,
    specialty: "Grammar Specialist",
    avatarColor: "bg-blue-500",
  },
  {
    id: "3",
    name: "Maria Garcia",
    avatar: "MG",
    rating: 5.0,
    lessons: 8,
    specialty: "Travel & Culture",
    avatarColor: "bg-green-500",
  },
];

function QuickAction({
  icon: Icon,
  label,
  to,
  color,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  to: string;
  color: string;
}) {
  const colorClasses = {
    brand: "from-brand-500 to-brand-600 hover:shadow-brand-500/30",
    green: "from-green-500 to-emerald-600 hover:shadow-green-500/30",
    blue: "from-blue-500 to-indigo-600 hover:shadow-blue-500/30",
    purple: "from-purple-500 to-purple-600 hover:shadow-purple-500/30",
  };

  return (
    <Link
      to={to}
      className={clsx(
        "group relative overflow-hidden flex flex-col items-center justify-center gap-3 p-6 rounded-2xl bg-gradient-to-br text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1",
        colorClasses[color as keyof typeof colorClasses]
      )}
    >
      <div className="p-3 bg-white/20 rounded-xl group-hover:bg-white/30 transition-colors">
        <Icon className="w-6 h-6" />
      </div>
      <span className="text-sm font-semibold text-center">{label}</span>
    </Link>
  );
}

function UpcomingLessonCard({
  lesson,
}: {
  lesson: (typeof mockUpcomingLessons)[0];
}) {
  const now = new Date();
  const timeDiff = lesson.scheduledAt.getTime() - now.getTime();
  const hoursUntil = Math.floor(timeDiff / (1000 * 60 * 60));
  const minutesUntil = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

  const timeText =
    hoursUntil < 24
      ? `${hoursUntil}h ${minutesUntil}m`
      : `${Math.floor(hoursUntil / 24)}d`;

  return (
    <div className="group bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className={clsx(
              "w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md",
              lesson.avatarColor
            )}
          >
            {lesson.tutorAvatar}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{lesson.tutorName}</h3>
            <p className="text-xs text-gray-500">{lesson.language} Tutor</p>
          </div>
        </div>
        <span className="px-3 py-1 bg-brand-50 text-brand-600 text-xs font-medium rounded-full">
          {lesson.duration} min
        </span>
      </div>

      <h4 className="font-medium text-gray-800 mb-3">{lesson.lessonTitle}</h4>

      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <FiClock className="w-4 h-4" />
          <span>in {timeText}</span>
        </div>
        <Link
          to={`/dashboard/student/bookings`}
          className="text-sm font-medium text-brand-600 hover:text-brand-700"
        >
          View Details →
        </Link>
      </div>
    </div>
  );
}

function TutorCard({ tutor }: { tutor: (typeof mockRecentTutors)[0] }) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <div className="flex items-center gap-3 mb-4">
        <div
          className={clsx(
            "w-14 h-14 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-md",
            tutor.avatarColor
          )}
        >
          {tutor.avatar}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{tutor.name}</h3>
          <p className="text-xs text-gray-500">{tutor.specialty}</p>
        </div>
      </div>

      <div className="flex items-center gap-4 text-sm mb-4">
        <div className="flex items-center gap-1">
          <FiStar className="w-4 h-4 text-yellow-500 fill-yellow-500" />
          <span className="font-semibold text-gray-900">{tutor.rating}</span>
        </div>
        <div className="text-gray-600">{tutor.lessons} lessons</div>
      </div>

      <Link
        to={`/dashboard/student/find-tutors`}
        className="block w-full py-2 text-center text-sm font-medium text-brand-600 bg-brand-50 rounded-xl hover:bg-brand-100 transition-colors"
      >
        Book Again
      </Link>
    </div>
  );
}

export default function StudentOverview() {
  return (
    <div className="max-w-7xl mx-auto space-y-8 px-6 py-8">
      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <QuickAction
            icon={FiSearch}
            label="Find Tutors"
            to="/dashboard/student/find-tutors"
            color="brand"
          />
          <QuickAction
            icon={FiCalendar}
            label="My Bookings"
            to="/dashboard/student/bookings"
            color="green"
          />
          <QuickAction
            icon={FiBookOpen}
            label="My Lessons"
            to="/dashboard/student/my-lessons"
            color="blue"
          />
          <QuickAction
            icon={FiStar}
            label="Favorites"
            to="/dashboard/student/favorites"
            color="purple"
          />
        </div>
      </div>

      {/* Learning Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <FiBookOpen className="w-8 h-8 opacity-80" />
            <FiTrendingUp className="w-5 h-5 opacity-60" />
          </div>
          <p className="text-sm opacity-90 mb-1">Total Lessons</p>
          <p className="text-3xl font-bold">24</p>
          <p className="text-xs opacity-75 mt-2">+3 this week</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <FiClock className="w-8 h-8 opacity-80" />
            <FiTrendingUp className="w-5 h-5 opacity-60" />
          </div>
          <p className="text-sm opacity-90 mb-1">Hours Learned</p>
          <p className="text-3xl font-bold">18h</p>
          <p className="text-xs opacity-75 mt-2">+2.5h this week</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <FiAward className="w-8 h-8 opacity-80" />
            <FiStar className="w-5 h-5 opacity-60" />
          </div>
          <p className="text-sm opacity-90 mb-1">Favorite Tutors</p>
          <p className="text-3xl font-bold">5</p>
          <p className="text-xs opacity-75 mt-2">Bookmarked</p>
        </div>
      </div>

      {/* Upcoming Lessons */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Upcoming Lessons</h2>
          <Link
            to="/dashboard/student/upcoming"
            className="text-sm font-medium text-brand-600 hover:text-brand-700"
          >
            View All →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockUpcomingLessons.map((lesson) => (
            <UpcomingLessonCard key={lesson.id} lesson={lesson} />
          ))}
        </div>
      </div>

      {/* Recent Tutors */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Recent Tutors</h2>
          <Link
            to="/dashboard/student/find-tutors"
            className="text-sm font-medium text-brand-600 hover:text-brand-700"
          >
            Find More →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockRecentTutors.map((tutor) => (
            <TutorCard key={tutor.id} tutor={tutor} />
          ))}
        </div>
      </div>

      {/* Learning Tips */}
      <div className="bg-gradient-to-r from-brand-50 to-blue-50 border border-brand-100 rounded-2xl p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-white rounded-xl shadow-sm">
            <FiAward className="w-6 h-6 text-brand-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-2">
              Keep up the great work! 🎉
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              You've completed 3 lessons this week. Try to maintain your
              learning streak by booking your next lesson today.
            </p>
            <Link
              to="/dashboard/student/find-tutors"
              className="inline-flex items-center gap-2 px-4 py-2 bg-brand-600 text-white text-sm font-medium rounded-xl hover:bg-brand-700 transition-colors"
            >
              <FiSearch className="w-4 h-4" />
              Find a Tutor
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
