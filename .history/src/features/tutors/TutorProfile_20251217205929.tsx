import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import clsx from "clsx";
import {
  FiPlay,
  FiMessageCircle,
  FiMapPin,
  FiClock,
  FiCalendar,
  FiStar,
  FiHeart,
  FiShare2,
  FiCheck,
  FiChevronDown,
  FiChevronUp,
  FiAward,
  FiBook,
  FiUsers,
  FiGlobe,
} from "react-icons/fi";

// Types
interface LanguageSkill {
  language: string;
  level: "Native" | "C2" | "C1" | "B2" | "B1" | "A2" | "A1";
  isTeaching?: boolean;
}

interface LessonType {
  id: string;
  title: string;
  description: string;
  duration: number; // minutes
  price: number;
  currency: string;
  isTrialLesson?: boolean;
}

interface Review {
  id: string;
  studentName: string;
  studentAvatar?: string;
  rating: number;
  date: Date;
  text: string;
  lessonType: string;
}

interface TutorProfileData {
  id: string;
  firstName: string;
  lastName: string;
  avatar: string;
  videoThumbnail?: string;
  videoUrl?: string;
  countryCode: string;
  countryName: string;
  city: string;
  timezone: string;
  localTime: string;
  isOnline: boolean;
  isPlusTeacher: boolean;
  tutorType: "Professional Teacher" | "Community Tutor";
  tagline: string;
  bio: string;
  teachingStyle: string;
  teacherSince: Date;
  totalLessons: number;
  totalStudents: number;
  rating: number;
  reviewCount: number;
  responseRate: number;
  responseTime: string;
  teaches: LanguageSkill[];
  speaks: LanguageSkill[];
  interests: string[];
  education: { degree: string; institution: string; year: number }[];
  certifications: { name: string; issuer: string; year: number }[];
  lessons: LessonType[];
  availability: { day: string; slots: string[] }[];
}

