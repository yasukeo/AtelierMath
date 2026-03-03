"use client";

import { useState } from "react";
import { reviewSubmission } from "../actions";

export function ReviewForm({ submissionId }: { submissionId: string }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const formData = new FormData(e.currentTarget);
    const result = await reviewSubmission(formData);
    setLoading(false);
    if (!result.success) {
      setError(result.error || "Erreur lors de la correction");
    } else {
      setOpen(false);
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
      >
        Corriger
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-3 p-4 bg-gray-50 rounded-lg space-y-3"
    >
      <input type="hidden" name="submission_id" value={submissionId} />

      {error && (
        <div className="bg-red-50 text-red-600 text-sm rounded-lg p-3">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Note (optionnelle)
        </label>
        <input
          name="grade"
          className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          placeholder="Ex: 15/20, A+, TB..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Feedback
        </label>
        <textarea
          name="feedback"
          rows={3}
          className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          placeholder="Commentaire pour l'élève..."
        />
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-medium disabled:opacity-50"
        >
          {loading ? "Envoi..." : "Envoyer la correction"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="px-4 py-2 border rounded-lg hover:bg-gray-100 transition text-sm"
        >
          Annuler
        </button>
      </div>
    </form>
  );
}
