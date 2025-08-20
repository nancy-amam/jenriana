'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle } from 'lucide-react';

export default function PaymentSuccessPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/');
    }, 5000); // Redirect to homepage after 5 seconds

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f9fafb] px-4 text-center">
      <CheckCircle className="w-16 h-16 text-green-600 mb-4" />
      <h1 className="text-2xl font-semibold text-gray-800 mb-2">Payment Successful</h1>
      <p className="text-gray-600 max-w-md mb-6">
        Your payment was successful, and your booking has been confirmed. You’ll receive an email with the booking details shortly.
      </p>
      <p className="text-sm text-gray-500">Redirecting to homepage...</p>
    </div>
  );
}