// Mock tutor data
const mockTutor: TutorProfileData = {
  id: "1",
  firstName: "Suleiman",
  lastName: "Salvatore",
  avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
  videoThumbnail: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
  countryCode: "tz",
  countryName: "United Republic of Tanzania",
  city: "Zanzibar",
  timezone: "UTC+03:00",
  localTime: "19:05",
  isOnline: true,
  isPlusTeacher: true,
  tutorType: "Community Tutor",
  tagline: "Experienced Swahili teacher from Zanzibar",
  bio: `I'm Suleiman from Zanzibar. I work as a language tutor online and around Zanzibar, Tanzania. I speak five languages, Swahili as my native, English, Arabic, Spanish and Portuguese. And currently I'm learning German, Russian and Mandarin. I like to learn different languages and cultures, it's my hobby.

On my quest of learning languages and cultures, I learned a lot of interesting things about different people and their way of life. I believe that language is the key to understanding any culture, and I'm passionate about helping others unlock this door.

My teaching approach is conversational and practical. I focus on real-life situations and help students build confidence in speaking from day one. Whether you're a complete beginner or looking to polish your skills, I can tailor lessons to your specific needs and goals.`,
  teachingStyle: `My teaching methodology is centered around conversation and practical application. I believe the best way to learn a language is by actually using it, so our lessons will be interactive and engaging.

For beginners, I start with basic vocabulary and simple phrases, building up your confidence gradually. For intermediate and advanced learners, I focus on fluency, pronunciation, and cultural nuances.

I use a variety of materials including:
• Real-life dialogues and role-plays
• Cultural content and current events
• Grammar explanations when needed
• Homework and exercises for practice between lessons

I'm patient, encouraging, and always ready to adapt my teaching style to what works best for you.`,
  teacherSince: new Date(2020, 7, 5),
  totalLessons: 2847,
  totalStudents: 489,
  rating: 4.9,
  reviewCount: 312,
  responseRate: 100,
  responseTime: "< 1 hour",
  teaches: [
    { language: "Swahili", level: "Native", isTeaching: true },
    { language: "English", level: "C2", isTeaching: true },
  ],
  speaks: [
    { language: "Arabic", level: "B2" },
    { language: "Spanish", level: "B2" },
    { language: "Portuguese", level: "B1" },
    { language: "German", level: "A2" },
    { language: "Norwegian", level: "A1" },
    { language: "Russian", level: "A1" },
    { language: "Korean", level: "A1" },
  ],
  interests: ["Films & TV Series", "Science", "Tech", "Travel", "Music", "Cooking"],
  education: [
    { degree: "Bachelor of Arts in Linguistics", institution: "University of Dar es Salaam", year: 2019 },
  ],
  certifications: [
    { name: "TEFL Certificate", issuer: "International TEFL Academy", year: 2020 },
    { name: "Swahili Language Teaching", issuer: "Zanzibar Language Institute", year: 2018 },
  ],
  lessons: [
    {
      id: "trial",
      title: "Trial Lesson",
      description: "Get to know each other and discuss your learning goals. I'll assess your current level and create a personalized learning plan.",
      duration: 30,
      price: 5.00,
      currency: "USD",
      isTrialLesson: true,
    },
    {
      id: "swahili-beginner",
      title: "Swahili for Beginners",
      description: "Perfect for complete beginners. Learn basic greetings, essential vocabulary, and simple conversations for travel and daily life.",
      duration: 60,
      price: 15.00,
      currency: "USD",
    },
    {
      id: "swahili-conversation",
      title: "Swahili Conversation Practice",
      description: "Improve your speaking skills through guided conversations about various topics. Great for intermediate learners.",
      duration: 60,
      price: 18.00,
      currency: "USD",
    },
    {
      id: "english-conversation",
      title: "English Conversation",
      description: "Practice English speaking in a relaxed, friendly environment. Focus on fluency, pronunciation, and natural expressions.",
      duration: 60,
      price: 12.00,
      currency: "USD",
    },
    {
      id: "zanzibar-culture",
      title: "Swahili Culture & Travel",
      description: "Learn about Swahili culture, traditions, and get tips for traveling in East Africa. Combines language learning with cultural insights.",
      duration: 60,
      price: 20.00,
      currency: "USD",
    },
  ],
  availability: [
    { day: "Monday", slots: ["9:00", "10:00", "14:00", "15:00", "16:00"] },
    { day: "Tuesday", slots: ["9:00", "10:00", "11:00", "14:00", "15:00"] },
    { day: "Wednesday", slots: ["9:00", "10:00", "14:00", "15:00", "16:00", "17:00"] },
    { day: "Thursday", slots: ["9:00", "10:00", "11:00", "14:00"] },
    { day: "Friday", slots: ["9:00", "10:00", "14:00", "15:00"] },
    { day: "Saturday", slots: ["10:00", "11:00", "12:00"] },
  ],
};

// Mock reviews
const mockReviews: Review[] = [
  {
    id: "1",
    studentName: "Maria G.",
    rating: 5,
    date: new Date(2025, 11, 10),
    text: "Suleiman is an excellent teacher! His lessons are well-structured and he makes learning Swahili so much fun. Highly recommend!",
    lessonType: "Swahili for Beginners",
  },
  {
    id: "2",
    studentName: "John D.",
    rating: 5,
    date: new Date(2025, 11, 5),
    text: "Great teacher, very patient and explains things clearly. I've learned so much in just a few lessons.",
    lessonType: "Swahili Conversation Practice",
  },
  {
    id: "3",
    studentName: "Sophie L.",
    rating: 5,
    date: new Date(2025, 10, 28),
    text: "I love learning about Zanzibar culture along with the language. Suleiman brings so much enthusiasm to his teaching!",
    lessonType: "Swahili Culture & Travel",
  },
];

// Proficiency level to bar count
const levelToBars: Record<string, number> = {
  Native: 6,
  C2: 6,
  C1: 5,
  B2: 4,
  B1: 3,
  A2: 2,
  A1: 1,
};

