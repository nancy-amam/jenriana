"use client";

import React, { useEffect, useRef, useState } from "react";
import { TestimonialCard } from "@/components/testimonial-card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getFeedbacks } from "@/services/api-services";

interface GeneralFeedback {
  _id: string;
  name: string;
  enjoyedMost: string;
  improvements: string;
  customerService: string;
  recommend: string;
  createdAt: string;
}

const TestimonialsSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [feedback, setFeedback] = useState<GeneralFeedback[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const res = await getFeedbacks(true); // fetch only published
      setFeedback(res.data || []);
    } catch (err) {
      setFeedback([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const scrollToIndex = (index: number) => {
    if (containerRef.current) {
      const card = containerRef.current.children[index] as HTMLElement;
      if (card) {
        containerRef.current.scrollTo({
          left: card.offsetLeft,
          behavior: "smooth",
        });
      }
    }
    setCurrentIndex(index);
  };

  const handlePrev = () => {
    if (currentIndex > 0) scrollToIndex(currentIndex - 1);
  };

  const handleNext = () => {
    if (currentIndex < feedback.length - 1) scrollToIndex(currentIndex + 1);
  };

  return (
    <section className="px-4 md:px-16 text-center my-10 relative">
      <h2 className="lg:text-xl font-semibold mb-6 md:mb-5 text-[#1e1e1e] text-left">What our guests say</h2>

      {loading ? (
        <div className="text-center text-gray-500 py-10 animate-pulse">Loading reviews…</div>
      ) : feedback.length === 0 ? (
        <div className="text-center text-gray-500 py-10">No feedback available yet.</div>
      ) : (
        <div className="relative">
          <div ref={containerRef} className="flex overflow-x-hidden gap-6 no-scrollbar snap-x snap-mandatory">
            {feedback.map((item) => (
              <div key={item._id} className="flex-shrink-0 snap-start w-72">
                <TestimonialCard
                  testimonial={{
                    id: item._id,
                    authorName: item.name,
                    text: item.enjoyedMost || "Great stay!",
                    rating: item.customerService === "Excellent" ? 5 : 4,
                    date: new Date(item.createdAt).toLocaleDateString(),
                  }}
                />
              </div>
            ))}
          </div>

          {/* NAV BUTTONS */}
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-white shadow-md rounded-full p-2 disabled:opacity-40"
          >
            <ChevronLeft />
          </button>

          <button
            onClick={handleNext}
            disabled={currentIndex === feedback.length - 1}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-white shadow-md rounded-full p-2 disabled:opacity-40"
          >
            <ChevronRight />
          </button>
        </div>
      )}
    </section>
  );
};

export default TestimonialsSection;
