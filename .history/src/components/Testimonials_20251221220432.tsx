import {
  FiStar,
  FiChevronLeft,
  FiChevronRight,
  FiPause,
  FiPlay,
  FiMessageSquare,
  FiMessageCircle,
} from "react-icons/fi";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { useEffect, useState, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import clsx from "clsx";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  country: string;
  quote: string;
  rating: number;
  avatar?: string;
}

const DATA: Testimonial[] = [
  {
    id: "1",
    name: "Maria G.",
    role: "Safari Traveler",
    country: "Italy",
    quote:
      "Learning context-based Swahili phrases gave me confidence when negotiating at local markets.",
    rating: 5,
  },
  {
    id: "2",
    name: "Ethan P.",
    role: "Wildlife Photographer",
    country: "USA",
    quote:
      "The tutor adapted lessons to the exact phrases I needed on location – far better than generic apps.",
    rating: 5,
  },
  {
    id: "3",
    name: "Sofia L.",
    role: "Cultural Volunteer",
    country: "Spain",
    quote:
      "Etiquette modules + live correction helped me avoid awkward situations and build trust quickly.",
    rating: 5,
  },
  {
    id: "4",
    name: "Jonas K.",
    role: "Backpacker",
    country: "Germany",
    quote:
      "Short phrase drills on the flight + a trial session made day one in Arusha feel easy.",
    rating: 5,
  },
];

function Stars({ count }: { count: number }) {
  return (
    <div
      className="flex items-center gap-1"
      aria-label={`${count} star rating`}
    >
      {Array.from({ length: 5 }).map((_, i) => {
        const isFilled = i < count;
        return (
          <FiStar
            key={i}
            className={clsx(
              "w-4 h-4 transition-all duration-200",
              isFilled ? "fill-amber-400 text-amber-500" : "text-gray-300"
            )}
            style={{
              filter: isFilled
                ? "drop-shadow(0px 2px 4px rgba(251, 191, 36, 0.4))"
                : undefined,
            }}
          />
        );
      })}
    </div>
  );
}

