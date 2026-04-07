"use client";

import { motion } from "framer-motion";
import { Network } from "lucide-react";
import { DISCIPLINES } from "@/src/data/mock-data";
import { CorrelationMap } from "@/src/components/correlation-map";
import { PageHeader } from "@/src/components/page-header";

export default function CorrelationsPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-white via-slate-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-slate-900 dark:text-white">
      {/* Фоновые элементы */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-400/10 dark:bg-indigo-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-400/10 dark:bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10">
        <PageHeader currentPage="correlations" />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Заголовок */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <h1 className="text-5xl font-bold mb-3 flex items-center gap-3">
              <Network size={40} className="text-indigo-500" />
              <span className="bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Корреляция дисциплин
              </span>
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl">
              Исследуйте взаимосвязи между дисциплинами по компетенциям. Высокая корреляция указывает на дополняющие друг друга знания.
            </p>
          </motion.div>

          {/* Основной контент */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <CorrelationMap disciplines={DISCIPLINES} />
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
                <strong>Пустая ячейка:</strong> Дисциплины не имеют общих компетенций
              </li>
              <li>
                <strong>Цветная ячейка с числом:</strong> Количество общих компетенций между дисциплинами
              </li>
              <li>
                <strong>Синий цвет:</strong> 1 общая компетенция
              </li>
              <li>
                <strong>Зелёный цвет:</strong> 2 общие компетенции
              </li>
              <li>
                <strong>Фиолетовый цвет:</strong> 3 общие компетенции (все типы: УК, ПК, ОПК)
              </li>
            </ul>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
