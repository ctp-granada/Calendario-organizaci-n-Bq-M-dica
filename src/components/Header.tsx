import React from 'react';
import {
  Download,
  Printer,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  Table as TableIcon,
  CalendarDays,
  ShieldCheck,
  Lock,
  Clock,
  Sparkles,
} from 'lucide-react';
import { COURSE_INFO } from '../data/curriculumData';

interface HeaderProps {
  academicYear: number;
  onYearChange: (year: number) => void;
  activeView: 'month' | 'matrix';
  onViewChange: (view: 'month' | 'matrix') => void;
  onExportICS: () => void;
  onPrint: () => void;
  coordinatorEmail?: string | null;
  onOpenCoordinator: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  academicYear,
  onYearChange,
  activeView,
  onViewChange,
  onExportICS,
  onPrint,
  coordinatorEmail,
  onOpenCoordinator,
}) => {
  const yearsOptions = [2024, 2025, 2026, 2027, 2028];

  return (
    <header className="bg-white border-b border-amber-200 sticky top-0 z-30 shadow-xs">
      {/* Top Gold Medicine Accent Bar */}
      <div className="h-1 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Title & Subject Header */}
          <div className="flex items-start gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-500 text-amber-950 flex items-center justify-center shadow-xs shrink-0 mt-0.5 border border-amber-400/40">
              <GraduationCap className="w-6 h-6 text-amber-950" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 font-['Outfit']">
                  Bioquímica Médica • Prácticas y Seminarios
                </h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
                  <Sparkles className="w-3 h-3 text-amber-600" />
                  {COURSE_INFO.degree} • {COURSE_INFO.groups}
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                Facultad de Medicina • Universidad de Granada • 2º Semestre (Febrero - Mayo)
              </p>
            </div>
          </div>

          {/* Controls: Year, Export ICS, Print, Coordinator */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Year Selector */}
            <div className="flex items-center bg-amber-50/70 p-1 rounded-xl border border-amber-200 text-xs">
              <button
                type="button"
                id="btn-prev-year"
                onClick={() => onYearChange(academicYear - 1)}
                className="p-1 text-slate-600 hover:text-slate-900 hover:bg-white rounded-lg transition-colors"
                title="Curso anterior"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>

              <div className="px-2 text-center">
                <span className="text-[9px] uppercase font-bold text-amber-800 block leading-none">
                  Curso
                </span>
                <select
                  id="select-academic-year"
                  value={academicYear}
                  onChange={(e) => onYearChange(Number(e.target.value))}
                  className="bg-transparent font-bold text-xs text-slate-900 focus:outline-hidden cursor-pointer"
                >
                  {yearsOptions.map((y) => (
                    <option key={y} value={y}>
                      {y} - {y + 1}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                id="btn-next-year"
                onClick={() => onYearChange(academicYear + 1)}
                className="p-1 text-slate-600 hover:text-slate-900 hover:bg-white rounded-lg transition-colors"
                title="Curso siguiente"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Export & Print */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                id="btn-export-ics"
                onClick={onExportICS}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-amber-500 hover:bg-amber-600 text-slate-950 transition-colors shadow-xs border border-amber-600/30"
                title="Descargar para añadir a Google Calendar, Apple Calendar u Outlook"
              >
                <Download className="w-3.5 h-3.5 text-slate-950" />
                <span className="font-bold">Añadir a mi calendario (.ics)</span>
              </button>

              <button
                type="button"
                id="btn-print-view"
                onClick={onPrint}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium bg-white hover:bg-amber-50 text-slate-700 border border-slate-200 transition-colors"
                title="Imprimir o guardar en PDF"
              >
                <Printer className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden sm:inline">Imprimir / PDF</span>
              </button>

              <button
                type="button"
                id="btn-open-coordinator"
                onClick={onOpenCoordinator}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-colors border ${
                  coordinatorEmail
                    ? 'bg-amber-100 text-amber-950 border-amber-300 hover:bg-amber-200 shadow-2xs'
                    : 'bg-slate-100 text-slate-700 hover:text-slate-900 hover:bg-slate-200 border-slate-200'
                }`}
                title="Acceso para organizar y asignar profesorado y turnos"
              >
                {coordinatorEmail ? (
                  <>
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                    <span>Coordinación</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5 text-slate-500" />
                    <span className="hidden sm:inline">Organizar / Coordinar</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* View Switcher Tabs and Shift Exclusivity Legend */}
        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between flex-wrap gap-2">
          <div className="inline-flex p-1 bg-amber-50/70 rounded-xl border border-amber-200/80 text-xs font-medium">
            <button
              type="button"
              id="tab-view-month"
              onClick={() => onViewChange('month')}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all ${
                activeView === 'month'
                  ? 'bg-white text-amber-950 shadow-xs font-bold border border-amber-300'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <CalendarDays className="w-3.5 h-3.5 text-amber-600" />
              <span>Vista Mensual (Feb - May)</span>
            </button>

            <button
              type="button"
              id="tab-view-matrix"
              onClick={() => onViewChange('matrix')}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all ${
                activeView === 'matrix'
                  ? 'bg-white text-slate-900 shadow-xs font-bold border border-amber-300'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <TableIcon className="w-3.5 h-3.5 text-sky-600" />
              <span>Cronograma Oficial Completo</span>
            </button>
          </div>

          {/* Time slot reference */}
          <div className="flex items-center gap-2 text-xs flex-wrap">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-sky-50 border border-sky-200 text-sky-950 font-medium">
              <Clock className="w-3 h-3 text-sky-600" />
              <span>
                <strong>Turno Mañana:</strong> 8:30 - 11:00 h
              </span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-50 border border-purple-200 text-purple-950 font-medium">
              <Clock className="w-3 h-3 text-purple-600" />
              <span>
                <strong>Turno Tarde:</strong> 16:00 - 18:30 h
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
