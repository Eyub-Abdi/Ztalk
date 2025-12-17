import { useState, useMemo } from "react";
import clsx from "clsx";
import {
  FiSearch,
  FiCalendar,
  FiMessageSquare,
  FiMoreHorizontal,
  FiChevronDown,
  FiFilter,
  FiX,
} from "react-icons/fi";

// Mock student data
interface Student {
  id: number;
  name: string;
  avatar?: string;
  isOnline: boolean;
  subject: string;
  totalLessons: number;
  nextLessonDate: string;
  hasUpcomingLesson: boolean;
  languages: {
    name: string;
    level: "Native" | "Fluent" | "Advanced" | "Intermediate" | "Beginner";
    proficiency: number; // 1-5
  }[];
}

const mockStudents: Student[] = [
  {
    id: 1,
    name: "Caleb Gates",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    isOnline: true,
    subject: "Swahili",
    totalLessons: 8,
    nextLessonDate: "Dec 28, 2025 06:00 PM",
    hasUpcomingLesson: true,
    languages: [
      { name: "Arabic (Egyptian)", level: "Intermediate", proficiency: 2 },
      { name: "Dari", level: "Intermediate", proficiency: 2 },
      { name: "English", level: "Native", proficiency: 5 },
    ],
  },
  {
    id: 2,
    name: "Cindy Tolbert",
    avatar: "",
    isOnline: false,
    subject: "Swahili",
    totalLessons: 7,
    nextLessonDate: "Dec 21, 2025 06:30 PM",
    hasUpcomingLesson: true,
    languages: [{ name: "English", level: "Intermediate", proficiency: 2 }],
  },
  {
    id: 3,
    name: "Marcus Johnson",
    avatar: "https://randomuser.me/api/portraits/men/45.jpg",
    isOnline: true,
    subject: "Swahili",
    totalLessons: 15,
    nextLessonDate: "Dec 20, 2025 04:00 PM",
    hasUpcomingLesson: true,
    languages: [
      { name: "Spanish", level: "Fluent", proficiency: 4 },
      { name: "English", level: "Native", proficiency: 5 },
    ],
  },
  {
    id: 4,
    name: "Sarah Kim",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    isOnline: false,
    subject: "Swahili",
    totalLessons: 3,
    nextLessonDate: "Jan 02, 2026 10:00 AM",
    hasUpcomingLesson: true,
    languages: [
      { name: "Korean", level: "Native", proficiency: 5 },
      { name: "English", level: "Advanced", proficiency: 3 },
    ],
  },
  {
    id: 5,
    name: "David Chen",
    avatar: "https://randomuser.me/api/portraits/men/52.jpg",
    isOnline: true,
    subject: "Swahili",
    totalLessons: 22,
    nextLessonDate: "Dec 19, 2025 02:00 PM",
    hasUpcomingLesson: true,
    languages: [
      { name: "Mandarin", level: "Native", proficiency: 5 },
      { name: "English", level: "Fluent", proficiency: 4 },
      { name: "Japanese", level: "Beginner", proficiency: 1 },
    ],
  },
];

// Proficiency bar component
function ProficiencyBar({ level }: { level: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className={clsx(
            "w-1 h-3 rounded-sm",
            i <= level ? "bg-brand-500" : "bg-gray-200"
          )}
        />
      ))}
    </div>
  );
}

// Student avatar with online indicator
function StudentAvatar({
  name,
  avatar,
  isOnline,
}: {
  name: string;
  avatar?: string;
  isOnline: boolean;
}) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="relative">
      {avatar ? (
        <img
          src={avatar}
          alt={name}
          className="w-10 h-10 rounded-full object-cover"
        />
      ) : (
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-sm font-semibold">
          {initials}
        </div>
      )}
      <div
        className={clsx(
          "absolute -bottom-0.5 -left-0.5 w-3 h-3 rounded-full border-2 border-white",
          isOnline ? "bg-green-500" : "bg-gray-400"
        )}
      />
    </div>
  );
}

type TabType = "1on1" | "potential";

