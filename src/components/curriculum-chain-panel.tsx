"use client";

import { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ReactFlow,
  Background,
  MarkerType,
  ConnectionLineType,
  useEdgesState,
  useNodesState,
  type Node,
  type Edge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Layers, Calendar, ArrowDown, AlertTriangle, Info } from "lucide-react";
import {
  CURRICULUM_SUBJECTS,
  CATEGORY_META,
  CATEGORY_ORDER,
  getSequenceViolations,
  getViolatedPrerequisites,
  getSubjectById,
  getSemesters,
  type CurriculumCategory,
  type CurriculumSubject,
} from "@/src/data/curriculum-chain";
import CurriculumCategoryNode from "@/src/components/nodes/CurriculumCategoryNode";
import CurriculumSubjectNode from "@/src/components/nodes/CurriculumSubjectNode";

const nodeTypes = {
  curriculumCategory: CurriculumCategoryNode,
  curriculumSubject: CurriculumSubjectNode,
};

type ViewMode = "categories" | "semesters" | "trajectory";

const CATEGORY_STYLES: Record<
  CurriculumCategory,
  { border: string; bg: string; badge: string; glow: string }
> = {
  K1: {
    border: "border-cyan-500/40",
    bg: "bg-cyan-500/10",
    badge: "bg-cyan-500/20 text-cyan-700 dark:text-cyan-300",
    glow: "shadow-cyan-500/20",
  },
  K2: {
    border: "border-violet-500/40",
    bg: "bg-violet-500/10",
    badge: "bg-violet-500/20 text-violet-700 dark:text-violet-300",
    glow: "shadow-violet-500/20",
  },
  K3: {
    border: "border-emerald-500/40",
    bg: "bg-emerald-500/10",
    badge: "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300",
    glow: "shadow-emerald-500/20",
  },
  K4: {
    border: "border-amber-500/40",
    bg: "bg-amber-500/10",
    badge: "bg-amber-500/20 text-amber-700 dark:text-amber-300",
    glow: "shadow-amber-500/20",
  },
};

