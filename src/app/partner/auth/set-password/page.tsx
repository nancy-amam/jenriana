"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useRouter } from "next/navigation";

type Step = 1 | 2 | 3;

export default function PartnerSetPasswordPage() {
  const [step, setStep] = useState<Step>(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // TODO: call API to send OTP to email
      // await fetch('/api/partner/send-otp', { method: 'POST', body: JSON.stringify({ email }) });
      setStep(2);
    } catch {
      setError("Could not send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // TODO: call API to verify OTP
      // await fetch('/api/partner/verify-otp', { method: 'POST', body: JSON.stringify({ email, otp }) });
      setStep(3);
    } catch {
      setError("Invalid or expired OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    setLoading(true);
    try {
      // TODO: call API to set password
      // await fetch('/api/partner/set-password', { method: 'POST', body: JSON.stringify({ email, otp, password }) });
      setSuccess(true);
      setTimeout(() => router.push("/partner/auth/login"), 2000);
    } catch {
      setError("Could not set password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col-reverse md:flex-row">
        <div className="flex flex-col items-center justify-start md:justify-center p-6 md:p-16 w-full md:w-4/10">
          <div className="w-full max-w-[448px] mx-auto text-center">
            <Link href="/" className="inline-block mb-6 md:mb-8">
              <Image
                src="/images/logo.png"
                alt="Jenriana"
                width={120}
                height={36}
                priority
                className="w-[100px] h-auto md:w-[120px]"
              />
            </Link>
            <h1 className="text-xl md:text-[30px] font-normal text-[#111827] mb-1 md:mb-2">Password set</h1>
            <p className="text-sm md:text-base text-[#4b5563] mb-4 md:mb-6">
              Your partner account is ready. Redirecting you to sign in…
            </p>
            <Link href="/partner/auth/login" className="text-[#111827] hover:underline font-medium">
              Sign in now
            </Link>
          </div>
        </div>
        <div className="relative w-full md:w-6/10 h-[200px] md:h-screen overflow-hidden flex-shrink-0">
          <Image src="/images/partner-login-img.png" alt="Partner" fill className="object-cover object-top" priority />
        </div>
      </div>
    );
  }

  const steps = [
    { num: 1, label: "Email" },
    { num: 2, label: "Verify" },
    { num: 3, label: "Password" },
  ];

  return (
    <div className="flex flex-col-reverse md:flex-row">
      <div className="flex flex-col items-center justify-start md:justify-center p-6 md:p-16 w-full md:w-4/10">
        <div className="w-full max-w-[448px] mx-auto text-center">
          <Link href="/" className="inline-block mb-6 md:mb-8">
            <Image
              src="/images/logo.png"
              alt="Jenriana"
              width={120}
              height={36}
              priority
              className="w-[100px] h-auto md:w-[120px]"
            />
          </Link>
          <h1 className="text-xl md:text-[30px] font-normal text-[#111827] mb-1 md:mb-2">
            Set up your partner account
          </h1>
          <div
            className="flex items-center justify-center gap-1.5 md:gap-2 mb-4 md:mb-6"
            aria-label={`Step ${step} of 3`}
          >
            {steps.map((s) => (
              <div key={s.num} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-7 h-7 md:w-8 md:h-8 rounded-full text-xs md:text-sm font-medium transition-colors ${
                    step >= s.num ? "bg-[#212121] text-white" : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {s.num}
                </div>
                {s.num < 3 && (
                  <div
                    className={`w-6 md:w-8 h-0.5 mx-0.5 transition-colors ${
                      step > s.num ? "bg-[#212121]" : "bg-gray-200"
                    }`}
                    aria-hidden
                  />
                )}
              </div>
            ))}
          </div>
          <p className="text-xs md:text-sm text-[#6b7280] mb-4 md:mb-6">
            Step {step} of 3 — {steps[step - 1].label}
          </p>
          <p className="text-sm md:text-base text-[#4b5563] mb-4 md:mb-6">
            {step === 1 &&
              "Enter the email address your admin used to create your partner account. We'll send you a one-time code to confirm it."}
            {step === 2 && "Enter the 6-digit code we sent to your email."}
            {step === 3 && "Create a password to sign in to your partner dashboard."}
          </p>

          {step === 1 && (
            <form className="flex flex-col space-y-3 md:space-y-4 text-left" onSubmit={handleSendOtp}>
              <div>
                <label htmlFor="email" className="block text-xs md:text-sm font-normal text-[#374151] mb-1">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full h-[48px] md:h-[58px] rounded-lg border border-gray-300 px-3 md:px-4 py-2 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
              {error && (
                <p className="text-red-500 text-xs md:text-sm" role="alert">
                  {error}
                </p>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-[48px] md:h-[58px] bg-[#212121] text-white rounded-lg hover:bg-gray-800 transition text-sm md:text-base font-normal mt-4 md:mt-6 disabled:opacity-70"
              >
                {loading ? "Sending…" : "Send OTP"}
              </button>
            </form>
          )}

          {step === 2 && (
            <form className="flex flex-col space-y-3 md:space-y-4 text-left" onSubmit={handleVerifyOtp}>
              <div>
                <label htmlFor="otp" className="block text-xs md:text-sm font-normal text-[#374151] mb-1">
                  Verification code
                </label>
                <input
                  id="otp"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  placeholder="000000"
                  required
                  className="w-full h-[48px] md:h-[58px] rounded-lg border border-gray-300 px-3 md:px-4 py-2 text-sm md:text-base text-center tracking-[0.35em] md:tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-black"
                />
                <p className="text-xs md:text-sm text-[#6b7280] mt-1">
                  Code sent to <span className="font-medium text-[#374151]">{email}</span>
                </p>
              </div>
              {error && (
                <p className="text-red-500 text-xs md:text-sm" role="alert">
                  {error}
                </p>
              )}
              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full h-[48px] md:h-[58px] bg-[#212121] text-white rounded-lg hover:bg-gray-800 transition text-sm md:text-base font-normal mt-4 md:mt-6 disabled:opacity-70"
              >
                {loading ? "Verifying…" : "Verify OTP"}
              </button>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-xs md:text-sm text-[#4b5566] hover:underline"
              >
                Use a different email
              </button>
            </form>
          )}

          {step === 3 && (
            <form className="flex flex-col space-y-3 md:space-y-4 text-left" onSubmit={handleCreatePassword}>
              <div className="relative">
                <label htmlFor="password" className="block text-xs md:text-sm font-normal text-[#374151] mb-1">
                  New password
                </label>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  required
                  minLength={8}
                  className="w-full h-[48px] md:h-[58px] rounded-lg border border-gray-300 px-3 md:px-4 py-2 pr-10 md:pr-12 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-black"
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-[42px] md:top-[55px] -translate-y-1/2 cursor-pointer text-gray-500"
                  aria-hidden
                >
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </span>
              </div>
              <div className="relative">
                <label htmlFor="confirmPassword" className="block text-xs md:text-sm font-normal text-[#374151] mb-1">
                  Confirm password
                </label>
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  required
                  minLength={8}
                  className="w-full h-[48px] md:h-[58px] rounded-lg border border-gray-300 px-3 md:px-4 py-2 pr-10 md:pr-12 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-black"
                />
                <span
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-[42px] md:top-[55px] -translate-y-1/2 cursor-pointer text-gray-500"
                  aria-hidden
                >
                  {showConfirmPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </span>
              </div>
              {error && (
                <p className="text-red-500 text-xs md:text-sm" role="alert">
                  {error}
                </p>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-[48px] md:h-[58px] bg-[#212121] text-white rounded-lg hover:bg-gray-800 transition text-sm md:text-base font-normal mt-4 md:mt-6 disabled:opacity-70"
              >
                {loading ? "Creating…" : "Create password"}
              </button>
              <button
                type="button"
                onClick={() => setStep(2)}
                className="text-xs md:text-sm text-[#4b5566] hover:underline"
              >
                Back to verification
              </button>
            </form>
          )}

          <p className="text-[#4b5566] mt-4 md:mt-6 text-xs md:text-sm">
            Already have a password?{" "}
            <Link href="/partner/auth/login" className="text-[#111827] hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>

      <div className="relative w-full md:w-6/10 h-[200px] md:h-screen overflow-hidden flex-shrink-0">
        <Image src="/images/partner-login-img.png" alt="Partner" fill className="object-cover object-top" priority />
      </div>
    </div>
  );
}
