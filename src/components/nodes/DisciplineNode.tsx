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
        className="group w-115 rounded-3xl border border-slate-200 dark:border-slate-700 
                   bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-7 shadow-xl 
                   cursor-pointer transition-all duration-300 hover:border-amber-400 
                   dark:hover:border-amber-500 hover:shadow-2xl hover:-translate-y-1"
      >
        <div className="flex items-start gap-5">
          <div className="p-4 rounded-2xl bg-linear-to-br from-amber-100 to-amber-200 dark:from-amber-900/50 dark:to-amber-800/50 shrink-0">
            <BookOpen
              size={32}
              className="text-amber-600 dark:text-amber-400"
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="text-2xl font-semibold leading-tight text-slate-900 dark:text-white mb-3 wrap-break-word">
              {data.name}
            </div>
            <div className="text-[15.5px] leading-relaxed text-slate-600 dark:text-slate-400 line-clamp-5 group-hover:line-clamp-none wrap-break-word">
              {data.annotation ||
                data.description?.slice(0, 220) ||
                "Загрузка аннотации..."}
            </div>
          </div>
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} />

      {/* Модальное окно */}
      {open && (
        <div
          className="fixed inset-0 z-999 bg-black/70 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-3xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl 
                       rounded-3xl border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden"
          >
            <div className="px-8 pt-8 pb-6 border-b border-slate-200 dark:border-slate-700 flex items-start gap-5 relative">
              <div className="p-4 rounded-2xl bg-linear-to-br from-amber-500 to-amber-600 text-white">
                <BookOpen size={36} />
              </div>

              <div className="flex-1">
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white pr-12 wrap-break-word">
                  {data.name}
                </h2>
              </div>

              <button
                onClick={() => setOpen(false)}
                className="absolute top-6 right-6 p-3 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X
                  size={28}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                />
              </button>
            </div>

            <div className="p-8 max-h-[75vh] overflow-y-auto">
              <h3 className="uppercase tracking-widest text-xs font-semibold text-slate-500 dark:text-slate-400 mb-4">
                ОПИСАНИЕ ДИСЦИПЛИНЫ
              </h3>
              <p className="text-[17px] leading-relaxed text-slate-700 dark:text-slate-200 whitespace-pre-wrap">
                {data.description ||
                  "Подробное описание дисциплины будет загружено из базы данных."}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
});
