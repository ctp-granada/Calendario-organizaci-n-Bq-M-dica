export type ShiftType = 'mañana' | 'tarde';

export type ActivityType = 'practica' | 'seminario' | 'teoria' | 'examen';

export interface DayAssignment {
  groupNumber: number; // Subgrupo 1 al 15
  professor: string; // Nombre del profesor o "" si está sin asignar
  shift: ShiftType; // 'mañana' (8:30-11:00) o 'tarde' (16:00-18:30)
}

export interface WeekBlockData {
  practiceTitle: string; // e.g. "Electroforesis de Proteínas"
  practiceRoom: string; // "LAB L-5/6"
  seminarTitle: string; // e.g. "Nutrición y Nutrientes"
  seminarRoom: string; // "AULA S3"
}

export interface TemplateWeek {
  weekIndex: number; // 1 to 14
  weekOffsetFromStart: number; // 0 (15-19 feb), 1 (22-26 feb), etc.
  dateLabel: string; // "15-19 febrero", "22-26 febrero", etc.
  blockNumber?: number; // 1, 2, 3, 4
  practiceTitle: string; // "Electroforesis de Proteínas"
  practiceRoom: string; // "LAB L-5/6"
  seminarTitle: string; // "Nutrición y Nutrientes"
  seminarRoom: string; // "AULA S3"
  theoryTopic: string; // "Introducción. Comunicación celular", etc.
  isHolidayWeek?: boolean;
  isExamWeek?: boolean;
  holidayReason?: string;
  notes?: string;
  // Day-by-day group assignments (1 = Lunes, 2 = Martes, 3 = Miércoles, 4 = Jueves, 5 = Viernes)
  assignments: {
    practice: {
      [day: number]: DayAssignment;
    };
    seminar: {
      [day: number]: DayAssignment;
    };
  };
}

export interface ComputedSession {
  id: string;
  date: Date;
  dateStr: string; // YYYY-MM-DD
  dayName: string; // "Lunes", "Martes", etc.
  dayNumber: number;
  monthName: string; // "Febrero", "Marzo", etc.
  monthIndex: number; // 1 = Feb, 2 = Mar, 3 = Abr, 4 = May
  year: number;
  weekIndex: number;
  weekNumberYear: number;
  activityCode: string; // "Práctica", "Seminario", "Examen"
  activityType: ActivityType;
  title: string;
  room: string; // "LAB L-5/6" o "AULA S3"
  shift: ShiftType;
  timeRange: string; // "8:30 - 11:00 h" o "16:00 - 18:30 h"
  startTime: string; // "08:30" o "16:00"
  endTime: string; // "11:00" o "18:30"
  blockedShift: ShiftType; // La franja que queda bloqueada
  blockedTimeRange: string;
  groupNumber: number; // 1 al 15
  groupLetter: 'A' | 'B';
  professor: string;
  professorEmail: string;
  theoryTopic?: string;
  credits: number;
}

export interface FilterState {
  searchQuery: string;
  selectedProfessor: string; // "" = todos
  selectedGroup: string; // "" = todos, or "1", "2"..., or "A", "B"
  selectedShift: string; // "" = todos, "mañana", "tarde"
  selectedActivityType: string; // "" = todos, "practica", "seminario"
  selectedRoom: string; // "" = todos, "LAB L-5/6", "AULA S3"
}

export interface CoordinatorConfig {
  professorsList: string[];
  professorEmails: Record<string, string>;
  templateWeeks: TemplateWeek[];
  lastModified?: string;
  modifiedBy?: string;
}

