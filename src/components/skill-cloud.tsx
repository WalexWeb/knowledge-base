"use client";

import { motion } from "framer-motion";
import { Skill } from "../types";

interface SkillCloudProps {
  skills: Skill[];
  onSkillClick?: (skillId: string) => void;
  className?: string;
}

const GRADIENT_BY_TYPE = {
  УК: "from-blue-400 to-blue-600 dark:from-blue-500 dark:to-blue-700",
  ПК: "from-emerald-400 to-emerald-600 dark:from-emerald-500 dark:to-emerald-700",
  ОПК: "from-purple-400 to-purple-600 dark:from-purple-500 dark:to-purple-700",
};

export const SkillCloud: React.FC<SkillCloudProps> = ({
  skills,
  onSkillClick,
  className = "",
}) => {
  return (
    <div className={`flex flex-wrap gap-2.5 ${className}`}>
      {skills.map((skill, index) => {
        return (
          <motion.button
            key={skill.id}
            initial={{ opacity: 0, scale: 0.7, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{
              delay: index * 0.04,
              type: "spring",
              stiffness: 320,
              damping: 30,
            }}
            whileHover={{
              scale: 1.15,
              y: -6,
              boxShadow: "0 20px 30px rgba(0, 0, 0, 0.2)",
            }}
            whileTap={{ scale: 0.92 }}
            onClick={() => onSkillClick?.(skill.id)}
            className={`
              relative px-4 py-2 rounded-xl font-semibold text-sm
              transition-all duration-300 cursor-pointer
              bg-linear-to-br ${GRADIENT_BY_TYPE[skill.type]}
              text-white shadow-md hover:shadow-xl
              border border-white/20 hover:border-white/40
              group overflow-hidden
            `}
          >
            {/* Фоновая подсветка */}
            <motion.div
              className="absolute inset-0 bg-white/15 opacity-0 group-hover:opacity-100"
              initial={false}
              transition={{ duration: 0.3 }}
            />

            {/* Текст */}
            <span className="relative z-10 flex items-center gap-1">
              {skill.name}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
};
