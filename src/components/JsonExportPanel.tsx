import React, { useState } from 'react';
import { PlanMejoramientoSST } from '../types';
import { Copy, Check, Download, Printer, FileCode, FileSpreadsheet, Eye } from 'lucide-react';
import { PrintableDocument } from './PrintableDocument';

interface JsonExportPanelProps {
  plan: PlanMejoramientoSST;
}

export const JsonExportPanel: React.FC<JsonExportPanelProps> = ({ plan }) => {
  const [copied, setCopied] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'print' | 'json'>('print');

  const jsonString = JSON.stringify(plan, null, 2);

  const handleCopyJson = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadJson = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Plan_Mejoramiento_SST_${plan.empresaInfo.nombre.replace(/[^a-zA-Z0-0]/g, '_')}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportCsv = () => {
    // Generate CSV matrix matching Colombia SG-SST official template
    const headers = [
      'Numeral Estándar (Res 0312)',
      'Ciclo PHVA',
      'Hallazgo / No Conformidad',
      'Actividad a Desarrollar',
      'Responsable',
      'Evidencia Requerida',
      'Observaciones / Norma',
      'Recurso Asignado',
      'Ene (P/E)',
      'Feb (P/E)',
      'Mar (P/E)',
      'Abr (P/E)',
      'May (P/E)',
      'Jun (P/E)',
      'Jul (P/E)',
      'Ago (P/E)',
      'Sep (P/E)',
      'Oct (P/E)',
      'Nov (P/E)',
      'Dic (P/E)',
    ];

    const rows = plan.actividades.map((act) => {
      const getMonthStatus = (mKey: string) => {
        const m = (act.planeacionMensual as any)[mKey];
        if (!m) return '-';
        if (m.planeado && m.ejecutado) return 'P / E';
        if (m.planeado) return 'P';
        if (m.ejecutado) return 'E';
        return '-';
      };

      return [
        `"${act.numeralEstandar}"`,
        `"${act.phva}"`,
        `"${act.hallazgo.replace(/"/g, '""')}"`,
        `"${act.actividad.replace(/"/g, '""')}"`,
        `"${act.responsable.replace(/"/g, '""')}"`,
        `"${act.evidenciaRequerida.replace(/"/g, '""')}"`,
        `"${act.observaciones.replace(/"/g, '""')}"`,
        `"${act.recursoAsignado}"`,
        `"${getMonthStatus('ene')}"`,
        `"${getMonthStatus('feb')}"`,
        `"${getMonthStatus('mar')}"`,
        `"${getMonthStatus('abr')}"`,
        `"${getMonthStatus('may')}"`,
        `"${getMonthStatus('jun')}"`,
        `"${getMonthStatus('jul')}"`,
        `"${getMonthStatus('ago')}"`,
        `"${getMonthStatus('sep')}"`,
        `"${getMonthStatus('oct')}"`,
        `"${getMonthStatus('nov')}"`,
        `"${getMonthStatus('dic')}"`,
      ].join(';');
    });

    const csvContent = '\uFEFF' + [headers.join(';'), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Plan_Mejoramiento_SST_${plan.empresaInfo.nombre.replace(/[^a-zA-Z0-0]/g, '_')}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Selector Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => setActiveSubTab('print')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs transition flex items-center space-x-2 cursor-pointer ${
              activeSubTab === 'print'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Printer className="w-4 h-4" />
            <span>Documento Oficial Imprimible / PDF</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('json')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs transition flex items-center space-x-2 cursor-pointer ${
              activeSubTab === 'json'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <FileCode className="w-4 h-4" />
            <span>Estructura JSON Raw</span>
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleExportCsv}
            className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-medium text-xs rounded-xl shadow transition flex items-center space-x-1.5 cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Exportar CSV (Excel)</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadJson}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs rounded-xl shadow transition flex items-center space-x-1.5 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Descargar .JSON</span>
          </button>

          <button
            type="button"
            onClick={handleCopyJson}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium text-xs rounded-xl transition flex items-center space-x-1.5 cursor-pointer border border-slate-300"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? '¡Copiado!' : 'Copiar JSON'}</span>
          </button>
        </div>
      </div>

      {activeSubTab === 'print' ? (
        <PrintableDocument plan={plan} />
      ) : (
        /* JSON Syntax View */
        <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
          <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-2 text-xs text-slate-300">
              <span className="w-3 h-3 rounded-full bg-red-500 inline-block" />
              <span className="w-3 h-3 rounded-full bg-yellow-500 inline-block" />
              <span className="w-3 h-3 rounded-full bg-green-500 inline-block" />
              <span className="font-mono text-slate-400 ml-2">plan_de_mejoramiento_sst.json</span>
            </div>
            <span className="text-[11px] text-emerald-400 font-mono font-semibold">
              Esquema JSON Validado SG-SST Colombia
            </span>
          </div>

          <pre className="p-5 text-xs font-mono text-emerald-300/90 overflow-x-auto max-h-[600px] leading-relaxed select-all">
            {jsonString}
          </pre>
        </div>
      )}
    </div>
  );
};
