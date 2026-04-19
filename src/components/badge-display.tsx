"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Lock,
  ShieldCheck,
  Router,
  FunctionSquare,
  Brackets,
  LockKeyhole,
  KeyRound,
  AlertTriangle,
  Microscope,
  LineChart,
  Crown,
  Star,
  Sparkles,
} from "lucide-react";
import { Badge } from "../types";
import { BADGE_DISCIPLINES_MAP } from "../data/user-profile";

interface BadgeDisplayProps {
  badges: Badge[];
  onBadgeClick?: (badgeId: string) => void;
  selectedDisciplines?: string[];
}

const getIconForBadge = (icon: string) => {
  const iconMap: Record<string, React.ReactNode> = {
    "shield-check": <ShieldCheck size={48} className="text-blue-500" strokeWidth={1.5} />,
    router: <Router size={48} className="text-purple-500" strokeWidth={1.5} />,
    "function-square": <FunctionSquare size={48} className="text-emerald-500" strokeWidth={1.5} />,
    brackets: <Brackets size={48} className="text-orange-500" strokeWidth={1.5} />,
    "lock-keyhole": <LockKeyhole size={48} className="text-red-500" strokeWidth={1.5} />,
    "key-round": <KeyRound size={48} className="text-pink-500" strokeWidth={1.5} />,
    "alert-triangle": <AlertTriangle size={48} className="text-yellow-500" strokeWidth={1.5} />,
    microscope: <Microscope size={48} className="text-cyan-500" strokeWidth={1.5} />,
    "line-chart": <LineChart size={48} className="text-green-500" strokeWidth={1.5} />,
    crown: <Crown size={48} className="text-indigo-500" strokeWidth={1.5} />,
  };
  return iconMap[icon] || <ShieldCheck size={48} className="text-blue-500" strokeWidth={1.5} />;
};

// Простой эффект при разблокировке - только звёздочка
const UnlockedIndicator = ({ isNew }: { isNew: boolean }) => {
  if (!isNew) return null;
  
  return (
    <motion.div
      initial={{ scale: 0, rotate: -180, opacity: 0 }}
      animate={{ scale: 1, rotate: 0, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 12,
      }}
      className="absolute -top-3 -right-3 w-10 h-10 bg-linear-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center shadow-lg border-3 border-white dark:border-slate-800 z-20"
    >
      <Sparkles size={20} className="text-white" />
    </motion.div>
  );
};

export const BadgeDisplay: React.FC<BadgeDisplayProps> = ({
  badges,
  onBadgeClick,
  selectedDisciplines = [],
}) => {
  const [newBadges, setNewBadges] = useState<Set<string>>(new Set());

  // Функция для проверки, подходит ли бейдж под выбранные дисциплины
  const isBadgeForSelectedDisciplines = (badgeId: string): boolean => {
    if (selectedDisciplines.length === 0) return true; // Если дисциплины не выбраны, показываем все

    const badgeDisciplines = BADGE_DISCIPLINES_MAP[badgeId];
    if (!badgeDisciplines || badgeDisciplines.length === 0) return true;
    return badgeDisciplines.some((disciplineId) =>
      selectedDisciplines.includes(disciplineId),
    );
  };

  // Отслеживаем новые разблокировки
  useEffect(() => {
    const recentlyUnlocked = badges
      .filter(
        (b) =>
          b.unlocked &&
          b.unlockedAt &&
          new Date().getTime() - new Date(b.unlockedAt).getTime() < 5000
      )
      .map((b) => b.id);

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNewBadges(new Set(recentlyUnlocked));

    const timer = setTimeout(() => {
      setNewBadges(new Set());
    }, 5000);

    return () => clearTimeout(timer);
  }, [badges]);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.9 },
    show: { opacity: 1, y: 0, scale: 1 },
  };

  const unlockedVariants = {
    hidden: { scale: 0, rotate: -180 },
    show: {
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 12,
        duration: 0.6,
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
    >
      {badges.map((badge) => {
        const isNew = newBadges.has(badge.id);
        const isForSelectedDisciplines = isBadgeForSelectedDisciplines(badge.id);

        return (
          <motion.div key={badge.id} variants={itemVariants}>
            <motion.button
              whileHover={badge.unlocked ? { scale: 1.12, y: -12 } : {}}
              whileTap={badge.unlocked ? { scale: 0.95 } : {}}
              onClick={() => badge.unlocked && onBadgeClick?.(badge.id)}
              className={`
                relative w-full p-6 rounded-2xl flex flex-col items-center justify-center
                transition-all duration-300 group border backdrop-blur-sm
                min-h-60
                ${
                  badge.unlocked
                    ? isForSelectedDisciplines
                      ? "bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 border-2 border-emerald-200 dark:border-emerald-700 hover:shadow-2xl shadow-lg cursor-pointer"
                      : "bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 border-2 border-slate-300 dark:border-slate-600 hover:shadow-lg shadow cursor-pointer opacity-60"
                    : "bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 opacity-50"
                }
              `}
              disabled={!badge.unlocked}
              title={isForSelectedDisciplines ? "" : "Это достижение принадлежит другим дисциплинам"}
            >
              {/* Упрощенный индикатор при разблокировке */}
              {isNew && <UnlockedIndicator isNew={true} />}

              {/* Иконка замка для заблокированных */}
              {!badge.unlocked && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute top-4 right-4 w-8 h-8 bg-slate-300 dark:bg-slate-600 rounded-full flex items-center justify-center"
                >
                  <Lock size={16} className="text-slate-600 dark:text-slate-300" />
                </motion.div>
              )}

              {/* Иконка бейджа */}
              <motion.div
                animate={{
                  scale: badge.unlocked ? [1, 1.1, 1] : 1,
                }}
                transition={{
                  duration: 0.6,
                  repeat: badge.unlocked ? Infinity : 0,
                  repeatDelay: 2,
                }}
                className="mb-4 filter drop-shadow-lg"
              >
                {getIconForBadge(badge.icon)}
              </motion.div>

              {/* Название */}
              <h4 className="font-bold text-sm text-center text-slate-900 dark:text-slate-100 mb-2 leading-tight">
                {badge.name}
              </h4>

              {/* Описание */}
              <p className="text-xs text-slate-600 dark:text-slate-400 text-center line-clamp-2 mb-3">
                {badge.description}
              </p>

              {/* Дата разблокировки */}
              {badge.unlocked && badge.unlockedAt && (
                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  className="text-xs font-medium text-emerald-600 dark:text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center gap-1"
                >
                  <Star size={13} fill="currentColor" /> {new Date(badge.unlockedAt).toLocaleDateString("ru-RU")}
                </motion.div>
              )}

              {/* Индикатор соответствия дисциплинам */}
              {badge.unlocked && isForSelectedDisciplines && selectedDisciplines.length > 0 && (
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ delay: 0.2 }}
                  className="absolute bottom-0 left-0 h-1 bg-emerald-500 dark:bg-emerald-400 rounded-b-2xl"
                />
              )}

              {/* Глоу эффект для разблокированных */}
              {badge.unlocked && (
                <>
                  <motion.div className="absolute inset-0 rounded-2xl bg-linear-to-r from-emerald-400 to-cyan-400 opacity-0 group-hover:opacity-15 blur transition-opacity duration-300 -z-10"></motion.div>
                  <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 rounded-2xl border-2 border-emerald-300 dark:border-emerald-600 opacity-0 group-hover:opacity-50 transition-opacity duration-300"
                  />
                </>
              )}
            </motion.button>
          </motion.div>
        );
      })}
    </motion.div>
  );
};
