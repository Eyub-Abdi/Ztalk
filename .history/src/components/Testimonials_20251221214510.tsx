import {
  FiStar,
  FiChevronLeft,
  FiChevronRight,
  FiPause,
  FiPlay,
  FiMessageSquare,
  FiQuote,
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
          <motion.div
            key={i}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              delay: i * 0.1,
              type: "spring",
              stiffness: 200,
            }}
          >
            <FiStar
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
          </motion.div>
        );
      })}
    </div>
  );
}

function TestimonialCard({ t, index }: { t: Testimonial; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{
        y: -8,
        scale: 1.02,
        transition: { type: "spring", stiffness: 300, damping: 25 }
      }}
      className="group relative h-full"
    >
      {/* Glassmorphism card */}
      <div className="relative p-6 rounded-2xl bg-white/70 backdrop-blur-xl shadow-xl border border-white/20 h-full flex flex-col overflow-hidden">
        {/* Gradient background overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 via-transparent to-brand-600/10 opacity-0 group-hover:opacity-100 transition-all duration-500" />
        
        {/* Quote decoration */}
        <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity duration-300">
          <FiQuote className="w-8 h-8 text-brand-500" />
        </div>

        {/* Top accent line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-400 via-brand-500 to-brand-600 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-700 ease-out" />

        {/* Rating */}
        <div className="flex items-center justify-between mb-4 relative z-10">
          <Stars count={t.rating} />
          <motion.span 
            whileHover={{ scale: 1.1 }}
            className="bg-gradient-to-r from-amber-50 to-amber-100 text-amber-800 px-3 py-1.5 rounded-full text-xs font-bold tracking-wide border border-amber-200/50"
          >
            {t.rating.toFixed(1)} ★
          </motion.span>
        </div>

        {/* Quote */}
        <div className="flex-1 mb-6 relative z-10">
          <p className="text-gray-700 leading-relaxed font-medium text-sm">
            <span className="text-brand-500 text-lg leading-none">"</span>
            {t.quote}
            <span className="text-brand-500 text-lg leading-none">"</span>
          </p>
        </div>

        {/* Author section */}
        <div className="flex items-center gap-4 relative z-10">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="relative"
          >
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-brand-500/30">
              {t.name.charAt(0)}
            </div>
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 opacity-20 blur-lg" />
          </motion.div>
          <div>
            <p className="font-bold text-gray-900 text-sm">{t.name}</p>
            <p className="text-xs text-gray-600 font-medium">
              {t.role} • {t.country}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
        </span>
      </div>

      {/* Quote */}
      <p className="text-sm leading-relaxed text-gray-700 z-[1]">
        &ldquo;{t.quote}&rdquo;
      </p>

      {/* Author */}
      <div className="flex items-center gap-3 pt-2">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-sm font-semibold">
          {t.name.charAt(0)}
        </div>
        <div>
          <p className="font-semibold text-sm text-gray-900">{t.name}</p>
          <p className="text-xs text-gray-600">
            {t.role} • {t.country}
          </p>
        </div>
      </div>
    </div>
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
        "(min-width: 1024px)": { slides: { perView: 4, spacing: 24 } },
        "(min-width: 640px)": { slides: { perView: 2.15, spacing: 20 } },
      },
      slides: { perView: 1.05, spacing: 16 },
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
    <section id="testimonials" className="py-16 md:py-24 bg-gray-50">
      <div className="container-main">
        <div className="space-y-12">
          <div className="space-y-4 text-center max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              What travelers are saying
            </h2>
            <p className="text-base md:text-lg text-gray-600">
              Real impact from real journeys. Every session is geared toward
              practical, respectful communication.
            </p>
          </div>

          <div
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
              aria-label="Traveler testimonials carousel"
            >
              {DATA.map((t, idx) => (
                <div
                  key={t.id}
                  className="keen-slider__slide h-full flex"
                  role="group"
                  aria-label={`Slide ${idx + 1} of ${DATA.length}`}
                >
                  <TestimonialCard t={t} />
                </div>
              ))}
            </div>

            {/* Fade edges */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute top-0 bottom-0 left-0 w-24 bg-gradient-to-r from-gray-50 to-transparent"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute top-0 bottom-0 right-0 w-24 bg-gradient-to-l from-gray-50 to-transparent"
            />
          </div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <button
                aria-label="Previous testimonial"
                className="p-2 rounded-full bg-white/80 hover:bg-white shadow-md text-brand-500 hover:text-brand-600 transition-colors"
                onClick={() => instanceRef.current?.prev()}
              >
                <FiChevronLeft className="w-5 h-5" />
              </button>
              <button
                aria-label="Next testimonial"
                className="p-2 rounded-full bg-white/80 hover:bg-white shadow-md text-brand-500 hover:text-brand-600 transition-colors"
                onClick={() => instanceRef.current?.next()}
              >
                <FiChevronRight className="w-5 h-5" />
              </button>
              <button
                aria-label={isPlaying ? "Pause autoplay" : "Play autoplay"}
                className="p-2 rounded-full border border-brand-500 text-brand-500 hover:bg-brand-50 transition-colors"
                onClick={togglePlay}
              >
                {isPlaying ? (
                  <FiPause className="w-4 h-4" />
                ) : (
                  <FiPlay className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Dots */}
            <div className="flex items-center justify-center gap-2 flex-wrap flex-1">
              {DATA.map((_, idx) => {
                const isActive = idx === current;
                return (
                  <button
                    key={idx}
                    onClick={() => goTo(idx)}
                    aria-label={`Go to testimonial ${idx + 1}`}
                    aria-current={isActive ? "true" : undefined}
                    className={clsx(
                      "w-3 h-3 rounded-full border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2",
                      isActive
                        ? "border-brand-500 bg-brand-500"
                        : "border-gray-300 bg-transparent hover:border-brand-300"
                    )}
                  >
                    <span className="sr-only">
                      {isActive ? "Current slide" : `Go to slide ${idx + 1}`}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
