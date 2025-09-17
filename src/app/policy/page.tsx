// app/policy/page.tsx  (Next.js 13+ App Router)
export default function PolicyPage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-8">Apartments by Jenriana – Policies & Services</h1>

      {/* Amenities */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Amenities</h2>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>Cleaning</li>
          <li>24hr Electricity</li>
          <li>Unlimited Wi-Fi</li>
          <li>Free Parking</li>
          <li>24hrs Security</li>
          <li>Daily Complimentary Water</li>
        </ul>
      </section>

      {/* Policies */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Policies</h2>
        <ul className="list-disc list-inside space-y-3 text-gray-700">
          <li>
            Reservations must be confirmed with <strong>full payment</strong> (or a{" "}
            <strong>deposit + balance before check-in</strong>).
          </li>
          <li>Accepted payment methods: Bank transfer and card.</li>
          <li>
            <strong>Standard check-in:</strong> 1:00 PM – 8:00 PM (early check-in subject to availability and may
            attract a fee).
          </li>
          <li>
            <strong>Standard check-out:</strong> by 12:00 PM (late check-out may attract extra charges).
          </li>
          <li>Valid ID must be presented at check-in.</li>
          <li>Free cancellation up to 48 hours before arrival.</li>
          <li>Cancellations on the day of reservation may attract partial or no refund.</li>
          <li>No-shows will be charged the full booking fee.</li>
          <li>Maximum occupancy must not exceed 2 persons per room.</li>
          <li>No parties, loud music, or disruptive behavior without prior notice to management.</li>
          <li>Smoking is not permitted inside the property (balcony or designated outdoor areas provided).</li>
        </ul>
      </section>

      {/* Car Services */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Car Services</h2>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>Airport Pick-up</li>
          <li>Airport Drop-off</li>
          <li>Full Day In-City Car Hire Service</li>
        </ul>
      </section>
    </main>
  );
}
