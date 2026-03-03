import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendDeadlineReminderEmail } from "@/lib/email";

// This endpoint can be called by a cron job or manually from admin
// GET /api/reminders?secret=YOUR_SECRET
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");

  // Security check — use a dedicated CRON_SECRET env variable
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret || secret !== cronSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createAdminClient();

  // Find homework with deadline in ~24h
  const now = new Date();
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const tomorrowEnd = new Date(now.getTime() + 48 * 60 * 60 * 1000);

  const { data: homeworks } = await supabase
    .from("homework")
    .select("*")
    .gte("deadline", tomorrow.toISOString())
    .lt("deadline", tomorrowEnd.toISOString())
    .eq("status", "assigned");

  if (!homeworks || homeworks.length === 0) {
    return NextResponse.json({ message: "No reminders to send", count: 0 });
  }

  let sentCount = 0;

  for (const hw of homeworks) {
    // Find students who haven't submitted
    let studentsQuery = supabase
      .from("profiles")
      .select("id, email, full_name")
      .eq("role", "student");

    if (hw.target_student) {
      studentsQuery = studentsQuery.eq("id", hw.target_student);
    } else if (hw.target_level) {
      studentsQuery = studentsQuery.eq("level", hw.target_level);
    }

    const { data: students } = await studentsQuery;
    if (!students) continue;

    // Check who already submitted
    const { data: submissions } = await supabase
      .from("submissions")
      .select("student_id")
      .eq("homework_id", hw.id);

    const submittedIds = new Set(submissions?.map((s) => s.student_id) || []);

    for (const student of students) {
      if (submittedIds.has(student.id)) continue;

      await sendDeadlineReminderEmail(
        student.email,
        student.full_name,
        hw.title,
        hw.deadline!
      );
      sentCount++;
    }
  }

  return NextResponse.json({
    message: `Sent ${sentCount} reminder(s)`,
    count: sentCount,
  });
}
