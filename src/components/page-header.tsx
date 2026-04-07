"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Map, Zap, Trophy, Network, Shield } from "lucide-react";

interface PageHeaderProps {
  currentPage?: "map" | "simulator" | "tracker" | "correlations";
}

export const PageHeader: React.FC<PageHeaderProps> = ({ currentPage = "map" }) => {
  const navItems = [
    { href: "/", icon: Map, label: "Карта дисциплин", color: "cyan" },
    { href: "/simulator", icon: Zap, label: "Симулятор", color: "cyan" },
    { href: "/tracker", icon: Trophy, label: "Трекер", color: "emerald" },
    { href: "/correlations", icon: Network, label: "Корреляции", color: "indigo" },
  ];

  return (
    <nav className="sticky top-0 z-40 bg-(--glass-default) backdrop-filter backdrop-blur-xl border-b border-(--color-border)">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Логотип */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 flex-shrink-0"
          >
            <div className="brand-logo">
              <Shield size={24} />
            </div>
          </motion.div>

          {/* Навигационные ссылки */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {navItems.map(({ href, icon: Icon, label, color }, index) => {
              const isActive = 
                (currentPage === "map" && href === "/") ||
                (currentPage === "simulator" && href === "/simulator") ||
                (currentPage === "tracker" && href === "/tracker") ||
                (currentPage === "correlations" && href === "/correlations");

              const bgColorClass = {
                cyan: isActive ? "bg-cyan-500/20" : "bg-cyan-500/10 hover:bg-cyan-500/20",
                emerald: isActive ? "bg-emerald-500/20" : "bg-emerald-500/10 hover:bg-emerald-500/20",
                indigo: isActive ? "bg-indigo-500/20" : "bg-indigo-500/10 hover:bg-indigo-500/20",
              }[color];

              const textColorClass = {
                cyan: isActive ? "text-cyan-600 dark:text-cyan-400" : "text-cyan-600 dark:text-cyan-400",
                emerald: isActive ? "text-emerald-600 dark:text-emerald-400" : "text-emerald-600 dark:text-emerald-400",
                indigo: isActive ? "text-indigo-600 dark:text-indigo-400" : "text-indigo-600 dark:text-indigo-400",
              }[color];

              const borderColorClass = {
                cyan: isActive ? "border-cyan-500/60" : "border-cyan-500/30 hover:border-cyan-500/60",
                emerald: isActive ? "border-emerald-500/60" : "border-emerald-500/30 hover:border-emerald-500/60",
                indigo: isActive ? "border-indigo-500/60" : "border-indigo-500/30 hover:border-indigo-500/60",
              }[color];

              return (
                <motion.div
                  key={href}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                >
                  <Link href={href}>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${bgColorClass} ${textColorClass} border ${borderColorClass}`}
                    >
                      <Icon size={16} />
                      <span>{label}</span>
                    </motion.button>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};
