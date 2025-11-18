import Image from "next/image";
import { StarIcon } from "lucide-react";
import type { Testimonial } from "@/lib/interface";

interface TestimonialCardProps {
  testimonial: Testimonial;
}

export function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <div className="w-full max-w-sm md:max-w-md lg:max-w-lg min-h-[220px] flex-shrink-0 p-5 rounded-xl border border-gray-200 bg-white flex flex-col justify-between shadow-sm">
      <div className="flex items-center gap-1 mb-3">
        {[...Array(testimonial.rating)].map((_, i) => (
          <StarIcon key={i} className="lg:h-5 lg:w-5 h-2 w-2 text-amber-400 fill-amber-400" />
        ))}
      </div>

      <p className="text-xs text-[#374151] text-left flex-grow leading-relaxed">{testimonial.text}</p>

      <div className="flex items-center gap-3 mt-4">
        <div className="relative w-10 h-10">
          <Image src="/images/user.png" alt={testimonial.authorName} fill className="rounded-full object-cover" />
        </div>
        <div className="flex flex-col">
          <span className="text-xs md:text-base text-[#1e1e1e] font-medium text-left">{testimonial.authorName}</span>
          <span className="text-xs md:text-sm text-[#4b5563] text-left">Lagos</span>
        </div>
      </div>
    </div>
  );
}
