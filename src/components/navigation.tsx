"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Map, Zap, TrendingUp } from "lucide-react";

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  description?: string;
}

const NAV_ITEMS: NavItem[] = [
  {
    href: "/",
    label: "Карта",
    icon: <Map size={20} />,
    description: "Интерактивная карта дисциплин",
  },
  {
    href: "/tracker",
    label: "Трекер",
    icon: <TrendingUp size={20} />,
    description: "Отслеживание прогресса",
  },
  {
    href: "/simulator",
    label: "Симулятор",
    icon: <Zap size={20} />,
    description: "Планирование обучения",
  },
];

export const Navigation: React.FC = () => {
  const pathname = usePathname();

  return (
    <nav className="sticky bottom-0 md:bottom-auto md:top-0 z-50 bg-white/90 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-700/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between md:justify-start gap-1 md:gap-1">
          {NAV_ITEMS.map((item, index) => {
            const isActive = pathname === item.href;

            return (
              <motion.div
                key={item.href}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href={item.href}
                  className={`relative nav-item ${isActive ? "nav-item-active" : ""} transition-all duration-200 text-sm`}
                  title={item.description}
                >
                  <motion.span
                    className={`${isActive ? "text-white" : "text-slate-600 dark:text-slate-500"}`}
                  >
                    {item.icon}
                  </motion.span>
                  <span className="hidden sm:inline font-semibold">
                    {item.label}
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute -bottom-1 left-0 right-0 h-1 gradient-primary rounded-t-full"
                      transition={{
                        type: "spring",
                        stiffness: 350,
                        damping: 30,
                      }}
                    />
                  )}
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
