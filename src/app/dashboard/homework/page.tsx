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

  const totalHw = (homeworks || []).length;
  const pendingReview = (homeworks || []).filter((h) => h.status === "submitted").length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Devoirs</h1>
          <p className="text-gray-500 text-sm mt-1">
            {totalHw} devoir{totalHw !== 1 ? "s" : ""}
            {pendingReview > 0 && (
              <span className="text-amber-600 font-medium">
                {" "}· {pendingReview} en attente de correction
              </span>
            )}
          </p>
        </div>
        <Link
          href="/dashboard/homework/new"
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl hover:bg-blue-700 transition text-sm font-medium shadow-sm"
        >
          <Plus className="h-4 w-4" />
          Nouveau devoir
        </Link>
      </div>

      {/* Status summary */}
      {totalHw > 0 && (
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-center">
            <p className="text-lg font-bold text-blue-700">
              {(homeworks || []).filter((h) => h.status === "assigned").length}
            </p>
            <p className="text-xs text-blue-600">Assignés</p>
          </div>
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 text-center">
            <p className="text-lg font-bold text-amber-700">{pendingReview}</p>
            <p className="text-xs text-amber-600">Rendus</p>
          </div>
          <div className="bg-green-50 border border-green-100 rounded-xl p-3 text-center">
            <p className="text-lg font-bold text-green-700">
              {(homeworks || []).filter((h) => h.status === "reviewed").length}
            </p>
            <p className="text-xs text-green-600">Corrigés</p>
          </div>
        </div>
      )}

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
