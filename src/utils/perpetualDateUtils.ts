import { ComputedSession, TemplateWeek, ShiftType } from '../types';
import { GROUP_CONFIG, COURSE_INFO } from '../data/curriculumData';

/**
 * Returns the default starting Monday for the 2nd semester (mid-February) of the given academic year.
 * In the UGR academic calendar, 2nd semester practices start mid-February (week of 15-19 Feb).
 */
export function getDefaultStartMonday(year: number): Date {
  // Target the Monday of the 15-19 February week in `year`
  const targetDate = new Date(year, 1, 15); // February 15
  const day = targetDate.getDay(); // 0 = Sunday, 1 = Monday, etc.
  
  const monday = new Date(targetDate);
  if (day === 0) {
    // Sunday Feb 15 -> Monday is next day Feb 16
    monday.setDate(targetDate.getDate() + 1);
  } else if (day === 1) {
    // Exactly Monday Feb 15
    monday.setDate(targetDate.getDate());
  } else {
    // Tuesday-Saturday -> Monday of this same week
    monday.setDate(targetDate.getDate() - (day - 1));
  }
  monday.setHours(0, 0, 0, 0);
  return monday;
}

export function parseISODate(isoStr: string): Date {
  const parts = isoStr.split('-');
  const y = parseInt(parts[0], 10);
  const m = parseInt(parts[1], 10) - 1;
  const d = parseInt(parts[2], 10);
  return new Date(y, m, d, 0, 0, 0, 0);
}

export function formatDateToISO(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function formatSpanishDate(date: Date, includeDayName = true): string {
  const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const monthNames = [
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
  ];

  const dayName = dayNames[date.getDay()];
  const dayNum = date.getDate();
  const monthName = monthNames[date.getMonth()];
  const year = date.getFullYear();

  if (includeDayName) {
    return `${dayName}, ${dayNum} de ${monthName} de ${year}`;
  }
  return `${dayNum} de ${monthName} de ${year}`;
}

const SPANISH_DAY_NAMES = ['', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
const SPANISH_MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

/**
 * Calculates Easter Sunday for a given year using the Meeus/Jones/Butcher Gregorian algorithm.
 */
export function getEasterSunday(year: number): Date {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31); // 3 = March, 4 = April
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month - 1, day, 0, 0, 0, 0);
}

export interface HolyWeekInfo {
  year: number;
  easterSunday: Date;
  palmSunday: Date; // Domingo de Ramos
  holyMonday: Date; // Lunes Santo
  holyTuesday: Date; // Martes Santo
  holyWednesday: Date; // Miércoles Santo
  holyThursday: Date; // Jueves Santo
  goodFriday: Date; // Viernes Santo
  holySaturday: Date; // Sábado Santo
  easterMonday: Date; // Lunes de Pascua
  dateRangeLabel: string; // e.g., "29 de marzo al 5 de abril de 2026"
  isDateInHolyWeek: (date: Date) => boolean;
  getHolyDayTitle: (date: Date) => string | null;
  isOfficialHoliday: (date: Date) => boolean;
}

