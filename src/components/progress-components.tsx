"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface ProgressBarProps {
  percentage: number;
  animated?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  percentage,
  animated = true,
}) => {
  return (
    <div className="w-full space-y-2">
      <div className="relative h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
        <motion.div
          initial={animated ? { width: 0 } : { width: `${percentage}%` }}
          animate={{ width: `${percentage}%` }}
          transition={animated ? { duration: 1.5, ease: "easeOut" } : {}}
          className="h-full bg-blue-500 rounded-full"
        />
      </div>
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-slate-600 dark:text-slate-400">
          Прогресс
        </p>
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm font-semibold text-slate-900 dark:text-slate-100"
        >
          {percentage}%
        </motion.span>
      </div>
    </div>
  );
};

interface SkillChecklistProps {
  skills: Array<{
    id: string;
    name: string;
    completed: boolean;
  }>;
  onSkillToggle?: (skillId: string) => void;
}

export const SkillChecklist: React.FC<SkillChecklistProps> = ({
  skills,
  onSkillToggle,
}) => {
  return (
    <div className="space-y-1">
      {skills.map((skill, index) => (
        <motion.button
          key={skill.id}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
          onClick={() => onSkillToggle?.(skill.id)}
          whileHover={{ x: 2 }}
          className="w-full flex items-center gap-3 p-3 rounded hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-all text-left border border-transparent"
        >
          <motion.div
            animate={{
              scale: skill.completed ? 1 : 1,
              backgroundColor: skill.completed ? "#3b82f6" : "#e2e8f0",
              borderColor: skill.completed ? "#3b82f6" : "#cbd5e1",
            }}
            className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center border-2 dark:bg-slate-600 dark:border-slate-600"
          >
            {skill.completed && <Check size={12} className="text-white" />}
          </motion.div>
          <span
            className={`text-sm font-medium transition-all ${
              skill.completed
                ? "text-slate-400 dark:text-slate-500 line-through"
                : "text-slate-900 dark:text-slate-100"
            }`}
          >
            {skill.name}
          </span>
        </motion.button>
      ))}
    </div>
  );
};

interface TimelineItemProps {
  semester: number;
  skillsCount: number;
  isCompleted: boolean;
  position: number;
}

export const TimelineItem: React.FC<TimelineItemProps> = ({
  semester,
  skillsCount,
  isCompleted,
  position,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: position * 0.1 }}
      className="flex gap-3 relative"
    >
      {/* Линия */}
      {position > 0 && (
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: 48 }}
          transition={{ delay: position * 0.1 + 0.2 }}
          className={`absolute left-4 top-9 w-0.5 ${
            isCompleted ? "bg-blue-500" : "bg-slate-300 dark:bg-slate-600"
          }`}
        ></motion.div>
      )}

      {/* Точка */}
      <motion.div
        whileHover={{ scale: 1.1 }}
        className={`shrink-0 w-9 h-9 rounded-full flex items-center justify-center border-2 font-semibold text-sm transition-all ${
          isCompleted
            ? "bg-blue-50 dark:bg-blue-900/30 border-blue-500 dark:border-blue-500 text-blue-700 dark:text-blue-300"
            : "bg-slate-100 dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400"
        }`}
      >
        {isCompleted ? <Check size={16} /> : semester}
      </motion.div>

      {/* Содержание */}
      <motion.div className="flex-1 pt-0.5 p-2.5 bg-slate-50 dark:bg-slate-700/30 rounded border border-slate-200 dark:border-slate-700">
        <h3 className="font-medium text-sm text-slate-900 dark:text-slate-100">
          Семестр {semester}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {skillsCount} навыков {isCompleted && <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Завершено</span>}
        </p>
      </motion.div>
    </motion.div>
  );
};
