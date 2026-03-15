"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Receipt,
  ChevronDown,
  Filter,
  Calendar,
  DollarSign,
  Percent,
  CheckCircle2,
  Clock,
  X,
  User,
  MapPin,
  Moon,
  Users,
  Mail,
  Phone,
  CreditCard,
  FileText,
} from "lucide-react";
import { usePartnerTransactions } from "@/hooks/use-partner-api";
import { PulseLoader, PulseCards } from "@/components/ui/pulse-loader";

type PaymentStatus = "pending" | "paid";

interface TransactionRow {
  id: string;
  bookingCode: string;
  date: string;
  apartmentName: string;
  apartmentLocation?: string;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  residentialAddress?: string;
  amount: number;
  commission: number;
  net: number;
  paymentStatus: PaymentStatus;
  paidAt?: string;
  checkInDate: string;
  checkOutDate: string;
  nights: number;
  guests: number;
  paymentMethod?: "card" | "bank";
  specialRequest?: string;
}

const STATUS_OPTIONS: { value: "all" | PaymentStatus; label: string }[] = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "paid", label: "Paid" },
];

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" });
}

function formatDateLong(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-NG", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}

function formatMoney(n: number) {
  return `₦${n.toLocaleString()}`;
}

interface TransactionDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: TransactionRow | null;
}

