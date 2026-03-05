import { createClient } from "@/lib/supabase/server";
import {
  Users,
  BookOpen,
  ClipboardList,
  CalendarCheck,
  Plus,
  ArrowRight,
  Clock,
  FileText,
  TrendingUp,
  Calendar,
  AlertCircle,
  CheckCircle2,
  User,
  Mail,
} from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const supabase = await createClient();

  // Fetch all data in parallel
  const [
    { count: studentCount },
    { count: lessonCount },
    { count: homeworkCount },
    { count: pendingBookings },
    { data: profile },
    { data: recentBookings },
    { data: recentSubmissions },
    { data: upcomingDeadlines },
    { count: publishedLessons },
    { count: reviewedHomework },
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
    supabase
      .from("profiles")
      .select("full_name")
      .eq("role", "teacher")
      .limit(1)
      .single(),
    supabase
      .from("bookings")
      .select("id, guest_name, guest_email, date, start_time, end_time, status, created_at")
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("submissions")
      .select("id, submitted_at, reviewed_at, grade, student:student_id(full_name), homework:homework_id(title)")
      .order("submitted_at", { ascending: false })
      .limit(5),
    supabase
      .from("homework")
      .select("id, title, deadline, target_level")
      .not("deadline", "is", null)
      .gte("deadline", new Date().toISOString())
      .order("deadline", { ascending: true })
      .limit(4),
    supabase
      .from("lessons")
      .select("*", { count: "exact", head: true })
      .eq("published", true),
    supabase
      .from("homework")
      .select("*", { count: "exact", head: true })
      .eq("status", "reviewed"),
  ]);

  const stats = [
    {
      label: "Élèves inscrits",
      value: studentCount ?? 0,
      icon: Users,
      href: "/dashboard/students",
      color: "bg-blue-50 text-blue-600",
      iconBg: "bg-blue-100",
    },
    {
      label: "Leçons publiées",
      value: `${publishedLessons ?? 0}/${lessonCount ?? 0}`,
      icon: BookOpen,
      href: "/dashboard/lessons",
      color: "bg-emerald-50 text-emerald-600",
      iconBg: "bg-emerald-100",
    },
    {
      label: "Devoirs",
      value: homeworkCount ?? 0,
      subtitle: `${reviewedHomework ?? 0} corrigé(s)`,
      icon: ClipboardList,
      href: "/dashboard/homework",
      color: "bg-violet-50 text-violet-600",
      iconBg: "bg-violet-100",
    },
    {
      label: "Réservations en attente",
      value: pendingBookings ?? 0,
      icon: CalendarCheck,
      href: "/dashboard/bookings",
      color: "bg-amber-50 text-amber-600",
      iconBg: "bg-amber-100",
      urgent: (pendingBookings ?? 0) > 0,
    },
  ];

  const quickActions = [
    {
      label: "Ajouter un élève",
      href: "/dashboard/students/new",
      icon: Users,
      color: "text-blue-600 bg-blue-50 hover:bg-blue-100",
    },
    {
      label: "Nouvelle leçon",
      href: "/dashboard/lessons/new",
      icon: BookOpen,
      color: "text-emerald-600 bg-emerald-50 hover:bg-emerald-100",
    },
    {
      label: "Nouveau devoir",
      href: "/dashboard/homework/new",
      icon: ClipboardList,
      color: "text-violet-600 bg-violet-50 hover:bg-violet-100",
    },
    {
      label: "Gérer disponibilités",
      href: "/dashboard/availability",
      icon: Calendar,
      color: "text-orange-600 bg-orange-50 hover:bg-orange-100",
    },
  ];

  const statusColors: Record<string, { bg: string; text: string; label: string }> = {
    pending: { bg: "bg-amber-50", text: "text-amber-700", label: "En attente" },
    accepted: { bg: "bg-green-50", text: "text-green-700", label: "Acceptée" },
    declined: { bg: "bg-red-50", text: "text-red-700", label: "Déclinée" },
    cancelled: { bg: "bg-gray-50", text: "text-gray-500", label: "Annulée" },
  };

  const now = new Date();
  const greeting =
    now.getHours() < 12
      ? "Bonjour"
      : now.getHours() < 18
        ? "Bon après-midi"
        : "Bonsoir";

  const dateStr = now.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="space-y-8">
      {/* Welcome header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            {greeting}, {profile?.full_name || "Professeur"} 👋
          </h1>
          <p className="text-gray-500 text-sm mt-1 capitalize">{dateStr}</p>
        </div>
        <div className="flex items-center gap-2">
          {quickActions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${action.color}`}
              title={action.label}
            >
              <Plus className="h-3.5 w-3.5" />
              <span className="hidden xl:inline">{action.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Pending bookings alert */}
      {(pendingBookings ?? 0) > 0 && (
        <Link
          href="/dashboard/bookings"
          className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-2xl p-4 hover:bg-amber-100/80 transition-all group"
        >
          <div className="p-2 bg-amber-100 rounded-xl">
            <AlertCircle className="h-5 w-5 text-amber-600" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-amber-800">
              {pendingBookings} réservation{(pendingBookings ?? 0) > 1 ? "s" : ""} en attente
            </p>
            <p className="text-sm text-amber-600">
              Cliquez pour consulter et répondre aux demandes.
            </p>
          </div>
          <ArrowRight className="h-5 w-5 text-amber-400 group-hover:translate-x-1 transition-transform" />
        </Link>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className={`group bg-white rounded-2xl border p-5 shadow-sm shadow-gray-200/50 hover:shadow-md hover:-translate-y-0.5 transition-all ${
              stat.urgent ? "border-amber-200 ring-1 ring-amber-100" : "border-gray-100"
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2.5 rounded-xl ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
              <ArrowRight className="h-4 w-4 text-gray-300 group-hover:text-gray-500 group-hover:translate-x-0.5 transition-all" />
            </div>
            <p className="text-3xl font-bold tracking-tight">{stat.value}</p>
            <span className="text-sm text-gray-500 mt-1 block">{stat.label}</span>
            {stat.subtitle && (
              <span className="text-xs text-gray-400 block">{stat.subtitle}</span>
            )}
          </Link>
        ))}
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent bookings - takes 2 cols */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm shadow-gray-200/50">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <CalendarCheck className="h-4 w-4 text-gray-400" />
              <h2 className="font-semibold">Dernières réservations</h2>
            </div>
            <Link
              href="/dashboard/bookings"
              className="text-xs text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-1"
            >
              Voir tout <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {!recentBookings || recentBookings.length === 0 ? (
              <div className="px-6 py-10 text-center text-gray-400 text-sm">
                <CalendarCheck className="h-8 w-8 mx-auto mb-2 text-gray-200" />
                Aucune réservation pour le moment.
              </div>
            ) : (
              recentBookings.map((b) => {
                const st = statusColors[b.status] || statusColors.pending;
                return (
                  <div key={b.id} className="px-6 py-3.5 flex items-center gap-4 hover:bg-gray-50/50 transition">
                    <div className={`p-2 rounded-lg ${st.bg}`}>
                      <User className={`h-4 w-4 ${st.text}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{b.guest_name}</p>
                      <p className="text-xs text-gray-400 flex items-center gap-2">
                        <span>{new Date(b.date + "T00:00:00").toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}</span>
                        <span>•</span>
                        <span>{b.start_time?.slice(0, 5)} — {b.end_time?.slice(0, 5)}</span>
                      </p>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${st.bg} ${st.text}`}>
                      {st.label}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Upcoming deadlines + quick actions */}
        <div className="space-y-6">
          {/* Upcoming deadlines */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm shadow-gray-200/50">
            <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100">
              <Clock className="h-4 w-4 text-gray-400" />
              <h2 className="font-semibold">Prochaines échéances</h2>
            </div>
            {!upcomingDeadlines || upcomingDeadlines.length === 0 ? (
              <div className="px-5 py-8 text-center text-gray-400 text-sm">
                <CheckCircle2 className="h-8 w-8 mx-auto mb-2 text-gray-200" />
                Aucune échéance à venir.
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {upcomingDeadlines.map((hw) => {
                  const deadline = new Date(hw.deadline!);
                  const diffDays = Math.ceil(
                    (deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
                  );
                  const isUrgent = diffDays <= 2;
                  return (
                    <Link
                      key={hw.id}
                      href={`/dashboard/homework/${hw.id}`}
                      className="block px-5 py-3 hover:bg-gray-50/50 transition"
                    >
                      <p className="text-sm font-medium truncate">{hw.title}</p>
                      <p className={`text-xs mt-0.5 ${isUrgent ? "text-red-500 font-medium" : "text-gray-400"}`}>
                        {isUrgent && "⚠ "}
                        {deadline.toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}
                        {" — "}
                        {diffDays === 0
                          ? "Aujourd'hui"
                          : diffDays === 1
                            ? "Demain"
                            : `dans ${diffDays} jours`}
                      </p>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick actions */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm shadow-gray-200/50">
            <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100">
              <TrendingUp className="h-4 w-4 text-gray-400" />
              <h2 className="font-semibold">Actions rapides</h2>
            </div>
            <div className="p-3 grid grid-cols-2 gap-2">
              {quickActions.map((action) => (
                <Link
                  key={action.href}
                  href={action.href}
                  className={`flex flex-col items-center gap-2 p-3 rounded-xl text-center transition-all ${action.color}`}
                >
                  <action.icon className="h-5 w-5" />
                  <span className="text-xs font-medium leading-tight">{action.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent submissions */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm shadow-gray-200/50">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-gray-400" />
            <h2 className="font-semibold">Dernières remises d&apos;élèves</h2>
          </div>
          <Link
            href="/dashboard/homework"
            className="text-xs text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-1"
          >
            Voir les devoirs <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        {!recentSubmissions || recentSubmissions.length === 0 ? (
          <div className="px-6 py-10 text-center text-gray-400 text-sm">
            <FileText className="h-8 w-8 mx-auto mb-2 text-gray-200" />
            Aucune remise récente.
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {recentSubmissions.map((sub) => {
              const student = sub.student as unknown as { full_name: string } | null;
              const homework = sub.homework as unknown as { title: string } | null;
              return (
                <div key={sub.id} className="px-6 py-3.5 flex items-center gap-4 hover:bg-gray-50/50 transition">
                  <div className={`p-2 rounded-lg ${sub.reviewed_at ? "bg-green-50" : "bg-blue-50"}`}>
                    <FileText className={`h-4 w-4 ${sub.reviewed_at ? "text-green-600" : "text-blue-600"}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {student?.full_name || "Élève"}{" "}
                      <span className="font-normal text-gray-400">a remis</span>{" "}
                      {homework?.title || "un devoir"}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(sub.submitted_at).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  {sub.reviewed_at ? (
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700">
                      Corrigé{sub.grade ? ` · ${sub.grade}` : ""}
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                      À corriger
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
