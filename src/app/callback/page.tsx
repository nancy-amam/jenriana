"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function GoogleCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const code = searchParams.get("code");
    if (!code) return;

    const handleGoogleAuth = async () => {
      try {
        const res = await fetch(`/api/auth/google/callback?code=${code}`);
        const data = await res.json();

        if (data.user) {
          localStorage.setItem("userId", data.user.id);
          localStorage.setItem("userRole", data.user.role);
        }
        if (data.user?.role === "admin") router.push("/admin");
        else router.push("/");
      } catch (err) {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    handleGoogleAuth();
  }, [searchParams, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="flex flex-col items-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-black" />
        <p className="mt-4 text-gray-600 text-sm">Signing you in...</p>
      </div>
    </div>
  );
}
