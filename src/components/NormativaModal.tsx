import React, { useState } from 'react';
import { ESTANDARES_RES_0312 } from '../data/standardsData';
import { BookOpen, ShieldCheck, FileText, AlertTriangle, Scale } from 'lucide-react';

export const NormativaModal: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'7' | '21' | '60' | 'sanciones'>('21');

  const filteredEstandares = ESTANDARES_RES_0312.filter((item) => {
    if (activeTab === '7') return item.aplicaA === '7';
    if (activeTab === '21') return item.aplicaA === '7' || item.aplicaA === '21';
    if (activeTab === '60') return true;
    return false;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
        <div className="flex items-center space-x-2 text-blue-700">
          <BookOpen className="w-5 h-5" />
          <h2 className="font-bold text-slate-900 text-lg">
            Compendio Normativo SG-SST Colombia
          </h2>
        </div>
        <p className="text-xs text-slate-600">
          Consulte la clasificación oficial de los Estándares Mínimos de la Resolución 0312 de 2019 y las obligaciones legales del Decreto 1072 de 2015.
        </p>

        {/* Tab Buttons */}
        <div className="flex items-center space-x-2 pt-2 border-t border-slate-100">
          <button
            onClick={() => setActiveTab('7')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              activeTab === '7'
                ? 'bg-blue-600 text-white shadow'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            7 Estándares (≤10 Trabaj. Riesgo I-III)
          </button>

          <button
            onClick={() => setActiveTab('21')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              activeTab === '21'
                ? 'bg-blue-600 text-white shadow'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            21 Estándares (11-50 Trabaj. Riesgo I-III)
          </button>

          <button
            onClick={() => setActiveTab('60')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              activeTab === '60'
                ? 'bg-blue-600 text-white shadow'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            60 Estándares (&gt;50 Trabaj. o Riesgo IV/V)
          </button>

          <button
            onClick={() => setActiveTab('sanciones')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              activeTab === 'sanciones'
                ? 'bg-red-600 text-white shadow'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Escala de Evaluación y Sanciones
          </button>
        </div>
      </div>

      {activeTab === 'sanciones' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-red-50 p-5 rounded-2xl border border-red-200 space-y-2">
            <span className="px-2 py-1 bg-red-600 text-white font-extrabold text-[10px] rounded uppercase">
              CRÍTICO (&lt; 60%)
            </span>
            <h3 className="font-bold text-red-950 text-sm">Obligaciones Inmediatas:</h3>
            <ul className="text-xs text-red-900 space-y-1 list-disc list-inside">
              <li>Realizar y remitir el Plan de Mejoramiento a la ARL en un plazo máximo de 3 meses.</li>
              <li>Reporte de avances a la ARL a los 6 meses.</li>
              <li>Visita de asistencia técnica obligatoria por parte de la ARL.</li>
            </ul>
          </div>

          <div className="bg-amber-50 p-5 rounded-2xl border border-amber-200 space-y-2">
            <span className="px-2 py-1 bg-amber-600 text-white font-extrabold text-[10px] rounded uppercase">
              MODERADAMENTE ACEPTABLE (60% - 85%)
            </span>
            <h3 className="font-bold text-amber-950 text-sm">Obligaciones:</h3>
            <ul className="text-xs text-amber-900 space-y-1 list-disc list-inside">
              <li>Diseñar Plan de Mejoramiento e incorporarlo en el Plan Anual de Trabajo.</li>
              <li>Reporte de avances a la ARL a los 6 meses.</li>
              <li>Disponible para inspección del Ministerio del Trabajo.</li>
            </ul>
          </div>

          <div className="bg-emerald-50 p-5 rounded-2xl border border-emerald-200 space-y-2">
            <span className="px-2 py-1 bg-emerald-600 text-white font-extrabold text-[10px] rounded uppercase">
              ACEPTABLE (&gt; 85%)
            </span>
            <h3 className="font-bold text-emerald-950 text-sm">Mantenimiento:</h3>
            <ul className="text-xs text-emerald-900 space-y-1 list-disc list-inside">
              <li>Mantener el Plan de Mejora Continua en la revisión por la dirección.</li>
              <li>Actualización anual de la autoevaluación en la plataforma del Ministerio.</li>
            </ul>
          </div>
        </div>
      ) : (
        /* Table of Standards */
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-4 bg-slate-900 text-white font-bold text-sm">
            Listado de Estándares Mínimos - Res. 0312 de 2019
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <th className="p-3 w-20 text-center border-r">Numeral</th>
                  <th className="p-3 w-24 text-center border-r">PHVA</th>
                  <th className="p-3 border-r">Nombre del Estándar</th>
                  <th className="p-3 w-56">Marco Legal Asociado (Dec. 1072/15)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredEstandares.map((std, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-center border-r bg-slate-50/50">
                      {std.numeral}
                    </td>
                    <td className="p-3 text-center border-r">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-200 text-slate-800">
                        {std.phva}
                      </span>
                    </td>
                    <td className="p-3 font-semibold text-slate-900 border-r">{std.nombre}</td>
                    <td className="p-3 text-slate-600 italic">{std.marcoLegal}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
