"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Building2,
  BookOpen,
  Users,
  ChartNoAxesColumn,
  Component,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  Home,
} from "lucide-react";
import { useState, useEffect } from "react";
import Image from "next/image";

const links = [
  { href: "/admin", label: "Dashboard", icon: Home },
  { href: "/admin/apartments", label: "Apartments", icon: Building2 },
  { href: "/admin/bookings", label: "Bookings", icon: BookOpen },
  { href: "/admin/guests", label: "Guests", icon: Users },
  { href: "/admin/analytics", label: "Analytics", icon: ChartNoAxesColumn },
  { href: "/admin/coupons", label: "Coupons", icon: Component },
  { href: "/admin/feedback", label: "Feedback", icon: MessageCircle },
];

const STORAGE_KEY = "admin-sidebar-collapsed";

interface AdminSidebarProps {
  isMobile?: boolean;
  onLinkClick?: () => void;
}

export default function AdminSidebar({ isMobile = false, onLinkClick }: AdminSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored !== null) setCollapsed(stored === "true");
  }, []);

  const toggleCollapsed = () => {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem(STORAGE_KEY, String(next));
      return next;
    });
  };

  if (isMobile) {
    return (
      <div className="bg-slate-800 border-t border-slate-700">
        <ul className="flex flex-col">
          {links.map((link) => {
            const isActive = pathname === link.href || (link.href !== "/admin" && pathname.startsWith(link.href));
            const Icon = link.icon;
            return (
              <li key={link.href} className="border-b border-slate-700/50 last:border-b-0">
                <Link
                  href={link.href}
                  className={`flex items-center gap-3 px-4 py-3.5 text-sm font-medium transition-colors
                    ${isActive ? "bg-indigo-500 text-white" : "text-slate-300 hover:bg-slate-700/50 hover:text-white"}`}
                  onClick={onLinkClick}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }

  return (
    <>
      <aside
        className={`hidden md:flex md:flex-col fixed left-0 top-0 bottom-0 z-40 bg-slate-800 border-r border-slate-700/80 transition-all duration-300 ease-in-out ${
          collapsed ? "w-[72px]" : "w-64"
        }`}
      >
      {/* Logo + Collapse (top) */}
      <div
        className={`flex items-center justify-between border-b border-slate-700/80 bg-white ${
          collapsed ? "justify-center py-3 px-2" : "gap-2 px-4 h-16"
        }`}
      >
        {!collapsed && (
          <Link href="/" className="flex items-center min-w-0 flex-1">
            <Image
              src="/images/logo.png"
              alt="Jenriana"
              width={110}
              height={26}
              className="object-contain"
            />
          </Link>
        )}
        <button
          onClick={toggleCollapsed}
          className="flex items-center justify-center shrink-0 w-8 h-8 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>

      {/* Nav links */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <ul className="space-y-1">
          {links.map((link) => {
            const isActive =
              pathname === link.href || (link.href !== "/admin" && pathname.startsWith(link.href));
            const Icon = link.icon;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  title={collapsed ? link.label : undefined}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                    ${collapsed ? "justify-center px-2" : ""}
                    ${isActive ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/25" : "text-slate-400 hover:bg-slate-700/60 hover:text-white"}`}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  {!collapsed && <span>{link.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      </aside>
      {/* Spacer so main content doesn't go under fixed sidebar */}
      <div className={`hidden md:block shrink-0 ${collapsed ? "w-[72px]" : "w-64"} transition-all duration-300`} aria-hidden />
    </>
  );
}
