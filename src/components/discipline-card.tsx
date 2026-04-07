"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Discipline } from "../types";
import { SkillCloud } from "./skill-cloud";
import { ChevronDown, BookOpen, Clock, Award } from "lucide-react";

interface DisciplineCardProps {
  discipline: Discipline;
  semester: number;
  isSelected?: boolean;
  onSelect?: (id: string, isMultiple: boolean) => void;
  onSkillClick?: (skillId: string) => void;
}

const SEMINARY_COLORS = [
  { badge: "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-200" },
  { badge: "bg-cyan-100 dark:bg-cyan-900/40 text-cyan-700 dark:text-cyan-200" },
  {
    badge:
      "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-200",
  },
  {
    badge:
      "bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-200",
  },
  {
    badge:
      "bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-200",
  },
];

export const DisciplineCard: React.FC<DisciplineCardProps> = ({
  discipline,
  semester,
  isSelected = false,
  onSelect,
  onSkillClick,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const colorIndex = semester % SEMINARY_COLORS.length;
  const colors = SEMINARY_COLORS[colorIndex];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`
        relative p-4 rounded-lg cursor-pointer transition-all duration-300
        border
        ${
          isSelected
            ? "border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20 shadow-sm shadow-blue-200/50 dark:shadow-blue-500/10"
            : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-600"
        }
      `}
      onClick={(e) => {
        if (!isExpanded) {
          onSelect?.(discipline.id, e.ctrlKey || e.metaKey);
        }
      }}
    >
      {/* Семестр иконка */}
      <div className="absolute top-3 right-3 flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700/50 px-2.5 py-1.5 rounded-lg">
        <Award size={14} />
        {semester} сем.
      </div>

      {/* Название */}
      <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-2 pr-16">
        {discipline.name}
      </h3>

      {/* Количество навыков и часов */}
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <span className="text-xs font-medium px-2 py-1 rounded bg-slate-100 dark:bg-slate-700/50 text-slate-700 dark:text-slate-300 flex items-center gap-1">
          <BookOpen size={13} />
          {discipline.skills.length}
        </span>
        {discipline.hours && (
          <span className="text-xs font-medium px-2 py-1 rounded bg-slate-100 dark:bg-slate-700/50 text-slate-700 dark:text-slate-300 flex items-center gap-1">
            <Clock size={13} />
            {discipline.hours} ч.
          </span>
        )}
      </div>

      {/* Кнопка развертывания */}
      <motion.button
        onClick={(e) => {
          e.stopPropagation();
          setIsExpanded(!isExpanded);
        }}
        className="flex items-center gap-1 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors font-medium"
      >
        <span>{isExpanded ? "Скрыть" : "Показать"}</span>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown size={14} />
        </motion.div>
      </motion.button>

      {/* Развернутое содержание */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700"
          >
            {discipline.description && (
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-3 leading-relaxed">
                {discipline.description}
              </p>
            )}
            <SkillCloud
              skills={discipline.skills}
              onSkillClick={onSkillClick}
              className="justify-start"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
