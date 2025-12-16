import { FiPlay, FiStar, FiVideo, FiGlobe, FiClock } from "react-icons/fi";
import { HiBadgeCheck } from "react-icons/hi";

interface Tutor {
  id: string;
  name: string;
  avatar?: string;
  rating: number;
  reviews: number;
  pricePerLesson: number;
  introVideo?: string;
  specialties: string[];
  languages: string[];
  country: string;
  availabilityTag?: string;
  verified?: boolean;
}

const TUTORS: Tutor[] = [
  {
    id: "t1",
    name: "Aisha",
    rating: 4.9,
    reviews: 128,
    pricePerLesson: 12,
    specialties: ["Safari phrases", "Market negotiation"],
    languages: ["Swahili", "English"],
    country: "TZ",
    availabilityTag: "Fast response",
    verified: true,
  },
  {
    id: "t2",
    name: "Juma",
    rating: 4.8,
    reviews: 94,
    pricePerLesson: 11,
    specialties: ["Cultural etiquette", "Traveler safety"],
    languages: ["Swahili", "English", "French"],
    country: "TZ",
    availabilityTag: "New content",
    verified: true,
  },
  {
    id: "t3",
    name: "Neema",
    rating: 5.0,
    reviews: 210,
    pricePerLesson: 15,
    specialties: ["Beginners", "Pronunciation"],
    languages: ["Swahili", "English", "German"],
    country: "TZ",
    verified: true,
  },
  {
    id: "t4",
    name: "Salim",
    rating: 4.7,
    reviews: 77,
    pricePerLesson: 10,
    specialties: ["Traveler basics", "Custom phrase packs"],
    languages: ["Swahili", "English", "Italian"],
    country: "TZ",
    verified: false,
  },
];

function Rating({ value, reviews }: { value: number; reviews?: number }) {
  return (
    <div
      className="flex items-center gap-1.5 bg-orange-50 px-2.5 py-1 rounded-full text-xs font-semibold transition-all duration-200 hover:scale-105"
      aria-label={`Rating ${value}`}
    >
      <FiStar className="w-3.5 h-3.5 text-orange-500 fill-orange-400" />
      <span className="text-orange-800">{value.toFixed(1)}</span>
      {reviews && <span className="text-gray-600">({reviews})</span>}
    </div>
  );
}

function TutorCard({ tutor }: { tutor: Tutor }) {
  return (
    <div className="group flex flex-col gap-4 p-5 rounded-2xl bg-white border border-gray-200 shadow-md relative transition-all duration-300 overflow-hidden hover:shadow-xl hover:-translate-y-1.5 hover:border-orange-300">
      {/* Preview video placeholder */}
      <div className="relative rounded-lg overflow-hidden aspect-[4/3] bg-gray-100 flex items-center justify-center">
        <FiVideo className="w-10 h-10 text-gray-400" />
        <button className="absolute bottom-2 left-2 flex items-center gap-1 px-2 py-1 text-xs font-medium bg-brand-500 text-white rounded-md hover:bg-brand-600 transition-colors">
          <FiPlay className="w-3 h-3" />
          Preview
        </button>
      </div>

      {/* Tutor info header */}
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-sm font-semibold">
          {tutor.name.charAt(0)}
        </div>
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-1 max-w-full">
              <h3 className="text-sm font-semibold text-gray-900 truncate flex items-center gap-1">
                {tutor.name}
                {tutor.verified && (
                  <HiBadgeCheck
                    className="w-4 h-4 text-brand-500 flex-shrink-0"
                    aria-label="Verified tutor"
                    title="Verified tutor"
                  />
                )}
              </h3>
            </div>
            <Rating value={tutor.rating} reviews={tutor.reviews} />
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <FiGlobe className="w-3 h-3" />
            <span className="truncate">{tutor.languages.join(", ")}</span>
          </div>
        </div>
      </div>

      {/* Specialties */}
      <div className="space-y-2">
        <div className="flex flex-wrap gap-2">
          {tutor.specialties.slice(0, 3).map((s) => (
            <span
              key={s}
              className="badge badge-brand text-[10px] px-2 py-0.5 rounded-full"
            >
              {s}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between text-sm text-gray-700">
          <div className="flex items-center gap-1">
            <FiClock className="w-4 h-4" />
            <span>{tutor.pricePerLesson}$ / lesson</span>
          </div>
          {tutor.availabilityTag && (
            <span className="badge badge-green text-[10px] rounded-full">
              {tutor.availabilityTag}
            </span>
          )}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-2 pt-1">
        <button className="btn btn-sm btn-outline flex-1">Profile</button>
        <button className="btn btn-sm btn-primary flex-1">Book</button>
      </div>
    </div>
  );
}

export function FeaturedTutors() {
  return (
    <section id="featured-tutors" className="py-16 md:py-24">
      <div className="container-main">
        <div className="space-y-10">
          <div className="space-y-4 max-w-2xl">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              Featured tutors
            </h2>
            <p className="text-base md:text-lg text-gray-600">
              Handpicked for practical, respectful, traveler-focused Swahili
              learning.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TUTORS.map((t) => (
              <TutorCard key={t.id} tutor={t} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
