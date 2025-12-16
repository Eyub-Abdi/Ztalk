import {
  FiStar,
  FiChevronLeft,
  FiChevronRight,
  FiPause,
  FiPlay,
  FiMessageSquare,
} from "react-icons/fi";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { useEffect, useState, useCallback, useRef } from "react";
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
      className="flex items-center gap-0.5"
      aria-label={`${count} star rating`}
    >
      {Array.from({ length: 5 }).map((_, i) => {
        const isFilled = i < count;
        return (
          <FiStar
            key={i}
            className={clsx(
              "w-5 h-5 transition-all duration-200 hover:scale-110",
              isFilled ? "fill-orange-400 text-orange-500" : "text-gray-300"
            )}
            style={{
              filter: isFilled
                ? "drop-shadow(0px 2px 4px rgba(255, 165, 0, 0.3))"
                : undefined,
            }}
          />
        );
      })}
    </div>
  );
}

function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <div className="group flex flex-col gap-4 p-6 rounded-2xl bg-white border border-gray-200 shadow-sm relative transition-all duration-300 h-full overflow-hidden hover:shadow-xl hover:-translate-y-1.5 hover:border-orange-300">
      {/* Quote icon */}
      <FiMessageSquare className="absolute top-4 left-4 w-10 h-10 text-brand-100 opacity-30 pointer-events-none z-0" />

      {/* Rating row */}
      <div className="flex items-center justify-between z-[1]">
        <Stars count={t.rating} />
        <span className="bg-orange-50 text-orange-800 px-3 py-1 rounded-full text-xs font-bold tracking-wide">
          {t.rating.toFixed(1)}
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
