import {
  FiSearch,
  FiArrowRight,
  FiUsers,
  FiBook,
  FiStar,
  FiGlobe,
  FiMessageCircle,
  FiZap,
} from "react-icons/fi";
import { ReactNode, useMemo } from "react";
import { motion } from "framer-motion";

interface StatProps {
  label: string;
  value: string;
  icon?: ReactNode;
  color: string;
}

const MotionDiv = motion.div;

// Modern floating grid background
function GridBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Gradient orbs */}
      <MotionDiv
        className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(13,110,253,0.15) 0%, transparent 70%)",
        }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.5, 0.7, 0.5],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <MotionDiv
        className="absolute -bottom-60 -left-40 w-[600px] h-[600px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(30,181,58,0.12) 0%, transparent 70%)",
        }}
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.4, 0.6, 0.4],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />
      <MotionDiv
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(252,209,22,0.08) 0%, transparent 70%)",
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      />
    </div>
  );
}

// Floating feature cards
function FloatingCard({
  icon,
  label,
  className,
  delay = 0,
}: {
  icon: ReactNode;
  label: string;
  className?: string;
  delay?: number;
}) {
  return (
    <MotionDiv
      className={`absolute ${className}`}
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, delay }}
    >
      <MotionDiv
        className="flex items-center gap-2 px-4 py-2.5 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-xl shadow-lg border border-gray-200/50 dark:border-gray-700/50"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <span className="text-brand-500">{icon}</span>
        <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
          {label}
        </span>
      </MotionDiv>
    </MotionDiv>
  );
}

function StatCard({ label, value, icon, color }: StatProps) {
  const colorClasses: Record<string, string> = {
    blue: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 border-blue-100 dark:border-blue-800/50",
    green:
      "bg-green-50 dark:bg-green-900/20 text-green-600 border-green-100 dark:border-green-800/50",
    amber:
      "bg-amber-50 dark:bg-amber-900/20 text-amber-600 border-amber-100 dark:border-amber-800/50",
  };

  return (
    <MotionDiv
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.8 }}
      whileHover={{ scale: 1.02, y: -2 }}
    >
      <div
        className={`flex items-center gap-3 p-4 rounded-2xl border ${colorClasses[color]} transition-all duration-300`}
      >
        <div className="flex-shrink-0">{icon}</div>
        <div>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-sm opacity-80">{label}</p>
        </div>
      </div>
    </MotionDiv>
  );
}

