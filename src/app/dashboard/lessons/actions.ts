"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { StudentLevel } from "@/lib/types";

export async function createLesson(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Non authentifié" };

  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const targetLevel = formData.get("target_level") as string;
  const published = formData.get("published") === "on";

  const { error } = await supabase.from("lessons").insert({
    title,
    content: content || "",
    target_level: targetLevel === "all" ? null : (targetLevel as StudentLevel),
    published,
    created_by: user.id,
  });

  if (error) return { success: false, error: error.message };

  revalidatePath("/dashboard/lessons");
  return { success: true };
}

export async function updateLesson(formData: FormData) {
  const supabase = await createClient();

  const id = formData.get("id") as string;
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const targetLevel = formData.get("target_level") as string;
  const published = formData.get("published") === "on";

  const { error } = await supabase
    .from("lessons")
    .update({
      title,
      content: content || "",
      target_level:
        targetLevel === "all" ? null : (targetLevel as StudentLevel),
      published,
    })
    .eq("id", id);

  if (error) return { success: false, error: error.message };

  revalidatePath("/dashboard/lessons");
  return { success: true };
}

export async function deleteLesson(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("lessons").delete().eq("id", id);
  if (error) return { success: false, error: error.message };

  revalidatePath("/dashboard/lessons");
  return { success: true };
}
