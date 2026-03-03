"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LEVELS } from "@/lib/types";
import type { Profile } from "@/lib/types";
import { createHomework } from "../actions";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewHomeworkPageClient({
  students,
}: {
  students: Profile[];
}) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [targetType, setTargetType] = useState<"all" | "level" | "student">(
    "all"
  );

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    if (targetType === "all") {
      formData.set("target_level", "all");
      formData.delete("target_student");
    } else if (targetType === "level") {
      formData.delete("target_student");
    } else {
      formData.set("target_level", "all");
    }

    const result = await createHomework(formData);

    if (!result.success) {
      setError(result.error || "Erreur inconnue");
      setLoading(false);
      return;
    }

    router.push("/dashboard/homework");
  }

  return (
    <div>
      <Link
        href="/dashboard/homework"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4"
      >
        <ArrowLeft className="h-4 w-4" />
        Retour aux devoirs
      </Link>

      <h1 className="text-2xl font-bold mb-6">Nouveau devoir</h1>

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
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>

        {/* Target selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Destinataire
          </label>
          <div className="flex gap-3 mb-3">
            {[
              { key: "all" as const, label: "Tous les élèves" },
              { key: "level" as const, label: "Par niveau" },
              { key: "student" as const, label: "Un élève" },
            ].map((opt) => (
              <button
                key={opt.key}
                type="button"
                onClick={() => setTargetType(opt.key)}
                className={`px-3 py-1.5 rounded-lg text-sm border transition ${
                  targetType === opt.key
                    ? "bg-blue-50 border-blue-300 text-blue-700"
                    : "hover:bg-gray-50"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {targetType === "level" && (
            <select
              name="target_level"
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              {LEVELS.map((l) => (
                <option key={l.value} value={l.value}>
                  {l.label}
                </option>
              ))}
            </select>
          )}

          {targetType === "student" && (
            <select
              name="target_student"
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              <option value="">Sélectionner un élève</option>
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.full_name} ({s.email})
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2.5 rounded-xl hover:bg-blue-700 transition disabled:opacity-50 font-medium shadow-sm"
          >
            {loading ? "Création..." : "Créer le devoir"}
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
