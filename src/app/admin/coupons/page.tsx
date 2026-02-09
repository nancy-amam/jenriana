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
          className="overflow-hidden rounded-xl border border-gray-200/80 bg-white shadow-sm"
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-[500px]">
              <thead>
                <tr className="bg-slate-50/80 border-b border-gray-200">
                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                    Code
                  </th>
                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                    Discount
                  </th>
                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                    Status
                  </th>
                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                    Usable
                  </th>
                  <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <AnimatePresence>
                  {coupons.map((c) => (
                    <motion.tr
                      key={c._id}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      className="transition-colors hover:bg-slate-50/50"
                    >
                      <td className="px-5 py-4">
                        <span className="font-mono text-sm font-semibold text-slate-900">{c.code}</span>
                      </td>
                      <td className="px-5 py-4 text-sm font-medium text-slate-700">{c.discount}%</td>
                      <td className="px-5 py-4">
                        {c.isUsed ? (
                          <span className="inline-flex items-center rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-medium text-red-700">
                            Used
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
                            Not Used
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        {c.isUsable ? (
                          <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700">
                            Disabled
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <motion.button
                            whileTap={{ scale: 0.92 }}
                            onClick={() => handleToggle(c._id)}
                            disabled={processingId === c._id}
                            className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 disabled:opacity-50 transition"
                            title={c.isUsable ? "Disable" : "Enable"}
                          >
                            {c.isUsable ? <ToggleRight className="h-5 w-5" /> : <ToggleLeft className="h-5 w-5" />}
                          </motion.button>
                          {!c.isUsed && (
                            <motion.button
                              whileTap={{ scale: 0.92 }}
                              onClick={() => handleDelete(c._id)}
                              disabled={processingId === c._id}
                              className="p-2 rounded-lg text-red-600 hover:bg-red-50 disabled:opacity-50 transition"
                              title="Delete"
                            >
                              <Trash2 className="h-5 w-5" />
                            </motion.button>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
                {coupons.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-5 py-12 text-center text-sm text-slate-500">
                      No coupons available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
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
