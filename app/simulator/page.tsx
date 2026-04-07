"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Zap } from "lucide-react";
import Link from "next/link";
import { useKnowledgeBaseStore } from "@/src/store/knowledge-base";
import { DISCIPLINES } from "@/src/data/mock-data";
import { SimulatorPanel } from "@/src/components/simulator-panel";

export default function SimulatorPage() {
  const { selectedDisciplines, selectDiscipline } = useKnowledgeBaseStore();

  const handleSelectDiscipline = (id: string) => {
    selectDiscipline(id, true);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-white via-slate-50 to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-slate-900 dark:text-white">
      {/* Фоновые элементы */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-400/10 dark:bg-cyan-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-400/10 dark:bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10">
        {/* Навигация */}
        <nav className="sticky top-0 z-20 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-700/50 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
            <Link
              href="/"
              className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors w-fit font-semibold"
            >
              <ArrowLeft size={18} />
              На главную
            </Link>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Заголовок */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <h1 className="text-5xl font-bold mb-3 flex items-center gap-3">
              <Zap size={40} className="text-cyan-500" />
              <span className="bg-linear-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                Симулятор обучения
              </span>
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-lg font-medium">
              Выберите дисциплины и посмотрите, какие навыки вы получите
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Левая панель - Список дисциплин */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-1 space-y-4"
            >
              <div className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-5">
                  📚 Все дисциплины
                </h3>
                <div className="space-y-2 max-h-[calc(100vh-300px)] overflow-y-auto">
                  {DISCIPLINES.map((discipline) => (
                    <motion.button
                      key={discipline.id}
                      layout
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSelectDiscipline(discipline.id)}
                      className={`
                        w-full text-left p-4 rounded-xl transition-all font-medium text-sm border-2
                        ${
                          selectedDisciplines.includes(discipline.id)
                            ? "bg-linear-to-r from-blue-100 to-blue-50 dark:from-blue-900/40 dark:to-blue-800/30 border-blue-300 dark:border-blue-600/50 text-blue-900 dark:text-blue-200 shadow-md"
                            : "bg-slate-100 dark:bg-slate-700/30 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700/50 border-slate-300 dark:border-slate-700"
                        }
                      `}
                    >
                      <p>{discipline.name}</p>
                      <p
                        className={`text-xs mt-1.5 font-semibold ${
                          selectedDisciplines.includes(discipline.id)
                            ? "text-blue-700 dark:text-blue-300"
                            : "text-slate-600 dark:text-slate-400"
                        }`}
                      >
                        Сем. {discipline.semester} • {discipline.skills.length}{" "}
                        навыков
                      </p>
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Правая панель - Симулятор */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-3"
            >
              <SimulatorPanel
                allDisciplines={DISCIPLINES}
                selectedDisciplines={selectedDisciplines}
                onSelectDiscipline={handleSelectDiscipline}
              />
            </motion.div>
          </div>

          {/* Подсказка */}
          {selectedDisciplines.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-8 p-6 bg-slate-900/50 border border-slate-700 rounded-xl text-center"
            >
              <p className="text-slate-400">
                👈 Нажмите на дисциплину слева или используйте быстрый выбор на
                главной странице
              </p>
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
}
