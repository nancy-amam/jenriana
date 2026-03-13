"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import {
  CalendarCheck,
  DollarSign,
  Wallet,
  Clock,
  Receipt,
  ChevronRight,
  User,
  Calendar,
  ChevronDown,
  Check,
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

const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

type DateRangeKey = "7" | "30" | "90" | "year";

const DATE_RANGES: { key: DateRangeKey; label: string }[] = [
  { key: "7", label: "Last 7 days" },
  { key: "30", label: "Last 30 days" },
  { key: "90", label: "Last 90 days" },
  { key: "year", label: "Year" },
];

// Years available in the year dropdown
const YEAR_OPTIONS = [2026, 2025, 2024];

// Placeholder data for UI only – values vary by date range for realism
const MOCK_STATS_BY_RANGE: Record<
  DateRangeKey,
  { totalBookings: number; totalEarnings: number; amountPaid: number; amountPending: number }
> = {
  "7": { totalBookings: 6, totalEarnings: 485000, amountPaid: 320000, amountPending: 165000 },
  "30": { totalBookings: 24, totalEarnings: 1845000, amountPaid: 1200000, amountPending: 645000 },
  "90": { totalBookings: 58, totalEarnings: 4290000, amountPaid: 3100000, amountPending: 1190000 },
  year: { totalBookings: 312, totalEarnings: 22450000, amountPaid: 18500000, amountPending: 3950000 },
};

// Mock daily/period earnings for the chart (last N points based on range)
const MOCK_EARNINGS_SERIES: Record<Exclude<DateRangeKey, "year">, { label: string; earnings: number }[]> = {
  "7": [
    { label: "Mon", earnings: 45000 },
    { label: "Tue", earnings: 82000 },
    { label: "Wed", earnings: 0 },
    { label: "Thu", earnings: 185000 },
    { label: "Fri", earnings: 98000 },
    { label: "Sat", earnings: 75000 },
    { label: "Sun", earnings: 0 },
  ],
  "30": [
    { label: "Week 1", earnings: 420000 },
    { label: "Week 2", earnings: 385000 },
    { label: "Week 3", earnings: 510000 },
    { label: "Week 4", earnings: 530000 },
  ],
  "90": [
    { label: "Month 1", earnings: 1250000 },
    { label: "Month 2", earnings: 1420000 },
    { label: "Month 3", earnings: 1620000 },
  ],
};

