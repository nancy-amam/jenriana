'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, Loader2 } from 'lucide-react';

export default function PaymentSuccessPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect after 5 seconds
    const timer = setTimeout(() => {
      router.replace('/');
    }, 10000);

    // Prevent back navigation
    window.history.pushState(null, '', window.location.href);
    const handlePopState = () => {
      window.history.pushState(null, '', window.location.href);
    };
    window.addEventListener('popstate', handlePopState);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f9fafb] px-4 text-center">
      <CheckCircle className="w-16 h-16 text-green-600 mb-4" />
      <h1 className="text-2xl font-semibold text-gray-800 mb-2">Payment Successful</h1>
      <p className="text-gray-600 max-w-md mb-6">
        Your payment was successful, and your booking has been confirmed. You’ll receive an email with the booking details shortly.
      </p>

      <div className="flex items-center gap-2 text-gray-600 text-sm mb-4">
        <Loader2 className="animate-spin w-4 h-4" />
        <span>Redirecting to homepage...</span>
      </div>

      <button
        onClick={() => router.replace('/')}
        className="text-blue-600 hover:underline text-sm"
      >
        Go to homepage now
      </button>
    </div>
  );
}
