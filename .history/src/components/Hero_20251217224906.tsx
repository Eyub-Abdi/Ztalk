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
    <section className="relative overflow-hidden bg-gradient-to-br from-brand-50 to-white pb-16 md:pb-20 pt-8 md:pt-20 w-full max-w-full">
      {/* Background blur effect */}
      <div
        className="absolute -top-[5%] md:-top-[10%] right-0 w-[55%] md:w-[45%] h-[70%] md:h-[80%] bg-brand-100 opacity-45 pointer-events-none overflow-hidden"
        style={{
          filter: prefersReducedMotion ? undefined : "blur(70px)",
        }}
      />

      <div className="container-main relative">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="flex items-center">
            <div className="space-y-6">
              <MotionDiv
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <span className="inline-block badge badge-brand rounded-full px-3 py-1 font-medium">
                  Swahili for Real Journeys
                </span>
              </MotionDiv>

              <div className="relative overflow-hidden">
                <div className="hidden md:block">
                  <FloatingElements />
                </div>
                <MotionDiv
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  <h1 className="text-[2rem] sm:text-[2.4rem] md:text-[3.2rem] font-bold leading-tight">
                    <AnimatedText
                      text="Speak confident Swahili before you land in Tanzania."
                      highlight="confident Swahili"
                      delay={0.5}
                    />
                  </h1>
                </MotionDiv>
              </div>

              <MotionDiv
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                <p className="text-base md:text-lg text-gray-600 max-w-md md:max-w-lg">
                  Live sessions with vetted local tutors + rapid phrase packs
                  crafted for safari, markets & cultural etiquette. Learn what
                  actually matters for respectful travel.
                </p>
              </MotionDiv>

              <MotionDiv
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.0 }}
              >
                <div className="flex flex-col sm:flex-row gap-4">
                  <MotionDiv
                    whileHover={{
                      scale: 1.05,
                      boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
                    }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  >
                    <button className="btn btn-lg btn-primary w-full sm:w-auto relative overflow-hidden group">
                      <span>Start Learning</span>
                      <motion.span
                        animate={{ x: [0, 3, 0] }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                        className="ml-2"
                      >
                        <FiPlay />
                      </motion.span>
                    </button>
                  </MotionDiv>

                  <MotionDiv
                    whileHover={{
                      scale: 1.05,
                    }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  >
                    <button className="btn btn-lg btn-outline w-full sm:w-auto hover:bg-brand-50">
                      Browse Tutors
                    </button>
                  </MotionDiv>
                </div>
              </MotionDiv>

              <MotionDiv
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.2 }}
              >
                <form
                  onSubmit={(e) => e.preventDefault()}
                  role="search"
                  aria-label="Find a tutor"
                >
                  <label htmlFor="tutor-search" className="sr-only">
                    Find a tutor
                  </label>
                  <div className="relative max-w-full md:max-w-[360px] w-full">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <FiSearch className="text-brand-400" />
                    </div>
                    <input
                      id="tutor-search"
                      type="text"
                      placeholder="Find a tutor..."
                      className="input pl-10 shadow-sm border-2 border-transparent focus:border-brand-400 focus:shadow-lg focus:bg-brand-50 hover:border-brand-200 transition-all duration-300"
                    />
                  </div>
                </form>

                {/* Mobile stats */}
                <div className="grid grid-cols-3 gap-2 sm:gap-3 mt-6 md:hidden">
                  <StatCard
                    label="Tutors"
                    value="120+"
                    icon={<FiCheckCircle />}
                  />
                  <StatCard
                    label="Phrases"
                    value="800+"
                    icon={<FiCheckCircle />}
                  />
                  <StatCard
                    label="Rating"
                    value="4.8★"
                    icon={<FiCheckCircle />}
                  />
                </div>
              </MotionDiv>
            </div>
          </div>

          <div className="hidden md:flex items-center">
            <div className="w-full space-y-6">
              <div className="w-full aspect-[4/3] rounded-xl">
                <img
                  src="/images/tz-flag.png"
                  alt="Tanzania Flag"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="grid grid-cols-3 gap-4 w-full">
                <StatCard
                  label="Tutors"
                  value="120+"
                  icon={<FiCheckCircle />}
                />
                <StatCard
                  label="Phrases"
                  value="800+"
                  icon={<FiCheckCircle />}
                />
                <StatCard
                  label="Avg Rating"
                  value="4.8★"
                  icon={<FiCheckCircle />}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
