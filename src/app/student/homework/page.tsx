import { createClient } from "@/lib/supabase/server";
import { LEVELS } from "@/lib/types";
import {
  Clock,
  CheckCircle,
  AlertTriangle,
  FileText,
} from "lucide-react";
import { SubmissionForm } from "./submission-form";

export default async function StudentHomeworkPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Get homework (RLS filters to student's level/assignments)
  const { data: homeworks } = await supabase
    .from("homework")
    .select("*")
    .order("deadline", { ascending: true });

  // Get student's submissions
  const { data: submissions } = await supabase
    .from("submissions")
    .select("*")
    .eq("student_id", user!.id);

  const submissionMap = new Map(
    submissions?.map((s) => [s.homework_id, s]) || []
  );

  return (
    <div>
      <h1 className="text-2xl font-bold">Devoirs</h1>
      <p className="text-gray-500 text-sm mt-1 mb-8">Vos devoirs et soumissions.</p>

      {!homeworks || homeworks.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-500 shadow-sm shadow-gray-200/50">
          Aucun devoir pour le moment.
        </div>
      ) : (
        <div className="space-y-4">
          {homeworks.map((hw) => {
            const submission = submissionMap.get(hw.id);
            const isOverdue =
              hw.deadline && new Date(hw.deadline) < new Date() && !submission;
            const levelLabel = hw.target_level
              ? LEVELS.find((l) => l.value === hw.target_level)?.label
              : "Tous";

            return (
              <div key={hw.id} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm shadow-gray-200/50">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h2 className="text-lg font-semibold">{hw.title}</h2>
                    <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                      <span className="px-2 py-0.5 rounded-full text-xs bg-blue-50 text-blue-700">
                        {levelLabel}
                      </span>
                      {hw.deadline && (
                        <span
                          className={`inline-flex items-center gap-1 ${isOverdue ? "text-red-600" : ""}`}
                        >
                          {isOverdue ? (
                            <AlertTriangle className="h-3.5 w-3.5" />
                          ) : (
                            <Clock className="h-3.5 w-3.5" />
                          )}
                          {isOverdue ? "En retard — " : "Date limite : "}
                          {new Date(hw.deadline).toLocaleDateString("fr-FR", {
                            dateStyle: "long",
                          })}
                        </span>
                      )}
                    </div>
                  </div>

                  {submission?.reviewed_at && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700">
                      <CheckCircle className="h-3.5 w-3.5" />
                      Corrigé
                    </span>
                  )}
                </div>

                {hw.description && (
                  <p className="text-gray-700 text-sm mb-4 whitespace-pre-wrap">
                    {hw.description}
                  </p>
                )}

                {hw.file_url && (
                  <a
                    href={hw.file_url}
                    target="_blank"
                    className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline mb-4"
                  >
                    <FileText className="h-3.5 w-3.5" />
                    Pièce jointe du devoir
                  </a>
                )}

                {/* Submission feedback */}
                {submission?.reviewed_at && (
                  <div className="mt-4 p-4 bg-green-50 rounded-lg">
                    <p className="text-sm font-medium text-green-700 mb-1">
                      Correction
                      {submission.grade && ` — Note : ${submission.grade}`}
                    </p>
                    {submission.feedback && (
                      <p className="text-sm text-green-800">
                        {submission.feedback}
                      </p>
                    )}
                  </div>
                )}

                {/* Submit/resubmit form */}
                {!submission?.reviewed_at && (
                  <SubmissionForm
                    homeworkId={hw.id}
                    existingComment={submission?.comment || ""}
                    hasSubmitted={!!submission}
                  />
                )}

                {submission && !submission.reviewed_at && (
                  <p className="text-xs text-gray-400 mt-2">
                    Remis le{" "}
                    {new Date(submission.submitted_at).toLocaleDateString(
                      "fr-FR",
                      { dateStyle: "long" }
                    )}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
