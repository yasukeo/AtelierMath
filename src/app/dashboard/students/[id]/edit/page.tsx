import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { EditStudentForm } from "./edit-form";

export default async function EditStudentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: student } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();

  if (!student) notFound();

  return <EditStudentForm student={student} />;
}
