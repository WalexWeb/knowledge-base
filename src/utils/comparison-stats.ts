import type {
  CompetencyType,
  Discipline,
  Skill,
  SkillLevel,
} from "@/src/types";

const PLACEHOLDER = new Set(["", "-", "_", "—"]);

/** Базовый id компетенции (без суффикса ::know / ::able / ::own) */
export function competencyBaseId(skillId: string): string {
  const idx = skillId.indexOf("::");
  return idx === -1 ? skillId : skillId.slice(0, idx);
}

export function isMeaningfulSkillName(name: string): boolean {
  return !PLACEHOLDER.has(name.trim());
}

export function dedupeSkills(skills: Skill[]): Skill[] {
  const map = new Map<string, Skill>();
  for (const s of skills) {
    if (!map.has(s.id)) map.set(s.id, s);
  }
  return Array.from(map.values());
}

export function collectAllSkills(disciplines: Discipline[]): Skill[] {
  return dedupeSkills(disciplines.flatMap((d) => d.skills));
}

export function countUniqueCompetencies(skills: Skill[]): number {
  return new Set(skills.map((s) => competencyBaseId(s.id))).size;
}

export function competencyTypeCounts(
  skills: Skill[],
): Record<CompetencyType, number> {
  const stats: Record<CompetencyType, number> = { УК: 0, ПК: 0, ОПК: 0 };
  for (const s of skills) {
    stats[s.type]++;
  }
  return stats;
}

export function levelCounts(skills: Skill[]): Record<SkillLevel, number> {
  const stats: Record<SkillLevel, number> = { знать: 0, уметь: 0, владеть: 0 };
  for (const s of skills) {
    stats[s.level]++;
  }
  return stats;
}

export function hasVariedLevels(skills: Skill[]): boolean {
  const c = levelCounts(skills);
  const nonZero = [c.знать, c.уметь, c.владеть].filter((n) => n > 0).length;
  return nonZero > 1;
}

/** Компетенции, присутствующие во всех выбранных дисциплинах */
export function skillsInAllDisciplines(disciplines: Discipline[]): Skill[] {
  if (disciplines.length < 2) return [];
  const sets = disciplines.map(
    (d) => new Set(d.skills.map((s) => competencyBaseId(s.id))),
  );
  const baseIds = [...sets[0]].filter((id) => sets.every((set) => set.has(id)));
  const allSkills = collectAllSkills(disciplines);
  const byBase = new Map<string, Skill>();
  for (const s of allSkills) {
    const base = competencyBaseId(s.id);
    if (baseIds.includes(base) && !byBase.has(base)) byBase.set(base, s);
  }
  return Array.from(byBase.values());
}

/** id компетенций, встречающихся минимум в minCount дисциплинах */
export function competencyIdsInMinDisciplines(
  disciplines: Discipline[],
  minCount: number,
): Set<string> {
  const freq = new Map<string, number>();
  for (const d of disciplines) {
    const seen = new Set<string>();
    for (const s of d.skills) {
      const base = competencyBaseId(s.id);
      if (seen.has(base)) continue;
      seen.add(base);
      freq.set(base, (freq.get(base) ?? 0) + 1);
    }
  }
  return new Set(
    [...freq.entries()].filter(([, n]) => n >= minCount).map(([id]) => id),
  );
}

export interface DisciplineBreakdown {
  discipline: Discipline;
  skillCount: number;
  uniqueCompetencyCount: number;
  onlyHereCompetencyCount: number;
  types: Record<CompetencyType, number>;
  levels: Record<SkillLevel, number>;
}

export function breakdownByDiscipline(
  disciplines: Discipline[],
): DisciplineBreakdown[] {
  return disciplines.map((discipline) => {
    const baseInDisc = new Set(
      discipline.skills.map((s) => competencyBaseId(s.id)),
    );
    let onlyHere = 0;
    for (const base of baseInDisc) {
      let count = 0;
      for (const d of disciplines) {
        if (d.skills.some((s) => competencyBaseId(s.id) === base)) count++;
      }
      if (count === 1) onlyHere++;
    }

    return {
      discipline,
      skillCount: discipline.skills.length,
      uniqueCompetencyCount: baseInDisc.size,
      onlyHereCompetencyCount: onlyHere,
      types: competencyTypeCounts(discipline.skills),
      levels: levelCounts(discipline.skills),
    };
  });
}

export interface PairwiseOverlap {
  a: string;
  b: string;
  aName: string;
  bName: string;
  sharedCompetencies: number;
  sharedTypes: CompetencyType[];
}

export function pairwiseOverlaps(disciplines: Discipline[]): PairwiseOverlap[] {
  const pairs: PairwiseOverlap[] = [];
  for (let i = 0; i < disciplines.length; i++) {
    for (let j = i + 1; j < disciplines.length; j++) {
      const d1 = disciplines[i];
      const d2 = disciplines[j];
      const s1 = new Set(d1.skills.map((s) => competencyBaseId(s.id)));
      const s2 = new Set(d2.skills.map((s) => competencyBaseId(s.id)));
      const shared = [...s1].filter((id) => s2.has(id));
      const sharedTypes = new Set<CompetencyType>();
      for (const s of d1.skills) {
        if (shared.includes(competencyBaseId(s.id))) sharedTypes.add(s.type);
      }
      pairs.push({
        a: d1.id,
        b: d2.id,
        aName: d1.name,
        bName: d2.name,
        sharedCompetencies: shared.length,
        sharedTypes: [...sharedTypes],
      });
    }
  }
  return pairs.sort((x, y) => y.sharedCompetencies - x.sharedCompetencies);
}

export interface StackedTypeRow {
  name: string;
  shortName: string;
  УК: number;
  ПК: number;
  ОПК: number;
}

export function stackedTypeByDiscipline(
  disciplines: Discipline[],
): StackedTypeRow[] {
  return disciplines.map((d) => {
    const t = competencyTypeCounts(d.skills);
    const short = d.name.length > 28 ? `${d.name.slice(0, 26)}…` : d.name;
    return {
      name: d.name,
      shortName: short,
      УК: t.УК,
      ПК: t.ПК,
      ОПК: t.ОПК,
    };
  });
}
