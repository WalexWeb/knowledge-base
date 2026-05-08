"use client";

import { useEffect, useMemo, useState } from "react";
import type { Discipline, Skill, SkillLevel, CompetencyType } from "@/src/types";

export interface TreeCompetency {
  id: string;
  code: string;
  competenceType: number;
  description: string;
  knowledge: string;
  skills: string;
  ownership: string;
}

export interface TreeDiscipline {
  id: string;
  name: string;
  annotation: string;
  description: string;
  competencies: TreeCompetency[];
}

export interface TreeSemester {
  id: string;
  number: number;
  disciplines: TreeDiscipline[];
}

export interface TreeSpecialization {
  id: string;
  name: string;
  semesters: TreeSemester[];
}

export interface TreeDirection {
  id: string;
  name: string;
  specializations: TreeSpecialization[];
}

interface TreeResponse {
  directions: TreeDirection[];
}

function competenceTypeFromCode(code: number): CompetencyType {
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

function nonEmpty(text: string, fallback: string): string {
  const t = text?.trim();
  return t && t.length > 0 ? t : fallback;
}

function competencyToSkills(c: TreeCompetency): Skill[] {
  const type = competenceTypeFromCode(c.competenceType);
  const base = c.id;
  return [
    { id: `${base}::know`, name: nonEmpty(c.knowledge, c.description), type, level: "знать" as SkillLevel },
    { id: `${base}::able`, name: nonEmpty(c.skills, c.description), type, level: "уметь" as SkillLevel },
    { id: `${base}::own`, name: nonEmpty(c.ownership, c.description), type, level: "владеть" as SkillLevel },
  ];
}

export function flattenDisciplines(directions: TreeDirection[]): Discipline[] {
  const out: Discipline[] = [];
  for (const direction of directions) {
    for (const spec of direction.specializations ?? []) {
      for (const semester of spec.semesters ?? []) {
        for (const d of semester.disciplines ?? []) {
          const skills: Skill[] = [];
          for (const c of d.competencies ?? []) {
            skills.push(...competencyToSkills(c));
          }
          out.push({
            id: d.id,
            name: d.name,
            semester: semester.number,
            description: d.description || `${direction.name} · ${spec.name}`,
            skills,
          });
        }
      }
    }
  }
  return out;
}

export function useKnowledgeTree() {
  const [directions, setDirections] = useState<TreeDirection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "/api/v1";
    fetch(`${apiBase}/tree`)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json() as Promise<TreeResponse>;
      })
      .then((data) => {
        if (!mounted) return;
        setDirections(data.directions ?? []);
      })
      .catch((e: unknown) => {
        if (!mounted) return;
        setError(e instanceof Error ? e.message : "Ошибка загрузки");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const disciplines = useMemo(() => flattenDisciplines(directions), [directions]);
  return { directions, disciplines, loading, error };
}
