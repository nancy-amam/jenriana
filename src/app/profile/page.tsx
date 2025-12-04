"use client";

import { useEffect, useState } from "react";
import { getProfile, updateProfile } from "@/services/api-services";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [user, setUser] = useState({
    fullname: "",
    phone: "",
    email: "",
    userId: "",
  });

  const [formData, setFormData] = useState({
    fullname: "",
    phone: "",
  });

  const fetchProfile = async () => {
    try {
      const res = await getProfile();
      const shortId = res.user._id.slice(-7);
      setUser({
        fullname: res.user.fullname,
        phone: res.user.phone,
        email: res.user.email,
        userId: shortId,
      });
      setFormData({
        fullname: res.user.fullname,
        phone: res.user.phone,
      });
    } catch (err) {
      router.push("/login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    try {
      e.preventDefault();
      setSaving(true);
      await updateProfile(formData);
      setSaving(false);
      fetchProfile();
      toast.success("Updated profile successfully");
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-lg text-gray-600">Loading profile...</div>
    );
  }

  return (
    <div className="px-4 md:px-16 py-12 bg-[#f1f1f1] min-h-screen">
      <div className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow-sm">
        <h1 className="text-2xl font-semibold text-[#1e1e1e] mb-6">My Profile</h1>

        <div className="mb-4 p-3 rounded-lg bg-black/5 text-sm text-[#333]">
          User ID: <span className="font-semibold">{user.userId}</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm text-gray-700 mb-1">Full Name</label>
            <input
              id="fullname"
              value={formData.fullname}
              onChange={handleChange}
              className="w-full h-[52px] rounded-lg border border-gray-300 px-4"
              type="text"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">Phone Number</label>
            <input
              id="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full h-[52px] rounded-lg border border-gray-300 px-4"
              type="text"
              placeholder="Enter phone number"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">Email Address</label>
            <input
              value={user.email}
              disabled
              className="w-full h-[52px] rounded-lg border border-gray-200 px-4 bg-gray-100 text-gray-600"
              type="email"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full h-[52px] bg-black text-white rounded-lg text-base hover:bg-gray-800 transition"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}
