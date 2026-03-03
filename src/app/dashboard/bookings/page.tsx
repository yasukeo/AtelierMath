import { createClient } from "@/lib/supabase/server";
import { BookingCard } from "./booking-card";

export default async function BookingsPage() {
  const supabase = await createClient();

  const { data: bookings } = await supabase
    .from("bookings")
    .select("*")
    .order("created_at", { ascending: false });

  const pending = bookings?.filter((b) => b.status === "pending") || [];
  const others = bookings?.filter((b) => b.status !== "pending") || [];

  return (
    <div>
      <h1 className="text-2xl font-bold">Réservations</h1>
      <p className="text-gray-500 text-sm mt-1 mb-8">Gérez les demandes de réservation.</p>

      {pending.length > 0 && (
        <div className="mb-8">
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

      <h2 className="text-lg font-semibold mb-4">
        Historique ({others.length})
      </h2>
      {others.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-500 shadow-sm shadow-gray-200/50">
          Aucune réservation.
        </div>
      ) : (
        <div className="space-y-3">
          {others.map((booking) => (
            <BookingCard key={booking.id} booking={booking} />
          ))}
        </div>
      )}
    </div>
  );
}
