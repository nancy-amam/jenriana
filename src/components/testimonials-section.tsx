import React, { useRef, useState } from "react";
import { TestimonialCard } from "@/components/testimonial-card";
import { testimonials } from "@/lib/dummy-data";
import { ChevronLeft, ChevronRight } from "lucide-react";

const TestimonialsSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

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
    if (currentIndex < testimonials.length - 1) scrollToIndex(currentIndex + 1);
  };

  return (
    <section className="px-4 md:px-16 text-center my-10 relative">
      <h2 className="lg:text-xl font-semibold mb-6 md:mb-5 text-[#1e1e1e] text-left">
        What our guests say
      </h2>
      <div className="relative">
        <div
          ref={containerRef}
          className="flex overflow-x-hidden gap-6 no-scrollbar snap-x snap-mandatory"
        >
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="flex-shrink-0 snap-start w-72">
              <TestimonialCard testimonial={testimonial} />
            </div>
          ))}
        </div>
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-white shadow-md rounded-full p-2 disabled:opacity-40"
        >
          <ChevronLeft />
        </button>
        <button
          onClick={handleNext}
          disabled={currentIndex === testimonials.length - 1}
          className="absolute right-0 top-1/2 -translate-y-1/2 bg-white shadow-md rounded-full p-2 disabled:opacity-40"
        >
          <ChevronRight />
        </button>
      </div>
    </section>
  );
};

export default TestimonialsSection;
