"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import clsx from "clsx";

const BG = "#121212";
const ACCENT = "#a69175";

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "How do I book an apartment on Jenriana?",
    answer:
      "Search for your preferred location, select your check-in and check-out dates, choose an apartment, and complete the checkout. You'll receive a confirmation email immediately.",
  },
  {
    question: "Can I request early check-in or late check-out?",
    answer:
      "Yes, depending on availability. You can add this to the 'Special Requests' section during booking or contact the host after confirmation.",
  },
  {
    question: "What payment methods are accepted?",
    answer: "We accept card payments (Visa, MasterCard, Verve) and bank transfers depending on the apartment.",
  },
  {
    question: "Can I cancel my booking?",
    answer: "Yes. Each apartment has its own cancellation policy. Please check the listing details for refund rules.",
  },
  {
    question: "Are pets allowed in the apartments?",
    answer: "Only in listings marked as Pet-Friendly. Always check the apartment description before booking.",
  },
  {
    question: "How do I contact the host during my stay?",
    answer:
      "Host or property manager contact details are sent to your email immediately after your booking is confirmed.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="" style={{ backgroundColor: BG }}>
      <div className="wrap bg-black/20 py-14 md:py-20 px-4 md:px-10 lg:px-16">
        <div className="max-w-6xl mx-auto">
          <p
            className="font-luxury-body text-center text-xs md:text-sm tracking-[0.28em] uppercase mb-4"
            style={{ color: ACCENT }}
          >
            Help & support
          </p>
          <h2 className="font-luxury-display text-center text-2xl sm:text-3xl md:text-[2rem] text-white leading-tight tracking-tight mb-4 md:mb-5">
            Frequently Asked Questions
          </h2>
          <div
            className="mx-auto mb-10 md:mb-12 h-px max-w-[12rem] rounded-full bg-gradient-to-r from-transparent via-[#a69175] to-transparent opacity-90"
            aria-hidden
          />

          <div className="space-y-3">
            {faqs.map((item, idx) => (
              <div
                key={idx}
                className={clsx(
                  "group rounded-xl border bg-white/[0.03] transition-all duration-300",
                  openIndex === idx
                    ? "border-[#a69175]/45 shadow-[0_0_0_1px_rgba(166,145,117,0.12)] bg-[#a69175]/[0.07]"
                    : "border-white/10 hover:border-[#a69175]/35 hover:bg-[#a69175]/[0.04]",
                )}
              >
                <button
                  type="button"
                  className="flex w-full cursor-pointer items-center justify-between gap-4 p-4 text-left"
                  onClick={() => toggle(idx)}
                  aria-expanded={openIndex === idx}
                >
                  <h3
                    className={clsx(
                      "font-luxury-display text-sm md:text-base font-medium leading-snug transition-colors duration-300",
                      openIndex === idx ? "text-[#e8dcc8]" : "text-white group-hover:text-[#e8dcc8]/95",
                    )}
                  >
                    {item.question}
                  </h3>
                  <ChevronDown
                    className={clsx(
                      "h-5 w-5 shrink-0 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]",
                      openIndex === idx ? "rotate-180 text-[#a69175]" : "text-[#a69175]/55 group-hover:text-[#a69175]",
                    )}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {openIndex === idx && (
                    <motion.div
                      key={idx}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{
                        height: { duration: 0.42, ease: [0.4, 0, 0.2, 1] },
                        opacity: { duration: 0.28, ease: [0.4, 0, 0.2, 1] },
                      }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-[#a69175]/25 px-4 pb-4 pt-3">
                        <p className="font-luxury-body text-sm leading-relaxed text-white/75">{item.answer}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
