import { createClient } from "@/lib/supabase/server";
import {
  Users,
  BookOpen,
  ClipboardList,
  CalendarCheck,
  Plus,
  ArrowRight,
  ArrowUpRight,
  Clock,
  FileText,
  Calendar,
  AlertCircle,
  CheckCircle2,
  User,
  Sparkles,
  BarChart3,
  Eye,
  EyeOff,
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
    { data: recentStudents },
    { data: recentLessons },
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
      .limit(6),
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
      .limit(5),
    supabase
      .from("lessons")
      .select("*", { count: "exact", head: true })
      .eq("published", true),
    supabase
      .from("homework")
      .select("*", { count: "exact", head: true })
      .eq("status", "reviewed"),
    supabase
      .from("profiles")
      .select("id, full_name, level, created_at")
      .eq("role", "student")
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("lessons")
      .select("id, title, published, target_level, created_at")
      .order("created_at", { ascending: false })
      .limit(4),
  ]);

  const statusColors: Record<string, { bg: string; text: string; dot: string; label: string }> = {
    pending: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-400", label: "En attente" },
    accepted: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-400", label: "Acceptée" },
    declined: { bg: "bg-red-50", text: "text-red-700", dot: "bg-red-400", label: "Déclinée" },
    cancelled: { bg: "bg-gray-100", text: "text-gray-500", dot: "bg-gray-400", label: "Annulée" },
  };

  const levelLabels: Record<string, string> = {
    "2nde": "2nde",
    "1ere": "1ère",
    terminale: "Terminale",
    autre: "Autre",
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
    <div className="space-y-6">
      {/* ── Hero Banner ── */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-6 lg:p-8 text-white">
        {/* Decorative circles */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full" />
        <div className="absolute -bottom-14 -left-8 w-56 h-56 bg-white/5 rounded-full" />
        <div className="absolute top-1/2 right-1/4 w-20 h-20 bg-white/5 rounded-full" />

        <div className="relative flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
          <div>
            <p className="text-blue-200 text-sm font-medium capitalize">{dateStr}</p>
            <h1 className="text-2xl lg:text-3xl font-bold mt-1">
              {greeting}, {profile?.full_name || "Professeur"} 👋
            </h1>
            <p className="text-blue-100 mt-2 text-sm max-w-md">
              Voici un résumé de votre activité. Gérez vos élèves, leçons et réservations en un seul endroit.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              { label: "Nouvel élève", href: "/dashboard/students/new", icon: Users },
              { label: "Nouvelle leçon", href: "/dashboard/lessons/new", icon: BookOpen },
              { label: "Nouveau devoir", href: "/dashboard/homework/new", icon: ClipboardList },
            ].map((a) => (
              <Link
                key={a.href}
                href={a.href}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 backdrop-blur-sm text-sm font-medium transition-all"
              >
                <Plus className="h-3.5 w-3.5" />
                {a.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ── Pending bookings alert ── */}
      {(pendingBookings ?? 0) > 0 && (
        <Link
          href="/dashboard/bookings"
          className="flex items-center gap-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-4 hover:shadow-md transition-all group"
        >
          <div className="p-2.5 bg-amber-100 rounded-xl shrink-0">
            <AlertCircle className="h-5 w-5 text-amber-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-amber-800">
              {pendingBookings} réservation{(pendingBookings ?? 0) > 1 ? "s" : ""} en attente de réponse
            </p>
            <p className="text-sm text-amber-600 mt-0.5">
              Des personnes attendent votre confirmation pour leurs séances.
            </p>
          </div>
          <ArrowRight className="h-5 w-5 text-amber-400 group-hover:translate-x-1 transition-transform shrink-0" />
        </Link>
      )}

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Students */}
        <Link
          href="/dashboard/students"
          className="group relative bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-lg hover:shadow-blue-100/50 hover:-translate-y-0.5 transition-all overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-full -translate-y-8 translate-x-8 group-hover:scale-110 transition-transform" />
          <div className="relative">
            <div className="flex items-center justify-between mb-6">
              <div className="p-2.5 rounded-xl bg-blue-100 text-blue-600">
                <Users className="h-5 w-5" />
              </div>
              <ArrowUpRight className="h-4 w-4 text-gray-300 group-hover:text-blue-500 transition-colors" />
            </div>
            <p className="text-3xl font-extrabold tracking-tight text-gray-900">{studentCount ?? 0}</p>
            <p className="text-sm text-gray-500 mt-1">Élèves inscrits</p>
          </div>
        </Link>

        {/* Lessons */}
        <Link
          href="/dashboard/lessons"
          className="group relative bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-lg hover:shadow-emerald-100/50 hover:-translate-y-0.5 transition-all overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-full -translate-y-8 translate-x-8 group-hover:scale-110 transition-transform" />
          <div className="relative">
            <div className="flex items-center justify-between mb-6">
              <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-600">
                <BookOpen className="h-5 w-5" />
              </div>
              <ArrowUpRight className="h-4 w-4 text-gray-300 group-hover:text-emerald-500 transition-colors" />
            </div>
            <p className="text-3xl font-extrabold tracking-tight text-gray-900">
              {publishedLessons ?? 0}
              <span className="text-lg font-medium text-gray-400">/{lessonCount ?? 0}</span>
            </p>
            <p className="text-sm text-gray-500 mt-1">Leçons publiées</p>
          </div>
        </Link>

        {/* Homework */}
        <Link
          href="/dashboard/homework"
          className="group relative bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-lg hover:shadow-violet-100/50 hover:-translate-y-0.5 transition-all overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-violet-50 rounded-full -translate-y-8 translate-x-8 group-hover:scale-110 transition-transform" />
          <div className="relative">
            <div className="flex items-center justify-between mb-6">
              <div className="p-2.5 rounded-xl bg-violet-100 text-violet-600">
                <ClipboardList className="h-5 w-5" />
              </div>
              <ArrowUpRight className="h-4 w-4 text-gray-300 group-hover:text-violet-500 transition-colors" />
            </div>
            <p className="text-3xl font-extrabold tracking-tight text-gray-900">{homeworkCount ?? 0}</p>
            <p className="text-sm text-gray-500 mt-1">
              Devoirs · <span className="text-violet-600 font-medium">{reviewedHomework ?? 0} corrigés</span>
            </p>
          </div>
        </Link>

        {/* Bookings */}
        <Link
          href="/dashboard/bookings"
          className={`group relative bg-white rounded-2xl border p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all overflow-hidden ${
            (pendingBookings ?? 0) > 0
              ? "border-amber-200 hover:shadow-amber-100/50"
              : "border-gray-100 hover:shadow-amber-100/50"
          }`}
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-50 rounded-full -translate-y-8 translate-x-8 group-hover:scale-110 transition-transform" />
          <div className="relative">
            <div className="flex items-center justify-between mb-6">
              <div className="p-2.5 rounded-xl bg-amber-100 text-amber-600">
                <CalendarCheck className="h-5 w-5" />
              </div>
              {(pendingBookings ?? 0) > 0 ? (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-white text-[10px] font-bold animate-pulse">
                  {pendingBookings}
                </span>
              ) : (
                <ArrowUpRight className="h-4 w-4 text-gray-300 group-hover:text-amber-500 transition-colors" />
              )}
            </div>
            <p className="text-3xl font-extrabold tracking-tight text-gray-900">{pendingBookings ?? 0}</p>
            <p className="text-sm text-gray-500 mt-1">Réservations en attente</p>
          </div>
        </Link>
      </div>

      {/* ── Main Grid ── */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* ── Reservations ── */}
        <div className="xl:col-span-5 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h2 className="font-semibold flex items-center gap-2">
              <CalendarCheck className="h-4 w-4 text-blue-500" />
              Dernières réservations
            </h2>
            <Link
              href="/dashboard/bookings"
              className="text-xs text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-1 hover:gap-2 transition-all"
            >
              Tout voir <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="flex-1 divide-y divide-gray-50">
            {!recentBookings || recentBookings.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                <CalendarCheck className="h-10 w-10 mb-3 text-gray-200" />
                <p className="text-sm">Aucune réservation</p>
                <p className="text-xs text-gray-300 mt-1">Les demandes apparaîtront ici.</p>
              </div>
            ) : (
              recentBookings.map((b) => {
                const st = statusColors[b.status] || statusColors.pending;
                return (
                  <div key={b.id} className="px-5 py-3 flex items-center gap-3 hover:bg-gray-50/70 transition">
                    <div className="relative">
                      <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600">
                        {b.guest_name?.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)}
                      </div>
                      <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${st.dot}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{b.guest_name}</p>
                      <p className="text-xs text-gray-400">
                        {new Date(b.date + "T00:00:00").toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}
                        {" · "}
                        {b.start_time?.slice(0, 5)}–{b.end_time?.slice(0, 5)}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded-lg text-[11px] font-semibold ${st.bg} ${st.text}`}>
                      {st.label}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* ── Deadlines ── */}
        <div className="xl:col-span-4 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h2 className="font-semibold flex items-center gap-2">
              <Clock className="h-4 w-4 text-orange-500" />
              Prochaines échéances
            </h2>
            <Link
              href="/dashboard/homework"
              className="text-xs text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-1 hover:gap-2 transition-all"
            >
              Devoirs <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="flex-1">
            {!upcomingDeadlines || upcomingDeadlines.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                <CheckCircle2 className="h-10 w-10 mb-3 text-gray-200" />
                <p className="text-sm">Aucune échéance à venir</p>
                <p className="text-xs text-gray-300 mt-1">Tout est à jour !</p>
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
                      className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50/70 transition group"
                    >
                      <div className={`w-10 h-10 rounded-xl flex flex-col items-center justify-center shrink-0 ${
                        isUrgent ? "bg-red-50 text-red-600" : "bg-gray-50 text-gray-600"
                      }`}>
                        <span className="text-[10px] font-medium uppercase leading-none">
                          {deadline.toLocaleDateString("fr-FR", { month: "short" })}
                        </span>
                        <span className="text-sm font-bold leading-tight">{deadline.getDate()}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate group-hover:text-blue-600 transition-colors">{hw.title}</p>
                        <p className={`text-xs mt-0.5 ${isUrgent ? "text-red-500 font-medium" : "text-gray-400"}`}>
                          {diffDays === 0 ? "Aujourd'hui" : diffDays === 1 ? "Demain" : `Dans ${diffDays} jours`}
                          {hw.target_level && ` · ${levelLabels[hw.target_level] || hw.target_level}`}
                        </p>
                      </div>
                      <ArrowRight className="h-3.5 w-3.5 text-gray-300 opacity-0 group-hover:opacity-100 transition" />
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* ── Quick Actions + Recent lessons ── */}
        <div className="xl:col-span-3 space-y-6">
          {/* Quick actions */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100">
              <Sparkles className="h-4 w-4 text-violet-500" />
              <h2 className="font-semibold">Actions rapides</h2>
            </div>
            <div className="p-3 space-y-1.5">
              {[
                { label: "Ajouter un élève", href: "/dashboard/students/new", icon: Users, color: "text-blue-600 hover:bg-blue-50" },
                { label: "Créer une leçon", href: "/dashboard/lessons/new", icon: BookOpen, color: "text-emerald-600 hover:bg-emerald-50" },
                { label: "Assigner un devoir", href: "/dashboard/homework/new", icon: ClipboardList, color: "text-violet-600 hover:bg-violet-50" },
                { label: "Gérer disponibilités", href: "/dashboard/availability", icon: Calendar, color: "text-orange-600 hover:bg-orange-50" },
                { label: "Voir statistiques", href: "/dashboard/analytics", icon: BarChart3, color: "text-cyan-600 hover:bg-cyan-50" },
              ].map((a) => (
                <Link
                  key={a.href}
                  href={a.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${a.color}`}
                >
                  <a.icon className="h-4 w-4" />
                  <span className="flex-1">{a.label}</span>
                  <ArrowRight className="h-3.5 w-3.5 opacity-40" />
                </Link>
              ))}
            </div>
          </div>

          {/* Recent lessons mini */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h2 className="font-semibold flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-emerald-500" />
                Leçons récentes
              </h2>
            </div>
            <div className="divide-y divide-gray-50">
              {!recentLessons || recentLessons.length === 0 ? (
                <div className="px-5 py-6 text-center text-gray-400 text-xs">
                  Aucune leçon créée.
                </div>
              ) : (
                recentLessons.map((l) => (
                  <Link
                    key={l.id}
                    href={`/dashboard/lessons/${l.id}/edit`}
                    className="flex items-center gap-3 px-5 py-2.5 hover:bg-gray-50/70 transition"
                  >
                    {l.published ? (
                      <Eye className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                    ) : (
                      <EyeOff className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                    )}
                    <span className="text-sm truncate flex-1">{l.title}</span>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom Row ── */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Recent submissions */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h2 className="font-semibold flex items-center gap-2">
              <FileText className="h-4 w-4 text-blue-500" />
              Dernières remises d&apos;élèves
            </h2>
            <Link
              href="/dashboard/homework"
              className="text-xs text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-1 hover:gap-2 transition-all"
            >
              Voir les devoirs <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          {!recentSubmissions || recentSubmissions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
              <FileText className="h-10 w-10 mb-3 text-gray-200" />
              <p className="text-sm">Aucune remise récente</p>
              <p className="text-xs text-gray-300 mt-1">Les soumissions apparaîtront ici.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {recentSubmissions.map((sub) => {
                const student = sub.student as unknown as { full_name: string } | null;
                const homework = sub.homework as unknown as { title: string } | null;
                return (
                  <div key={sub.id} className="px-5 py-3 flex items-center gap-3 hover:bg-gray-50/70 transition">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                      sub.reviewed_at ? "bg-emerald-100 text-emerald-600" : "bg-blue-100 text-blue-600"
                    }`}>
                      {student?.full_name?.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2) || "?"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {student?.full_name || "Élève"}
                      </p>
                      <p className="text-xs text-gray-400 truncate">
                        {homework?.title || "Devoir"} · {new Date(sub.submitted_at).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    {sub.reviewed_at ? (
                      <span className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-emerald-50 text-emerald-700 shrink-0">
                        Corrigé{sub.grade ? ` · ${sub.grade}` : ""}
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-blue-50 text-blue-700 shrink-0">
                        À corriger
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent students */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h2 className="font-semibold flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-500" />
              Derniers élèves inscrits
            </h2>
            <Link
              href="/dashboard/students"
              className="text-xs text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-1 hover:gap-2 transition-all"
            >
              Voir tout <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          {!recentStudents || recentStudents.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
              <Users className="h-10 w-10 mb-3 text-gray-200" />
              <p className="text-sm">Aucun élève inscrit</p>
              <Link
                href="/dashboard/students/new"
                className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition"
              >
                <Plus className="h-3.5 w-3.5" />
                Ajouter un élève
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {recentStudents.map((s) => (
                <Link
                  key={s.id}
                  href={`/dashboard/students/${s.id}/edit`}
                  className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50/70 transition group"
                >
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 text-white flex items-center justify-center text-xs font-bold shrink-0">
                    {s.full_name?.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2) || "?"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate group-hover:text-blue-600 transition-colors">{s.full_name}</p>
                    <p className="text-xs text-gray-400">
                      Inscrit le {new Date(s.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                  </div>
                  {s.level && (
                    <span className="px-2 py-0.5 rounded-lg text-[11px] font-medium bg-blue-50 text-blue-600 shrink-0">
                      {levelLabels[s.level] || s.level}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
