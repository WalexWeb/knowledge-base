"use client";

import { Handle, Position } from "@xyflow/react";
import { GraduationCap } from "lucide-react";

export default function SpecializationNode({ data }: any) {
  return (
    <>
      <div className="px-10 py-6 rounded-3xl bg-linear-to-r from-indigo-600 to-purple-600 shadow-xl border border-indigo-400/30">
        <div className="flex items-center gap-4">
          <GraduationCap size={32} className="text-white" />
          <div className="text-2xl font-bold text-white">{data.label}</div>
        </div>
      </div>
      <Handle type="source" position={Position.Right} />
    </>
  );
}
