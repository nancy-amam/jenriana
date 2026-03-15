"use client";

import Link from "next/link";
import {
  CalendarCheck,
  DollarSign,
  Wallet,
  Clock,
  Receipt,
  ChevronRight,
  User,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { usePartnerDashboard } from "@/hooks/use-partner-api";
import { PulseLoader, PulseCards } from "@/components/ui/pulse-loader";

const PIE_COLORS = ["#4f46e5", "#059669", "#d97706", "#2563eb", "#7c3aed"];

export default function PartnerDashboardPage() {
  const { data, isLoading, isError } = usePartnerDashboard();

  const stats = data?.stats ?? {
    totalBookings: 0,
    totalEarnings: 0,
    amountPaid: 0,
    amountPending: 0,
  };
  const chartData = data?.chartData ?? [];
  const earningsByApartment = (data?.earningsByApartment ?? []).map(
    (item: { name: string; value: number }, i: number) => ({
      ...item,
      color: PIE_COLORS[i % PIE_COLORS.length],
    })
  );
  const recentBookings = data?.recentBookings ?? [];

  const statCards = [
    {
      title: "Total Bookings",
      value: stats.totalBookings.toLocaleString(),
      icon: CalendarCheck,
      iconBg: "bg-indigo-100",
      iconColor: "text-indigo-600",
    },
    {
      title: "Total Earnings",
      value: `₦${stats.totalEarnings.toLocaleString()}`,
      icon: DollarSign,
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
    },
    {
      title: "Amount Paid",
      value: `₦${stats.amountPaid.toLocaleString()}`,
      icon: Wallet,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      title: "Amount Pending",
      value: `₦${stats.amountPending.toLocaleString()}`,
      icon: Clock,
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600",
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="h-8 w-48 rounded bg-slate-200 animate-pulse" />
          <div className="h-10 w-36 rounded-lg bg-slate-200 animate-pulse" />
        </div>
        <PulseCards count={4} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-[280px] rounded-xl bg-slate-100 animate-pulse" />
          <div className="h-[280px] rounded-xl bg-slate-100 animate-pulse" />
        </div>
        <div className="rounded-xl border border-gray-100 overflow-hidden">
          <div className="h-14 px-6 border-b border-gray-100 bg-slate-50 animate-pulse" />
          <PulseLoader className="min-h-[200px] rounded-none border-0" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-xl bg-white border border-gray-100 p-8 text-center text-gray-500">
        Could not load dashboard. Check your connection or try again later.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
        <Link
          href="/partner/transactions"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 transition-colors"
        >
          <Receipt className="w-4 h-4" />
          View Transactions
        </Link>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between"
            >
              <div className="flex justify-between items-start">
                <span className="text-sm font-medium text-gray-500">{stat.title}</span>
                <span className={`p-2 rounded-lg ${stat.iconBg} flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${stat.iconColor}`} />
                </span>
              </div>
              <p className="mt-3 text-xl md:text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Earnings over time (bar chart) */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Earnings over time</h2>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData.length ? chartData : [{ label: "—", earnings: 0 }]} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="label" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                <YAxis
                  tick={{ fontSize: 12 }}
                  stroke="#9ca3af"
                  tickFormatter={(v) => (v >= 1000 ? `₦${(v / 1000).toFixed(0)}k` : `₦${v}`)}
                />
                <Tooltip
                  formatter={(value) => [`₦${Number(value ?? 0).toLocaleString()}`, "Earnings"]}
                  contentStyle={{ borderRadius: "8px", border: "1px solid #e5e7eb" }}
                />
                <Bar dataKey="earnings" fill="#4f46e5" radius={[4, 4, 0, 0]} name="Earnings" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie chart – earnings by apartment */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Earnings by property</h2>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={earningsByApartment.length ? earningsByApartment : [{ name: "—", value: 0, color: PIE_COLORS[0] }]}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {earningsByApartment.map(
                    (entry: { name: string; value: number; color: string }, index: number) => (
                      <Cell key={`${entry.name}-${index}`} fill={entry.color} />
                    )
                  )}
                </Pie>
                <Tooltip
                  formatter={(value) => `₦${Number(value ?? 0).toLocaleString()}`}
                  contentStyle={{ borderRadius: "8px", border: "1px solid #e5e7eb" }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent booking activity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Recent Booking Activity</h2>
          <Link
            href="/partner/transactions"
            className="text-sm font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
          >
            View all
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="divide-y divide-gray-100">
          {recentBookings.map((booking: { id: string; customerName: string; apartmentName: string; bookingCode: string; totalAmount: number; status: string; timeAgo: string }) => (
            <div key={booking.id} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50/80 transition-colors">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                <User className="w-5 h-5" />
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">{booking.customerName}</p>
                <p className="text-sm text-gray-500 truncate">
                  {booking.apartmentName} · {booking.bookingCode}
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="font-semibold text-gray-900">₦{booking.totalAmount.toLocaleString()}</p>
                <p className="text-xs text-gray-500">{booking.timeAgo}</p>
              </div>
              <span className="shrink-0 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 capitalize">
                {booking.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
