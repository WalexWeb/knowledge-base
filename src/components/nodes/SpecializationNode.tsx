"use client";

import { Handle, Position } from "@xyflow/react";
import { GraduationCap } from "lucide-react";

export default function SpecializationNode({ data }: any) {
  return (
    <>
      <div className="px-8 py-5 rounded-3xl bg-linear-to-r from-indigo-600 to-purple-600 shadow-xl border border-indigo-400/30">
        <div className="flex items-center gap-4">
          <GraduationCap size={24} className="text-white" />
          <div className="text-lg font-bold text-white">{data.label}</div>
        </div>
      </div>
      <Handle type="source" position={Position.Right} />
    </>
  );
}
