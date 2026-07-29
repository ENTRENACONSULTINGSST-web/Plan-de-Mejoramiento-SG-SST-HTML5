import React from 'react';
import { ShieldCheck, FileText, Sparkles, BarChart3, Code2, BookOpen, Download } from 'lucide-react';

interface HeaderProps {
  activeTab: 'matriz' | 'generador' | 'indicadores' | 'json_export' | 'normatividad';
  setActiveTab: (tab: 'matriz' | 'generador' | 'indicadores' | 'json_export' | 'normatividad') => void;
  empresaNombre: string;
  cumplimiento: number;
  onCargarEjemplo: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  empresaNombre,
  cumplimiento,
  onCargarEjemplo,
}) => {
  const getBadgeColor = (pct: number) => {
    if (pct < 60) return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
    if (pct <= 85) return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
    return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
  };

  const getStatusLabel = (pct: number) => {
    if (pct < 60) return 'CRÍTICO';
    if (pct <= 85) return 'MODERADAMENTE ACEPTABLE';
    return 'ACEPTABLE';
  };

  return (
    <header className="bg-slate-900 text-white shadow-sm border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-slate-800/80">
          {/* Main Title Block */}
          <div>
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight uppercase">
                Plan de Mejoramiento SG-SST
              </h1>
            </div>
            <p className="text-slate-400 text-xs sm:text-sm font-medium mt-0.5">
              Decreto 1072 de 2015 &amp; Res. 0312 de 2019
            </p>
          </div>

          {/* Company Info & Quick Actions */}
          <div className="flex flex-wrap items-center gap-3 md:text-right">
            {empresaNombre && (
              <div>
                <div className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                  Empresa Evaluada:
                </div>
                <div className="text-sm sm:text-base font-semibold text-slate-100 flex items-center md:justify-end gap-2">
                  <span>{empresaNombre}</span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded font-bold border ${getBadgeColor(
                      cumplimiento
                    )}`}
                  >
                    {cumplimiento}% ({getStatusLabel(cumplimiento)})
                  </span>
                </div>
              </div>
            )}

            <button
              onClick={onCargarEjemplo}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition flex items-center space-x-1.5 cursor-pointer ml-auto md:ml-2"
              title="Cargar plantilla de demostración predefinida"
            >
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              <span>Cargar Ejemplo</span>
            </button>
          </div>
        </div>

        {/* Minimalist Navigation Tabs */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pt-3 scrollbar-none">
          <button
            onClick={() => setActiveTab('generador')}
            className={`px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg transition flex items-center space-x-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'generador'
                ? 'bg-slate-800 text-white shadow-xs border border-slate-700 ring-1 ring-emerald-500/50'
                : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
            }`}
          >
            <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold flex items-center justify-center">1</span>
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Generar con IA (Consultor)</span>
          </button>

          <button
            onClick={() => setActiveTab('matriz')}
            className={`px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg transition flex items-center space-x-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'matriz'
                ? 'bg-slate-800 text-white shadow-xs border border-slate-700 ring-1 ring-emerald-500/50'
                : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
            }`}
          >
            <span className="w-4 h-4 rounded-full bg-slate-700 text-slate-300 text-[10px] font-bold flex items-center justify-center">2</span>
            <FileText className="w-4 h-4 text-emerald-400" />
            <span>Plan de Mejoramiento SG-SST</span>
          </button>

          <button
            onClick={() => setActiveTab('indicadores')}
            className={`px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg transition flex items-center space-x-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'indicadores'
                ? 'bg-slate-800 text-white shadow-xs border border-slate-700'
                : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
            }`}
          >
            <BarChart3 className="w-4 h-4 text-blue-400" />
            <span>Diagnóstico &amp; Métricas</span>
          </button>

          <button
            onClick={() => setActiveTab('json_export')}
            className={`px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg transition flex items-center space-x-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'json_export'
                ? 'bg-slate-800 text-white shadow-xs border border-slate-700'
                : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
            }`}
          >
            <Code2 className="w-4 h-4 text-amber-400" />
            <span>JSON &amp; Exportar / Imprimir</span>
          </button>

          <button
            onClick={() => setActiveTab('normatividad')}
            className={`px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg transition flex items-center space-x-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'normatividad'
                ? 'bg-slate-800 text-white shadow-xs border border-slate-700'
                : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-4 h-4 text-slate-400" />
            <span>Guía Normativa (0312 / 1072)</span>
          </button>
        </div>
      </div>
    </header>
  );
};
