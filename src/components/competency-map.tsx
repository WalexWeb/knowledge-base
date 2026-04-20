"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Map as MapIcon, Lightbulb, X, GraduationCap } from "lucide-react";
import { Discipline } from "../types";
import { DisciplineCard } from "./discipline-card";

interface CompetencyMapProps {
  disciplines: Discipline[];
  selectedDisciplineIds: string[];
  onSelectDiscipline: (id: string, isMultiple: boolean) => void;
  onSkillClick?: (skillId: string) => void;
  onClearSelection?: () => void;
  specializationName?: string;
}

export const CompetencyMap: React.FC<CompetencyMapProps> = ({
  disciplines,
  selectedDisciplineIds,
  onSelectDiscipline,
  onClearSelection,
  specializationName,
}) => {
  const disciplinesBySemester = useMemo(() => {
    const grouped = new Map<number, Discipline[]>();
    disciplines.forEach((d) => {
      if (!grouped.has(d.semester)) grouped.set(d.semester, []);
      grouped.get(d.semester)!.push(d);
    });
    return Array.from(grouped.entries()).sort((a, b) => a[0] - b[0]);
  }, [disciplines]);

  return (
    <div className="w-full">
      {/* Заголовок с иконкой карты */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <MapIcon size={36} className="text-indigo-500 mb-6" />
          <h1 className="text-4xl font-bold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Карта дисциплин
          </h1>
        </motion.div>
        {selectedDisciplineIds.length > 0 && (
          <motion.button
            onClick={onClearSelection}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-50/80 dark:bg-red-900/30 backdrop-blur-sm border border-red-200 dark:border-red-700/50 text-red-700 dark:text-red-200 font-medium transition-all hover:bg-red-100 dark:hover:bg-red-900/50"
          >
            <X size={18} /> Очистить ({selectedDisciplineIds.length})
          </motion.button>
        )}
      </div>

      {/* Совет */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 p-4 rounded-xl bg-blue-50/50 dark:bg-blue-900/20 backdrop-blur-sm border border-blue-200 dark:border-blue-700/30 text-slate-700 dark:text-slate-200 text-sm flex items-center gap-3"
      >
        <Lightbulb size={18} className="text-blue-600 dark:text-blue-400" />
        <span>
          <strong>Совет:</strong> Используйте{" "}
          <kbd className="px-1.5 py-0.5 rounded bg-white/50 dark:bg-slate-800 font-mono text-xs">
            Ctrl
          </kbd>{" "}
          (или{" "}
          <kbd className="px-1.5 py-0.5 rounded bg-white/50 dark:bg-slate-800 font-mono text-xs">
            Cmd
          </kbd>
          ) + клик для выбора нескольких дисциплин.
        </span>
      </motion.div>

      {/* Название специализации – новый блок с дизайном */}
      {specializationName && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mb-8 text-center"
        >
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-linear-to-r from-indigo-50/80 to-purple-50/80 dark:from-indigo-900/30 dark:to-purple-900/30 backdrop-blur-sm border border-indigo-200 dark:border-indigo-700/50 shadow-sm">
            <GraduationCap
              size={20}
              className="text-indigo-500 dark:text-indigo-400"
            />
            <span className="text-xl font-semibold bg-linear-to-r dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
              {specializationName}
            </span>
          </div>
        </motion.div>
      )}

      {/* Семестры */}
      <div className="space-y-12">
        {disciplinesBySemester.map(([semester, sems], idx) => (
          <motion.div
            key={semester}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
          >
            <div className="mb-5 flex items-center gap-4">
              <div className="flex-1 h-px bg-linear-to-r from-transparent via-slate-300 dark:via-slate-700 to-transparent" />
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
                Семестр {semester}
              </h2>
              <div className="flex-1 h-px bg-linear-to-l from-transparent via-slate-300 dark:via-slate-700 to-transparent" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sems.map((discipline) => (
                <DisciplineCard
                  key={discipline.id}
                  discipline={discipline}
                  semester={semester}
                  isSelected={selectedDisciplineIds.includes(discipline.id)}
                  onSelect={onSelectDiscipline}
                />
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
