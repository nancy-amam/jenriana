'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import { verifyPayment } from '@/services/api-services';

// Force dynamic rendering to avoid static generation issues
export const dynamic = 'force-dynamic';

function PaymentSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reference = searchParams.get('reference') || searchParams.get('trxref');
  const bookingId = searchParams.get('bookingId');
  const [status, setStatus] = useState<'success' | 'pending' | 'error' | 'loading'>('loading');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [debugLogs, setDebugLogs] = useState<string[]>([]); // Store logs for HTML display

  useEffect(() => {
    // Log initial page load and URL
    setDebugLogs((prev) => [
      ...prev,
      `Page loaded at: ${new Date().toLocaleString('en-US', { timeZone: 'Africa/Lagos' })}`,
      `Current URL: ${window.location.href}`,
      `Query params: reference=${reference || 'null'}, trxref=${searchParams.get('trxref') || 'null'}, bookingId=${bookingId || 'null'}`,
    ]);

    // Handle payment verification
    const verifyPaymentAndUpdate = async () => {
      if (reference && bookingId) {
        setDebugLogs((prev) => [...prev, `Calling verifyPayment with reference: ${reference}, bookingId: ${bookingId}`]);
        try {
          const response = await verifyPayment(reference, bookingId);
          setDebugLogs((prev) => [...prev, `verifyPayment response: ${JSON.stringify(response, null, 2)}`]);
          if (response.message === 'Payment successful, booking confirmed') {
            setStatus('success');
            setDebugLogs((prev) => [...prev, 'Verification successful']);
          } else {
            setStatus('error');
            setErrorMessage('Payment verification failed. Please contact support.');
            setDebugLogs((prev) => [...prev, `Verification failed: ${JSON.stringify(response, null, 2)}`]);
            console.error('PaymentSuccessPage: Verification failed:', response);
          }
        } catch (err: any) {
          console.error('PaymentSuccessPage: Failed to verify payment:', err);
          setStatus('error');
          setErrorMessage('Failed to verify payment. Please try again or contact support.');
          setDebugLogs((prev) => [...prev, `Verification error: ${err.message || 'Unknown error'}`]);
        }
      } else {
        // Assume pending for bank transfers if no reference
        setStatus('pending');
        setErrorMessage('Your payment is being processed. We’ll confirm your booking soon.');
        setDebugLogs((prev) => [
          ...prev,
          `Skipped verifyPayment: No reference or bookingId. Reference: ${reference || 'null'}, BookingId: ${bookingId || 'null'}`,
        ]);
      }
    };

    verifyPaymentAndUpdate();

    // Redirect after 10 seconds
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
  }, [router, reference, bookingId, searchParams]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f9fafb] px-4 text-center">
      {status === 'loading' && (
        <>
          <Loader2 className="w-16 h-16 text-gray-600 animate-spin mb-4" />
          <h1 className="text-2xl font-semibold text-gray-800 mb-2">Verifying Payment</h1>
          <p className="text-gray-600 max-w-md mb-6">
            Please wait while we verify your payment.
          </p>
        </>
      )}
      {status === 'success' && (
        <>
          <CheckCircle className="w-16 h-16 text-green-600 mb-4" />
          <h1 className="text-2xl font-semibold text-gray-800 mb-2">Payment Successful</h1>
          <p className="text-gray-600 max-w-md mb-6">
            Your payment was successful, and your booking has been confirmed. You’ll receive an email with the booking details shortly.
          </p>
        </>
      )}
      {status === 'pending' && (
        <>
          <Loader2 className="w-16 h-16 text-blue-600 mb-4" />
          <h1 className="text-2xl font-semibold text-gray-800 mb-2">Payment Initiated</h1>
          <p className="text-gray-600 max-w-md mb-6">
            Your payment is being processed. Your booking will be confirmed once the payment is verified. You’ll receive an email with the booking details shortly.
          </p>
        </>
      )}
      {status === 'error' && (
        <>
          <AlertCircle className="w-16 h-16 text-red-600 mb-4" />
          <h1 className="text-2xl font-semibold text-gray-800 mb-2">Payment Verification Failed</h1>
          <p className="text-gray-600 max-w-md mb-6">
            {errorMessage}
          </p>
        </>
      )}
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
      {/* Debug logs visible in HTML */}
      {debugLogs.length > 0 && (
        <div className="mt-6 text-left text-sm text-gray-800 bg-white p-4 rounded-md max-w-md w-full">
          <h3 className="font-semibold mb-2">Debug Logs</h3>
          <ul className="list-disc pl-5">
            {debugLogs.map((log, index) => (
              <li key={index} className="break-words">
                {log}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#f9fafb] px-4 text-center">
          <Loader2 className="w-16 h-16 text-gray-600 animate-spin mb-4" />
          <h1 className="text-2xl font-semibold text-gray-800 mb-2">Loading...</h1>
          <p className="text-gray-600 max-w-md mb-6">
            Please wait while we process your request.
          </p>
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}