function TestimonialCard({ t, index }: { t: Testimonial; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: "easeOut",
      }}
      whileHover={{
        y: -4,
        transition: { type: "spring", stiffness: 400, damping: 25 }
      }}
      className="group relative h-full"
    >
      {/* Modern clean card */}
      <div className="relative p-8 rounded-3xl bg-white shadow-lg hover:shadow-xl border border-gray-100 h-full flex flex-col transition-all duration-300">
        
        {/* Subtle top accent */}
        <div className="absolute top-0 left-8 right-8 h-0.5 bg-gradient-to-r from-transparent via-brand-400 to-transparent" />

        {/* Rating */}
        <div className="flex items-center justify-between mb-6">
          <Stars count={t.rating} />
          <span className="bg-brand-50 text-brand-700 px-3 py-1 rounded-full text-xs font-semibold">
            {t.rating.toFixed(1)}
          </span>
        </div>

        {/* Quote */}
        <div className="flex-1 mb-8">
          <p className="text-gray-600 leading-relaxed text-base font-normal">
            "{t.quote}"
          </p>
        </div>

        {/* Author */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
            {t.name.charAt(0)}
          </div>
          <div>
            <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
            <p className="text-xs text-gray-500 font-medium">
              {t.role} • {t.country}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function Testimonials() {
  const [current, setCurrent] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const wasPlayingRef = useRef(true);
  const isPlayingRef = useRef(isPlaying);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const autoplayInterval = 4500;

  const [sliderRef, instanceRef] = useKeenSlider(
    {
      initial: 0,
      loop: true,
      slideChanged(s) {
        setCurrent(s.track.details.rel);
      },
      renderMode: "precision",
      breakpoints: {
        "(min-width: 1024px)": { slides: { perView: 3, spacing: 32 } },
        "(min-width: 640px)": { slides: { perView: 2, spacing: 24 } },
      },
      slides: { perView: 1.1, spacing: 20 },
    },
    [
      (slider) => {
        let timeout: number | undefined;
        function clearNextTimeout() {
          timeout && window.clearTimeout(timeout);
        }
        function nextTimeout() {
          clearNextTimeout();
          if (!isPlayingRef.current || prefersReducedMotion) return;
          timeout = window.setTimeout(() => {
            slider.next();
          }, autoplayInterval);
        }
        slider.on("created", () => {
          nextTimeout();
        });
        slider.on("dragStarted", clearNextTimeout);
        slider.on("animationEnded", nextTimeout);
        slider.on("updated", nextTimeout);
      },
    ]
  );

  const goTo = useCallback(
    (idx: number) => instanceRef.current && instanceRef.current.moveToIdx(idx),
    [instanceRef]
  );

  const togglePlay = () => setIsPlaying((p) => !p);

  useEffect(() => {
    if (!instanceRef.current) return;
    if (!isPlaying) return;
  }, [isPlaying, instanceRef]);

  return (
    <section id="testimonials" className="py-24 md:py-32 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="space-y-16">
          {/* Clean header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-2xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              What Our{" "}
              <span className="text-brand-600">Students</span>{" "}
              Say
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Real experiences from travelers who mastered Swahili with our expert tutors.
            </p>
          </motion.div>

          {/* Clean testimonials slider */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative"
            onMouseEnter={() => {
              wasPlayingRef.current = isPlayingRef.current;
              if (isPlayingRef.current) setIsPlaying(false);
            }}
            onMouseLeave={() => {
              if (wasPlayingRef.current) setIsPlaying(true);
            }}
          >
            <div
              ref={sliderRef}
              className="keen-slider"
              role="region"
              aria-roledescription="carousel"
              aria-label="Student testimonials"
            >
              {DATA.map((t, idx) => (
                <div
                  key={t.id}
                  className="keen-slider__slide h-full flex"
                  role="group"
                  aria-label={`Testimonial ${idx + 1} of ${DATA.length}`}
                >
                  <TestimonialCard t={t} index={idx} />
                </div>
              ))}
            </div>

            {/* Subtle fade edges */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute top-0 bottom-0 left-0 w-16 bg-gradient-to-r from-gray-50 to-transparent"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute top-0 bottom-0 right-0 w-16 bg-gradient-to-l from-gray-50 to-transparent"
            />
          </motion.div>

          {/* Clean controls */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex items-center justify-center gap-8"
          >
            {/* Navigation */}
            <div className="flex items-center gap-2">
              <button
                aria-label="Previous testimonial"
                className="p-3 rounded-full bg-white hover:bg-gray-50 border border-gray-200 text-gray-600 hover:text-brand-600 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                onClick={() => instanceRef.current?.prev()}
              >
                <FiChevronLeft className="w-5 h-5" />
              </button>
              
              <button
                aria-label="Next testimonial"
                className="p-3 rounded-full bg-white hover:bg-gray-50 border border-gray-200 text-gray-600 hover:text-brand-600 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                onClick={() => instanceRef.current?.next()}
              >
                <FiChevronRight className="w-5 h-5" />
              </button>
              
              <button
                aria-label={isPlaying ? "Pause slideshow" : "Play slideshow"}
                className="ml-2 p-3 rounded-full bg-brand-600 hover:bg-brand-700 text-white transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                onClick={togglePlay}
              >
                {isPlaying ? (
                  <FiPause className="w-4 h-4" />
                ) : (
                  <FiPlay className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Clean dots indicator */}
            <div className="flex items-center gap-2">
              {DATA.map((_, idx) => {
                const isActive = idx === current;
                return (
                  <button
                    key={idx}
                    onClick={() => goTo(idx)}
                    aria-label={`Go to testimonial ${idx + 1}`}
                    aria-current={isActive ? "true" : undefined}
                    className={clsx(
                      "w-2 h-2 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-500",
                      isActive
                        ? "bg-brand-600"
                        : "bg-gray-300 hover:bg-gray-400"
                    )}
                  />
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative">
        <div className="space-y-16">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-center max-w-3xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2, type: "spring" }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-50 border border-brand-200 mb-6"
            >
              <FiMessageSquare className="w-4 h-4 text-brand-600" />
              <span className="text-sm font-semibold text-brand-700">Testimonials</span>
            </motion.div>
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
              What{" "}
              <span className="bg-gradient-to-r from-brand-500 to-brand-700 bg-clip-text text-transparent">
                Travelers
              </span>{" "}
              Are Saying
            </h2>
            <p className="text-lg md:text-xl text-gray-600 font-medium leading-relaxed">
              Real impact from real journeys. Every session is designed for
              <span className="text-brand-600 font-semibold"> practical, respectful communication</span>.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative"
            onMouseEnter={() => {
              wasPlayingRef.current = isPlayingRef.current;
              if (isPlayingRef.current) setIsPlaying(false);
            }}
            onMouseLeave={() => {
              if (wasPlayingRef.current) setIsPlaying(true);
            }}
          >
            <div
              ref={sliderRef}
              className="keen-slider pb-4"
              role="region"
              aria-roledescription="carousel"
              aria-label="Traveler testimonials carousel"
            >
              {DATA.map((t, idx) => (
                <div
                  key={t.id}
                  className="keen-slider__slide h-full flex"
                  role="group"
                  aria-label={`Slide ${idx + 1} of ${DATA.length}`}
                >
                  <TestimonialCard t={t} index={idx} />
                </div>
              ))}
            </div>

            <div
              aria-hidden="true"
              className="pointer-events-none absolute top-0 bottom-0 left-0 w-32 bg-gradient-to-r from-gray-50 via-white/80 to-transparent backdrop-blur-sm"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute top-0 bottom-0 right-0 w-32 bg-gradient-to-l from-gray-50 via-white/80 to-transparent backdrop-blur-sm"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-between gap-6"
          >
            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Previous testimonial"
                className="p-3 rounded-full bg-white/80 backdrop-blur-xl hover:bg-white shadow-lg border border-white/20 text-brand-600 hover:text-brand-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
                onClick={() => instanceRef.current?.prev()}
              >
                <FiChevronLeft className="w-5 h-5" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Next testimonial"
                className="p-3 rounded-full bg-white/80 backdrop-blur-xl hover:bg-white shadow-lg border border-white/20 text-brand-600 hover:text-brand-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
                onClick={() => instanceRef.current?.next()}
              >
                <FiChevronRight className="w-5 h-5" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label={isPlaying ? "Pause autoplay" : "Play autoplay"}
                className="p-3 rounded-full bg-brand-500 hover:bg-brand-600 text-white shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
                onClick={togglePlay}
              >
                {isPlaying ? (
                  <FiPause className="w-4 h-4" />
                ) : (
                  <FiPlay className="w-4 h-4 ml-0.5" />
                )}
              </motion.button>
            </div>

            <div className="flex items-center justify-center gap-3">
              {DATA.map((_, idx) => {
                const isActive = idx === current;
                return (
                  <motion.button
                    key={idx}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => goTo(idx)}
                    aria-label={`Go to testimonial ${idx + 1}`}
                    aria-current={isActive ? "true" : undefined}
                    className={clsx(
                      "h-2 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2",
                      isActive
                        ? "w-8 bg-brand-500"
                        : "w-2 bg-gray-300 hover:bg-brand-300"
                    )}
                  >
                    <span className="sr-only">
                      {isActive ? "Current slide" : `Go to slide ${idx + 1}`}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}