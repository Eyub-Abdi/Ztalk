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
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
          {OFFERS.map((o) => (
            <div
              key={o.title}
              className="flex flex-col bg-white rounded-xl border border-gray-200 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 overflow-hidden"
            >
              <div className="relative rounded-t-xl overflow-hidden">
                <div className="aspect-video">
                  <img
                    src={o.image}
                    alt={o.imageAlt}
                    className="w-full h-full object-cover transition-all duration-400 hover:brightness-105"
                    loading="lazy"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-4 px-6 pb-6 pt-4 relative z-[1]">
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-100 text-brand-600 text-xl flex-shrink-0">
                  {o.icon}
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {o.title}
                  </h3>
                  <p className="text-sm text-gray-600">{o.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Offers;
