"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export async function submitHomework(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Non authentifié" };

  const homeworkId = formData.get("homework_id") as string;
  const comment = (formData.get("comment") as string) || "";

  // Check if already submitted
  const { data: existing } = await supabase
    .from("submissions")
    .select("id")
    .eq("homework_id", homeworkId)
    .eq("student_id", user.id)
    .single();

  if (existing) {
    // Update existing submission
    const { error } = await supabase
      .from("submissions")
      .update({
        comment,
        submitted_at: new Date().toISOString(),
      })
      .eq("id", existing.id);

    if (error) return { success: false, error: error.message };
  } else {
    // Create new submission
    const { error } = await supabase.from("submissions").insert({
      homework_id: homeworkId,
      student_id: user.id,
      comment,
    });

    if (error) return { success: false, error: error.message };

    // Update homework status via admin (students don't have UPDATE on homework)
    const admin = createAdminClient();
    await admin
      .from("homework")
      .update({ status: "submitted" })
      .eq("id", homeworkId);
  }

  revalidatePath("/student/homework");
  return { success: true };
}
