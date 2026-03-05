"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Users,
  BookOpen,
  ClipboardList,
  Calendar,
  CalendarCheck,
  Settings,
  ChevronRight,
  BarChart3,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Tableau de bord", icon: Home, exact: true },
  { href: "/dashboard/students", label: "Élèves", icon: Users },
  { href: "/dashboard/lessons", label: "Leçons", icon: BookOpen },
  { href: "/dashboard/homework", label: "Devoirs", icon: ClipboardList },
  { href: "/dashboard/availability", label: "Disponibilités", icon: Calendar },
  { href: "/dashboard/bookings", label: "Réservations", icon: CalendarCheck },
  { href: "/dashboard/analytics", label: "Statistiques", icon: BarChart3 },
  { href: "/dashboard/settings", label: "Paramètres", icon: Settings },
];

export function SidebarNav({ pendingBookings }: { pendingBookings: number }) {
  const pathname = usePathname();

  function isActive(item: (typeof navItems)[0]) {
    if (item.exact) return pathname === item.href;
    return pathname.startsWith(item.href);
  }

  return (
    <nav className="flex-1 px-3 mt-2 space-y-0.5">
      {navItems.map((item) => {
        const active = isActive(item);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
              active
                ? "bg-sidebar-active text-white shadow-lg shadow-blue-500/20"
                : "text-gray-400 hover:bg-sidebar-hover hover:text-white"
            }`}
          >
            <item.icon
              className={`h-[18px] w-[18px] ${
                active
                  ? "text-white"
                  : "text-gray-500 group-hover:text-blue-400"
              }`}
            />
            <span className="flex-1">{item.label}</span>
            {item.href === "/dashboard/bookings" && pendingBookings > 0 && (
              <span className="min-w-[20px] h-5 px-1.5 rounded-full bg-amber-500 text-white text-xs font-bold flex items-center justify-center">
                {pendingBookings}
              </span>
            )}
            {!(item.href === "/dashboard/bookings" && pendingBookings > 0) && (
              <ChevronRight
                className={`h-3.5 w-3.5 transition ${
                  active
                    ? "opacity-100 text-white/60"
                    : "opacity-0 group-hover:opacity-100 text-gray-600"
                }`}
              />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
