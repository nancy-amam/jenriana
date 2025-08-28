import React from 'react';
import { TestimonialCard } from '@/components/testimonial-card';
import { testimonials } from '@/lib/dummy-data';

const TestimonialsSection: React.FC = () => {
  return (
    <section className="py-12 md:py-24 lg:py-32 px-4 md:px-16 text-center">
      <h2 className="text-2xl md:text-[36px] font-medium mb-6 md:mb-8 text-[#1e1e1e] text-left">
        What our guests say
      </h2>
      <div className="flex overflow-x-auto gap-6 no-scrollbar snap-x snap-mandatory justify-between">
        {testimonials.map((testimonial) => (
          <TestimonialCard key={testimonial.id} testimonial={testimonial} />
        ))}
      </div>
    </section>
  );
};

export default TestimonialsSection;