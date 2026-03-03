import { createClient } from "@/lib/supabase/server";
import { BookOpen, ClipboardList } from "lucide-react";
import Link from "next/link";

export default async function StudentDashboard() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, level")
    .eq("id", user!.id)
    .single();

  // Count lessons visible to this student
  const { count: lessonCount } = await supabase
    .from("lessons")
    .select("*", { count: "exact", head: true })
    .eq("published", true);

  // Count homework (we rely on RLS to filter)
  const { count: homeworkCount } = await supabase
    .from("homework")
    .select("*", { count: "exact", head: true });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">
        Bonjour {profile?.full_name || "Élève"} 👋
      </h1>
      <p className="text-gray-500 mb-8">
        Bienvenue dans votre espace de travail.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Link
          href="/student/lessons"
          className="group bg-white rounded-2xl border border-gray-100 p-6 shadow-sm shadow-gray-200/50 hover:shadow-md hover:-translate-y-0.5 transition-all"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-xl bg-green-50 text-green-600">
              <BookOpen className="h-5 w-5" />
            </div>
          </div>
          <p className="text-3xl font-bold tracking-tight">{lessonCount ?? 0}</p>
          <span className="text-sm text-gray-500 mt-1 block">Leçons disponibles</span>
        </Link>

        <Link
          href="/student/homework"
          className="group bg-white rounded-2xl border border-gray-100 p-6 shadow-sm shadow-gray-200/50 hover:shadow-md hover:-translate-y-0.5 transition-all"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600">
              <ClipboardList className="h-5 w-5" />
            </div>
          </div>
          <p className="text-3xl font-bold tracking-tight">{homeworkCount ?? 0}</p>
          <span className="text-sm text-gray-500 mt-1 block">Devoirs</span>
        </Link>
      </div>
    </div>
  );
}
