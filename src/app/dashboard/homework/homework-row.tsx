"use client";

import { LEVELS } from "@/lib/types";
import { Pencil, Trash2, Clock, CheckCircle, FileText } from "lucide-react";
import Link from "next/link";
import { deleteHomework } from "./actions";
import { useState } from "react";

interface HomeworkWithSubmissions {
  id: string;
  title: string;
  description: string;
  deadline: string | null;
  target_level: string | null;
  target_student: string | null;
  status: string;
  created_at: string;
  submissions: Array<{
    id: string;
    student_id: string;
    submitted_at: string;
    reviewed_at: string | null;
    feedback: string | null;
    grade: string | null;
    student: { full_name: string; email: string } | null;
  }>;
}

export function HomeworkRow({ homework }: { homework: HomeworkWithSubmissions }) {
  const [deleting, setDeleting] = useState(false);

  const levelLabel = homework.target_level
    ? LEVELS.find((l) => l.value === homework.target_level)?.label
    : "Tous niveaux";

  const submissionCount = homework.submissions?.length ?? 0;
  const reviewedCount =
    homework.submissions?.filter((s) => s.reviewed_at).length ?? 0;

  async function handleDelete() {
    if (!confirm(`Supprimer le devoir "${homework.title}" ?`)) return;
    setDeleting(true);
    await deleteHomework(homework.id);
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md shadow-sm shadow-gray-200/50 transition-all">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-medium truncate">{homework.title}</h3>
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                homework.status === "reviewed"
                  ? "bg-green-50 text-green-700"
                  : homework.status === "submitted"
                    ? "bg-yellow-50 text-yellow-700"
                    : "bg-blue-50 text-blue-700"
              }`}
            >
              {homework.status === "reviewed"
                ? "Corrigé"
                : homework.status === "submitted"
                  ? "Rendu"
                  : "Assigné"}
            </span>
          </div>

          <div className="flex items-center gap-3 text-sm text-gray-500">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-blue-50 text-blue-700">
              {levelLabel}
            </span>
            {homework.deadline && (
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {new Date(homework.deadline).toLocaleDateString("fr-FR")}
              </span>
            )}
            <span className="inline-flex items-center gap-1">
              <FileText className="h-3 w-3" />
              {submissionCount} remise(s) — {reviewedCount} corrigé(s)
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 ml-4">
          <Link
            href={`/dashboard/homework/${homework.id}/edit`}
            className="p-2 text-gray-400 hover:text-blue-600 transition"
          >
            <Pencil className="h-4 w-4" />
          </Link>
          <Link
            href={`/dashboard/homework/${homework.id}`}
            className="px-3 py-1.5 text-sm bg-gray-100 rounded-lg hover:bg-gray-200 transition"
          >
            Détails
          </Link>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="p-2 text-gray-400 hover:text-red-600 transition disabled:opacity-50"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
