"use client";

import { motion } from "framer-motion";
import { BookOpen, Check, Plus } from "lucide-react";
import { Discipline } from "../types";

interface DisciplineCardProps {
  discipline: Discipline;
  semester: number;
  isSelected: boolean;
  onSelect: (id: string, isMultiple: boolean) => void;
}

export const DisciplineCard: React.FC<DisciplineCardProps> = ({
  discipline,
  semester,
  isSelected,
  onSelect,
}) => {
  const handleClick = (e: React.MouseEvent) => {
    onSelect(discipline.id, e.ctrlKey || e.metaKey);
  };

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      onClick={handleClick}
      className={`
        group relative cursor-pointer rounded-2xl p-5 backdrop-blur-sm transition-all duration-200
        ${
          isSelected
            ? "bg-indigo-50/90 dark:bg-indigo-900/40 border-2 border-indigo-500 shadow-lg shadow-indigo-500/20"
            : "bg-white/60 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/50 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-xl"
        }
      `}
    >
      <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100 mb-2 line-clamp-2">
        {discipline.name}
      </h3>

      {discipline.description && (
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 line-clamp-2">
          {discipline.description}
        </p>
      )}

      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
          <BookOpen size={14} />
          <span>{discipline.skills.length} навыков</span>
        </div>
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className={`
            w-8 h-8 rounded-full flex items-center justify-center transition-all
            ${
              isSelected
                ? "bg-indigo-600 text-white shadow-md"
                : "bg-white/80 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-600 text-indigo-600 dark:text-indigo-400 group-hover:border-indigo-400"
            }
          `}
        >
          {isSelected ? <Check size={18} /> : <Plus size={18} />}
        </motion.div>
      </div>
    </motion.div>
  );
};