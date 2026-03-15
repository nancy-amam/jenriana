"use client";

import Link from "next/link";
import { Building2, BookOpen, Users, DollarSign, TrendingUp, ArrowRight, CalendarCheck } from "lucide-react";
import { useAdminAnalytics, useAdminActivity } from "@/hooks/use-admin-api";
import { PulseCards } from "@/components/ui/pulse-loader";

function formatActivityDate(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
  return `${Math.floor(diffMins / 1440)}d ago`;
}

function shortenActivity(type: string) {
  const map: Record<string, string> = {
    APARTMENT_CREATED: "New apartment",
    APARTMENT_UPDATED: "Apartment updated",
    REVIEW_ADDED: "New review",
    USER_SIGNEDUP: "New signup",
    BOOKING_CREATED: "New booking",
    PAYMENT_RECEIVED: "Payment received",
  };
  return map[type] || "Activity";
}

export default function AdminDashboard() {
  const { data: analytics, isLoading: loading } = useAdminAnalytics();
  const { data: activities = [], isLoading: activitiesLoading } = useAdminActivity();
  const recentActivities = activities.slice(0, 5);

  if (loading) {
    return (
      <div className="p-4 sm:p-6 bg-white min-h-[60vh]">
        <div className="h-8 w-48 rounded bg-slate-200 animate-pulse mb-6" />
        <PulseCards count={4} />
        <div className="mt-8 rounded-xl border border-black/10 overflow-hidden">
          <div className="h-12 bg-slate-100 animate-pulse" />
          <div className="flex flex-col gap-2 p-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-12 rounded bg-slate-100 animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const stats = analytics
    ? [
        {
          title: "Apartments",
          value: analytics.totalApartments,
          sub: "Listings",
          icon: Building2,
          href: "/admin/apartments",
          color: "bg-slate-800",
          iconBg: "bg-slate-100",
          iconColor: "text-slate-600",
        },
        {
          title: "Bookings",
          value: analytics.totalBookings,
          sub: "Total",
          icon: BookOpen,
          href: "/admin/bookings",
          color: "bg-emerald-700",
          iconBg: "bg-emerald-50",
          iconColor: "text-emerald-600",
        },
        {
          title: "Revenue",
          value: "\u20A6" + (analytics.revenueThisMonth ?? 0).toLocaleString(),
          sub: "This month",
          icon: DollarSign,
          href: "/admin/bookings",
          color: "bg-amber-600",
          iconBg: "bg-amber-50",
          iconColor: "text-amber-600",
        },
        {
          title: "Trend",
          value: analytics.percentageChange ?? "—",
          sub: "Change",
          icon: TrendingUp,
          href: "/admin/analytics",
          color: "bg-indigo-600",
          iconBg: "bg-indigo-50",
          iconColor: "text-indigo-600",
        },
      ]
    : [];

  return (
    <div className="p-4 sm:p-6 bg-white min-h-screen">
      <div className="max-w-5xl mx-auto">
        <header className="mb-8">
          <h1 className="text-xl sm:text-2xl font-semibold text-slate-800">Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">Overview of your admin stats</p>
        </header>

        {!analytics ? (
          <div className="rounded-xl bg-white border border-black/10 p-8 text-center text-slate-500">
            Could not load dashboard stats. Check your connection or try again later.
          </div>
        ) : (
          <>
            <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-8">
              {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <Link
                    key={stat.title}
                    href={stat.href}
                    className="group rounded-xl bg-white border border-black/10 hover:border-black/15 transition-colors overflow-hidden"
                  >
                    <div className="p-4 sm:p-5">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{stat.title}</p>
                          <p className="mt-1 text-lg sm:text-xl font-bold text-slate-900 truncate">{stat.value}</p>
                          {stat.sub && <p className="text-xs text-slate-400 mt-0.5">{stat.sub}</p>}
                        </div>
                        <span
                          className={
                            "shrink-0 p-2 rounded-lg " +
                            stat.iconBg +
                            " " +
                            stat.iconColor +
                            " group-hover:scale-105 transition-transform"
                          }
                        >
                          <Icon className="w-5 h-5" />
                        </span>
                      </div>
                      <span className="inline-flex items-center gap-1 mt-3 text-xs font-medium text-slate-500 group-hover:text-slate-700">
                        View <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </section>

            <section className="rounded-xl bg-white border border-black/10 overflow-hidden">
              <div className="px-4 sm:px-5 py-3 border-b border-slate-100 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-slate-700">Recent activity</h2>
                <Link
                  href="/admin/analytics"
                  className="text-xs font-medium text-slate-500 hover:text-slate-700 flex items-center gap-1"
                >
                  All activity <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
              <div className="divide-y divide-slate-100">
                {activitiesLoading ? (
                  <div className="space-y-2 p-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="h-12 rounded bg-slate-100 animate-pulse" />
                    ))}
                  </div>
                ) : recentActivities.length === 0 ? (
                  <div className="py-10 text-center text-sm text-slate-500">No recent activity</div>
                ) : (
                  recentActivities.map((activity) => (
                    <div
                      key={activity._id}
                      className="px-4 sm:px-5 py-3 flex items-center gap-3 hover:bg-slate-50/80 transition-colors"
                    >
                      <span className="shrink-0 p-1.5 rounded-md bg-slate-100 text-slate-500">
                        <CalendarCheck className="w-4 h-4" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-slate-700 truncate">{shortenActivity(activity.type)}</p>
                        <p className="text-xs text-slate-400">{formatActivityDate(activity.createdAt)}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/admin/bookings"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-800 text-white text-sm font-medium hover:bg-slate-700 transition"
              >
                <BookOpen className="w-4 h-4" /> Bookings
              </Link>
              <Link
                href="/admin/apartments"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white border border-black/10 text-slate-700 text-sm font-medium hover:bg-slate-50 transition"
              >
                <Building2 className="w-4 h-4" /> Apartments
              </Link>
              <Link
                href="/admin/guests"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white border border-black/10 text-slate-700 text-sm font-medium hover:bg-slate-50 transition"
              >
                <Users className="w-4 h-4" /> Guests
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
