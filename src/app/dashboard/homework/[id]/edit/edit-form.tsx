"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LEVELS } from "@/lib/types";
import { updateHomework } from "../../actions";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface Homework {
  id: string;
  title: string;
  description: string;
  deadline: string | null;
  target_level: string | null;
  target_student: string | null;
}

export function HomeworkEditForm({ homework }: { homework: Homework }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    formData.set("id", homework.id);

    const result = await updateHomework(formData);

    if (!result.success) {
      setError(result.error || "Erreur inconnue");
      setLoading(false);
      return;
    }

    router.push("/dashboard/homework");
  }

  // Format deadline for datetime-local input
  const deadlineValue = homework.deadline
    ? new Date(homework.deadline).toISOString().slice(0, 16)
    : "";

  return (
    <div>
      <Link
        href="/dashboard/homework"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4"
      >
        <ArrowLeft className="h-4 w-4" />
        Retour aux devoirs
      </Link>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl border border-gray-100 p-6 max-w-2xl space-y-4 shadow-sm shadow-gray-200/50"
      >
        {error && (
          <div className="bg-red-50 text-red-600 text-sm rounded-lg p-3">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Titre *
          </label>
          <input
            name="title"
            required
            defaultValue={homework.title}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            rows={4}
            defaultValue={homework.description}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date limite
          </label>
          <input
            name="deadline"
            type="datetime-local"
            defaultValue={deadlineValue}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Niveau cible
          </label>
          <select
            name="target_level"
            defaultValue={homework.target_level || "all"}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          >
            <option value="all">Tous niveaux</option>
            {LEVELS.map((l) => (
              <option key={l.value} value={l.value}>
                {l.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2.5 rounded-xl hover:bg-blue-700 transition disabled:opacity-50 font-medium shadow-sm"
          >
            {loading ? "Enregistrement..." : "Enregistrer"}
          </button>
          <Link
            href="/dashboard/homework"
            className="px-6 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 transition font-medium"
          >
            Annuler
          </Link>
        </div>
      </form>
    </div>
  );
}
