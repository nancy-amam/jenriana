"use client";

import { useEffect, useState } from "react";
import { getAllCoupons, deleteCoupon, toggleCoupon } from "@/services/api-services";
import { Loader2, Trash2, ToggleLeft, ToggleRight, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import CreateCouponModal from "./create-coupon-modal";
import { toast } from "sonner";

export default function CouponsAdminPage() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState(false);

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const res = await getAllCoupons();
      setCoupons(res.coupons || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleDelete = async (id: string) => {
    setProcessingId(id);
    const answer = confirm("Are you sure you want to delete this coupon?");
    if (!answer) {
      setProcessingId(null);
      return;
    }
    try {
      await deleteCoupon(id);
      setCoupons((prev) => prev.filter((c) => c._id !== id));
    } finally {
      setProcessingId(null);
      toast.success("Coupon deleted successfully");
    }
  };

  const handleToggle = async (id: string) => {
    setProcessingId(id);
    try {
      const res = await toggleCoupon(id);
      setCoupons((prev) => prev.map((c) => (c._id === id ? res.coupon : c)));
    } finally {
      setProcessingId(null);
      toast.success("Coupon status updated successfully");
    }
  };

  const total = coupons.length;
  const used = coupons.filter((c) => c.isUsed).length;
  const available = coupons.filter((c) => !c.isUsed && c.isUsable).length;
  const disabled = coupons.filter((c) => !c.isUsable).length;

  return (
    <div className="py-10">
      <div className="flex flex-wrap justify-between items-center mb-10 gap-3">
        {/* <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xl font-semibold text-[#1e1e1e]"
        >
          Coupon Management
        </motion.h1> */}

        <motion.button
          onClick={() => setOpenModal(true)}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          whileTap={{ scale: 0.96 }}
          className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-xl shadow text-xs hover:bg-opacity-90 transition"
        >
          <Plus className="h-4 w-4" />
          New Coupon
        </motion.button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-white p-6 border border-black/10"
        >
          <p className="text-gray-500 text-xs">Total Coupons</p>
          <p className="text-xl font-semibold">{total}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-white p-6 border border-black/10"
        >
          <p className="text-gray-500 text-xs">Used</p>
          <p className="text-xl font-semibold text-red-600">{used}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-white p-6 border border-black/10"
        >
          <p className="text-gray-500 text-xs">Available</p>
          <p className="text-xl font-semibold text-green-600">{available}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-white p-6 border border-black/10"
        >
          <p className="text-gray-500 text-xs">Disabled</p>
          <p className="text-xl font-semibold text-yellow-600">{disabled}</p>
        </motion.div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-neutral-800" />
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="overflow-x-auto bg-white rounded-2xl border border-black/10"
        >
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr className="text-left text-gray-500 text-xs uppercase tracking-wide">
                <th className="p-4">Code</th>
                <th className="p-4">Discount</th>
                <th className="p-4">Status</th>
                <th className="p-4">Usable</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>

            <tbody>
              <AnimatePresence>
                {coupons.map((c) => (
                  <motion.tr
                    key={c._id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="p-4 font-medium">{c.code}</td>
                    <td className="p-4">{c.discount}%</td>

                    <td className="p-4">
                      {c.isUsed ? (
                        <span className="px-3 py-1 rounded-full bg-red-100 text-red-600 text-xs">Used</span>
                      ) : (
                        <span className="px-3 py-1 rounded-full bg-green-100 text-green-600 text-xs">Not Used</span>
                      )}
                    </td>

                    <td className="p-4">
                      {c.isUsable ? (
                        <span className="px-3 py-1 rounded-full bg-green-100 text-green-600 text-xs">Active</span>
                      ) : (
                        <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-600 text-xs">Disabled</span>
                      )}
                    </td>

                    <td className="p-4 flex items-center gap-4">
                      <motion.button
                        whileTap={{ scale: 0.92 }}
                        onClick={() => handleToggle(c._id)}
                        disabled={processingId === c._id}
                        className="text-blue-600 hover:text-blue-800 transition"
                      >
                        {c.isUsable ? <ToggleRight className="h-5 w-5" /> : <ToggleLeft className="h-5 w-5" />}
                      </motion.button>

                      {!c.isUsed && (
                        <motion.button
                          whileTap={{ scale: 0.92 }}
                          onClick={() => handleDelete(c._id)}
                          disabled={processingId === c._id}
                          className="text-red-600 hover:text-red-800 transition"
                        >
                          <Trash2 className="h-5 w-5" />
                        </motion.button>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>

              {coupons.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-gray-500">
                    No coupons available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </motion.div>
      )}

      <CreateCouponModal
        open={openModal}
        onClose={() => {
          setOpenModal(false);
          fetchCoupons();
        }}
      />
    </div>
  );
}