function SubjectCard({
  subject,
  showViolations,
  showPrerequisites,
  compact = false,
}: {
  subject: CurriculumSubject;
  showViolations: boolean;
  showPrerequisites: boolean;
  compact?: boolean;
}) {
  const style = CATEGORY_STYLES[subject.category];
  const violatedPrereqs = showViolations
    ? getViolatedPrerequisites(subject)
    : [];
  const isViolation = violatedPrereqs.length > 0;

  const allPrereqs = subject.prerequisiteIds
    .map((id) => getSubjectById(id))
    .filter(Boolean) as CurriculumSubject[];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-xl border-2 transition-all ${
        isViolation
          ? "border-red-500/70 bg-red-500/10 shadow-lg shadow-red-500/20"
          : `${style.border} ${style.bg} shadow-md ${style.glow}`
      } ${compact ? "p-3" : "p-4"}`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <span
          className={`text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-md ${
            isViolation
              ? "bg-red-500/25 text-red-600 dark:text-red-300"
              : style.badge
          }`}
        >
          {CATEGORY_META[subject.category].label}
        </span>
        <span className="flex items-center gap-1.5 text-sm font-semibold text-slate-500 dark:text-slate-400 shrink-0">
          <Calendar size={14} />
          {subject.semester} сем.
        </span>
      </div>

      <h4
        className={`font-semibold leading-snug ${
          compact ? "text-base" : "text-lg"
        } ${isViolation ? "text-red-700 dark:text-red-200" : "text-slate-900 dark:text-white"}`}
      >
        {subject.name}
      </h4>

      {isViolation && (
        <div className="mt-3 space-y-2">
          {violatedPrereqs.map((p) => (
            <div
              key={p.id}
              className="flex items-start gap-2 text-sm font-medium text-red-600 dark:text-red-300 bg-red-500/10 p-2.5 rounded-lg"
            >
              <AlertTriangle size={16} className="shrink-0 mt-0.5" />
              <span>
                Сначала требуется изучить <br />
                <strong className="font-bold text-red-700 dark:text-red-200">
                  {p.name} <br />({p.semester} сем.)
                </strong>
              </span>
            </div>
          ))}
        </div>
      )}

      {showPrerequisites && allPrereqs.length > 0 && !isViolation && (
        <div className="mt-3 pt-3 border-t border-slate-200/60 dark:border-slate-600/40">
          <p className="text-[10px] uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-1.5">
            Логически продолжает
          </p>
          <div className="flex flex-wrap gap-1.5">
            {allPrereqs.map((p) => (
              <span
                key={p.id}
                className="text-xs px-2 py-0.5 rounded-md bg-slate-200/80 dark:bg-slate-700/80 text-slate-600 dark:text-slate-300"
              >
                {p.shortName}
              </span>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}

function CategoriesView({ subjects }: { subjects: CurriculumSubject[] }) {
  const grouped = useMemo(() => {
    const map: Record<CurriculumCategory, CurriculumSubject[]> = {
      K1: [],
      K2: [],
      K3: [],
      K4: [],
    };
    for (const s of subjects) map[s.category].push(s);
    return map;
  }, [subjects]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
      {CATEGORY_ORDER.map((cat) => (
        <div key={cat} className="space-y-3">
          <div className="sticky top-20 z-10 pb-2">
            <div
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg ${CATEGORY_STYLES[cat].badge}`}
            >
              <Layers size={14} />
              <span className="font-bold">{CATEGORY_META[cat].label}</span>
            </div>
          </div>
          <div className="space-y-3">
            {grouped[cat].map((subject) => (
              <SubjectCard
                key={subject.id}
                subject={subject}
                showViolations={false}
                showPrerequisites={false}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function SemestersView({ subjects }: { subjects: CurriculumSubject[] }) {
  const semesters = getSemesters(subjects);
  const violations = useMemo(() => getSequenceViolations(subjects), [subjects]);

  const bySemester = useMemo(() => {
    const map = new Map<number, CurriculumSubject[]>();
    for (const sem of semesters) map.set(sem, []);
    for (const s of subjects) {
      map.get(s.semester)?.push(s);
    }
    return map;
  }, [subjects, semesters]);

  return (
    <div className="space-y-6">
      {violations.size > 0 && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/30">
          <AlertTriangle size={20} className="text-red-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-red-700 dark:text-red-300 text-base">
              Обнаружено {violations.size}{" "}
              {violations.size === 1
                ? "нарушение"
                : violations.size < 5
                  ? "нарушения"
                  : "нарушений"}{" "}
              последовательности
            </p>
            <p className="text-sm text-red-600/80 dark:text-red-400/80 mt-1">
              На карточке указано, какой предмет нужно изучить раньше
            </p>
          </div>
        </div>
      )}

      {semesters.map((sem) => (
        <div key={sem}>
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-500/15 text-indigo-600 dark:text-indigo-300 font-bold">
              {sem}
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-lg">
                {sem} семестр
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {bySemester.get(sem)?.length ?? 0} дисциплин
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {bySemester.get(sem)?.map((subject) => (
              <SubjectCard
                key={subject.id}
                subject={subject}
                showViolations
                showPrerequisites={false}
                compact
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function barycenter(
  subject: CurriculumSubject,
  previousIndex: Map<string, number>,
) {
  const ranks = subject.prerequisiteIds
    .map((id) => previousIndex.get(id))
    .filter((rank): rank is number => rank !== undefined);

  if (ranks.length === 0) return Number.POSITIVE_INFINITY;
  return ranks.reduce((sum, rank) => sum + rank, 0) / ranks.length;
}

/** Порядок в колонке совпадает с порядком предшественников — рёбра между категориями не пересекаются. */
function subjectsByCategoryForTrajectory(subjects: CurriculumSubject[]) {
  const grouped = new Map<CurriculumCategory, CurriculumSubject[]>();
  for (const cat of CATEGORY_ORDER) grouped.set(cat, []);
  for (const subject of subjects) grouped.get(subject.category)?.push(subject);

  const ordered = new Map<CurriculumCategory, CurriculumSubject[]>();
  let previousIndex = new Map<string, number>();

  for (const cat of CATEGORY_ORDER) {
    const catSubjects = [...(grouped.get(cat) ?? [])].sort((a, b) => {
      const byPrereq = barycenter(a, previousIndex) - barycenter(b, previousIndex);
      if (byPrereq !== 0) return byPrereq;
      return a.semester - b.semester || a.name.localeCompare(b.name, "ru");
    });

    ordered.set(cat, catSubjects);
    previousIndex = new Map(catSubjects.map((subject, index) => [subject.id, index]));
  }

  return ordered;
}

function TrajectoryView({ subjects }: { subjects: CurriculumSubject[] }) {
  const graph = useMemo(() => {
    const START_X = 80;
    const SUBJECT_START_Y = 280;
    const CATEGORY_SPACING_X = 700;
    const SUBJECT_SPACING_Y = 350;

    const nodes: Node[] = [];
    const edges: Edge[] = [];
    const orderedByCategory = subjectsByCategoryForTrajectory(subjects);

    CATEGORY_ORDER.forEach((cat, catIndex) => {
      const categoryX = START_X + catIndex * CATEGORY_SPACING_X;
      const catSubjects = orderedByCategory.get(cat) ?? [];

      let previousSubjectId: string | null = null;

      catSubjects.forEach((subject, idx) => {
        nodes.push({
          id: subject.id,
          type: "curriculumSubject",
          draggable: false,
          position: {
            x: categoryX,
            y: SUBJECT_START_Y + idx * SUBJECT_SPACING_Y,
          },
          data: { ...subject },
        });

        if (previousSubjectId) {
          edges.push({
            id: `edge-chain-${previousSubjectId}-${subject.id}`,
            source: previousSubjectId,
            sourceHandle: "bottom",
            target: subject.id,
            targetHandle: "top",
            type: "smoothstep",
            markerEnd: { type: MarkerType.ArrowClosed },
            style: { stroke: "#475569", strokeWidth: 1.5, opacity: 0.6 },
          });
        }
        previousSubjectId = subject.id;
      });
    });

    const sourceLane = new Map<string, number>();
    const prereqPairs: { source: string; target: string }[] = [];
    for (const subject of subjects) {
      for (const prereqId of subject.prerequisiteIds) {
        prereqPairs.push({ source: prereqId, target: subject.id });
      }
    }

    const nodeRank = new Map(nodes.map((node, index) => [node.id, index]));
    prereqPairs.sort(
      (a, b) =>
        (nodeRank.get(a.source) ?? 0) - (nodeRank.get(b.source) ?? 0) ||
        (nodeRank.get(a.target) ?? 0) - (nodeRank.get(b.target) ?? 0),
    );

    for (const { source, target } of prereqPairs) {
      const lane = sourceLane.get(source) ?? 0;
      sourceLane.set(source, lane + 1);

      edges.push({
        id: `edge-prereq-${source}-${target}`,
        source,
        sourceHandle: "right",
        target,
        targetHandle: "left",
        type: "smoothstep",
        markerEnd: { type: MarkerType.ArrowClosed },
        style: { stroke: "#6366f1", strokeWidth: 2.5 },
      });
    }

    return { nodes, edges };
  }, [subjects]);

  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  useEffect(() => {
    setNodes(graph.nodes);
    setEdges(graph.edges);
  }, [graph, setNodes, setEdges]);

  return (
    <div className="bg-linear-to-br from-slate-50/90 to-indigo-50/90 dark:from-slate-900/90 dark:to-indigo-950/90 backdrop-blur-md rounded-3xl border-2 border-indigo-200/60 dark:border-indigo-700/40 overflow-hidden shadow-2xl shadow-indigo-500/10">
      <div className="w-full h-[calc(100vh-380px)] min-h-140">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          fitView
          fitViewOptions={{ padding: 0.25 }}
          connectionLineType={ConnectionLineType.SmoothStep}
          nodesConnectable={false}
          edgesReconnectable={false}
          nodesDraggable={false}
          elementsSelectable={false}
          panOnScroll
          zoomOnScroll={false}
          zoomOnPinch
          minZoom={0.3}
          maxZoom={1.8}
          proOptions={{ hideAttribution: true }}
        >
          <Background color="#6366f1" gap={32} size={1.5} />
        </ReactFlow>
      </div>
    </div>
  );
}

export function CurriculumChainPanel() {
  const [viewMode, setViewMode] = useState<ViewMode>("categories");

  const viewTabs: { id: ViewMode; label: string; icon: typeof Layers }[] = [
    { id: "categories", label: "По категориям", icon: Layers },
    { id: "semesters", label: "По семестрам", icon: Calendar },
    { id: "trajectory", label: "Траектория", icon: ArrowDown },
  ];

  return (
    <div className="space-y-6">
      <div className="p-5 rounded-2xl bg-white/80 dark:bg-slate-800/60 backdrop-blur border border-slate-200 dark:border-slate-700/60 space-y-4">
        <div className="flex flex-wrap gap-2">
          {viewTabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setViewMode(id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all border ${
                viewMode === id
                  ? "bg-indigo-500/15 border-indigo-500/50 text-indigo-700 dark:text-indigo-300 shadow-sm"
                  : "bg-slate-100/80 dark:bg-slate-900/40 border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:border-indigo-400/40"
              }`}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </div>

        <div className="flex items-start gap-2 text-sm text-slate-500 dark:text-slate-400">
          <Info size={16} className="shrink-0 mt-0.5" />
          <span>
            {viewMode === "categories" &&
              "Дисциплины сгруппированы по категориям К1–К4."}
            {viewMode === "semesters" &&
              "Расположение по семестрам с проверкой: предмет подсвечивается, если изучается раньше своего предшественника."}
            {viewMode === "trajectory" &&
              "Схема связей между предметами из каждой категории по порядку изучения."}
          </span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={viewMode}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          {viewMode === "categories" && (
            <CategoriesView subjects={CURRICULUM_SUBJECTS} />
          )}
          {viewMode === "semesters" && (
            <SemestersView subjects={CURRICULUM_SUBJECTS} />
          )}
          {viewMode === "trajectory" && (
            <TrajectoryView subjects={CURRICULUM_SUBJECTS} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