export function Hero() {
  const prefersReducedMotion = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  return (
    <section className="relative overflow-hidden bg-white dark:bg-gray-900 min-h-[90vh] flex items-center">
      {/* Modern grid background */}
      {!prefersReducedMotion && <GridBackground />}

      {/* Noise texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.015] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="container-main relative z-10 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            {/* Badge */}
            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-brand-50 to-green-50 dark:from-brand-900/30 dark:to-green-900/30 border border-brand-200 dark:border-brand-800">
                <FiZap className="w-4 h-4 text-brand-500" />
                <span className="text-sm font-semibold text-brand-600 dark:text-brand-400">
                  Learn Swahili for Real Adventures
                </span>
              </div>
            </MotionDiv>

            {/* Headline */}
            <MotionDiv
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white leading-[1.1] tracking-tight">
                Speak{" "}
                <span className="relative inline-block">
                  <span className="relative z-10 bg-gradient-to-r from-brand-500 via-green-500 to-brand-600 bg-clip-text text-transparent">
                    confident
                  </span>
                  <MotionDiv
                    className="absolute -bottom-2 left-0 right-0 h-3 bg-gradient-to-r from-brand-500/20 to-green-500/20 rounded-full"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    style={{ transformOrigin: "left" }}
                  />
                </span>{" "}
                Swahili before you land.
              </h1>
            </MotionDiv>

            {/* Subheadline */}
            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-lg leading-relaxed">
                Live 1-on-1 sessions with vetted Tanzanian tutors. Master safari
                phrases, market haggling, and cultural etiquette—
                <span className="text-gray-900 dark:text-white font-medium">
                  learn what actually matters.
                </span>
              </p>
            </MotionDiv>

            {/* CTA Buttons */}
            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <MotionDiv
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <button className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-lg shadow-brand-500/30 hover:shadow-xl hover:shadow-brand-500/40 transition-all w-full sm:w-auto">
                  Start Learning Free
                  <FiArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </button>
              </MotionDiv>

              <MotionDiv
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <button className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-brand-300 hover:bg-brand-50 dark:hover:bg-gray-700 transition-all w-full sm:w-auto">
                  <FiUsers className="w-5 h-5" />
                  Browse Tutors
                </button>
              </MotionDiv>
            </MotionDiv>

            {/* Search */}
            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <form
                onSubmit={(e) => e.preventDefault()}
                role="search"
                aria-label="Find a tutor"
                className="max-w-md"
              >
                <label htmlFor="tutor-search" className="sr-only">
                  Find a tutor
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                    <FiSearch className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    id="tutor-search"
                    type="text"
                    placeholder="Search tutors by specialty, availability..."
                    className="w-full pl-12 pr-4 py-4 rounded-xl bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/20 text-gray-900 dark:text-white placeholder:text-gray-500 transition-all"
                  />
                </div>
              </form>
            </MotionDiv>

            {/* Social Proof */}
            <MotionDiv
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex items-center gap-4 pt-4"
            >
              <div className="flex -space-x-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 border-2 border-white dark:border-gray-900 flex items-center justify-center text-xs font-bold text-gray-600 dark:text-gray-300"
                  >
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <span className="font-semibold text-gray-900 dark:text-white">
                  2,500+
                </span>{" "}
                learners already speaking Swahili
              </div>
            </MotionDiv>
          </div>

          {/* Right Content - Visual */}
          <div className="relative hidden lg:block">
            {/* Main visual card */}
            <MotionDiv
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative"
            >
              <div className="relative bg-gradient-to-br from-brand-500 via-green-500 to-teal-500 rounded-3xl p-1">
                <div className="bg-white dark:bg-gray-900 rounded-[22px] p-8 space-y-6">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold text-lg">
                        TZ
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          Next Lesson
                        </p>
                        <p className="text-sm text-gray-500">
                          Safari Vocabulary
                        </p>
                      </div>
                    </div>
                    <div className="px-3 py-1.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 text-sm font-medium">
                      Live Now
                    </div>
                  </div>

                  {/* Tanzania Flag Image */}
                  <div className="aspect-video rounded-xl overflow-hidden bg-gradient-to-br from-green-400 via-yellow-300 via-black to-blue-400 relative">
                    <img
                      src="/images/tz-flag.png"
                      alt="Tanzania Flag"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <div className="absolute bottom-4 left-4 text-white">
                      <p className="font-bold">Karibu Tanzania!</p>
                      <p className="text-sm opacity-90">Welcome to Tanzania</p>
                    </div>
                  </div>

                  {/* Stats Row */}
                  <div className="grid grid-cols-3 gap-4">
                    <StatCard
                      label="Active Tutors"
                      value="120+"
                      icon={<FiUsers className="w-6 h-6" />}
                      color="blue"
                    />
                    <StatCard
                      label="Phrases"
                      value="800+"
                      icon={<FiBook className="w-6 h-6" />}
                      color="green"
                    />
                    <StatCard
                      label="Avg Rating"
                      value="4.9★"
                      icon={<FiStar className="w-6 h-6" />}
                      color="amber"
                    />
                  </div>
                </div>
              </div>
            </MotionDiv>

            {/* Floating cards */}
            {!prefersReducedMotion && (
              <>
                <FloatingCard
                  icon={<FiGlobe className="w-4 h-4" />}
                  label="100% Native Speakers"
                  className="-top-4 -left-8"
                  delay={0.8}
                />
                <FloatingCard
                  icon={<FiMessageCircle className="w-4 h-4" />}
                  label="24/7 Support"
                  className="-bottom-4 -right-8"
                  delay={1.0}
                />
              </>
            )}
          </div>

          {/* Mobile Stats */}
          <div className="lg:hidden grid grid-cols-3 gap-3">
            <StatCard
              label="Tutors"
              value="120+"
              icon={<FiUsers className="w-5 h-5" />}
              color="blue"
            />
            <StatCard
              label="Phrases"
              value="800+"
              icon={<FiBook className="w-5 h-5" />}
              color="green"
            />
            <StatCard
              label="Rating"
              value="4.9★"
              icon={<FiStar className="w-5 h-5" />}
              color="amber"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
