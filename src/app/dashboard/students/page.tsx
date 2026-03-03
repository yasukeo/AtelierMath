import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/types";
import { Plus, Users } from "lucide-react";
import Link from "next/link";
import { StudentRow } from "./student-row";

export default async function StudentsPage() {
  const supabase = await createClient();

  const { data: students } = await supabase
    .from("profiles")
    .select("*")
    .eq("role", "student")
    .order("full_name");

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Élèves</h1>
          <p className="text-gray-500 text-sm mt-1">Gérez vos élèves et leurs profils.</p>
        </div>
        <Link
          href="/dashboard/students/new"
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl hover:bg-blue-700 transition text-sm font-medium shadow-sm"
        >
          <Plus className="h-4 w-4" />
          Ajouter un élève
        </Link>
      </div>

      {!students || students.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-500 shadow-sm shadow-gray-200/50">
          <Users className="h-10 w-10 mx-auto mb-3 text-gray-300" />
          Aucun élève pour le moment. Commencez par en ajouter un !
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm shadow-gray-200/50">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Nom
                </th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Niveau
                </th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Notes
                </th>
                <th className="text-right px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {(students as Profile[]).map((student) => (
                <StudentRow key={student.id} student={student} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