export function getHolyWeekInfo(year: number): HolyWeekInfo {
  const easter = getEasterSunday(year);

  const addDays = (base: Date, days: number) => {
    const d = new Date(base);
    d.setDate(base.getDate() + days);
    d.setHours(0, 0, 0, 0);
    return d;
  };

  const palmSunday = addDays(easter, -7);
  const holyMonday = addDays(easter, -6);
  const holyTuesday = addDays(easter, -5);
  const holyWednesday = addDays(easter, -4);
  const holyThursday = addDays(easter, -3);
  const goodFriday = addDays(easter, -2);
  const holySaturday = addDays(easter, -1);
  const easterMonday = addDays(easter, 1);

  const pMonth = SPANISH_MONTH_NAMES[palmSunday.getMonth()].toLowerCase();
  const eMonth = SPANISH_MONTH_NAMES[easter.getMonth()].toLowerCase();
  const dateRangeLabel =
    palmSunday.getMonth() === easter.getMonth()
      ? `${palmSunday.getDate()} al ${easter.getDate()} de ${eMonth} de ${year}`
      : `${palmSunday.getDate()} de ${pMonth} al ${easter.getDate()} de ${eMonth} de ${year}`;

  const isSameDay = (d1: Date, d2: Date) =>
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();

  return {
    year,
    easterSunday: easter,
    palmSunday,
    holyMonday,
    holyTuesday,
    holyWednesday,
    holyThursday,
    goodFriday,
    holySaturday,
    easterMonday,
    dateRangeLabel,
    isDateInHolyWeek: (d: Date) => {
      const time = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
      return time >= palmSunday.getTime() && time <= easterMonday.getTime();
    },
    getHolyDayTitle: (d: Date) => {
      if (isSameDay(d, palmSunday)) return 'Domingo de Ramos';
      if (isSameDay(d, holyMonday)) return 'Lunes Santo';
      if (isSameDay(d, holyTuesday)) return 'Martes Santo';
      if (isSameDay(d, holyWednesday)) return 'Miércoles Santo';
      if (isSameDay(d, holyThursday)) return 'Jueves Santo (Festivo)';
      if (isSameDay(d, goodFriday)) return 'Viernes Santo (Festivo)';
      if (isSameDay(d, holySaturday)) return 'Sábado Santo';
      if (isSameDay(d, easter)) return 'Domingo de Resurrección (Pascua)';
      if (isSameDay(d, easterMonday)) return 'Lunes de Pascua';
      return null;
    },
    isOfficialHoliday: (d: Date) => {
      return isSameDay(d, holyThursday) || isSameDay(d, goodFriday);
    },
  };
}

/**
 * Calculates ISO week number in year
 */
