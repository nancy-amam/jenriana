"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Handshake,
  Mail,
  Phone,
  DollarSign,
  CheckCircle2,
  Clock,
  Home,
  Receipt,
  MapPin,
  Calendar,
} from "lucide-react";
import AdminContentLoader from "../../components/admin-content-loader";
import { toast } from "sonner";

interface PartnerDetail {
  _id: string;
  fullname: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  createdAt: string;
  totalEarnings: number;
  totalPaid: number;
  totalPending: number;
}

interface ApartmentSummary {
  _id: string;
  name: string;
  location: string;
  address?: string;
  pricePerNight: number;
  status: string;
}

interface BookingRow {
  _id: string;
  bookingCode: string;
  apartmentName: string;
  apartmentLocation: string;
  totalAmount: number;
  commission: number;
  net: number;
  partnerPayoutStatus: string;
  partnerPaidAt: string | null;
  checkInDate: string;
  checkOutDate: string;
  createdAt: string;
}

export default function AdminPartnerDetailPage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : "";
  const [partner, setPartner] = useState<PartnerDetail | null>(null);
  const [apartments, setApartments] = useState<ApartmentSummary[]>([]);
  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [markingPaid, setMarkingPaid] = useState(false);
  const [selectedBookingIds, setSelectedBookingIds] = useState<Set<string>>(new Set());

  const fetchDetail = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/admin/partners/${id}`, { credentials: "include" });
      if (!res.ok) {
        if (res.status === 404) throw new Error("Partner not found");
        if (res.status === 403) throw new Error("Forbidden");
        throw new Error("Failed to load partner");
      }
      const data = await res.json();
      setPartner(data.partner ?? null);
      setApartments(data.apartments ?? []);
      setBookings(data.bookings ?? []);
    } catch (err: any) {
      setError(err.message || "Failed to load partner");
      setPartner(null);
      setApartments([]);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  const pendingBookings = bookings.filter((b) => b.partnerPayoutStatus !== "paid");
  const toggleBookingSelection = (bookingId: string) => {
    setSelectedBookingIds((prev) => {
      const next = new Set(prev);
      if (next.has(bookingId)) next.delete(bookingId);
      else next.add(bookingId);
      return next;
    });
  };
  const selectAllPending = () => {
    setSelectedBookingIds(new Set(pendingBookings.map((b) => b._id)));
  };
  const clearSelection = () => setSelectedBookingIds(new Set());

  const handleMarkPaid = async () => {
    const ids = selectedBookingIds.size > 0 ? Array.from(selectedBookingIds) : undefined;
    if (ids?.length === 0) return;
    setMarkingPaid(true);
    try {
      const res = await fetch(`/api/admin/partners/${id}/mark-paid`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(ids ? { bookingIds: ids } : {}),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to mark as paid");
      toast.success(`${data.updatedCount ?? 0} payout(s) marked as paid`);
      clearSelection();
      fetchDetail();
    } catch (err: any) {
      toast.error(err.message || "Failed to mark payouts");
    } finally {
      setMarkingPaid(false);
    }
  };

  const formatMoney = (n: number) =>
    new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(n);
  const formatDate = (d: string) => (d ? new Date(d).toLocaleDateString("en-NG", { dateStyle: "medium" }) : "—");

  if (!id) {
    return (
      <div className="p-4 sm:p-6 bg-white min-h-screen">
        <p className="text-slate-500">Invalid partner ID.</p>
        <Link href="/admin/partners" className="text-indigo-600 text-sm mt-2 inline-block">
          Back to partners
        </Link>
      </div>
    );
  }

  if (loading && !partner) {
    return (
      <div className="p-4 sm:p-6 bg-white min-h-screen">
        <AdminContentLoader />
      </div>
    );
  }

  if (error && !partner) {
    return (
      <div className="p-4 sm:p-6 bg-white min-h-screen">
        <p className="text-red-600">{error}</p>
        <Link href="/admin/partners" className="text-indigo-600 text-sm mt-2 inline-block">
          Back to partners
        </Link>
      </div>
    );
  }

  if (!partner) {
    return null;
  }

  return (
    <div className="p-4 sm:p-6 bg-white min-h-screen">
      <Link
        href="/admin/partners"
        className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-indigo-600 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to partners
      </Link>

      {/* Partner header */}
      <div className="bg-white rounded-xl border border-black/10 p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
              <Handshake className="w-7 h-7 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-slate-900">{partner.fullname}</h1>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-sm text-slate-600">
                <span className="flex items-center gap-1.5">
                  <Mail className="w-4 h-4 text-slate-400" />
                  {partner.email}
                </span>
                {partner.phone && (
                  <span className="flex items-center gap-1.5">
                    <Phone className="w-4 h-4 text-slate-400" />
                    {partner.phone}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-lg bg-slate-50 p-4">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total earnings</p>
            <p className="text-lg font-semibold text-slate-900 mt-1">{formatMoney(partner.totalEarnings)}</p>
          </div>
          <div className="rounded-lg bg-emerald-50 p-4">
            <p className="text-xs font-medium text-emerald-700 uppercase tracking-wider flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Paid
            </p>
            <p className="text-lg font-semibold text-emerald-800 mt-1">{formatMoney(partner.totalPaid)}</p>
          </div>
          <div className="rounded-lg bg-amber-50 p-4">
            <p className="text-xs font-medium text-amber-700 uppercase tracking-wider flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              Pending
            </p>
            <p className="text-lg font-semibold text-amber-800 mt-1">{formatMoney(partner.totalPending)}</p>
          </div>
        </div>
      </div>

      {/* Apartments */}
      <section className="mb-6">
        <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-2">
          <Home className="w-4 h-4" />
          Apartments ({apartments.length})
        </h2>
        {apartments.length === 0 ? (
          <div className="bg-white rounded-xl border border-black/10 p-8 text-center text-slate-500 text-sm">
            No apartments assigned to this partner. Assign an owner in the apartment edit form.
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {apartments.map((apt) => (
              <div
                key={apt._id}
                className="bg-white rounded-xl border border-black/10 p-4"
              >
                <p className="font-medium text-slate-900">{apt.name}</p>
                <p className="text-sm text-slate-600 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5" />
                  {apt.location}
                </p>
                <p className="text-sm text-slate-500 mt-1">
                  {formatMoney(apt.pricePerNight)}/night · {apt.status}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Bookings / Payouts */}
      <section>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
          <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-2">
            <Receipt className="w-4 h-4" />
            Bookings & payouts ({bookings.length})
          </h2>
          {pendingBookings.length > 0 && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={selectAllPending}
                className="text-sm text-slate-600 hover:text-indigo-600"
              >
                Select all pending
              </button>
              <button
                type="button"
                onClick={handleMarkPaid}
                disabled={markingPaid}
                className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {markingPaid
                  ? "Marking…"
                  : selectedBookingIds.size > 0
                    ? `Mark ${selectedBookingIds.size} paid`
                    : "Mark all pending paid"}
              </button>
            </div>
          )}
        </div>

        {bookings.length === 0 ? (
          <div className="bg-white rounded-xl border border-black/10 p-8 text-center text-slate-500 text-sm">
            No confirmed bookings for this partner’s apartments yet.
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-black/10 bg-white">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px]">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-gray-200">
                    {pendingBookings.length > 0 && (
                      <th className="px-4 py-3 text-left w-10">
                        <span className="sr-only">Select</span>
                      </th>
                    )}
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-600">
                      Booking
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-600">
                      Apartment
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase text-slate-600">
                      Amount
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase text-slate-600">
                      Net
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-600">
                      Payout
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-600">
                      Dates
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {bookings.map((b) => {
                    const isPending = b.partnerPayoutStatus !== "paid";
                    const isSelected = selectedBookingIds.has(b._id);
                    return (
                      <tr key={b._id} className="hover:bg-slate-50/50">
                        {pendingBookings.length > 0 && (
                          <td className="px-4 py-3">
                            {isPending ? (
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => toggleBookingSelection(b._id)}
                                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                              />
                            ) : null}
                          </td>
                        )}
                        <td className="px-4 py-3">
                          <span className="font-mono text-sm text-slate-700">{b.bookingCode}</span>
                          <p className="text-xs text-slate-500">{formatDate(b.createdAt)}</p>
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-700">
                          {b.apartmentName}
                          {b.apartmentLocation && (
                            <span className="block text-xs text-slate-500">{b.apartmentLocation}</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right text-sm text-slate-700">
                          {formatMoney(b.totalAmount)}
                        </td>
                        <td className="px-4 py-3 text-right text-sm font-medium text-slate-900">
                          {formatMoney(b.net)}
                        </td>
                        <td className="px-4 py-3">
                          {b.partnerPayoutStatus === "paid" ? (
                            <span className="inline-flex items-center gap-1 text-sm text-emerald-600">
                              <CheckCircle2 className="w-4 h-4" />
                              Paid {b.partnerPaidAt ? formatDate(b.partnerPaidAt) : ""}
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-sm text-amber-600">
                              <Clock className="w-4 h-4" />
                              Pending
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-600">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {formatDate(b.checkInDate)} → {formatDate(b.checkOutDate)}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
