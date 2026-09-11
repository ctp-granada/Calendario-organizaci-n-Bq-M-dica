import React from 'react';
import { Printer, ExternalLink, X, AlertTriangle, FileText } from 'lucide-react';
import { COURSE_INFO } from '../data/curriculumData';

interface PrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  academicYear: number;
  selectedGroup: string;
  generationDateStr: string;
}

export const PrintModal: React.FC<PrintModalProps> = ({
  isOpen,
  onClose,
  academicYear,
  selectedGroup,
  generationDateStr,
}) => {
  if (!isOpen) return null;

  const handleDirectPrint = () => {
    try {
      window.print();
    } catch (e) {
      console.warn('Direct print failed, likely due to iframe sandbox', e);
    }
  };

  const standaloneUrl = window.location.href;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-amber-300 overflow-hidden my-auto animate-in fade-in zoom-in duration-150">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 text-amber-950 flex items-center justify-between border-b border-amber-400">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-950 text-amber-400 flex items-center justify-center shadow-xs">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold font-['Outfit'] text-slate-950">
                Imprimir o Guardar en PDF
              </h2>
              <p className="text-xs text-amber-950/80 font-medium">
                Bioquímica Médica • Facultad de Medicina (UGR)
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

        {/* Content */}
        <div className="p-5 space-y-4 text-xs">
          {/* Iframe Notice */}
          <div className="p-3.5 bg-amber-50 border border-amber-200 text-amber-950 rounded-xl space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-amber-900">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Aviso para impresión desde PRADO o marco web:</span>
            </div>
            <p className="text-slate-700 leading-relaxed">
              Si la aplicación está dentro de un marco o previsualización de navegador, pulsa el botón verde para <strong>abrirla en una pestaña independiente</strong> y así generar el PDF con máxima nitidez.
            </p>
          </div>

          {/* Document Summary */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-slate-800">
              <FileText className="w-4 h-4 text-amber-600" />
              <span>Documento preparado para impresión oficial:</span>
            </div>
            <ul className="space-y-1 text-slate-600 pl-5 list-disc">
              <li>
                <strong>Asignatura:</strong> {COURSE_INFO.subject} ({COURSE_INFO.degree})
              </li>
              <li>
                <strong>Curso y Semestre:</strong> {academicYear} - {academicYear + 1} (2º Semestre: Febrero a Mayo)
              </li>
              <li>
                <strong>Filtro de grupo:</strong>{' '}
                {selectedGroup ? `Subgrupo ${selectedGroup}` : 'Todos los subgrupos (1 al 15)'}
              </li>
              <li>
                <strong>Fecha de consulta:</strong> {generationDateStr}
              </li>
            </ul>
          </div>

          {/* Recommended Action: Open standalone and print */}
          <div className="space-y-2.5 pt-1">
            <a
              href={standaloneUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                setTimeout(() => {
                  onClose();
                }, 800);
              }}
              className="w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-2 text-center border border-amber-600/30"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Abrir en Pestaña Nueva para Imprimir / PDF (Recomendado)</span>
            </a>

            <button
              type="button"
              onClick={handleDirectPrint}
              className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-semibold text-xs transition-colors flex items-center justify-center gap-2"
            >
              <Printer className="w-4 h-4 text-slate-500" />
              <span>Intentar imprimir directamente en esta ventana</span>
            </button>
          </div>

          {/* Keyboard tip */}
          <div className="text-center text-[11px] text-slate-500 pt-1">
            💡 Consejo: También puedes pulsar{' '}
            <kbd className="px-1.5 py-0.5 bg-slate-200 border border-slate-300 rounded font-mono font-bold text-slate-800">
              Ctrl + P
            </kbd>{' '}
            (o{' '}
            <kbd className="px-1.5 py-0.5 bg-slate-200 border border-slate-300 rounded font-mono font-bold text-slate-800">
              ⌘ + P
            </kbd>{' '}
            en Mac).
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
