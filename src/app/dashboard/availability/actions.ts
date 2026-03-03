"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { DayOfWeek } from "@/lib/types";

export async function addAvailability(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Non authentifié" };

  const day = formData.get("day") as DayOfWeek;
  const startTime = formData.get("start_time") as string;
  const endTime = formData.get("end_time") as string;

  if (!day || !startTime || !endTime) {
    return { success: false, error: "Champs obligatoires manquants" };
  }

  if (startTime >= endTime) {
    return { success: false, error: "L'heure de début doit être avant l'heure de fin" };
  }

  const { error } = await supabase.from("availability").insert({
    teacher_id: user.id,
    day,
    start_time: startTime,
    end_time: endTime,
  });

  if (error) return { success: false, error: error.message };

  revalidatePath("/dashboard/availability");
  return { success: true };
}

export async function deleteAvailability(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("availability").delete().eq("id", id);
  if (error) return { success: false, error: error.message };

  revalidatePath("/dashboard/availability");
  return { success: true };
}

export async function addException(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Non authentifié" };

  const date = formData.get("date") as string;
  const isAvailable = formData.get("is_available") === "true";
  const startTime = (formData.get("start_time") as string) || null;
  const endTime = (formData.get("end_time") as string) || null;
  const reason = (formData.get("reason") as string) || "";

  if (isAvailable && startTime && endTime && startTime >= endTime) {
    return { success: false, error: "L'heure de début doit être avant l'heure de fin" };
  }

  const { error } = await supabase.from("availability_exceptions").insert({
    teacher_id: user.id,
    date,
    start_time: startTime,
    end_time: endTime,
    is_available: isAvailable,
    reason,
  });

  if (error) return { success: false, error: error.message };

  revalidatePath("/dashboard/availability");
  return { success: true };
}

export async function deleteException(id: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("availability_exceptions")
    .delete()
    .eq("id", id);
  if (error) return { success: false, error: error.message };

  revalidatePath("/dashboard/availability");
  return { success: true };
}
