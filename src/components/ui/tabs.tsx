import React, { createContext, useContext, ReactNode } from "react";
import { motion } from "framer-motion";

interface TabsContextType {
  value: string;
  onValueChange: (value: string) => void;
}

const TabsContext = createContext<TabsContextType | undefined>(undefined);

interface TabsProps {
  value: string;
  onValueChange: (value: string) => void;
  children: ReactNode;
}

export const Tabs: React.FC<TabsProps & { className?: string }> = ({
  value,
  onValueChange,
  children,
  className = "",
}) => {
  return (
    <TabsContext.Provider value={{ value, onValueChange }}>
      <div className={`w-full ${className}`}>{children}</div>
    </TabsContext.Provider>
  );
};

interface TabsListProps {
  children: ReactNode;
  className?: string;
  variant?: "pill" | "line" | "underline";
}

export const TabsList: React.FC<TabsListProps> = ({
  children,
  className = "",
  variant = "pill",
}) => {
  const baseClasses = "inline-flex items-center gap-1";
  const variantClasses: Record<string, string> = {
    pill: "pill-tabs",
    line: "border-b border-[var(--color-border)] gap-1",
    underline: "gap-2",
  };

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      role="tablist"
    >
      {children}
    </div>
  );
};

interface TabsTriggerProps {
  value: string;
  children: ReactNode;
  className?: string;
  disabled?: boolean;
}

export const TabsTrigger: React.FC<TabsTriggerProps> = ({
  value,
  children,
  className = "",
  disabled = false,
}) => {
  const context = useContext(TabsContext);
  if (!context) throw new Error("TabsTrigger must be used within Tabs");

  const { value: activeValue, onValueChange } = context;
  const isActive = activeValue === value;

  const handleClick = () => !disabled && onValueChange(value);
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.key === "Enter" || e.key === " ") && !disabled) {
      e.preventDefault();
      onValueChange(value);
    }
  };

  return (
    <motion.button
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      disabled={disabled}
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      className={`
        relative px-4 py-2 rounded-lg font-medium text-sm
        transition-all duration-200
        ${isActive ? "text-white bg-linear-to-r from-(--color-primary) to-(--color-primary-600) shadow-md" : "text-(--color-foreground-secondary) hover:text-(--color-foreground) hover:bg-(--color-surface-secondary)"}
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        ${className}
      `}
      role="tab"
      aria-selected={isActive}
      aria-disabled={disabled}
    >
      {children}
    </motion.button>
  );
};

interface TabsContentProps {
  value: string;
  children: ReactNode;
  className?: string;
}

export const TabsContent: React.FC<TabsContentProps> = ({
  value,
  children,
  className = "",
}) => {
  const context = useContext(TabsContext);
  if (!context) throw new Error("TabsContent must be used within Tabs");

  const { value: activeValue } = context;

  if (activeValue !== value) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
