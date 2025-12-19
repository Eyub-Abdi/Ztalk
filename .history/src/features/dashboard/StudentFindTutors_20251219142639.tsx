import { useState } from "react";
import {
  FiSearch,
  FiStar,
  FiFilter,
  FiMapPin,
  FiDollarSign,
  FiClock,
} from "react-icons/fi";
import clsx from "clsx";

const mockTutors = [
  {
    id: "1",
    name: "Sarah Johnson",
    avatar: "SJ",
    avatarColor: "bg-purple-500",
    rating: 4.9,
    reviewCount: 127,
    lessonsCompleted: 450,
    hourlyRate: 25,
    languages: ["Swahili", "English"],
    specialties: ["Conversation", "Business Swahili"],
    location: "Tanzania",
    description:
      "Experienced Swahili tutor specializing in conversational skills and business communication.",
    availability: "Available now",
  },
  {
    id: "2",
    name: "James Miller",
    avatar: "JM",
    avatarColor: "bg-blue-500",
    rating: 4.8,
    reviewCount: 95,
    lessonsCompleted: 320,
    hourlyRate: 20,
    languages: ["Swahili", "English", "French"],
    specialties: ["Grammar", "Exam Preparation"],
    location: "Kenya",
    description:
      "Patient tutor with expertise in Swahili grammar and test preparation.",
    availability: "Available tomorrow",
  },
  {
    id: "3",
    name: "Maria Garcia",
    avatar: "MG",
    avatarColor: "bg-green-500",
    rating: 5.0,
    reviewCount: 203,
    lessonsCompleted: 580,
    hourlyRate: 30,
    languages: ["Swahili", "Spanish", "English"],
    specialties: ["Travel", "Culture", "Pronunciation"],
    location: "Uganda",
    description:
      "Native speaker passionate about teaching Swahili culture and travel phrases.",
    availability: "Available now",
  },
  {
    id: "4",
    name: "David Chen",
    avatar: "DC",
    avatarColor: "bg-orange-500",
    rating: 4.7,
    reviewCount: 78,
    lessonsCompleted: 210,
    hourlyRate: 22,
    languages: ["Swahili", "Mandarin", "English"],
    specialties: ["Beginners", "Kids"],
    location: "Tanzania",
    description:
      "Fun and engaging tutor specializing in teaching beginners and children.",
    availability: "Available this week",
  },
];

function TutorCard({ tutor }: { tutor: (typeof mockTutors)[0] }) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          <div
            className={clsx(
              "w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg",
              tutor.avatarColor
            )}
          >
            {tutor.avatar}
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">{tutor.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <FiMapPin className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">{tutor.location}</span>
            </div>
          </div>
        </div>
        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <FiStar className="w-5 h-5 text-gray-400 hover:text-yellow-500" />
        </button>
      </div>

      {/* Rating & Stats */}
      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-1">
          <FiStar className="w-4 h-4 text-yellow-500 fill-yellow-500" />
          <span className="font-semibold text-gray-900">{tutor.rating}</span>
          <span className="text-sm text-gray-500">({tutor.reviewCount})</span>
        </div>
        <div className="text-sm text-gray-600">
          {tutor.lessonsCompleted} lessons
        </div>
        <span
          className={clsx(
            "px-2 py-1 text-xs font-medium rounded-full",
            tutor.availability === "Available now"
              ? "bg-green-100 text-green-700"
              : "bg-blue-100 text-blue-700"
          )}
        >
          {tutor.availability}
        </span>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
        {tutor.description}
      </p>

      {/* Languages */}
      <div className="mb-4">
        <p className="text-xs font-semibold text-gray-500 mb-2">Languages</p>
        <div className="flex flex-wrap gap-2">
          {tutor.languages.map((lang) => (
            <span
              key={lang}
              className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full"
            >
              {lang}
            </span>
          ))}
        </div>
      </div>

      {/* Specialties */}
      <div className="mb-4">
        <p className="text-xs font-semibold text-gray-500 mb-2">Specialties</p>
        <div className="flex flex-wrap gap-2">
          {tutor.specialties.map((specialty) => (
            <span
              key={specialty}
              className="px-3 py-1 bg-brand-50 text-brand-700 text-xs font-medium rounded-full"
            >
              {specialty}
            </span>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <FiDollarSign className="w-5 h-5 text-gray-500" />
          <span className="text-lg font-bold text-gray-900">
            ${tutor.hourlyRate}
          </span>
          <span className="text-sm text-gray-500">/hour</span>
        </div>
        <button className="px-5 py-2.5 bg-brand-600 text-white font-medium rounded-xl hover:bg-brand-700 transition-colors">
          Book Trial
        </button>
      </div>
    </div>
  );
}

export default function StudentFindTutors() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("all");
  const [priceRange, setPriceRange] = useState("all");

  return (
    <div className="max-w-7xl mx-auto space-y-6 px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Find Your Perfect Tutor
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Browse {mockTutors.length} experienced Swahili tutors
          </p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or specialty..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            />
          </div>

          {/* Language Filter */}
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent appearance-none bg-white"
          >
            <option value="all">All Languages</option>
            <option value="swahili">Swahili</option>
            <option value="english">English</option>
            <option value="french">French</option>
          </select>

          {/* Price Range Filter */}
          <select
            value={priceRange}
            onChange={(e) => setPriceRange(e.target.value)}
            className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent appearance-none bg-white"
          >
            <option value="all">All Prices</option>
            <option value="0-20">$0 - $20</option>
            <option value="20-30">$20 - $30</option>
            <option value="30+">$30+</option>
          </select>
        </div>

        {/* Active Filters */}
        <div className="flex items-center gap-2 mt-4">
          <FiFilter className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">
            Active filters:
          </span>
          <button className="px-3 py-1 bg-brand-100 text-brand-700 text-xs font-medium rounded-full hover:bg-brand-200 transition-colors">
            Available Now ×
          </button>
        </div>
      </div>

      {/* Tutors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {mockTutors.map((tutor) => (
          <TutorCard key={tutor.id} tutor={tutor} />
        ))}
      </div>

      {/* Load More */}
      <div className="flex justify-center pt-4">
        <button className="px-6 py-3 bg-white border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors">
          Load More Tutors
        </button>
      </div>
    </div>
  );
}
