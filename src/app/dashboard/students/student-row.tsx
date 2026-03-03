"use client";

import type { Profile } from "@/lib/types";
import { LEVELS } from "@/lib/types";
import { Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { deleteStudent } from "./actions";
import { useState } from "react";

export function StudentRow({ student }: { student: Profile }) {
  const [deleting, setDeleting] = useState(false);

  const levelLabel =
    LEVELS.find((l) => l.value === student.level)?.label || "—";

  async function handleDelete() {
    if (!confirm(`Supprimer l'élève ${student.full_name} ?`)) return;
    setDeleting(true);
    await deleteStudent(student.id);
    setDeleting(false);
  }

  return (
    <tr className="border-b border-gray-100 last:border-0 hover:bg-blue-50/30">
      <td className="px-5 py-3.5 font-medium">{student.full_name}</td>
      <td className="px-5 py-3.5 text-gray-600">{student.email}</td>
      <td className="px-5 py-3.5">
        <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-blue-50 text-blue-700">
          {levelLabel}
        </span>
      </td>
      <td className="px-5 py-3.5 text-gray-500 text-sm max-w-xs truncate">
        {student.notes || "—"}
      </td>
      <td className="px-5 py-3.5 text-right">
        <div className="flex items-center justify-end gap-2">
          <Link
            href={`/dashboard/students/${student.id}/edit`}
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
      </td>
    </tr>
  );
}
