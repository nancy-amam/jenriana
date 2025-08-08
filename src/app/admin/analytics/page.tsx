'use client';

import { Home, CalendarCheck, DollarSign } from 'lucide-react';

export default function AnalyticsPage() {
  const stats = [
    {
      title: 'Total Apartments',
      value: '54',
      change: '12% increase from last month',
      icon: Home,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
    },
    {
      title: 'Total Bookings',
      value: '1,293',
      change: '8% increase from last month',
      icon: CalendarCheck,
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
    },
    {
      title: 'Revenue This Month',
      value: '₦4.2M',
      change: '5% increase from last month',
      icon: DollarSign,
      iconBg: 'bg-yellow-100',
      iconColor: 'text-yellow-600',
    },
  ];

  const activities = [
    {
      id: 1,
      text: 'New booking for Apartment #24',
      icon: CalendarCheck,
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
    },
    {
      id: 2,
      text: 'Apartment #12 updated by Admin',
      icon: Home,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
    },
    {
      id: 3,
      text: 'Payment of ₦250,000 received',
      icon: DollarSign,
      iconBg: 'bg-yellow-100',
      iconColor: 'text-yellow-600',
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
        <div className="space-y-3">
          {activities.map((activity) => {
            const Icon = activity.icon;
            return (
              <div
                key={activity.id}
                className="flex items-center gap-3 rounded-lg border border-gray-200 bg-[#F5F5F5] px-4 py-3"
              >
                <span
                  className={`p-2 rounded-full ${activity.iconBg} flex items-center justify-center`}
                >
                  <Icon className={`w-5 h-5 ${activity.iconColor}`} />
                </span>
                <span className="text-gray-700 text-sm">{activity.text}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
