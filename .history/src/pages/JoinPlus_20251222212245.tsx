import { motion } from "framer-motion";
import {
  FiStar,
  FiZap,
  FiCheck,
  FiArrowRight,
  FiShield,
  FiUsers,
  FiTrendingUp,
  FiMessageSquare,
} from "react-icons/fi";

const features = [
  {
    icon: FiZap,
    title: "Priority Access",
    description: "Skip the queue and get instant booking with top tutors",
  },
  {
    icon: FiStar,
    title: "Premium Content",
    description: "Exclusive lessons, cultural insights, and advanced materials",
  },
  {
    icon: FiTrendingUp,
    title: "Progress Tracking",
    description: "AI-powered analytics to accelerate your learning journey",
  },
  {
    icon: FiMessageSquare,
    title: "24/7 Support",
    description: "Priority support with instant chat and expert guidance",
  },
];

const benefits = [
  "Unlimited lesson bookings",
  "Access to premium tutors",
  "Advanced progress analytics",
  "Priority customer support",
  "Exclusive cultural content",
  "Monthly group sessions",
];

export default function JoinPlusPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative pt-20 pb-32 bg-gradient-to-br from-brand-50 to-blue-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="text-center space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-brand-500 to-brand-600 text-white rounded-full text-sm font-semibold"
            >
              <FiStar className="w-4 h-4" />
              Premium Learning Experience
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-6xl font-black text-gray-900 leading-tight"
            >
              Master Swahili
              <br />
              <span className="bg-gradient-to-r from-brand-600 to-indigo-600 bg-clip-text text-transparent">
                Faster
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-gray-600 max-w-2xl mx-auto"
            >
              Get premium access to our best tutors, exclusive content, and
              personalized learning tools.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="space-y-4"
            >
              <button className="px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-brand-500 to-brand-600 rounded-full hover:-translate-y-1 transform transition-all duration-300 shadow-lg flex items-center gap-3 mx-auto">
                <FiZap className="w-5 h-5" />
                Start Plus Today
                <FiArrowRight className="w-5 h-5" />
              </button>
              <p className="text-sm text-gray-500 flex items-center justify-center gap-2">
                <FiShield className="w-4 h-4 text-green-500" />
                30-day money-back guarantee
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
              Why Choose <span className="text-brand-600">Plus?</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Everything you need to accelerate your language learning journey.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center p-6 rounded-2xl hover:bg-gray-50 transition-colors duration-300"
                >
                  <div className="w-16 h-16 bg-gradient-to-r from-brand-100 to-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-brand-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
              Simple <span className="text-brand-600">Pricing</span>
            </h2>
            <p className="text-lg text-gray-600">
              One plan, all features included. Cancel anytime.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-5xl mx-auto"
          >
            {/* Grid Layout */}
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-10 items-start">
              {/* Left Column - Pricing Info */}
              <div className="text-center lg:text-left space-y-6">
                <div className="space-y-4">
                  <div className="flex items-baseline justify-center lg:justify-start gap-3">
                    <span className="text-7xl font-black bg-gradient-to-r from-brand-600 to-indigo-600 bg-clip-text text-transparent">$19</span>
                    <div className="text-left">
                      <span className="text-2xl text-gray-500 block">/month</span>
                      <span className="text-sm text-gray-400">per user</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-gray-600 font-medium">Billed monthly</p>
                    <p className="text-sm text-gray-500">Cancel anytime, no setup fees</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <button className="w-full lg:w-auto px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-brand-500 to-brand-600 rounded-full hover:-translate-y-1 transform transition-all duration-300 shadow-lg hover:shadow-xl">
                    Start Plus Today
                  </button>
                  
                  <div className="flex flex-col lg:flex-row items-center justify-center lg:justify-start gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <FiShield className="w-4 h-4 text-green-500" />
                      30-day guarantee
                    </div>
                    <div className="flex items-center gap-2">
                      <FiUsers className="w-4 h-4 text-blue-500" />
                      Join 10k+ learners
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Features */}
              <div className="space-y-4">
                <h4 className="text-base font-semibold text-gray-900 text-center lg:text-left">Everything included:</h4>
                <div className="grid gap-2">
                  {benefits.map((benefit, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="flex items-center gap-4 p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                    >
                      <div className="w-6 h-6 bg-gradient-to-r from-brand-500 to-brand-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <FiCheck className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-gray-600 text-sm">{benefit}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom CTA for mobile */}
            <div className="mt-8 lg:hidden text-center">
              <button className="w-full py-4 px-8 text-lg font-bold text-white bg-gradient-to-r from-brand-500 to-brand-600 rounded-full hover:-translate-y-1 transform transition-all duration-300 shadow-lg hover:shadow-xl">
                Start Plus Today
              </button>
              
              <div className="flex items-center justify-center gap-6 text-sm text-gray-500 mt-4">
                <div className="flex items-center gap-2">
                  <FiShield className="w-4 h-4 text-green-500" />
                  30-day guarantee
                </div>
                <div className="flex items-center gap-2">
                  <FiUsers className="w-4 h-4 text-blue-500" />
                  Join 10k+ learners
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* CTA */}
      <div className="py-20 bg-gradient-to-r from-brand-600 to-indigo-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-black text-white">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Join thousands of learners who&apos;ve accelerated their Swahili
              fluency with Plus.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button className="px-8 py-4 text-lg font-bold text-brand-600 bg-white rounded-full hover:-translate-y-1 transform transition-all duration-300 shadow-lg flex items-center gap-3">
                <FiUsers className="w-5 h-5" />
                Join Plus Now
                <FiArrowRight className="w-5 h-5" />
              </button>
              <p className="text-white/80 text-sm">
                30-day guarantee • Cancel anytime
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
