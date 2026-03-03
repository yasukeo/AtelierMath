"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { StudentLevel } from "@/lib/types";
import {
  sendHomeworkAssignedEmail,
  sendFeedbackEmail,
} from "@/lib/email";

export async function createHomework(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Non authentifié" };

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const deadline = formData.get("deadline") as string;
  const targetLevel = formData.get("target_level") as string;
  const targetStudent = formData.get("target_student") as string;

  const { data: homework, error } = await supabase
    .from("homework")
    .insert({
      title,
      description: description || "",
      deadline: deadline || null,
      target_level:
        targetLevel === "all" ? null : (targetLevel as StudentLevel),
      target_student: targetStudent || null,
      created_by: user.id,
    })
    .select()
    .single();

  if (error) return { success: false, error: error.message };

  // Send emails to targeted students
  try {
    let students: { email: string; full_name: string }[] = [];

    if (targetStudent) {
      const { data } = await supabase
        .from("profiles")
        .select("email, full_name")
        .eq("id", targetStudent)
        .single();
      if (data) students = [data];
    } else {
      let query = supabase
        .from("profiles")
        .select("email, full_name")
        .eq("role", "student");
      if (targetLevel && targetLevel !== "all") {
        query = query.eq("level", targetLevel);
      }
      const { data } = await query;
      if (data) students = data;
    }

    await Promise.allSettled(
      students.map((s) =>
        sendHomeworkAssignedEmail(
          s.email,
          s.full_name,
          title,
          deadline || null
        )
      )
    );
  } catch (e) {
    console.error("Error sending homework emails:", e);
  }

  revalidatePath("/dashboard/homework");
  return { success: true };
}

export async function updateHomework(formData: FormData) {
  const supabase = await createClient();

  const id = formData.get("id") as string;
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const deadline = formData.get("deadline") as string;
  const targetLevel = formData.get("target_level") as string;

  const { error } = await supabase
    .from("homework")
    .update({
      title,
      description: description || "",
      deadline: deadline || null,
      target_level:
        targetLevel === "all" ? null : (targetLevel as StudentLevel),
    })
    .eq("id", id);

  if (error) return { success: false, error: error.message };

  revalidatePath("/dashboard/homework");
  return { success: true };
}

export async function deleteHomework(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("homework").delete().eq("id", id);
  if (error) return { success: false, error: error.message };

  revalidatePath("/dashboard/homework");
  return { success: true };
}

export async function reviewSubmission(formData: FormData) {
  const supabase = await createClient();

  const submissionId = formData.get("submission_id") as string;
  const feedback = formData.get("feedback") as string;
  const grade = formData.get("grade") as string;

  const { data: submission, error } = await supabase
    .from("submissions")
    .update({
      feedback: feedback || null,
      grade: grade || null,
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", submissionId)
    .select("*, homework:homework_id(title)")
    .single();

  if (error) return { success: false, error: error.message };

  // Update homework status
  await supabase
    .from("homework")
    .update({ status: "reviewed" })
    .eq("id", submission.homework_id);

  // Send feedback email
  try {
    const { data: student } = await supabase
      .from("profiles")
      .select("email, full_name")
      .eq("id", submission.student_id)
      .single();

    if (student) {
      const hwTitle =
        (submission.homework as { title: string } | null)?.title || "Devoir";
      await sendFeedbackEmail(
        student.email,
        student.full_name,
        hwTitle,
        grade || null,
        feedback || null
      );
    }
  } catch (e) {
    console.error("Error sending feedback email:", e);
  }

  revalidatePath("/dashboard/homework");
  return { success: true };
}
