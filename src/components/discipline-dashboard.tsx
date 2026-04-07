"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Discipline } from "../types";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { BookOpen, Clock, Zap } from "lucide-react";

interface DisciplineDashboardProps {
  discipline: Discipline;
  relatedDisciplines?: Discipline[];
  onSkillClick?: (skillId: string) => void;
  completedSkills?: string[];
  onSkillToggle?: (skillId: string) => void;
}

const COMPETENCY_COLORS_HEX = {
  УК: "#3b82f6",
  ПК: "#10b981",
  ОПК: "#a855f7",
};

export const DisciplineDashboard: React.FC<DisciplineDashboardProps> = ({
  discipline,
  relatedDisciplines = [],
  onSkillClick,
  completedSkills = [],
  onSkillToggle,
}) => {
  const competencyData = useMemo(() => {
    const stats: Record<string, number> = { УК: 0, ПК: 0, ОПК: 0 };
    discipline.skills.forEach((skill) => {
      stats[skill.type]++;
    });
    return Object.entries(stats)
      .map(([name, value]) => ({ name, value }))
      .filter((item) => item.value > 0);
  }, [discipline.skills]);

  const skillLevelData = useMemo(() => {
    const stats: Record<string, number> = { знать: 0, уметь: 0, владеть: 0 };
    discipline.skills.forEach((skill) => {
      stats[skill.level]++;
    });
    return Object.entries(stats)
      .map(([name, value]) => ({ name, value }))
      .filter((item) => item.value > 0);
  }, [discipline.skills]);

  return (
    <div className="w-full space-y-6">
      {/* Заголовок */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700 shadow-sm"
      >
        <motion.h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
          {discipline.name}
        </motion.h1>
        {discipline.description && (
          <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">
            {discipline.description}
          </p>
        )}
        <div className="flex flex-wrap gap-3 text-sm">
          {discipline.hours && (
            <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 dark:bg-slate-700 rounded border border-slate-200 dark:border-slate-600">
              <Clock size={16} className="text-slate-600 dark:text-slate-400" />
              <span className="text-slate-700 dark:text-slate-300 font-medium">
                {discipline.hours} ч.
              </span>
            </div>
          )}
          <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 dark:bg-slate-700 rounded border border-slate-200 dark:border-slate-600">
            <Zap size={16} className="text-slate-600 dark:text-slate-400" />
            <span className="text-slate-700 dark:text-slate-300 font-medium">
              {discipline.skills.length} навыков
            </span>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 dark:bg-slate-700 rounded border border-slate-200 dark:border-slate-600">
            <BookOpen
              size={16}
              className="text-slate-600 dark:text-slate-400"
            />
            <span className="text-slate-700 dark:text-slate-300 font-medium">
              Семестр {discipline.semester}
            </span>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Диаграмма компетенций */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700 shadow-sm"
        >
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-4">
            Компетенции
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={competencyData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}`}
                outerRadius={75}
                fill="#8884d8"
                dataKey="value"
              >
                {competencyData.map((entry) => (
                  <Cell
                    key={`cell-${entry.name}`}
                    fill={
                      COMPETENCY_COLORS_HEX[
                        entry.name as keyof typeof COMPETENCY_COLORS_HEX
                      ]
                    }
                    opacity={0.8}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "none",
                  borderRadius: "6px",
                  padding: "8px 12px",
                }}
                labelStyle={{ color: "#e2e8f0" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Диаграмма уровней овладения */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700 shadow-sm"
        >
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-4">
            Уровни овладения
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={skillLevelData}>
              <CartesianGrid
                strokeDasharray="0"
                stroke="#e2e8f0"
                opacity={0.2}
              />
              <XAxis
                dataKey="name"
                stroke="#94a3b8"
                style={{ fontSize: "11px" }}
              />
              <YAxis stroke="#94a3b8" style={{ fontSize: "11px" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "none",
                  borderRadius: "6px",
                  padding: "8px 12px",
                }}
                labelStyle={{ color: "#e2e8f0" }}
                cursor={{ fill: "transparent" }}
              />
              <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Прогресс */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700 shadow-sm"
        >
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-4">
            Прогресс
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-baseline justify-between mb-2">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Освоено навыков
                </p>
                <motion.p
                  key={completedSkills.length}
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className="text-2xl font-bold text-slate-900 dark:text-slate-100"
                >
                  {completedSkills.length}/{discipline.skills.length}
                </motion.p>
              </div>
              <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${
                      (completedSkills.length / discipline.skills.length) * 100
                    }%`,
                  }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-blue-500"
                ></motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Навыки */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700 shadow-sm"
      >
        <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-4">
          Сформируемые навыки
        </h3>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {discipline.skills.map((skill, index) => (
            <motion.div
              key={skill.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.02 }}
              className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/30 rounded hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-all cursor-pointer border border-slate-200 dark:border-slate-700"
              onClick={() => onSkillToggle?.(skill.id)}
            >
              <motion.input
                type="checkbox"
                checked={completedSkills.includes(skill.id)}
                onChange={() => onSkillToggle?.(skill.id)}
                className="w-4 h-4 rounded cursor-pointer accent-blue-600"
              />
              <div className="flex-1">
                <p
                  className={`text-sm font-medium ${completedSkills.includes(skill.id) ? "line-through text-slate-400 dark:text-slate-500" : "text-slate-900 dark:text-slate-100"}`}
                >
                  {skill.name}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {skill.level} • {skill.type}
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.stopPropagation();
                  onSkillClick?.(skill.id);
                }}
                className="text-xs px-2.5 py-1 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded font-medium transition-all"
              >
                Подробнее
              </motion.button>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Связанные дисциплины */}
      {relatedDisciplines.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700 shadow-sm"
        >
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-4">
            Связанные дисциплины
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {relatedDisciplines.map((d) => (
              <motion.div
                key={d.id}
                whileHover={{ y: -2 }}
                className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded border border-slate-200 dark:border-slate-700 hover:shadow-sm transition-all"
              >
                <p className="font-medium text-slate-900 dark:text-slate-100 text-sm">
                  {d.name}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                  Семестр {d.semester} • {d.skills.length} навыков
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};
