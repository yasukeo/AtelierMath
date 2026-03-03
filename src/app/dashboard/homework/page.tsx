import { createClient } from "@/lib/supabase/server";
import { Plus, ClipboardList } from "lucide-react";
import Link from "next/link";
import { HomeworkRow } from "./homework-row";

export default async function HomeworkPage() {
  const supabase = await createClient();

  const { data: homeworks } = await supabase
    .from("homework")
    .select(
      "*, submissions(id, student_id, submitted_at, reviewed_at, feedback, grade, comment, file_url, student:student_id(full_name, email))"
    )
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Devoirs</h1>
          <p className="text-gray-500 text-sm mt-1">Assignez et corrigez les devoirs.</p>
        </div>
        <Link
          href="/dashboard/homework/new"
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl hover:bg-blue-700 transition text-sm font-medium shadow-sm"
        >
          <Plus className="h-4 w-4" />
          Nouveau devoir
        </Link>
      </div>

      {!homeworks || homeworks.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-500 shadow-sm shadow-gray-200/50">
          <ClipboardList className="h-10 w-10 mx-auto mb-3 text-gray-300" />
          Aucun devoir créé. Commencez par en créer un !
        </div>
      ) : (
        <div className="space-y-3">
          {homeworks.map((hw) => (
            <HomeworkRow key={hw.id} homework={hw} />
          ))}
        </div>
      )}
    </div>
  );
}
