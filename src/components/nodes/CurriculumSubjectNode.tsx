"use client";

import { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import { GraduationCap, Calendar, Code, Database, Cpu, Globe, Zap } from "lucide-react";
import {
  CATEGORY_META,
  type CurriculumSubject,
} from "@/src/data/curriculum-chain";

const CATEGORY_ACCENT: Record<
  CurriculumSubject["category"],
  { card: string; icon: string; text: string; iconComponent: any }
> = {
  K1: {
    card: "hover:border-cyan-400 dark:hover:border-cyan-500",
    icon: "from-cyan-100 to-cyan-200 dark:from-cyan-900/50 dark:to-cyan-800/50",
    text: "text-cyan-600 dark:text-cyan-400",
    iconComponent: GraduationCap,
  },
  K2: {
    card: "hover:border-violet-400 dark:hover:border-violet-500",
    icon: "from-violet-100 to-violet-200 dark:from-violet-900/50 dark:to-violet-800/50",
    text: "text-violet-600 dark:text-violet-400",
    iconComponent: Code,
  },
  K3: {
    card: "hover:border-emerald-400 dark:hover:border-emerald-500",
    icon: "from-emerald-100 to-emerald-200 dark:from-emerald-900/50 dark:to-emerald-800/50",
    text: "text-emerald-600 dark:text-emerald-400",
    iconComponent: Database,
  },
  K4: {
    card: "hover:border-amber-400 dark:hover:border-amber-500",
    icon: "from-amber-100 to-amber-200 dark:from-amber-900/50 dark:to-amber-800/50",
    text: "text-amber-600 dark:text-amber-400",
    iconComponent: Cpu,
  },
};

export default memo(function CurriculumSubjectNode({
  data,
}: {
  data: CurriculumSubject;
}) {
  const accent = CATEGORY_ACCENT[data.category];
  const IconComponent = accent.iconComponent;

  return (
    <>
      <Handle type="target" position={Position.Top} id="top" />
      <Handle type="target" position={Position.Left} id="left" />
      <Handle type="source" position={Position.Bottom} id="bottom" />
      <Handle type="source" position={Position.Right} id="right" />

      <div
        className={`w-100 rounded-3xl border-2 border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-8 shadow-2xl transition-all duration-300 hover:shadow-3xl hover:-translate-y-1 ${accent.card}`}
      >
        <div className="flex items-start gap-5">
          <div
            className={`p-4 rounded-2xl bg-linear-to-br ${accent.icon} shrink-0`}
          >
            <IconComponent size={40} className={accent.text} />
          </div>
          <div className="flex-1 min-w-0">
            <div
              className={`text-sm font-bold uppercase tracking-wider mb-3 ${accent.text}`}
            >
              {CATEGORY_META[data.category].label}
            </div>
            <div className="text-2xl font-bold leading-tight text-slate-900 dark:text-white wrap-break-word">
              {data.name}
            </div>
            <div className="flex items-center gap-3 mt-4 text-base font-semibold text-slate-500 dark:text-slate-400">
              <Calendar size={18} />
              {data.semester} семестр
            </div>
          </div>
        </div>
      </div>
    </>
  );
});
