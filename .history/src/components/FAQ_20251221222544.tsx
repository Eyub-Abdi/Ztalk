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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="group relative"
    >
      <div className="border border-gray-200 rounded-2xl bg-white hover:bg-gray-50/50 transition-all duration-300 hover:shadow-md overflow-hidden backdrop-blur-sm">
        <h3>
          <button
            onClick={onToggle}
            className={clsx(
              "w-full flex items-center justify-between p-6 text-left font-semibold transition-all duration-300 group",
              isOpen 
                ? "text-brand-700 bg-brand-50/80" 
                : "text-gray-900 hover:text-brand-600"
            )}
            aria-expanded={isOpen}
          >
            <span className="flex items-center gap-3 text-base md:text-lg">
              <FiHelpCircle 
                className={clsx(
                  "w-5 h-5 transition-colors duration-300",
                  isOpen ? "text-brand-500" : "text-gray-400 group-hover:text-brand-500"
                )}
              />
              {question}
            </span>
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <FiChevronDown
                className={clsx(
                  "w-5 h-5 transition-colors duration-300",
                  isOpen ? "text-brand-500" : "text-gray-400 group-hover:text-brand-500"
                )}
              />
            </motion.div>
          </button>
        </h3>
        
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="px-6 pb-6 pt-2">
                <div className="pl-8 text-gray-600 leading-relaxed text-sm md:text-base">
                  {answer}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Subtle gradient border effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-brand-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </motion.div>
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
    <section id="faq" className="py-12 md:py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-brand-50 text-brand-700 rounded-full text-sm font-semibold mb-6">
            <FiHelpCircle className="w-4 h-4" />
            FAQ
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Got <span className="text-brand-600">Questions?</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Find answers to the most commonly asked questions about learning Swahili with our expert tutors.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto space-y-4">
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
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-12"
        >
          <p className="text-gray-600 mb-4">
            Still have questions? We're here to help!
          </p>
          <button className="inline-flex items-center gap-2 px-6 py-3 bg-brand-600 text-white font-semibold rounded-xl hover:bg-brand-700 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
            <FiHelpCircle className="w-4 h-4" />
            Contact Support
          </button>
        </motion.div>
      </div>
    </section>
  );
}

export default FAQ;
