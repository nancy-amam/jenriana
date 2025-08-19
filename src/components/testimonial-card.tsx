import Image from "next/image"
import { StarIcon } from "lucide-react"
import type { Testimonial } from "@/lib/interface"

interface TestimonialCardProps {
  testimonial: Testimonial
}

export function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <div className="md:w-[424px] h-[226px] w-[350px] flex-shrink-0 p-4 rounded-xl border border-white bg-white flex flex-col justify-between">
      {/* Stars */}
      <div className="flex items-center gap-1 mb-2">
        {[...Array(testimonial.rating)].map((_, i) => (
          <StarIcon key={i} className="h-5 w-5 text-amber-400 fill-amber-400" />
        ))}
      </div>
      {/* Testimonial Text */}
      <p className="text-base text-[#374151] flex-grow mt-2">{testimonial.text}</p>
      {/* Author Info */}
      <div className="flex items-center gap-3">
         <div className="relative w-10 h-10">
  <Image
    src="/images/user.png"
    alt={testimonial.authorName}
    fill
    className="rounded-full object-cover"
  />
</div>

        
        <div className=" flex flex-col">
                <span className="text-sm text-[#1e1e1e] font-medium text-left">{testimonial.authorName}</span>
         <span className="text-sm text-[#4b5563] font-medium text-left">lagos</span>
        </div>
      </div>
    </div>
  )
}
