import { createClient } from "@/lib/supabase/server";
import { LEVELS } from "@/lib/types";
import type { Lesson } from "@/lib/types";
import Markdown from "react-markdown";
import { BookOpen, FileText } from "lucide-react";

export default async function StudentLessonsPage() {
  const supabase = await createClient();

  const { data: lessons } = await supabase
    .from("lessons")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="text-2xl font-bold">Leçons</h1>
      <p className="text-gray-500 text-sm mt-1 mb-8">Consultez les leçons publiées par votre professeur.</p>

      {!lessons || lessons.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-500 shadow-sm shadow-gray-200/50">
          <BookOpen className="h-10 w-10 mx-auto mb-3 text-gray-300" />
          Aucune leçon disponible pour le moment.
        </div>
      ) : (
        <div className="space-y-4">
          {(lessons as Lesson[]).map((lesson) => {
            const levelLabel = lesson.target_level
              ? LEVELS.find((l) => l.value === lesson.target_level)?.label
              : "Tous niveaux";

            return (
              <div
                key={lesson.id}
                className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm shadow-gray-200/50"
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-1.5 rounded-lg bg-blue-50">
                    <BookOpen className="h-4 w-4 text-blue-600" />
                  </div>
                  <h2 className="text-lg font-semibold">{lesson.title}</h2>
                  <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-blue-50 text-blue-700">
                    {levelLabel}
                  </span>
                </div>

                {lesson.content && (
                  <div className="prose prose-sm max-w-none text-gray-700">
                    <Markdown>{lesson.content}</Markdown>
                  </div>
                )}

                {lesson.file_url && (
                  <a
                    href={lesson.file_url}
                    target="_blank"
                    className="inline-flex items-center gap-1 mt-4 text-sm text-blue-600 hover:underline"
                  >
                    <FileText className="h-4 w-4" />
                    Télécharger le document
                  </a>
                )}

                <p className="text-xs text-gray-400 mt-4">
                  Publié le{" "}
                  {new Date(lesson.created_at).toLocaleDateString("fr-FR", {
                    dateStyle: "long",
                  })}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
