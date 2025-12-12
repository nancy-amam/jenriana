// app/feedback/page.tsx
"use client";

import { submitFeedback } from "@/services/api-services";
import { FormEvent, useState } from "react";
import { toast } from "sonner";

type Rating = "Excellent" | "Good" | "Average" | "Poor";
type YesNo = "Yes" | "No";

const RECIPIENT_EMAIL = "stays@yourapartment.com"; // <-- set your fixed recipient

export default function FeedbackPage() {
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setMessage("");

    const fd = new FormData(e.currentTarget);

    const payload = {
      name: (fd.get("name") || "").toString().trim(),
      contact: (fd.get("contact") || "").toString().trim(),
      bookingProcess: (fd.get("bookingProcess") as Rating) || null,
      cleanliness: (fd.get("cleanliness") as Rating) || null,
      amenitiesComfort: (fd.get("amenitiesComfort") as Rating) || null,
      customerService: (fd.get("customerService") as Rating) || null,
      valueForMoney: (fd.get("valueForMoney") as Rating) || null,
      enjoyedMost: (fd.get("enjoyedMost") || "").toString().trim(),
      improvements: (fd.get("improvements") || "").toString().trim(),
      recommend: (fd.get("recommend") as YesNo) || null,
    };

    try {
      await submitFeedback(payload);
      setStatus("idle");
      toast.success("Feedback Sent. Thank you");
    } catch (err) {
      setStatus("error");
      setMessage("Failed to submit feedback.");
    }
  }

  const field =
    "block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black/20";
  const section = "space-y-4";
  const label = "block text-sm font-medium text-gray-800";

  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-2xl font-semibold">Customer Feedback Form</h1>
      <p className="mt-2 text-sm text-gray-600">
        Thank you for choosing to stay at our apartment. We value your feedback as it helps us improve our services and
        provide you with a better experience. Kindly take a few minutes to complete this form.
      </p>

      <form onSubmit={onSubmit} className="mt-8 space-y-8">
        {/* Guest Information */}
        <section className={section}>
          <h2 className="text-lg font-medium">Guest Information</h2>
          <div>
            <label className={label} htmlFor="name">
              Name
            </label>
            <input id="name" name="name" type="text" className={field} placeholder="John Doe" required />
          </div>
          <div>
            <label className={label} htmlFor="contact">
              Phone/Email
            </label>
            <input
              id="contact"
              name="contact"
              type="text"
              className={field}
              placeholder="+234 801 234 5678 / you@example.com"
              required
            />
          </div>
        </section>

        {/* Your Experience */}
        <section className={section}>
          <h2 className="text-lg font-medium">Your Experience</h2>
          <RatingGroup name="bookingProcess" label="1. How would you rate the booking process?" required />
          <RatingGroup name="cleanliness" label="2. How clean and well-maintained was the apartment?" required />
          <RatingGroup
            name="amenitiesComfort"
            label="3. How comfortable were the amenities (bed, furniture, facilities)?"
            required
          />
          <RatingGroup
            name="customerService"
            label="4. How would you rate the customer service and responsiveness?"
            required
          />
          <RatingGroup name="valueForMoney" label="5. How satisfied are you with the value for money?" required />
        </section>

        {/* Additional Feedback */}
        <section className={section}>
          <h2 className="text-lg font-medium">Additional Feedback</h2>
          <div>
            <label className={label} htmlFor="enjoyedMost">
              6. What did you enjoy most about your stay. Your experience?
            </label>
            <textarea id="enjoyedMost" name="enjoyedMost" className={field} rows={4} />
          </div>
          <div>
            <label className={label} htmlFor="improvements">
              7. What areas do you think we can improve on?
            </label>
            <textarea id="improvements" name="improvements" className={field} rows={4} />
          </div>
          <div>
            <span className={label}>8. Would you recommend us to others?</span>
            <div className="mt-2 flex gap-6">
              <label className="inline-flex items-center gap-2">
                <input type="radio" name="recommend" value="Yes" required />
                <span>Yes</span>
              </label>
              <label className="inline-flex items-center gap-2">
                <input type="radio" name="recommend" value="No" />
                <span>No</span>
              </label>
            </div>
          </div>
        </section>

        {/* Submit */}
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={status === "submitting"}
            className="rounded-md bg-black px-5 py-2.5 text-white disabled:opacity-60"
          >
            {status === "submitting" ? "Sending..." : "Submit Feedback"}
          </button>
          {message && <span className={status === "error" ? "text-red-700 text-sm" : "text-sm"}>{message}</span>}
        </div>

        <p className="text-sm text-gray-600">
          Thank you for your time and feedback! We look forward to hosting you again.
        </p>
      </form>
    </main>
  );
}

/** ---------- Helpers ---------- */
function RatingGroup({ name, label, required }: { name: string; label: string; required?: boolean }) {
  const options: Array<{ value: "Excellent" | "Good" | "Average" | "Poor" }> = [
    { value: "Excellent" },
    { value: "Good" },
    { value: "Average" },
    { value: "Poor" },
  ];

  return (
    <fieldset>
      <legend className="block text-sm font-medium text-gray-800">{label}</legend>
      <div className="mt-2 grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:gap-6">
        {options.map((opt) => (
          <label key={opt.value} className="inline-flex items-center gap-2">
            <input type="radio" name={name} value={opt.value} required={required} />
            <span>{opt.value}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
