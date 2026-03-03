import { createClient } from "@/lib/supabase/server";
import { Users, BookOpen, ClipboardList, CalendarCheck } from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const supabase = await createClient();

  const [
    { count: studentCount },
    { count: lessonCount },
    { count: homeworkCount },
    { count: pendingBookings },
  ] = await Promise.all([
    supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("role", "student"),
    supabase.from("lessons").select("*", { count: "exact", head: true }),
    supabase.from("homework").select("*", { count: "exact", head: true }),
    supabase
      .from("bookings")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending"),
  ]);

  const stats = [
    {
      label: "Élèves",
      value: studentCount ?? 0,
      icon: Users,
      href: "/dashboard/students",
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Leçons",
      value: lessonCount ?? 0,
      icon: BookOpen,
      href: "/dashboard/lessons",
      color: "bg-green-50 text-green-600",
    },
    {
      label: "Devoirs",
      value: homeworkCount ?? 0,
      icon: ClipboardList,
      href: "/dashboard/homework",
      color: "bg-purple-50 text-purple-600",
    },
    {
      label: "Réservations en attente",
      value: pendingBookings ?? 0,
      icon: CalendarCheck,
      href: "/dashboard/bookings",
      color: "bg-amber-50 text-amber-600",
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold">Tableau de bord</h1>
      <p className="text-gray-500 text-sm mt-1 mb-8">
        Vue d&apos;ensemble de votre activité.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="group bg-white rounded-2xl border border-gray-100 p-5 shadow-sm shadow-gray-200/50 hover:shadow-md hover:-translate-y-0.5 transition-all"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-2.5 rounded-xl ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
            </div>
            <p className="text-3xl font-bold tracking-tight">{stat.value}</p>
            <span className="text-sm text-gray-500 mt-1 block">{stat.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
