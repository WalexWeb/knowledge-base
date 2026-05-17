"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useMemo } from "react";
import { Skill } from "../types";

interface SkillCloudProps {
  skills: Skill[];
  onSkillClick?: (skillId: string) => void;
  className?: string;
  maxHeight?: string;
  selectedSkillIds?: string[];
}

export const SkillCloud: React.FC<SkillCloudProps> = ({
  skills,
  onSkillClick,
  className = "",
  maxHeight = "500px",
  selectedSkillIds = [],
}) => {
  // Группировка по типу компетенций
  const groupedSkills = useMemo(() => {
    const groups: Record<string, Skill[]> = {
      УК: [],
      ПК: [],
      ОПК: [],
      Другие: [],
    };
    skills.forEach((skill) => {
      if (groups[skill.type]) groups[skill.type].push(skill);
      else groups["Другие"].push(skill);
    });
    return Object.fromEntries(
      Object.entries(groups).filter(([, arr]) => arr.length > 0),
    );
  }, [skills]);

  // Стили бейджей типов
  const getTypeBadge = (type: string) => {
    const base =
      "px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wide";
    switch (type) {
      case "УК":
        return `${base} bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300`;
      case "ПК":
        return `${base} bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300`;
      case "ОПК":
        return `${base} bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300`;
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div
        className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col"
        style={{ maxHeight }}
      >
        {/* Шапка */}
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between shrink-0">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              Компетенции
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {skills.length} навыков в программе
            </p>
          </div>

          {selectedSkillIds.length > 0 && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={() =>
                selectedSkillIds.forEach((id) => onSkillClick?.(id))
              }
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 text-xs font-medium hover:bg-indigo-200 dark:hover:bg-indigo-900/60 transition-colors"
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              Сбросить ({selectedSkillIds.length})
            </motion.button>
          )}
        </div>

        {/* Область прокрутки */}
        <div className="p-5 overflow-y-auto flex-1">
          <AnimatePresence mode="popLayout">
            {Object.entries(groupedSkills).map(([type, typeSkills]) => (
              <motion.div
                key={type}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="mb-6 last:mb-0"
              >
                {/* Заголовок группы */}
                <div className="flex items-center gap-2 mb-3">
                  <span className={getTypeBadge(type)}>{type}</span>
                  <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
                  <span className="text-xs text-slate-400 font-mono">
                    {typeSkills.length}
                  </span>
                </div>

                {/* Сетка навыков */}
                <div className="flex flex-wrap gap-2">
                  {typeSkills.map((skill) => {
                    const isSelected = selectedSkillIds.includes(skill.id);

                    return (
                      <motion.button
                        key={skill.id}
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        whileHover={{ y: -1 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onSkillClick?.(skill.id)}
                        className={`
                          relative px-4 py-2.5 rounded-xl text-sm font-medium
                          border transition-all duration-200 text-left
                          min-w-22.5 max-w-full wrap-break-word whitespace-normal
                          focus:outline-none focus:ring-2 focus:ring-indigo-500/30
                          ${
                            isSelected
                              ? "bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-500/20 pr-8"
                              : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-sm"
                          }
                        `}
                      >
                        <span className="block w-full">{skill.name}</span>

                        {/* Индикатор выбора */}
                        {isSelected && (
                          <span className="absolute top-2 right-2">
                            <svg
                              className="w-3.5 h-3.5 text-white/80"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={3}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </span>
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Пустое состояние */}
          {skills.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center text-slate-500 dark:text-slate-400">
              <p className="font-medium">Нет доступных компетенций</p>
              <p className="text-sm mt-1 opacity-70">
                Выберите другую специализацию
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
