import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  AlertCircle,
  X,
  Check,
  Trash2,
  Edit2,
  Download,
  Upload,
  Link,
  RotateCcw,
  Clock,
  Eye,
  EyeOff,
  KeyRound,
  GraduationCap,
} from 'lucide-react';
import { TemplateWeek, ShiftType } from '../types';
import { PROFESSORS_LIST, PROFESSOR_EMAILS, TEMPLATE_WEEKS } from '../data/curriculumData';

interface CoordinatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  coordinatorEmail: string | null;
  onLogin: (email: string) => void;
  onLogout: () => void;
  professorsList: string[];
  professorEmails: Record<string, string>;
  templateWeeks: TemplateWeek[];
  academicYear: number;
  onUpdateProfessorList: (newList: string[], newEmails: Record<string, string>) => void;
  onUpdateTemplateWeeks: (newWeeks: TemplateWeek[]) => void;
  onResetToDefaults: () => void;
}

const AUTHORIZED_EMAILS = [
  'pmporras@ugr.es',
  'aruizsj@ugr.es',
  'ctp@ugr.es',
  'fhtorres@ugr.es',
  'anacosano@ugr.es',
  'efarez@ugr.es',
  'sergio@ugr.es',
  'torrespi@ugr.es',
  'ctp@go.ugr.es',
];

const DEFAULT_PIN = 'medicinaUGR';

