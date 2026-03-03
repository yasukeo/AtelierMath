"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { sendBookingConfirmationEmail } from "@/lib/email";

export async function updateBookingStatus(
  bookingId: string,
  newStatus: "accepted" | "declined",
  declineReason?: string
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Non authentifié" };

  // Get booking
  const { data: booking } = await supabase
    .from("bookings")
    .select("*")
    .eq("id", bookingId)
    .single();

  if (!booking) return { success: false, error: "Réservation introuvable" };

  const oldStatus = booking.status;

  // Update status
  const { error } = await supabase
    .from("bookings")
    .update({
      status: newStatus,
      decline_reason: declineReason || null,
    })
    .eq("id", bookingId);

  if (error) return { success: false, error: error.message };

  // Log status change
  await supabase.from("booking_status_history").insert({
    booking_id: bookingId,
    old_status: oldStatus,
    new_status: newStatus,
    changed_by: user.id,
  });

  // Send email to guest
  try {
    await sendBookingConfirmationEmail(
      booking.guest_email,
      booking.guest_name,
      new Date(booking.date + "T00:00:00").toLocaleDateString("fr-FR", {
        dateStyle: "long",
      }),
      booking.start_time.slice(0, 5),
      newStatus === "accepted",
      declineReason
    );
  } catch (e) {
    console.error("Error sending booking email:", e);
  }

  revalidatePath("/dashboard/bookings");
  return { success: true };
}
