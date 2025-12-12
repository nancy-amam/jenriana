import { StarIcon } from "lucide-react";
import type { Testimonial } from "@/lib/interface";

interface TestimonialCardProps {
  testimonial: Testimonial;
}

export function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <div className="w-full max-w-sm md:max-w-md lg:max-w-lg min-h-[200px] p-5 rounded-xl border border-gray-200 bg-white shadow-sm flex flex-col justify-between">
      <div className="flex items-center gap-1 mb-3">
        {[...Array(testimonial.rating)].map((_, i) => (
          <StarIcon key={i} className="h-4 w-4 md:h-5 md:w-5 text-amber-400 fill-amber-400" />
        ))}
      </div>

      <p className="text-sm text-[#374151] text-left flex-grow leading-relaxed">{testimonial.text}</p>

      <div className="mt-4">
        <span className="block text-sm md:text-base text-[#1e1e1e] font-semibold text-left">
          {testimonial.authorName}
        </span>
        {testimonial.date && (
          <span className="block text-xs text-[#6b7280] text-left">
            {new Date(testimonial.date).toLocaleDateString("en-US", {
              month: "short",
              year: "numeric",
            })}
          </span>
        )}
      </div>
    </div>
  );
}
