"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Instagram, Twitter, MessageCircleMore, Mail, MapPin, PhoneCall } from "lucide-react";
import { toast } from "sonner";
import { submitFeedback } from "@/services/api-services";
import { usePublishedGeneralFeedback } from "@/hooks/use-published-general-feedback";
import { ScrollReveal } from "@/components/scroll-reveal";

function GuestNotesPulseSkeleton() {
  return (
    <div className="animate-pulse space-y-4 rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:p-8">
      <div className="h-6 w-40 rounded bg-white/10" />
      <div className="h-4 w-full max-w-xl rounded bg-white/10" />
      <div className="h-4 w-full max-w-lg rounded bg-white/10" />
    </div>
  );
}

export default function ContactUsPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const queryClient = useQueryClient();
  const feedbackQuery = usePublishedGeneralFeedback();
  const published = feedbackQuery.data ?? [];
  const showFeedbackPulse = feedbackQuery.isFetching && published.length === 0;

  const submitMutation = useMutation({
    mutationFn: async () => {
      const name = `${firstName} ${lastName}`.trim();
      if (!name) throw new Error("Please enter your name.");
      const contact = [email.trim(), phone.trim()].filter(Boolean).join(" · ") || "";
      if (!contact) throw new Error("Please provide an email or phone number.");
      if (!message.trim()) throw new Error("Please enter a message.");

      return submitFeedback({
        name,
        contact,
        bookingProcess: null,
        cleanliness: null,
        amenitiesComfort: null,
        customerService: null,
        valueForMoney: null,
        enjoyedMost: message.trim(),
        improvements: "",
        recommend: null,
      });
    },
    onSuccess: () => {
      toast.success("Thanks — we received your message and will get back to you soon.");
      setFirstName("");
      setLastName("");
      setPhone("");
      setEmail("");
      setMessage("");
      void queryClient.invalidateQueries({ queryKey: ["feedback", "general", "published"] });
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      toast.error(msg);
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    submitMutation.mutate();
  };

  return (
    <div className="min-h-screen bg-explore-bg text-zinc-100 py-12 px-4 md:px-16">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-16 gap-10">
          <ScrollReveal variant="fadeUp" className="flex flex-col items-center lg:items-start text-center lg:text-left mb-10 lg:mb-0">
            <h1 className="text-2xl md:text-5xl font-extrabold text-white leading-tight mb-4">Contact us</h1>
            <p className="text-xl md:text-[28px] font-bold text-zinc-200">
              Please fill the form and we will be happy to assist you.
            </p>
          </ScrollReveal>

          <ScrollReveal variant="fadeRight" delay={0.08} className="w-full lg:w-[617px] h-auto lg:min-h-[403px] rounded-[20px] border border-white/10 bg-zinc-900/90 p-6 lg:p-8 flex flex-col justify-center shadow-lg backdrop-blur-sm">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full h-[52px] rounded-[12px] p-4 bg-zinc-800/90 border border-white/10 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-explore-accent/50"
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full h-[52px] rounded-[12px] p-4 bg-zinc-800/90 border border-white/10 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-explore-accent/50"
                />
                <input
                  type="tel"
                  placeholder="Phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full h-[52px] rounded-[12px] p-4 bg-zinc-800/90 border border-white/10 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-explore-accent/50"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-[52px] rounded-[12px] p-4 bg-zinc-800/90 border border-white/10 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-explore-accent/50"
                />
              </div>
              <textarea
                placeholder="Message"
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full min-h-[139px] rounded-[12px] p-4 bg-zinc-800/90 border border-white/10 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-explore-accent/50 resize-none"
              />
              <button
                type="submit"
                disabled={submitMutation.isPending}
                className="w-full sm:w-auto bg-explore-accent text-[#121212] px-8 py-3 rounded-lg font-medium hover:bg-explore-accent-hover transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitMutation.isPending ? "Sending…" : "Submit"}
              </button>
            </form>
          </ScrollReveal>
        </div>

        {showFeedbackPulse ? (
          <div className="mb-16">
            <GuestNotesPulseSkeleton />
          </div>
        ) : published.length > 0 ? (
          <ScrollReveal variant="fadeUp" className="mb-16 rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:p-8">
            <h2 className="text-lg font-semibold text-explore-accent mb-4 tracking-wide">From our guests</h2>
            <ul className="space-y-4">
              {published.slice(0, 5).map((item) => (
                <li key={item._id} className="border-b border-white/10 pb-4 last:border-0 last:pb-0">
                  <p className="text-sm text-zinc-300 leading-relaxed">
                    <span className="text-white font-medium">{item.name}</span>
                    {item.enjoyedMost ? ` — “${item.enjoyedMost}”` : null}
                  </p>
                </li>
              ))}
            </ul>
          </ScrollReveal>
        ) : null}

        <ScrollReveal variant="fadeUp" className="mb-16">
          <div className="flex gap-5 flex-wrap items-center">
            <h2 className="text-xl font-semibold">Social</h2>
            <div className="flex gap-6">
              <a href="#" aria-label="Instagram" className="text-white hover:text-explore-accent transition-colors">
                <Instagram size={32} />
              </a>
              <a href="#" aria-label="Twitter" className="text-white hover:text-explore-accent transition-colors">
                <Twitter size={32} />
              </a>
              <a href="#" aria-label="WhatsApp" className="text-white hover:text-explore-accent transition-colors">
                <MessageCircleMore size={32} />
              </a>
            </div>
          </div>
          <p className="text-xl md:text-4xl text-zinc-200 mt-8">Let us know what we can do for you</p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <ScrollReveal variant="fadeUp" delay={0.04} className="w-full min-h-[270px] rounded-[8px] border border-white/10 bg-zinc-900/80 p-8 flex flex-col items-center text-center shadow-lg">
            <Mail size={48} className="text-explore-accent mb-4" />
            <h3 className="text-xl font-semibold mb-2">Email Us</h3>
            <p className="text-base text-zinc-400 mb-4">Send us an email for any inquiries.</p>
            <p className="text-lg font-medium text-white">info@jenriana.com</p>
          </ScrollReveal>

          <ScrollReveal variant="fadeUp" delay={0.1} className="w-full min-h-[270px] rounded-[8px] border border-white/10 bg-zinc-900/80 p-8 flex flex-col items-center text-center shadow-lg">
            <MapPin size={48} className="text-explore-accent mb-4" />
            <h3 className="text-xl font-semibold mb-2">Visit Us</h3>
            <p className="text-base text-zinc-400 mb-4">Come say hello at our office location.</p>
            <p className="text-lg font-medium text-white">123 Main St, City, Country</p>
          </ScrollReveal>

          <ScrollReveal variant="fadeUp" delay={0.16} className="w-full min-h-[270px] rounded-[8px] border border-white/10 bg-zinc-900/80 p-8 flex flex-col items-center text-center shadow-lg md:col-span-2 lg:col-span-1">
            <PhoneCall size={48} className="text-explore-accent mb-4" />
            <h3 className="text-xl font-semibold mb-2">Call Us</h3>
            <p className="text-base text-zinc-400 mb-4">Reach out to us by phone.</p>
            <p className="text-lg font-medium text-white">+234 801 234 5678</p>
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
}
