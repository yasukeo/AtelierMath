"use client";

import { useState } from "react";
import { addException } from "./actions";
import { Plus } from "lucide-react";

export function ExceptionForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const result = await addException(formData);

    if (!result.success) {
      setError(result.error || "Erreur");
    } else {
      e.currentTarget.reset();
    }
    setLoading(false);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl border border-gray-100 p-5 mb-4 space-y-3 shadow-sm shadow-gray-200/50"
    >
      {error && (
        <div className="bg-red-50 text-red-600 text-sm rounded-lg p-2">
          {error}
        </div>
      )}

      <input
        name="date"
        type="date"
        required
        className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
      />

      <div className="grid grid-cols-2 gap-2">
        <input
          name="start_time"
          type="time"
          placeholder="Début (optionnel)"
          className="border rounded-lg px-2 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <input
          name="end_time"
          type="time"
          placeholder="Fin (optionnel)"
          className="border rounded-lg px-2 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      <select
        name="is_available"
        className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
      >
        <option value="false">Indisponible (bloquer)</option>
        <option value="true">Disponible (créneau supplémentaire)</option>
      </select>

      <input
        name="reason"
        placeholder="Raison (optionnel)"
        className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
      />

      <button
        type="submit"
        disabled={loading}
        className="inline-flex items-center gap-1 bg-blue-600 text-white px-4 py-2.5 rounded-xl hover:bg-blue-700 transition text-sm font-medium disabled:opacity-50 w-full justify-center shadow-sm"
      >
        <Plus className="h-4 w-4" />
        {loading ? "Ajout..." : "Ajouter une exception"}
      </button>
    </form>
  );
}
