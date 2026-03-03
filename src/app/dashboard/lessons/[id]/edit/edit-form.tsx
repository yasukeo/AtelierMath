"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LEVELS } from "@/lib/types";
import type { Lesson } from "@/lib/types";
import { updateLesson } from "../../actions";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export function EditLessonForm({ lesson }: { lesson: Lesson }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const result = await updateLesson(formData);

    if (!result.success) {
      setError(result.error || "Erreur inconnue");
      setLoading(false);
      return;
    }

    router.push("/dashboard/lessons");
  }

  return (
    <div>
      <Link
        href="/dashboard/lessons"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4"
      >
        <ArrowLeft className="h-4 w-4" />
        Retour aux leçons
      </Link>

      <h1 className="text-2xl font-bold mb-6">Modifier — {lesson.title}</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl border p-6 max-w-2xl space-y-4"
      >
        <input type="hidden" name="id" value={lesson.id} />

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
            defaultValue={lesson.title}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Niveau cible
          </label>
          <select
            name="target_level"
            defaultValue={lesson.target_level || "all"}
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

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Contenu (Markdown)
          </label>
          <textarea
            name="content"
            rows={12}
            defaultValue={lesson.content}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none font-mono text-sm"
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="published"
            id="published"
            defaultChecked={lesson.published}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="published" className="text-sm text-gray-700">
            Publiée
          </label>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 font-medium"
          >
            {loading ? "Sauvegarde..." : "Sauvegarder"}
          </button>
          <Link
            href="/dashboard/lessons"
            className="px-6 py-2.5 rounded-lg border hover:bg-gray-50 transition"
          >
            Annuler
          </Link>
        </div>
      </form>
    </div>
  );
}
