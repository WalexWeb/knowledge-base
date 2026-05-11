"use client";

import { Handle, Position } from "@xyflow/react";
import { Layers } from "lucide-react";

export default function SemesterNode({ data }: any) {
  return (
    <>
      <Handle type="target" position={Position.Left} id="left" />
      <Handle type="source" position={Position.Right} id="right" />
      <Handle type="source" position={Position.Bottom} id="bottom" />

      <div className="px-10 py-6 rounded-3xl border border-cyan-500/40 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md shadow-lg hover:shadow-xl transition-all">
        <div className="flex items-center gap-4">
          <Layers size={26} className="text-cyan-600 dark:text-cyan-400" />
          <div className="text-2xl font-bold text-slate-800 dark:text-white">
            {data.number} семестр
          </div>
        </div>
      </div>
    </>
  );
}
