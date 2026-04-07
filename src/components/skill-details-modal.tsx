"use client";

import { motion } from "framer-motion";
import { Discipline, Skill } from "../types";
import {
  X,
  Share2,
  Download,
  Brain,
  Zap,
  TrendingUp,
  Tag,
  Layers,
  Calendar,
  Clock,
  BookOpen,
} from "lucide-react";

interface SkillDetailsModalProps {
  skill: Skill;
  disciplinesWithSkill: Discipline[];
  onClose: () => void;
}

export const SkillDetailsModal: React.FC<SkillDetailsModalProps> = ({
  skill,
  disciplinesWithSkill,
  onClose,
}) => {
  const COMPETENCY_COLORS = {
    УК: "from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700",
    ПК: "from-emerald-500 to-emerald-600 dark:from-emerald-600 dark:to-emerald-700",
    ОПК: "from-purple-500 to-purple-600 dark:from-purple-600 dark:to-purple-700",
  };

  return (
    <>
      {/* Фон модала */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/40 backdrop-blur-md z-40"
      />

      {/* Модал */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 30 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <motion.div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/50 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto backdrop-blur-xl">
          {/* Заголовок */}
          <div
            className={`
              relative bg-linear-to-r ${COMPETENCY_COLORS[skill.type]} p-8
              text-white flex items-start justify-between rounded-t-2xl
            `}
          >
            <motion.div className="flex-1">
              <motion.h2
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl font-bold mb-3"
              >
                {skill.name}
              </motion.h2>
              <div className="flex items-center gap-4 text-sm text-white/90 flex-wrap">
                <div className="flex items-center gap-1">
                  <Tag size={16} />
                  <span>Тип: {skill.type}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Layers size={16} />
                  <span>Уровень: {skill.level}</span>
                </div>
              </div>
            </motion.div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="p-2 hover:bg-white/20 dark:hover:bg-black/30 rounded-xl transition-colors"
            >
              <X size={24} />
            </motion.button>
          </div>

          {/* Содержание */}
          <div className="p-8 space-y-6">
            {/* Где формируется */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <BookOpen size={24} />
                Где формируется этот навык
              </h3>
              <div className="space-y-3">
                {disciplinesWithSkill.map((discipline, index) => (
                  <motion.div
                    key={discipline.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                    className="p-4 bg-linear-to-r from-slate-50 to-slate-100 dark:from-slate-700/30 dark:to-slate-800/30 rounded-xl border border-slate-200 dark:border-slate-700/50 hover:border-slate-300 dark:hover:border-slate-600/50 transition-all shadow-sm hover:shadow-md"
                  >
                    <div>
                      <h4 className="font-semibold text-slate-900 dark:text-white">
                        {discipline.name}
                      </h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 flex items-center gap-3 flex-wrap">
                        <span className="flex items-center gap-1">
                          <Calendar size={14} />
                          Семестр {discipline.semester}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={14} />
                          {discipline.hours} ч.
                        </span>
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Описание уровня */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className={`bg-linear-to-r ${COMPETENCY_COLORS[skill.type]} rounded-xl p-5 text-white`}
            >
              <div className="flex items-center gap-2 mb-2">
                {skill.level === "знать" ? (
                  <Brain size={20} />
                ) : skill.level === "уметь" ? (
                  <Zap size={20} />
                ) : (
                  <TrendingUp size={20} />
                )}
                <h4 className="font-bold">
                  Уровень овладения:{" "}
                  <span className="font-black">{skill.level}</span>
                </h4>
              </div>
              <p className="text-sm font-medium opacity-95">
                {skill.level === "знать"
                  ? "Вы поймёте основные концепции и теорию"
                  : skill.level === "уметь"
                    ? "Вы сможете применять знания на практике"
                    : "Вы будете глубоко владеть этим навыком"}
              </p>
            </motion.div>

            {/* Действия */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-700"
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-medium transition-all shadow-md hover:shadow-lg"
              >
                <Share2 size={18} />
                Поделиться
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-900 dark:text-white rounded-xl font-medium transition-all shadow-md hover:shadow-lg"
              >
                <Download size={18} />
                Скачать
              </motion.button>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
};
