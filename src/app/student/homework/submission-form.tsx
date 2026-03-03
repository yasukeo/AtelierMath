"use client";

import { useState } from "react";
import { submitHomework } from "./actions";
import { Send } from "lucide-react";

interface Props {
  homeworkId: string;
  existingComment: string;
  hasSubmitted: boolean;
}

export function SubmissionForm({
  homeworkId,
  existingComment,
  hasSubmitted,
}: Props) {
  const [open, setOpen] = useState(hasSubmitted);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const result = await submitHomework(formData);

    if (!result.success) {
      setError(result.error || "Erreur");
    } else {
      setSuccess(true);
    }
    setLoading(false);
  }

  if (success) {
    return (
      <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm text-blue-700">
        ✅ Votre travail a été soumis avec succès !
      </div>
    );
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="mt-4 inline-flex items-center gap-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
      >
        <Send className="h-4 w-4" />
        Rendre mon travail
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 p-4 bg-gray-50 rounded-lg space-y-3">
      <input type="hidden" name="homework_id" value={homeworkId} />

      {error && (
        <div className="bg-red-50 text-red-600 text-sm rounded-lg p-2">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Commentaire
        </label>
        <textarea
          name="comment"
          rows={3}
          defaultValue={existingComment}
          className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          placeholder="Ajoutez un commentaire (optionnel)..."
        />
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium disabled:opacity-50"
        >
          <Send className="h-4 w-4" />
          {loading
            ? "Envoi..."
            : hasSubmitted
              ? "Soumettre à nouveau"
              : "Soumettre"}
        </button>
        {!hasSubmitted && (
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="px-4 py-2 border rounded-lg hover:bg-gray-100 transition text-sm"
          >
            Annuler
          </button>
        )}
      </div>
    </form>
  );
}
