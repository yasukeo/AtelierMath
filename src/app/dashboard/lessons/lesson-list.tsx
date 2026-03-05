"use client";

import { useState } from "react";
import { Search, Filter } from "lucide-react";
import type { Lesson } from "@/lib/types";
import { LEVELS } from "@/lib/types";
import { LessonRow } from "./lesson-row";

export function LessonList({ lessons }: { lessons: Lesson[] }) {
  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft">("all");

  const filtered = lessons.filter((l) => {
    const matchesSearch =
      search === "" ||
      l.title.toLowerCase().includes(search.toLowerCase());
    const matchesLevel =
      levelFilter === "all" ||
      (levelFilter === "tous" ? l.target_level === null : l.target_level === levelFilter);
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "published" ? l.published : !l.published);
    return matchesSearch && matchesLevel && matchesStatus;
  });

  return (
    <>
      {/* Search + filter bar */}
      <div className="flex items-center gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher une leçon..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="pl-10 pr-8 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white appearance-none"
          >
            <option value="all">Tous les niveaux</option>
            <option value="tous">Multi-niveaux</option>
            {LEVELS.map((l) => (
              <option key={l.value} value={l.value}>
                {l.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex border border-gray-200 rounded-xl overflow-hidden">
          {([
            { value: "all", label: "Tout" },
            { value: "published", label: "Publiées" },
            { value: "draft", label: "Brouillons" },
          ] as const).map((opt) => (
            <button
              key={opt.value}
              onClick={() => setStatusFilter(opt.value)}
              className={`px-3 py-2 text-xs font-medium transition ${
                statusFilter === opt.value
                  ? "bg-blue-50 text-blue-700"
                  : "bg-white text-gray-500 hover:bg-gray-50"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      {(search || levelFilter !== "all" || statusFilter !== "all") && (
        <p className="text-xs text-gray-400 mb-3">
          {filtered.length} résultat{filtered.length !== 1 ? "s" : ""} sur {lessons.length}
        </p>
      )}

      {/* List */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-500 shadow-sm shadow-gray-200/50">
          {search || levelFilter !== "all" || statusFilter !== "all"
            ? "Aucune leçon ne correspond à vos filtres."
            : "Aucune leçon créée."}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((lesson) => (
            <LessonRow key={lesson.id} lesson={lesson} />
          ))}
        </div>
      )}
    </>
  );
}
