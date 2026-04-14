"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Skill } from "../types";

interface SkillCloudProps {
  skills: Skill[];
  onSkillClick?: (skillId: string) => void;
  className?: string;
  maxHeight?: string; // Опционально, можно переопределить
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
  maxHeight: customMaxHeight,
}) => {
  const [dynamicHeight, setDynamicHeight] = useState("400px");

  useEffect(() => {
    const calculateHeight = () => {
      // Если передана кастомная высота, используем её
      if (customMaxHeight) {
        setDynamicHeight(customMaxHeight);
        return;
      }

      // Расчет высоты в зависимости от размера экрана
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;

      let calculatedHeight;

      // Адаптивные значения для разных размеров экрана
      if (viewportWidth < 640) {
        // Мобильные устройства
        calculatedHeight = Math.min(viewportHeight * 0.4, 300);
      } else if (viewportWidth < 1024) {
        // Планшеты
        calculatedHeight = Math.min(viewportHeight * 0.45, 400);
      } else if (viewportWidth < 1440) {
        // Ноутбуки
        calculatedHeight = Math.min(viewportHeight * 0.5, 500);
      } else {
        // Большие экраны
        calculatedHeight = Math.min(viewportHeight * 0.55, 600);
      }

      // Убеждаемся, что высота не меньше минимального значения
      calculatedHeight = Math.max(calculatedHeight, 250);

      setDynamicHeight(`${Math.round(calculatedHeight)}px`);
    };

    // Вычисляем при монтировании
    calculateHeight();

    // Добавляем обработчик изменения размера окна
    window.addEventListener("resize", calculateHeight);

    // Очищаем обработчик при размонтировании
    return () => window.removeEventListener("resize", calculateHeight);
  }, [customMaxHeight]);

  return (
    <div
      className={`overflow-y-auto pr-2 ${className}`}
      style={{ maxHeight: dynamicHeight }}
    >
      {/* Кастомный скроллбар для лучшего внешнего вида */}
      <style jsx>{`
        div::-webkit-scrollbar {
          width: 8px;
        }
        div::-webkit-scrollbar-track {
          background: var(--color-surface-secondary);
          border-radius: 4px;
        }
        div::-webkit-scrollbar-thumb {
          background: var(--color-primary);
          border-radius: 4px;
        }
        div::-webkit-scrollbar-thumb:hover {
          background: var(--color-primary-600);
        }
      `}</style>

      <div className="flex flex-wrap gap-2.5">
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
                shrink-0
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
    </div>
  );
};
