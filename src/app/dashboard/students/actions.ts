"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import type { StudentLevel } from "@/lib/types";

export async function createStudent(formData: FormData) {
  const supabase = await createClient();
  const admin = createAdminClient();

  // Verify caller is teacher
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Non authentifié" };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (profile?.role !== "teacher")
    return { success: false, error: "Non autorisé" };

  const fullName = formData.get("full_name") as string;
  const email = formData.get("email") as string;
  const level = formData.get("level") as StudentLevel;
  const notes = (formData.get("notes") as string) || "";
  const password = formData.get("password") as string;

  if (!fullName || !email || !password) {
    return { success: false, error: "Champs obligatoires manquants" };
  }

  // Create auth user with admin client
  const { data: newUser, error: authError } =
    await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: fullName, role: "student" },
    });

  if (authError) {
    return { success: false, error: authError.message };
  }

  // Update profile with level and notes
  if (newUser.user) {
    await admin
      .from("profiles")
      .update({ level, notes })
      .eq("id", newUser.user.id);
  }

  revalidatePath("/dashboard/students");
  return { success: true };
}

export async function updateStudent(formData: FormData) {
  const supabase = await createClient();

  // Verify caller is teacher
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Non authentifié" };

  const { data: callerProfile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (callerProfile?.role !== "teacher")
    return { success: false, error: "Non autorisé" };

  const id = formData.get("id") as string;
  const fullName = formData.get("full_name") as string;
  const level = formData.get("level") as StudentLevel;
  const notes = (formData.get("notes") as string) || "";

  const { error } = await supabase
    .from("profiles")
    .update({ full_name: fullName, level, notes })
    .eq("id", id);

  if (error) return { success: false, error: error.message };

  revalidatePath("/dashboard/students");
  return { success: true };
}

export async function deleteStudent(id: string) {
  const admin = createAdminClient();
  const supabase = await createClient();

  // Verify caller is teacher
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Non authentifié" };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (profile?.role !== "teacher")
    return { success: false, error: "Non autorisé" };

  // Delete from auth (cascades to profiles)
  const { error } = await admin.auth.admin.deleteUser(id);
  if (error) return { success: false, error: error.message };

  revalidatePath("/dashboard/students");
  return { success: true };
}
