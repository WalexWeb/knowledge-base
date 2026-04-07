"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Discipline } from "../types";
import { DisciplineCard } from "./discipline-card";
import { X } from "lucide-react";

interface CompetencyMapProps {
  disciplines: Discipline[];
  selectedDisciplineIds: string[];
  onSelectDiscipline: (id: string, isMultiple: boolean) => void;
  onSkillClick?: (skillId: string) => void;
  onClearSelection?: () => void;
}

export const CompetencyMap: React.FC<CompetencyMapProps> = ({
  disciplines,
  selectedDisciplineIds,
  onSelectDiscipline,
  onSkillClick,
  onClearSelection,
}) => {
  // Группируем по семестрам
  const disciplinesBySemester = useMemo(() => {
    const grouped = new Map<number, Discipline[]>();
    disciplines.forEach((d) => {
      if (!grouped.has(d.semester)) {
        grouped.set(d.semester, []);
      }
      grouped.get(d.semester)!.push(d);
    });
    return Array.from(grouped.entries()).sort((a, b) => a[0] - b[0]);
  }, [disciplines]);

  return (
    <div className="w-full">
      {/* Заголовок */}
      <div className="flex items-center justify-between mb-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
            Карта дисциплин
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            Интерактивная карта развития в информационной безопасности
          </p>
        </motion.div>
        {selectedDisciplineIds.length > 0 && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={onClearSelection}
            className="flex items-center gap-2 px-4 py-2 bg-linear-to-br from-red-100 to-red-50 dark:from-red-900/30 dark:to-red-800/20 hover:from-red-200 hover:to-red-100 dark:hover:from-red-900/50 dark:hover:to-red-800/30 text-red-700 dark:text-red-200 rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <X size={18} />
            Очистить ({selectedDisciplineIds.length})
          </motion.button>
        )}
      </div>

      {/* Легенда */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8 p-5 bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-700/50 backdrop-blur-xl shadow-sm flex flex-wrap gap-8"
      >
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 rounded-lg bg-linear-to-br from-blue-400 to-blue-600 shadow-md"></div>
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
            УК - Универсальные компетенции
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 rounded-lg bg-linear-to-br from-emerald-400 to-emerald-600 shadow-md"></div>
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
            ПК - Профессиональные компетенции
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 rounded-lg bg-linear-to-br from-purple-400 to-purple-600 shadow-md"></div>
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
            ОПК - Общеспециальные компетенции
          </span>
        </div>
      </motion.div>

      {/* Сетка по семестрам */}
      <div className="space-y-12">
        {disciplinesBySemester.map(([semester, sems]) => (
          <motion.div
            key={semester}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: semester * 0.05 }}
          >
            {/* Заголовок семестра */}
            <div className="mb-5 flex items-center gap-4">
              <div className="flex-1 h-0.5 bg-linear-to-br from-slate-200 dark:from-slate-700/50 to-transparent rounded-full"></div>
              <motion.h2
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-2xl font-bold text-slate-800 dark:text-white min-w-max bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text"
              >
                Семестр {semester}
              </motion.h2>
              <div className="flex-1 h-0.5 bg-linear-to-l from-slate-200 dark:from-slate-700/50 to-transparent rounded-full"></div>
            </div>

            {/* Карточки дисциплин */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {sems.map((discipline, index) => (
                <motion.div
                  key={discipline.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <DisciplineCard
                    discipline={discipline}
                    semester={semester}
                    isSelected={selectedDisciplineIds.includes(discipline.id)}
                    onSelect={onSelectDiscipline}
                    onSkillClick={onSkillClick}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Совет */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-12 p-5 bg-linear-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border border-blue-200 dark:border-blue-700/50 rounded-2xl text-slate-700 dark:text-slate-300 text-sm font-medium backdrop-blur-xl shadow-sm hover:shadow-md transition-shadow"
      >
        <div className="flex gap-3">
          <span className="text-lg">💡</span>
          <div>
            <strong>Совет:</strong> Используйте Ctrl (Cmd на Mac) + клик для
            мультивыбора дисциплин и сравнения входных навыков.
          </div>
        </div>
      </motion.div>
    </div>
  );
};
