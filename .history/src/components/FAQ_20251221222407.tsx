import { ReactNode, useState } from "react";
import { FiChevronDown, FiHelpCircle } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";

interface FAQEntry {
  q: string;
  a: ReactNode;
}

const FAQS: FAQEntry[] = [
  {
    q: "What is Ztalk?",
    a: "Ztalk connects learners with experienced Swahili tutors for live, personalized lessons and cultural immersion.",
  },
  {
    q: "How do I book a tutor?",
    a: "Browse tutors, view their profiles and availability, then click Book to pick a time. Account creation is required to confirm.",
  },
  {
    q: "Are tutors verified?",
    a: "Verified tutors display a badge check icon next to their name. Verification includes identity and experience review.",
  },
  {
    q: "What do lessons cost?",
    a: "Pricing is set by each tutor. You will see the per-lesson rate on their card and profile before booking.",
  },
  {
    q: "Can I cancel or reschedule?",
    a: "Yes, you will be able to cancel or request a reschedule within a grace period (details coming soon in policy docs).",
  },
  {
    q: "Which payment methods are supported?",
    a: "We will support major cards and regional options when payments launch. For now, pricing is informational only.",
  },
];

function AccordionItem({
  question,
  answer,
  isOpen,
  onToggle,
}: {
  question: string;
  answer: ReactNode;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border border-gray-200 rounded-lg mb-3 bg-white overflow-hidden">
      <h3>
        <button
          onClick={onToggle}
          className={clsx(
            "w-full flex items-center justify-between px-4 py-3 text-left font-semibold text-sm md:text-base transition-colors",
            isOpen ? "bg-brand-50" : "hover:bg-gray-50"
          )}
          aria-expanded={isOpen}
        >
          <span>{question}</span>
          <FiChevronDown
            className={clsx(
              "w-5 h-5 text-gray-500 transition-transform duration-200",
              isOpen && "rotate-180"
            )}
          />
        </button>
      </h3>
      <div
        className={clsx(
          "overflow-hidden transition-all duration-300",
          isOpen ? "max-h-40" : "max-h-0"
        )}
      >
        <div className="px-4 pt-3 pb-4 text-sm md:text-sm leading-relaxed text-gray-600">
          {answer}
        </div>
      </div>
    </div>
  );
}

export function FAQ() {
  const [openIndices, setOpenIndices] = useState<Set<number>>(new Set());

  const toggleItem = (idx: number) => {
    setOpenIndices((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) {
        next.delete(idx);
      } else {
        next.add(idx);
      }
      return next;
    });
  };

  return (
    <section id="faq" className="py-12 md:py-20 bg-gray-50">
      <div className="container-main">
        <div className="space-y-6 mb-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            Frequently Asked Questions
          </h2>
          <p className="text-sm md:text-base text-gray-600">
            Quick answers to common questions about the platform.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          {FAQS.map((item, idx) => (
            <AccordionItem
              key={idx}
              question={item.q}
              answer={item.a}
              isOpen={openIndices.has(idx)}
              onToggle={() => toggleItem(idx)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default FAQ;