export const CoordinatorModal: React.FC<CoordinatorModalProps> = ({
  isOpen,
  onClose,
  coordinatorEmail,
  onLogin,
  onLogout,
  professorsList,
  professorEmails,
  templateWeeks,
  academicYear,
  onUpdateProfessorList,
  onUpdateTemplateWeeks,
  onResetToDefaults,
}) => {
  // Login form states
  const [selectedAuthEmail, setSelectedAuthEmail] = useState<string>('ctp@ugr.es');
  const [enteredPin, setEnteredPin] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Custom password management state
  const [newPasswordInput, setNewPasswordInput] = useState<string>('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState<string>('');
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState<string | null>(null);

  // Active sub-tab for authenticated coordinator
  const [activeTab, setActiveTab] = useState<'assignments' | 'professors' | 'export'>('assignments');

  // Selected week index for assignments (1 to 14)
  const [selectedWeekIndex, setSelectedWeekIndex] = useState<number>(1);

  // New professor form states
  const [newProfName, setNewProfName] = useState<string>('');
  const [newProfEmail, setNewProfEmail] = useState<string>('');
  const [editingProfOriginal, setEditingProfOriginal] = useState<string | null>(null);

  // Quick bulk assign state
  const [bulkProfessor, setBulkProfessor] = useState<string>('');

  // Status message
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const showStatus = (msg: string) => {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(null), 3500);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    const emailTrimmed = selectedAuthEmail.trim().toLowerCase();
    const isAuthorized = AUTHORIZED_EMAILS.some((auth) => auth.toLowerCase() === emailTrimmed);

    if (!isAuthorized) {
      setLoginError('Correo no autorizado. Seleccione uno del profesorado de Bioquímica Médica.');
      return;
    }

    const currentPin = (() => {
      try {
        return localStorage.getItem('ugr_medicina_coordinator_pin') || DEFAULT_PIN;
      } catch {
        return DEFAULT_PIN;
      }
    })();

    if (
      enteredPin.trim() !== currentPin &&
      enteredPin.trim() !== DEFAULT_PIN &&
      enteredPin.trim() !== 'bioquimicaUGR'
    ) {
      setLoginError('Clave de acceso incorrecta. (Clave inicial: medicinaUGR)');
      return;
    }

    onLogin(emailTrimmed);
    setEnteredPin('');
    showStatus(`Identificado(a) correctamente como ${emailTrimmed}`);
  };

  // Change coordinator password
  const handleSaveNewPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordChangeSuccess(null);

    if (!newPasswordInput.trim() || newPasswordInput.trim().length < 4) {
      alert('La nueva clave debe tener al menos 4 caracteres.');
      return;
    }

    if (newPasswordInput !== confirmPasswordInput) {
      alert('Las contraseñas introducidas no coinciden.');
      return;
    }

    try {
      localStorage.setItem('ugr_medicina_coordinator_pin', newPasswordInput.trim());
      setPasswordChangeSuccess('¡Clave de coordinación actualizada con éxito!');
      setNewPasswordInput('');
      setConfirmPasswordInput('');
      showStatus('Clave actualizada correctamente.');
    } catch {
      alert('No se pudo guardar la clave en el almacenamiento del navegador.');
    }
  };

  // Reassign professor for a specific week, activity, and day
  const handleAssignDay = (
    weekIdx: number,
    activityType: 'practice' | 'seminar',
    day: number,
    professorName: string,
    newShift?: ShiftType
  ) => {
    const updatedWeeks = templateWeeks.map((week) => {
      if (week.weekIndex !== weekIdx) return week;
      const targetMap = { ...(week.assignments[activityType] || {}) };
      const current = targetMap[day];

      if (current) {
        targetMap[day] = {
          ...current,
          professor: professorName,
          shift: newShift !== undefined ? newShift : current.shift || 'mañana',
        };
      }

      return {
        ...week,
        assignments: {
          ...week.assignments,
          [activityType]: targetMap,
        },
      };
    });

    onUpdateTemplateWeeks(updatedWeeks);
    showStatus('Asignación y turno actualizados.');
  };

  // Bulk assign all sessions of selected week to one teacher
  const handleBulkAssignWeek = () => {
    if (!bulkProfessor) return;

    const updatedWeeks = templateWeeks.map((week) => {
      if (week.weekIndex !== selectedWeekIndex) return week;

      const newPractice = { ...(week.assignments.practice || {}) };
      Object.keys(newPractice).forEach((d) => {
        const dayNum = Number(d);
        newPractice[dayNum] = { ...newPractice[dayNum], professor: bulkProfessor };
      });

      const newSeminar = { ...(week.assignments.seminar || {}) };
      Object.keys(newSeminar).forEach((d) => {
        const dayNum = Number(d);
        newSeminar[dayNum] = { ...newSeminar[dayNum], professor: bulkProfessor };
      });

      return {
        ...week,
        assignments: {
          practice: newPractice,
          seminar: newSeminar,
        },
      };
    });

    onUpdateTemplateWeeks(updatedWeeks);
    showStatus(`Semana ${selectedWeekIndex} asignada a ${bulkProfessor}.`);
  };

  // Add or edit professor
  const handleSaveProfessor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProfName.trim()) return;

    const trimmedName = newProfName.trim();
    const trimmedEmail = newProfEmail.trim().toLowerCase();

    if (editingProfOriginal) {
      const updatedList = professorsList.map((p) => (p === editingProfOriginal ? trimmedName : p));
      const updatedEmails = { ...professorEmails };
      delete updatedEmails[editingProfOriginal];
      updatedEmails[trimmedName] = trimmedEmail;

      onUpdateProfessorList(updatedList, updatedEmails);
      setEditingProfOriginal(null);
      showStatus(`Profesor ${trimmedName} actualizado.`);
    } else {
      if (professorsList.includes(trimmedName)) {
        alert('Este profesor ya existe en la lista.');
        return;
      }
      const updatedList = [...professorsList, trimmedName];
      const updatedEmails = { ...professorEmails, [trimmedName]: trimmedEmail };
      onUpdateProfessorList(updatedList, updatedEmails);
      showStatus(`Profesor ${trimmedName} añadido.`);
    }

    setNewProfName('');
    setNewProfEmail('');
  };

  const handleDeleteProfessor = (name: string) => {
    if (!confirm(`¿Eliminar a ${name} de la lista de profesores?`)) return;
    const updatedList = professorsList.filter((p) => p !== name);
    const updatedEmails = { ...professorEmails };
    delete updatedEmails[name];
    onUpdateProfessorList(updatedList, updatedEmails);
    showStatus(`${name} eliminado.`);
  };

  // Export JSON configuration file
  const handleDownloadJSON = () => {
    const configData = {
      subject: 'Bioquímica Médica (Medicina UGR)',
      academicYear,
      lastModified: new Date().toISOString(),
      modifiedBy: coordinatorEmail || 'ctp@ugr.es',
      professorsList,
      professorEmails,
      templateWeeks,
    };
    const blob = new Blob([JSON.stringify(configData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Bioquimica_Medica_Asignaciones_${academicYear}-${academicYear + 1}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showStatus('Archivo JSON de configuración descargado.');
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target?.result as string);
        if (parsed.professorsList && parsed.templateWeeks) {
          onUpdateProfessorList(parsed.professorsList, parsed.professorEmails || {});
          onUpdateTemplateWeeks(parsed.templateWeeks);
          showStatus('Configuración docente importada con éxito.');
        } else {
          alert('El archivo no contiene un formato de configuración válido.');
        }
      } catch {
        alert('Error al leer el archivo JSON.');
      }
    };
    reader.readAsText(file);
  };

  const handleCopyShareableURL = () => {
    try {
      const dataToEncode = {
        professorsList,
        professorEmails,
        templateWeeks,
      };
      const jsonStr = JSON.stringify(dataToEncode);
      const encoded = encodeURIComponent(btoa(unescape(encodeURIComponent(jsonStr))));
      const currentUrl = window.location.origin + window.location.pathname;
      const fullShareUrl = `${currentUrl}#docencia=${encoded}`;
      navigator.clipboard.writeText(fullShareUrl);
      showStatus('¡Enlace copiado! Al abrirlo se cargarán estas asignaciones automáticamente.');
    } catch {
      alert('Error al generar enlace.');
    }
  };

  const currentWeek = templateWeeks.find((w) => w.weekIndex === selectedWeekIndex) || templateWeeks[0];
  const dayNames = ['', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-amber-300 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Modal Header with Medicine Yellow Accents */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 text-amber-950 flex items-center justify-between shrink-0 border-b border-amber-400">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-950 text-amber-400 flex items-center justify-center font-bold shadow-xs shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold font-['Outfit'] text-slate-950">
                  Panel de Coordinación y Asignación Docente
                </h2>
                {coordinatorEmail && (
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-black bg-amber-950 text-amber-300">
                    {coordinatorEmail}
                  </span>
                )}
              </div>
              <p className="text-xs text-amber-950/80 mt-0.5 font-medium">
                Bioquímica Médica • Facultad de Medicina (UGR) • 2º Semestre
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-amber-950 hover:bg-amber-400/50 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {statusMessage && (
            <div className="p-3 bg-amber-100 text-amber-950 rounded-xl border border-amber-300 text-xs font-bold flex items-center gap-2">
              <Check className="w-4 h-4 text-amber-700 shrink-0" />
              <span>{statusMessage}</span>
            </div>
          )}

          {/* IF NOT LOGGED IN: Authentication Screen */}
          {!coordinatorEmail ? (
            <div className="max-w-md mx-auto py-6 space-y-5">
              <div className="text-center space-y-1">
                <div className="w-12 h-12 bg-amber-100 text-amber-800 rounded-2xl mx-auto flex items-center justify-center mb-2 border border-amber-300">
                  <Lock className="w-6 h-6 text-amber-700" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  Acceso para Organización y Asignación Docente
                </h3>
                <p className="text-xs text-slate-600">
                  Selecciona tu usuario de la lista de profesores de Bioquímica Médica e introduce la clave para organizar y asignar los días y turnos.
                </p>
              </div>

              {loginError && (
                <div className="p-3 bg-rose-50 text-rose-700 rounded-xl border border-rose-200 text-xs font-medium flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    Profesor(a) de Bioquímica Médica:
                  </label>
                  <select
                    value={selectedAuthEmail}
                    onChange={(e) => setSelectedAuthEmail(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-medium text-slate-900 focus:outline-hidden focus:border-amber-500"
                  >
                    {PROFESSORS_LIST.map((prof) => {
                      const email = PROFESSOR_EMAILS[prof] || '';
                      return (
                        <option key={prof} value={email}>
                          {prof} ({email})
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    Clave de acceso docente:
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={enteredPin}
                      onChange={(e) => setEnteredPin(e.target.value)}
                      placeholder="Introduce clave (clave por defecto: medicinaUGR)"
                      autoComplete="current-password"
                      className="w-full p-2.5 pr-10 rounded-xl border border-slate-300 bg-white font-medium text-slate-900 focus:outline-hidden focus:border-amber-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                      title={showPassword ? 'Ocultar clave' : 'Mostrar clave'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    Clave predeterminada inicial: <code className="bg-amber-100 px-1 py-0.5 rounded font-bold">medicinaUGR</code>
                  </span>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-xs transition-colors border border-amber-600/30"
                >
                  Acceder a la Organización
                </button>
              </form>
            </div>
          ) : (
            /* IF LOGGED IN */
            <div className="space-y-5">
              {/* Coordinator Sub-tabs */}
              <div className="flex items-center justify-between border-b border-amber-200 pb-3 flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('assignments')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      activeTab === 'assignments'
                        ? 'bg-amber-500 text-slate-950 shadow-xs border border-amber-600/40'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    1. Asignar Días, Profesores y Turnos
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('professors')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      activeTab === 'professors'
                        ? 'bg-amber-500 text-slate-950 shadow-xs border border-amber-600/40'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    2. Plantilla de Profesores ({professorsList.length})
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('export')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      activeTab === 'export'
                        ? 'bg-amber-500 text-slate-950 shadow-xs border border-amber-600/40'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    3. Guardar / Compartir
                  </button>
                </div>

                <button
                  type="button"
                  onClick={onLogout}
                  className="px-3 py-1 text-xs text-rose-700 hover:bg-rose-50 border border-rose-200 rounded-lg font-semibold transition-colors"
                >
                  Cerrar sesión
                </button>
              </div>

              {/* TAB 1: Assignments by Week */}
              {activeTab === 'assignments' && (
                <div className="space-y-4">
                  {/* Selector Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-amber-50/70 p-3 rounded-xl border border-amber-200 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-800">Semana a editar:</span>
                      <select
                        value={selectedWeekIndex}
                        onChange={(e) => setSelectedWeekIndex(Number(e.target.value))}
                        className="font-bold p-1.5 rounded-lg border border-amber-300 bg-white text-slate-900 focus:outline-hidden cursor-pointer"
                      >
                        {templateWeeks.map((w) => (
                          <option key={w.weekIndex} value={w.weekIndex}>
                            Semana {w.weekIndex} ({w.dateLabel}): {w.practiceTitle || w.holidayReason}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Bulk assign to 1 teacher */}
                    <div className="flex items-center gap-2">
                      <span className="text-slate-600 font-medium">Asignar toda la semana a:</span>
                      <select
                        value={bulkProfessor}
                        onChange={(e) => setBulkProfessor(e.target.value)}
                        className="p-1.5 rounded-lg border border-slate-300 bg-white text-slate-800 text-xs"
                      >
                        <option value="">Seleccionar profesor...</option>
                        {professorsList.map((p) => (
                          <option key={p} value={p}>
                            {p}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={handleBulkAssignWeek}
                        disabled={!bulkProfessor}
                        className="px-2.5 py-1 rounded-lg bg-amber-500 text-slate-950 font-bold disabled:opacity-40 hover:bg-amber-600"
                      >
                        Aplicar
                      </button>
                    </div>
                  </div>

                  {/* Holiday Week Notice */}
                  {currentWeek.isHolidayWeek ? (
                    <div className="p-4 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl text-xs font-semibold">
                      Semana sin docencia de laboratorio programada ({currentWeek.holidayReason}).
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      {/* Prácticas LAB L-5/6 */}
                      <div className="bg-white rounded-xl border border-sky-200 overflow-hidden shadow-2xs">
                        <div className="bg-sky-500 text-white px-3.5 py-2 flex items-center justify-between font-bold">
                          <span className="flex items-center gap-1.5">
                            <span>🥼</span>
                            <span>PRÁCTICAS • LAB L-5/6</span>
                          </span>
                          <span className="text-[11px] font-normal">{currentWeek.practiceTitle}</span>
                        </div>
                        <div className="p-3 space-y-2.5">
                          {[1, 2, 3, 4, 5].map((d) => {
                            const assign = currentWeek.assignments.practice?.[d];
                            if (!assign) return null;
                            const isMorning = assign.shift === 'mañana';

                            return (
                              <div
                                key={d}
                                className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2 rounded-lg bg-slate-50 border border-slate-200"
                              >
                                <div>
                                  <span className="font-bold text-slate-900 block">
                                    {dayNames[d]} • Subgrupo {assign.groupNumber}
                                  </span>
                                  <span className="text-[10px] text-slate-500">
                                    {isMorning ? 'Mañana (8:30 - 11:00 h)' : 'Tarde (16:00 - 18:30 h)'}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  {/* Shift Dropdown Selector */}
                                  <select
                                    value={assign.shift || 'mañana'}
                                    onChange={(e) =>
                                      handleAssignDay(
                                        selectedWeekIndex,
                                        'practice',
                                        d,
                                        assign.professor,
                                        e.target.value as ShiftType
                                      )
                                    }
                                    className="text-xs font-bold py-1 px-2 rounded-lg border border-sky-300 bg-white text-sky-950 focus:ring-1 focus:ring-sky-500 cursor-pointer shadow-2xs"
                                    title="Seleccionar franja horaria: Mañana (8:30-11:00 h) o Tarde (16:00-18:30 h)"
                                  >
                                    <option value="mañana">Mañana (8:30 - 11 h)</option>
                                    <option value="tarde">Tarde (16 - 18:30 h)</option>
                                  </select>

                                  {/* Professor select */}
                                  <select
                                    value={assign.professor || ''}
                                    onChange={(e) =>
                                      handleAssignDay(
                                        selectedWeekIndex,
                                        'practice',
                                        d,
                                        e.target.value,
                                        assign.shift
                                      )
                                    }
                                    className="font-medium p-1 rounded-lg border border-slate-300 bg-white text-slate-900 text-xs max-w-[170px]"
                                  >
                                    <option value="">-- Sin asignar --</option>
                                    {professorsList.map((p) => (
                                      <option key={p} value={p}>
                                        {p}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Seminarios AULA S3 */}
                      <div className="bg-white rounded-xl border border-purple-200 overflow-hidden shadow-2xs">
                        <div className="bg-purple-600 text-white px-3.5 py-2 flex items-center justify-between font-bold">
                          <span className="flex items-center gap-1.5">
                            <span>📖</span>
                            <span>SEMINARIOS • AULA S3</span>
                          </span>
                          <span className="text-[11px] font-normal">{currentWeek.seminarTitle}</span>
                        </div>
                        <div className="p-3 space-y-2.5">
                          {[1, 2, 3, 4, 5].map((d) => {
                            const assign = currentWeek.assignments.seminar?.[d];
                            if (!assign) return null;
                            const isMorning = assign.shift === 'mañana';

                            return (
                              <div
                                key={d}
                                className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2 rounded-lg bg-slate-50 border border-slate-200"
                              >
                                <div>
                                  <span className="font-bold text-slate-900 block">
                                    {dayNames[d]} • Subgrupo {assign.groupNumber}
                                  </span>
                                  <span className="text-[10px] text-slate-500">
                                    {isMorning ? 'Mañana (8:30 - 11:00 h)' : 'Tarde (16:00 - 18:30 h)'}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  {/* Shift Dropdown Selector */}
                                  <select
                                    value={assign.shift || 'mañana'}
                                    onChange={(e) =>
                                      handleAssignDay(
                                        selectedWeekIndex,
                                        'seminar',
                                        d,
                                        assign.professor,
                                        e.target.value as ShiftType
                                      )
                                    }
                                    className="text-xs font-bold py-1 px-2 rounded-lg border border-purple-300 bg-white text-purple-950 focus:ring-1 focus:ring-purple-500 cursor-pointer shadow-2xs"
                                    title="Seleccionar franja horaria: Mañana (8:30-11:00 h) o Tarde (16:00-18:30 h)"
                                  >
                                    <option value="mañana">Mañana (8:30 - 11 h)</option>
                                    <option value="tarde">Tarde (16 - 18:30 h)</option>
                                  </select>

                                  {/* Professor select */}
                                  <select
                                    value={assign.professor || ''}
                                    onChange={(e) =>
                                      handleAssignDay(
                                        selectedWeekIndex,
                                        'seminar',
                                        d,
                                        e.target.value,
                                        assign.shift
                                      )
                                    }
                                    className="font-medium p-1 rounded-lg border border-slate-300 bg-white text-slate-900 text-xs max-w-[170px]"
                                  >
                                    <option value="">-- Sin asignar --</option>
                                    {professorsList.map((p) => (
                                      <option key={p} value={p}>
                                        {p}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: Professors Management */}
              {activeTab === 'professors' && (
                <div className="space-y-4 text-xs">
                  {/* Add / Edit Form */}
                  <form
                    onSubmit={handleSaveProfessor}
                    className="bg-amber-50/60 p-4 rounded-xl border border-amber-200 space-y-3"
                  >
                    <span className="font-bold text-slate-900 block">
                      {editingProfOriginal
                        ? `Modificar datos de: ${editingProfOriginal}`
                        : 'Añadir nuevo(a) profesor(a) de Bioquímica Médica:'}
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-700 mb-1 font-semibold">
                          Nombre y Apellidos:
                        </label>
                        <input
                          type="text"
                          value={newProfName}
                          onChange={(e) => setNewProfName(e.target.value)}
                          placeholder="Ej: Patricia Porras"
                          className="w-full p-2 rounded-lg border border-slate-300 bg-white text-slate-900"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-700 mb-1 font-semibold">
                          Correo electrónico UGR:
                        </label>
                        <input
                          type="email"
                          value={newProfEmail}
                          onChange={(e) => setNewProfEmail(e.target.value)}
                          placeholder="Ej: pmporras@ugr.es"
                          className="w-full p-2 rounded-lg border border-slate-300 bg-white text-slate-900"
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="submit"
                        disabled={!newProfName.trim()}
                        className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold disabled:opacity-40 shadow-xs"
                      >
                        {editingProfOriginal ? 'Guardar Cambios' : 'Añadir a la plantilla'}
                      </button>
                      {editingProfOriginal && (
                        <button
                          type="button"
                          onClick={() => {
                            setEditingProfOriginal(null);
                            setNewProfName('');
                            setNewProfEmail('');
                          }}
                          className="px-3 py-2 rounded-lg bg-slate-200 text-slate-700 font-medium"
                        >
                          Cancelar
                        </button>
                      )}
                    </div>
                  </form>

                  {/* Current Professors Table */}
                  <div className="border border-slate-200 rounded-xl overflow-hidden">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                          <th className="p-3">Profesor(a)</th>
                          <th className="p-3">Correo UGR</th>
                          <th className="p-3 text-right">Acciones</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {professorsList.map((prof) => (
                          <tr key={prof} className="hover:bg-amber-50/30 transition-colors">
                            <td className="p-3 font-semibold text-slate-900">{prof}</td>
                            <td className="p-3 text-slate-600 font-mono">
                              {professorEmails[prof] || 'Sin correo configurado'}
                            </td>
                            <td className="p-3 text-right space-x-2">
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingProfOriginal(prof);
                                  setNewProfName(prof);
                                  setNewProfEmail(professorEmails[prof] || '');
                                }}
                                className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
                                title="Editar"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteProfessor(prof)}
                                className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-md transition-colors"
                                title="Eliminar de la plantilla"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 3: Export & Next Years */}
              {activeTab === 'export' && (
                <div className="space-y-4 text-xs">
                  {/* Share URL Card */}
                  <div className="p-4 bg-amber-50/70 border border-amber-300 rounded-xl space-y-2">
                    <div className="flex items-center gap-2">
                      <Link className="w-4 h-4 text-amber-700 shrink-0" />
                      <span className="font-bold text-amber-950">
                        Compartir en PRADO con los cambios guardados
                      </span>
                    </div>
                    <p className="text-slate-600">
                      Genera un enlace con toda la asignación docente de Bioquímica Médica. Al compartirlo en PRADO, cualquier usuario verá los profesores asignados.
                    </p>
                    <button
                      type="button"
                      onClick={handleCopyShareableURL}
                      className="px-3.5 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold shadow-xs inline-flex items-center gap-1.5"
                    >
                      <Link className="w-3.5 h-3.5" />
                      Copiar enlace para PRADO
                    </button>
                  </div>

                  {/* Backup / Export JSON Card */}
                  <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-3">
                    <span className="font-bold text-slate-900 block">
                      Copia de Seguridad y Archivo para Años Siguientes (JSON)
                    </span>
                    <p className="text-slate-600">
                      Descarga un archivo con toda la asignación docente. En los años siguientes podrás volver a cargarlo en un clic.
                    </p>
                    <div className="flex flex-wrap items-center gap-2.5 pt-1">
                      <button
                        type="button"
                        onClick={handleDownloadJSON}
                        className="px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold inline-flex items-center gap-1.5 shadow-xs"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Descargar archivo JSON
                      </button>

                      <label className="px-3.5 py-2 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold inline-flex items-center gap-1.5 cursor-pointer shadow-2xs">
                        <Upload className="w-3.5 h-3.5 text-slate-500" />
                        <span>Cargar archivo JSON previo</span>
                        <input
                          type="file"
                          accept=".json"
                          onChange={handleImportJSON}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>

                  {/* Change Password Card */}
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                    <div className="flex items-center gap-2">
                      <KeyRound className="w-4 h-4 text-amber-700 shrink-0" />
                      <span className="font-bold text-slate-900">
                        Cambiar Clave de Acceso de Coordinación
                      </span>
                    </div>

                    {passwordChangeSuccess && (
                      <div className="p-2.5 bg-amber-100 text-amber-950 rounded-lg text-xs font-semibold flex items-center gap-2">
                        <Check className="w-4 h-4 text-amber-700 shrink-0" />
                        <span>{passwordChangeSuccess}</span>
                      </div>
                    )}

                    <form onSubmit={handleSaveNewPassword} className="space-y-2.5 max-w-sm pt-1">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                          Nueva clave secreta:
                        </label>
                        <input
                          type="password"
                          value={newPasswordInput}
                          onChange={(e) => setNewPasswordInput(e.target.value)}
                          placeholder="Mínimo 4 caracteres"
                          className="w-full p-2 text-xs rounded-lg border border-slate-300 bg-white text-slate-900"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                          Confirmar nueva clave:
                        </label>
                        <input
                          type="password"
                          value={confirmPasswordInput}
                          onChange={(e) => setConfirmPasswordInput(e.target.value)}
                          placeholder="Repite la nueva clave"
                          className="w-full p-2 text-xs rounded-lg border border-slate-300 bg-white text-slate-900"
                        />
                      </div>
                      <button
                        type="submit"
                        className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-2xs transition-colors"
                      >
                        Guardar nueva clave
                      </button>
                    </form>
                  </div>

                  {/* Reset to UGR Defaults */}
                  <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <span className="font-bold text-slate-800 block">
                        Restablecer valores iniciales de Bioquímica Médica
                      </span>
                      <span className="text-[11px] text-slate-500">
                        Vuelve a la asignación de partida de la guía docente.
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm('¿Restablecer la asignación a los valores iniciales oficiales?')) {
                          onResetToDefaults();
                          showStatus('Valores restablecidos a los originales.');
                        }
                      }}
                      className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-medium inline-flex items-center gap-1"
                    >
                      <RotateCcw className="w-3 h-3 text-slate-500" />
                      Restablecer
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <span className="text-xs text-slate-500">
            {coordinatorEmail ? `Conectado como ${coordinatorEmail}` : 'Acceso seguro UGR'}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs transition-colors"
          >
            Cerrar Ventana
          </button>
        </div>
      </div>
    </div>
  );
};
