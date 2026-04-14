"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Discipline } from "../types";
import {
  Search,
  Filter,
  Grid3x3,
  List,
  BarChart3,
  Target,
  Briefcase,
  Wrench,
} from "lucide-react";

interface CorrelationMapProps {
  disciplines: Discipline[];
}

type ViewMode = "heatmap" | "list" | "pairwise";
type CompetencyFilter = "all" | "УК" | "ПК" | "ОПК";
type SortBy = "name" | "correlation" | "semester";

export const CorrelationMap: React.FC<CorrelationMapProps> = ({
  disciplines,
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>("heatmap");
  const [searchQuery, setSearchQuery] = useState("");
  const [competencyFilter, setCompetencyFilter] =
    useState<CompetencyFilter>("all");
  const [sortBy, setSortBy] = useState<SortBy>("correlation");
  const [hoveredCell, setHoveredCell] = useState<string | null>(null);
  const [selectedPair, setSelectedPair] = useState<{
    from: string;
    to: string;
  } | null>(null);

  const correlationData = useMemo(() => {
    const competencies = ["УК", "ПК", "ОПК"] as const;
    const matrix: Record<
      string,
      Record<string, { correlation: number; types: Set<string> }>
    > = {};

    disciplines.forEach((d1) => {
      matrix[d1.id] = {};
      disciplines.forEach((d2) => {
        if (d1.id !== d2.id) {
          let correlation = 0;
          const commonTypes = new Set<string>();

          competencies.forEach((comp) => {
            const d1HasComp = d1.skills.some((s) => s.type === comp);
            const d2HasComp = d2.skills.some((s) => s.type === comp);
            if (d1HasComp && d2HasComp) {
              correlation++;
              commonTypes.add(comp);
            }
          });

          matrix[d1.id][d2.id] = { correlation, types: commonTypes };
        }
      });
    });

    return matrix;
  }, [disciplines]);

  const filteredDisciplines = useMemo(() => {
    let result = disciplines.filter((d) =>
      d.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    if (competencyFilter !== "all") {
      result = result.filter((d) =>
        d.skills.some((s) => s.type === competencyFilter),
      );
    }

    return result.sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "semester") return a.semester - b.semester;
      return 0;
    });
  }, [searchQuery, competencyFilter, sortBy, disciplines]);

  const pairwiseCorrelations = useMemo(() => {
    const pairs: Array<{
      d1: Discipline;
      d2: Discipline;
      correlation: number;
      types: Set<string>;
    }> = [];

    filteredDisciplines.forEach((d1, i) => {
      filteredDisciplines.forEach((d2, j) => {
        if (i < j && correlationData[d1.id]?.[d2.id]) {
          const { correlation, types } = correlationData[d1.id][d2.id];
          if (correlation > 0) {
            pairs.push({ d1, d2, correlation, types });
          }
        }
      });
    });

    return pairs.sort((a, b) => b.correlation - a.correlation);
  }, [filteredDisciplines, correlationData]);

  const getHeatmapColor = (correlation: number) => {
    if (correlation === 0)
      return "bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700";
    if (correlation === 1)
      return "bg-blue-200 dark:bg-blue-900/40 hover:bg-blue-300 dark:hover:bg-blue-900/60";
    if (correlation === 2)
      return "bg-emerald-300 dark:bg-emerald-900/50 hover:bg-emerald-400 dark:hover:bg-emerald-900/70";
    return "bg-purple-400 dark:bg-purple-900/60 hover:bg-purple-500 dark:hover:bg-purple-900/80";
  };

  const competencyStats = useMemo(() => {
    const stats = { УК: 0, ПК: 0, ОПК: 0 };
    disciplines.forEach((d) => {
      const types = new Set(d.skills.map((s) => s.type));
      types.forEach((type) => {
        stats[type as keyof typeof stats]++;
      });
    });
    return stats;
  }, [disciplines]);

  return (
    <div className="space-y-8">
      {/* Заголовок с элементами управления */}
      <div className="space-y-4">
        {/* Кнопки режимов просмотра */}
        <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/50 p-2 rounded-lg border border-slate-200 dark:border-slate-700 w-fit">
          {[
            { mode: "heatmap" as const, icon: Grid3x3, label: "Heatmap" },
            { mode: "list" as const, icon: List, label: "Список" },
            { mode: "pairwise" as const, icon: BarChart3, label: "Пары" },
          ].map(({ mode, icon: Icon, label }) => (
            <motion.button
              key={mode}
              onClick={() => setViewMode(mode)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all font-medium text-sm ${
                viewMode === mode
                  ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              <Icon size={18} />
              {label}
            </motion.button>
          ))}
        </div>

        {/* Фильтры и поиск */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Поиск */}
          <div className="relative md:col-span-2">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Поиск дисциплин..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>

          {/* Фильтр компетенций */}
          <select
            value={competencyFilter}
            onChange={(e) =>
              setCompetencyFilter(e.target.value as CompetencyFilter)
            }
            className="px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm font-medium"
          >
            <option value="all">Все компетенции</option>
            <option value="УК">УК - Универсальные</option>
            <option value="ПК">ПК - Профессиональные</option>
            <option value="ОПК">ОПК - Общепрофессиональные</option>
          </select>

          {/* Сортировка */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortBy)}
            className="px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm font-medium"
          >
            <option value="correlation">По корреляции</option>
            <option value="name">По названию</option>
            <option value="semester">По семестру</option>
          </select>
        </div>
      </div>

      {/* Статистика компетенций */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        {[
          {
            label: "Универсальные",
            type: "УК" as const,
            color: "blue",
            Icon: Target,
          },
          {
            label: "Профессиональные",
            type: "ПК" as const,
            color: "emerald",
            Icon: Briefcase,
          },
          {
            label: "Общепрофессиональные",
            type: "ОПК" as const,
            color: "purple",
            Icon: Wrench,
          },
        ].map(({ label, type, color, Icon }) => (
          <motion.div
            key={type}
            whileHover={{ scale: 1.02 }}
            className={`p-4 rounded-xl border bg-linear-to-br border-${color}-200 dark:border-${color}-700/50 from-${color}-50 to-${color}-100 dark:from-${color}-900/20 dark:to-${color}-800/20`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon
                  size={32}
                  className={`text-${color}-600 dark:text-${color}-400`}
                />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  {label}
                </h3>
              </div>
              <span
                className={`text-2xl font-bold text-${color}-600 dark:text-${color}-400`}
              >
                {competencyStats[type]}
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              дисциплин
            </p>
          </motion.div>
        ))}
      </motion.div>

      {/* Информация */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-12 p-6 bg-slate-100 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700/50"
      >
        <h3 className="font-bold mb-3">Как читать матрицу:</h3>
        <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
          <li>
            <strong>Пустая ячейка:</strong> Дисциплины не имеют общих
            компетенций
          </li>
          <li>
            <strong>Цветная ячейка с числом:</strong> Количество общих
            компетенций между дисциплинами
          </li>
          <li>
            <strong>Синий цвет:</strong> 1 общая компетенция
          </li>
          <li>
            <strong>Зелёный цвет:</strong> 2 общие компетенции
          </li>
          <li>
            <strong>Фиолетовый цвет:</strong> 3 общие компетенции (все типы: УК,
            ПК, ОПК)
          </li>
        </ul>
      </motion.div>

      {/* Режимы просмотра */}
      <AnimatePresence mode="wait">
        {/* Представление тепловой карты */}
        {viewMode === "heatmap" && (
          <motion.div
            key="heatmap"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            <div className="bg-white dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700/50 p-6 overflow-x-auto">
              <div className="mb-6 p-4 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-sm">
                <p className="font-semibold mb-3 text-slate-900 dark:text-white flex items-center gap-2">
                  <Filter size={16} />
                  Легенда корреляций
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    {
                      value: 0,
                      label: "0 - Нет связей",
                      color: "bg-slate-100 dark:bg-slate-800",
                    },
                    {
                      value: 1,
                      label: "1 - Слабая",
                      color: "bg-blue-200 dark:bg-blue-900/40",
                    },
                    {
                      value: 2,
                      label: "2 - Средняя",
                      color: "bg-emerald-300 dark:bg-emerald-900/50",
                    },
                    {
                      value: 3,
                      label: "3 - Сильная",
                      color: "bg-purple-400 dark:bg-purple-900/60",
                    },
                  ].map(({ label, color }) => (
                    <div key={label} className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded ${color}`}></div>
                      <span className="text-xs">{label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr>
                    <th className="p-2 font-semibold bg-slate-100 dark:bg-slate-700 sticky left-0 z-10 text-left text-slate-900 dark:text-white">
                      Дисциплина
                    </th>
                    {filteredDisciplines.slice(0, 15).map((d) => (
                      <th
                        key={d.id}
                        className="p-2 font-semibold bg-slate-100 dark:bg-slate-700 text-center text-slate-900 dark:text-white"
                      >
                        <div className="w-12 truncate text-xs" title={d.name}>
                          {d.name.split(" ").pop()}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredDisciplines.slice(0, 15).map((d1) => (
                    <tr
                      key={d1.id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-700/20"
                    >
                      <td className="p-2 font-medium bg-slate-50 dark:bg-slate-800/30 sticky left-0 z-10 truncate max-w-xs text-slate-900 dark:text-white text-xs">
                        {d1.name}
                      </td>
                      {filteredDisciplines.slice(0, 15).map((d2) => {
                        const cellKey = `${d1.id}-${d2.id}`;
                        const data = correlationData[d1.id]?.[d2.id];
                        const correlation = data?.correlation ?? 0;
                        const isHovered = hoveredCell === cellKey;

                        return (
                          <td
                            key={d2.id}
                            className="p-2 text-center"
                            onMouseEnter={() => setHoveredCell(cellKey)}
                            onMouseLeave={() => setHoveredCell(null)}
                          >
                            <motion.button
                              onClick={() =>
                                setSelectedPair({ from: d1.id, to: d2.id })
                              }
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-xs transition-all cursor-pointer ${getHeatmapColor(correlation)} ${
                                isHovered
                                  ? "ring-2 ring-offset-1 ring-blue-500"
                                  : ""
                              }`}
                              title={`${d1.name} ↔ ${d2.name}: ${correlation} компетенций`}
                            >
                              {correlation > 0 ? correlation : "—"}
                            </motion.button>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredDisciplines.length > 15 && (
              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/50 rounded-lg text-sm text-amber-800 dark:text-amber-300">
                Показано 15 из {filteredDisciplines.length} дисциплин.
                Используйте поиск и фильтры для сокращения списка.
              </div>
            )}
          </motion.div>
        )}

        {/* Представление списка */}
        {viewMode === "list" && (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {filteredDisciplines.map((discipline) => {
              const correlatedCount = Object.values(
                correlationData[discipline.id] || {},
              ).filter((d) => d.correlation > 0).length;

              const avgCorrelation =
                Object.values(correlationData[discipline.id] || {}).reduce(
                  (sum, d) => sum + d.correlation,
                  0,
                ) / Math.max(filteredDisciplines.length - 1, 1);

              return (
                <motion.div
                  key={discipline.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.02 }}
                  className="p-5 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg hover:shadow-lg transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-900 dark:text-white">
                        {discipline.name}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Сем. {discipline.semester} · {discipline.hours} часов
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {correlatedCount}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        коррелирует
                      </p>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="flex justify-between mb-1">
                      <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                        Средняя корреляция
                      </span>
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        {avgCorrelation.toFixed(2)}
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(avgCorrelation / 3) * 100}%` }}
                        transition={{ duration: 0.6 }}
                        className="h-full bg-linear-to-r from-blue-500 via-emerald-500 to-purple-500"
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {["УК", "ПК", "ОПК"].map((type) => {
                      const hasType = discipline.skills.some(
                        (s) => s.type === type,
                      );
                      return (
                        <span
                          key={type}
                          className={`text-xs px-2 py-0.5 rounded font-medium transition-all ${
                            hasType
                              ? type === "УК"
                                ? "bg-blue-200 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300"
                                : type === "ПК"
                                  ? "bg-emerald-200 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300"
                                  : "bg-purple-200 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300"
                              : "bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500 line-through"
                          }`}
                        >
                          {type}
                        </span>
                      );
                    })}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* Попарное представление */}
        {viewMode === "pairwise" && (
          <motion.div
            key="pairwise"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-3"
          >
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700/50 rounded-lg text-sm text-blue-800 dark:text-blue-300">
              Найдено {pairwiseCorrelations.length} дополняющих пар дисциплин
            </div>

            {pairwiseCorrelations.length > 0 ? (
              pairwiseCorrelations.map((pair, index) => (
                <motion.div
                  key={`${pair.d1.id}-${pair.d2.id}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-4 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg hover:shadow-lg transition-all"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex-1">
                      <p className="text-sm font-bold text-slate-900 dark:text-white">
                        {pair.d1.name} ↔ {pair.d2.name}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Сем. {pair.d1.semester}, {pair.d2.semester}
                      </p>
                    </div>
                    <div
                      className={`text-center px-4 py-2 rounded-lg font-bold text-white ${
                        pair.correlation === 1
                          ? "bg-blue-500"
                          : pair.correlation === 2
                            ? "bg-emerald-500"
                            : "bg-purple-500"
                      }`}
                    >
                      <div className="text-2xl">{pair.correlation}</div>
                      <div className="text-xs opacity-90">общих</div>
                    </div>
                  </div>

                  <div className="flex gap-2 mb-2">
                    {Array.from(pair.types).map((type) => (
                      <span
                        key={type}
                        className={`text-xs px-2 py-1 rounded-full font-medium ${
                          type === "УК"
                            ? "bg-blue-200 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300"
                            : type === "ПК"
                              ? "bg-emerald-200 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300"
                              : "bg-purple-200 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300"
                        }`}
                      >
                        {type}
                      </span>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-slate-50 dark:bg-slate-700/30 p-2 rounded">
                      <p className="font-medium text-slate-900 dark:text-white">
                        {pair.d1.skills.length} навыков
                      </p>
                      <p className="text-slate-500 dark:text-slate-400">
                        {pair.d1.hours}ч
                      </p>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-700/30 p-2 rounded">
                      <p className="font-medium text-slate-900 dark:text-white">
                        {pair.d2.skills.length} навыков
                      </p>
                      <p className="text-slate-500 dark:text-slate-400">
                        {pair.d2.hours}ч
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-dashed border-slate-300 dark:border-slate-700">
                <p className="text-slate-600 dark:text-slate-400">
                  Нет пар дисциплин с общими компетенциями
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Подвал статистики */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4"
      >
        <div className="p-5 rounded-xl bg-linear-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200 dark:border-blue-700/50">
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
            Всего дисциплин
          </p>
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
            {disciplines.length}
          </p>
        </div>
        <div className="p-5 rounded-xl bg-linear-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 border border-emerald-200 dark:border-emerald-700/50">
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
            Отображается
          </p>
          <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
            {filteredDisciplines.length}
          </p>
        </div>
        <div className="p-5 rounded-xl bg-linear-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border border-purple-200 dark:border-purple-700/50">
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
            Всего навыков
          </p>
          <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
            {
              new Set(disciplines.flatMap((d) => d.skills.map((s) => s.id)))
                .size
            }
          </p>
        </div>
        <div className="p-5 rounded-xl bg-linear-to-br from-pink-50 to-pink-100 dark:from-pink-900/20 dark:to-pink-800/20 border border-pink-200 dark:border-pink-700/50">
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
            Пар связей
          </p>
          <p className="text-3xl font-bold text-pink-600 dark:text-pink-400">
            {pairwiseCorrelations.length}
          </p>
        </div>
      </motion.div>
    </div>
  );
};
