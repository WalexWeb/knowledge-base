"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { GitBranch, ArrowLeft } from "lucide-react";
import { PageHeader } from "@/src/components/page-header";
import { CurriculumChainPanel } from "@/src/components/curriculum-chain-panel";

export default function CurriculumChainPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-white via-slate-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-slate-900 dark:text-white">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-400/10 dark:bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-violet-400/10 dark:bg-violet-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        <PageHeader currentPage="correlations" />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Link
            href="/correlations"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors mb-8"
          >
            <ArrowLeft size={16} />
            Назад к корреляциям
          </Link>

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10"
          >
            <h1 className="text-4xl sm:text-5xl font-bold mb-3 flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-violet-500/15">
                <GitBranch
                  size={36}
                  className="text-violet-600 dark:text-violet-400"
                />
              </div>
              <span className="bg-linear-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                Цепочка дисциплин
              </span>
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl">
              Логическая последовательность базовых дисциплин по категориям
              К1–К4. Сравните учебный план по семестрам и найдите нарушения
              порядка изучения.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <CurriculumChainPanel />
          </motion.div>
        </main>
      </div>
    </div>
  );
}
