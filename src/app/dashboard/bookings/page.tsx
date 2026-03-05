import { createClient } from "@/lib/supabase/server";
import { CalendarCheck } from "lucide-react";
import { BookingCard } from "./booking-card";

export default async function BookingsPage() {
  const supabase = await createClient();

  const { data: bookings } = await supabase
    .from("bookings")
    .select("*")
    .order("created_at", { ascending: false });

  const pending = bookings?.filter((b) => b.status === "pending") || [];
  const accepted = bookings?.filter((b) => b.status === "accepted") || [];
  const declined = bookings?.filter((b) => b.status === "declined") || [];
  const cancelled = bookings?.filter((b) => b.status === "cancelled") || [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Réservations</h1>
        <p className="text-gray-500 text-sm mt-1">
          {(bookings || []).length} réservation{(bookings || []).length !== 1 ? "s" : ""} au total.
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 text-center">
          <p className="text-2xl font-bold text-amber-700">{pending.length}</p>
          <p className="text-xs text-amber-600 font-medium">En attente</p>
        </div>
        <div className="bg-green-50 border border-green-100 rounded-2xl p-4 text-center">
          <p className="text-2xl font-bold text-green-700">{accepted.length}</p>
          <p className="text-xs text-green-600 font-medium">Acceptées</p>
        </div>
        <div className="bg-red-50 border border-red-100 rounded-2xl p-4 text-center">
          <p className="text-2xl font-bold text-red-700">{declined.length}</p>
          <p className="text-xs text-red-600 font-medium">Déclinées</p>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 text-center">
          <p className="text-2xl font-bold text-gray-600">{cancelled.length}</p>
          <p className="text-xs text-gray-500 font-medium">Annulées</p>
        </div>
      </div>

      {/* Pending section */}
      {pending.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-4 text-amber-600 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            En attente ({pending.length})
          </h2>
          <div className="space-y-3">
            {pending.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </div>
        </div>
      )}

      {/* Accepted section */}
      {accepted.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-4 text-green-600 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500" />
            Acceptées ({accepted.length})
          </h2>
          <div className="space-y-3">
            {accepted.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </div>
        </div>
      )}

      {/* Declined + Cancelled */}
      {(declined.length > 0 || cancelled.length > 0) && (
        <div>
          <h2 className="text-lg font-semibold mb-4 text-gray-500">
            Historique ({declined.length + cancelled.length})
          </h2>
          <div className="space-y-3">
            {[...declined, ...cancelled].map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {(!bookings || bookings.length === 0) && (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-500 shadow-sm shadow-gray-200/50">
          <CalendarCheck className="h-10 w-10 mx-auto mb-3 text-gray-300" />
          Aucune réservation pour le moment.
        </div>
      )}
    </div>
  );
}
