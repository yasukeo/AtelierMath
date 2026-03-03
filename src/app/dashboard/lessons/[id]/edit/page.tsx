import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { EditLessonForm } from "./edit-form";

export default async function EditLessonPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: lesson } = await supabase
    .from("lessons")
    .select("*")
    .eq("id", id)
    .single();

  if (!lesson) notFound();

  return <EditLessonForm lesson={lesson} />;
}
