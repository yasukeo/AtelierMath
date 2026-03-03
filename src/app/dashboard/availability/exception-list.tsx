"use client";

import type { AvailabilityException } from "@/lib/types";
import { Trash2, Ban, CalendarPlus } from "lucide-react";
import { deleteException } from "./actions";
import { useState } from "react";

export function ExceptionList({
  exceptions,
}: {
  exceptions: AvailabilityException[];
}) {
  if (exceptions.length === 0) {
    return (
      <div className="text-sm text-gray-500 text-center py-4">
        Aucune exception définie
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {exceptions.map((exc) => (
        <ExceptionItem key={exc.id} exception={exc} />
      ))}
    </div>
  );
}

function ExceptionItem({ exception }: { exception: AvailabilityException }) {
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    setDeleting(true);
    await deleteException(exception.id);
  }

  return (
    <div
      className={`rounded-lg border px-4 py-3 flex items-center justify-between ${
        exception.is_available ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
      }`}
    >
      <div className="text-sm">
        <div className="flex items-center gap-2">
          {exception.is_available ? (
            <CalendarPlus className="h-4 w-4 text-green-600" />
          ) : (
            <Ban className="h-4 w-4 text-red-600" />
          )}
          <span className="font-medium">
            {new Date(exception.date + "T00:00:00").toLocaleDateString("fr-FR", {
              dateStyle: "long",
            })}
          </span>
        </div>
        {exception.start_time && (
          <span className="text-gray-500 ml-6">
            {exception.start_time.slice(0, 5)} —{" "}
            {exception.end_time?.slice(0, 5)}
          </span>
        )}
        {exception.reason && (
          <p className="text-gray-500 text-xs ml-6 mt-0.5">
            {exception.reason}
          </p>
        )}
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
