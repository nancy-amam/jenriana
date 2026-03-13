"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Receipt, Home, ChevronLeft, ChevronRight, LogOut, Mail } from "lucide-react";
import { useState, useEffect } from "react";
import Image from "next/image";

const links = [
  { href: "/partner", label: "Dashboard", icon: LayoutDashboard },
  { href: "/partner/apartments", label: "Apartments", icon: Home },
  { href: "/partner/transactions", label: "Transactions", icon: Receipt },
];

const STORAGE_KEY = "partner-sidebar-collapsed";

interface PartnerSidebarProps {
  isMobile?: boolean;
  onLinkClick?: () => void;
}

export default function PartnerSidebar({ isMobile = false, onLinkClick }: PartnerSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.clear();
    router.push("/partner/auth/login");
    onLinkClick?.();
  };

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

  const bottomLinks = (
    <>
      <li className="border-t border-slate-700/50">
        <Link
          href="/contact-us"
          className="flex items-center gap-3 px-4 py-3.5 text-sm font-medium text-slate-300 hover:bg-slate-700/50 hover:text-white transition-colors"
          onClick={onLinkClick}
        >
          <Mail className="w-5 h-5 shrink-0" />
          Contact admin
        </Link>
      </li>
      <li className="border-b border-slate-700/50 last:border-b-0">
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 px-4 py-3.5 text-sm font-medium text-slate-300 hover:bg-slate-700/50 hover:text-white transition-colors"
        >
          <LogOut className="w-5 h-5 shrink-0" />
          Logout
        </button>
      </li>
    </>
  );

  if (isMobile) {
    return (
      <div className="bg-slate-800 border-t border-slate-700 flex flex-col">
        <ul className="flex flex-col flex-1">
          {links.map((link) => {
            const isActive =
              pathname === link.href ||
              (link.href !== "/partner" && pathname.startsWith(link.href));
            const Icon = link.icon;
            return (
              <li key={link.href} className="border-b border-slate-700/50">
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
        <ul className="flex flex-col mt-auto">{bottomLinks}</ul>
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

        <nav className="flex-1 overflow-y-auto py-4 px-3 flex flex-col">
          <ul className="space-y-1">
            {links.map((link) => {
              const isActive =
                pathname === link.href ||
                (link.href !== "/partner" && pathname.startsWith(link.href));
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
          <ul className="mt-auto pt-4 border-t border-slate-700/80 space-y-1">
            <li>
              <Link
                href="/contact-us"
                title={collapsed ? "Contact admin" : undefined}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:bg-slate-700/60 hover:text-white transition-all duration-200
                  ${collapsed ? "justify-center px-2" : ""}`}
              >
                <Mail className="w-5 h-5 shrink-0" />
                {!collapsed && <span>Contact admin</span>}
              </Link>
            </li>
            <li>
              <button
                type="button"
                onClick={handleLogout}
                title={collapsed ? "Logout" : undefined}
                className={`flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:bg-slate-700/60 hover:text-white transition-all duration-200
                  ${collapsed ? "justify-center px-2" : ""}`}
              >
                <LogOut className="w-5 h-5 shrink-0" />
                {!collapsed && <span>Logout</span>}
              </button>
            </li>
          </ul>
        </nav>
      </aside>
      <div
        className={`hidden md:block shrink-0 ${collapsed ? "w-[72px]" : "w-64"} transition-all duration-300`}
        aria-hidden
      />
    </>
  );
}