function TransactionDetailsModal({ isOpen, onClose, transaction }: TransactionDetailsModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen || !transaction) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 transition-opacity duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto transition-transform duration-200 origin-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 flex items-center justify-between border-b border-gray-100 bg-white px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">Transaction details</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="font-mono text-sm font-semibold text-gray-900">{transaction.bookingCode}</span>
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                transaction.paymentStatus === "paid" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
              }`}
            >
              {transaction.paymentStatus === "paid" ? (
                <CheckCircle2 className="w-3.5 h-3.5" />
              ) : (
                <Clock className="w-3.5 h-3.5" />
              )}
              {transaction.paymentStatus === "paid" ? "Paid" : "Pending"}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
            <span className="text-gray-500">Booked on</span>
            <span className="text-gray-900 font-medium">{formatDate(transaction.date)}</span>
            {transaction.paidAt && (
              <>
                <span className="text-gray-500">Paid on</span>
                <span className="text-gray-900">{formatDate(transaction.paidAt)}</span>
              </>
            )}
          </div>

          <div className="rounded-lg bg-gray-50 p-4 space-y-3">
            <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-500" />
              Property
            </h3>
            <p className="font-medium text-gray-900">{transaction.apartmentName}</p>
            {transaction.apartmentLocation && <p className="text-sm text-gray-500">{transaction.apartmentLocation}</p>}
          </div>

          <div className="rounded-lg bg-gray-50 p-4 space-y-3">
            <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <User className="w-4 h-4 text-gray-500" />
              Guest
            </h3>
            <p className="font-medium text-gray-900">{transaction.customerName}</p>
            {transaction.customerEmail && (
              <p className="text-sm text-gray-600 flex items-center gap-2">
                <Mail className="w-4 h-4 shrink-0 text-gray-400" />
                {transaction.customerEmail}
              </p>
            )}
            {transaction.customerPhone && (
              <p className="text-sm text-gray-600 flex items-center gap-2">
                <Phone className="w-4 h-4 shrink-0 text-gray-400" />
                {transaction.customerPhone}
              </p>
            )}
            {transaction.residentialAddress && (
              <p className="text-sm text-gray-600 flex items-start gap-2">
                <MapPin className="w-4 h-4 shrink-0 text-gray-400 mt-0.5" />
                {transaction.residentialAddress}
              </p>
            )}
          </div>

          {transaction.paymentMethod && (
            <div className="rounded-lg bg-gray-50 p-4 flex items-center gap-3">
              <CreditCard className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-900">Payment method</p>
                <p className="text-sm text-gray-600 capitalize">{transaction.paymentMethod}</p>
              </div>
            </div>
          )}

          {transaction.specialRequest && (
            <div className="rounded-lg bg-gray-50 p-4 space-y-2">
              <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-gray-500" />
                Special request
              </h3>
              <p className="text-sm text-gray-600">{transaction.specialRequest}</p>
            </div>
          )}

          <div className="rounded-lg bg-gray-50 p-4 space-y-3">
            <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              Stay period
            </h3>
            <div className="grid gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Check-in</span>
                <span className="text-gray-900 font-medium">{formatDateLong(transaction.checkInDate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Check-out</span>
                <span className="text-gray-900 font-medium">{formatDateLong(transaction.checkOutDate)}</span>
              </div>
              <div className="flex justify-between items-center gap-2 pt-1 border-t border-gray-200">
                <span className="text-gray-500 flex items-center gap-1.5">
                  <Moon className="w-4 h-4" />
                  Nights
                </span>
                <span className="text-gray-900 font-medium">
                  {transaction.nights} {transaction.nights === 1 ? "night" : "nights"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 flex items-center gap-1.5">
                  <Users className="w-4 h-4" />
                  Guests
                </span>
                <span className="text-gray-900 font-medium">
                  {transaction.guests} {transaction.guests === 1 ? "guest" : "guests"}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 p-4 space-y-2">
            <h3 className="text-sm font-semibold text-gray-900">Payment &amp; earnings</h3>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Total amount</span>
              <span className="font-medium text-gray-900">{formatMoney(transaction.amount)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Commission (10%)</span>
              <span className="text-gray-700">{formatMoney(transaction.commission)}</span>
            </div>
            <div className="flex justify-between text-sm pt-2 border-t border-gray-100">
              <span className="text-gray-700 font-medium">Your net</span>
              <span className="font-semibold text-gray-900">{formatMoney(transaction.net)}</span>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 px-6 py-4 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PartnerTransactionsPage() {
  const { data: transactions = [], isLoading, isError } = usePartnerTransactions();
  const [statusFilter, setStatusFilter] = useState<"all" | PaymentStatus>("all");
  const [sortBy, setSortBy] = useState<"date" | "amount" | "net">("date");
  const [sortDesc, setSortDesc] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [detailsTransaction, setDetailsTransaction] = useState<TransactionRow | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);

  const openDetails = (row: TransactionRow) => {
    setDetailsTransaction(row);
    setDetailsModalOpen(true);
  };

  const closeDetails = () => {
    setDetailsModalOpen(false);
    setDetailsTransaction(null);
  };

  const filteredAndSorted = useMemo(() => {
    let list = [...transactions];
    if (statusFilter !== "all") {
      list = list.filter((t) => t.paymentStatus === statusFilter);
    }
    list.sort((a, b) => {
      let cmp = 0;
      if (sortBy === "date") cmp = new Date(a.date).getTime() - new Date(b.date).getTime();
      else if (sortBy === "amount") cmp = a.amount - b.amount;
      else cmp = a.net - b.net;
      return sortDesc ? -cmp : cmp;
    });
    return list;
  }, [transactions, statusFilter, sortBy, sortDesc]);

  const totals = useMemo(() => {
    const pending = filteredAndSorted.filter((t) => t.paymentStatus === "pending");
    const paid = filteredAndSorted.filter((t) => t.paymentStatus === "paid");
    return {
      totalAmount: filteredAndSorted.reduce((s, t) => s + t.amount, 0),
      totalCommission: filteredAndSorted.reduce((s, t) => s + t.commission, 0),
      totalNet: filteredAndSorted.reduce((s, t) => s + t.net, 0),
      pendingNet: pending.reduce((s, t) => s + t.net, 0),
      paidNet: paid.reduce((s, t) => s + t.net, 0),
    };
  }, [filteredAndSorted]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-56 rounded bg-slate-200 animate-pulse" />
        <PulseCards count={4} />
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="h-14 px-4 bg-slate-50 animate-pulse" />
          <PulseLoader className="min-h-[240px] rounded-none border-0" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-xl bg-white border border-gray-100 p-8 text-center text-gray-500">
        Could not load transactions. Try again later.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <TransactionDetailsModal isOpen={detailsModalOpen} onClose={closeDetails} transaction={detailsTransaction} />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Transactions &amp; Earnings</h1>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-lg bg-indigo-100 text-indigo-600">
              <DollarSign className="w-5 h-5" />
            </span>
            <div>
              <p className="text-sm font-medium text-gray-500">Total (filtered)</p>
              <p className="text-lg font-bold text-gray-900">{formatMoney(totals.totalAmount)}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-lg bg-slate-100 text-slate-600">
              <Percent className="w-5 h-5" />
            </span>
            <div>
              <p className="text-sm font-medium text-gray-500">Commission</p>
              <p className="text-lg font-bold text-gray-900">{formatMoney(totals.totalCommission)}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-lg bg-amber-100 text-amber-600">
              <Clock className="w-5 h-5" />
            </span>
            <div>
              <p className="text-sm font-medium text-gray-500">Pending payout</p>
              <p className="text-lg font-bold text-amber-700">{formatMoney(totals.pendingNet)}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-lg bg-emerald-100 text-emerald-600">
              <CheckCircle2 className="w-5 h-5" />
            </span>
            <div>
              <p className="text-sm font-medium text-gray-500">Paid out</p>
              <p className="text-lg font-bold text-emerald-700">{formatMoney(totals.paidNet)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <button
          type="button"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900"
        >
          <Filter className="w-4 h-4" />
          Filters &amp; sort
          <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? "rotate-180" : ""}`} />
        </button>
        {showFilters && (
          <div className="mt-4 flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">Status:</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {STATUS_OPTIONS.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => setStatusFilter(value)}
                  className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                    statusFilter === value ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            <div className="border-l border-gray-200 pl-4 flex items-center gap-2">
              <span className="text-sm text-gray-600">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "date" | "amount" | "net")}
                className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-700 bg-white"
              >
                <option value="date">Date</option>
                <option value="amount">Amount</option>
                <option value="net">Net earnings</option>
              </select>
              <button
                type="button"
                onClick={() => setSortDesc((d) => !d)}
                className="rounded-lg border border-gray-200 px-2 py-1.5 text-sm text-gray-600 hover:bg-gray-50"
                title={sortDesc ? "Newest / Highest first" : "Oldest / Lowest first"}
              >
                {sortDesc ? "↓" : "↑"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Table (desktop) + Cards (mobile) */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {filteredAndSorted.length > 0 ? (
          <>
            <div className="overflow-x-auto hidden md:block">
              <table className="w-full min-w-[720px]">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/80">
                    <th className="text-left py-3.5 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Booking
                    </th>
                    <th className="text-left py-3.5 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="text-left py-3.5 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Property / Guest
                    </th>
                    <th className="text-right py-3.5 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="text-right py-3.5 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Commission
                    </th>
                    <th className="text-right py-3.5 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Net
                    </th>
                    <th className="text-center py-3.5 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredAndSorted.map((row) => (
                    <tr
                      key={row.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => openDetails(row)}
                      onKeyDown={(e) => e.key === "Enter" && openDetails(row)}
                      className="hover:bg-gray-50/80 transition-colors cursor-pointer"
                    >
                      <td className="py-4 px-4">
                        <span className="font-mono text-sm font-medium text-gray-900">{row.bookingCode}</span>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-600">{formatDate(row.date)}</td>
                      <td className="py-4 px-4">
                        <p className="font-medium text-gray-900">{row.apartmentName}</p>
                        <p className="text-sm text-gray-500">{row.customerName}</p>
                      </td>
                      <td className="py-4 px-4 text-right font-medium text-gray-900">{formatMoney(row.amount)}</td>
                      <td className="py-4 px-4 text-right text-gray-600">{formatMoney(row.commission)}</td>
                      <td className="py-4 px-4 text-right font-semibold text-gray-900">{formatMoney(row.net)}</td>
                      <td className="py-4 px-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                            row.paymentStatus === "paid"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {row.paymentStatus === "paid" ? (
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          ) : (
                            <Clock className="w-3.5 h-3.5" />
                          )}
                          {row.paymentStatus === "paid" ? "Paid" : "Pending"}
                        </span>
                        {row.paidAt && <p className="text-xs text-gray-500 mt-1">Paid {formatDate(row.paidAt)}</p>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile card list (replaces table on small screens) */}
            <div className="md:hidden divide-y divide-gray-100 border-t border-gray-100">
              {filteredAndSorted.map((row) => (
                <div
                  key={row.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => openDetails(row)}
                  onKeyDown={(e) => e.key === "Enter" && openDetails(row)}
                  className="p-4 cursor-pointer hover:bg-gray-50/80 transition-colors active:bg-gray-100"
                >
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <p className="font-mono font-medium text-gray-900">{row.bookingCode}</p>
                      <p className="text-sm text-gray-600">
                        {row.apartmentName} · {row.customerName}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">{formatDate(row.date)}</p>
                    </div>
                    <span
                      className={`shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                        row.paymentStatus === "paid" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {row.paymentStatus === "paid" ? (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      ) : (
                        <Clock className="w-3.5 h-3.5" />
                      )}
                      {row.paymentStatus === "paid" ? "Paid" : "Pending"}
                    </span>
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-2 text-sm">
                    <div>
                      <p className="text-gray-500">Amount</p>
                      <p className="font-medium text-gray-900">{formatMoney(row.amount)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Commission</p>
                      <p className="text-gray-700">{formatMoney(row.commission)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Net</p>
                      <p className="font-semibold text-gray-900">{formatMoney(row.net)}</p>
                    </div>
                  </div>
                  {row.paidAt && <p className="text-xs text-gray-500 mt-2">Paid {formatDate(row.paidAt)}</p>}
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <Receipt className="w-12 h-12 text-gray-300 mb-3" />
            <p className="text-gray-500 font-medium">No transactions match your filters</p>
            <p className="text-sm text-gray-400 mt-1">Try changing the status filter or date range.</p>
          </div>
        )}
      </div>
    </div>
  );
}
