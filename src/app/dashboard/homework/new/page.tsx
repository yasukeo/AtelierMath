import { createClient } from "@/lib/supabase/server";
import NewHomeworkPageClient from "./homework-form";

export default async function NewHomeworkPage() {
  const supabase = await createClient();

  const { data: students } = await supabase
    .from("profiles")
    .select("*")
    .eq("role", "student")
    .order("full_name");

  return <NewHomeworkPageClient students={students || []} />;
}
