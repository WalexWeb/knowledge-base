"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Map,
  BarChart3,
  Shield,
  BookOpen,
  BookMarked,
  Calendar,
  Zap,
  Trophy,
  Network,
} from "lucide-react";
import { useKnowledgeBaseStore } from "@/src/store/knowledge-base";
import { DISCIPLINES } from "@/src/data/mock-data";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/src/components/ui/tabs";
import { CompetencyMap } from "@/src/components/competency-map";
import { ComparisonPanel } from "@/src/components/comparison-panel";

export default function Home() {
  const {
    selectedDisciplines,
    selectDiscipline,
    clearSelectedDisciplines,
    setActiveDiscipline,
  } = useKnowledgeBaseStore();

  const [activeTab, setActiveTab] = useState("map");
  const [focusedSkillId, setFocusedSkillId] = useState<string | null>(null);

  // Получаем дисциплины связанные с навыком
  const disciplinesWithSkill = useMemo(() => {
    if (!focusedSkillId) return [];
    return DISCIPLINES.filter((d) =>
      d.skills.some((s) => s.id === focusedSkillId),
    );
  }, [focusedSkillId]);

  const selectedDisciplinesData = useMemo(() => {
    return DISCIPLINES.filter((d) => selectedDisciplines.includes(d.id));
  }, [selectedDisciplines]);

  return (
    <div className="min-h-screen bg-(--color-background)">
      {/* Анимированный фон */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-1/3 w-96 h-96 bg-(--color-primary)/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-(--color-accent)/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Навигация в шапке */}
      <nav className="sticky top-0 z-40 bg-(--glass-default) backdrop-filter backdrop-blur-xl border-b border-(--color-border)">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Логотип и бренд */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3 flex-shrink-0"
            >
              <div className="brand-logo">
                <Shield size={24} />
              </div>
            </motion.div>

            {/* Навигация вкладок */}
            <div className="flex-1 flex justify-center mx-4">
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-auto"
              >
                <TabsList variant="pill" className="gap-1">
                  <TabsTrigger value="map" className="flex items-center gap-2">
                    <Map size={18} />
                    Карта дисциплин
                  </TabsTrigger>
                  <TabsTrigger
                    value="comparison"
                    disabled={selectedDisciplines.length === 0}
                    className="flex items-center gap-2"
                  >
                    <BarChart3 size={18} />
                    Сравнение ({selectedDisciplines.length})
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Быстрые навигационные ссылки */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {/* Ссылка на симулятор */}
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Link href="/simulator">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30 hover:border-cyan-500/60"
                  >
                    <Zap size={16} />
                    <span>Симулятор</span>
                  </motion.button>
                </Link>
              </motion.div>

              {/* Ссылка на трекер */}
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 }}
              >
                <Link href="/tracker">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 hover:border-emerald-500/60"
                  >
                    <Trophy size={16} />
                    <span>Трекер</span>
                  </motion.button>
                </Link>
              </motion.div>

              {/* Ссылка на корреляции */}
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Link href="/correlations">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30 hover:border-indigo-500/60"
                  >
                    <Network size={16} />
                    <span>Корреляции</span>
                  </motion.button>
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </nav>

      {/* Основной контент */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          {/* Вкладка карты компетенций */}
          <TabsContent value="map" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <CompetencyMap
                disciplines={
                  focusedSkillId
                    ? disciplinesWithSkill.length > 0
                      ? disciplinesWithSkill
                      : DISCIPLINES
                    : DISCIPLINES
                }
                selectedDisciplineIds={selectedDisciplines}
                onSelectDiscipline={(id, isMultiple) => {
                  selectDiscipline(id, isMultiple);
                  if (!isMultiple) {
                    setActiveDiscipline(id);
                  }
                }}
                onSkillClick={setFocusedSkillId}
                onClearSelection={clearSelectedDisciplines}
              />
            </motion.div>

            {/* Оповещение фильтра навыков */}
            {focusedSkillId && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-5 bg-linear-to-r from-(--color-warning)/10 to-(--color-error)/10 border border-(--color-warning)/30 rounded-xl flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-2 h-8 bg-(--color-warning) rounded-full" />
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-8 bg-(--color-warning) rounded-full" />
                    <p className="text-sm text-(--color-foreground) font-medium">
                      Показаны дисциплины с выбранным навыком
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setFocusedSkillId(null)}
                  className="btn-base btn-secondary text-sm"
                >
                  Очистить фильтр
                </button>
              </motion.div>
            )}
          </TabsContent>

          {/* Вкладка сравнения */}
          <TabsContent value="comparison" className="space-y-6">
            {selectedDisciplinesData.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Боковая панель выбранных дисциплин */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="card h-fit lg:col-span-1"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-1 h-6 bg-(--color-primary) rounded" />
                    <h3 className="font-bold text-(--color-foreground)">
                      Выбранные дисциплины
                    </h3>
                  </div>
                  <div className="space-y-2">
                    {selectedDisciplinesData.map((d, idx) => (
                      <motion.div
                        key={d.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="p-3 bg-(--color-surface-secondary) rounded-lg border-l-4 border-(--color-primary) hover:border-(--color-accent) transition-colors"
                      >
                        <p className="font-semibold text-xs text-(--color-foreground)">
                          {d.name}
                        </p>
                        <div className="flex gap-3 mt-2 text-xs text-(--color-foreground-tertiary)">
                          <div className="flex items-center gap-1">
                            <BookMarked size={14} />
                            <span>{d.skills.length} навыков</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar size={14} />
                            <span>S{d.semester}</span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Панель сравнения */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="lg:col-span-3"
                >
                  <ComparisonPanel
                    selectedDisciplines={selectedDisciplinesData}
                    onClear={clearSelectedDisciplines}
                    onSkillClick={setFocusedSkillId}
                  />
                </motion.div>
              </div>
            ) : (
              <div className="text-center py-20">
                <BookOpen className="w-16 h-16 mx-auto text-(--color-foreground-tertiary) mb-4" />
                <p className="text-(--color-foreground-secondary) mb-2">
                  Выберите дисциплины для сравнения
                </p>
                <p className="text-sm text-(--color-foreground-tertiary)">
                  Вернитесь на вкладку «Карта дисциплин» и выберите дисциплины
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      {/* Раздел быстрых ссылок */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {/* Ссылка на симулятор */}
          <Link href="/simulator">
            <motion.div
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
              className="p-8 bg-linear-to-br from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 border border-cyan-200 dark:border-cyan-700/50 rounded-2xl cursor-pointer shadow-lg hover:shadow-xl transition-all"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-cyan-500/20 dark:bg-cyan-500/30 rounded-xl">
                  <Zap size={28} className="text-cyan-600 dark:text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    Симулятор обучения
                  </h3>
                </div>
              </div>
              <p className="text-(--color-foreground-secondary) text-sm mb-4">
                Планируйте траекторию обучения и смотрите, какие навыки вы
                получите при выборе определённых дисциплин
              </p>
              <div className="inline-block px-4 py-2 bg-cyan-600 text-white rounded-lg font-medium text-sm hover:bg-cyan-700 transition-colors">
                Перейти →
              </div>
            </motion.div>
          </Link>

          {/* Ссылка на трекер */}
          <Link href="/tracker">
            <motion.div
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
              className="p-8 bg-linear-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 border border-emerald-200 dark:border-emerald-700/50 rounded-2xl cursor-pointer shadow-lg hover:shadow-xl transition-all"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-emerald-500/20 dark:bg-emerald-500/30 rounded-xl">
                  <Trophy
                    size={28}
                    className="text-emerald-600 dark:text-emerald-400"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    Трекер навыков
                  </h3>
                </div>
              </div>
              <p className="text-(--color-foreground-secondary) text-sm mb-4">
                Отслеживайте ваш прогресс обучения, помечайте завершённые навыки
                и зарабатывайте достижения
              </p>
              <div className="inline-block px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium text-sm hover:bg-emerald-700 transition-colors">
                Перейти →
              </div>
            </motion.div>
          </Link>

          {/* Ссылка на корреляции */}
          <Link href="/correlations">
            <motion.div
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
              className="p-8 bg-linear-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border border-indigo-200 dark:border-indigo-700/50 rounded-2xl cursor-pointer shadow-lg hover:shadow-xl transition-all"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-indigo-500/20 dark:bg-indigo-500/30 rounded-xl">
                  <Network
                    size={28}
                    className="text-indigo-600 dark:text-indigo-400"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    Корреляция дисциплин
                  </h3>
                </div>
              </div>
              <p className="text-(--color-foreground-secondary) text-sm mb-4">
                Изучайте взаимосвязи между дисциплинами по компетенциям и
                находите дополняющие друг друга курсы
              </p>
              <div className="inline-block px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium text-sm hover:bg-indigo-700 transition-colors">
                Перейти →
              </div>
            </motion.div>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-(--color-border) bg-(--color-surface)/50 backdrop-filter backdrop-blur-sm mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Столбец компетенций */}
            <div>
              <h4 className="font-semibold text-(--color-foreground) mb-4">
                Типы компетенций
              </h4>
              <ul className="space-y-2 text-sm text-(--color-foreground-secondary)">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full" /> УК -
                  Универсальные
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-purple-500 rounded-full" /> ПК -
                  Профессиональные
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-cyan-500 rounded-full" /> ОПК -
                  Общеспециальные
                </li>
              </ul>
            </div>

            {/* Информационный столбец */}
            <div>
              <h4 className="font-semibold text-(--color-foreground) mb-4">
                О проекте
              </h4>
              <p className="text-sm text-(--color-foreground-tertiary)">
                Система управления знаниями и навыками для координированного
                обучения в области кибербезопасности
              </p>
            </div>

            {/* Столбец навигации */}
            <div>
              <h4 className="font-semibold text-(--color-foreground) mb-4">
                Навигация
              </h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/"
                    className="text-(--color-foreground-secondary) hover:text-(--color-primary) transition-colors"
                  >
                    Карта дисциплин
                  </Link>
                </li>
                <li>
                  <Link
                    href="/simulator"
                    className="text-(--color-foreground-secondary) hover:text-(--color-primary) transition-colors"
                  >
                    Симулятор обучения
                  </Link>
                </li>
                <li>
                  <Link
                    href="/tracker"
                    className="text-(--color-foreground-secondary) hover:text-(--color-primary) transition-colors"
                  >
                    Трекер навыков
                  </Link>
                </li>
                <li>
                  <Link
                    href="/correlations"
                    className="text-(--color-foreground-secondary) hover:text-(--color-primary) transition-colors"
                  >
                    Корреляция дисциплин
                  </Link>
                </li>
              </ul>
            </div>

            {/* Столбец статистики */}
            <div>
              <h4 className="font-semibold text-(--color-foreground) mb-4">
                Статистика
              </h4>
              <ul className="space-y-2 text-sm text-(--color-foreground-secondary)">
                <li>Дисциплин: {DISCIPLINES.length}</li>
                <li>
                  Всего навыков:{" "}
                  {
                    new Set(
                      DISCIPLINES.flatMap((d) => d.skills.map((s) => s.id)),
                    ).size
                  }
                </li>
                <li>Семестров: 10</li>
              </ul>
            </div>
          </div>

          {/* Граница подвала */}
          <div className="border-t border-(--color-border) pt-6 text-center">
            <p className="text-sm text-(--color-foreground-tertiary)">
              © 2026 База знаний. Все права защищены.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
