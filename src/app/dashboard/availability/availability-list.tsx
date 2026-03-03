"use client";

import type { Availability } from "@/lib/types";
import { DAYS } from "@/lib/types";
import { Trash2 } from "lucide-react";
import { deleteAvailability } from "./actions";
import { useState } from "react";

export function AvailabilityList({ slots }: { slots: Availability[] }) {
  if (slots.length === 0) {
    return (
      <div className="text-sm text-gray-500 text-center py-4">
        Aucun créneau défini
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {slots.map((slot) => (
        <SlotItem key={slot.id} slot={slot} />
      ))}
    </div>
  );
}

function SlotItem({ slot }: { slot: Availability }) {
  const [deleting, setDeleting] = useState(false);
  const dayLabel = DAYS.find((d) => d.value === slot.day)?.label || slot.day;

  async function handleDelete() {
    setDeleting(true);
    await deleteAvailability(slot.id);
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 px-4 py-3 flex items-center justify-between shadow-sm shadow-gray-200/50">
      <div className="text-sm">
        <span className="font-medium">{dayLabel}</span>
        <span className="text-gray-500 ml-2">
          {slot.start_time.slice(0, 5)} — {slot.end_time.slice(0, 5)}
        </span>
      </div>
      <button
        onClick={handleDelete}
        disabled={deleting}
        className="p-1.5 text-gray-400 hover:text-red-600 transition disabled:opacity-50"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}
