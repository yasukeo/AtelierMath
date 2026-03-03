"use client";

import { useState } from "react";
import { DAYS } from "@/lib/types";
import { addAvailability } from "./actions";
import { Plus } from "lucide-react";

export function AvailabilityForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const result = await addAvailability(formData);

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

      <div className="grid grid-cols-3 gap-2">
        <select
          name="day"
          required
          className="border rounded-lg px-2 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
        >
          {DAYS.map((d) => (
            <option key={d.value} value={d.value}>
              {d.label}
            </option>
          ))}
        </select>

        <input
          name="start_time"
          type="time"
          required
          defaultValue="17:00"
          className="border rounded-lg px-2 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
        />

        <input
          name="end_time"
          type="time"
          required
          defaultValue="20:00"
          className="border rounded-lg px-2 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="inline-flex items-center gap-1 bg-blue-600 text-white px-4 py-2.5 rounded-xl hover:bg-blue-700 transition text-sm font-medium disabled:opacity-50 w-full justify-center shadow-sm"
      >
        <Plus className="h-4 w-4" />
        {loading ? "Ajout..." : "Ajouter un créneau"}
      </button>
    </form>
  );
}
