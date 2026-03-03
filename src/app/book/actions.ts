"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { sendNewBookingEmail } from "@/lib/email";
import type { StudentLevel } from "@/lib/types";
import { SESSION_DURATION_MINUTES } from "@/lib/types";

export async function createBooking(formData: FormData) {
  const supabase = createAdminClient();

  const guestName = formData.get("guest_name") as string;
  const guestEmail = formData.get("guest_email") as string;
  const guestLevel = formData.get("guest_level") as string;
  const guestMessage = (formData.get("guest_message") as string) || "";
  const date = formData.get("date") as string;
  const startTime = formData.get("start_time") as string;

  if (!guestName || !guestEmail || !date || !startTime) {
    return { success: false, error: "Champs obligatoires manquants" };
  }

  // Calculate end time (start + 150 min)
  const [h, m] = startTime.split(":").map(Number);
  const totalMin = h * 60 + m + SESSION_DURATION_MINUTES;
  const endH = Math.floor(totalMin / 60)
    .toString()
    .padStart(2, "0");
  const endM = (totalMin % 60).toString().padStart(2, "0");
  const endTime = `${endH}:${endM}`;

  // Get teacher id (first teacher)
  const { data: teacher } = await supabase
    .from("profiles")
    .select("id, email")
    .eq("role", "teacher")
    .limit(1)
    .single();

  if (!teacher) {
    return { success: false, error: "Aucun professeur disponible" };
  }

  // Check if slot is already booked
  const { data: existing } = await supabase
    .from("bookings")
    .select("id")
    .eq("date", date)
    .eq("start_time", startTime)
    .in("status", ["pending", "accepted"])
    .limit(1);

  if (existing && existing.length > 0) {
    return { success: false, error: "Ce créneau est déjà réservé" };
  }

  const { error } = await supabase.from("bookings").insert({
    guest_name: guestName,
    guest_email: guestEmail,
    guest_level:
      guestLevel && guestLevel !== "" ? (guestLevel as StudentLevel) : null,
    guest_message: guestMessage,
    date,
    start_time: startTime,
    end_time: endTime,
    teacher_id: teacher.id,
  });

  if (error) return { success: false, error: error.message };

  // Send email to teacher
  try {
    await sendNewBookingEmail(
      teacher.email,
      guestName,
      guestEmail,
      new Date(date + "T00:00:00").toLocaleDateString("fr-FR", {
        dateStyle: "long",
      }),
      startTime,
      guestLevel || null,
      guestMessage
    );
  } catch (e) {
    console.error("Error sending booking email:", e);
  }

  return { success: true };
}
