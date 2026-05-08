"use client";

import { Handle, Position } from "@xyflow/react";
import { Layers } from "lucide-react";

export default function SemesterNode({ data }: any) {
  return (
    <>
      {/* Вход слева (от специализации или предыдущего семестра) */}
      <Handle type="target" position={Position.Left} id="left" />
      
      {/* Выход справа (к следующему семестру) */}
      <Handle type="source" position={Position.Right} id="right" />
      
      {/* Выход снизу (к первой дисциплине) */}
      <Handle type="source" position={Position.Bottom} id="bottom" />

      <div className="px-6 py-4 rounded-2xl border border-cyan-500/30 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm shadow-md hover:shadow-lg transition whitespace-nowrap">
        <div className="flex items-center gap-3">
          <Layers size={18} className="text-cyan-600 dark:text-cyan-400" />
          <div className="text-slate-800 dark:text-white font-semibold">
            {data.number} семестр
          </div>
        </div>
      </div>
    </>
  );
}