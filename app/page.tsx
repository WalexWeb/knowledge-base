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
  GraduationCap,
  ArrowLeft,
} from "lucide-react";
import { useKnowledgeBaseStore } from "@/src/store/knowledge-base";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/src/components/ui/tabs";
import { CompetencyMap } from "@/src/components/competency-map";
import { ComparisonPanel } from "@/src/components/comparison-panel";
import {
  getSpecializations,
  getSpecializationData,
} from "@/src/utils/specialization-formatter";
import { PageHeader } from "@/src/components/page-header";

export default function Home() {
  const {
    selectedDisciplines,
    selectDiscipline,
    clearSelectedDisciplines,
    setActiveDiscipline,
  } = useKnowledgeBaseStore();

  const [activeTab, setActiveTab] = useState("map");
  const [focusedSkillId, setFocusedSkillId] = useState<string | null>(null);
  const [selectedSpecializationId, setSelectedSpecializationId] = useState<
    string | null
  >(null);

  // Список всех специализаций
  const specializations = useMemo(() => getSpecializations(), []);

  // Текущая выбранная специализация (объект)
  const currentSpecialization = useMemo(() => {
    if (!selectedSpecializationId) return null;
    return specializations.find((s) => s.id === selectedSpecializationId);
  }, [specializations, selectedSpecializationId]);

  // Дисциплины выбранной специализации
  const disciplines = useMemo(() => {
    if (!selectedSpecializationId) return [];
    return getSpecializationData(selectedSpecializationId);
  }, [selectedSpecializationId]);

  // Фильтрация по выбранному навыку
  const filteredDisciplines = useMemo(() => {
    if (!focusedSkillId) return disciplines;
    return disciplines.filter((d) =>
      d.skills.some((s) => s.id === focusedSkillId),
    );
  }, [disciplines, focusedSkillId]);

  const selectedDisciplinesData = useMemo(() => {
    return disciplines.filter((d) => selectedDisciplines.includes(d.id));
  }, [disciplines, selectedDisciplines]);

  const handleSelectSpecialization = (id: string) => {
    setSelectedSpecializationId(id);
    clearSelectedDisciplines();
    setFocusedSkillId(null);
    setActiveTab("map");
  };

  const handleBackToSpecializations = () => {
    setSelectedSpecializationId(null);
    clearSelectedDisciplines();
    setFocusedSkillId(null);
    setActiveTab("map");
  };

  const tabButtons = (
    <div className="flex items-center gap-2">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setActiveTab("map")}
        className={`flex items-center gap-2  px-3 py-2 rounded-lg text-sm font-medium transition-all border ${
          activeTab === "map"
            ? "bg-linear-to-r from-indigo-500 to-purple-500 text-white border-indigo-500/60"
            : "bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border-indigo-500/30 hover:border-indigo-500/60"
        }`}
      >
        <Map size={16} />
        <span className="hidden sm:inline">Карта дисциплин</span>
        <span className="sm:hidden">Карта</span>
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setActiveTab("comparison")}
        disabled={selectedDisciplines.length === 0}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all border ${
          activeTab === "comparison"
            ? "bg-linear-to-r from-indigo-500 to-purple-500 text-white border-indigo-500/60"
            : "bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border-indigo-500/30 hover:border-indigo-500/60"
        } disabled:opacity-40 disabled:hover:scale-100`}
      >
        <BarChart3 size={16} />
        <span className="hidden sm:inline">
          Сравнение ({selectedDisciplines.length})
        </span>
        <span className="sm:hidden">Сравн. ({selectedDisciplines.length})</span>
      </motion.button>
    </div>
  );

  return (
    <div className="min-h-screen bg-linear-to-br ...">
      <div className="fixed inset-0 pointer-events-none">...</div>

      <PageHeader
        currentPage="map"
        hideMapButton={!!selectedSpecializationId}
        leftSlot={
          selectedSpecializationId && (
            <motion.button
              onClick={handleBackToSpecializations}
              whileHover={{ scale: 1.05, backgroundColor: "rgba(0,0,0,0.05)" }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all bg-white/40 dark:bg-slate-800/40 hover:bg-white/60 dark:hover:bg-slate-700/60 text-slate-700 dark:text-slate-200 border border-slate-200/50 dark:border-slate-700/50"
            >
              <ArrowLeft size={16} />
              <span className="hidden sm:inline">Все специализации</span>
              <span className="sm:hidden">Назад</span>
            </motion.button>
          )
        }
        centerSlot={selectedSpecializationId ? tabButtons : undefined}
      />

      {/* Основной контент */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {!selectedSpecializationId ? (
          // Экран выбора специализации
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="text-center mb-12">
              <h1 className="text-5xl font-bold mb-3 flex items-center justify-center gap-3">
                <GraduationCap size={40} className="text-indigo-500" />
                <span className="bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Выберите специализацию
                </span>
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                Для просмотра карты дисциплин и компетенций выберите одну из
                специализаций
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {specializations.map((spec) => (
                <motion.div
                  key={spec.id}
                  whileHover={{ y: -4, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSelectSpecialization(spec.id)}
                  className="cursor-pointer rounded-2xl p-6 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm border border-slate-200 dark:border-slate-700/50 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-xl transition-all"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-xl bg-indigo-100/50 dark:bg-indigo-900/30">
                      <GraduationCap
                        size={24}
                        className="text-indigo-600 dark:text-indigo-400"
                      />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                      {spec.name}
                    </h3>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">
                    Нажмите, чтобы загрузить дисциплины и компетенции
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          // Карта дисциплин выбранной специализации
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsContent value="map" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <CompetencyMap
                  disciplines={filteredDisciplines}
                  selectedDisciplineIds={selectedDisciplines}
                  onSelectDiscipline={(id, isMultiple) => {
                    selectDiscipline(id, isMultiple);
                    if (!isMultiple) setActiveDiscipline(id);
                  }}
                  onSkillClick={setFocusedSkillId}
                  onClearSelection={clearSelectedDisciplines}
                  specializationName={currentSpecialization?.name}
                />
              </motion.div>

              {focusedSkillId && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-5 bg-amber-50/80 dark:bg-amber-900/30 backdrop-blur-sm border border-amber-200 dark:border-amber-700/50 rounded-xl flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-8 bg-amber-500 rounded-full" />
                    <p className="text-sm text-slate-700 dark:text-slate-200 font-medium">
                      Показаны дисциплины с выбранным навыком
                    </p>
                  </div>
                  <button
                    onClick={() => setFocusedSkillId(null)}
                    className="px-4 py-2 rounded-lg text-sm font-medium bg-white/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
                  >
                    Очистить фильтр
                  </button>
                </motion.div>
              )}
            </TabsContent>

            <TabsContent value="comparison" className="space-y-6">
              {selectedDisciplinesData.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-xl p-5 h-fit lg:col-span-1"
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-1 h-6 bg-indigo-500 rounded" />
                      <h3 className="font-bold text-slate-900 dark:text-white">
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
                          className="p-3 bg-slate-100/70 dark:bg-slate-800/70 rounded-lg border-l-4 border-indigo-500 hover:border-indigo-400 transition-colors"
                        >
                          <p className="font-semibold text-sm text-slate-800 dark:text-slate-100">
                            {d.name}
                          </p>
                          <div className="flex gap-3 mt-2 text-xs text-slate-500 dark:text-slate-400">
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
                <div className="text-center py-20 bg-white/30 dark:bg-slate-900/30 backdrop-blur-sm rounded-xl">
                  <BookOpen className="w-16 h-16 mx-auto text-slate-400 dark:text-slate-500 mb-4" />
                  <p className="text-slate-600 dark:text-slate-300 mb-2">
                    Выберите дисциплины для сравнения
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Вернитесь на вкладку «Карта дисциплин» и выберите дисциплины
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </main>

      {/* Быстрые ссылки и footer */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
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
              <p className="text-slate-600 dark:text-slate-300 text-sm mb-4">
                Планируйте траекторию обучения и смотрите, какие навыки вы
                получите при выборе определённых дисциплин
              </p>
              <div className="inline-block px-4 py-2 bg-cyan-600 text-white rounded-lg font-medium text-sm hover:bg-cyan-700 transition-colors">
                Перейти →
              </div>
            </motion.div>
          </Link>

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
              <p className="text-slate-600 dark:text-slate-300 text-sm mb-4">
                Отслеживайте ваш прогресс обучения, помечайте завершённые навыки
                и зарабатывайте достижения
              </p>
              <div className="inline-block px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium text-sm hover:bg-emerald-700 transition-colors">
                Перейти →
              </div>
            </motion.div>
          </Link>

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
              <p className="text-slate-600 dark:text-slate-300 text-sm mb-4">
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

      <footer className="relative z-10 border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 backdrop-blur-sm mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-white mb-4">
                Типы компетенций
              </h4>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
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
                  Общепрофессиональные
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-white mb-4">
                О проекте
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Система управления знаниями и навыками для координированного
                обучения в области кибербезопасности
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-white mb-4">
                Навигация
              </h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/"
                    className="text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  >
                    Карта дисциплин
                  </Link>
                </li>
                <li>
                  <Link
                    href="/simulator"
                    className="text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  >
                    Симулятор обучения
                  </Link>
                </li>
                <li>
                  <Link
                    href="/tracker"
                    className="text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  >
                    Трекер навыков
                  </Link>
                </li>
                <li>
                  <Link
                    href="/correlations"
                    className="text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  >
                    Корреляция дисциплин
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-white mb-4">
                Статистика
              </h4>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li>Дисциплин: {disciplines.length}</li>
                <li>
                  Всего навыков:{" "}
                  {
                    new Set(
                      disciplines.flatMap((d) => d.skills.map((s) => s.id)),
                    ).size
                  }
                </li>
                <li>
                  Семестров: {new Set(disciplines.map((d) => d.semester)).size}
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-200 dark:border-slate-800 pt-6 text-center">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              © 2026 База знаний. Все права защищены.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
