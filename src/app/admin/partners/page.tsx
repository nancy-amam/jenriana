"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Plus,
  Handshake,
  Mail,
  Phone,
  DollarSign,
  CheckCircle2,
  Clock,
  ChevronRight,
  X,
} from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAdminPartners, adminKeys } from "@/hooks/use-admin-api";
import { PulseTableRows } from "@/components/ui/pulse-loader";
import { toast } from "sonner";

interface Partner {
  _id: string;
  fullname: string;
  email: string;
  phone: string;
  createdAt: string;
  totalEarnings: number;
  totalPaid: number;
  totalPending: number;
}

export default function AdminPartnersPage() {
  const queryClient = useQueryClient();
  const { data: partners = [], isLoading, isError } = useAdminPartners();
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [markingPaidId, setMarkingPaidId] = useState<string | null>(null);

  const [addEmail, setAddEmail] = useState("");
  const [addFirstName, setAddFirstName] = useState("");
  const [addLastName, setAddLastName] = useState("");
  const [addPhone, setAddPhone] = useState("");
  const [addPassword, setAddPassword] = useState("");

  const addPartnerMutation = useMutation({
    mutationFn: async (body: {
      email: string;
      firstName?: string;
      lastName?: string;
      phone?: string;
      password?: string;
    }) => {
      const res = await fetch("/api/admin/partners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create partner");
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.partners });
      toast.success("Partner created successfully");
      setAddModalOpen(false);
      setAddEmail("");
      setAddFirstName("");
      setAddLastName("");
      setAddPhone("");
      setAddPassword("");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const handleAddPartner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addEmail.trim()) {
      toast.error("Email is required");
      return;
    }
    addPartnerMutation.mutate({
      email: addEmail.trim(),
      firstName: addFirstName.trim() || undefined,
      lastName: addLastName.trim() || undefined,
      phone: addPhone.trim() || undefined,
      password: addPassword.trim() || undefined,
    });
  };

  const handleMarkPaid = async (partnerId: string) => {
    setMarkingPaidId(partnerId);
    try {
      const res = await fetch(`/api/admin/partners/${partnerId}/mark-paid`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({}),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to mark as paid");
      toast.success(`${data.updatedCount ?? 0} payout(s) marked as paid`);
      queryClient.invalidateQueries({ queryKey: adminKeys.partners });
    } catch (err: any) {
      toast.error(err.message || "Failed to mark payouts");
    } finally {
      setMarkingPaidId(null);
    }
  };

  const formatMoney = (n: number) =>
    new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(n);

  if (isError && partners.length === 0) {
    return (
      <div className="p-4 sm:p-6 bg-white min-h-screen flex items-center justify-center">
        <div className="text-lg text-red-600">Error loading partners. Try again later.</div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 bg-white min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-xl font-semibold text-slate-900">Partners</h1>
        <button
          type="button"
          onClick={() => setAddModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition"
        >
          <Plus className="w-4 h-4" />
          Add partner
        </button>
      </div>

      {isLoading && partners.length === 0 ? (
        <div className="rounded-xl border border-black/10 bg-white overflow-hidden">
          <div className="h-12 bg-slate-50 animate-pulse" />
          <div className="p-4">
            <PulseTableRows rows={6} />
          </div>
        </div>
      ) : (
        <>
          <div className="hidden lg:block w-full overflow-hidden rounded-xl border border-black/10 bg-white">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-gray-200">
                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                      Partner
                    </th>
                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                      Contact
                    </th>
                    <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-600">
                      Total earnings
                    </th>
                    <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-600">
                      Paid
                    </th>
                    <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-600">
                      Pending
                    </th>
                    <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-600">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {partners.map((p) => (
                    <tr key={p._id} className="transition-colors hover:bg-slate-50/50">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center">
                            <Handshake className="w-4 h-4 text-indigo-600" />
                          </div>
                          <span className="text-sm font-medium text-slate-900">{p.fullname}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="text-sm text-slate-600 space-y-0.5">
                          <div className="flex items-center gap-1.5">
                            <Mail className="w-3.5 h-3.5 text-slate-400" />
                            {p.email}
                          </div>
                          {p.phone && (
                            <div className="flex items-center gap-1.5">
                              <Phone className="w-3.5 h-3.5 text-slate-400" />
                              {p.phone}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-4 text-right text-sm font-medium text-slate-900">
                        {formatMoney(p.totalEarnings)}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <span className="inline-flex items-center gap-1 text-sm text-emerald-600">
                          <CheckCircle2 className="w-4 h-4" />
                          {formatMoney(p.totalPaid)}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <span className="inline-flex items-center gap-1 text-sm text-amber-600">
                          <Clock className="w-4 h-4" />
                          {formatMoney(p.totalPending)}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {p.totalPending > 0 && (
                            <button
                              type="button"
                              disabled={markingPaidId === p._id}
                              onClick={() => handleMarkPaid(p._id)}
                              className="text-xs font-medium text-indigo-600 hover:text-indigo-700 disabled:opacity-50"
                            >
                              {markingPaidId === p._id ? "Marking…" : "Mark paid"}
                            </button>
                          )}
                          <Link
                            href={`/admin/partners/${p._id}`}
                            className="inline-flex items-center gap-1 text-sm font-medium text-slate-700 hover:text-indigo-600"
                          >
                            View
                            <ChevronRight className="w-4 h-4" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="lg:hidden space-y-4 mt-4">
            {partners.map((p) => (
              <div key={p._id} className="bg-white rounded-xl border border-black/10 p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                    <Handshake className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-slate-900">{p.fullname}</p>
                    <p className="text-sm text-slate-600 flex items-center gap-1 mt-0.5">
                      <Mail className="w-3.5 h-3.5" />
                      {p.email}
                    </p>
                    {p.phone && (
                      <p className="text-sm text-slate-600 flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5" />
                        {p.phone}
                      </p>
                    )}
                    <div className="mt-3 flex flex-wrap gap-2 text-xs">
                      <span className="text-slate-500">
                        <DollarSign className="w-3 h-3 inline mr-0.5" />
                        Earnings: {formatMoney(p.totalEarnings)}
                      </span>
                      <span className="text-emerald-600">Paid: {formatMoney(p.totalPaid)}</span>
                      <span className="text-amber-600">Pending: {formatMoney(p.totalPending)}</span>
                    </div>
                    <div className="mt-3 flex gap-2">
                      {p.totalPending > 0 && (
                        <button
                          type="button"
                          disabled={markingPaidId === p._id}
                          onClick={() => handleMarkPaid(p._id)}
                          className="text-xs font-medium text-indigo-600"
                        >
                          {markingPaidId === p._id ? "Marking…" : "Mark paid"}
                        </button>
                      )}
                      <Link
                        href={`/admin/partners/${p._id}`}
                        className="text-sm font-medium text-indigo-600 flex items-center gap-0.5"
                      >
                        View detail
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {partners.length === 0 && !isLoading && (
        <div className="w-full rounded-xl border border-black/10 bg-white p-12 text-center">
          <Handshake className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 text-sm">No partners yet.</p>
          <button
            type="button"
            onClick={() => setAddModalOpen(true)}
            className="mt-3 text-indigo-600 text-sm font-medium hover:underline"
          >
            Add your first partner
          </button>
        </div>
      )}

      {/* Add Partner Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-slate-900">Add partner</h2>
              <button
                type="button"
                onClick={() => setAddModalOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100 text-slate-500"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <form onSubmit={handleAddPartner} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email *</label>
                <input
                  type="email"
                  value={addEmail}
                  onChange={(e) => setAddEmail(e.target.value)}
                  className="w-full h-11 rounded-lg border border-gray-300 px-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="partner@example.com"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">First name</label>
                  <input
                    type="text"
                    value={addFirstName}
                    onChange={(e) => setAddFirstName(e.target.value)}
                    className="w-full h-11 rounded-lg border border-gray-300 px-3 text-sm focus:ring-2 focus:ring-indigo-500"
                    placeholder="First"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Last name</label>
                  <input
                    type="text"
                    value={addLastName}
                    onChange={(e) => setAddLastName(e.target.value)}
                    className="w-full h-11 rounded-lg border border-gray-300 px-3 text-sm focus:ring-2 focus:ring-indigo-500"
                    placeholder="Last"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                <input
                  type="text"
                  value={addPhone}
                  onChange={(e) => setAddPhone(e.target.value)}
                  className="w-full h-11 rounded-lg border border-gray-300 px-3 text-sm focus:ring-2 focus:ring-indigo-500"
                  placeholder="Optional"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Password (optional)</label>
                <input
                  type="password"
                  value={addPassword}
                  onChange={(e) => setAddPassword(e.target.value)}
                  className="w-full h-11 rounded-lg border border-gray-300 px-3 text-sm focus:ring-2 focus:ring-indigo-500"
                  placeholder="Leave blank for default"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="flex-1 py-2.5 rounded-lg border border-gray-300 text-slate-700 text-sm font-medium hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addPartnerMutation.isPending}
                  className="flex-1 py-2.5 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
                >
                  {addPartnerMutation.isPending ? "Creating…" : "Create partner"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
