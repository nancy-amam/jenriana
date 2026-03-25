import { StarIcon } from "lucide-react";
import type { Testimonial } from "@/lib/interface";

interface TestimonialCardProps {
  testimonial: Testimonial;
}

export function TestimonialCard({ testimonial }: TestimonialCardProps) {
  const dateLabel =
    testimonial.date &&
    (() => {
      const d = new Date(testimonial.date);
      return Number.isNaN(d.getTime())
        ? testimonial.date
        : d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
    })();

  return (
    <article className="flex h-full min-h-[180px] w-full max-w-sm flex-col justify-between rounded-xl border border-white/10 bg-white/[0.03] p-4 shadow-[0_16px_40px_rgba(0,0,0,0.35)] transition-colors duration-300 hover:border-explore-accent/30 md:min-h-[200px] md:max-w-md md:p-5">
      <div>
        <div className="mb-3 flex items-center gap-0.5">
          {[...Array(Math.min(5, Math.max(1, testimonial.rating)))].map((_, i) => (
            <StarIcon key={i} className="h-3.5 w-3.5 fill-explore-accent text-explore-accent md:h-4 md:w-4" />
          ))}
        </div>
        <p className="font-luxury-body line-clamp-6 text-left text-xs leading-relaxed text-white/85 md:text-sm md:leading-relaxed">
          {testimonial.text}
        </p>
      </div>

      <div className="mt-4 border-t border-white/5 pt-3 md:mt-5 md:pt-4">
        <span className="font-luxury-display block text-left text-sm font-normal text-white md:text-base">
          {testimonial.authorName}
        </span>
        {dateLabel && (
          <span className="font-luxury-body mt-0.5 block text-left text-[10px] text-luxury-muted md:text-xs">
            {dateLabel}
          </span>
        )}
      </div>
    </article>
  );
}
