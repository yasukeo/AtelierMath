import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { HomeworkEditForm } from "./edit-form";

export default async function EditHomeworkPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: homework } = await supabase
    .from("homework")
    .select("*")
    .eq("id", id)
    .single();

  if (!homework) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Modifier le devoir</h1>
      <HomeworkEditForm homework={homework} />
    </div>
  );
}
