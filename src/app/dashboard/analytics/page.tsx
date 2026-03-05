import { createClient } from "@/lib/supabase/server";
import {
  BarChart3,
  Users,
  BookOpen,
  ClipboardList,
  CalendarCheck,
  TrendingUp,
  Clock,
  CheckCircle2,
  FileText,
  Star,
} from "lucide-react";

export default async function AnalyticsPage() {
  const supabase = await createClient();

  // Fetch all analytics data in parallel
  const [
    { data: students },
    { data: lessons },
    { data: homework },
    { data: bookings },
    { data: submissions },
  ] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, level, created_at")
      .eq("role", "student"),
    supabase.from("lessons").select("id, published, target_level, created_at"),
    supabase
      .from("homework")
      .select("id, status, target_level, deadline, created_at"),
    supabase
      .from("bookings")
      .select("id, status, date, guest_level, created_at"),
    supabase
      .from("submissions")
      .select("id, reviewed_at, grade, submitted_at"),
  ]);

  const studentList = students || [];
  const lessonList = lessons || [];
  const homeworkList = homework || [];
  const bookingList = bookings || [];
  const submissionList = submissions || [];

  // --- Student stats ---
  const studentsByLevel = studentList.reduce(
    (acc, s) => {
      const level = s.level || "autre";
      acc[level] = (acc[level] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const levelLabels: Record<string, string> = {
    "2nde": "2nde",
    "1ere": "1ère",
    terminale: "Terminale",
    autre: "Autre",
  };

  const levelColors: Record<string, string> = {
    "2nde": "bg-blue-500",
    "1ere": "bg-emerald-500",
    terminale: "bg-violet-500",
    autre: "bg-gray-400",
  };

  const maxStudentsByLevel = Math.max(...Object.values(studentsByLevel), 1);

  // --- Lesson stats ---
  const publishedCount = lessonList.filter((l) => l.published).length;
  const draftCount = lessonList.length - publishedCount;

  // --- Homework stats ---
  const hwAssigned = homeworkList.filter((h) => h.status === "assigned").length;
  const hwSubmitted = homeworkList.filter(
    (h) => h.status === "submitted"
  ).length;
  const hwReviewed = homeworkList.filter((h) => h.status === "reviewed").length;

  // --- Booking stats ---
  const bookingsPending = bookingList.filter(
    (b) => b.status === "pending"
  ).length;
  const bookingsAccepted = bookingList.filter(
    (b) => b.status === "accepted"
  ).length;
  const bookingsDeclined = bookingList.filter(
    (b) => b.status === "declined"
  ).length;
  const acceptRate =
    bookingsAccepted + bookingsDeclined > 0
      ? Math.round(
          (bookingsAccepted / (bookingsAccepted + bookingsDeclined)) * 100
        )
      : 0;

  // --- Submission stats ---
  const totalSubmissions = submissionList.length;
  const reviewedSubmissions = submissionList.filter(
    (s) => s.reviewed_at
  ).length;
  const pendingReview = totalSubmissions - reviewedSubmissions;

  // --- Monthly new students (last 6 months) ---
  const now = new Date();
  const months: { label: string; count: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
    const label = d.toLocaleDateString("fr-FR", { month: "short" });
    const count = studentList.filter((s) => {
      const date = new Date(s.created_at);
      return date >= d && date <= monthEnd;
    }).length;
    months.push({ label, count });
  }
  const maxMonthly = Math.max(...months.map((m) => m.count), 1);

  // KPI cards
  const kpis = [
    {
      label: "Élèves totaux",
      value: studentList.length,
      icon: Users,
      color: "text-blue-600 bg-blue-50",
    },
    {
      label: "Leçons créées",
      value: lessonList.length,
      icon: BookOpen,
      color: "text-emerald-600 bg-emerald-50",
    },
    {
      label: "Devoirs assignés",
      value: homeworkList.length,
      icon: ClipboardList,
      color: "text-violet-600 bg-violet-50",
    },
    {
      label: "Réservations totales",
      value: bookingList.length,
      icon: CalendarCheck,
      color: "text-amber-600 bg-amber-50",
    },
    {
      label: "Remises reçues",
      value: totalSubmissions,
      icon: FileText,
      color: "text-cyan-600 bg-cyan-50",
    },
    {
      label: "Taux d'acceptation",
      value: `${acceptRate}%`,
      icon: Star,
      color: "text-pink-600 bg-pink-50",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-gray-100">
          <BarChart3 className="h-5 w-5 text-gray-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Statistiques</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            Vue d&apos;ensemble des données de votre plateforme.
          </p>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {kpis.map((kpi) => (
          <div
            key={kpi.label}
            className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm shadow-gray-200/50"
          >
            <div className={`p-2 rounded-lg inline-flex ${kpi.color} mb-3`}>
              <kpi.icon className="h-4 w-4" />
            </div>
            <p className="text-2xl font-bold tracking-tight">{kpi.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{kpi.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Students by level */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm shadow-gray-200/50">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold flex items-center gap-2">
              <Users className="h-4 w-4 text-gray-400" />
              Élèves par niveau
            </h2>
          </div>
          <div className="p-6 space-y-4">
            {Object.entries(studentsByLevel).length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-4">
                Aucun élève inscrit.
              </p>
            ) : (
              Object.entries(studentsByLevel).map(([level, count]) => (
                <div key={level} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">
                      {levelLabels[level] || level}
                    </span>
                    <span className="text-gray-500">{count} élève(s)</span>
                  </div>
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${levelColors[level] || "bg-gray-400"} transition-all`}
                      style={{
                        width: `${(count / maxStudentsByLevel) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Monthly new students chart */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm shadow-gray-200/50">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-gray-400" />
              Nouveaux élèves (6 derniers mois)
            </h2>
          </div>
          <div className="p-6">
            <div className="flex items-end justify-between gap-2 h-40">
              {months.map((m, i) => (
                <div
                  key={i}
                  className="flex-1 flex flex-col items-center gap-1"
                >
                  <span className="text-xs font-medium text-gray-600">
                    {m.count}
                  </span>
                  <div className="w-full bg-gray-100 rounded-t-lg relative overflow-hidden" style={{ height: "100%" }}>
                    <div
                      className="absolute bottom-0 w-full bg-blue-500 rounded-t-lg transition-all"
                      style={{
                        height: `${m.count === 0 ? 4 : (m.count / maxMonthly) * 100}%`,
                        minHeight: "4px",
                      }}
                    />
                  </div>
                  <span className="text-xs text-gray-400 capitalize">
                    {m.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Homework status breakdown */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm shadow-gray-200/50">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold flex items-center gap-2">
              <ClipboardList className="h-4 w-4 text-gray-400" />
              État des devoirs
            </h2>
          </div>
          <div className="p-6">
            {homeworkList.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-4">
                Aucun devoir créé.
              </p>
            ) : (
              <div className="space-y-4">
                <div className="flex gap-2 h-4 rounded-full overflow-hidden bg-gray-100">
                  {hwAssigned > 0 && (
                    <div
                      className="bg-blue-500 rounded-full"
                      style={{
                        width: `${(hwAssigned / homeworkList.length) * 100}%`,
                      }}
                    />
                  )}
                  {hwSubmitted > 0 && (
                    <div
                      className="bg-amber-500 rounded-full"
                      style={{
                        width: `${(hwSubmitted / homeworkList.length) * 100}%`,
                      }}
                    />
                  )}
                  {hwReviewed > 0 && (
                    <div
                      className="bg-green-500 rounded-full"
                      style={{
                        width: `${(hwReviewed / homeworkList.length) * 100}%`,
                      }}
                    />
                  )}
                </div>
                <div className="flex items-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500" />
                    <span className="text-gray-600">
                      Assignés ({hwAssigned})
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-amber-500" />
                    <span className="text-gray-600">
                      Rendus ({hwSubmitted})
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span className="text-gray-600">
                      Corrigés ({hwReviewed})
                    </span>
                  </div>
                </div>

                {/* Submissions overview */}
                <div className="pt-4 border-t border-gray-100 space-y-3">
                  <h3 className="text-sm font-medium text-gray-700">Remises</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-blue-50 rounded-xl p-3 text-center">
                      <p className="text-xl font-bold text-blue-700">
                        {pendingReview}
                      </p>
                      <p className="text-xs text-blue-600">À corriger</p>
                    </div>
                    <div className="bg-green-50 rounded-xl p-3 text-center">
                      <p className="text-xl font-bold text-green-700">
                        {reviewedSubmissions}
                      </p>
                      <p className="text-xs text-green-600">Corrigées</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Booking stats */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm shadow-gray-200/50">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold flex items-center gap-2">
              <CalendarCheck className="h-4 w-4 text-gray-400" />
              Réservations
            </h2>
          </div>
          <div className="p-6">
            {bookingList.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-4">
                Aucune réservation.
              </p>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-amber-50 rounded-xl p-3 text-center">
                    <p className="text-xl font-bold text-amber-700">
                      {bookingsPending}
                    </p>
                    <p className="text-xs text-amber-600">En attente</p>
                  </div>
                  <div className="bg-green-50 rounded-xl p-3 text-center">
                    <p className="text-xl font-bold text-green-700">
                      {bookingsAccepted}
                    </p>
                    <p className="text-xs text-green-600">Acceptées</p>
                  </div>
                  <div className="bg-red-50 rounded-xl p-3 text-center">
                    <p className="text-xl font-bold text-red-700">
                      {bookingsDeclined}
                    </p>
                    <p className="text-xs text-red-600">Déclinées</p>
                  </div>
                </div>

                {/* Accept rate */}
                <div className="pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      Taux d&apos;acceptation
                    </span>
                    <span className="text-sm font-bold text-green-600">
                      {acceptRate}%
                    </span>
                  </div>
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 rounded-full transition-all"
                      style={{ width: `${acceptRate}%` }}
                    />
                  </div>
                </div>

                {/* Lessons stats */}
                <div className="pt-4 border-t border-gray-100">
                  <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                    <BookOpen className="h-3.5 w-3.5" />
                    Leçons
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-emerald-50 rounded-xl p-3 text-center">
                      <p className="text-xl font-bold text-emerald-700">
                        {publishedCount}
                      </p>
                      <p className="text-xs text-emerald-600">Publiées</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-3 text-center">
                      <p className="text-xl font-bold text-gray-600">
                        {draftCount}
                      </p>
                      <p className="text-xs text-gray-500">Brouillons</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
