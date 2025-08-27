'use client';

import { useEffect, useState } from "react";
import { Home, CalendarCheck, DollarSign, User, Star } from "lucide-react";
import { getAdminAnalytics, getActivity } from "@/services/api-services";
import { AnalyticsResponse } from "@/lib/interface";
import ApartmentLoadingPage from "@/components/loading";

interface Activity {
  _id: string;
  type: string;
  message: string;
  createdAt: string;
  __v: number;
}

interface ActivityResponse {
  message: string;
  activities: Activity[];
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsResponse | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [activitiesLoading, setActivitiesLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const data = await getAdminAnalytics();
        setAnalytics(data);
      } catch (err) {
        console.error("Failed to load analytics:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchAnalytics();
  }, []);

  useEffect(() => {
    async function fetchActivities() {
      try {
        const data = await getActivity();
        setActivities(data.activities);
      } catch (err) {
        console.error("Failed to load activities:", err);
      } finally {
        setActivitiesLoading(false);
      }
    }
    fetchActivities();
  }, []);

  // Helper function to get icon and colors based on activity type
  const getActivityDisplay = (type: string) => {
    switch (type) {
      case 'REVIEW_ADDED':
        return {
          icon: Star,
          iconBg: "bg-yellow-100",
          iconColor: "text-yellow-600",
        };
      case 'USER_SIGNEDUP':
        return {
          icon: User,
          iconBg: "bg-purple-100",
          iconColor: "text-purple-600",
        };
      case 'BOOKING_CREATED':
        return {
          icon: CalendarCheck,
          iconBg: "bg-green-100",
          iconColor: "text-green-600",
        };
      case 'PAYMENT_RECEIVED':
        return {
          icon: DollarSign,
          iconBg: "bg-blue-100",
          iconColor: "text-blue-600",
        };
      default:
        return {
          icon: Home,
          iconBg: "bg-gray-100",
          iconColor: "text-gray-600",
        };
    }
  };

  // Helper function to format activity date
  const formatActivityDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  // while fetching analytics
  if (loading) {
    return <div className="p-4 sm:p-6 bg-[#f1f1f1] min-h-screen">
            <div className="flex justify-center items-center h-64">
              <ApartmentLoadingPage />
            </div>
          </div>;
  }

  // if API failed
  if (!analytics) {
    return <div className="p-6 text-red-500">Failed to load analytics.</div>;
  }

  const stats = [
    {
      title: "Total Apartments",
      value: analytics.totalApartments.toString(),
      change: `${analytics.percentageChange}% change`,
      icon: Home,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      title: "Total Bookings",
      value: analytics.totalBookings.toString(),
      change: `${analytics.percentageChange}% change`,
      icon: CalendarCheck,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      title: "Revenue This Month",
      value: `₦${analytics.revenueThisMonth.toLocaleString()}`,
      change: `${analytics.percentageChange}% change`,
      icon: DollarSign,
      iconBg: "bg-yellow-100",
      iconColor: "text-yellow-600",
    },
  ];

  return (
    <div className="p-4 md:p-6 space-y-8 min-h-screen">
      {/* Top Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-lg p-6 flex flex-col justify-between shadow h-full"
            >
              <div className="flex justify-between items-start">
                <h2 className="text-gray-500 text-sm font-normal">{stat.title}</h2>
                <span
                  className={`p-2 rounded-full ${stat.iconBg} flex items-center justify-center`}
                >
                  <Icon className={`w-6 h-6 ${stat.iconColor}`} />
                </span>
              </div>
              <div>
                <p className="text-2xl md:text-[30px] text-gray-900 font-bold">{stat.value}</p>
                <p className="text-sm text-gray-400 mt-1">{stat.change}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-lg shadow p-4 md:p-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Recent Activities</h2>
        
        {activitiesLoading ? (
          <div className="flex justify-center py-8">
            <ApartmentLoadingPage />
          </div>
        ) : activities.length > 0 ? (
          <div className="space-y-3">
            {activities.slice(0, 10).map((activity) => {
              const { icon: Icon, iconBg, iconColor } = getActivityDisplay(activity.type);
              return (
                <div
                  key={activity._id}
                  className="flex items-center gap-3 rounded-lg border border-gray-200 bg-[#F5F5F5] px-4 py-3"
                >
                  <span
                    className={`p-2 rounded-full ${iconBg} flex items-center justify-center flex-shrink-0`}
                  >
                    <Icon className={`w-5 h-5 ${iconColor}`} />
                  </span>
                  <div className="flex-1 min-w-0">
                    <span className="text-gray-700 text-sm">{activity.message}</span>
                    <p className="text-xs text-gray-500 mt-1">{formatActivityDate(activity.createdAt)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No recent activities found.
          </div>
        )}
      </div>
    </div>
  );
}