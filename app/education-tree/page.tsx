"use client";

import { useMemo, useRef, useState } from "react";
import { GraduationCap, Layers, BookOpen } from "lucide-react";
import DATA from "@/src/data/Baza_znanii_structure.json";

export default function EducationTreePage() {
  const specializations = useMemo(() => {
    return DATA.directions.flatMap((dir: any) =>
      dir.specializations.map((spec: any) => ({
        id: spec.id,
        name: spec.name,
        semesters: spec.semesters,
      })),
    );
  }, []);

  const [selectedSpecId, setSelectedSpecId] = useState(specializations[0]?.id);

  const selectedSpec = specializations.find((s) => s.id === selectedSpecId);

  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const isDragging = useRef(false);
  const last = useRef({ x: 0, y: 0 });

  const onMouseDown = (e: any) => {
    isDragging.current = true;
    last.current = { x: e.clientX, y: e.clientY };
  };

  const onMouseMove = (e: any) => {
    if (!isDragging.current) return;

    const dx = e.clientX - last.current.x;
    const dy = e.clientY - last.current.y;

    setPosition((p) => ({ x: p.x + dx, y: p.y + dy }));
    last.current = { x: e.clientX, y: e.clientY };
  };

  const onMouseUp = () => (isDragging.current = false);

  const onWheel = (e: any) => {
    e.preventDefault();
    setScale((s) => Math.min(1.6, Math.max(0.5, s - e.deltaY * 0.001)));
  };

  if (!selectedSpec) return null;

  const semesters = [...selectedSpec.semesters].sort(
    (a: any, b: any) => a.number - b.number,
  );

  // 🔥 ключевая часть — расчёт позиций
  const layout = useMemo(() => {
    return semesters.map((sem: any, i: number) => {
      let offsetY = 0;

      const items = sem.disciplines.map((d: any) => {
        // примерная оценка высоты (чем длиннее текст — тем выше)
        const lines = Math.ceil(d.name.length / 28);
        const height = 60 + lines * 16;

        const y = 420 + offsetY;
        offsetY += height + 20;

        return { ...d, y, height };
      });

      return {
        ...sem,
        x: 260 + i * 260,
        items,
      };
    });
  }, [semesters]);

  return (
    <div
      className="w-full h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden"
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onWheel={onWheel}
    >
      {/* HEADER */}
      <div className="absolute top-0 left-0 w-full z-20 bg-slate-900/70 backdrop-blur-xl border-b border-slate-700/40 p-3 flex justify-center gap-2 flex-wrap">
        {specializations.map((s) => (
          <button
            key={s.id}
            onClick={() => setSelectedSpecId(s.id)}
            className={`px-4 py-1.5 rounded-full text-sm transition ${
              selectedSpecId === s.id
                ? "bg-linear-to-r from-blue-500 to-indigo-600 shadow-md"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            {s.name}
          </button>
        ))}
      </div>

      {/* CANVAS */}
      <div
        className="w-full h-full cursor-grab active:cursor-grabbing"
        onMouseDown={onMouseDown}
      >
        <div
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            transformOrigin: "0 0",
          }}
          className="relative w-650 h-450"
        >
          {/* ROOT */}
          <div className="absolute left-300 top-15 px-8 py-4 rounded-2xl flex items-center gap-3 shadow-2xl bg-linear-to-r from-blue-500/80 to-indigo-600/80 backdrop-blur-xl">
            <GraduationCap size={22} />
            <span className="text-lg font-bold">{selectedSpec.name}</span>
          </div>

          {/* SVG */}
          <svg className="absolute w-full h-full pointer-events-none">
            {layout.map((sem) => (
              <path
                key={sem.id}
                d={`M1300 140 C1300 260, ${sem.x} 260, ${sem.x} 340`}
                stroke="#334155"
                fill="none"
                strokeWidth="2"
              />
            ))}

            {layout.map((sem) =>
              sem.items.map((item: any, idx: number) => (
                <path
                  key={item.id}
                  d={`M${sem.x} 360 C${sem.x} 380, ${sem.x} ${
                    item.y - 10
                  }, ${sem.x} ${item.y}`}
                  stroke="#1e293b"
                  fill="none"
                />
              )),
            )}
          </svg>

          {/* SEMESTERS */}
          {layout.map((sem) => (
            <div key={sem.id}>
              {/* карточка семестра */}
              <div
                className="absolute px-4 py-2 rounded-xl flex items-center gap-2 bg-slate-800/80 backdrop-blur border border-slate-700 shadow-md"
                style={{
                  left: sem.x - 90,
                  top: 340,
                }}
              >
                <Layers size={16} className="text-cyan-400" />
                <span className="text-sm font-medium">
                  {sem.number} семестр
                </span>
              </div>

              {/* дисциплины */}
              {sem.items.map((d: any) => (
                <div
                  key={d.id}
                  className="absolute w-72 px-4 py-3 rounded-xl bg-slate-900/80 backdrop-blur border border-slate-700/60 shadow-lg hover:shadow-xl transition group"
                  style={{
                    left: sem.x - 144,
                    top: d.y,
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div className="p-1.5 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20 transition">
                      <BookOpen size={16} className="text-blue-400" />
                    </div>

                    <p className="text-sm text-slate-200 leading-relaxed wrap-break-word">
                      {d.name}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* HUD */}
      <div className="absolute bottom-4 left-4 text-xs text-slate-400 bg-black/40 px-3 py-1 rounded-full backdrop-blur">
        🖱 drag • 🔍 zoom
      </div>
    </div>
  );
}
