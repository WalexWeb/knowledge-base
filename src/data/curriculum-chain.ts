export type CurriculumCategory = "K1" | "K2" | "K3" | "K4";

export interface CurriculumSubject {
  id: string;
  name: string;
  shortName: string;
  category: CurriculumCategory;
  /** Семестр в учебном плане (намеренно не строго по категориям — для демонстрации нарушений) */
  semester: number;
  /** ID предметов-предшественников из предыдущей категории */
  prerequisiteIds: string[];
}

export const CATEGORY_META: Record<CurriculumCategory, { label: string }> = {
  K1: {
    label: "К1",
  },
  K2: {
    label: "К2",
  },
  K3: {
    label: "К3",
  },
  K4: {
    label: "К4",
  },
};

export const CURRICULUM_SUBJECTS: CurriculumSubject[] = [
  // К1
  {
    id: "k1-math",
    name: "Высшая математика",
    shortName: "Высш. мат.",
    category: "K1",
    semester: 1,
    prerequisiteIds: [],
  },
  {
    id: "k1-physics",
    name: "Физика",
    shortName: "Физика",
    category: "K1",
    semester: 1,
    prerequisiteIds: [],
  },
  {
    id: "k1-oib",
    name: "Основы информационной безопасности",
    shortName: "Основы ИБ",
    category: "K1",
    semester: 2,
    prerequisiteIds: [],
  },
  // К2
  {
    id: "k2-svt",
    name: "Средства вычислительной техники",
    shortName: "СВТ",
    category: "K2",
    semester: 3,
    prerequisiteIds: ["k1-oib"],
  },
  {
    id: "k2-matan",
    name: "Математический анализ",
    shortName: "Мат. анализ",
    category: "K2",
    semester: 2,
    prerequisiteIds: ["k1-math"],
  },
  {
    id: "k2-electro",
    name: "Электротехника",
    shortName: "Электротех.",
    category: "K2",
    semester: 4,
    prerequisiteIds: ["k1-physics"],
  },
  // К3
  {
    id: "k3-sspi",
    name: "Системы и сети передачи информации",
    shortName: "ССПИ",
    category: "K3",
    semester: 5,
    prerequisiteIds: ["k2-svt"],
  },
  {
    id: "k3-os",
    name: "Операционные системы",
    shortName: "ОС",
    category: "K3",
    semester: 2,
    prerequisiteIds: ["k2-svt"],
  },
  {
    id: "k3-comms",
    name: "Системы связи",
    shortName: "Системы связи",
    category: "K3",
    semester: 6,
    prerequisiteIds: ["k2-electro"],
  },
  {
    id: "k3-signals",
    name: "Математические основы обработки сигналов",
    shortName: "МООС",
    category: "K3",
    semester: 5,
    prerequisiteIds: ["k2-electro"],
  },
  // К4
  {
    id: "k4-multimedia",
    name: "Мультимедийные технологии",
    shortName: "Мультимедиа",
    category: "K4",
    semester: 7,
    prerequisiteIds: ["k3-sspi"],
  },
  {
    id: "k4-prog",
    name: "Языки программирования",
    shortName: "Языки прог.",
    category: "K4",
    semester: 4,
    prerequisiteIds: ["k3-sspi"],
  },
  {
    id: "k4-db",
    name: "Базы данных",
    shortName: "БД",
    category: "K4",
    semester: 6,
    prerequisiteIds: ["k3-sspi"],
  },
];

export const CATEGORY_ORDER: CurriculumCategory[] = ["K1", "K2", "K3", "K4"];

export function getSubjectById(id: string): CurriculumSubject | undefined {
  return CURRICULUM_SUBJECTS.find((s) => s.id === id);
}

/** Предмет нарушает порядок, если изучается не позже всех своих предшественников */
export function getSequenceViolations(
  subjects: CurriculumSubject[] = CURRICULUM_SUBJECTS,
): Set<string> {
  const byId = new Map(subjects.map((s) => [s.id, s]));
  const violations = new Set<string>();

  for (const subject of subjects) {
    for (const prereqId of subject.prerequisiteIds) {
      const prereq = byId.get(prereqId);
      if (prereq && subject.semester <= prereq.semester) {
        violations.add(subject.id);
      }
    }
  }

  return violations;
}

/** Предшественники, нарушающие порядок по семестрам */
export function getViolatedPrerequisites(
  subject: CurriculumSubject,
  subjects: CurriculumSubject[] = CURRICULUM_SUBJECTS,
): CurriculumSubject[] {
  const byId = new Map(subjects.map((s) => [s.id, s]));
  return subject.prerequisiteIds
    .map((id) => byId.get(id))
    .filter(
      (p): p is CurriculumSubject => !!p && subject.semester <= p.semester,
    );
}

export function getPrerequisiteChains(
  subjectId: string,
  subjects: CurriculumSubject[] = CURRICULUM_SUBJECTS,
): CurriculumSubject[] {
  const byId = new Map(subjects.map((s) => [s.id, s]));
  const chain: CurriculumSubject[] = [];
  const visited = new Set<string>();

  function walk(id: string) {
    if (visited.has(id)) return;
    visited.add(id);
    const subject = byId.get(id);
    if (!subject) return;
    for (const prereqId of subject.prerequisiteIds) {
      walk(prereqId);
      const prereq = byId.get(prereqId);
      if (prereq) chain.push(prereq);
    }
  }

  walk(subjectId);
  return chain;
}

export function getSemesters(
  subjects: CurriculumSubject[] = CURRICULUM_SUBJECTS,
): number[] {
  return [...new Set(subjects.map((s) => s.semester))].sort((a, b) => a - b);
}
