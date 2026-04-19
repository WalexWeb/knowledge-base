import type { CompetencyType, Discipline, Skill, SkillLevel } from "../types";
import structure from "./Baza_znanii_structure.json";

/** Коды типа компетенции в источнике: 0 — ОПК, 1 — УК, 2 — ПК */
export function competenceTypeFromCode(code: number): CompetencyType {
  switch (code) {
    case 0:
      return "ОПК";
    case 1:
      return "УК";
    case 2:
      return "ПК";
    default:
      return "ОПК";
  }
}

interface BazaCompetence {
  id: string;
  competenceType: number;
  description: string;
  knowledge: string;
  /** В JSON — формулировки уровня «уметь» (индикаторы умения) */
  skills: string;
  ownership: string;
}

interface BazaDiscipline {
  id: string;
  name: string;
  competences: BazaCompetence[];
}

interface BazaSemester {
  id: string;
  number: number;
  disciplines: BazaDiscipline[];
}

interface BazaSpecialization {
  id: string;
  name: string;
  semesters: BazaSemester[];
}

interface BazaDirection {
  id: string;
  name: string;
  specializations: BazaSpecialization[];
}

interface BazaRoot {
  id: string;
  directions: BazaDirection[];
}

function nonEmpty(text: string, fallback: string): string {
  const t = text?.trim();
  return t && t.length > 0 ? t : fallback;
}

function competenceToSkills(c: BazaCompetence): Skill[] {
  const type = competenceTypeFromCode(c.competenceType);
  const base = c.id;
  return [
    {
      id: `${base}::know`,
      name: nonEmpty(c.knowledge, c.description),
      type,
      level: "знать" as SkillLevel,
    },
    {
      id: `${base}::able`,
      name: nonEmpty(c.skills, c.description),
      type,
      level: "уметь" as SkillLevel,
    },
    {
      id: `${base}::own`,
      name: nonEmpty(c.ownership, c.description),
      type,
      level: "владеть" as SkillLevel,
    },
  ];
}

function buildDisciplines(root: BazaRoot): Discipline[] {
  const out: Discipline[] = [];

  for (const direction of root.directions) {
    for (const spec of direction.specializations) {
      for (const semester of spec.semesters) {
        for (const d of semester.disciplines) {
          const skills: Skill[] = [];
          for (const comp of d.competences) {
            skills.push(...competenceToSkills(comp));
          }
          out.push({
            id: d.id,
            name: d.name,
            semester: semester.number,
            description: `${direction.name} · ${spec.name}`,
            skills,
          });
        }
      }
    }
  }

  return out;
}

export const BAZA_ROOT = structure as BazaRoot;

/** Дисциплины и навыки */
export const DISCIPLINES: Discipline[] = buildDisciplines(BAZA_ROOT);

/** Общее число элементов трекинга (знать / уметь / владеть по каждой компетенции) */
export function getTotalSkillIds(): string[] {
  const ids: string[] = [];
  for (const d of DISCIPLINES) {
    for (const s of d.skills) {
      ids.push(s.id);
    }
  }
  return ids;
}
