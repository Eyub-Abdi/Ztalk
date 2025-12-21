import { FiUserCheck, FiUsers, FiMessageCircle } from "react-icons/fi";
import { ReactNode } from "react";
import { motion } from "framer-motion";
import { motion } from "framer-motion";

interface OfferItem {
  title: string;
  description: string;
  icon: ReactNode;
  highlight?: boolean;
  image: string;
  imageAlt: string;
}

const OFFERS: OfferItem[] = [
  {
    title: "1-on-1 Lessons",
    description:
      "Personalized live sessions focused on your goals: travel, culture, business, or everyday conversation.",
    icon: <FiUserCheck />,
    image: "/images/1 on 1 online Lessons.jpg",
    imageAlt:
      "Tutor and learner engaged in a focused 1-on-1 online Swahili lesson",
  },
  {
    title: "Group Class",
    description:
      "Collaborative learning with small groups to practice real scenarios and boost confidence.",
    icon: <FiUsers />,
    image: "/images/group-lession.jpg",
    imageAlt: "Group Swahili lesson with multiple learners interacting",
  },
  {
    title: "Practice for Free",
    description:
      "Access free drills and future community features to reinforce what you learn between sessions.",
    icon: <FiMessageCircle />,
    image: "/images/Practice.jpg",
    imageAlt: "Casual free Swahili practice resources on a desk",
  },
];

export function Offers() {
  return (
    <section id="offers" className="py-16 md:py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            What We <span className="text-brand-600">Offer</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Flexible ways to build real Swahili communication confidence.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {OFFERS.map((o, index) => (
            <motion.div
              key={o.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8, transition: { type: "spring", stiffness: 300, damping: 20 } }}
              className="group relative"
            >
              <div className="relative bg-white rounded-3xl border border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden backdrop-blur-sm h-full flex flex-col">
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                
                <div className="relative rounded-t-3xl overflow-hidden">
                  <div className="aspect-video relative">
                    <img
                      src={o.image}
                      alt={o.imageAlt}
                      className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105 group-hover:brightness-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                </div>

                <div className="flex flex-col gap-6 p-8 relative z-[1] flex-1">
                  <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-600 text-white text-xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                    {o.icon}
                  </div>
                  <div className="space-y-3 flex-1">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-brand-600 transition-colors duration-300">
                      {o.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed text-sm">{o.description}</p>
                  </div>
                  
                  {/* Subtle bottom accent */}
                  <div className="absolute bottom-0 left-8 right-8 h-0.5 bg-gradient-to-r from-transparent via-brand-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Offers;