function getWeekNumber(d: Date): number {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  return Math.ceil(((date.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

export interface MonthDayItem {
  date: Date;
  dateStr: string;
  dayNumber: number;
  isCurrentMonth: boolean;
  isWeekend: boolean;
}

/**
 * Returns grid of days for a calendar month.
 * If weekdaysOnly is true, only Monday (1) to Friday (5) are returned.
 */
export function getMonthDaysGrid(
  year: number,
  monthIndex: number,
  weekdaysOnly = true
): MonthDayItem[] {
  const firstDay = new Date(year, monthIndex, 1);
  const lastDay = new Date(year, monthIndex + 1, 0);

  // We want to fill weeks starting on Monday (1)
  const startDayOfWeek = (firstDay.getDay() + 6) % 7; // 0 = Mon, 6 = Sun
  const startDate = new Date(firstDay);
  startDate.setDate(firstDay.getDate() - startDayOfWeek);

  const endDayOfWeek = (lastDay.getDay() + 6) % 7;
  const daysToAdd = (6 - endDayOfWeek + 7) % 7;
  const endDate = new Date(lastDay);
  endDate.setDate(lastDay.getDate() + daysToAdd);

  const items: MonthDayItem[] = [];
  const curr = new Date(startDate);

  while (curr <= endDate) {
    const d = curr.getDay(); // 0 = Sun, 6 = Sat
    const isWeekend = d === 0 || d === 6;

    if (!weekdaysOnly || !isWeekend) {
      items.push({
        date: new Date(curr),
        dateStr: formatDateToISO(curr),
        dayNumber: curr.getDate(),
        isCurrentMonth: curr.getMonth() === monthIndex,
        isWeekend,
      });
    }

    curr.setDate(curr.getDate() + 1);
  }

  return items;
}

/**
 * Computes all practice and seminar sessions dynamically from templateWeeks.
 * Mutually exclusive shift logic:
 * - If shift is 'mañana' (8:30-11:00), the afternoon slot ('tarde', 16:00-18:30) is blocked for that day.
 * - If shift is 'tarde' (16:00-18:30), the morning slot ('mañana', 8:30-11:00) is blocked for that day.
 */
export function computeAllSessions(
  startMonday: Date,
  templateWeeks: TemplateWeek[],
  professorEmails: Record<string, string>
): ComputedSession[] {
  const sessions: ComputedSession[] = [];

  for (const week of templateWeeks) {
    if (week.isHolidayWeek && Object.keys(week.assignments.practice || {}).length === 0) {
      continue;
    }

    // Offset in weeks from semester start
    const weekStartMonday = new Date(startMonday);
    weekStartMonday.setDate(startMonday.getDate() + week.weekOffsetFromStart * 7);

    // Days 1 (Lunes) to 5 (Viernes)
    for (let day = 1; day <= 5; day++) {
      const sessionDate = new Date(weekStartMonday);
      sessionDate.setDate(weekStartMonday.getDate() + (day - 1));
      sessionDate.setHours(0, 0, 0, 0);

      const dateStr = formatDateToISO(sessionDate);
      const dayName = SPANISH_DAY_NAMES[day];
      const dayNumber = sessionDate.getDate();
      const monthIndex = sessionDate.getMonth();
      const monthName = SPANISH_MONTH_NAMES[monthIndex];
      const year = sessionDate.getFullYear();
      const weekNumberYear = getWeekNumber(sessionDate);

      // --- 1. PRÁCTICA en LAB L-5/6 ---
      const practiceAss = week.assignments.practice?.[day];
      if (practiceAss && practiceAss.groupNumber) {
        const groupNum = practiceAss.groupNumber;
        const shift: ShiftType = practiceAss.shift || 'mañana';
        const isMorning = shift === 'mañana';

        const timeRange = isMorning
          ? COURSE_INFO.timeSlots.morning.range
          : COURSE_INFO.timeSlots.afternoon.range;
        const startTime = isMorning ? '08:30' : '16:00';
        const endTime = isMorning ? '11:00' : '18:30';

        const blockedShift: ShiftType = isMorning ? 'tarde' : 'mañana';
        const blockedTimeRange = isMorning
          ? COURSE_INFO.timeSlots.afternoon.range
          : COURSE_INFO.timeSlots.morning.range;

        const groupLetter = GROUP_CONFIG[groupNum]?.groupLetter || (groupNum <= 7 ? 'A' : 'B');
        const prof = practiceAss.professor?.trim() || 'Sin asignar';
        const profEmail = prof && prof !== 'Sin asignar' ? professorEmails[prof] || '' : '';

        sessions.push({
          id: `w${week.weekIndex}-d${day}-practica-g${groupNum}`,
          date: sessionDate,
          dateStr,
          dayName,
          dayNumber,
          monthName,
          monthIndex,
          year,
          weekIndex: week.weekIndex,
          weekNumberYear,
          activityCode: week.isExamWeek ? 'Examen Práctico' : `Práctica ${week.blockNumber || ''}`.trim(),
          activityType: week.isExamWeek ? 'examen' : 'practica',
          title: week.practiceTitle || 'Práctica de Laboratorio',
          room: week.practiceRoom || COURSE_INFO.rooms.practice,
          shift,
          timeRange,
          startTime,
          endTime,
          blockedShift,
          blockedTimeRange,
          groupNumber: groupNum,
          groupLetter,
          professor: prof,
          professorEmail: profEmail,
          theoryTopic: week.theoryTopic,
          credits: 0.25,
        });
      }

      // --- 2. SEMINARIO en AULA S3 ---
      const seminarAss = week.assignments.seminar?.[day];
      if (seminarAss && seminarAss.groupNumber) {
        const groupNum = seminarAss.groupNumber;
        const shift: ShiftType = seminarAss.shift || 'mañana';
        const isMorning = shift === 'mañana';

        const timeRange = isMorning
          ? COURSE_INFO.timeSlots.morning.range
          : COURSE_INFO.timeSlots.afternoon.range;
        const startTime = isMorning ? '08:30' : '16:00';
        const endTime = isMorning ? '11:00' : '18:30';

        const blockedShift: ShiftType = isMorning ? 'tarde' : 'mañana';
        const blockedTimeRange = isMorning
          ? COURSE_INFO.timeSlots.afternoon.range
          : COURSE_INFO.timeSlots.morning.range;

        const groupLetter = GROUP_CONFIG[groupNum]?.groupLetter || (groupNum <= 7 ? 'A' : 'B');
        const prof = seminarAss.professor?.trim() || 'Sin asignar';
        const profEmail = prof && prof !== 'Sin asignar' ? professorEmails[prof] || '' : '';

        sessions.push({
          id: `w${week.weekIndex}-d${day}-seminario-g${groupNum}`,
          date: sessionDate,
          dateStr,
          dayName,
          dayNumber,
          monthName,
          monthIndex,
          year,
          weekIndex: week.weekIndex,
          weekNumberYear,
          activityCode: `Seminario ${week.blockNumber || ''}`.trim(),
          activityType: 'seminario',
          title: week.seminarTitle || 'Seminario',
          room: week.seminarRoom || COURSE_INFO.rooms.seminar,
          shift,
          timeRange,
          startTime,
          endTime,
          blockedShift,
          blockedTimeRange,
          groupNumber: groupNum,
          groupLetter,
          professor: prof,
          professorEmail: profEmail,
          theoryTopic: week.theoryTopic,
          credits: 0.25,
        });
      }
    }
  }

  // Sort chronologically, then by group
  return sessions.sort((a, b) => {
    const timeDiff = a.date.getTime() - b.date.getTime();
    if (timeDiff !== 0) return timeDiff;
    if (a.shift !== b.shift) return a.shift === 'mañana' ? -1 : 1;
    return a.groupNumber - b.groupNumber;
  });
}

/**
 * Generates an iCalendar (.ics) string for export
 */
export function generateICS(sessions: ComputedSession[], academicYearLabel: string): string {
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Universidad de Granada//Bioquímica Médica (Medicina)//ES',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:Bioquímica Médica ${academicYearLabel}`,
    'X-WR-TIMEZONE:Europe/Madrid',
  ];

  for (const s of sessions) {
    const y = s.year;
    const m = String(s.monthIndex + 1).padStart(2, '0');
    const d = String(s.dayNumber).padStart(2, '0');

    const [sh, sm] = s.startTime.split(':');
    const [eh, em] = s.endTime.split(':');

    const dtStart = `${y}${m}${d}T${sh}${sm}00`;
    const dtEnd = `${y}${m}${d}T${eh}${em}00`;

    const summary = `${s.activityCode}: ${s.title} (Subgr. ${s.groupNumber} - Grupo ${s.groupLetter})`;
    const profText = s.professor && s.professor !== 'Sin asignar' 
      ? `Profesor(a): ${s.professor} (${s.professorEmail || 'ugr.es'})`
      : 'Profesor(a): Pendiente de asignar';
    
    const descLines = [
      `Asignatura: Bioquímica Médica (Grado en Medicina - Grupos A y B)`,
      `Actividad: ${s.activityCode} - ${s.title}`,
      `Subgrupo: ${s.groupNumber} (Grupo ${s.groupLetter})`,
      `Turno: ${s.shift.toUpperCase()} (${s.timeRange})`,
      `Ubicación: ${s.room} - Facultad de Medicina UGR`,
      profText,
      s.theoryTopic ? `Temario teórico de la semana: ${s.theoryTopic}` : '',
      `Universidad de Granada`,
    ].filter(Boolean);

    lines.push(
      'BEGIN:VEVENT',
      `UID:${s.id}-${y}@ugr.es`,
      `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
      `DTSTART:${dtStart}`,
      `DTEND:${dtEnd}`,
      `SUMMARY:${summary.replace(/,/g, '\\,')}`,
      `DESCRIPTION:${descLines.join('\\n').replace(/,/g, '\\,')}`,
      `LOCATION:${s.room}, Facultad de Medicina, Universidad de Granada`,
      'STATUS:CONFIRMED',
      'END:VEVENT'
    );
  }

  lines.push('END:VCALENDAR');
  return lines.join('\r\n');
}
