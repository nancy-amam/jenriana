"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

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
    <section className="px-4 md:px-16 py-12 bg-white">
      <h2 className="text-xl md:text-2xl font-semibold text-[#1e1e1e] mb-6">Frequently Asked Questions</h2>

      <div className="space-y-4">
        {faqs.map((item, idx) => (
          <div
            key={idx}
            className="border border-gray-200 rounded-xl p-4 cursor-pointer transition hover:bg-gray-50"
            onClick={() => toggle(idx)}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm md:text-base font-medium text-[#1e1e1e]">{item.question}</h3>
              <ChevronDown
                className={`h-5 w-5 text-gray-500 transition-transform ${openIndex === idx ? "rotate-180" : ""}`}
              />
            </div>

            {openIndex === idx && <p className="mt-3 text-sm text-gray-600 leading-relaxed">{item.answer}</p>}
          </div>
        ))}
      </div>
    </section>
  );
}
