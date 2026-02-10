"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Building2, BookOpen, Users, DollarSign, TrendingUp, ArrowRight, CalendarCheck } from "lucide-react";
import { getAdminAnalytics, getActivity } from "@/services/api-services";
import { AnalyticsResponse } from "@/lib/interface";
import AdminContentLoader from "./components/admin-content-loader";

interface Activity {
  _id: string;
  type: string;
  message: string;
  createdAt: string;
}

interface ActivityResponse {
  activities: Activity[];
}

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
  const [analytics, setAnalytics] = useState<AnalyticsResponse | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [activitiesLoading, setActivitiesLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function fetchData() {
      try {
        const [analyticsData, activityData] = await Promise.all([
          getAdminAnalytics(),
          getActivity().catch(() => ({ activities: [] })),
        ]);
        if (!cancelled) {
          setAnalytics(analyticsData);
          setActivities((activityData as ActivityResponse).activities?.slice(0, 5) ?? []);
        }
      } catch {
        if (!cancelled) setAnalytics(null);
      } finally {
        if (!cancelled) setLoading(false);
        setActivitiesLoading(false);
      }
    }
    fetchData();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="p-4 sm:p-6 bg-[#f1f1f1] min-h-[60vh]">
        <AdminContentLoader />
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
    <div className="p-4 sm:p-6 bg-[#f1f1f1] min-h-screen">
      <div className="max-w-5xl mx-auto">
        <header className="mb-8">
          <h1 className="text-xl sm:text-2xl font-semibold text-slate-800">Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">Overview of your admin stats</p>
        </header>

        {!analytics ? (
          <div className="rounded-xl bg-white border border-slate-200/80 shadow-sm p-8 text-center text-slate-500">
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
                    className="group rounded-xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md hover:border-slate-300/80 transition-all overflow-hidden"
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

            <section className="rounded-xl bg-white border border-slate-200/80 shadow-sm overflow-hidden">
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
                  <div className="flex justify-center py-10">
                    <AdminContentLoader />
                  </div>
                ) : activities.length === 0 ? (
                  <div className="py-10 text-center text-sm text-slate-500">No recent activity</div>
                ) : (
                  activities.map((activity) => (
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
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-50 transition"
              >
                <Building2 className="w-4 h-4" /> Apartments
              </Link>
              <Link
                href="/admin/guests"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-50 transition"
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
