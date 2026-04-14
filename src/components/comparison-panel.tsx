"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Discipline, Skill, SkillLevel } from "../types";
import { SkillCloud } from "./skill-cloud";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
} from "recharts";
import { X, TrendingUp, Zap, Target, Clock, BookOpen } from "lucide-react";

interface ComparisonPanelProps {
  selectedDisciplines: Discipline[];
  onClear?: () => void;
  onSkillClick?: (skillId: string) => void;
}

interface CompetencyStats {
  type: string;
  count: number;
}

interface SkillLevelStats {
  level: SkillLevel;
  count: number;
}

interface DisciplineComparison {
  name: string;
  skills: number;
  hours: number;
  competencies: number;
  level: string;
}

export const ComparisonPanel: React.FC<ComparisonPanelProps> = ({
  selectedDisciplines,
  onClear,
  onSkillClick,
}) => {
  const totalSkills = useMemo(() => {
    const skillMap = new Map<string, Skill>();
    selectedDisciplines.forEach((discipline) => {
      discipline.skills.forEach((skill) => {
        if (!skillMap.has(skill.id)) {
          skillMap.set(skill.id, skill);
        }
      });
    });
    return Array.from(skillMap.values());
  }, [selectedDisciplines]);

  const skillLevelStats = useMemo(() => {
    const stats: Record<SkillLevel, number> = {
      знать: 0,
      уметь: 0,
      владеть: 0,
    };
    totalSkills.forEach((skill) => {
      stats[skill.level]++;
    });
    return Object.entries(stats)
      .map(([level, count]) => ({ level: level as SkillLevel, count }))
      .filter((s) => s.count > 0)
      .sort((a, b) => {
        const order = { знать: 0, уметь: 1, владеть: 2 };
        return order[a.level] - order[b.level];
      });
  }, [totalSkills]);

  const competencyStats = useMemo(() => {
    const stats: Record<string, number> = { УК: 0, ПК: 0, ОПК: 0 };
    totalSkills.forEach((skill) => {
      stats[skill.type]++;
    });
    return Object.entries(stats)
      .map(([type, count]) => ({ type, count }))
      .filter((s) => s.count > 0);
  }, [totalSkills]);

  const totalHours = useMemo(() => {
    return selectedDisciplines.reduce((sum, d) => sum + (d.hours || 0), 0);
  }, [selectedDisciplines]);

  const avgHours = useMemo(() => {
    return selectedDisciplines.length > 0
      ? (totalHours / selectedDisciplines.length).toFixed(1)
      : 0;
  }, [totalHours, selectedDisciplines.length]);

  const disciplineComparison = useMemo(() => {
    return selectedDisciplines.map((discipline, idx) => {
      const levelMap: Record<SkillLevel, number> = {
        знать: 1,
        уметь: 2,
        владеть: 3,
      };
      const avgLevel = (
        discipline.skills.reduce((sum, s) => sum + levelMap[s.level], 0) /
        (discipline.skills.length || 1)
      ).toFixed(1);

      return {
        name: discipline.name,
        skills: discipline.skills.length,
        hours: discipline.hours || 0,
        competencies: new Set(discipline.skills.map((s) => s.type)).size,
        level: avgLevel,
      };
    });
  }, [selectedDisciplines]);

  const radarData = useMemo(() => {
    const levelOrder = ["знать", "уметь", "владеть"];
    return levelOrder.map((level) => ({
      level,
      count: skillLevelStats.find((s) => s.level === level)?.count || 0,
    }));
  }, [skillLevelStats]);

  const skillsByDiscipline = useMemo(() => {
    if (selectedDisciplines.length === 0) return [];

    // Вычисляем эффективность для каждой дисциплины
    const effectivenessValues = selectedDisciplines.map((d) => {
      const hours = d.hours || 1;
      return d.skills.length / hours;
    });

    // Находим максимальное значение
    const maxEffectiveness = Math.max(...effectivenessValues);

    // Преобразуем в проценты относительно максимума
    return selectedDisciplines.map((d, idx) => {
      const percentage =
        maxEffectiveness > 0
          ? (effectivenessValues[idx] / maxEffectiveness) * 100
          : 0;
      return {
        name: d.name.substring(0, 10),
        эффективность: Math.round(percentage),
      };
    });
  }, [selectedDisciplines]);

  const skillOverlap = useMemo(() => {
    if (selectedDisciplines.length < 2) return 0;
    // Подсчитываем навыки, общие для ВСЕх выбранных дисциплин
    const skillSets = selectedDisciplines.map(
      (d) => new Set(d.skills.map((s) => s.id)),
    );
    const intersection = skillSets.reduce((acc, set, idx) => {
      if (idx === 0) return set;
      return new Set([...acc].filter((x) => set.has(x)));
    });
    return intersection.size;
  }, [selectedDisciplines]);

  // Расчет коэффициента корреляции между количеством навыков и часами
  const correlationStats = useMemo(() => {
    if (selectedDisciplines.length < 2)
      return { correlation: 0, strength: "нет данных" };

    const skills = selectedDisciplines.map((d) => d.skills.length);
    const hours = selectedDisciplines.map((d) => d.hours || 0);

    // Средние значения
    const meanSkills = skills.reduce((a, b) => a + b, 0) / skills.length;
    const meanHours = hours.reduce((a, b) => a + b, 0) / hours.length;

    // Расчет коэффициента Пирсона
    const numerator = skills.reduce(
      (sum, s, i) => sum + (s - meanSkills) * (hours[i] - meanHours),
      0,
    );
    const sumSqSkills = skills.reduce(
      (sum, s) => sum + Math.pow(s - meanSkills, 2),
      0,
    );
    const sumSqHours = hours.reduce(
      (sum, h) => sum + Math.pow(h - meanHours, 2),
      0,
    );

    const correlation =
      Math.sqrt(sumSqSkills) * Math.sqrt(sumSqHours) > 0
        ? numerator / (Math.sqrt(sumSqSkills) * Math.sqrt(sumSqHours))
        : 0;

    // Определение силы корреляции
    const absCorr = Math.abs(correlation);
    let strength = "нет корреляции";
    if (absCorr > 0.8) strength = "сильная";
    else if (absCorr > 0.6) strength = "средняя";
    else if (absCorr > 0.4) strength = "слабая";
    else if (absCorr > 0.2) strength = "очень слабая";

    return {
      correlation: correlation.toFixed(3),
      strength,
    };
  }, [selectedDisciplines]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="rounded-2xl border border-(--color-border) shadow-lg overflow-hidden"
    >
      {/* Заголовок с градиентом */}
      <div className="bg-linear-to-r from-(--color-primary) to-(--color-primary-600) px-8 py-6">
        <motion.div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/20 backdrop-blur-md rounded-lg">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">
                Анализ сравнения
              </h2>
              <p className="text-white/80 text-sm mt-1">
                {selectedDisciplines.length} дисциплин • {totalSkills.length}{" "}
                навыков
              </p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClear}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X size={20} className="text-white" />
          </motion.button>
        </motion.div>
      </div>

      {/* Основной контент */}
      <div className="p-8 bg-(--color-surface)">
        {/* Сетка ключевых метрик */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          {[
            {
              icon: BookOpen,
              label: "Количество дисциплин",
              value: selectedDisciplines.length,
              color: "from-blue-500 to-blue-600",
            },
            {
              icon: Target,
              label: "Количество навыков",
              value: totalSkills.length,
              color: "from-purple-500 to-purple-600",
            },
            {
              icon: Clock,
              label: "Общее количество часов",
              value: totalHours,
              color: "from-amber-500 to-amber-600",
            },
            {
              icon: TrendingUp,
              label: "Пересекающиеся навыки",
              value: `${skillOverlap}`,
              color: "from-green-500 to-green-600",
            },
          ].map((metric, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className={`bg-linear-to-br ${metric.color} p-6 rounded-xl shadow-md text-white`}
            >
              <div className="flex items-center justify-between mb-2">
                <metric.icon className="w-5 h-5 opacity-80" />
              </div>
              <p className="text-sm font-medium opacity-90">{metric.label}</p>
              <p className="text-3xl font-bold mt-2">{metric.value}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Раздел диаграмм */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Распределение уровней */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card"
          >
            <h3 className="text-lg font-semibold text-(--color-foreground) mb-4 flex items-center gap-2">
              <div className="w-1 h-5 bg-(--color-primary) rounded" />
              Уровни овладения
            </h3>
            <div className="space-y-3">
              {skillLevelStats.map((stat) => {
                const percentage = (stat.count / totalSkills.length) * 100;
                const colors: Record<SkillLevel, string> = {
                  знать: "bg-blue-500",
                  уметь: "bg-amber-500",
                  владеть: "bg-green-500",
                };
                const labels: Record<SkillLevel, string> = {
                  знать: "Знать",
                  уметь: "Уметь",
                  владеть: "Владеть",
                };
                return (
                  <motion.div
                    key={stat.level}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-(--color-foreground-secondary)">
                        {labels[stat.level]}
                      </span>
                      <span className="text-sm font-bold text-(--color-primary)">
                        {stat.count}
                      </span>
                    </div>
                    <div className="w-full h-2 bg-(--color-surface-secondary) rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className={`h-full ${colors[stat.level]} rounded-full`}
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Распределение компетенций */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card"
          >
            <h3 className="text-lg font-semibold text-(--color-foreground) mb-4 flex items-center gap-2">
              <div className="w-1 h-5 bg-(--color-accent) rounded" />
              Типы компетенций
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={competencyStats}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--color-border)"
                  opacity={0.5}
                />
                <XAxis
                  dataKey="type"
                  stroke="var(--color-foreground-tertiary)"
                />
                <YAxis stroke="var(--color-foreground-tertiary)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--color-surface)",
                    border: `1px solid var(--color-border)`,
                    borderRadius: "8px",
                  }}
                  labelStyle={{ color: "var(--color-foreground)" }}
                />
                <Bar
                  dataKey="count"
                  fill="var(--color-primary)"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Диаграмма сравнения навыков */}
        {selectedDisciplines.length > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="card mb-8"
          >
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-(--color-foreground) mb-4">
                Эффективность дисциплин (навыки на час)
              </h3>
              <p className="text-sm text-(--color-foreground-secondary) mb-4">
                Показатель плотности информации: сколько навыков приходится на
                один час обучения
              </p>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={skillsByDiscipline}>
                <CartesianGrid stroke="var(--color-border)" opacity={0.5} />
                <XAxis
                  dataKey="name"
                  stroke="var(--color-foreground-tertiary)"
                />
                <YAxis
                  stroke="var(--color-foreground-tertiary)"
                  label={{
                    value: "Навыки/час",
                    angle: -90,
                    position: "insideLeft",
                  }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--color-surface)",
                    border: `1px solid var(--color-border)`,
                    borderRadius: "8px",
                  }}
                  formatter={(value) => [`${value}%`, "Эффективность"]}
                  labelFormatter={(label) => `Дисциплина: ${label}`}
                />
                <Line
                  type="monotone"
                  dataKey="эффективность"
                  stroke="var(--color-accent)"
                  strokeWidth={3}
                  dot={{ r: 5, fill: "var(--color-accent)" }}
                  activeDot={{ r: 7 }}
                  name="Эффективность"
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        )}

        {/* Таблица сравнения дисциплин */}
        {disciplineComparison.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            className="card mb-8"
          >
            <h3 className="text-lg font-semibold text-(--color-foreground) mb-4">
              Детальное сравнение
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-(--color-surface-secondary)">
                  <tr>
                    <th className="text-left px-4 py-3 font-semibold text-(--color-foreground)">
                      Дисциплина
                    </th>
                    <th className="text-center px-4 py-3 font-semibold text-(--color-foreground)">
                      Количество навыков
                    </th>
                    <th className="text-center px-4 py-3 font-semibold text-(--color-foreground)">
                      Количество часов
                    </th>
                    <th className="text-center px-4 py-3 font-semibold text-(--color-foreground)">
                      Количество компетенций
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {disciplineComparison.map((discipline, idx) => (
                    <motion.tr
                      key={idx}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.55 + idx * 0.05 }}
                      className="border-b border-(--color-border) hover:bg-(--color-surface-secondary) transition-colors"
                    >
                      <td className="px-4 py-3 font-medium text-(--color-foreground)">
                        {discipline.name}
                      </td>
                      <td className="text-center px-4 py-3 text-(--color-foreground-secondary)">
                        {discipline.skills}
                      </td>
                      <td className="text-center px-4 py-3 text-(--color-foreground-secondary)">
                        {discipline.hours}
                      </td>
                      <td className="text-center px-4 py-3 text-(--color-foreground-secondary)">
                        {discipline.competencies}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Облако навыков */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="card"
        >
          <h3 className="text-lg font-semibold text-(--color-foreground) mb-4 flex items-center gap-2">
            <div className="w-1 h-5 bg-(--color-primary) rounded" />
            Облако всех навыков ({totalSkills.length})
          </h3>
          <SkillCloud
            skills={totalSkills}
            onSkillClick={onSkillClick}
            className="justify-start"
          />
        </motion.div>
      </div>
    </motion.div>
  );
};
