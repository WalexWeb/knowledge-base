import type { Badge } from "../types";

/** Достижения (косметика); привязка к навыкам задаётся в BADGE_SKILLS_MAP при необходимости */
export const BADGES: Badge[] = [
  {
    id: "badge-infosec-basic",
    name: "Основы ИБ",
    description: "Освоены базовые положения информационной безопасности",
    icon: "shield-check",
    unlocked: false,
  },
  {
    id: "badge-network-pro",
    name: "Сетевой администратор",
    description: "Уверенная работа со средствами вычислительной техники и сетями",
    icon: "router",
    unlocked: false,
  },
  {
    id: "badge-math-modeler",
    name: "Математическое моделирование",
    description: "Применение математического аппарата в профессиональных задачах",
    icon: "function-square",
    unlocked: false,
  },
  {
    id: "badge-programmer",
    name: "Программист",
    description: "Создание и сопровождение программных решений",
    icon: "brackets",
    unlocked: false,
  },
  {
    id: "badge-document-security",
    name: "Секретность",
    description: "Работа с документами ограниченного доступа и режимом секретности",
    icon: "lock-keyhole",
    unlocked: false,
  },
  {
    id: "badge-crypto-master",
    name: "Криптограф",
    description: "Криптографические методы и средства защиты информации",
    icon: "key-round",
    unlocked: false,
  },
  {
    id: "badge-incident-response",
    name: "Реагент инцидентов",
    description: "Действия при инцидентах информационной безопасности",
    icon: "alert-triangle",
    unlocked: false,
  },
  {
    id: "badge-forensic-expert",
    name: "Судебный эксперт",
    description: "Компьютерные экспертизы и исследования",
    icon: "microscope",
    unlocked: false,
  },
  {
    id: "badge-analytic",
    name: "Аналитик",
    description: "Информационно-аналитическая деятельность",
    icon: "line-chart",
    unlocked: false,
  },
  {
    id: "badge-leader",
    name: "Лидер",
    description: "Организация командной работы и управление проектами",
    icon: "crown",
    unlocked: false,
  },
];

/**
 * Какие skill id отмечают бейдж (из структуры JSON: …::know, …::able, …::own).
 * Пустой объект — автоматическая разблокировка по прогрессу отключена, пока не заданы связи.
 */
export const BADGE_SKILLS_MAP: Record<string, string[]> = {};

/** При пустом списке для бейджа фильтр по дисциплинам не применяется (см. badge-display) */
export const BADGE_DISCIPLINES_MAP: Record<string, string[]> = {};

export const INITIAL_USER_PROFILE = {
  id: "user-1",
  completedSkills: [] as string[],
  selectedDisciplines: [] as string[],
  badges: BADGES.map((b) => ({ ...b, unlocked: false })),
  completionDate: {} as Record<string, string>,
};
