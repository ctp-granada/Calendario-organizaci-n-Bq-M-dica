import React, { useMemo } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  User,
  Mail,
  Calendar,
  Sparkles,
  MapPin,
  GraduationCap,
} from 'lucide-react';
import { ComputedSession, FilterState } from '../types';
import { getMonthDaysGrid, getHolyWeekInfo } from '../utils/perpetualDateUtils';

interface MonthCalendarViewProps {
  year: number;
  monthIndex: number; // 1 = Feb, 2 = Mar, 3 = Abr, 4 = May
  onMonthChange: (newMonthIndex: number) => void;
  sessions: ComputedSession[];
  filters: FilterState;
  onSelectSession: (session: ComputedSession) => void;
}

export const MonthCalendarView: React.FC<MonthCalendarViewProps> = ({
  year,
  monthIndex,
  onMonthChange,
  sessions,
  filters,
  onSelectSession,
}) => {
  const monthNames = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ];

  // Strictly weekdays (Lunes a Viernes)
  const daysGrid = getMonthDaysGrid(year, monthIndex, true);
  const holyWeek = useMemo(() => getHolyWeekInfo(year), [year]);

  // Check if Semana Santa falls within the currently displayed month
  const isHolyWeekInThisMonth = useMemo(() => {
    return daysGrid.some((d) => d.isCurrentMonth && holyWeek.isDateInHolyWeek(d.date));
  }, [daysGrid, holyWeek]);

  // Group sessions by date string YYYY-MM-DD
  const sessionsByDate: Record<string, ComputedSession[]> = {};
  sessions.forEach((s) => {
    if (!sessionsByDate[s.dateStr]) {
      sessionsByDate[s.dateStr] = [];
    }
    sessionsByDate[s.dateStr].push(s);
  });

  // Check holiday highlights for Spanish academic calendar (2nd semester)
  const getDaySpecialNotice = (dateStr: string, date: Date) => {
    const m = date.getMonth();
    const d = date.getDate();

    // 15-19 Feb: No practices or seminars, only theory classes
    if (m === 1 && d >= 15 && d <= 20) {
      return 'Sin prácticas ni seminarios (Solo clases de teoría)';
    }

    if (m === 1 && d === 28) {
      return '28 Febrero • Día de Andalucía (Festivo)';
    }
    if (m === 2 && d === 1 && date.getDay() === 1) {
      return 'Día de Andalucía (Lunes festivo trasladado)';
    }
    if (m === 4 && d === 1) {
      return '1 Mayo • Fiesta del Trabajo (Festivo)';
    }

    // Holy Week detection
    const holyTitle = holyWeek.getHolyDayTitle(date);
    if (holyTitle) {
      return `✝️ ${holyTitle}`;
    }
    if (holyWeek.isDateInHolyWeek(date)) {
      return '✝️ Semana Santa (No lectivo)';
    }

    return null;
  };

  const handlePrevMonth = () => {
    if (monthIndex <= 1) {
      onMonthChange(4); // Wrap around to Mayo
    } else {
      onMonthChange(monthIndex - 1);
    }
  };

  const handleNextMonth = () => {
    if (monthIndex >= 4) {
      onMonthChange(1); // Wrap around to Febrero
    } else {
      onMonthChange(monthIndex + 1);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-amber-200 shadow-xs overflow-hidden">
      {/* Month Navigation & Title Header */}
      <div className="px-6 py-4 border-b border-amber-200 bg-gradient-to-r from-amber-50/70 via-white to-amber-50/70 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-white border border-amber-200 rounded-xl p-1 shadow-2xs">
            <button
              type="button"
              id="btn-cal-prev-month"
              onClick={handlePrevMonth}
              className="p-1.5 text-slate-700 hover:text-amber-900 hover:bg-amber-100 rounded-lg transition-colors"
              title="Mes anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              id="btn-cal-next-month"
              onClick={handleNextMonth}
              className="p-1.5 text-slate-700 hover:text-amber-900 hover:bg-amber-100 rounded-lg transition-colors"
              title="Mes siguiente"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-950 font-['Outfit'] flex items-center gap-2">
              <span>{monthNames[monthIndex]}</span>
              <span className="text-amber-700/80 font-normal">{year}</span>
            </h2>
            <p className="text-xs text-slate-600">
              2º Semestre • Prácticas (LAB L-5/6) y Seminarios (AULA S3) • Grupos A y B
            </p>
          </div>
        </div>

        {/* 2nd Semester Month Switch Buttons: Febrero, Marzo, Abril, Mayo */}
        <div className="flex items-center gap-1.5 bg-amber-50/90 p-1 rounded-xl border border-amber-200 text-xs">
          {[1, 2, 3, 4].map((mIdx) => (
            <button
              key={mIdx}
              type="button"
              id={`quick-month-btn-${mIdx}`}
              onClick={() => onMonthChange(mIdx)}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                monthIndex === mIdx
                  ? 'bg-amber-500 text-slate-950 shadow-2xs font-bold border border-amber-600/30'
                  : 'text-slate-700 hover:text-amber-950 hover:bg-white'
              }`}
            >
              {monthNames[mIdx]}
            </button>
          ))}
        </div>
      </div>

      {/* Semana Santa Banner if present in current month */}
      {isHolyWeekInThisMonth && (
        <div className="px-6 py-2.5 bg-gradient-to-r from-purple-100/90 via-amber-50 to-purple-100/90 border-b border-purple-200 flex items-center justify-between flex-wrap gap-2 text-xs text-purple-950">
          <div className="flex items-center gap-2 font-bold">
            <span className="text-base">✝️</span>
            <span>Semana Santa {year}: {holyWeek.dateRangeLabel}</span>
            <span className="text-[11px] font-medium text-purple-800 hidden sm:inline">
              • Periodo no lectivo y festivo universitario oficial UGR
            </span>
          </div>
          <span className="text-[10px] font-extrabold uppercase tracking-wide bg-purple-200/80 text-purple-950 px-2 py-0.5 rounded-full border border-purple-300">
            Calendario Oficial UGR
          </span>
        </div>
      )}

      {/* Weekday Column Headers (Lunes a Viernes) */}
      <div className="grid grid-cols-5 border-b border-amber-200 bg-amber-100/50 text-center text-xs font-bold text-amber-950">
        <div className="py-2.5 px-1 border-r border-amber-200">Lunes</div>
        <div className="py-2.5 px-1 border-r border-amber-200">Martes</div>
        <div className="py-2.5 px-1 border-r border-amber-200">Miércoles</div>
        <div className="py-2.5 px-1 border-r border-amber-200">Jueves</div>
        <div className="py-2.5 px-1">Viernes</div>
      </div>

      {/* Calendar Grid Matrix (Lunes a Viernes) */}
      <div className="grid grid-cols-5 auto-rows-fr divide-x divide-y divide-amber-100 bg-slate-50">
        {daysGrid.map((dayItem, index) => {
          const daySessions = sessionsByDate[dayItem.dateStr] || [];
          const specialNotice = getDaySpecialNotice(dayItem.dateStr, dayItem.date);
          const isCurrentMonth = dayItem.isCurrentMonth;
          const isHolyWeek = holyWeek.isDateInHolyWeek(dayItem.date);
          const holyDayTitle = holyWeek.getHolyDayTitle(dayItem.date);
          const isHolyHoliday = holyWeek.isOfficialHoliday(dayItem.date);

          return (
            <div
              key={dayItem.dateStr + index}
              className={`min-h-[145px] sm:min-h-[190px] p-2 sm:p-2.5 flex flex-col justify-between transition-colors ${
                !isCurrentMonth
                  ? 'bg-slate-50/50 text-slate-300'
                  : isHolyWeek
                  ? 'bg-purple-50/30 text-slate-800 hover:bg-purple-50/60'
                  : 'bg-white text-slate-800 hover:bg-amber-50/30'
              }`}
            >
              {/* Day Number Header */}
              <div className="flex items-center justify-between mb-1.5 gap-1">
                <span
                  className={`text-sm font-black w-6 h-6 rounded-full flex items-center justify-center ${
                    daySessions.length > 0 && isCurrentMonth
                      ? 'bg-amber-500 text-slate-950 shadow-2xs border border-amber-600/30'
                      : isHolyWeek && isCurrentMonth
                      ? 'bg-purple-600 text-white shadow-2xs'
                      : isCurrentMonth
                      ? 'text-slate-700'
                      : 'text-slate-300'
                  }`}
                >
                  {dayItem.dayNumber}
                </span>

                {isCurrentMonth && isHolyWeek && (
                  <span
                    className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded border truncate max-w-[140px] ${
                      isHolyHoliday
                        ? 'bg-rose-100 text-rose-900 border-rose-300'
                        : 'bg-purple-100 text-purple-900 border-purple-300'
                    }`}
                    title={holyDayTitle || 'Semana Santa'}
                  >
                    ✝️ {holyDayTitle || 'Semana Santa'}
                  </span>
                )}

                {specialNotice && isCurrentMonth && !isHolyWeek && (
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded border truncate max-w-[130px] ${
                      specialNotice.includes('teoría')
                        ? 'text-amber-900 bg-amber-100 border-amber-300'
                        : 'text-rose-700 bg-rose-50 border-rose-200'
                    }`}
                  >
                    {specialNotice.includes('teoría') ? 'Solo teoría' : 'Festivo'}
                  </span>
                )}
              </div>

              {/* Special notice full banner if holiday / no sessions */}
              {specialNotice && isCurrentMonth && daySessions.length === 0 && (
                <div
                  className={`my-auto py-1.5 px-2 rounded-lg text-[10px] font-semibold text-center border ${
                    isHolyWeek
                      ? 'bg-purple-100/70 border-purple-200 text-purple-950'
                      : specialNotice.includes('teoría')
                      ? 'bg-amber-100/70 border-amber-300 text-amber-950'
                      : 'bg-rose-50/80 border-rose-200/70 text-rose-700'
                  }`}
                >
                  {specialNotice}
                  {specialNotice.includes('teoría') && (
                    <span className="block text-[9px] font-normal text-amber-800 mt-0.5">
                      Las prácticas comienzan el 22 de febrero
                    </span>
                  )}
                  {isHolyWeek && (
                    <span className="block text-[9px] font-normal text-purple-800 mt-0.5">
                      Periodo no lectivo universitario
                    </span>
                  )}
                </div>
              )}

              {/* Sessions container */}
              <div className="space-y-2 flex-1">
                {daySessions.map((session) => {
                  const isPractice = session.activityType === 'practica';
                  const isExam = session.activityType === 'examen';

                  return (
                    <div
                      key={session.id}
                      onClick={() => onSelectSession(session)}
                      className={`w-full text-left p-2 rounded-xl border-2 transition-all hover:scale-[1.01] hover:shadow-xs group cursor-pointer ${
                        isExam
                          ? 'bg-amber-100/90 hover:bg-amber-200/90 border-amber-400 text-amber-950 border-l-4 border-l-amber-600'
                          : isPractice
                          ? 'bg-sky-50 hover:bg-sky-100/90 border-sky-300 text-sky-950 border-l-4 border-l-sky-600 shadow-2xs'
                          : 'bg-purple-50 hover:bg-purple-100/90 border-purple-300 text-purple-950 border-l-4 border-l-purple-600 shadow-2xs'
                      }`}
                    >
                      {/* Top row: Shift Time & Room */}
                      <div className="flex items-center justify-between gap-1 text-[10px] font-semibold">
                        <span className="flex items-center gap-0.5 font-bold">
                          <Clock className="w-3 h-3 text-slate-500 shrink-0" />
                          {session.startTime} - {session.endTime}
                        </span>
                        <span
                          className={`px-1.5 py-0.5 rounded text-[9px] font-black border ${
                            isPractice
                              ? 'bg-sky-200 text-sky-950 border-sky-400'
                              : isExam
                              ? 'bg-amber-300 text-amber-950 border-amber-400'
                              : 'bg-purple-200 text-purple-950 border-purple-400'
                          }`}
                        >
                          {isPractice ? '🔬 LAB L-5/6' : isExam ? '📝 EXAMEN' : '📖 AULA S3'}
                        </span>
                      </div>

                      {/* Middle row: Activity & Subgroup */}
                      <div className="mt-1 flex items-center justify-between gap-1">
                        <span className="font-black text-xs text-slate-900 truncate">
                          {session.activityCode}
                        </span>
                        <span className="px-1.5 py-0.2 rounded-full text-[10px] font-black bg-lime-400 text-slate-950 border border-lime-600/50">
                          Gr. {session.groupNumber}
                        </span>
                      </div>

                      {/* Topic Title */}
                      <div className="text-[11px] text-slate-700 line-clamp-2 mt-0.5 font-medium leading-snug">
                        {session.title}
                      </div>

                      {/* Bottom row: Professor Responsible + Direct Mail Action */}
                      <div className="mt-1.5 pt-1.5 border-t border-black/5 flex items-center justify-between gap-1 text-[11px] text-slate-700">
                        <div className="flex items-center gap-1 font-semibold truncate">
                          <User className="w-3 h-3 text-slate-500 shrink-0" />
                          <span className="truncate group-hover:text-amber-900">
                            {session.professor || 'Sin asignar'}
                          </span>
                        </div>

                        {session.professorEmail && (
                          <a
                            href={`mailto:${session.professorEmail}?subject=${encodeURIComponent(
                              `Consulta Bioquímica Médica - Subgrupo ${session.groupNumber} (${session.activityCode})`
                            )}`}
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-0.5 p-1 rounded-md text-amber-900 hover:text-black hover:bg-amber-200 transition-colors shrink-0"
                            title={`Enviar correo directo a ${session.professor} (${session.professorEmail})`}
                          >
                            <Mail className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom day indicator if empty weekday in current month */}
              {isCurrentMonth && daySessions.length === 0 && !specialNotice && (
                <div className="text-[10px] text-slate-400 text-center py-1">
                  Sin prácticas en laboratorio
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Month Footer Legend & Details */}
      <div className="p-4 bg-amber-50/60 border-t border-amber-200 flex items-center justify-between flex-wrap gap-3 text-xs text-slate-700">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-md bg-sky-100 border-2 border-sky-400 inline-block"></span>
            <span className="font-bold text-sky-950">Prácticas (LAB L-5/6)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-md bg-purple-100 border-2 border-purple-400 inline-block"></span>
            <span className="font-bold text-purple-950">Seminarios (AULA S3)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-900 border border-purple-300">
              ✝️ Semana Santa ({holyWeek.dateRangeLabel})
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-md bg-lime-400 border border-lime-600 inline-block"></span>
            <span>Subgrupos 1 al 15 (Grupos A y B)</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-amber-900 font-medium">
          <Mail className="w-3.5 h-3.5 text-amber-700" />
          <span>Haz clic en cualquier sesión para ver los detalles completos o reasignar profesorado.</span>
        </div>
      </div>
    </div>
  );
};
