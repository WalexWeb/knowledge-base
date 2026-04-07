"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Lock,
  Shield,
  Globe,
  Calculator,
  Code,
  FileText,
  Lock as LockIcon,
  AlertCircle,
  Search,
  BarChart3,
  Users,
  Star,
} from "lucide-react";
import { Badge } from "../types";

interface BadgeDisplayProps {
  badges: Badge[];
  onBadgeClick?: (badgeId: string) => void;
}

const getIconForBadge = (icon: string) => {
  const iconMap: Record<string, React.ReactNode> = {
    shield: <Shield size={40} />,
    network: <Globe size={40} />,
    math: <Calculator size={40} />,
    code: <Code size={40} />,
    document: <FileText size={40} />,
    lock: <LockIcon size={40} />,
    alert: <AlertCircle size={40} />,
    search: <Search size={40} />,
    chart: <BarChart3 size={40} />,
    users: <Users size={40} />,
  };
  return iconMap[icon] || <Shield size={40} />;
};

export const BadgeDisplay: React.FC<BadgeDisplayProps> = ({
  badges,
  onBadgeClick,
}) => {
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

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
    >
      {badges.map((badge) => (
        <motion.button
          key={badge.id}
          variants={itemVariants}
          whileHover={badge.unlocked ? { scale: 1.08, y: -8 } : {}}
          whileTap={badge.unlocked ? { scale: 0.95 } : {}}
          onClick={() => badge.unlocked && onBadgeClick?.(badge.id)}
          className={`
            relative p-5 rounded-xl flex flex-col items-center justify-center
            transition-all duration-300 group border backdrop-blur-md
            ${
              badge.unlocked
                ? "bg-linear-to-br from-(--color-accent)/10 to-(--color-primary)/10 border-(--color-accent) hover:shadow-lg shadow-md cursor-pointer"
                : "bg-(--color-surface-secondary) border-(--color-border) opacity-60"
            }
          `}
          disabled={!badge.unlocked}
        >
          {/* Иконка замка для заблокированных */}
          {!badge.unlocked && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute top-3 right-3 w-5 h-5 bg-(--color-border) rounded-full flex items-center justify-center"
            >
              <Lock size={12} className="text-(--color-foreground-tertiary)" />
            </motion.div>
          )}

          {/* Иконка бейджа */}
          <motion.div
            animate={{
              scale: badge.unlocked ? [1, 1.1, 1] : 1,
            }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              repeatDelay: 2,
            }}
            className="mb-3 filter drop-shadow-lg text-(--color-accent)"
          >
            {getIconForBadge(badge.icon)}
          </motion.div>

          {/* Название */}
          <h4 className="font-bold text-sm text-center text-(--color-foreground) mb-1 leading-tight">
            {badge.name}
          </h4>

          {/* Описание */}
          <p className="text-xs text-(--color-foreground-secondary) text-center line-clamp-2">
            {badge.description}
          </p>

          {/* Дата разблокировки */}
          {badge.unlocked && badge.unlockedAt && (
            <motion.div
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              className="mt-2 text-xs font-medium text-(--color-accent) opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center gap-1"
            >
              <Star size={14} /> {new Date(badge.unlockedAt).toLocaleDateString("ru-RU")}
            </motion.div>
          )}

          {/* Глоу эффект для разблокированных */}
          {badge.unlocked && (
            <motion.div className="absolute inset-0 rounded-2xl bg-linear-to-r from-amber-400 to-orange-400 opacity-0 group-hover:opacity-20 blur transition-opacity duration-300 -z-10"></motion.div>
          )}
        </motion.button>
      ))}
    </motion.div>
  );
};
