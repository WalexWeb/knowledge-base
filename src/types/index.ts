// Типы компетенций
export type CompetencyType = "УК" | "ПК" | "ОПК";

// Уровни овладения навыком
export type SkillLevel = "знать" | "уметь" | "владеть";

// Интерфейс навыка
export interface Skill {
  id: string;
  name: string;
  type: CompetencyType;
  level: SkillLevel;
  icon?: string;
}

// Интерфейс дисциплины
export interface Discipline {
  id: string;
  name: string;
  semester: number;
  description?: string;
  skills: Skill[];
  prerequisites?: string[]; // ID других дисциплин
  hours?: number;
}

// Интерфейс компетенции
export interface Competency {
  id: string;
  code: string; // ПК-1, УК-2 и т.д.
  name: string;
  type: CompetencyType;
  description?: string;
}

// Интерфейс для связи дисциплины и компетенции
export interface DisciplineCompetency {
  disciplineId: string;
  competencyId: string;
  coverage: number; // 0-100 процент покрытия
}

// Интерфейс пользовательского профиля
export interface UserProfile {
  id: string;
  completedSkills: string[]; // ID навыков
  selectedDisciplines: string[]; // ID дисциплин
  badges: Badge[];
  completionDate?: Record<string, string>; // skillId -> ISO date
}

// Интерфейс бейджа
export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
}

// Интерфейс для элемента графа (дисциплина в React Flow)
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

// Интерфейс рекомендации
export interface Recommendation {
  disciplineId: string;
  reason: string;
  priority: "high" | "medium" | "low";
  missingSkills: Skill[];
}
