import React, { useState } from 'react';
import { ComputedSession, ShiftType } from '../types';
import {
  X,
  Calendar,
  Clock,
  MapPin,
  Users,
  Download,
  Mail,
  Copy,
  Check,
  GraduationCap,
  ShieldCheck,
  BookOpen,
} from 'lucide-react';
import { formatSpanishDate, generateICS } from '../utils/perpetualDateUtils';
import { PROFESSORS_LIST } from '../data/curriculumData';

interface SessionDetailModalProps {
  session: ComputedSession | null;
  onClose: () => void;
  academicYear: number;
  isCoordinator?: boolean;
  professorsList?: string[];
  onReassignSessionProfessor?: (
    weekIndex: number,
    activityType: 'practice' | 'seminar',
    groupNumber: number,
    newProfessor: string,
    newShift?: ShiftType
  ) => void;
}

export const SessionDetailModal: React.FC<SessionDetailModalProps> = ({
  session,
  onClose,
  academicYear,
  isCoordinator,
  professorsList = PROFESSORS_LIST,
  onReassignSessionProfessor,
}) => {
  const [copied, setCopied] = useState(false);
  const [isEditingTeacher, setIsEditingTeacher] = useState(false);
  const [selectedProf, setSelectedProf] = useState(session?.professor || '');
  const [selectedShift, setSelectedShift] = useState<ShiftType>(session?.shift || 'mañana');

  if (!session) return null;

  const handleCopyEmail = () => {
    if (session.professorEmail) {
      navigator.clipboard.writeText(session.professorEmail);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadSingleICS = () => {
    const icsContent = generateICS([session], `${academicYear}-${academicYear + 1}`);
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute(
      'download',
      `Bioquimica_Medica_${session.activityCode.replace(/\s+/g, '_')}_Subgr_${session.groupNumber}.ics`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const isMorning = session.shift === 'mañana';
  const isPractice = session.activityType === 'practica';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="bg-white rounded-2xl max-w-lg w-full border border-amber-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Top Header with Medicine Golden Yellow Accents */}
        <div className="p-6 border-b border-amber-200 bg-gradient-to-r from-amber-50 via-yellow-50/70 to-amber-100/50 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                  isPractice
                    ? 'bg-sky-100 text-sky-900 border-sky-300'
                    : 'bg-purple-100 text-purple-900 border-purple-300'
                }`}
              >
                {session.activityCode}
              </span>
              <span className="text-xs font-bold text-amber-950">
                Semana {session.weekIndex} • Curso {academicYear}-{academicYear + 1}
              </span>
              <span className="text-xs text-slate-500">• Medicina UGR</span>
            </div>
            <h3 className="text-xl font-bold text-slate-950 font-['Outfit']">
              {session.title}
            </h3>
          </div>

          <button
            type="button"
            id="btn-close-modal"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Info Cards */}
        <div className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Main Grid Details */}
          <div className="grid grid-cols-2 gap-3">
            {/* Date & Day */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-1">
                <Calendar className="w-3.5 h-3.5 text-amber-600" />
                <span>Fecha</span>
              </div>
              <p className="text-sm font-bold text-slate-900 capitalize">
                {session.dayName}, {formatSpanishDate(session.date, true)}
              </p>
            </div>

            {/* Time & Shift */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-1">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                <span>Horario y Turno</span>
              </div>
              <p className="text-sm font-bold text-slate-900">
                {session.timeRange}
              </p>
              <span className="text-[11px] text-amber-800 font-semibold capitalize block mt-0.5">
                Turno de {session.shift}
              </span>
            </div>

            {/* Location / Room */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-1">
                <MapPin className="w-3.5 h-3.5 text-amber-600" />
                <span>Ubicación</span>
              </div>
              <p className="text-sm font-bold text-slate-900">
                {session.room}
              </p>
              <span className="text-[11px] text-slate-500">
                Facultad de Medicina (UGR)
              </span>
            </div>

            {/* Subgroup */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-1">
                <Users className="w-3.5 h-3.5 text-amber-600" />
                <span>Subgrupo y Grupo</span>
              </div>
              <p className="text-sm font-bold text-slate-900">
                Subgrupo {session.groupNumber}
              </p>
              <span className="text-[11px] text-slate-600 font-semibold">
                Grupo {session.groupLetter} (Grado en Medicina)
              </span>
            </div>
          </div>

          {/* Theory Topic of the week */}
          {session.theoryTopic && (
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-slate-800 mb-1">
                <BookOpen className="w-3.5 h-3.5 text-amber-600" />
                <span>Temario Teórico de la Semana:</span>
              </div>
              <p className="text-slate-700 font-medium">{session.theoryTopic}</p>
            </div>
          )}

          {/* Professor Responsible Card with Direct Mail Action */}
          <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 flex flex-col justify-between gap-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-amber-500 text-amber-950 flex items-center justify-center font-black text-base shadow-xs shrink-0 border border-amber-600/30">
                  {session.professor.charAt(0) || '?'}
                </div>
                <div>
                  <span className="text-[11px] font-bold text-amber-900 uppercase tracking-wider block">
                    Profesor(a) Asignado(a)
                  </span>
                  <span className="text-base font-bold text-slate-900 block">
                    {session.professor || 'Sin asignar aún'}
                  </span>
                  {session.professorEmail && (
                    <span className="text-xs text-slate-700 font-mono flex items-center gap-1 mt-0.5">
                      <Mail className="w-3 h-3 text-amber-700" />
                      {session.professorEmail}
                    </span>
                  )}
                </div>
              </div>

              {/* Contact and Reassign Controls */}
              <div className="flex items-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-amber-200">
                {session.professorEmail && (
                  <>
                    <a
                      href={`mailto:${session.professorEmail}?subject=${encodeURIComponent(
                        `Consulta Bioquímica Médica - Subgrupo ${session.groupNumber} (${session.activityCode})`
                      )}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-2xs transition-colors"
                      title="Abrir cliente de correo"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Contactar</span>
                    </a>
                    <button
                      type="button"
                      onClick={handleCopyEmail}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-white hover:bg-amber-100 text-slate-800 border border-amber-300 transition-colors"
                      title="Copiar dirección de correo"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-700 font-bold">Copiado</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-slate-500" />
                          <span>Copiar</span>
                        </>
                      )}
                    </button>
                  </>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setIsEditingTeacher(!isEditingTeacher);
                    setSelectedProf(session.professor || '');
                    setSelectedShift(session.shift);
                  }}
                  className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-white text-amber-950 hover:bg-amber-100 border border-amber-300 transition-colors"
                  title="Asignar profesor o cambiar franja horaria"
                >
                  {isEditingTeacher ? 'Cerrar edición' : 'Asignar / Cambiar'}
                </button>
              </div>
            </div>

            {/* Quick Reassign / Turn Editor */}
            {isEditingTeacher && onReassignSessionProfessor && (
              <div className="pt-3 border-t border-amber-200 flex flex-col gap-3 bg-white p-3 rounded-lg">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="text-xs font-bold text-slate-900">
                    Profesor para este subgrupo:
                  </span>
                  <select
                    value={selectedProf}
                    onChange={(e) => setSelectedProf(e.target.value)}
                    className="text-xs p-1.5 rounded-lg border border-slate-300 bg-white font-semibold text-slate-900"
                  >
                    <option value="">-- Sin asignar --</option>
                    {professorsList.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="text-xs font-bold text-slate-900">
                    Turno:
                  </span>
                  <select
                    value={selectedShift}
                    onChange={(e) => setSelectedShift(e.target.value as ShiftType)}
                    className="text-xs p-1.5 rounded-lg border border-slate-300 bg-white font-semibold text-slate-900"
                  >
                    <option value="mañana">Mañana (8:30 - 11:00 h)</option>
                    <option value="tarde">Tarde (16:00 - 18:30 h)</option>
                  </select>
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      onReassignSessionProfessor(
                        session.weekIndex,
                        session.activityType === 'practica' ? 'practice' : 'seminar',
                        session.groupNumber,
                        selectedProf,
                        selectedShift
                      );
                      setIsEditingTeacher(false);
                    }}
                    className="px-4 py-1.5 rounded-lg bg-amber-500 text-slate-950 text-xs font-bold hover:bg-amber-600 shadow-2xs"
                  >
                    Guardar cambios
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Student guidance note */}
          <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-start gap-2">
            <GraduationCap className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p>
              <strong>Indicaciones para el alumnado:</strong> Es obligatorio el uso de bata blanca y cuaderno de prácticas en el Laboratorio L-5/6. Descarga con antelación el guión correspondiente en PRADO.
            </p>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleDownloadSingleICS}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-xs transition-colors border border-amber-600/30"
          >
            <Download className="w-3.5 h-3.5" />
            Añadir a mi Calendario (.ics)
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
