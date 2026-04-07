"use client";

import { useMemo } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useKnowledgeBaseStore } from "@/src/store/knowledge-base";
import { DISCIPLINES } from "@/src/data/mock-data";
import { DisciplineDashboard } from "@/src/components/discipline-dashboard";

export default function DisciplinePage() {
  const params = useParams();
  const { toggleSkillCompletion } = useKnowledgeBaseStore();
  const { userProfile } = useKnowledgeBaseStore();

  const disciplineId = params.id as string;

  const discipline = useMemo(() => {
    return DISCIPLINES.find((d) => d.id === disciplineId);
  }, [disciplineId]);

  const relatedDisciplines = useMemo(() => {
    if (!discipline) return [];

    // Находим дисциплины, которые используют навыки из этой дисциплины
    return DISCIPLINES.filter(
      (d) =>
        d.id !== discipline.id &&
        d.skills.some((s1) =>
          discipline.skills.some((s2) => s2.type === s1.type),
        ),
    );
  }, [discipline]);

  if (!discipline) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Дисциплина не найдена</h1>
          <Link href="/" className="text-blue-400 hover:text-blue-300">
            Вернуться к карте
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Фоновые элементы */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10">
        {/* Навигация */}
        <nav className="sticky top-0 z-20 bg-slate-950/80 backdrop-blur-md border-b border-slate-700/50">
          <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
            <Link
              href="/"
              className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors w-fit"
            >
              <ArrowLeft size={18} />
              Вернуться к карте
            </Link>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <DisciplineDashboard
            discipline={discipline}
            relatedDisciplines={relatedDisciplines}
            completedSkills={userProfile.completedSkills}
            onSkillToggle={toggleSkillCompletion}
          />
        </main>
      </div>
    </div>
  );
}
