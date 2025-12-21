import { FiPlay, FiCheckCircle, FiUsers, FiBookOpen, FiStar } from "react-icons/fi";
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
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.8,
        delay: 1.4,
        type: "spring",
        stiffness: 150,
        damping: 25,
      }}
      whileHover={{
        scale: 1.1,
        y: -8,
        rotateY: 5,
        boxShadow: "0 30px 60px rgba(59, 130, 246, 0.25)",
        transition: {
          type: "spring",
          stiffness: 500,
          damping: 30,
        },
      }}
      style={{ transformStyle: "preserve-3d" }}
    >
      <div className="relative px-3 py-2 rounded-xl bg-white/70 backdrop-blur-xl shadow-lg border border-white/20 overflow-hidden group">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-500/10 via-transparent to-brand-600/10 opacity-0 group-hover:opacity-100 transition-all duration-500" />
        
        {/* Top accent line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-400 via-brand-500 to-brand-600 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-700 ease-out" />

        {/* Icon with enhanced styling */}
        <div className="flex items-center justify-center mb-1 relative z-10">
          <motion.div
            className="flex items-center justify-center p-1.5 rounded-md bg-gradient-to-br from-brand-500 to-brand-600 text-white shadow-sm shadow-brand-500/30 group-hover:shadow-brand-500/50"
            whileHover={{ 
              scale: 1.1, 
              rotate: [0, -5, 5, 0],
              boxShadow: "0 10px 20px rgba(59, 130, 246, 0.4)"
            }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            <div className="flex items-center justify-center w-3 h-3">
              {icon}
            </div>
          </motion.div>
        </div>

        {/* Value with counter animation effect */}
        <motion.div
          className="text-center mb-1 relative z-10"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            duration: 0.8,
            delay: 1.8,
            type: "spring",
            stiffness: 200,
          }}
        >
          <h3 className="text-base font-bold text-gray-900 group-hover:text-brand-700 transition-colors duration-300 tracking-tight">
            {value}
          </h3>
        </motion.div>

        {/* Label with better typography */}
        <div className="text-center relative z-10">
          <p className="text-[10px] font-medium text-gray-600 group-hover:text-brand-600 transition-colors duration-300 tracking-wide uppercase">
            {label}
          </p>
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
    <section className="relative overflow-hidden bg-gradient-to-br from-brand-25 via-white to-brand-50/30 pb-20 md:pb-24 pt-12 md:pt-24 w-full max-w-full">
      {/* Enhanced background blur effect */}
      <div
        className="absolute -top-[8%] md:-top-[12%] right-0 w-[60%] md:w-[50%] h-[75%] md:h-[85%] bg-gradient-to-bl from-brand-200/60 to-brand-100/40 pointer-events-none overflow-hidden"
        style={{
          filter: prefersReducedMotion ? undefined : "blur(80px)",
        }}
      />

      {/* Additional subtle background elements */}
      <div className="absolute top-1/4 left-0 w-[30%] h-[50%] bg-gradient-to-br from-brand-50/20 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-[25%] h-[40%] bg-gradient-to-tl from-brand-100/30 to-transparent rounded-full blur-2xl" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="flex items-center">
            <div className="space-y-6">
              <MotionDiv
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.2, ease: "easeOut" }}
                className="relative"
              >
                <div className="hidden md:block absolute inset-0">
                  <FloatingElements />
                </div>
                <h1 className="text-[2rem] sm:text-[2.3rem] md:text-[3rem] lg:text-[3.3rem] font-extrabold leading-[1.1] tracking-tight text-gray-900 relative z-10">
                  <AnimatedText
                    text="Swahili Made Simple, Fun, Practical"
                    delay={0.4}
                  />
                </h1>
              </MotionDiv>

              <MotionDiv
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.6 }}
              >
                <p className="text-lg md:text-xl text-gray-700 max-w-xl leading-relaxed font-medium">
                  Connect with expert local tutors for personalized lessons and
                  master essential phrases for
                  <span className="text-brand-600 font-semibold">
                    {" "}
                    safari adventures
                  </span>
                  ,
                  <span className="text-brand-600 font-semibold">
                    {" "}
                    market visits
                  </span>
                  , and
                  <span className="text-brand-600 font-semibold">
                    {" "}
                    cultural experiences
                  </span>
                  .
                </p>
              </MotionDiv>

              <MotionDiv
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.8 }}
              >
                <div className="flex flex-col sm:flex-row gap-4 pt-2">
                  <MotionDiv
                    whileHover={{
                      scale: 1.06,
                      boxShadow: "0 20px 40px rgba(59, 130, 246, 0.2)",
                    }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  >
                    <button className="btn btn-lg bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white font-semibold shadow-lg shadow-brand-500/25 w-full sm:w-auto relative overflow-hidden group border-0 px-8 py-4">
                      <span className="relative z-10">Start Your Journey</span>
                      <motion.span
                        animate={{ x: [0, 4, 0] }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                        className="ml-2 relative z-10"
                      >
                        <FiPlay className="w-5 h-5" />
                      </motion.span>
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    </button>
                  </MotionDiv>

                  <MotionDiv
                    whileHover={{
                      scale: 1.05,
                      borderColor: "rgb(59, 130, 246)",
                    }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  >
                    <button className="btn btn-lg border-2 border-brand-300 text-brand-700 hover:bg-brand-50 hover:border-brand-400 font-semibold w-full sm:w-auto px-8 py-4 bg-white/80 backdrop-blur-sm">
                      Meet Our Tutors
                    </button>
                  </MotionDiv>
                </div>
              </MotionDiv>

              <MotionDiv
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 1.0 }}
              >
                {/* Mobile stats */}
                <div className="grid grid-cols-3 gap-3 mt-8 md:hidden">
                  <StatCard
                    label="Native Tutors"
                    value="150+"
                    icon={<FiUsers className="w-4 h-4" />}
                  />
                  <StatCard
                    label="Active Learners"
                    value="2.4K+"
                    icon={<FiBookOpen className="w-4 h-4" />}
                  />
                  <StatCard
                    label="Success Rate"
                    value="98%"
                    icon={<FiStar className="w-4 h-4" />}
                  />
                </div>
              </MotionDiv>
            </div>
          </div>

          <div className="hidden md:flex items-center justify-center">
            <div className="w-full max-w-lg space-y-8">
              <MotionDiv
                initial={{ opacity: 0, scale: 0.9, rotateY: 15 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                transition={{
                  duration: 1,
                  delay: 0.3,
                  type: "spring",
                  stiffness: 100,
                }}
                whileHover={{
                  scale: 1.05,
                  rotateY: -5,
                  transition: { type: "spring", stiffness: 300 },
                }}
                className="w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl shadow-brand-500/10 bg-gradient-to-br from-brand-50 to-white"
              >
                <img
                  src="/images/ztalk_hero.png"
                  alt="ZTalk Hero - Learn Swahili"
                  className="w-full h-full object-cover filter drop-shadow-lg"
                  loading="lazy"
                />
              </MotionDiv>

              <div className="grid grid-cols-3 gap-4 w-full">
                <StatCard
                  label="Native Tutors"
                  value="150+"
                  icon={<FiUsers className="w-4 h-4" />}
                />
                <StatCard
                  label="Active Learners"
                  value="2.4K+"
                  icon={<FiBookOpen className="w-4 h-4" />}
                />
                <StatCard
                  label="Success Rate"
                  value="98%"
                  icon={<FiStar className="w-4 h-4" />}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
