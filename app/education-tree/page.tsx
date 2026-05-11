"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Background,
  MarkerType,
  ReactFlow,
  useEdgesState,
  useNodesState,
  ConnectionLineType,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { TreePine, GraduationCap } from "lucide-react";
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
  const specializations = useMemo(
    () => directions.flatMap((d) => d.specializations),
    [directions],
  );

  const [selectedSpecId, setSelectedSpecId] = useState<string>();

  useEffect(() => {
    if (!selectedSpecId && specializations.length > 0) {
      setSelectedSpecId(specializations[0].id);
    }
  }, [specializations, selectedSpecId]);

  const selectedSpec = useMemo(
    () => specializations.find((s) => s.id === selectedSpecId),
    [specializations, selectedSpecId],
  );

  const graph = useMemo(() => {
    if (!selectedSpec) return { nodes: [], edges: [] };

    const nodes: any[] = [];
    const edges: any[] = [];

    const START_X = 380;
    const SEMESTER_Y = 180;
    const DISCIPLINE_START_Y = 420;
    const SEMESTER_SPACING_X = 620;
    const DISCIPLINE_SPACING_Y = 300;

    // Специализация
    nodes.push({
      id: selectedSpec.id,
      type: "specialization",
      draggable: false,
      position: { x: 80, y: SEMESTER_Y },
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
            style: { stroke: "#64748b", strokeWidth: 3 },
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
            style: { stroke: "#64748b", strokeWidth: 3 },
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
              style: { stroke: "#64748b", strokeWidth: 2.5 },
            });
          }

          if (previousDiscNodeId) {
            edges.push({
              id: `edge-chain-disc-${previousDiscNodeId}-${discNodeId}`,
              source: previousDiscNodeId,
              target: discNodeId,
              type: "smoothstep",
              markerEnd: { type: MarkerType.ArrowClosed },
              style: { stroke: "#475569", strokeWidth: 2 },
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-300">
        Загрузка древа...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-white via-slate-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-slate-900 dark:text-white">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-150 h-150 bg-amber-400/10 dark:bg-amber-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-150 h-150 bg-indigo-400/10 dark:bg-indigo-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        <PageHeader currentPage="education-tree" />

        <main className="max-w-[96vw] mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <h1 className="text-5xl font-bold mb-3 flex items-center gap-3">
              <TreePine size={48} className="text-amber-500" />
              <span className="bg-linear-to-r from-amber-500 to-amber-700 bg-clip-text text-transparent">
                Древо обучения
              </span>
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              Визуализация учебного плана специализации
            </p>
          </motion.div>

          {/* Выбор специализации */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-6 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-4">
              <GraduationCap size={20} className="text-indigo-500" />
              <span className="font-medium text-slate-700 dark:text-slate-300">
                Специализация:
              </span>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
              {specializations.map((spec) => (
                <motion.button
                  key={spec.id}
                  onClick={() => setSelectedSpecId(spec.id)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className={`px-6 py-3 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                    selectedSpecId === spec.id
                      ? "bg-linear-to-r from-indigo-500 to-purple-500 text-white shadow-lg"
                      : "bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700"
                  }`}
                >
                  {spec.name}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Древо */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-md rounded-3xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-2xl"
          >
            <div className="w-full h-[calc(100vh-340px)] min-h-180">
              <ReactFlow
                nodes={nodes}
                edges={edges}
                nodeTypes={nodeTypes}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                fitView
                connectionLineType={ConnectionLineType.SmoothStep}
                nodesConnectable={false}
                edgesReconnectable={false}
                minZoom={0.3}
                maxZoom={1.8}
                proOptions={{ hideAttribution: true }}
              >
                <Background color="#475569" gap={24} size={1.5} />
              </ReactFlow>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
