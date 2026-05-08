"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Background,
  Controls,
  MarkerType,
  ReactFlow,
  useEdgesState,
  useNodesState,
  ConnectionLineType,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { TreePine, BookOpen, GraduationCap, Layers } from "lucide-react";

import { useKnowledgeTree } from "@/src/lib/knowledge-api";
import DisciplineNode from "@/src/components/nodes/DisciplineNode";
import SemesterNode from "@/src/components/nodes/SemesterNode";
import SpecializationNode from "@/src/components/nodes/SpecializationNode";
import { PageHeader } from "@/src/components/page-header";

const nodeTypes = {
  discipline: DisciplineNode,
  semester: SemesterNode,
  specialization: SpecializationNode,
};

export default function EducationTreePage() {
  const { directions, loading } = useKnowledgeTree();

  const specializations = useMemo(() => {
    return directions.flatMap((d) => d.specializations);
  }, [directions]);

  const [selectedSpecId, setSelectedSpecId] = useState<string>();

  useEffect(() => {
    if (!selectedSpecId && specializations.length > 0) {
      setSelectedSpecId(specializations[0].id);
    }
  }, [specializations, selectedSpecId]);

  const selectedSpec = useMemo(() => {
    return specializations.find((s) => s.id === selectedSpecId);
  }, [specializations, selectedSpecId]);

  const graph = useMemo(() => {
    if (!selectedSpec) return { nodes: [], edges: [] };

    const nodes: any[] = [];
    const edges: any[] = [];

    const START_X = 320;
    const SEMESTER_Y = 200;
    const DISCIPLINE_START_Y = 400;
    const SEMESTER_SPACING_X = 480;
    const DISCIPLINE_SPACING_Y = 220;

    nodes.push({
      id: selectedSpec.id,
      type: "specialization",
      draggable: false,
      position: { x: 50, y: SEMESTER_Y },
      data: { label: selectedSpec.name },
    });

    let previousSemesterNodeId: string | null = null;

    selectedSpec.semesters
      .sort((a, b) => a.number - b.number)
      .forEach((semester, semIndex) => {
        const semesterX = START_X + semIndex * SEMESTER_SPACING_X;
        const semesterNodeId = `${selectedSpec.id}-semester-${semester.id}`;

        nodes.push({
          id: semesterNodeId,
          type: "semester",
          draggable: false,
          position: { x: semesterX, y: SEMESTER_Y },
          data: semester,
        });

        if (semIndex === 0) {
          edges.push({
            id: `edge-spec-${selectedSpec.id}-${semesterNodeId}`,
            source: selectedSpec.id,
            target: semesterNodeId,
            targetHandle: "left",
            type: "smoothstep",
            markerEnd: { type: MarkerType.ArrowClosed },
            style: { stroke: "#475569", strokeWidth: 2 },
          });
        } else if (previousSemesterNodeId) {
          edges.push({
            id: `edge-sem-${previousSemesterNodeId}-${semesterNodeId}`,
            source: previousSemesterNodeId,
            sourceHandle: "right",
            target: semesterNodeId,
            targetHandle: "left",
            type: "smoothstep",
            markerEnd: { type: MarkerType.ArrowClosed },
            style: { stroke: "#475569", strokeWidth: 2 },
          });
        }
        previousSemesterNodeId = semesterNodeId;

        const filteredDisciplines = semester.disciplines
          .map((d) => ({
            ...d,
            competencies: d.competencies.filter((c) => c.competenceType !== 2),
          }))
          .filter((d) => d.competencies.length > 0);

        let previousDiscNodeId: string | null = null;

        filteredDisciplines.forEach((discipline, discIndex) => {
          const discNodeId = `${semesterNodeId}-discipline-${discipline.id}`;

          nodes.push({
            id: discNodeId,
            type: "discipline",
            draggable: true,
            position: {
              x: semesterX,
              y: DISCIPLINE_START_Y + discIndex * DISCIPLINE_SPACING_Y,
            },
            data: discipline,
          });

          if (discIndex === 0) {
            edges.push({
              id: `edge-sem-disc-${semesterNodeId}-${discNodeId}`,
              source: semesterNodeId,
              sourceHandle: "bottom",
              target: discNodeId,
              type: "smoothstep",
              markerEnd: { type: MarkerType.ArrowClosed },
              style: { stroke: "#64748b", strokeWidth: 2 },
            });
          }

          if (previousDiscNodeId) {
            edges.push({
              id: `edge-chain-disc-${previousDiscNodeId}-${discNodeId}`,
              source: previousDiscNodeId,
              target: discNodeId,
              type: "smoothstep",
              markerEnd: { type: MarkerType.ArrowClosed },
              style: { stroke: "#334155", strokeWidth: 2 },
            });
          }
          previousDiscNodeId = discNodeId;
        });
      });

    return { nodes, edges };
  }, [selectedSpec]);

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    setNodes(graph.nodes as any);
    setEdges(graph.edges as any);
  }, [graph]);

  const stats = useMemo(() => {
    if (!selectedSpec) return { semesters: 0, disciplines: 0, competencies: 0 };
    const semesters = selectedSpec.semesters.length;
    const disciplines = selectedSpec.semesters.flatMap(
      (s) => s.disciplines,
    ).length;
    const competencies = selectedSpec.semesters
      .flatMap((s) => s.disciplines)
      .flatMap((d) => d.competencies).length;
    return { semesters, disciplines, competencies };
  }, [selectedSpec]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-300">
        Загрузка древа...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-white via-slate-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-slate-900 dark:text-white">
      {/* Фоновые декоративные элементы */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400/10 dark:bg-amber-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-400/10 dark:bg-amber-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10">
        <PageHeader currentPage="education-tree" />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Заголовок страницы */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <h1 className="text-5xl font-bold mb-3 flex items-center gap-3">
              <TreePine size={40} className="text-amber-500" />
              <span className="bg-linear-to-r from-amber-500 to-amber-700 bg-clip-text text-transparent">
                Древо обучения
              </span>
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl">
              Визуализируйте учебный план: от специализации через семестры к
              дисциплинам и компетенциям
            </p>
          </motion.div>

          {/* Переключатель специализаций */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6 p-4 bg-slate-100/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-200 dark:border-slate-700/50"
          >
            <div className="flex items-center gap-3 mb-3">
              <GraduationCap size={18} className="text-indigo-500" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Выберите специализацию:
              </span>
            </div>
            <div className="flex gap-2 overflow-x-auto no-scrollbar">
              {specializations.map((spec) => (
                <motion.button
                  key={spec.id}
                  onClick={() => setSelectedSpecId(spec.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                    selectedSpecId === spec.id
                      ? "bg-linear-to-r from-indigo-500 to-purple-500 text-white shadow-md"
                      : "bg-white/60 dark:bg-slate-700/60 hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600"
                  }`}
                >
                  {spec.name}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Информация: как читать древо */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-4 p-5 mb-6 bg-white/60 dark:bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-200 dark:border-slate-700/50"
          >
            <h3 className="font-bold mb-3 text-slate-800 dark:text-white flex items-center gap-2">
              <Layers size={18} className="text-cyan-500" />
              Как читать древо:
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-slate-600 dark:text-slate-400">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 mt-2 rounded-full bg-indigo-500"></span>
                <span>
                  <strong>Специализация</strong> → начало образовательной
                  траектории
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 mt-2 rounded-full bg-cyan-500"></span>
                <span>
                  <strong>Семестры</strong> расположены горизонтально слева
                  направо
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 mt-2 rounded-full bg-indigo-400"></span>
                <span>
                  <strong>Дисциплины</strong> под своим семестром, можно
                  перетаскивать
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 mt-2 rounded-full bg-slate-400"></span>
                <span>
                  Нажмите на дисциплину, чтобы увидеть описание и компетенции
                </span>
              </li>
            </ul>
          </motion.div>

          {/* График древа */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-sm rounded-2xl border border-slate-200 dark:border-slate-700/50 overflow-hidden"
          >
            <div className="w-full h-[calc(100vh-420px)] min-h-125">
              <ReactFlow
                nodes={nodes}
                edges={edges}
                nodeTypes={nodeTypes}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                fitView
                connectionLineType={ConnectionLineType.SmoothStep}
                defaultEdgeOptions={{ type: "smoothstep" }}
                fitViewOptions={{ padding: 0.25 }}
                nodesConnectable={false}
                edgesReconnectable={false}
              >
                <Background />
                <Controls />
              </ReactFlow>
            </div>
          </motion.div>
        </main>

        {/* Футер со статистикой и ссылками */}
        <footer className="relative z-10 border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 backdrop-blur-sm mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-white mb-3">
                  Статистика специализации
                </h4>
                <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                  <li>
                    Семестров: <strong>{stats.semesters}</strong>
                  </li>
                  <li>
                    Дисциплин: <strong>{stats.disciplines}</strong>
                  </li>
                  <li>
                    Компетенций: <strong>{stats.competencies}</strong>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-white mb-3">
                  Навигация
                </h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a
                      href="/"
                      className="text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                    >
                      Главная
                    </a>
                  </li>
                  <li>
                    <a
                      href="/simulator"
                      className="text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                    >
                      Симулятор обучения
                    </a>
                  </li>
                  <li>
                    <a
                      href="/tracker"
                      className="text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                    >
                      Трекер навыков
                    </a>
                  </li>
                  <li>
                    <a
                      href="/correlations"
                      className="text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                    >
                      Корреляция дисциплин
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-white mb-3">
                  Подсказки
                </h4>
                <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                  <li className="flex items-center gap-2">
                    <BookOpen size={14} />
                    Кликните на дисциплину для деталей
                  </li>
                  <li className="flex items-center gap-2">
                    <Layers size={14} />
                    Используйте колесо мыши для масштабирования
                  </li>
                  <li className="flex items-center gap-2">
                    <TreePine size={14} />
                    Перетаскивайте узлы для удобства просмотра
                  </li>
                </ul>
              </div>
            </div>
            <div className="border-t border-slate-200 dark:border-slate-800 pt-5 text-center">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Проект разработан курсантами факультета подготовки специалистов
                в области информационной безопасности Московского университета
                МВД России имени В.Я. Кикотя
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
