import React, { useState } from 'react';
import { TemplateWeek, FilterState, ComputedSession, ShiftType } from '../types';
import { PROFESSORS_LIST, PROFESSOR_EMAILS } from '../data/curriculumData';
import {
  Clock,
  MapPin,
  Lock,
  Unlock,
  CheckCircle2,
  Mail,
  User,
  Sparkles,
  Info,
  Calendar,
  Layers,
} from 'lucide-react';

interface MatrixTableViewProps {
  startMonday: Date;
  academicYear: number;
  filters: FilterState;
  onSelectSessionById: (sessionId: string) => void;
  computedSessions: ComputedSession[];
  templateWeeks: TemplateWeek[];
  onUpdateDayAssignment?: (
    weekIndex: number,
    activityType: 'practice' | 'seminar',
    day: number,
    newProfessor: string,
    newShift?: ShiftType
  ) => void;
}

export const MatrixTableView: React.FC<MatrixTableViewProps> = ({
  academicYear,
  filters,
  onSelectSessionById,
  computedSessions,
  templateWeeks,
  onUpdateDayAssignment,
}) => {
  // Quick toggle between compact view (like official printed sheet) and interactive assignment mode
  const [showProfDropdowns, setShowProfDropdowns] = useState<boolean>(true);

  // Quick lookup map: key = `w${weekIndex}-${activityType}-${day}`
  const sessionsMap: Record<string, ComputedSession> = {};
  computedSessions.forEach((s) => {
    const dayMap: Record<string, number> = {
      Lunes: 1,
      Martes: 2,
      Miércoles: 3,
      Jueves: 4,
      Viernes: 5,
    };
    const day = dayMap[s.dayName];
    const key = `w${s.weekIndex}-${s.activityType === 'practica' ? 'practice' : 'seminar'}-${day}`;
    sessionsMap[key] = s;
  });

  const dayLetters = [
    { day: 1, label: 'L' },
    { day: 2, label: 'M' },
    { day: 3, label: 'X' },
    { day: 4, label: 'J' },
    { day: 5, label: 'V' },
  ];

  return (
    <div className="bg-white rounded-2xl border border-amber-200 shadow-sm overflow-hidden">
      {/* View Header Info */}
      <div className="px-6 py-4 border-b border-amber-200/80 bg-gradient-to-r from-amber-50/80 via-yellow-50/50 to-amber-50/80 flex items-center justify-between flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-xl font-bold text-slate-950 font-['Outfit']">
              Cronograma Oficial • Bioquímica Médica
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-400 text-amber-950 border border-amber-500/40">
              Facultad de Medicina • UGR
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-1">
            Distribución semanal de Prácticas (LAB L-5/6) y Seminarios (AULA S3) para los Grupos A y B (Subgrupos 1 al 15).
          </p>
        </div>

        {/* Action / View Mode Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            id="toggle-assignment-dropdowns"
            onClick={() => setShowProfDropdowns(!showProfDropdowns)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 shadow-2xs ${
              showProfDropdowns
                ? 'bg-amber-500 text-slate-950 border-amber-600/40'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
            }`}
          >
            <User className="w-3.5 h-3.5 text-slate-900" />
            <span>{showProfDropdowns ? 'Ocultar desplegables de profesor' : 'Mostrar desplegables de asignación'}</span>
          </button>

          <div className="text-xs font-bold px-3 py-1.5 rounded-xl bg-amber-100 text-amber-950 border border-amber-300">
            Curso {academicYear} - {academicYear + 1}
          </div>
        </div>
      </div>


      {/* Main Table Matching Diagram Layout */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left border-collapse min-w-[1100px]">
          {/* Main Table Headers */}
          <thead>
            <tr className="border-b border-slate-300 text-slate-900 font-bold">
              {/* Fechas */}
              <th className="p-3 border-r border-slate-200 w-32 text-center bg-slate-100">
                Fechas
              </th>

              {/* PRÁCTICAS Blue Banner (LAB L-5/6) */}
              <th colSpan={5} className="p-3 border-r-4 border-r-slate-600 text-center bg-gradient-to-r from-sky-600 to-blue-700 text-white shadow-xs">
                <div className="flex items-center justify-center gap-2">
                  <span className="text-base">🔬</span>
                  <span className="font-extrabold tracking-wide uppercase font-['Outfit'] text-sm">
                    PRÁCTICAS 8.30-11 HRS / 16-18.30 HRS • LAB L-5/6
                  </span>
                </div>
              </th>

              {/* SEMINARIOS Purple Banner (AULA S3) */}
              <th colSpan={5} className="p-3 border-r border-purple-300 text-center bg-gradient-to-r from-purple-700 to-indigo-700 text-white shadow-xs">
                <div className="flex items-center justify-center gap-2">
                  <span className="text-base">📖</span>
                  <span className="font-extrabold tracking-wide uppercase font-['Outfit'] text-sm">
                    SEMINARIOS 8.30-11 HRS / 16-18.30 HRS • AULA S3
                  </span>
                </div>
              </th>

              {/* Temario teórico (aprox) */}
              <th className="p-3 w-64 text-left bg-slate-100 text-slate-800">
                Temario teórico (aprox)
              </th>
            </tr>

            {/* Sub-header with day badges: L M X J V */}
            <tr className="bg-slate-50 border-b border-slate-200 text-center text-[11px] font-bold">
              <th className="p-2 border-r border-slate-200 text-slate-500 bg-slate-100">
                Semana
              </th>

              {/* Prácticas 5 Days */}
              {dayLetters.map((d) => (
                <th
                  key={`p-day-${d.day}`}
                  className={`p-2 bg-sky-100/90 text-sky-950 w-28 ${
                    d.day === 5 ? 'border-r-4 border-r-slate-600' : 'border-r border-sky-200'
                  }`}
                >
                  <div className="flex flex-col items-center justify-center gap-0.5">
                    <span className="w-5 h-5 rounded-full bg-sky-700 text-white flex items-center justify-center text-[11px] font-black shadow-xs">
                      {d.label}
                    </span>
                    <span className="text-[8px] uppercase tracking-wider text-sky-800 font-extrabold">Práctica</span>
                  </div>
                </th>
              ))}

              {/* Seminarios 5 Days */}
              {dayLetters.map((d) => (
                <th
                  key={`s-day-${d.day}`}
                  className="p-2 border-r border-purple-200 bg-purple-100/90 text-purple-950 w-28"
                >
                  <div className="flex flex-col items-center justify-center gap-0.5">
                    <span className="w-5 h-5 rounded-full bg-purple-700 text-white flex items-center justify-center text-[11px] font-black shadow-xs">
                      {d.label}
                    </span>
                    <span className="text-[8px] uppercase tracking-wider text-purple-800 font-extrabold">Seminario</span>
                  </div>
                </th>
              ))}

              <th className="p-2 text-slate-500 text-left bg-slate-100">
                Contenido temático
              </th>
            </tr>
          </thead>

          <tbody>
            {templateWeeks.map((week, weekIdx) => {
              const prevWeek = templateWeeks[weekIdx - 1];
              // Check if we need to render a Block Header above this week
              const isFirstWeekOfBlock =
                Boolean(week.blockNumber) &&
                (!prevWeek || prevWeek.blockNumber !== week.blockNumber);

              return (
                <React.Fragment key={`week-row-${week.weekIndex}`}>
                  {/* Block Banner Divider */}
                  {isFirstWeekOfBlock && week.blockNumber && (
                    <tr className="border-t-2 border-amber-300 font-bold">
                      <td className="p-2 text-center bg-amber-400 text-amber-950 font-black font-['Outfit'] border-r border-amber-300 text-xs uppercase">
                        Bloque {week.blockNumber}
                      </td>
                      <td
                        colSpan={5}
                        className="p-2 text-center bg-sky-100 text-sky-950 font-black border-r-4 border-r-slate-600 text-xs uppercase tracking-wide"
                      >
                        🔬 {week.practiceTitle}
                      </td>
                      <td
                        colSpan={5}
                        className="p-2 text-center bg-purple-100 text-purple-950 font-black border-r border-purple-200 text-xs uppercase tracking-wide"
                      >
                        📖 {week.seminarTitle}
                      </td>
                      <td className="p-2 bg-slate-100/50"></td>
                    </tr>
                  )}

                  {/* Holiday / Theory-only week (Week 4: 8-12 marzo) */}
                  {week.isHolidayWeek && (
                    <tr className="border-b border-slate-200 bg-amber-50/40 text-slate-700 hover:bg-amber-50/60 transition-colors">
                      <td className="p-3 text-center font-bold border-r border-slate-200 bg-slate-50">
                        <span className="block text-slate-900 font-extrabold">{week.dateLabel}</span>
                        <span className="text-[10px] text-amber-800 font-semibold">Semana {week.weekIndex}</span>
                      </td>
                      <td
                        colSpan={10}
                        className="p-3 text-center font-semibold text-amber-900 italic border-r border-slate-200 bg-amber-50/60"
                      >
                        {week.holidayReason || 'Semana sin prácticas de laboratorio (Clases de teoría presenciales)'}
                        {week.notes && <span className="block text-[11px] font-normal text-slate-600 mt-0.5">{week.notes}</span>}
                      </td>
                      <td className="p-3 font-medium text-slate-900 align-middle">
                        <span className="font-bold text-slate-800">{week.theoryTopic}</span>
                      </td>
                    </tr>
                  )}

                  {/* Exam week (Week 14: 24-28 mayo) */}
                  {week.isExamWeek && (
                    <tr className="border-b-2 border-amber-400 bg-amber-100/70 text-slate-900 hover:bg-amber-100 transition-colors">
                      <td className="p-3 text-center font-bold border-r border-amber-300 bg-amber-200/70">
                        <span className="block text-amber-950 font-extrabold">{week.dateLabel}</span>
                        <span className="text-[10px] text-amber-800 font-semibold">Semana {week.weekIndex}</span>
                      </td>
                      <td
                        colSpan={10}
                        className="p-3 text-center font-black text-amber-950 border-r border-amber-300"
                      >
                        <div className="flex items-center justify-center gap-2 text-sm uppercase tracking-wide">
                          <span>🎓</span>
                          <span>{week.practiceTitle}</span>
                        </div>
                        <p className="text-xs font-semibold text-amber-900 mt-1">
                          {week.notes}
                        </p>
                      </td>
                      <td className="p-3 font-bold text-amber-950 align-middle text-xs">
                        {week.theoryTopic}
                      </td>
                    </tr>
                  )}

                  {/* Standard Practice/Seminar Week */}
                  {!week.isHolidayWeek && !week.isExamWeek && (
                    <tr className="border-b border-slate-200 hover:bg-slate-50/60 transition-colors">
                      {/* Fechas Column */}
                      <td className="p-3 text-center font-bold border-r border-slate-200 bg-slate-50/70 align-middle">
                        <span className="block text-slate-950 font-black text-xs">{week.dateLabel}</span>
                        <span className="text-[10px] text-slate-500 font-medium block">
                          Semana {week.weekIndex}
                        </span>
                        {week.notes && (
                          <span
                            className={`text-[9px] block mt-0.5 font-bold ${
                              week.notes.toLowerCase().includes('semana santa')
                                ? 'text-purple-800 bg-purple-100 px-1 py-0.5 rounded border border-purple-300 shadow-2xs'
                                : 'text-amber-800'
                            }`}
                            title={week.notes}
                          >
                            {week.notes.toLowerCase().includes('semana santa') ? '✝️ Semana Santa' : '*Festivo parcial'}
                          </span>
                        )}
                      </td>

                      {/* 5 Days of PRÁCTICAS */}
                      {dayLetters.map((d) => {
                        const ass = week.assignments.practice?.[d.day];
                        const sessionKey = `w${week.weekIndex}-practice-${d.day}`;
                        const session = sessionsMap[sessionKey];
                        const shift = ass?.shift || 'mañana';

                        if (!ass) {
                          return (
                            <td
                              key={`p-${d.day}`}
                              className={`p-2 text-center text-slate-300 bg-sky-50/20 ${
                                d.day === 5 ? 'border-r-4 border-r-slate-600' : 'border-r border-sky-200/70'
                              }`}
                            >
                              -
                            </td>
                          );
                        }

                        return (
                          <td
                            key={`p-${d.day}`}
                            className={`p-2 align-top bg-sky-50/70 hover:bg-sky-100/90 transition-colors ${
                              d.day === 5 ? 'border-r-4 border-r-slate-600' : 'border-r border-sky-200/70'
                            }`}
                          >
                            <div className="flex flex-col items-center gap-1.5">
                              {/* Subgroup lime pill matching original diagram */}
                              <button
                                type="button"
                                onClick={() => session && onSelectSessionById(session.id)}
                                className="w-8 h-8 rounded-full bg-lime-400 text-slate-950 flex items-center justify-center font-black text-sm shadow-xs border-2 border-lime-500/60 hover:scale-105 transition-transform"
                                title={`Subgrupo ${ass.groupNumber} (Haz clic para ver detalles)`}
                              >
                                {ass.groupNumber}
                              </button>

                              {/* Shift Selector Dropdown */}
                              <div className="w-full">
                                <select
                                  value={shift}
                                  onChange={(e) => {
                                    if (onUpdateDayAssignment) {
                                      onUpdateDayAssignment(
                                        week.weekIndex,
                                        'practice',
                                        d.day,
                                        ass.professor,
                                        e.target.value as ShiftType
                                      );
                                    }
                                  }}
                                  className="w-full text-[10px] py-0.5 px-1 rounded border border-sky-300 bg-white font-bold text-sky-950 shadow-2xs hover:border-sky-500 cursor-pointer focus:ring-1 focus:ring-sky-500"
                                  title="Franja horaria: Mañana (8:30-11:00) o Tarde (16:00-18:30)"
                                >
                                  <option value="mañana">8:30 - 11 h</option>
                                  <option value="tarde">16 - 18:30 h</option>
                                </select>
                              </div>

                              {/* Professor dropdown / display */}
                              {showProfDropdowns ? (
                                <select
                                  value={ass.professor || ''}
                                  onChange={(e) => {
                                    if (onUpdateDayAssignment) {
                                      onUpdateDayAssignment(
                                        week.weekIndex,
                                        'practice',
                                        d.day,
                                        e.target.value,
                                        ass.shift
                                      );
                                    }
                                  }}
                                  className={`w-full text-[10px] py-1 px-1 rounded border font-semibold truncate transition-colors ${
                                    ass.professor
                                      ? 'bg-white border-sky-300 text-slate-900'
                                      : 'bg-amber-50 border-amber-300 text-amber-900 font-bold'
                                  }`}
                                  title="Seleccionar profesor para este día"
                                >
                                  <option value="">-- Sin asignar --</option>
                                  {PROFESSORS_LIST.map((p) => (
                                    <option key={p} value={p}>
                                      {p}
                                    </option>
                                  ))}
                                </select>
                              ) : (
                                <span
                                  onClick={() => session && onSelectSessionById(session.id)}
                                  className="text-[10px] font-semibold text-slate-700 truncate block text-center cursor-pointer hover:text-amber-800"
                                >
                                  {ass.professor || 'Sin asignar'}
                                </span>
                              )}
                            </div>
                          </td>
                        );
                      })}

                      {/* 5 Days of SEMINARIOS */}
                      {dayLetters.map((d) => {
                        const ass = week.assignments.seminar?.[d.day];
                        const sessionKey = `w${week.weekIndex}-seminar-${d.day}`;
                        const session = sessionsMap[sessionKey];
                        const shift = ass?.shift || 'mañana';

                        if (!ass) {
                          return (
                            <td
                              key={`s-${d.day}`}
                              className="p-2 text-center border-r border-purple-200/70 text-slate-300 bg-purple-50/20"
                            >
                              -
                            </td>
                          );
                        }

                        return (
                          <td
                            key={`s-${d.day}`}
                            className="p-2 border-r border-purple-200/70 align-top bg-purple-50/70 hover:bg-purple-100/90 transition-colors"
                          >
                            <div className="flex flex-col items-center gap-1.5">
                              {/* Subgroup lime pill matching original diagram */}
                              <button
                                type="button"
                                onClick={() => session && onSelectSessionById(session.id)}
                                className="w-8 h-8 rounded-full bg-lime-400 text-slate-950 flex items-center justify-center font-black text-sm shadow-xs border-2 border-lime-500/60 hover:scale-105 transition-transform"
                                title={`Subgrupo ${ass.groupNumber} (Haz clic para ver detalles)`}
                              >
                                {ass.groupNumber}
                              </button>

                              {/* Shift Selector Dropdown */}
                              <div className="w-full">
                                <select
                                  value={shift}
                                  onChange={(e) => {
                                    if (onUpdateDayAssignment) {
                                      onUpdateDayAssignment(
                                        week.weekIndex,
                                        'seminar',
                                        d.day,
                                        ass.professor,
                                        e.target.value as ShiftType
                                      );
                                    }
                                  }}
                                  className="w-full text-[10px] py-0.5 px-1 rounded border border-purple-300 bg-white font-bold text-purple-950 shadow-2xs hover:border-purple-500 cursor-pointer focus:ring-1 focus:ring-purple-500"
                                  title="Franja horaria: Mañana (8:30-11:00) o Tarde (16:00-18:30)"
                                >
                                  <option value="mañana">8:30 - 11 h</option>
                                  <option value="tarde">16 - 18:30 h</option>
                                </select>
                              </div>

                              {/* Professor dropdown / display */}
                              {showProfDropdowns ? (
                                <select
                                  value={ass.professor || ''}
                                  onChange={(e) => {
                                    if (onUpdateDayAssignment) {
                                      onUpdateDayAssignment(
                                        week.weekIndex,
                                        'seminar',
                                        d.day,
                                        e.target.value,
                                        ass.shift
                                      );
                                    }
                                  }}
                                  className={`w-full text-[10px] py-1 px-1 rounded border font-semibold truncate transition-colors ${
                                    ass.professor
                                      ? 'bg-white border-purple-300 text-slate-900'
                                      : 'bg-amber-50 border-amber-300 text-amber-900 font-bold'
                                  }`}
                                  title="Seleccionar profesor para este día"
                                >
                                  <option value="">-- Sin asignar --</option>
                                  {PROFESSORS_LIST.map((p) => (
                                    <option key={p} value={p}>
                                      {p}
                                    </option>
                                  ))}
                                </select>
                              ) : (
                                <span
                                  onClick={() => session && onSelectSessionById(session.id)}
                                  className="text-[10px] font-semibold text-slate-700 truncate block text-center cursor-pointer hover:text-amber-800"
                                >
                                  {ass.professor || 'Sin asignar'}
                                </span>
                              )}
                            </div>
                          </td>
                        );
                      })}

                      {/* Temario teórico (aprox) */}
                      <td className="p-3 text-slate-800 align-middle font-medium leading-snug">
                        <span className="font-bold text-slate-950 block text-xs">
                          {week.theoryTopic}
                        </span>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Table Footer Summary with Medicine Yellow Accents & Activity Legend */}
      <div className="p-4 bg-amber-50/50 border-t border-amber-200 text-xs text-slate-700 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded bg-sky-100 border-2 border-sky-400 inline-block"></span>
            <span className="font-bold text-sky-950">Prácticas (LAB L-5/6)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded bg-purple-100 border-2 border-purple-400 inline-block"></span>
            <span className="font-bold text-purple-950">Seminarios (AULA S3)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3.5 w-1 bg-slate-600 inline-block rounded-xs"></span>
            <span className="text-slate-600 font-medium">Línea divisoria de áreas docentes</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-900 border border-purple-300">
              ✝️ Semana Santa
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 font-bold text-slate-900">
            <span className="w-3 h-3 rounded-full bg-lime-400 border border-lime-600 inline-block"></span>
            Subgrupos 1 al 15 (Grupos A y B)
          </span>
        </div>
      </div>
    </div>
  );
};