// Mock monthly earnings per year (Jan–Dec) for when filter is "year"
const MOCK_MONTHLY_EARNINGS_BY_YEAR: Record<number, number[]> = {
  2024: [1200000, 1180000, 1350000, 1420000, 1580000, 1650000, 1720000, 1680000, 1850000, 1920000, 1780000, 2100000],
  2025: [1650000, 1720000, 1880000, 1950000, 1820000, 1980000, 2050000, 2120000, 1980000, 2250000, 2180000, 2350000],
  2026: [1980000, 2050000, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // partial year mock
};

const PIE_COLORS = ["#4f46e5", "#059669", "#d97706", "#2563eb", "#7c3aed"];

// Earnings by apartment (static for pie)
const MOCK_EARNINGS_BY_APARTMENT = [
  { name: "Lekki Waterside", value: 720000, color: PIE_COLORS[0] },
  { name: "Victoria Island View", value: 595000, color: PIE_COLORS[1] },
  { name: "Ikoyi Heights", value: 530000, color: PIE_COLORS[2] },
];

const MOCK_RECENT_BOOKINGS = [
  {
    id: "1",
    customerName: "Adebayo Okonkwo",
    apartmentName: "Lekki Waterside",
    bookingCode: "JNR-8821",
    totalAmount: 185000,
    status: "confirmed",
    timeAgo: "5 mins ago",
  },
  {
    id: "2",
    customerName: "Chioma Nwosu",
    apartmentName: "Victoria Island View",
    bookingCode: "JNR-8819",
    totalAmount: 320000,
    status: "confirmed",
    timeAgo: "2h ago",
  },
  {
    id: "3",
    customerName: "Emeka Eze",
    apartmentName: "Lekki Waterside",
    bookingCode: "JNR-8815",
    totalAmount: 145000,
    status: "confirmed",
    timeAgo: "1d ago",
  },
  {
    id: "4",
    customerName: "Funke Adeyemi",
    apartmentName: "Ikoyi Heights",
    bookingCode: "JNR-8810",
    totalAmount: 420000,
    status: "confirmed",
    timeAgo: "2d ago",
  },
  {
    id: "5",
    customerName: "Ibrahim Sheriff",
    apartmentName: "Victoria Island View",
    bookingCode: "JNR-8805",
    totalAmount: 275000,
    status: "confirmed",
    timeAgo: "3d ago",
  },
];

export default function PartnerDashboardPage() {
  const [dateRange, setDateRange] = useState<DateRangeKey>("30");
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [periodDropdownOpen, setPeriodDropdownOpen] = useState(false);
  const [periodDropdownClosing, setPeriodDropdownClosing] = useState(false);
  const [periodDropdownEntered, setPeriodDropdownEntered] = useState(false);
  const periodDropdownRef = useRef<HTMLDivElement>(null);

  // Enter animation: after open, one frame then show content
  useEffect(() => {
    if (periodDropdownOpen && !periodDropdownClosing) {
      const id = requestAnimationFrame(() => setPeriodDropdownEntered(true));
      return () => cancelAnimationFrame(id);
    }
    if (!periodDropdownOpen) setPeriodDropdownEntered(false);
  }, [periodDropdownOpen, periodDropdownClosing]);

  // Close animation: after closing, delay then unmount
  useEffect(() => {
    if (!periodDropdownClosing) return;
    const id = setTimeout(() => {
      setPeriodDropdownOpen(false);
      setPeriodDropdownClosing(false);
      setPeriodDropdownEntered(false);
    }, 200);
    return () => clearTimeout(id);
  }, [periodDropdownClosing]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (periodDropdownRef.current && !periodDropdownRef.current.contains(e.target as Node)) {
        if (periodDropdownOpen) setPeriodDropdownClosing(true);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [periodDropdownOpen]);

  const togglePeriodDropdown = () => {
    if (periodDropdownClosing) return;
    if (periodDropdownOpen) setPeriodDropdownClosing(true);
    else setPeriodDropdownOpen(true);
  };

  const selectPeriod = (key: DateRangeKey) => {
    setDateRange(key);
    setPeriodDropdownClosing(true);
  };

  const stats = useMemo(() => MOCK_STATS_BY_RANGE[dateRange], [dateRange]);
  const chartData = useMemo(() => {
    if (dateRange === "year") {
      const amounts = MOCK_MONTHLY_EARNINGS_BY_YEAR[selectedYear] ?? MOCK_MONTHLY_EARNINGS_BY_YEAR[2025];
      return MONTH_LABELS.map((label, i) => ({ label, earnings: amounts[i] ?? 0 }));
    }
    return MOCK_EARNINGS_SERIES[dateRange];
  }, [dateRange, selectedYear]);

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

  return (
    <div className="space-y-8">
      {/* Welcome + quick action */}
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

      {/* Period dropdown + optional year dropdown */}
      <div className="flex flex-wrap items-center gap-2" ref={periodDropdownRef}>
        <span className="flex items-center gap-1.5 text-sm font-medium text-gray-600">
          <Calendar className="w-4 h-4" />
          Period:
        </span>
        <div className="relative">
          <button
            type="button"
            onClick={togglePeriodDropdown}
            className="inline-flex items-center justify-between gap-2 min-w-[180px] rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm font-medium text-gray-900 shadow-sm hover:bg-gray-50 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
          >
            <span>{DATE_RANGES.find((r) => r.key === dateRange)?.label ?? "Last 30 days"}</span>
            <ChevronDown
              className={`h-4 w-4 text-gray-500 shrink-0 transition-transform duration-200 ${periodDropdownOpen && !periodDropdownClosing ? "rotate-180" : ""}`}
            />
          </button>

          {(periodDropdownOpen || periodDropdownClosing) && (
            <div
              className="absolute left-0 top-full z-50 mt-1.5 w-full min-w-[200px] origin-top rounded-lg border border-gray-200 bg-white py-1 shadow-lg ring-1 ring-black/5 transition-all duration-200 ease-out"
              style={{
                opacity: periodDropdownClosing ? 0 : periodDropdownEntered ? 1 : 0,
                transform: periodDropdownClosing ? "scale(0.96)" : periodDropdownEntered ? "scale(1)" : "scale(0.96)",
              }}
            >
              {DATE_RANGES.map(({ key, label }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => selectPeriod(key)}
                  className="flex w-full items-center justify-between gap-2 px-3 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
                >
                  <span>{label}</span>
                  {dateRange === key && <Check className="h-4 w-4 text-indigo-600 shrink-0" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {dateRange === "year" && (
          <div className="flex items-center gap-2">
            <label htmlFor="year-select" className="text-sm font-medium text-gray-600">
              Year:
            </label>
            <select
              id="year-select"
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
            >
              {YEAR_OPTIONS.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        )}
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
              <BarChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
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
                  data={MOCK_EARNINGS_BY_APARTMENT}
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
                  {MOCK_EARNINGS_BY_APARTMENT.map((entry, index) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
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
          {MOCK_RECENT_BOOKINGS.map((booking) => (
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
