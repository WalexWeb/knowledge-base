"use client";

import React, { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { Discipline, Skill, Recommendation } from "../types";
import { SkillCloud } from "./skill-cloud";
import { ProgressBar } from "./progress-components";
import { AlertCircle, TrendingUp, BookOpen, BookMarked, Zap, Flame, Lightbulb } from "lucide-react";

interface SimulatorPanelProps {
  allDisciplines: Discipline[];
  selectedDisciplines: string[];
  onSelectDiscipline: (id: string) => void;
  onSkillClick?: (skillId: string) => void;
}

interface CompetencyRecommendation {
  code: string;
  coverage: number;
}

export const SimulatorPanel: React.FC<SimulatorPanelProps> = ({
  allDisciplines,
  selectedDisciplines,
  onSelectDiscipline,
  onSkillClick,
}) => {
  const simulatorData = useMemo(() => {
    const selectedDisciplinesData = allDisciplines.filter((d) =>
      selectedDisciplines.includes(d.id),
    );

    // Объединяем все навыки
    const skillMap = new Map<string, Skill>();
    selectedDisciplinesData.forEach((d) => {
      d.skills.forEach((s) => {
        if (!skillMap.has(s.id)) {
          skillMap.set(s.id, s);
        }
      });
    });

    const totalSkills = Array.from(skillMap.values());

    // Статистика компетенций
    const competencyStats: Record<string, number> = { УК: 0, ПК: 0, ОПК: 0 };
    totalSkills.forEach((s) => {
      competencyStats[s.type]++;
    });

    // Поиск рекомендаций - недостающих дисциплин
    const usedDisciplineIds = new Set(selectedDisciplines);
    const recommendations: Recommendation[] = [];

    allDisciplines.forEach((d) => {
      if (usedDisciplineIds.has(d.id)) return;

      // Находим новые навыки, которые даст эта дисциплина
      const newSkills = d.skills.filter((s) => !skillMap.has(s.id));

      if (newSkills.length > 0) {
        // Приоритет выше для дисциплин с большим количеством новых навыков
        const priority =
          newSkills.length > 3
            ? "high"
            : newSkills.length > 1
              ? "medium"
              : "low";
        recommendations.push({
          disciplineId: d.id,
          reason: `Даёт ${newSkills.length} новых навыков`,
          priority,
          missingSkills: newSkills,
        });
      }
    });

    return {
      selectedDisciplinesData,
      totalSkills,
      competencyStats,
      recommendations: recommendations
        .sort((a, b) => {
          const priorityOrder = { high: 0, medium: 1, low: 2 };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        })
        .slice(0, 5),
    };
  }, [selectedDisciplines, allDisciplines]);

  const totalSkillsCount = useMemo(() => {
    const allSkillIds = new Set<string>();
    allDisciplines.forEach((d) => {
      d.skills.forEach((s) => {
        allSkillIds.add(s.id);
      });
    });
    return allSkillIds.size;
  }, [allDisciplines]);

  return (
    <div className="w-full space-y-8">
      {/* Заголовок */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-linear-to-br from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 rounded-2xl p-8 border border-cyan-200 dark:border-cyan-700/50 shadow-sm"
      >
        <motion.h2 className="text-3xl font-bold bg-linear-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent mb-3">
          <Zap size={20} className="text-cyan-500" /> Симулятор обучения
        </motion.h2>
        <p className="text-slate-700 dark:text-slate-300 font-medium">
          Посмотрите, какие навыки вы получите при выборе определённых дисциплин
        </p>
      </motion.div>

      {/* Если ничего не выбрано */}
      {selectedDisciplines.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-8 bg-linear-to-br from-slate-100 to-slate-50 dark:from-slate-800/50 dark:to-slate-900/50 border border-slate-300 dark:border-slate-700 rounded-2xl text-center shadow-sm"
        >
          <AlertCircle className="mx-auto mb-4 text-slate-400" size={48} />
          <p className="text-slate-600 dark:text-slate-400 font-medium">
            Выберите дисциплины на главном экране, чтобы начать симуляцию
          </p>
        </motion.div>
      )}

      <AnimatePresence mode="wait">
        {selectedDisciplines.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            {/* Левая панель - Выбранные дисциплины */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <CheckCircle2 size={22} className="text-emerald-600 dark:text-emerald-400" />
                Выбранные дисциплины
              </h3>
              <div className="space-y-2">
                {simulatorData.selectedDisciplinesData.map((d) => (
                  <motion.div
                    key={d.id}
                    layout
                    className="p-4 bg-linear-to-r from-blue-100 to-blue-50 dark:from-blue-900/30 dark:to-blue-800/30 border border-blue-200 dark:border-blue-700/50 rounded-xl hover:shadow-md transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white">
                          {d.name}
                        </p>
                        <p className="text-xs text-slate-600 dark:text-blue-300 font-medium">
                          <BookOpen size={16} className="inline mr-1" />{d.skills.length} навыков
                        </p>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onSelectDiscipline(d.id)}
                        className="text-xs px-3 py-1.5 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 text-red-700 dark:text-red-300 rounded-lg font-medium transition-all"
                      >
                        Убрать
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Правая панель - Статистика */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">
                <div className="flex items-center gap-2"><BookMarked size={20} />Итог обучения</div>
              </h3>

              {/* Карточка с итогами */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-linear-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 border border-emerald-200 dark:border-emerald-700/50 rounded-xl p-5 shadow-sm"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="font-medium text-slate-700 dark:text-slate-300">
                    Всего навыков
                  </span>
                  <motion.span
                    key={simulatorData.totalSkills.length}
                    initial={{ scale: 0.5 }}
                    animate={{ scale: 1 }}
                    className="text-4xl font-bold bg-linear-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent"
                  >
                    {simulatorData.totalSkills.length}
                  </motion.span>
                </div>
                <ProgressBar
                  percentage={Math.round(
                    (simulatorData.totalSkills.length / totalSkillsCount) * 100,
                  )}
                />
              </motion.div>

              {/* Компетенции */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="bg-slate-100 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-xl p-5 shadow-sm"
              >
                <p className="text-sm font-bold text-slate-800 dark:text-white mb-4">
                  Распределение компетенций
                </p>
                <div className="space-y-3">
                  {Object.entries(simulatorData.competencyStats).map(
                    ([type, count]) =>
                      count > 0 && (
                        <div key={type}>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="font-semibold text-slate-700 dark:text-slate-300">
                              {type}
                            </span>
                            <span className="font-bold text-slate-900 dark:text-white">
                              {count} навыков
                            </span>
                          </div>
                          <div className="h-2.5 bg-slate-300 dark:bg-slate-700 rounded-full overflow-hidden shadow-sm">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{
                                width: `${(count / simulatorData.totalSkills.length) * 100}%`,
                              }}
                              transition={{ duration: 0.8, ease: "easeOut" }}
                              className={`h-full ${
                                type === "УК"
                                  ? "bg-linear-to-r from-blue-500 to-blue-600"
                                  : type === "ПК"
                                    ? "bg-linear-to-r from-emerald-500 to-emerald-600"
                                    : "bg-linear-to-r from-purple-500 to-purple-600"
                              } shadow-lg`}
                            ></motion.div>
                          </div>
                        </div>
                      ),
                  )}
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Облако сформированных навыков */}
      {simulatorData.totalSkills.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-900/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm"
        >
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-5">
            <div className="flex items-center gap-2"><TrendingUp size={20} />Сформируемые навыки</div>
          </h3>
          <SkillCloud
            skills={simulatorData.totalSkills}
            onSkillClick={onSkillClick}
            className="justify-start"
          />
        </motion.div>
      )}

      {/* Рекомендации */}
      {simulatorData.recommendations.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-900/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-5">
            <TrendingUp size={22} className="text-amber-500" />
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">
              Рекомендации для роста
            </h3>
          </div>
          <div className="space-y-3">
            {simulatorData.recommendations.map((rec) => {
              const discipline = allDisciplines.find(
                (d) => d.id === rec.disciplineId,
              );
              if (!discipline) return null;

              const priorityStyles = {
                high: "from-red-100 to-red-50 dark:from-red-900/25 dark:to-red-800/20 border-red-200 dark:border-red-700/50 hover:from-red-150 hover:to-red-100 dark:hover:from-red-900/35",
                medium:
                  "from-amber-100 to-amber-50 dark:from-amber-900/25 dark:to-amber-800/20 border-amber-200 dark:border-amber-700/50 hover:from-amber-150 hover:to-amber-100 dark:hover:from-amber-900/35",
                low: "from-slate-100 to-slate-50 dark:from-slate-800/50 dark:to-slate-900/40 border-slate-200 dark:border-slate-700 hover:from-slate-150 dark:hover:from-slate-700/60",
              };

              const badgeStyles = {
                high: "bg-red-200 dark:bg-red-900/40 text-red-700 dark:text-red-300",
                medium:
                  "bg-amber-200 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300",
                low: "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300",
              };

              return (
                <motion.button
                  key={rec.disciplineId}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  whileHover={{ x: 4 }}
                  onClick={() => onSelectDiscipline(rec.disciplineId)}
                  className={`w-full text-left p-4 rounded-xl border transition-all bg-linear-to-r ${priorityStyles[rec.priority]} shadow-sm hover:shadow-md`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-slate-900 dark:text-white">
                      {discipline.name}
                    </h4>
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-semibold whitespace-nowrap ${badgeStyles[rec.priority]}`}
                    >
                      {rec.priority === "high"
                        ? <Flame size={14} className="inline mr-1" />
                        : rec.priority === "medium"
                          ? <Zap size={14} className="inline mr-1" />
                          : <Lightbulb size={14} className="inline mr-1" />
                      }
                      {rec.reason}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {rec.missingSkills.slice(0, 3).map((skill) => (
                      <span
                        key={skill.id}
                        className="text-xs px-2.5 py-1 bg-white/60 dark:bg-slate-700/40 text-slate-700 dark:text-slate-300 rounded-lg font-medium"
                      >
                        {skill.name}
                      </span>
                    ))}
                    {rec.missingSkills.length > 3 && (
                      <span className="text-xs px-2.5 py-1 bg-white/60 dark:bg-slate-700/40 text-slate-700 dark:text-slate-300 rounded-lg font-medium">
                        +{rec.missingSkills.length - 3} ещё
                      </span>
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
};
