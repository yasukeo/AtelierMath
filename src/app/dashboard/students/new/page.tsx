"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LEVELS } from "@/lib/types";
import { createStudent } from "../actions";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewStudentPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const result = await createStudent(formData);

    if (!result.success) {
      setError(result.error || "Erreur inconnue");
      setLoading(false);
      return;
    }

    router.push("/dashboard/students");
  }

  return (
    <div>
      <Link
        href="/dashboard/students"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4"
      >
        <ArrowLeft className="h-4 w-4" />
        Retour aux élèves
      </Link>

      <h1 className="text-2xl font-bold mb-6">Nouvel élève</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl border border-gray-100 p-6 max-w-lg space-y-4 shadow-sm shadow-gray-200/50"
      >
        {error && (
          <div className="bg-red-50 text-red-600 text-sm rounded-lg p-3">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nom complet *
          </label>
          <input
            name="full_name"
            required
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email *
          </label>
          <input
            name="email"
            type="email"
            required
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mot de passe *
          </label>
          <input
            name="password"
            type="password"
            required
            minLength={6}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            placeholder="Min. 6 caractères"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Niveau
          </label>
          <select
            name="level"
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          >
            {LEVELS.map((l) => (
              <option key={l.value} value={l.value}>
                {l.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notes internes
          </label>
          <textarea
            name="notes"
            rows={3}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            placeholder="Notes visibles uniquement par vous..."
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2.5 rounded-xl hover:bg-blue-700 transition disabled:opacity-50 font-medium shadow-sm"
          >
            {loading ? "Création..." : "Créer l'élève"}
          </button>
          <Link
            href="/dashboard/students"
            className="px-6 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 transition font-medium"
          >
            Annuler
          </Link>
        </div>
      </form>
    </div>
  );
}
