"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createCoupon } from "@/services/api-services";
import { toast } from "sonner";

export default function CreateCouponModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [code, setCode] = useState("");
  const [discount, setDiscount] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await createCoupon({ code, discount: Number(discount) });
      setCode("");
      setDiscount("");
      onClose();
    } finally {
      setLoading(false);
      toast.success("Coupon created successfully");
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ y: 30, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 30, opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 240, damping: 22 }}
            className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-[#1e1e1e]">Create Coupon</h2>
              <button onClick={onClose} className="p-2 rounded-full bg-gray-100">
                <X className="h-4 w-4 text-gray-600" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-600">Coupon Code</label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  className="w-full mt-1 h-[50px] rounded-xl border border-gray-300 px-4 text-sm focus:ring-2 focus:ring-black focus:outline-none"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">Discount (%)</label>
                <input
                  type="number"
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
                  className="w-full mt-1 h-[50px] rounded-xl border border-gray-300 px-4 text-sm focus:ring-2 focus:ring-black focus:outline-none"
                />
              </div>

              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-black text-white h-[52px] rounded-xl mt-2 text-sm font-medium hover:bg-opacity-90 transition"
              >
                {loading ? "Creating..." : "Create Coupon"}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
