import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  GraduationCap,
  LogOut,
  Home,
} from "lucide-react";
import { SidebarNav } from "./sidebar-nav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const [{ data: profile }, { count: pendingBookings }] = await Promise.all([
    supabase
      .from("profiles")
      .select("role, full_name")
      .eq("id", user.id)
      .single(),
    supabase
      .from("bookings")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending"),
  ]);

  if (profile?.role !== "teacher") redirect("/student");

  const initials = (profile?.full_name || user.email || "?")
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar — dark theme */}
      <aside className="w-64 bg-sidebar flex flex-col shrink-0 sticky top-0 h-screen">
        {/* Brand */}
        <div className="px-5 py-5 flex items-center gap-2.5">
          <div className="bg-blue-500 rounded-lg p-1.5">
            <GraduationCap className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold text-white tracking-tight">
            AtelierMath
          </span>
        </div>

        {/* Nav — client component with active states */}
        <SidebarNav pendingBookings={pendingBookings ?? 0} />

        {/* Back to site link */}
        <div className="px-3 pb-2">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-500 hover:bg-sidebar-hover hover:text-gray-300 text-sm"
          >
            <Home className="h-[18px] w-[18px]" />
            Retour au site
          </Link>
        </div>

        {/* User section */}
        <div className="px-3 pb-4 border-t border-white/10 pt-3 mx-3">
          <div className="flex items-center gap-3 px-3 py-2 mb-1">
            <div className="w-8 h-8 rounded-full bg-blue-500 text-white text-xs font-bold flex items-center justify-center">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white font-medium truncate">
                {profile?.full_name || "Professeur"}
              </p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>
          </div>
          <form action="/auth/signout" method="POST">
            <button
              type="submit"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-500 hover:bg-red-500/10 hover:text-red-400 text-sm w-full"
            >
              <LogOut className="h-4 w-4" />
              Déconnexion
            </button>
          </form>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
