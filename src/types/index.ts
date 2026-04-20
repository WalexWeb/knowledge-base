// Типы компетенций
export type CompetencyType = "УК" | "ПК" | "ОПК";

// Уровни овладения навыком
export type SkillLevel = "знать" | "уметь" | "владеть";

// Интерфейс навыка (компетенции, разбитой на три уровня)
export interface Skill {
  id: string;
  name: string; // описание компетенции
  type: CompetencyType;
  level: SkillLevel;
  description?: string;
  knowledge?: string;
  skills?: string;
  ownership?: string;
}

// Интерфейс дисциплины
export interface Discipline {
  id: string;
  name: string;
  semester: number;
  description?: string;
  skills: Skill[];
  prerequisites?: string[]; // ID других дисциплин (пока не используется)
  hours?: number; // пока нет в JSON, оставляем опциональным
}

// Остальные интерфейсы (Competency, DisciplineCompetency, UserProfile, Badge, DisciplineNode, Recommendation)
// оставляем без изменений, так как они не используются в новой логике
export interface Competency {
  id: string;
  code: string;
  name: string;
  type: CompetencyType;
  description?: string;
}

export interface DisciplineCompetency {
  disciplineId: string;
  competencyId: string;
  coverage: number;
}

export interface UserProfile {
  id: string;
  completedSkills: string[];
  selectedDisciplines: string[];
  badges: Badge[];
  completionDate?: Record<string, string>;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface DisciplineNode {
  id: string;
  data: {
    label: string;
    semester: number;
    skillCount: number;
    isSelected?: boolean;
  };
  position: { x: number; y: number };
}

export interface Recommendation {
  disciplineId: string;
  reason: string;
  priority: "high" | "medium" | "low";
  missingSkills: Skill[];
}
