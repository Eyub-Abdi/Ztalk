import { FiUserCheck, FiUsers, FiMessageCircle } from "react-icons/fi";
import { ReactNode } from "react";

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
    <section id="offers" className="py-14 md:py-20 bg-gray-50">
      <div className="container-main">
        <div className="space-y-6 mb-10 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            What We Offer
          </h2>
          <p className="text-sm md:text-base text-gray-600">
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