// Proficiency bars component
function ProficiencyBars({ level }: { level: string }) {
  const filled = levelToBars[level] || 1;
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div
          key={i}
          className={clsx(
            "w-1 h-3 rounded-sm",
            i <= filled ? "bg-gray-700" : "bg-gray-300"
          )}
        />
      ))}
    </div>
  );
}

type TabKey = "about" | "teacher" | "lessons" | "reviews" | "availability";

export default function TutorProfile() {
  const { tutorId } = useParams<{ tutorId: string }>();
  const [activeTab, setActiveTab] = useState<TabKey>("about");
  const [showFullBio, setShowFullBio] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  // In real app, fetch tutor data based on tutorId
  const tutor = mockTutor;
  const reviews = mockReviews;

  const tabs: { key: TabKey; label: string }[] = [
    { key: "about", label: "About Me" },
    { key: "teacher", label: "Me as a Teacher" },
    { key: "lessons", label: "My lessons & teaching style" },
    { key: "reviews", label: "Reviews" },
    { key: "availability", label: "Availability" },
  ];

  const trialLesson = tutor.lessons.find((l) => l.isTrialLesson);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Header Card */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <div className="flex gap-6">
                {/* Avatar Section */}
                <div className="flex-shrink-0">
                  <div className="relative">
                    <img
                      src={tutor.avatar}
                      alt={`${tutor.firstName} ${tutor.lastName}`}
                      className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                    />
                    {/* Country Flag */}
                    <img
                      src={`https://flagcdn.com/48x36/${tutor.countryCode}.png`}
                      alt={tutor.countryName}
                      className="absolute -bottom-1 -right-1 w-8 h-6 rounded shadow-sm border border-white"
                    />
                  </div>
                  {/* Online Status */}
                  <div className="flex items-center justify-center gap-1.5 mt-3">
                    <div
                      className={clsx(
                        "w-2.5 h-2.5 rounded-full",
                        tutor.isOnline ? "bg-green-500" : "bg-gray-400"
                      )}
                    />
                    <span
                      className={clsx(
                        "text-sm font-medium",
                        tutor.isOnline ? "text-green-600" : "text-gray-500"
                      )}
                    >
                      {tutor.isOnline ? "Online" : "Offline"}
                    </span>
                  </div>
                </div>

                {/* Info Section */}
                <div className="flex-1 min-w-0">
                  {/* Name & Badge */}
                  <div className="flex items-center gap-3 flex-wrap">
                    <h1 className="text-2xl font-bold text-gray-900">
                      {tutor.firstName} {tutor.lastName}
                    </h1>
                    {tutor.isPlusTeacher && (
                      <span className="px-2.5 py-1 bg-indigo-600 text-white text-xs font-bold rounded-full">
                        Plus+
                      </span>
                    )}
                  </div>

                  {/* Tutor Type */}
                  <div className="flex items-center gap-2 mt-1">
                    <span className="px-3 py-1 bg-amber-100 text-amber-700 text-sm font-medium rounded-full flex items-center gap-1.5">
                      <FiAward className="w-3.5 h-3.5" />
                      {tutor.tutorType}
                    </span>
                  </div>

                  {/* Teaches */}
                  <div className="flex items-start gap-4 mt-4">
                    <span className="text-sm text-gray-500 pt-0.5 min-w-[60px]">Teaches</span>
                    <div className="flex flex-wrap gap-3">
                      {tutor.teaches.map((lang) => (
                        <div key={lang.language} className="flex items-center gap-2">
                          <span className="font-medium text-gray-900">{lang.language}</span>
                          {lang.level === "Native" ? (
                            <span className="px-2 py-0.5 bg-red-100 text-red-600 text-xs font-medium rounded">
                              Native
                            </span>
                          ) : (
                            <ProficiencyBars level={lang.level} />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Speaks */}
                  <div className="flex items-start gap-4 mt-3">
                    <span className="text-sm text-gray-500 pt-0.5 min-w-[60px]">Speaks</span>
                    <div className="flex flex-wrap gap-x-4 gap-y-2">
                      {tutor.speaks.map((lang) => (
                        <div key={lang.language} className="flex items-center gap-1.5">
                          <span className="text-sm text-gray-700">{lang.language}</span>
                          <ProficiencyBars level={lang.level} />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tagline */}
                  <p className="mt-4 text-gray-600">{tutor.tagline}</p>
                </div>
              </div>

              {/* Action buttons - mobile */}
              <div className="flex gap-3 mt-6 lg:hidden">
                <button
                  onClick={() => setIsFavorited(!isFavorited)}
                  className={clsx(
                    "p-3 rounded-xl border-2 transition-all",
                    isFavorited
                      ? "border-red-200 bg-red-50 text-red-500"
                      : "border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200"
                  )}
                >
                  <FiHeart className={clsx("w-5 h-5", isFavorited && "fill-current")} />
                </button>
                <button className="p-3 rounded-xl border-2 border-gray-200 text-gray-400 hover:text-brand-500 hover:border-brand-200 transition-all">
                  <FiShare2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="border-b border-gray-200">
                <div className="flex overflow-x-auto">
                  {tabs.map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      className={clsx(
                        "px-6 py-4 text-sm font-semibold whitespace-nowrap transition-colors relative",
                        activeTab === tab.key
                          ? "text-gray-900"
                          : "text-gray-500 hover:text-gray-700"
                      )}
                    >
                      {tab.label}
                      {activeTab === tab.key && (
                        <div className="absolute bottom-0 left-6 right-6 h-0.5 bg-red-500 rounded-full" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-6">
                {/* About Me Tab */}
                {activeTab === "about" && (
                  <div className="space-y-6">
                    {/* Location & Time */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-gray-600">
                        <FiMapPin className="w-4 h-4 text-gray-400" />
                        <span>From {tutor.countryName}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <FiGlobe className="w-4 h-4 text-gray-400" />
                        <span>
                          Living in {tutor.city}, {tutor.countryName} ({tutor.localTime} {tutor.timezone})
                        </span>
                      </div>
                    </div>

                    {/* About Me Section */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-bold text-gray-900">About Me</h3>
                        <span className="text-sm text-gray-500">
                          Teacher since {tutor.teacherSince.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </span>
                      </div>

                      {/* Interests */}
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-sm text-gray-500">Interests</span>
                        <div className="flex flex-wrap gap-2">
                          {tutor.interests.map((interest) => (
                            <span
                              key={interest}
                              className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-lg border border-gray-200"
                            >
                              {interest}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Bio */}
                      <div className="relative">
                        <p
                          className={clsx(
                            "text-gray-700 leading-relaxed whitespace-pre-line",
                            !showFullBio && "line-clamp-4"
                          )}
                        >
                          {tutor.bio}
                        </p>
                        <button
                          onClick={() => setShowFullBio(!showFullBio)}
                          className="text-brand-600 font-semibold text-sm mt-2 hover:underline flex items-center gap-1"
                        >
                          {showFullBio ? (
                            <>
                              Show less <FiChevronUp className="w-4 h-4" />
                            </>
                          ) : (
                            <>
                              Read more <FiChevronDown className="w-4 h-4" />
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Education & Certifications */}
                    {(tutor.education.length > 0 || tutor.certifications.length > 0) && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
                        {tutor.education.length > 0 && (
                          <div>
                            <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                              <FiBook className="w-4 h-4 text-gray-500" />
                              Education
                            </h4>
                            <div className="space-y-2">
                              {tutor.education.map((edu, idx) => (
                                <div key={idx} className="text-sm">
                                  <p className="font-medium text-gray-900">{edu.degree}</p>
                                  <p className="text-gray-500">{edu.institution} • {edu.year}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        {tutor.certifications.length > 0 && (
                          <div>
                            <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                              <FiAward className="w-4 h-4 text-gray-500" />
                              Certifications
                            </h4>
                            <div className="space-y-2">
                              {tutor.certifications.map((cert, idx) => (
                                <div key={idx} className="text-sm">
                                  <p className="font-medium text-gray-900">{cert.name}</p>
                                  <p className="text-gray-500">{cert.issuer} • {cert.year}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Me as a Teacher Tab */}
                {activeTab === "teacher" && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-bold text-gray-900">My Teaching Approach</h3>
                    <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                      {tutor.teachingStyle}
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-gray-100">
                      <div className="text-center p-4 bg-gray-50 rounded-xl">
                        <p className="text-3xl font-bold text-gray-900">{tutor.totalLessons.toLocaleString()}</p>
                        <p className="text-sm text-gray-500 mt-1">Lessons taught</p>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-xl">
                        <p className="text-3xl font-bold text-gray-900">{tutor.totalStudents}</p>
                        <p className="text-sm text-gray-500 mt-1">Students</p>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-xl">
                        <p className="text-3xl font-bold text-gray-900">{tutor.responseRate}%</p>
                        <p className="text-sm text-gray-500 mt-1">Response rate</p>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-xl">
                        <p className="text-3xl font-bold text-gray-900">{tutor.responseTime}</p>
                        <p className="text-sm text-gray-500 mt-1">Response time</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Lessons Tab */}
                {activeTab === "lessons" && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Available Lessons</h3>
                    {tutor.lessons.map((lesson) => (
                      <div
                        key={lesson.id}
                        className={clsx(
                          "p-5 rounded-xl border-2 transition-all hover:shadow-md",
                          lesson.isTrialLesson
                            ? "border-brand-200 bg-brand-50/50"
                            : "border-gray-200 hover:border-brand-200"
                        )}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold text-gray-900">{lesson.title}</h4>
                              {lesson.isTrialLesson && (
                                <span className="px-2 py-0.5 bg-brand-500 text-white text-xs font-medium rounded">
                                  Trial
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{lesson.description}</p>
                            <div className="flex items-center gap-3 mt-3 text-sm text-gray-500">
                              <span className="flex items-center gap-1">
                                <FiClock className="w-4 h-4" />
                                {lesson.duration} min
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xl font-bold text-gray-900">
                              {lesson.currency} {lesson.price.toFixed(2)}
                            </p>
                            <button className="mt-2 px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold rounded-lg transition-colors">
                              Book
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Reviews Tab */}
                {activeTab === "reviews" && (
                  <div className="space-y-6">
                    {/* Rating Summary */}
                    <div className="flex items-center gap-6 pb-6 border-b border-gray-100">
                      <div className="text-center">
                        <p className="text-5xl font-bold text-gray-900">{tutor.rating}</p>
                        <div className="flex gap-1 justify-center mt-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <FiStar
                              key={star}
                              className={clsx(
                                "w-5 h-5",
                                star <= Math.floor(tutor.rating)
                                  ? "text-yellow-400 fill-current"
                                  : "text-gray-300"
                              )}
                            />
                          ))}
                        </div>
                        <p className="text-sm text-gray-500 mt-1">{tutor.reviewCount} reviews</p>
                      </div>
                    </div>

                    {/* Review List */}
                    <div className="space-y-6">
                      {reviews.map((review) => (
                        <div key={review.id} className="pb-6 border-b border-gray-100 last:border-0">
                          <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white font-semibold">
                              {review.studentName.charAt(0)}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-gray-900">{review.studentName}</span>
                                <div className="flex gap-0.5">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <FiStar
                                      key={star}
                                      className={clsx(
                                        "w-4 h-4",
                                        star <= review.rating
                                          ? "text-yellow-400 fill-current"
                                          : "text-gray-300"
                                      )}
                                    />
                                  ))}
                                </div>
                              </div>
                              <p className="text-xs text-gray-500 mt-0.5">
                                {review.lessonType} • {review.date.toLocaleDateString()}
                              </p>
                              <p className="text-gray-700 mt-2">{review.text}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <button className="w-full py-3 text-brand-600 font-semibold hover:bg-brand-50 rounded-xl transition-colors">
                      See all {tutor.reviewCount} reviews
                    </button>
                  </div>
                )}

                {/* Availability Tab */}
                {activeTab === "availability" && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Weekly Availability</h3>
                    <p className="text-sm text-gray-500 mb-4">
                      Times shown in teacher's timezone ({tutor.timezone})
                    </p>
                    <div className="space-y-3">
                      {tutor.availability.map((day) => (
                        <div key={day.day} className="flex items-start gap-4">
                          <span className="w-24 text-sm font-medium text-gray-700">{day.day}</span>
                          <div className="flex flex-wrap gap-2">
                            {day.slots.map((slot) => (
                              <button
                                key={slot}
                                className="px-3 py-1.5 bg-green-100 text-green-700 text-sm font-medium rounded-lg hover:bg-green-200 transition-colors"
                              >
                                {slot}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                    <Link
                      to={`/book/${tutor.id}`}
                      className="block w-full py-3 mt-6 bg-brand-500 hover:bg-brand-600 text-white text-center font-semibold rounded-xl transition-colors"
                    >
                      View Full Calendar & Book
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Video Card */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="relative aspect-video bg-gray-900">
                <img
                  src={tutor.videoThumbnail || tutor.avatar}
                  alt="Introduction video"
                  className="w-full h-full object-cover opacity-90"
                />
                <button className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-colors group">
                  <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <FiPlay className="w-8 h-8 text-gray-900 ml-1" />
                  </div>
                </button>
              </div>

              <div className="p-5">
                {trialLesson && (
                  <div className="mb-4">
                    <div className="flex items-center gap-2 text-lg font-bold text-gray-900">
                      <span>Trial Lesson</span>
                      <FiHeart className="w-4 h-4 text-gray-400" />
                      <span className="ml-auto">
                        {trialLesson.currency} {trialLesson.price.toFixed(2)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1 flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded-full border border-gray-300 flex items-center justify-center">
                        <span className="text-xs">i</span>
                      </span>
                      Sadly, you can't book your own lessons.
                    </p>
                  </div>
                )}

                <button className="w-full py-3 bg-gray-300 text-gray-500 font-semibold rounded-xl cursor-not-allowed">
                  Book lesson
                </button>

                <button className="w-full py-3 mt-3 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                  <FiMessageCircle className="w-5 h-5" />
                  Contact teacher
                </button>
              </div>
            </div>

            {/* Quick Stats Card */}
            <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">Teacher Stats</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 flex items-center gap-2">
                    <FiStar className="w-4 h-4 text-yellow-400" />
                    Rating
                  </span>
                  <span className="font-semibold text-gray-900">{tutor.rating} ({tutor.reviewCount})</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 flex items-center gap-2">
                    <FiBook className="w-4 h-4 text-brand-500" />
                    Lessons
                  </span>
                  <span className="font-semibold text-gray-900">{tutor.totalLessons.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 flex items-center gap-2">
                    <FiUsers className="w-4 h-4 text-green-500" />
                    Students
                  </span>
                  <span className="font-semibold text-gray-900">{tutor.totalStudents}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 flex items-center gap-2">
                    <FiClock className="w-4 h-4 text-purple-500" />
                    Response
                  </span>
                  <span className="font-semibold text-gray-900">{tutor.responseTime}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="hidden lg:flex gap-3">
              <button
                onClick={() => setIsFavorited(!isFavorited)}
                className={clsx(
                  "flex-1 py-3 rounded-xl border-2 font-semibold transition-all flex items-center justify-center gap-2",
                  isFavorited
                    ? "border-red-200 bg-red-50 text-red-500"
                    : "border-gray-200 text-gray-600 hover:text-red-500 hover:border-red-200"
                )}
              >
                <FiHeart className={clsx("w-5 h-5", isFavorited && "fill-current")} />
                {isFavorited ? "Saved" : "Save"}
              </button>
              <button className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-gray-600 font-semibold hover:text-brand-500 hover:border-brand-200 transition-all flex items-center justify-center gap-2">
                <FiShare2 className="w-5 h-5" />
                Share
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