export default function MyStudents() {
  const [activeTab, setActiveTab] = useState<TabType>("1on1");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [languageFilter, setLanguageFilter] = useState<string | null>(null);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);

  const filteredStudents = useMemo(() => {
    let result = mockStudents;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(query) ||
          s.subject.toLowerCase().includes(query)
      );
    }

    if (languageFilter) {
      result = result.filter((s) =>
        s.languages.some((l) =>
          l.name.toLowerCase().includes(languageFilter.toLowerCase())
        )
      );
    }

    return result;
  }, [searchQuery, languageFilter]);

  const allLanguages = useMemo(() => {
    const langs = new Set<string>();
    mockStudents.forEach((s) => s.languages.forEach((l) => langs.add(l.name)));
    return Array.from(langs).sort();
  }, []);

  return (
    <div className="space-y-6">
      {/* Tabs and Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Tabs */}
        <div className="flex items-center gap-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("1on1")}
            className={clsx(
              "pb-3 text-sm font-medium transition-colors relative",
              activeTab === "1on1"
                ? "text-brand-600"
                : "text-gray-500 hover:text-gray-700"
            )}
          >
            1-on-1 Students
            {activeTab === "1on1" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-500 rounded-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("potential")}
            className={clsx(
              "pb-3 text-sm font-medium transition-colors relative",
              activeTab === "potential"
                ? "text-brand-600"
                : "text-gray-500 hover:text-gray-700"
            )}
          >
            Potential Students
            {activeTab === "potential" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-500 rounded-full" />
            )}
          </button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          {/* Language Filter */}
          <div className="relative">
            <button
              onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
              className={clsx(
                "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full border transition-colors",
                languageFilter
                  ? "bg-brand-50 border-brand-200 text-brand-700"
                  : "bg-white border-gray-200 text-gray-700 hover:border-gray-300"
              )}
            >
              <FiFilter className="w-4 h-4" />
              {languageFilter || "Lesson Language"}
              <FiChevronDown className="w-4 h-4" />
            </button>

            {showLanguageDropdown && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowLanguageDropdown(false)}
                />
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-20">
                  <button
                    onClick={() => {
                      setLanguageFilter(null);
                      setShowLanguageDropdown(false);
                    }}
                    className={clsx(
                      "w-full text-left px-4 py-2 text-sm hover:bg-gray-50",
                      !languageFilter && "text-brand-600 font-medium"
                    )}
                  >
                    All Languages
                  </button>
                  {allLanguages.map((lang) => (
                    <button
                      key={lang}
                      onClick={() => {
                        setLanguageFilter(lang);
                        setShowLanguageDropdown(false);
                      }}
                      className={clsx(
                        "w-full text-left px-4 py-2 text-sm hover:bg-gray-50",
                        languageFilter === lang && "text-brand-600 font-medium"
                      )}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Contact Form Button */}
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full border border-gray-200 bg-white text-gray-700 hover:border-gray-300 transition-colors">
            Contact Form
          </button>

          {/* Search */}
          {showSearch ? (
            <div className="relative">
              <input
                type="text"
                placeholder="Search students..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="w-48 pl-9 pr-8 py-2 text-sm border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
              />
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <button
                onClick={() => {
                  setShowSearch(false);
                  setSearchQuery("");
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full"
              >
                <FiX className="w-3 h-3 text-gray-400" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowSearch(true)}
              className="p-2.5 rounded-full border border-gray-200 bg-white text-gray-600 hover:border-gray-300 transition-colors"
            >
              <FiSearch className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Students • {filteredStudents.length}
        </h1>
        <p className="text-gray-500 mt-1">
          Students are users who have sent you a lesson request.
        </p>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <div className="col-span-3 text-sm font-semibold text-gray-700">
            Name
          </div>
          <div className="col-span-2 text-sm font-semibold text-gray-700 flex items-center gap-1">
            Total Lessons
            <span className="w-4 h-4 rounded-full border border-gray-300 text-[10px] flex items-center justify-center text-gray-400 cursor-help">
              ?
            </span>
          </div>
          <div className="col-span-3 text-sm font-semibold text-brand-600 flex items-center gap-1">
            <span className="mr-1">↓</span>
            Lesson time
            <span className="w-4 h-4 rounded-full border border-gray-300 text-[10px] flex items-center justify-center text-gray-400 cursor-help">
              ?
            </span>
          </div>
          <div className="col-span-2 text-sm font-semibold text-gray-700">
            Language Skills
          </div>
          <div className="col-span-2 text-sm font-semibold text-gray-700 text-right">
            Actions
          </div>
        </div>

        {/* Table Body */}
        {filteredStudents.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="text-gray-500">No students found</p>
          </div>
        ) : (
          filteredStudents.map((student) => (
            <div
              key={student.id}
              className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors items-center"
            >
              {/* Name & Avatar */}
              <div className="col-span-3 flex items-center gap-3">
                <StudentAvatar
                  name={student.name}
                  avatar={student.avatar}
                  isOnline={student.isOnline}
                />
                <div>
                  <p className="font-medium text-gray-900">{student.name}</p>
                  <p className="text-xs text-gray-500">
                    {student.isOnline ? (
                      <span className="text-green-600">● Online</span>
                    ) : (
                      <span className="text-gray-400">● Offline</span>
                    )}
                  </p>
                </div>
              </div>

              {/* Total Lessons */}
              <div className="col-span-2">
                <span className="text-gray-700">
                  {student.subject} • {student.totalLessons}
                </span>
              </div>

              {/* Lesson Time */}
              <div className="col-span-3 flex items-center gap-2">
                {student.hasUpcomingLesson && (
                  <span className="w-2 h-2 rounded-full bg-brand-500" />
                )}
                <span className="text-gray-700">{student.nextLessonDate}</span>
              </div>

              {/* Language Skills */}
              <div className="col-span-2">
                <div className="space-y-1">
                  {student.languages.slice(0, 3).map((lang, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm">
                      <span className="text-gray-700 truncate max-w-[100px]">
                        {lang.name}
                      </span>
                      {lang.level === "Native" ? (
                        <span className="text-brand-600 text-xs font-medium">
                          Native
                        </span>
                      ) : (
                        <ProficiencyBar level={lang.proficiency} />
                      )}
                    </div>
                  ))}
                  {student.languages.length > 3 && (
                    <p className="text-xs text-gray-400">
                      + {student.languages.length - 3} more
                    </p>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="col-span-2 flex items-center justify-end gap-2">
                <button
                  className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-colors"
                  title="Schedule lesson"
                >
                  <FiCalendar className="w-4 h-4 text-gray-600" />
                </button>
                <button
                  className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-colors"
                  title="Send message"
                >
                  <FiMessageSquare className="w-4 h-4 text-gray-600" />
                </button>
                <button
                  className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-colors"
                  title="More options"
                >
                  <FiMoreHorizontal className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Potential Students Tab Content */}
      {activeTab === "potential" && (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <FiSearch className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No potential students yet
          </h3>
          <p className="text-gray-500 max-w-md mx-auto">
            Potential students are users who have viewed your profile but
            haven't booked a lesson yet. Keep your profile updated to attract
            more students!
          </p>
        </div>
      )}
    </div>
  );
}
