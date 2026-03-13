"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useRouter } from "next/navigation";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

export default function PartnerLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${BASE_URL}/api/auth/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        if (res.status === 401) {
          setError("Invalid email or password.");
        } else {
          setError(data?.message || data?.error || "Something went wrong.");
        }
        return;
      }

      if (data.user) {
        localStorage.setItem("userId", data.user.id);
        localStorage.setItem("userRole", data.user.role);
      }

      if (data.user?.role !== "partner") {
        setError("Only partners can log in here. Use the main site to sign in.");
        return;
      }

      setEmail("");
      setPassword("");
      router.push("/partner");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col-reverse md:flex-row ">
      <div className="flex flex-col items-center justify-center p-8 md:p-16 w-full md:w-4/10">
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
          <h1 className="text-xl md:text-[30px] font-normal text-[#111827] mb-1 md:mb-2">Partner login</h1>
          <p className="text-sm md:text-base text-[#4b5563] mb-6 md:mb-8">
            Sign in with your partner account to access your dashboard and earnings.
          </p>

          <form className="flex flex-col space-y-3 md:space-y-4 text-left" onSubmit={handleSubmit}>
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

            <div className="relative">
              <label htmlFor="password" className="block text-xs md:text-sm font-normal text-[#374151] mb-1">
                Password
              </label>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
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

            {error && (
              <p className="text-red-500 text-xs md:text-sm text-center" role="alert">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-[48px] md:h-[58px] bg-[#212121] text-white rounded-lg hover:bg-gray-800 transition text-sm md:text-base font-normal mt-4 md:mt-6 disabled:opacity-70"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="text-[#4b5566] mt-3 md:mt-4 text-xs md:text-sm">
            First time?{" "}
            <Link href="/partner/auth/set-password" className="text-[#111827] hover:underline font-medium">
              Set up your password
            </Link>
          </p>
          <p className="text-[#4b5566] mt-1 md:mt-2 text-xs md:text-sm">
            Not a partner?{" "}
            <Link href="/login" className="text-[#111827] hover:underline font-medium">
              Log in to the main site
            </Link>
          </p>
        </div>
      </div>

      <div className="relative w-full md:w-6/10 h-[200px] md:h-screen overflow-hidden flex-shrink-0">
        <Image
          src="/images/partner-login-img.png"
          alt="Partner login"
          fill
          className="object-cover object-top"
          priority
        />
      </div>
    </div>
  );
}
