import { FiSearch, FiPlay, FiCheckCircle } from "react-icons/fi";
import { ReactNode, useMemo } from "react";
import { motion } from "framer-motion";

interface StatProps {
  label: string;
  value: string;
  icon?: ReactNode;
}

// Create motion components
const MotionDiv = motion.div;

// Word-by-word reveal animation
interface AnimatedTextProps {
  text: string;
  highlight?: string;
  delay?: number;
}

function AnimatedText({ text, highlight, delay = 0 }: AnimatedTextProps) {
  const words = text.split(" ");

  return (
    <MotionDiv
      initial="hidden"
      animate="visible"
      transition={{ staggerChildren: 0.12, delayChildren: delay }}
    >
      {words.map((word, index) => {
        const isHighlighted =
          highlight && word.includes(highlight.split(" ")[0]);

        return (
          <motion.span
            key={index}
            variants={{
              hidden: {
                opacity: 0,
                y: 50,
                rotateX: -90,
                filter: "blur(10px)",
              },
              visible: {
                opacity: 1,
                y: 0,
                rotateX: 0,
                filter: "blur(0px)",
                transition: {
                  duration: 0.8,
                  ease: [0.22, 1, 0.36, 1],
                },
              },
            }}
            style={{
              display: "inline-block",
              marginRight: "0.3em",
              transformOrigin: "50% 100%",
            }}
          >
            {isHighlighted ? (
              <span className="relative inline-block">
                <motion.span
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{
                    duration: 0.8,
                    delay: delay + index * 0.12 + 0.5,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="absolute inset-0 bg-gradient-to-r from-brand-500/20 to-brand-500/40 rounded"
                  style={{ transformOrigin: "left center", zIndex: -1 }}
                />
                <span className="text-brand-500 font-bold px-1 relative">
                  {word}
                </span>
              </span>
            ) : (
              word
            )}
          </motion.span>
        );
      })}
    </MotionDiv>
  );
}

// Enhanced Floating Elements with Particles
function FloatingElements() {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    size: Math.random() * 12 + 6,
    initialX: Math.random() * 100,
    initialY: Math.random() * 100,
    delay: Math.random() * 4,
    duration: 5 + Math.random() * 4,
    // Tanzania flag colors
    color: ["#1EB53A", "#FCD116", "#000000", "#00A3DD"][
      Math.floor(Math.random() * 4)
    ],
  }));

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((particle) => (
        <MotionDiv
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: `${particle.initialX}%`,
            top: `${particle.initialY}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            background: particle.color,
            boxShadow: `0 0 20px ${particle.color}40`,
          }}
          initial={{
            opacity: 0,
            scale: 0,
            rotate: 0,
          }}
          animate={{
            opacity: [0, 0.4, 0.7, 0.4, 0],
            scale: [0, 0.8, 1, 1.1, 0],
            rotate: [0, 180, 360],
            y: [0, -150, -300],
            x: [0, Math.sin(particle.id) * 60, Math.cos(particle.id) * 40],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: [0.22, 1, 0.36, 1],
          }}
        />
      ))}

      {/* Subtle gradient orbs with Tanzania colors */}
      {[...Array(3)].map((_, i) => (
        <MotionDiv
          key={`orb-${i}`}
          className="absolute w-[150px] h-[150px] rounded-full"
          style={{
            background: `radial-gradient(circle, ${
              ["#1EB53A20", "#00A3DD20", "#FCD11620"][i]
            }, transparent 70%)`,
          }}
          initial={{
            x: Math.random() * 300,
            y: Math.random() * 200,
            scale: 0,
            opacity: 0,
          }}
          animate={{
            x: [0, 120, -60, 0],
            y: [0, -100, 80, 0],
            scale: [0, 1.2, 0.9, 0],
            opacity: [0, 0.3, 0.5, 0],
          }}
          transition={{
            duration: 10 + i * 2,
            repeat: Infinity,
            delay: i * 2.5,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

function StatCard({ label, value, icon }: StatProps) {
  return (
    <MotionDiv
      initial={{ opacity: 0, y: 30, rotateY: -15 }}
      animate={{ opacity: 1, y: 0, rotateY: 0 }}
      transition={{
        duration: 0.8,
        delay: 0.8,
        type: "spring",
        stiffness: 100,
        damping: 15,
      }}
      whileHover={{
        scale: 1.08,
        rotateY: 5,
        boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
        transition: {
          type: "spring",
          stiffness: 300,
          damping: 30,
        },
      }}
      style={{ transformStyle: "preserve-3d" }}
    >
      <div className="flex flex-col p-4 rounded-xl bg-white shadow-sm border border-gray-200 relative overflow-hidden group transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-brand-400 to-brand-600 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300" />
        <div className="flex items-center gap-2 mb-2 text-brand-500 text-sm">
          {icon}
          <span className="font-medium">{label}</span>
        </div>
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 1.2 }}
        >
          <h4 className="text-lg font-bold text-brand-600">{value}</h4>
        </motion.div>
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
