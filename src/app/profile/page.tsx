"use client";

import { useEffect, useState } from "react";
import { getProfile, updateProfile } from "@/services/api-services";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [user, setUser] = useState<any>(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    dateOfBirth: "",
    membershipTier: "Silver",
  });

  const fetchProfile = async () => {
    try {
      const res = await getProfile();
      const u = res.user;

      setUser({
        ...u,
        userId: u._id.slice(-7),
      });

      setFormData({
        firstName: u.firstName,
        lastName: u.lastName,
        phone: u.phone,
        dateOfBirth: u.dateOfBirth ? u.dateOfBirth.split("T")[0] : "",
        membershipTier: u.membershipTier || "Silver",
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
    e.preventDefault();
    try {
      setSaving(true);
      await updateProfile(formData as any);
      setSaving(false);
      toast.success("Profile updated successfully");
      fetchProfile();
    } catch (error) {
      console.log(error);
      toast.error("Failed to update profile");
      setSaving(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="flex justify-center items-center min-h-screen text-lg text-gray-600">Loading profile...</div>
    );
  }

  return (
    <div className="px-0 md:px-16 lg:py-12 bg-[#f1f1f1] min-h-screen">
      <div className="max-w-xl mx-auto bg-white p-8 border-t border-black/20 lg:rounded-xl shadow-sm">
        <h1 className="text-2xl font-semibold text-[#1e1e1e] mb-6">My Profile</h1>

        <div className="mb-4 p-3 rounded-lg bg-black/5 text-sm text-[#333]">
          User ID: <span className="font-semibold">{user.userId}</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-1 text-sm text-gray-700">First Name</label>
            <input
              id="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full h-[52px] border border-black/20 rounded-lg px-4"
              type="text"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm text-gray-700">Last Name</label>
            <input
              id="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full h-[52px] border border-black/20 rounded-lg px-4"
              type="text"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm text-gray-700">Phone Number</label>
            <input
              id="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full h-[52px] border border-black/20 rounded-lg px-4"
              type="text"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm text-gray-700">Date of Birth</label>
            <input
              id="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              className="w-full h-[52px] border border-black/20 rounded-lg px-4"
              type="date"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm text-gray-700">Membership Tier</label>
            <select
              id="membershipTier"
              value={formData.membershipTier}
              onChange={handleChange}
              className="w-full h-[52px] border border-black/20 rounded-lg px-4"
            >
              <option value="Silver">Silver</option>
              <option value="Gold">Gold</option>
              <option value="VIP">VIP</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 text-sm text-gray-700">Email Address</label>
            <input
              value={user.email}
              disabled
              className="w-full h-[52px] border border-black/20 rounded-lg px-4 bg-gray-100 text-gray-600"
              type="email"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm text-gray-700">Membership Number</label>
            <input
              value={user.membershipNumber || "—"}
              disabled
              className="w-full h-[52px] border border-black/20 rounded-lg px-4 bg-gray-100 text-gray-600"
              type="text"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm text-gray-700">Total Bookings</label>
            <input
              value={user.totalBookings}
              disabled
              className="w-full h-[52px] border border-black/20 rounded-lg px-4 bg-gray-100 text-gray-600"
              type="text"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full h-[52px] bg-black text-white rounded-lg hover:bg-gray-800"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}
