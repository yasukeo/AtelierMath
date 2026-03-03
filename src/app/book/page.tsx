import { createAdminClient } from "@/lib/supabase/admin";
import { BookingCalendar } from "./booking-calendar";
import { GraduationCap } from "lucide-react";
import Link from "next/link";
import type { Availability, AvailabilityException } from "@/lib/types";

export default async function BookPage() {
  const admin = createAdminClient();

  // Get teacher's availability (all teachers — MVP assumes single teacher)
  const { data: availability } = await admin
    .from("availability")
    .select("*")
    .eq("is_active", true)
    .order("day")
    .order("start_time");

  const { data: exceptions } = await admin
    .from("availability_exceptions")
    .select("*")
    .gte("date", new Date().toISOString().split("T")[0]);

  // Get existing bookings to exclude taken slots (admin bypasses RLS)
  const { data: bookings } = await admin
    .from("bookings")
    .select("date, start_time, end_time, status")
    .in("status", ["pending", "accepted"])
    .gte("date", new Date().toISOString().split("T")[0]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-white to-violet-50/50">
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-blue-600 rounded-lg p-1.5">
              <GraduationCap className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-gray-900 tracking-tight">AtelierMath</span>
          </Link>
          <Link
            href="/login"
            className="text-sm text-gray-600 hover:text-blue-600 transition font-medium"
          >
            Se connecter
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-2">Réserver une séance</h1>
        <p className="text-gray-600 mb-8">
          Choisissez un créneau disponible (en vert) pour demander une séance de
          cours particulier en mathématiques.
        </p>

        <BookingCalendar
          availability={(availability as Availability[]) || []}
          exceptions={(exceptions as AvailabilityException[]) || []}
          existingBookings={
            bookings?.map((b) => ({
              date: b.date,
              start_time: b.start_time,
            })) || []
          }
        />
      </main>
    </div>
  );
}
