"use client";

import type { Lesson } from "@/lib/types";
import { LEVELS } from "@/lib/types";
import { Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { deleteLesson } from "./actions";
import { useState } from "react";

export function LessonRow({ lesson }: { lesson: Lesson }) {
  const [deleting, setDeleting] = useState(false);
  const levelLabel = lesson.target_level
    ? LEVELS.find((l) => l.value === lesson.target_level)?.label
    : "Tous niveaux";

  async function handleDelete() {
    if (!confirm(`Supprimer la leçon "${lesson.title}" ?`)) return;
    setDeleting(true);
    await deleteLesson(lesson.id);
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center justify-between hover:shadow-md shadow-sm shadow-gray-200/50 transition-all">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-medium truncate">{lesson.title}</h3>
          {lesson.published ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700">
              <Eye className="h-3 w-3" />
              Publiée
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500">
              <EyeOff className="h-3 w-3" />
              Brouillon
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-500">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-blue-50 text-blue-700">
            {levelLabel}
          </span>
          <span>
            {new Date(lesson.created_at).toLocaleDateString("fr-FR")}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 ml-4">
        <Link
          href={`/dashboard/lessons/${lesson.id}/edit`}
          className="p-2 text-gray-400 hover:text-blue-600 transition"
        >
          <Pencil className="h-4 w-4" />
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
  );
}
