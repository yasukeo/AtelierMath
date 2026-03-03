import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  GraduationCap,
  BookOpen,
  ClipboardList,
  Home,
  LogOut,
} from "lucide-react";

const navItems = [
  { href: "/student", label: "Accueil", icon: Home },
  { href: "/student/lessons", label: "Leçons", icon: BookOpen },
  { href: "/student/homework", label: "Devoirs", icon: ClipboardList },
];

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "student") redirect("/dashboard");

  const initials = (profile?.full_name || user.email || "?")
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-white to-violet-50/50">
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-5">
            <Link href="/" className="flex items-center gap-2">
              <div className="bg-blue-600 rounded-lg p-1.5">
                <GraduationCap className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold text-gray-900 tracking-tight">AtelierMath</span>
            </Link>
            <nav className="flex items-center gap-1 ml-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-700 transition font-medium"
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center">
              {initials}
            </div>
            <span className="text-sm text-gray-600 font-medium hidden sm:block">
              {profile?.full_name || user.email}
            </span>
            <form action="/auth/signout" method="POST">
              <button
                type="submit"
                className="p-2 text-gray-400 hover:text-red-500 transition rounded-lg hover:bg-red-50"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
