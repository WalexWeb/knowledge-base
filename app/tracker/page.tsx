"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Trophy, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useKnowledgeBaseStore } from "@/src/store/knowledge-base";
import { DISCIPLINES } from "@/src/data/mock-data";
import {
  ProgressBar,
  SkillChecklist,
  TimelineItem,
} from "@/src/components/progress-components";
import { BadgeDisplay } from "@/src/components/badge-display";

export default function TrackerPage() {
  const { userProfile, toggleSkillCompletion, unlockBadge } =
    useKnowledgeBaseStore();
  const [showBadges, setShowBadges] = useState(false);

  // Собираем все навыки со всех дисциплин
  const allSkills = useMemo(() => {
    const skillMap = new Map();
    DISCIPLINES.forEach((d) => {
      d.skills.forEach((s) => {
        if (!skillMap.has(s.id)) {
          skillMap.set(s.id, s);
        }
      });
    });
    return Array.from(skillMap.values());
  }, []);

  // Группируем навыки по дисциплинам и семестрам
  const skillsByDiscipline = useMemo(() => {
    return DISCIPLINES.map((d) => ({
      discipline: d,
      skills: d.skills.map((s) => ({
        ...s,
        completed: userProfile.completedSkills.includes(s.id),
      })),
    }));
  }, [userProfile.completedSkills]);

  const completionPercentage = useMemo(() => {
    return Math.round(
      (userProfile.completedSkills.length / allSkills.length) * 100,
    );
  }, [userProfile.completedSkills, allSkills]);

  // Проверка разблокированных бейджей
  const unlockedBadges = useMemo(() => {
    if (completionPercentage >= 100) {
      return ["badge-security-engineer"];
    } else if (completionPercentage >= 70) {
      return ["badge-incident-response"];
    } else if (completionPercentage >= 50) {
      return ["badge-network-admin", "badge-crypto-master"];
    }
    return [];
  }, [completionPercentage]);

  return (
    <div className="min-h-screen bg-linear-to-br from-white via-slate-50 to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-slate-900 dark:text-white">
      {/* Фоновые элементы */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-400/10 dark:bg-emerald-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-400/10 dark:bg-cyan-500/10 rounded-full blur-3xl"></div>
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
              <TrendingUp size={40} className="text-emerald-500" />
              <span className="bg-linear-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent">
                Трекер навыков
              </span>
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-lg font-medium">
              Отслеживайте ваш прогресс в освоении компетенций
            </p>
          </motion.div>

          {/* Основная статистика */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-12">
            {/* Прогресс */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="col-span-1 md:col-span-2 bg-linear-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 border border-emerald-200 dark:border-emerald-700/50 rounded-2xl p-7 shadow-sm"
            >
              <p className="text-slate-700 dark:text-slate-300 text-sm font-medium mb-4">
                📊 Общий прогресс
              </p>
              <div className="mb-5">
                <motion.p
                  key={completionPercentage}
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className="text-5xl font-bold bg-linear-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent"
                >
                  {completionPercentage}%
                </motion.p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 font-medium">
                  {userProfile.completedSkills.length} из {allSkills.length}{" "}
                  навыков освоено
                </p>
              </div>
              <ProgressBar percentage={completionPercentage} animated={true} />
            </motion.div>

            {/* Уровень */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-linear-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-700/50 rounded-2xl p-7 shadow-sm"
            >
              <p className="text-slate-700 dark:text-slate-300 text-sm font-medium mb-4">
                🎯 Статус
              </p>
              <div className="text-4xl font-bold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                {completionPercentage < 30
                  ? "Новичок"
                  : completionPercentage < 60
                    ? "Ученик"
                    : completionPercentage < 80
                      ? "Мастер"
                      : "Эксперт"}
              </div>
            </motion.div>

            {/* Бейджи */}
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              whileHover={{ scale: 1.05 }}
              onClick={() => setShowBadges(!showBadges)}
              className="bg-linear-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-2 border-amber-200 dark:border-amber-700/50 rounded-2xl p-7 hover:border-amber-300 dark:hover:border-amber-600/50 transition-all text-left shadow-sm hover:shadow-md"
            >
              <p className="text-slate-700 dark:text-slate-300 text-sm font-medium mb-2">
                🏆 Достижения
              </p>
              <div className="text-4xl font-bold text-amber-600 dark:text-amber-400">
                {userProfile.badges.filter((b) => b.unlocked).length}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
                Нажмите для просмотра
              </p>
            </motion.button>
          </div>

          {/* Бейджи */}
          {showBadges && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-12 bg-linear-to-br from-white to-slate-50 dark:from-slate-800/50 dark:to-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl p-7 shadow-sm"
            >
              <h2 className="text-2xl font-bold mb-7 flex items-center gap-3 text-slate-900 dark:text-white">
                <Trophy size={28} className="text-amber-500" />
                Ваши достижения
              </h2>
              <BadgeDisplay
                badges={userProfile.badges}
                onBadgeClick={unlockBadge}
              />
            </motion.div>
          )}

          {/* Список навыков по дисциплинам */}
          <div className="space-y-6">
            {skillsByDiscipline.map((item, index) => {
              const completedCount = item.skills.filter(
                (s) => s.completed,
              ).length;
              const totalCount = item.skills.length;
              const percentage = Math.round(
                (completedCount / totalCount) * 100,
              );

              return (
                <motion.div
                  key={item.discipline.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-linear-to-br from-white to-slate-50 dark:from-slate-800/50 dark:to-slate-900/50 border border-slate-200 dark:border-slate-700/50 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between mb-5">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                        {item.discipline.name}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 font-medium">
                        📅 Семестр {item.discipline.semester}
                      </p>
                    </div>
                    <div className="text-right bg-emerald-100 dark:bg-emerald-900/30 px-4 py-2 rounded-lg">
                      <motion.p
                        key={percentage}
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        className="text-2xl font-bold text-emerald-600 dark:text-emerald-400"
                      >
                        {percentage}%
                      </motion.p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        {completedCount}/{totalCount}
                      </p>
                    </div>
                  </div>

                  {/* Прогресс */}
                  <div className="mb-5 h-2.5 bg-slate-300 dark:bg-slate-700 rounded-full overflow-hidden shadow-sm">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className="h-full bg-linear-to-r from-emerald-500 to-cyan-500 shadow-lg"
                    ></motion.div>
                  </div>

                  {/* Навыки */}
                  <SkillChecklist
                    skills={item.skills.map((s) => ({
                      id: s.id,
                      name: s.name,
                      completed: s.completed,
                    }))}
                    onSkillToggle={(skillId) => toggleSkillCompletion(skillId)}
                  />
                </motion.div>
              );
            })}
          </div>

          {/* Таймлайн */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-16 bg-linear-to-br from-white to-slate-50 dark:from-slate-800/50 dark:to-slate-900/50 border border-slate-200 dark:border-slate-700/50 rounded-2xl p-8 shadow-sm"
          >
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">
              📈 Путь развития
            </h2>
            <div className="space-y-6">
              {[1, 2, 3, 4].map((semester) => {
                const semesterDisciplines = DISCIPLINES.filter(
                  (d) => d.semester === semester,
                );
                const semesterSkills = semesterDisciplines.flatMap(
                  (d) => d.skills,
                );
                const completedInSemester = semesterSkills.filter((s) =>
                  userProfile.completedSkills.includes(s.id),
                );

                return (
                  <TimelineItem
                    key={semester}
                    semester={semester}
                    skillsCount={semesterSkills.length}
                    isCompleted={
                      completedInSemester.length === semesterSkills.length
                    }
                    position={semester - 1}
                  />
                );
              })}
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
