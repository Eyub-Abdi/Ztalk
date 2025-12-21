import { FiPlay, FiStar, FiVideo, FiGlobe, FiClock } from "react-icons/fi";
import { HiBadgeCheck } from "react-icons/hi";
import { motion } from "framer-motion";

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

function TutorCard({ tutor, index }: { tutor: Tutor; index: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -8, transition: { type: "spring", stiffness: 300, damping: 20 } }}
      className="group relative"
    >
      <div className="relative flex flex-col gap-4 p-5 rounded-3xl bg-white border border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden backdrop-blur-sm h-full">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        
        {/* Preview video placeholder */}
        <div className="relative rounded-2xl overflow-hidden aspect-[5/3] bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center group-hover:scale-105 transition-transform duration-700">
          <FiVideo className="w-12 h-12 text-gray-400 group-hover:text-brand-500 transition-colors duration-300" />
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="absolute bottom-3 left-3 flex items-center gap-2 px-3 py-2 text-xs font-semibold bg-brand-600 text-white rounded-xl hover:bg-brand-700 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <FiPlay className="w-3 h-3" />
            Preview
          </motion.button>
        </div>

        {/* Tutor info header */}
        <div className="flex items-start gap-3 relative z-10">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center text-white text-sm font-bold shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
            {tutor.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0 space-y-1.5">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2 max-w-full">
                <h3 className="text-lg font-bold text-gray-900 truncate group-hover:text-brand-600 transition-colors duration-300">
                  {tutor.name}
                  {tutor.verified && (
                    <HiBadgeCheck
                      className="w-5 h-5 text-brand-500 flex-shrink-0 ml-1 group-hover:scale-110 transition-transform duration-300"
                      aria-label="Verified tutor"
                      title="Verified tutor"
                    />
                  )}
                </h3>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FiGlobe className="w-4 h-4 text-brand-500" />
              <span className="truncate">{tutor.languages.join(", ")}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 bg-amber-50 px-3 py-1.5 rounded-xl text-sm font-semibold border border-amber-200">
                <FiStar className="w-4 h-4 text-amber-500 fill-amber-400" />
                <span className="text-amber-800">{tutor.rating.toFixed(1)}</span>
                <span className="text-gray-600">({tutor.reviews})</span>
              </div>
            </div>
          </div>
        </div>

        {/* Specialties */}
        <div className="space-y-4 relative z-10">
          <div className="flex flex-wrap gap-2">
            {tutor.specialties.slice(0, 3).map((s) => (
              <span
                key={s}
                className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-semibold bg-brand-50 text-brand-700 border border-brand-200 hover:bg-brand-100 transition-colors duration-200"
              >
                {s}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-brand-600 font-semibold">
              <FiClock className="w-4 h-4" />
              <span className="text-lg">${tutor.pricePerLesson}</span>
              <span className="text-sm text-gray-500 font-normal">/ lesson</span>
            </div>
            {tutor.availabilityTag && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700 border border-green-200">
                {tutor.availabilityTag}
              </span>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 pt-2 relative z-10">
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 px-4 py-3 text-sm font-semibold text-brand-600 bg-white border border-brand-200 rounded-xl hover:bg-brand-50 transition-all duration-200 hover:shadow-md"
          >
            Profile
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 px-4 py-3 text-sm font-semibold text-white bg-brand-600 border border-brand-600 rounded-xl hover:bg-brand-700 transition-all duration-200 hover:shadow-lg"
          >
            Book Now
          </motion.button>
        </div>
        
        {/* Subtle bottom accent */}
        <div className="absolute bottom-0 left-6 right-6 h-0.5 bg-gradient-to-r from-transparent via-brand-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>
    </motion.div>
  );
}

export function FeaturedTutors() {
  return (
    <section id="featured-tutors" className="py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="space-y-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Featured <span className="text-brand-600">Tutors</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Handpicked for practical, respectful, traveler-focused Swahili learning.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {TUTORS.map((t, index) => (
              <TutorCard key={t.id} tutor={t} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
