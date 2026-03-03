import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { LEVELS } from "@/lib/types";
import { ArrowLeft, Clock, User, FileText, CheckCircle } from "lucide-react";
import Link from "next/link";
import { ReviewForm } from "./review-form";

export default async function HomeworkDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: homework } = await supabase
    .from("homework")
    .select("*")
    .eq("id", id)
    .single();

  if (!homework) notFound();

  const { data: submissions } = await supabase
    .from("submissions")
    .select("*, student:student_id(full_name, email)")
    .eq("homework_id", id)
    .order("submitted_at", { ascending: false });

  const levelLabel = homework.target_level
    ? LEVELS.find((l) => l.value === homework.target_level)?.label
    : "Tous niveaux";

  return (
    <div>
      <Link
        href="/dashboard/homework"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4"
      >
        <ArrowLeft className="h-4 w-4" />
        Retour aux devoirs
      </Link>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-8 shadow-sm shadow-gray-200/50">
        <h1 className="text-2xl font-bold mb-2">{homework.title}</h1>
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-blue-50 text-blue-700">
            {levelLabel}
          </span>
          {homework.deadline && (
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              Date limite :{" "}
              {new Date(homework.deadline).toLocaleDateString("fr-FR", {
                dateStyle: "long",
              })}
            </span>
          )}
        </div>
        {homework.description && (
          <p className="text-gray-700 whitespace-pre-wrap">
            {homework.description}
          </p>
        )}
      </div>

      <h2 className="text-lg font-semibold mb-4">
        Remises ({submissions?.length ?? 0})
      </h2>

      {!submissions || submissions.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center text-gray-500 shadow-sm shadow-gray-200/50">
          Aucune remise pour ce devoir.
        </div>
      ) : (
        <div className="space-y-4">
          {submissions.map((sub) => {
            const student = sub.student as {
              full_name: string;
              email: string;
            } | null;
            return (
              <div key={sub.id} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm shadow-gray-200/50">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <span className="font-medium">
                      {student?.full_name || "Élève"}
                    </span>
                    <span className="text-sm text-gray-500">
                      {student?.email}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">
                    Remis le{" "}
                    {new Date(sub.submitted_at).toLocaleDateString("fr-FR", {
                      dateStyle: "long",
                    })}
                  </span>
                </div>

                {sub.comment && (
                  <p className="text-sm text-gray-600 mb-3 bg-gray-50 rounded-lg p-3">
                    {sub.comment}
                  </p>
                )}

                {sub.file_url && (
                  <a
                    href={sub.file_url}
                    target="_blank"
                    className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline mb-3"
                  >
                    <FileText className="h-3.5 w-3.5" />
                    Voir le fichier remis
                  </a>
                )}

                {sub.reviewed_at ? (
                  <div className="mt-3 p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2 text-green-700 text-sm font-medium mb-1">
                      <CheckCircle className="h-4 w-4" />
                      Corrigé
                      {sub.grade && ` — Note : ${sub.grade}`}
                    </div>
                    {sub.feedback && (
                      <p className="text-sm text-green-800">{sub.feedback}</p>
                    )}
                  </div>
                ) : (
                  <ReviewForm submissionId={sub.id} />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
