"use client";

import type { Booking } from "@/lib/types";
import { LEVELS } from "@/lib/types";
import {
  Calendar,
  Clock,
  User,
  Mail,
  MessageSquare,
  Check,
  X,
} from "lucide-react";
import { updateBookingStatus } from "./actions";
import { useState } from "react";

const statusColors: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  accepted: "bg-green-50 text-green-700 border-green-200",
  declined: "bg-red-50 text-red-700 border-red-200",
  cancelled: "bg-gray-50 text-gray-500 border-gray-200",
};

const statusLabels: Record<string, string> = {
  pending: "En attente",
  accepted: "Acceptée",
  declined: "Déclinée",
  cancelled: "Annulée",
};

export function BookingCard({ booking }: { booking: Booking }) {
  const [loading, setLoading] = useState(false);
  const [showDeclineForm, setShowDeclineForm] = useState(false);
  const [declineReason, setDeclineReason] = useState("");

  const levelLabel = booking.guest_level
    ? LEVELS.find((l) => l.value === booking.guest_level)?.label
    : null;

  async function handleAccept() {
    setLoading(true);
    await updateBookingStatus(booking.id, "accepted");
    setLoading(false);
  }

  async function handleDecline() {
    setLoading(true);
    await updateBookingStatus(booking.id, "declined", declineReason);
    setLoading(false);
    setShowDeclineForm(false);
  }

  return (
    <div className={`rounded-2xl border p-5 shadow-sm transition-all ${statusColors[booking.status] || "bg-white border-gray-100 shadow-gray-200/50"}`}>
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="font-medium">{booking.guest_name}</span>
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-medium border ${statusColors[booking.status]}`}
            >
              {statusLabels[booking.status]}
            </span>
          </div>

          <div className="flex items-center gap-4 text-sm">
            <span className="inline-flex items-center gap-1">
              <Mail className="h-3.5 w-3.5" />
              {booking.guest_email}
            </span>
            <span className="inline-flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {new Date(booking.date + "T00:00:00").toLocaleDateString("fr-FR", {
                dateStyle: "long",
              })}
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {booking.start_time.slice(0, 5)} — {booking.end_time.slice(0, 5)}
            </span>
            {levelLabel && (
              <span className="px-2 py-0.5 rounded-full text-xs bg-blue-100 text-blue-700">
                {levelLabel}
              </span>
            )}
          </div>

          {booking.guest_message && (
            <div className="flex items-start gap-1 text-sm mt-1">
              <MessageSquare className="h-3.5 w-3.5 mt-0.5 shrink-0" />
              <span>{booking.guest_message}</span>
            </div>
          )}
        </div>

        {booking.status === "pending" && (
          <div className="flex items-center gap-2 ml-4">
            <button
              onClick={handleAccept}
              disabled={loading}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-medium disabled:opacity-50"
            >
              <Check className="h-4 w-4" />
              Accepter
            </button>
            <button
              onClick={() => setShowDeclineForm(true)}
              disabled={loading}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm font-medium disabled:opacity-50"
            >
              <X className="h-4 w-4" />
              Refuser
            </button>
          </div>
        )}
      </div>

      {showDeclineForm && (
        <div className="mt-3 flex items-center gap-2">
          <input
            value={declineReason}
            onChange={(e) => setDeclineReason(e.target.value)}
            placeholder="Raison du refus (optionnel)"
            className="flex-1 border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-red-500"
          />
          <button
            onClick={handleDecline}
            disabled={loading}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm font-medium disabled:opacity-50"
          >
            {loading ? "..." : "Confirmer le refus"}
          </button>
          <button
            onClick={() => setShowDeclineForm(false)}
            className="px-4 py-2 border rounded-lg hover:bg-gray-100 transition text-sm"
          >
            Annuler
          </button>
        </div>
      )}
    </div>
  );
}
