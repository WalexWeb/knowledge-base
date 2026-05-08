"use client";

import { memo, useState } from "react";
import { Handle, Position } from "@xyflow/react";
import { BookOpen, X } from "lucide-react";

export default memo(function DisciplineNode({ data }: any) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Handle type="target" position={Position.Top} />

      <div
        onClick={() => setOpen(true)}
        className="group w-80 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm p-4 shadow-md cursor-pointer transition-all hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-lg"
      >
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-indigo-100/50 dark:bg-indigo-900/30 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/50 transition">
            <BookOpen
              size={18}
              className="text-indigo-600 dark:text-indigo-400"
            />
          </div>
          <div className="flex-1">
            <div className="text-sm font-semibold text-slate-800 dark:text-white leading-relaxed">
              {data.name}
            </div>
            <div className="mt-3 text-xs text-slate-500 dark:text-slate-400 opacity-0 max-h-0 overflow-hidden transition-all duration-300 group-hover:opacity-100 group-hover:max-h-40">
              {data.annotation || "Аннотация дисциплины"}
            </div>
          </div>
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} />

      {/* Модальное окно */}
      {open && (
        <div
          className="fixed inset-0 z-999 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-10"
          onClick={() => setOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-[90vw] max-w-[95vw] sm:max-w-7xl max-h-[85vh] overflow-auto rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-2xl"
          >
            <button
              onClick={() => setOpen(false)}
              className="absolute right-4 top-4 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <X size={20} className="text-slate-500 dark:text-slate-400" />
            </button>

            <div className="p-8 sm:p-12">
              <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-6 pr-8">
                {data.name}
              </h2>
              <div className="text-slate-600 dark:text-slate-300 leading-7 whitespace-pre-wrap">
                {data.description || "Нет описания"}
              </div>

              {data.competencies?.length > 0 && (
                <div className="mt-10">
                  <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-4">
                    Компетенции
                  </h3>
                  <div className="space-y-4">
                    {data.competencies.map((c: any) => (
                      <div
                        key={c.id}
                        className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-5"
                      >
                        <div className="text-indigo-600 dark:text-indigo-400 font-semibold">
                          {c.code || "Компетенция"}
                        </div>
                        <div className="mt-2 text-slate-600 dark:text-slate-300">
                          {c.description}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
});
