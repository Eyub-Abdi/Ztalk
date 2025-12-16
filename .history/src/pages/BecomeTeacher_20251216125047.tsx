import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiDollarSign,
  FiClock,
  FiUsers,
  FiHeart,
  FiCheck,
  FiArrowRight,
  FiStar,
  FiGlobe,
} from "react-icons/fi";

const benefits = [
  {
    icon: FiDollarSign,
    title: "Competitive Pay",
    description:
      "Earn $15-25 per hour teaching Swahili to motivated students worldwide.",
    color: "text-green-500",
    bgColor: "bg-green-50 dark:bg-green-900/30",
  },
  {
    icon: FiClock,
    title: "Flexible Schedule",
    description: "Set your own hours and teach when it works best for you.",
    color: "text-blue-500",
    bgColor: "bg-blue-50 dark:bg-blue-900/30",
  },
  {
    icon: FiUsers,
    title: "Global Community",
    description:
      "Connect with students from around the world and share your culture.",
    color: "text-purple-500",
    bgColor: "bg-purple-50 dark:bg-purple-900/30",
  },
  {
    icon: FiHeart,
    title: "Make an Impact",
    description:
      "Help students build confidence and connections through language learning.",
    color: "text-red-500",
    bgColor: "bg-red-50 dark:bg-red-900/30",
  },
];

const stats = [
  { value: "500+", label: "Active Teachers" },
  { value: "10,000+", label: "Students Taught" },
  { value: "4.9/5", label: "Avg Rating" },
  { value: "$2M+", label: "Earned by Teachers" },
];

export default function BecomeTeacher() {
  return (
    <div>
      {/* Hero Section */}
      <div className="relative overflow-hidden pt-16 md:pt-24 pb-20 md:pb-32 bg-gradient-to-br from-brand-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container-main relative">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-brand-100 dark:bg-brand-900 text-brand-700 dark:text-brand-300 rounded-full text-sm font-medium"
            >
              <FiStar className="w-4 h-4" />
              <span>Join 500+ Teachers Worldwide</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight"
            >
              Teach Swahili,{" "}
              <span className="text-brand-500">Earn on Your Terms</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
            >
              Share your passion for Swahili culture and language with students
              around the world. Set your own schedule, work from anywhere, and
              make a lasting impact.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap items-center justify-center gap-4"
            >
              <Link
                to="/teacher-application"
                className="btn btn-primary px-8 py-4 text-lg flex items-center gap-2 hover:-translate-y-0.5 hover:shadow-xl transition-all"
              >
                Apply Now
                <FiArrowRight className="w-5 h-5" />
              </Link>
              <button className="btn btn-outline px-8 py-4 text-lg flex items-center gap-2">
                <FiGlobe className="w-5 h-5" />
                Watch Demo
              </button>
            </motion.div>

            {/* Social Proof */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap items-center justify-center gap-8 pt-4"
            >
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-8 h-8 rounded-full border-2 border-white dark:border-gray-800 ${
                        [
                          "bg-brand-400",
                          "bg-blue-400",
                          "bg-green-400",
                          "bg-purple-400",
                        ][i]
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  <strong>500+</strong> active teachers
                </span>
              </div>
              <div className="flex items-center gap-1 text-orange-400">
                {[...Array(5)].map((_, i) => (
                  <FiStar key={i} className="w-4 h-4 fill-current" />
                ))}
                <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                  <strong>4.9</strong> average rating
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-12 md:py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container-main">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <p className="text-3xl md:text-4xl font-bold text-brand-500">
                  {stat.value}
                </p>
                <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm md:text-base">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Benefits Grid */}
      <div className="py-12 md:py-20">
        <div className="container-main">
          <div className="space-y-12">
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                Why Teachers Love Ztalk
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Join a community that values your expertise and supports your
                success
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -8 }}
                  className="card p-8 text-center relative overflow-hidden group hover:shadow-xl transition-shadow"
                >
                  <div
                    className={`w-16 h-16 ${benefit.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-6`}
                  >
                    <benefit.icon className={`w-8 h-8 ${benefit.color}`} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    {benefit.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {benefit.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Requirements Section */}
      <div className="py-12 md:py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container-main max-w-5xl">
          <div className="space-y-12">
            <div className="text-center space-y-4">
              <span className="inline-block px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium">
                Requirements
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                What We&apos;re Looking For
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                We welcome passionate educators who meet these criteria
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="card p-8"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-brand-50 dark:bg-brand-900/30 rounded-xl flex items-center justify-center">
                    <FiUsers className="w-6 h-6 text-brand-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Experience & Skills
                  </h3>
                </div>
                <div className="space-y-4">
                  {[
                    "Native or fluent Swahili speaker",
                    "Teaching experience (formal or informal)",
                    "Strong communication skills",
                    "Patience and enthusiasm for teaching",
                    "Cultural knowledge to share",
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-2">
                      <FiCheck className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="card p-8"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                    <FiGlobe className="w-6 h-6 text-blue-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Technical Requirements
                  </h3>
                </div>
                <div className="space-y-4">
                  {[
                    "Reliable internet connection (10+ Mbps)",
                    "Computer with HD camera and microphone",
                    "Quiet teaching environment",
                    "Availability for at least 10 hours per week",
                    "Basic tech proficiency",
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-2">
                      <FiCheck className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 md:py-24">
        <div className="container-main max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-400 to-brand-600 p-8 md:p-12 text-center"
          >
            <div className="absolute -top-1/2 -right-1/4 w-[400px] h-[400px] bg-white/20 rounded-full blur-[60px]" />
            <div className="relative space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                Ready to Make an Impact?
              </h2>
              <p className="text-lg text-white/90 max-w-2xl mx-auto">
                Join hundreds of teachers who are already making a difference in
                students&apos; lives while earning competitive income on their
                own schedule.
              </p>
              <hr className="border-white/30 max-w-md mx-auto" />
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link
                  to="/teacher-application"
                  className="px-8 py-4 bg-white text-brand-500 font-semibold rounded-lg flex items-center gap-2 hover:-translate-y-0.5 hover:shadow-xl transition-all"
                >
                  Start Your Application
                  <FiArrowRight className="w-5 h-5" />
                </Link>
                <button className="px-8 py-4 border border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors">
                  Contact Us
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
