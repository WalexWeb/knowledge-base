"use client";

import { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import { Layers } from "lucide-react";
import {
  CATEGORY_META,
  type CurriculumCategory,
} from "@/src/data/curriculum-chain";

const CATEGORY_ICON: Record<
  CurriculumCategory,
  { from: string; to: string; icon: string }
> = {
  K1: {
    from: "from-cyan-100 to-cyan-200 dark:from-cyan-900/50 dark:to-cyan-800/50",
    to: "text-cyan-600 dark:text-cyan-400",
    icon: "border-cyan-500/40",
  },
  K2: {
    from: "from-violet-100 to-violet-200 dark:from-violet-900/50 dark:to-violet-800/50",
    to: "text-violet-600 dark:text-violet-400",
    icon: "border-violet-500/40",
  },
  K3: {
    from: "from-emerald-100 to-emerald-200 dark:from-emerald-900/50 dark:to-emerald-800/50",
    to: "text-emerald-600 dark:text-emerald-400",
    icon: "border-emerald-500/40",
  },
  K4: {
    from: "from-amber-100 to-amber-200 dark:from-amber-900/50 dark:to-amber-800/50",
    to: "text-amber-600 dark:text-amber-400",
    icon: "border-amber-500/40",
  },
};

export default memo(function CurriculumCategoryNode({
  data,
}: {
  data: { category: CurriculumCategory };
}) {
  const meta = CATEGORY_META[data.category];
  const style = CATEGORY_ICON[data.category];

  return (
    <>
      <Handle type="target" position={Position.Left} id="left" />
      <Handle type="source" position={Position.Right} id="right" />
      <Handle type="source" position={Position.Bottom} id="bottom" />

      <div
        className={`px-10 py-5 rounded-3xl border ${style.icon} bg-white/70 dark:bg-slate-900/70 backdrop-blur-md shadow-lg`}
      >
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-xl bg-linear-to-br ${style.from}`}>
            <Layers size={24} className={style.to} />
          </div>
          <div>
            <div className={`text-sm font-bold uppercase tracking-wider ${style.to}`}>
              {meta.label}
            </div>
            <div className="text-xl font-bold text-slate-800 dark:text-white">
              {meta.title}
            </div>
          </div>
        </div>
      </div>
    </>
  );
});
