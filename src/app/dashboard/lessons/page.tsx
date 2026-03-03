import { createClient } from "@/lib/supabase/server";
import { Plus, BookOpen } from "lucide-react";
import Link from "next/link";
import { LessonRow } from "./lesson-row";

export default async function LessonsPage() {
  const supabase = await createClient();

  const { data: lessons } = await supabase
    .from("lessons")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Leçons</h1>
          <p className="text-gray-500 text-sm mt-1">Créez et gérez vos leçons.</p>
        </div>
        <Link
          href="/dashboard/lessons/new"
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl hover:bg-blue-700 transition text-sm font-medium shadow-sm"
        >
          <Plus className="h-4 w-4" />
          Nouvelle leçon
        </Link>
      </div>

      {!lessons || lessons.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-500 shadow-sm shadow-gray-200/50">
          <BookOpen className="h-10 w-10 mx-auto mb-3 text-gray-300" />
          Aucune leçon publiée. Commencez par en créer une !
        </div>
      ) : (
        <div className="space-y-3">
          {lessons.map((lesson) => (
            <LessonRow key={lesson.id} lesson={lesson} />
          ))}
        </div>
      )}
    </div>
  );
}
