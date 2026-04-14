"use client";

import { create } from "zustand";
import { UserProfile, Discipline } from "../types";
import { INITIAL_USER_PROFILE, BADGE_SKILLS_MAP } from "../data/mock-data";

interface KnowledgeBaseStore {
  // Состояние пользователя
  userProfile: UserProfile;

  // Выбранные дисциплины для сравнения
  selectedDisciplines: string[];

  // Активная дисциплина для просмотра
  activeDisciplineId: string | null;

  // Действия
  selectDiscipline: (disciplineId: string, isMultiple: boolean) => void;
  clearSelectedDisciplines: () => void;
  toggleSkillCompletion: (skillId: string) => void;
  toggleDisciplineCompletion: (skillIds: string[]) => void;
  unlockBadge: (badgeId: string) => void;
  setActiveDiscipline: (disciplineId: string | null) => void;

  // Вычисляемые значения
  getSelectedDisciplinesData: (disciplines: Discipline[]) => Discipline[];
  getTotalSkills: () => string[];
  getCompletionPercentage: () => number;
}

export const useKnowledgeBaseStore = create<KnowledgeBaseStore>((set, get) => ({
  userProfile: INITIAL_USER_PROFILE,
  selectedDisciplines: [],
  activeDisciplineId: null,

  selectDiscipline: (disciplineId: string, isMultiple: boolean) =>
    set((state) => {
      if (isMultiple) {
        const isSelected = state.selectedDisciplines.includes(disciplineId);
        return {
          selectedDisciplines: isSelected
            ? state.selectedDisciplines.filter((id) => id !== disciplineId)
            : [...state.selectedDisciplines, disciplineId],
        };
      } else {
        return {
          selectedDisciplines: [disciplineId],
          activeDisciplineId: disciplineId,
        };
      }
    }),

  clearSelectedDisciplines: () =>
    set({
      selectedDisciplines: [],
      activeDisciplineId: null,
    }),

  toggleSkillCompletion: (skillId: string) =>
    set((state) => {
      const isCompleted = state.userProfile.completedSkills.includes(skillId);
      const completionDate = { ...state.userProfile.completionDate };

      if (isCompleted) {
        delete completionDate[skillId];
      } else {
        completionDate[skillId] = new Date().toISOString();
      }

      // Получаем список завершённых навыков (либо с добавленным, либо с удалённым)
      const updatedCompletedSkills = isCompleted
        ? state.userProfile.completedSkills.filter((id) => id !== skillId)
        : [...state.userProfile.completedSkills, skillId];

      // Проверяем, какие достижения нужно разблокировать
      let updatedBadges = [...state.userProfile.badges];
      
      Object.entries(BADGE_SKILLS_MAP).forEach(([badgeId, requiredSkills]) => {
        const badge = updatedBadges.find((b) => b.id === badgeId);
        if (badge && !badge.unlocked) {
          // Проверяем, освоены ли все требуемые навыки
          const allSkillsCompleted = requiredSkills.every((skill) =>
            updatedCompletedSkills.includes(skill)
          );
          
          if (allSkillsCompleted) {
            // Разблокируем бейдж
            const idx = updatedBadges.findIndex((b) => b.id === badgeId);
            updatedBadges[idx] = {
              ...badge,
              unlocked: true,
              unlockedAt: new Date().toISOString(),
            };
          }
        }
      });

      return {
        userProfile: {
          ...state.userProfile,
          completedSkills: updatedCompletedSkills,
          completionDate,
          badges: updatedBadges,
        },
      };
    }),

  toggleDisciplineCompletion: (skillIds: string[]) =>
    set((state) => {
      const completionDate = { ...state.userProfile.completionDate };
      
      // Проверяем, все ли навыки дисциплины уже завершены
      const allCompleted = skillIds.every((skillId) =>
        state.userProfile.completedSkills.includes(skillId)
      );

      let updatedCompletedSkills = [...state.userProfile.completedSkills];

      if (allCompleted) {
        // Если все завершены - удаляем все
        updatedCompletedSkills = updatedCompletedSkills.filter(
          (id) => !skillIds.includes(id)
        );
        skillIds.forEach((skillId) => {
          delete completionDate[skillId];
        });
      } else {
        // Если не все завершены - добавляем все
        skillIds.forEach((skillId) => {
          if (!updatedCompletedSkills.includes(skillId)) {
            updatedCompletedSkills.push(skillId);
            completionDate[skillId] = new Date().toISOString();
          }
        });
      }

      // Проверяем, какие достижения нужно разблокировать
      let updatedBadges = [...state.userProfile.badges];
      
      Object.entries(BADGE_SKILLS_MAP).forEach(([badgeId, requiredSkills]) => {
        const badge = updatedBadges.find((b) => b.id === badgeId);
        if (badge && !badge.unlocked) {
          // Проверяем, освоены ли все требуемые навыки
          const allSkillsCompleted = requiredSkills.every((skill) =>
            updatedCompletedSkills.includes(skill)
          );
          
          if (allSkillsCompleted) {
            // Разблокируем бейдж
            const idx = updatedBadges.findIndex((b) => b.id === badgeId);
            updatedBadges[idx] = {
              ...badge,
              unlocked: true,
              unlockedAt: new Date().toISOString(),
            };
          }
        }
      });

      return {
        userProfile: {
          ...state.userProfile,
          completedSkills: updatedCompletedSkills,
          completionDate,
          badges: updatedBadges,
        },
      };
    }),

  unlockBadge: (badgeId: string) =>
    set((state) => ({
      userProfile: {
        ...state.userProfile,
        badges: state.userProfile.badges.map((b) =>
          b.id === badgeId
            ? { ...b, unlocked: true, unlockedAt: new Date().toISOString() }
            : b,
        ),
      },
    })),

  setActiveDiscipline: (disciplineId: string | null) =>
    set({ activeDisciplineId: disciplineId }),

  getSelectedDisciplinesData: (disciplines: Discipline[]) => {
    const { selectedDisciplines } = get();
    return disciplines.filter((d) => selectedDisciplines.includes(d.id));
  },

  getTotalSkills: () => {
    const { selectedDisciplines } = get();
    // Версия будет заполнена когда у нас будет доступ к дисциплинам
    return [];
  },

  getCompletionPercentage: () => {
    const { userProfile } = get();
    // Примерный расчет - всего ~50 навыков в курсе
    const totalSkills = 50;
    return Math.round((userProfile.completedSkills.length / totalSkills) * 100);
  },
}));
