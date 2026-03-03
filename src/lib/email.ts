import { Resend } from "resend";
import { createAdminClient } from "@/lib/supabase/admin";

let _resend: Resend | null = null;

function getResend() {
  if (!_resend) {
    _resend = new Resend(process.env.RESEND_API_KEY);
  }
  return _resend;
}

function getFrom() {
  return process.env.EMAIL_FROM || "AtelierMath <noreply@example.com>";
}

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  template: string;
  payload?: Record<string, unknown>;
}

async function logEmail(
  options: SendEmailOptions,
  status: "sent" | "failed",
  error?: string
) {
  try {
    const supabase = createAdminClient();
    await supabase.from("email_logs").insert({
      to_email: options.to,
      subject: options.subject,
      template: options.template,
      payload: options.payload || {},
      status,
      error,
    });
  } catch (e) {
    console.error("Failed to log email:", e);
  }
}

export async function sendEmail(options: SendEmailOptions) {
  try {
    const { error } = await getResend().emails.send({
      from: getFrom(),
      to: options.to,
      subject: options.subject,
      html: options.html,
    });

    if (error) {
      await logEmail(options, "failed", error.message);
      return { success: false, error: error.message };
    }

    await logEmail(options, "sent");
    return { success: true };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    await logEmail(options, "failed", msg);
    return { success: false, error: msg };
  }
}

// ─── Email Templates ─────────────────────────────────────────

export async function sendHomeworkAssignedEmail(
  to: string,
  studentName: string,
  homeworkTitle: string,
  deadline: string | null
) {
  const deadlineText = deadline
    ? `<p><strong>Date limite :</strong> ${new Date(deadline).toLocaleDateString("fr-FR", { dateStyle: "long", timeZone: "Africa/Casablanca" })}</p>`
    : "";

  return sendEmail({
    to,
    subject: `Nouveau devoir : ${homeworkTitle}`,
    template: "homework_assigned",
    payload: { studentName, homeworkTitle, deadline },
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">📚 Nouveau devoir assigné</h2>
        <p>Bonjour ${studentName},</p>
        <p>Un nouveau devoir vous a été assigné : <strong>${homeworkTitle}</strong></p>
        ${deadlineText}
        <p>Connectez-vous à votre espace pour le consulter et rendre votre travail.</p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/student/homework" 
           style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; margin-top: 16px;">
          Voir le devoir
        </a>
        <p style="margin-top: 24px; color: #6b7280; font-size: 14px;">— AtelierMath</p>
      </div>
    `,
  });
}

export async function sendFeedbackEmail(
  to: string,
  studentName: string,
  homeworkTitle: string,
  grade: string | null,
  feedback: string | null
) {
  return sendEmail({
    to,
    subject: `Correction disponible : ${homeworkTitle}`,
    template: "feedback_sent",
    payload: { studentName, homeworkTitle, grade, feedback },
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">✅ Correction disponible</h2>
        <p>Bonjour ${studentName},</p>
        <p>Votre devoir <strong>${homeworkTitle}</strong> a été corrigé.</p>
        ${grade ? `<p><strong>Note :</strong> ${grade}</p>` : ""}
        ${feedback ? `<p><strong>Commentaire :</strong> ${feedback}</p>` : ""}
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/student/homework" 
           style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; margin-top: 16px;">
          Voir la correction
        </a>
        <p style="margin-top: 24px; color: #6b7280; font-size: 14px;">— AtelierMath</p>
      </div>
    `,
  });
}

export async function sendDeadlineReminderEmail(
  to: string,
  studentName: string,
  homeworkTitle: string,
  deadline: string
) {
  return sendEmail({
    to,
    subject: `⏰ Rappel : devoir "${homeworkTitle}" à rendre demain`,
    template: "deadline_reminder",
    payload: { studentName, homeworkTitle, deadline },
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #f59e0b;">⏰ Rappel de date limite</h2>
        <p>Bonjour ${studentName},</p>
        <p>Le devoir <strong>${homeworkTitle}</strong> est à rendre <strong>demain</strong> 
           (${new Date(deadline).toLocaleDateString("fr-FR", { dateStyle: "long", timeZone: "Africa/Casablanca" })}).</p>
        <p>N'oubliez pas de soumettre votre travail !</p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/student/homework" 
           style="display: inline-block; background: #f59e0b; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; margin-top: 16px;">
          Rendre le devoir
        </a>
        <p style="margin-top: 24px; color: #6b7280; font-size: 14px;">— AtelierMath</p>
      </div>
    `,
  });
}

export async function sendNewBookingEmail(
  to: string,
  guestName: string,
  guestEmail: string,
  date: string,
  startTime: string,
  level: string | null,
  message: string
) {
  return sendEmail({
    to,
    subject: `Nouvelle demande de réservation de ${guestName}`,
    template: "new_booking",
    payload: { guestName, guestEmail, date, startTime, level, message },
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">📅 Nouvelle demande de réservation</h2>
        <p><strong>Nom :</strong> ${guestName}</p>
        <p><strong>Email :</strong> ${guestEmail}</p>
        <p><strong>Date :</strong> ${date}</p>
        <p><strong>Heure :</strong> ${startTime}</p>
        ${level ? `<p><strong>Niveau :</strong> ${level}</p>` : ""}
        ${message ? `<p><strong>Message :</strong> ${message}</p>` : ""}
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/bookings" 
           style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; margin-top: 16px;">
          Gérer les réservations
        </a>
        <p style="margin-top: 24px; color: #6b7280; font-size: 14px;">— AtelierMath</p>
      </div>
    `,
  });
}

export async function sendBookingConfirmationEmail(
  to: string,
  guestName: string,
  date: string,
  startTime: string,
  accepted: boolean,
  declineReason?: string
) {
  const statusText = accepted ? "acceptée ✅" : "déclinée ❌";
  const color = accepted ? "#16a34a" : "#dc2626";

  return sendEmail({
    to,
    subject: `Votre réservation a été ${statusText}`,
    template: accepted ? "booking_accepted" : "booking_declined",
    payload: { guestName, date, startTime, accepted, declineReason },
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: ${color};">Réservation ${statusText}</h2>
        <p>Bonjour ${guestName},</p>
        <p>Votre demande de réservation pour le <strong>${date}</strong> à <strong>${startTime}</strong> 
           a été <strong>${statusText}</strong>.</p>
        ${!accepted && declineReason ? `<p><strong>Raison :</strong> ${declineReason}</p>` : ""}
        ${accepted ? "<p>À bientôt !</p>" : "<p>N'hésitez pas à choisir un autre créneau.</p>"}
        <p style="margin-top: 24px; color: #6b7280; font-size: 14px;">— AtelierMath</p>
      </div>
    `,
  });
}
