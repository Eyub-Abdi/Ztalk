import { motion } from "framer-motion";
import {
  FiStar,
  FiZap,
  FiAward,
  FiCheck,
  FiArrowRight,
  FiShield,
  FiTrendingUp,
  FiGlobe,
  FiMessageSquare,
  FiUsers,
  FiLock,
  FiTrophy,
} from "react-icons/fi";
import { Link } from "react-router-dom";

const premiumFeatures = [
  {
    icon: FiZap,
    title: "Priority Booking",
    description: "Skip the queue and get first access to premium tutors",
    color: "text-amber-500",
    bgColor: "bg-gradient-to-br from-amber-50 to-orange-50",
  },
  {
    icon: FiTrophy,
    title: "Exclusive Content",
    description: "Access premium lessons, cultural content, and advanced materials",
    color: "text-yellow-600",
    bgColor: "bg-gradient-to-br from-yellow-50 to-amber-50",
  },
  {
    icon: FiShield,
    title: "Personalized Learning",
    description: "Custom learning paths and AI-powered progress tracking",
    color: "text-orange-500",
    bgColor: "bg-gradient-to-br from-orange-50 to-red-50",
  },
  {
    icon: FiTrendingUp,
    title: "Advanced Analytics",
    description: "Track your progress with detailed insights and recommendations",
    color: "text-red-500",
    bgColor: "bg-gradient-to-br from-red-50 to-pink-50",
  },
  {
    icon: FiMessageSquare,
    title: "24/7 Support",
    description: "Premium support with instant chat and priority responses",
    color: "text-amber-600",
    bgColor: "bg-gradient-to-br from-amber-50 to-yellow-50",
  },
  {
    icon: FiUsers,
    title: "Community Access",
    description: "Join exclusive Plus member community and cultural events",
    color: "text-orange-600",
    bgColor: "bg-gradient-to-br from-orange-50 to-amber-50",
  },
];

const plans = [
  {
    name: "Monthly",
    price: "$19",
    period: "/month",
    popular: false,
    savings: null,
  },
  {
    name: "Quarterly",
    price: "$49",
    period: "/3 months",
    popular: true,
    savings: "Save 14%",
  },
  {
    name: "Annual",
    price: "$159",
    period: "/year",
    popular: false,
    savings: "Save 30%",
  },
];

const benefits = [
  "Unlimited lesson bookings",
  "Access to premium tutors",
  "Priority customer support",
  "Advanced progress tracking",
  "Exclusive cultural content",
  "Mobile app premium features",
  "Monthly group sessions",
  "Certificate of completion",
];

export default function JoinPlusPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden pt-16 md:pt-24 pb-20 md:pb-32 bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
        {/* Background decorations */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-20 h-20 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full opacity-20 blur-xl"></div>
          <div className="absolute top-32 right-20 w-32 h-32 bg-gradient-to-r from-yellow-400 to-red-500 rounded-full opacity-10 blur-2xl"></div>
          <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-gradient-to-r from-orange-400 to-amber-500 rounded-full opacity-15 blur-xl"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white rounded-full text-sm font-bold shadow-lg"
            >
              <FiAward className="w-5 h-5 text-yellow-200" />
              <span>Premium Experience</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight"
            >
              <span className="bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 bg-clip-text text-transparent">
                Unlock Premium
              </span>
              <br />
              <span className="text-gray-900">
                Language Learning
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
            >
              Elevate your Swahili learning experience with exclusive features, premium tutors, 
              and personalized content designed for serious learners who want to master the language faster.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap items-center justify-center gap-4"
            >
              <button className="px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 rounded-full hover:-translate-y-1 transform transition-all duration-300 shadow-lg shadow-orange-500/25 flex items-center gap-3">
                <FiZap className="w-6 h-6" />
                Start Your Plus Journey
                <FiArrowRight className="w-5 h-5" />
              </button>
              <p className="text-sm text-gray-600 flex items-center gap-2">
                <FiShield className="w-4 h-4 text-green-500" />
                30-day money-back guarantee
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="py-20 md:py-32 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="text-center space-y-6 mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-black text-gray-900"
            >
              Premium Features That Make a{" "}
              <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                Difference
              </span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-lg text-gray-600 max-w-2xl mx-auto"
            >
              Everything you need to accelerate your language learning journey and achieve fluency faster.
            </motion.p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {premiumFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -8, transition: { duration: 0.3 } }}
                  className={`p-8 rounded-2xl ${feature.bgColor} border border-gray-100 shadow-lg shadow-gray-200/50 group cursor-pointer`}
                >
                  <div className={`w-12 h-12 ${feature.bgColor} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`w-6 h-6 ${feature.color}`} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="py-20 md:py-32 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="text-center space-y-6 mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-black text-gray-900"
            >
              Choose Your{" "}
              <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                Premium Plan
              </span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-lg text-gray-600 max-w-2xl mx-auto"
            >
              Flexible pricing options to fit your learning goals and schedule.
            </motion.p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`relative p-8 rounded-3xl border-2 shadow-xl ${
                  plan.popular
                    ? 'border-gradient-to-r from-amber-500 to-orange-500 bg-white shadow-orange-500/10'
                    : 'border-gray-200 bg-white shadow-gray-200/50'
                } group hover:scale-105 transition-all duration-300`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="px-6 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-bold rounded-full shadow-lg">
                      Most Popular
                    </div>
                  </div>
                )}
                
                {plan.savings && (
                  <div className="absolute top-6 right-6">
                    <div className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                      {plan.savings}
                    </div>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-black text-gray-900">{plan.price}</span>
                    <span className="text-gray-600">{plan.period}</span>
                  </div>
                </div>

                <button
                  className={`w-full py-4 rounded-xl font-bold transition-all duration-300 mb-6 ${
                    plan.popular
                      ? 'text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:-translate-y-1 shadow-lg shadow-orange-500/25'
                      : 'text-gray-900 bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  Get {plan.name} Plan
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-20 md:py-32 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="max-w-4xl mx-auto">
            <div className="text-center space-y-6 mb-16">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="text-3xl md:text-4xl font-black text-gray-900"
              >
                Everything Included in{" "}
                <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                  Plus
                </span>
              </motion.h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors duration-300"
                >
                  <div className="w-6 h-6 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <FiCheck className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-gray-900 font-medium">{benefit}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 md:py-32 bg-gradient-to-br from-amber-600 via-orange-600 to-red-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl lg:text-5xl font-black text-white leading-tight"
            >
              Ready to Transform Your
              <br />
              Language Learning?
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-xl text-white/90 max-w-2xl mx-auto"
            >
              Join thousands of learners who've accelerated their Swahili fluency with Plus.
              Start your premium journey today.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <button className="px-8 py-4 text-lg font-bold text-amber-600 bg-white rounded-full hover:-translate-y-1 hover:shadow-2xl transform transition-all duration-300 flex items-center gap-3">
                <FiAward className="w-6 h-6" />
                Start Plus Today
                <FiArrowRight className="w-5 h-5" />
              </button>
              <p className="text-white/80 text-sm flex items-center gap-2">
                <FiLock className="w-4 h-4" />
                Secure payment • Cancel anytime
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}