import React from 'react';
import { PlanMejoramientoSST } from '../types';
import { getDiagnosticoEjecutivo, getClasificacionLegal } from '../utils/sstUtils';
import {
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  PieChart,
  Layers,
  Clock,
  Building2,
  Briefcase,
  FileText,
  DollarSign,
  Cpu,
  Users,
} from 'lucide-react';

interface DashboardAnalyticsProps {
  plan: PlanMejoramientoSST;
}

export const DashboardAnalytics: React.FC<DashboardAnalyticsProps> = ({ plan }) => {
  const { empresaInfo, resumenEjecutivo, actividades } = plan;

  // Calculate PHVA Statistics
  const phvaStats = {
    PLANEAR: { total: 0, planeados: 0, ejecutados: 0 },
    HACER: { total: 0, planeados: 0, ejecutados: 0 },
    VERIFICAR: { total: 0, planeados: 0, ejecutados: 0 },
    ACTUAR: { total: 0, planeados: 0, ejecutados: 0 },
  };

  let totalPlannedMonths = 0;
  let totalExecutedMonths = 0;

  actividades.forEach((act) => {
    if (phvaStats[act.phva]) {
      phvaStats[act.phva].total += 1;
    }

    Object.values(act.planeacionMensual).forEach((monthData) => {
      const month = monthData as { planeado: boolean; ejecutado: boolean };
      if (month.planeado) {
        totalPlannedMonths += 1;
        if (phvaStats[act.phva]) phvaStats[act.phva].planeados += 1;
      }
      if (month.ejecutado) {
        totalExecutedMonths += 1;
        if (phvaStats[act.phva]) phvaStats[act.phva].ejecutados += 1;
      }
    });
  });

  const overallExecutionRate =
    totalPlannedMonths > 0
      ? Math.round((totalExecutedMonths / totalPlannedMonths) * 100)
      : 0;

  // Calculate Resource Breakdown
  const resourceStats = {
    Humano: 0,
    Técnico: 0,
    Financiero: 0,
    Locativo: 0,
  };

  actividades.forEach((act) => {
    if (resourceStats[act.recursoAsignado] !== undefined) {
      resourceStats[act.recursoAsignado] += 1;
    }
  });

  const getLegalBannerColor = (pct: number) => {
    if (pct < 60) return 'bg-red-50 border-red-300 text-red-900';
    if (pct <= 85) return 'bg-amber-50 border-amber-300 text-amber-900';
    return 'bg-emerald-50 border-emerald-300 text-emerald-900';
  };

  const getLegalStatusTitle = (pct: number) => {
    if (pct < 60) return 'ESTADO CRÍTICO (< 60%) - ACCIÓN INMEDIATA REQUERIDA';
    if (pct <= 85) return 'ESTADO MODERADAMENTE ACEPTABLE (60% - 85%)';
    return 'ESTADO ACEPTABLE (> 85%)';
  };

  const getLegalObligations = (pct: number) => {
    if (pct < 60) {
      return [
        'Realizar y remitir el Plan de Mejoramiento a la ARL dentro de los tres (3) meses siguientes.',
        'Enviar reporte de avance de cumplimiento a la ARL a los seis (6) meses de realizada la autoevaluación.',
        'Planear visita obligatoria de la ARL para verificación del cumplimiento de estándares mínimos.',
      ];
    }
    if (pct <= 85) {
      return [
        'Diseñar el Plan de Mejoramiento e incorporarlo en el Plan Anual de Trabajo del SG-SST.',
        'Enviar reporte de avances a la ARL a los seis (6) meses.',
        'Mantener a disposición del Ministerio del Trabajo el plan de mejora firmado.',
      ];
    }
    return [
      'Mantener el Plan de Mejoramiento continuo a disposición de las autoridades de inspección, vigilancia y control.',
      'Incorporar las acciones preventivas y correctivas en la revisión por la Alta Dirección anual.',
    ];
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Legal Status Alert Banner */}
      <div className={`p-5 rounded-2xl border shadow-xs space-y-3 ${getLegalBannerColor(empresaInfo.porcentajeCumplimiento)}`}>
        <div className="flex items-center space-x-3">
          {empresaInfo.porcentajeCumplimiento < 60 ? (
            <ShieldAlert className="w-7 h-7 text-red-600 flex-shrink-0 animate-pulse" />
          ) : empresaInfo.porcentajeCumplimiento <= 85 ? (
            <AlertTriangle className="w-7 h-7 text-amber-600 flex-shrink-0" />
          ) : (
            <ShieldCheck className="w-7 h-7 text-emerald-600 flex-shrink-0" />
          )}
          <div>
            <h3 className="font-extrabold text-sm sm:text-base uppercase tracking-tight">
              {getLegalStatusTitle(empresaInfo.porcentajeCumplimiento)}
            </h3>
            <p className="text-xs opacity-90">
              Autoevaluación SG-SST: <strong className="text-base">{empresaInfo.porcentajeCumplimiento}%</strong> ({empresaInfo.numeroEstandares} Estándares Mínimos - Res. 0312/19)
            </p>
          </div>
        </div>

        <div className="border-t border-current/20 pt-3 text-xs space-y-1.5">
          <p className="font-bold">Obligaciones Legales ante la ARL y el Ministerio del Trabajo:</p>
          <ul className="list-disc list-inside space-y-1 opacity-95">
            {getLegalObligations(empresaInfo.porcentajeCumplimiento).map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center space-x-4">
          <div className="p-3 bg-emerald-100 text-emerald-800 rounded-xl">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Ejecución del Plan</p>
            <p className="text-2xl font-extrabold text-slate-900">{overallExecutionRate}%</p>
            <p className="text-[11px] text-slate-500">
              {totalExecutedMonths} de {totalPlannedMonths} meses P/E
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center space-x-4">
          <div className="p-3 bg-blue-100 text-blue-800 rounded-xl">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Total Actividades</p>
            <p className="text-2xl font-extrabold text-slate-900">{actividades.length}</p>
            <p className="text-[11px] text-slate-500">Acciones registradas PHVA</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center space-x-4">
          <div className="p-3 bg-purple-100 text-purple-800 rounded-xl">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Clasificación Res 0312</p>
            <p className="text-sm font-extrabold text-slate-900">
              {empresaInfo.numeroEstandares} Estándares
            </p>
            <p className="text-[11px] text-slate-500">
              Riesgo {empresaInfo.nivelRiesgo} - {empresaInfo.tamanoEmpresa}
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center space-x-4">
          <div className="p-3 bg-amber-100 text-amber-800 rounded-xl">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Fecha Evaluación</p>
            <p className="text-sm font-extrabold text-slate-900">{empresaInfo.fechaEvaluacion}</p>
            <p className="text-[11px] text-slate-500 truncate max-w-[120px]">
              {empresaInfo.responsableSGSST || 'Sin responsable'}
            </p>
          </div>
        </div>
      </div>

      {/* Breakdown by PHVA Cycle & Resources */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* PHVA Cycle Breakdown */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
            <PieChart className="w-4 h-4 text-emerald-600" />
            <span>Distribución de Actividades por Ciclo PHVA</span>
          </h3>

          <div className="space-y-3 text-xs">
            {/* PLANEAR */}
            <div className="space-y-1">
              <div className="flex justify-between font-semibold">
                <span className="text-blue-800">PLANEAR (P) - Organización & Diseño</span>
                <span className="text-slate-600">{phvaStats.PLANEAR.total} actividades</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden flex">
                <div
                  className="bg-blue-600 h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${
                      actividades.length > 0
                        ? (phvaStats.PLANEAR.total / actividades.length) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>

            {/* HACER */}
            <div className="space-y-1">
              <div className="flex justify-between font-semibold">
                <span className="text-emerald-800">HACER (H) - Aplicación & Controles</span>
                <span className="text-slate-600">{phvaStats.HACER.total} actividades</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden flex">
                <div
                  className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${
                      actividades.length > 0
                        ? (phvaStats.HACER.total / actividades.length) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>

            {/* VERIFICAR */}
            <div className="space-y-1">
              <div className="flex justify-between font-semibold">
                <span className="text-amber-800">VERIFICAR (V) - Auditoría & Seguimiento</span>
                <span className="text-slate-600">{phvaStats.VERIFICAR.total} actividades</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden flex">
                <div
                  className="bg-amber-500 h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${
                      actividades.length > 0
                        ? (phvaStats.VERIFICAR.total / actividades.length) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>

            {/* ACTUAR */}
            <div className="space-y-1">
              <div className="flex justify-between font-semibold">
                <span className="text-purple-800">ACTUAR (A) - Mejoramiento Continuo</span>
                <span className="text-slate-600">{phvaStats.ACTUAR.total} actividades</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden flex">
                <div
                  className="bg-purple-600 h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${
                      actividades.length > 0
                        ? (phvaStats.ACTUAR.total / actividades.length) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Resource Allocation Breakdown */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
            <DollarSign className="w-4 h-4 text-emerald-600" />
            <span>Clasificación de Recursos Asignados</span>
          </h3>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center space-x-3">
              <div className="p-2 bg-blue-100 text-blue-800 rounded-lg">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-slate-900">{resourceStats.Humano}</p>
                <p className="text-[11px] text-slate-500">Recurso Humano</p>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center space-x-3">
              <div className="p-2 bg-emerald-100 text-emerald-800 rounded-lg">
                <Cpu className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-slate-900">{resourceStats.Técnico}</p>
                <p className="text-[11px] text-slate-500">Recurso Técnico</p>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center space-x-3">
              <div className="p-2 bg-amber-100 text-amber-800 rounded-lg">
                <DollarSign className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-slate-900">{resourceStats.Financiero}</p>
                <p className="text-[11px] text-slate-500">Recurso Financiero</p>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center space-x-3">
              <div className="p-2 bg-purple-100 text-purple-800 rounded-lg">
                <Building2 className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-slate-900">{resourceStats.Locativo}</p>
                <p className="text-[11px] text-slate-500">Recurso Locativo</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Executive Summary & Priorities */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
          <FileText className="w-4 h-4 text-emerald-600" />
          <span>Diagnóstico Ejecutivo & Prioridades Inmediatas</span>
        </h3>

        <div className="space-y-3 text-xs text-slate-700">
          <p className="leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200 font-medium text-slate-800">
            {resumenEjecutivo.diagnosticoGeneral && resumenEjecutivo.diagnosticoGeneral.includes(`${empresaInfo.porcentajeCumplimiento}%`)
              ? resumenEjecutivo.diagnosticoGeneral
              : getDiagnosticoEjecutivo(empresaInfo)}
          </p>

          <div>
            <h4 className="font-bold text-slate-900 mb-2">Acciones Inmediatas de Prioridad Alta:</h4>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {resumenEjecutivo.prioridadesInmediatas.map((pri, idx) => (
                <li
                  key={idx}
                  className="p-2.5 bg-emerald-50/60 rounded-lg border border-emerald-200 flex items-start space-x-2 text-emerald-950"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <span>{pri}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
