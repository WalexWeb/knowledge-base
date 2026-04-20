import jsonData from "@/src/data/Baza_znanii_structure.json";

export interface Specialization {
  id: string;
  name: string;
}

export interface Discipline {
  id: string;
  name: string;
  semester: number;
  skills: any[]; // массив компетенций (преобразованных)
  type: string; // "УК", "ПК", "ОПК"
  description?: string;
}

// Получить список всех специализаций
export function getSpecializations(): Specialization[] {
  const specializations: Specialization[] = [];
  for (const direction of jsonData.directions) {
    for (const spec of direction.specializations) {
      specializations.push({ id: spec.id, name: spec.name });
    }
  }
  return specializations;
}

// Преобразовать competenceType (0,1,2) в строковый тип
function mapCompetenceType(type: number): string {
  switch (type) {
    case 0:
      return "УК";
    case 1:
      return "ПК";
    case 2:
      return "ОПК";
    default:
      return "УК";
  }
}

// Получить данные специализации: плоский массив дисциплин
export function getSpecializationData(specializationId: string): Discipline[] {
  const disciplines: Discipline[] = [];
  for (const direction of jsonData.directions) {
    for (const spec of direction.specializations) {
      if (spec.id !== specializationId) continue;
      for (const semester of spec.semesters) {
        for (const disc of semester.disciplines) {
          // Преобразуем компетенции в skills
          const skills = disc.competences.map((comp) => ({
            id: comp.id,
            name: comp.description,
            type: mapCompetenceType(comp.competenceType),
          }));
          // Определяем основной тип дисциплины по первой компетенции
          const mainType = skills.length > 0 ? skills[0].type : "УК";
          disciplines.push({
            id: disc.id,
            name: disc.name,
            semester: semester.number,
            skills: skills,
            type: mainType,
            description: skills[0]?.name.slice(0, 120) || "",
          });
        }
      }
      break;
    }
  }
  return disciplines;
}
