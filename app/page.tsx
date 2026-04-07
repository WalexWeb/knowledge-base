"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Map,
  BarChart3,
  Shield,
  BookOpen,
  BookMarked,
  Calendar,
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
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-1/3 w-96 h-96 bg-(--color-primary)/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-(--color-accent)/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Header Navigation */}
      <nav className="sticky top-0 z-40 bg-(--glass-default) backdrop-filter backdrop-blur-xl border-b border-(--color-border)">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-16">
            {/* Logo & Brand */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3"
            >
              <div className="brand-logo">
                <Shield size={24} />
              </div>
            </motion.div>

            {/* Tab Navigation */}
            <div className="flex-1 flex justify-center">
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

            <div className="w-20" />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          {/* Competency Map Tab */}
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

            {/* Skill Filter Alert */}
            {focusedSkillId && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-5 bg-linear-to-r from-(--color-warning)/10 to-(--color-error)/10 border border-(--color-warning)/30 rounded-xl flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-2 h-8 bg-(--color-warning) rounded-full" />
                  <p className="text-sm text-(--color-foreground) font-medium">
                    📌 Показаны дисциплины с выбранным навыком
                  </p>
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

          {/* Comparison Tab */}
          <TabsContent value="comparison" className="space-y-6">
            {selectedDisciplinesData.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Selected Disciplines Sidebar */}
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

                {/* Comparison Panel */}
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

      {/* Footer */}
      <footer className="relative z-10 border-t border-(--color-border) bg-(--color-surface)/50 backdrop-filter backdrop-blur-sm mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand Column */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="brand-logo">
                  <Shield size={18} />
                </div>
                <span className="font-bold text-(--color-foreground)">
                  InfoSec KB
                </span>
              </div>
              <p className="text-sm text-(--color-foreground-tertiary)">
                Интерактивная карта профессионального развития в области
                информационной безопасности
              </p>
            </div>

            {/* Navigation Column */}
            <div>
              <h4 className="font-semibold text-(--color-foreground) mb-4">
                Навигация
              </h4>
              <ul className="space-y-2 text-sm text-(--color-foreground-secondary)">
                <li>
                  <a
                    href="#"
                    className="hover:text-(--color-primary) transition"
                  >
                    Карта дисциплин
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-(--color-primary) transition"
                  >
                    Трекер навыков
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-(--color-primary) transition"
                  >
                    Симулятор
                  </a>
                </li>
              </ul>
            </div>

            {/* Competencies Column */}
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

            {/* Info Column */}
            <div>
              <h4 className="font-semibold text-(--color-foreground) mb-4">
                О проекте
              </h4>
              <p className="text-sm text-(--color-foreground-tertiary)">
                Система управления знаниями и навыками для координированного
                обучения в области кибербезопасности
              </p>
            </div>
          </div>

          {/* Footer Border */}
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
