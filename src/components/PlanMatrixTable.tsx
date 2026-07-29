import React, { useState, useEffect } from 'react';
import { ActividadMejora, PHVAStage, RecursoTipo, MonthKey, PlanMejoramientoSST } from '../types';
import { getCurrentCalendarInfo, ajustarCronogramaTiempoReal } from '../utils/sstUtils';
import {
  Search,
  Filter,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  XCircle,
  Calendar,
  AlertCircle,
  AlertTriangle,
  FileCheck2,
  Sparkles,
  Save,
  RotateCcw,
  Clock,
  Printer,
} from 'lucide-react';

interface PlanMatrixTableProps {
  plan: PlanMejoramientoSST;
  onUpdatePlan: (updatedPlan: PlanMejoramientoSST) => void;
  onNavigateTab?: (tab: 'json_export') => void;
}

const MONTHS: { key: MonthKey; label: string }[] = [
  { key: 'ene', label: 'Ene' },
  { key: 'feb', label: 'Feb' },
  { key: 'mar', label: 'Mar' },
  { key: 'abr', label: 'Abr' },
  { key: 'may', label: 'May' },
  { key: 'jun', label: 'Jun' },
  { key: 'jul', label: 'Jul' },
  { key: 'ago', label: 'Ago' },
  { key: 'sep', label: 'Sep' },
  { key: 'oct', label: 'Oct' },
  { key: 'nov', label: 'Nov' },
  { key: 'dic', label: 'Dic' },
];

export const PlanMatrixTable: React.FC<PlanMatrixTableProps> = ({ plan, onUpdatePlan, onNavigateTab }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPhvaFilter, setSelectedPhvaFilter] = useState<string>('ALL');
  const [selectedRecursoFilter, setSelectedRecursoFilter] = useState<string>('ALL');
  const [editingId, setEditingId] = useState<string | null>(null);

  // State for delete confirmation modal
  const [deletingActivity, setDeletingActivity] = useState<ActividadMejora | null>(null);

  // New activity modal state
  const [showAddModal, setShowAddModal] = useState(false);

  // Ensure every activity has a unique ID
  useEffect(() => {
    let modified = false;
    const seenIds = new Set<string>();
    const sanitized = plan.actividades.map((act, idx) => {
      let currentId = act.id;
      if (!currentId || seenIds.has(currentId)) {
        currentId = `act-${Date.now().toString(36)}-${idx}-${Math.random().toString(36).substring(2, 6)}`;
        modified = true;
      }
      seenIds.add(currentId);
      return { ...act, id: currentId };
    });

    if (modified) {
      onUpdatePlan({ ...plan, actividades: sanitized });
    }
  }, [plan.actividades]);

  const [newActivity, setNewActivity] = useState<Partial<ActividadMejora>>({
    numeralEstandar: '1.1.1',
    descripcionEstandar: 'Asignación de recursos en SST',
    hallazgo: 'No se cuenta con soporte de ejecución de presupuesto.',
    phva: 'PLANEAR',
    actividad: 'Asignar presupuesto anual específico para el desarrollo del SG-SST.',
    responsable: 'Gerencia General / Responsable SG-SST',
    evidenciaRequerida: 'Documento de presupuesto aprobado y firmado.',
    observaciones: 'Cumplimiento Decreto 1072/15 Art 2.2.4.6.8.',
    recursoAsignado: 'Financiero',
    planeacionMensual: {
      ene: { planeado: true, ejecutado: false },
      feb: { planeado: false, ejecutado: false },
      mar: { planeado: false, ejecutado: false },
      abr: { planeado: false, ejecutado: false },
      may: { planeado: false, ejecutado: false },
      jun: { planeado: false, ejecutado: false },
      jul: { planeado: false, ejecutado: false },
      ago: { planeado: false, ejecutado: false },
      sep: { planeado: false, ejecutado: false },
      oct: { planeado: false, ejecutado: false },
      nov: { planeado: false, ejecutado: false },
      dic: { planeado: false, ejecutado: false },
    },
  });

  const handleUpdateField = (
    id: string,
    field: keyof ActividadMejora,
    value: any
  ) => {
    const updated = plan.actividades.map((act) => {
      if (act.id === id) {
        return { ...act, [field]: value };
      }
      return act;
    });
    onUpdatePlan({ ...plan, actividades: updated });
  };

  const handleToggleMonthStatus = (
    actividadId: string,
    month: MonthKey,
    type: 'planeado' | 'ejecutado'
  ) => {
    const updatedActividades = plan.actividades.map((act) => {
      if (act.id === actividadId) {
        const currentMonthData = act.planeacionMensual[month] || {
          planeado: false,
          ejecutado: false,
        };
        return {
          ...act,
          planeacionMensual: {
            ...act.planeacionMensual,
            [month]: {
              ...currentMonthData,
              [type]: !currentMonthData[type],
            },
          },
        };
      }
      return act;
    });

    onUpdatePlan({
      ...plan,
      actividades: updatedActividades,
    });
  };

  const handleDeleteActivity = (act: ActividadMejora) => {
    setDeletingActivity(act);
  };

  const confirmDeleteActivity = () => {
    if (!deletingActivity) return;
    const targetId = deletingActivity.id;
    const updatedActividades = plan.actividades.filter((a) => a.id !== targetId);
    onUpdatePlan({ ...plan, actividades: updatedActividades });
    setDeletingActivity(null);
  };

  const handleAddEmptyActivity = () => {
    const newObj: ActividadMejora = {
      id: 'act-' + Date.now(),
      numeralEstandar: '1.1.1',
      descripcionEstandar: 'Estándar Mínimo Res. 0312',
      hallazgo: 'Sin definir / Pendiente de autoevaluación',
      phva: 'PLANEAR',
      actividad: 'Nueva actividad asignada...',
      planeacionMensual: {
        ene: { planeado: true, ejecutado: false },
        feb: { planeado: false, ejecutado: false },
        mar: { planeado: false, ejecutado: false },
        abr: { planeado: false, ejecutado: false },
        may: { planeado: false, ejecutado: false },
        jun: { planeado: false, ejecutado: false },
        jul: { planeado: false, ejecutado: false },
        ago: { planeado: false, ejecutado: false },
        sep: { planeado: false, ejecutado: false },
        oct: { planeado: false, ejecutado: false },
        nov: { planeado: false, ejecutado: false },
        dic: { planeado: false, ejecutado: false },
      },
      responsable: 'Responsable SG-SST',
      evidenciaRequerida: 'Documento / Registro de soporte',
      observaciones: 'Decreto 1072 de 2015',
      recursoAsignado: 'Humano',
    };

    onUpdatePlan({
      ...plan,
      actividades: [...plan.actividades, newObj],
    });
  };

  const handleAddActivitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newActivity.actividad) return;

    const newObj: ActividadMejora = {
      id: 'act-' + Date.now(),
      numeralEstandar: newActivity.numeralEstandar || '1.1.1',
      descripcionEstandar: newActivity.descripcionEstandar || 'Estándar Mínimo',
      hallazgo: newActivity.hallazgo || 'No conformidad detectada',
      phva: (newActivity.phva as PHVAStage) || 'PLANEAR',
      actividad: newActivity.actividad || '',
      planeacionMensual: newActivity.planeacionMensual as any,
      responsable: newActivity.responsable || 'Responsable SG-SST',
      evidenciaRequerida: newActivity.evidenciaRequerida || 'Soporte documental',
      observaciones: newActivity.observaciones || 'Decreto 1072 de 2015',
      recursoAsignado: (newActivity.recursoAsignado as RecursoTipo) || 'Humano',
    };

    onUpdatePlan({
      ...plan,
      actividades: [...plan.actividades, newObj],
    });

    setShowAddModal(false);
  };

  // Filter logic
  const filteredActividades = plan.actividades.filter((act) => {
    const matchesSearch =
      act.actividad.toLowerCase().includes(searchTerm.toLowerCase()) ||
      act.numeralEstandar.toLowerCase().includes(searchTerm.toLowerCase()) ||
      act.hallazgo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      act.responsable.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesPhva = selectedPhvaFilter === 'ALL' || act.phva === selectedPhvaFilter;
    const matchesRecurso =
      selectedRecursoFilter === 'ALL' || act.recursoAsignado === selectedRecursoFilter;

    return matchesSearch && matchesPhva && matchesRecurso;
  });

  const getPhvaBadge = (stage: PHVAStage) => {
    switch (stage) {
      case 'PLANEAR':
        return 'bg-slate-900 text-white border-slate-900';
      case 'HACER':
        return 'bg-emerald-800 text-white border-emerald-800';
      case 'VERIFICAR':
        return 'bg-blue-800 text-white border-blue-800';
      case 'ACTUAR':
        return 'bg-amber-800 text-white border-amber-800';
      default:
        return 'bg-slate-700 text-white border-slate-700';
    }
  };

  const calendarInfo = getCurrentCalendarInfo();

  const handleSincronizarCalendario = () => {
    const planAjustado = ajustarCronogramaTiempoReal(plan);
    onUpdatePlan(planAjustado);
  };

  return (
    <div className="space-y-6 pb-10">
      {/* Real-time Calendar Sync Notification Banner */}
      <div className="bg-emerald-950/80 text-emerald-100 p-3.5 rounded-xl border border-emerald-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-800/80 border border-emerald-600/50 flex items-center justify-center flex-shrink-0">
            <Clock className="w-5 h-5 text-emerald-300" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-emerald-200 uppercase tracking-wide">
                Sincronización en Tiempo Real
              </span>
              <span className="text-[10px] bg-emerald-500/30 text-emerald-300 font-extrabold px-2 py-0.5 rounded-full border border-emerald-500/40">
                {calendarInfo.year} — Mes Actual: {calendarInfo.monthName} ({calendarInfo.monthKey.toUpperCase()})
              </span>
            </div>
            <p className="text-[11px] text-emerald-200/80 mt-0.5">
              El plan valida la fecha del calendario y programa las acciones exclusivamente en tiempo presente y futuro (no en meses pasados).
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSincronizarCalendario}
          className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg transition flex items-center space-x-1.5 cursor-pointer shadow-xs whitespace-nowrap self-start sm:self-auto border border-emerald-400/40"
          title="Ajusta automáticamente las actividades no ejecutadas a partir del mes actual en adelante"
        >
          <RotateCcw className="w-3.5 h-3.5 text-emerald-200" />
          <span>Ajustar al Mes Actual ({calendarInfo.monthName})</span>
        </button>
      </div>

      {/* Top Filter Bar */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
          <input
            type="text"
            placeholder="Buscar por numeral, actividad, hallazgo o responsable..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 focus:ring-1 focus:ring-slate-800 text-xs text-slate-800 font-sans"
          />
        </div>

        {/* Filters & Action */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="flex items-center space-x-1.5 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <span className="font-bold text-slate-700 uppercase tracking-tighter text-[10px]">
              PHVA:
            </span>
            <select
              value={selectedPhvaFilter}
              onChange={(e) => setSelectedPhvaFilter(e.target.value)}
              className="bg-transparent font-medium text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="ALL">Todos los ciclos</option>
              <option value="PLANEAR">Planear (P)</option>
              <option value="HACER">Hacer (H)</option>
              <option value="VERIFICAR">Verificar (V)</option>
              <option value="ACTUAR">Actuar (A)</option>
            </select>
          </div>

          <div className="flex items-center space-x-1.5 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200">
            <span className="font-bold text-slate-700 uppercase tracking-tighter text-[10px]">
              Recurso:
            </span>
            <select
              value={selectedRecursoFilter}
              onChange={(e) => setSelectedRecursoFilter(e.target.value)}
              className="bg-transparent font-medium text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="ALL">Todos los recursos</option>
              <option value="Humano">Humano</option>
              <option value="Técnico">Técnico</option>
              <option value="Financiero">Financiero</option>
              <option value="Locativo">Locativo</option>
            </select>
          </div>

          <button
            onClick={handleAddEmptyActivity}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-[11px] rounded-lg transition flex items-center space-x-1 cursor-pointer border border-slate-700"
            title="Agregar fila rápida al final"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Agregar Actividad</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] rounded-lg transition flex items-center space-x-1.5 cursor-pointer shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-200" />
            <span>Formulario Completo</span>
          </button>

          {onNavigateTab && (
            <button
              type="button"
              onClick={() => onNavigateTab('json_export')}
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] rounded-lg transition flex items-center space-x-1.5 cursor-pointer shadow-xs border border-blue-500/30"
              title="Abrir vista de impresión y descargar documento PDF oficial"
            >
              <Printer className="w-3.5 h-3.5 text-blue-200" />
              <span>Imprimir / PDF</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Matrix Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 bg-slate-900 text-white border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-sm uppercase tracking-wider flex items-center space-x-2">
              <span>Matriz de Actividades y Cronograma (PHVA)</span>
              <span className="text-[10px] font-normal text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                {filteredActividades.length} Actividades
              </span>
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Haga clic en 'P' (Planeado) o 'E' (Ejecutado) para actualizar los meses. Las celdas de texto son editables directamente.
            </p>
          </div>

          <div className="flex items-center space-x-3 text-[10px] font-bold">
            <span className="flex items-center space-x-1 text-slate-300">
              <span className="w-4 h-4 rounded bg-slate-800 border border-slate-600 text-emerald-400 font-mono text-[9px] font-extrabold flex items-center justify-center">
                P
              </span>
              <span>= Planeado</span>
            </span>
            <span className="flex items-center space-x-1 text-slate-300">
              <span className="w-4 h-4 rounded bg-blue-600 text-white font-mono text-[9px] font-extrabold flex items-center justify-center">
                E
              </span>
              <span>= Ejecutado</span>
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 text-[10px] uppercase tracking-wider">
                <th className="p-2.5 w-16 text-center border-r border-slate-200">Numeral</th>
                <th className="p-2.5 w-20 text-center border-r border-slate-200">Ciclo PHVA</th>
                <th className="p-2.5 min-w-[240px] border-r border-slate-200">
                  Hallazgo &amp; Actividad
                </th>
                <th className="p-2.5 w-72 text-center border-r border-slate-200">
                  Cronograma Mensual (P / E)
                </th>
                <th className="p-2.5 w-36 border-r border-slate-200">Responsables</th>
                <th className="p-2.5 w-40 border-r border-slate-200">Evidencias Requeridas</th>
                <th className="p-2.5 w-36 border-r border-slate-200">Observaciones (Norma)</th>
                <th className="p-2.5 w-24 text-center border-r border-slate-200">Recurso</th>
                <th className="p-2.5 w-12 text-center">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredActividades.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-slate-500 text-xs">
                    No se encontraron actividades registradas. Haga clic en "+ Agregar Actividad" para comenzar.
                  </td>
                </tr>
              ) : (
                filteredActividades.map((act) => (
                  <tr key={act.id} className="hover:bg-slate-50/80 transition">
                    {/* Numeral */}
                    <td className="p-2 font-bold text-slate-800 text-center border-r border-slate-200 bg-slate-50/50">
                      <input
                        type="text"
                        value={act.numeralEstandar}
                        onChange={(e) =>
                          handleUpdateField(act.id, 'numeralEstandar', e.target.value)
                        }
                        className="w-full text-center bg-transparent font-mono font-bold text-slate-900 border-b border-transparent focus:border-slate-800 focus:bg-amber-50/50 outline-none p-1 rounded"
                      />
                    </td>

                    {/* PHVA Stage */}
                    <td className="p-2 text-center border-r border-slate-200">
                      <select
                        value={act.phva}
                        onChange={(e) =>
                          handleUpdateField(act.id, 'phva', e.target.value as PHVAStage)
                        }
                        className={`w-full text-[10px] font-bold px-1.5 py-1 rounded border cursor-pointer outline-none ${getPhvaBadge(
                          act.phva
                        )}`}
                      >
                        <option value="PLANEAR" className="bg-white text-slate-900 font-semibold">
                          PLANEAR
                        </option>
                        <option value="HACER" className="bg-white text-slate-900 font-semibold">
                          HACER
                        </option>
                        <option value="VERIFICAR" className="bg-white text-slate-900 font-semibold">
                          VERIFICAR
                        </option>
                        <option value="ACTUAR" className="bg-white text-slate-900 font-semibold">
                          ACTUAR
                        </option>
                      </select>
                    </td>

                    {/* Hallazgo & Actividad */}
                    <td className="p-2 border-r border-slate-200 space-y-1.5">
                      <div>
                        <span className="text-[9px] uppercase font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                          Hallazgo:
                        </span>
                        <input
                          type="text"
                          value={act.hallazgo}
                          onChange={(e) =>
                            handleUpdateField(act.id, 'hallazgo', e.target.value)
                          }
                          className="w-full text-slate-600 text-[11px] font-sans mt-0.5 border-b border-transparent focus:border-slate-800 focus:bg-amber-50/50 outline-none p-1 rounded"
                        />
                      </div>
                      <div>
                        <span className="text-[9px] uppercase font-bold text-slate-900 bg-slate-200 px-1.5 py-0.5 rounded">
                          Actividad:
                        </span>
                        <textarea
                          rows={2}
                          value={act.actividad}
                          onChange={(e) =>
                            handleUpdateField(act.id, 'actividad', e.target.value)
                          }
                          className="w-full text-slate-900 font-semibold text-xs mt-0.5 border border-slate-200 focus:border-slate-800 focus:bg-amber-50/50 outline-none p-1 rounded resize-y"
                        />
                      </div>
                    </td>

                    {/* Monthly Grid (P / E) */}
                    <td className="p-2 border-r border-slate-200">
                      <div className="grid grid-cols-6 gap-1 text-[10px]">
                        {MONTHS.map((m, mIdx) => {
                          const mData = act.planeacionMensual[m.key] || {
                            planeado: false,
                            ejecutado: false,
                          };
                          const isCurrentMonth = mIdx === calendarInfo.monthIdx;
                          const isPastMonth = mIdx < calendarInfo.monthIdx;

                          return (
                            <div
                              key={m.key}
                              className={`p-1 rounded border flex flex-col items-center justify-between transition ${
                                isCurrentMonth
                                  ? 'bg-emerald-500/10 border-emerald-500/60 ring-1 ring-emerald-500/40'
                                  : isPastMonth
                                  ? 'bg-slate-100/80 border-slate-200 opacity-85'
                                  : 'bg-slate-50 border-slate-200'
                              }`}
                            >
                              <span
                                className={`font-bold text-[9px] uppercase tracking-tighter flex items-center gap-0.5 ${
                                  isCurrentMonth ? 'text-emerald-700 font-extrabold' : 'text-slate-600'
                                }`}
                              >
                                <span>{m.label}</span>
                                {isCurrentMonth && (
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" title="Mes Actual" />
                                )}
                              </span>
                              <div className="flex items-center space-x-1 mt-1">
                                <button
                                  type="button"
                                  onClick={() => handleToggleMonthStatus(act.id, m.key, 'planeado')}
                                  title={`Toggle Planeado ${m.label}`}
                                  className={`w-4 h-4 rounded text-[8px] font-mono font-extrabold transition flex items-center justify-center cursor-pointer ${
                                    mData.planeado
                                      ? 'bg-slate-900 text-white shadow-xs'
                                      : 'bg-slate-200 text-slate-400 hover:bg-slate-300'
                                  }`}
                                >
                                  P
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleToggleMonthStatus(act.id, m.key, 'ejecutado')}
                                  title={`Toggle Ejecutado ${m.label}`}
                                  className={`w-4 h-4 rounded text-[8px] font-mono font-extrabold transition flex items-center justify-center cursor-pointer ${
                                    mData.ejecutado
                                      ? 'bg-blue-600 text-white shadow-xs'
                                      : 'bg-slate-200 text-slate-400 hover:bg-slate-300'
                                  }`}
                                >
                                  E
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </td>

                    {/* Responsable */}
                    <td className="p-2 border-r border-slate-200 text-slate-800">
                      <textarea
                        rows={2}
                        value={act.responsable}
                        onChange={(e) =>
                          handleUpdateField(act.id, 'responsable', e.target.value)
                        }
                        className="w-full text-slate-800 font-medium text-xs border border-transparent focus:border-slate-800 focus:bg-amber-50/50 outline-none p-1 rounded resize-none"
                      />
                    </td>

                    {/* Evidencias */}
                    <td className="p-2 border-r border-slate-200 text-slate-700">
                      <textarea
                        rows={2}
                        value={act.evidenciaRequerida}
                        onChange={(e) =>
                          handleUpdateField(act.id, 'evidenciaRequerida', e.target.value)
                        }
                        className="w-full text-slate-700 text-xs border border-transparent focus:border-slate-800 focus:bg-amber-50/50 outline-none p-1 rounded resize-none"
                      />
                    </td>

                    {/* Observaciones */}
                    <td className="p-2 border-r border-slate-200 text-slate-600">
                      <textarea
                        rows={2}
                        value={act.observaciones}
                        onChange={(e) =>
                          handleUpdateField(act.id, 'observaciones', e.target.value)
                        }
                        className="w-full text-slate-600 text-[11px] border border-transparent focus:border-slate-800 focus:bg-amber-50/50 outline-none p-1 rounded resize-none"
                      />
                    </td>

                    {/* Recurso */}
                    <td className="p-2 text-center border-r border-slate-200">
                      <select
                        value={act.recursoAsignado}
                        onChange={(e) =>
                          handleUpdateField(act.id, 'recursoAsignado', e.target.value as RecursoTipo)
                        }
                        className="w-full px-1.5 py-1 rounded bg-slate-100 text-slate-800 border border-slate-200 font-bold text-[10px] cursor-pointer outline-none"
                      >
                        <option value="Humano">Humano</option>
                        <option value="Técnico">Técnico</option>
                        <option value="Financiero">Financiero</option>
                        <option value="Locativo">Locativo</option>
                      </select>
                    </td>

                    {/* Action */}
                    <td className="p-2 text-center">
                      <button
                        type="button"
                        onClick={() => handleDeleteActivity(act)}
                        className="p-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 border border-transparent hover:border-red-200 rounded-lg transition cursor-pointer flex items-center justify-center mx-auto"
                        title="Eliminar esta actividad"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for adding new activity */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                Agregar Actividad al Plan de Mejora SST
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddActivitySubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 text-[10px] uppercase mb-1">
                    Numeral del Estándar (Res. 0312)
                  </label>
                  <input
                    type="text"
                    required
                    value={newActivity.numeralEstandar}
                    onChange={(e) =>
                      setNewActivity({ ...newActivity, numeralEstandar: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                    placeholder="Ej. 1.1.1"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 text-[10px] uppercase mb-1">Fase PHVA</label>
                  <select
                    value={newActivity.phva}
                    onChange={(e) =>
                      setNewActivity({ ...newActivity, phva: e.target.value as PHVAStage })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-semibold"
                  >
                    <option value="PLANEAR">PLANEAR (P)</option>
                    <option value="HACER">HACER (H)</option>
                    <option value="VERIFICAR">VERIFICAR (V)</option>
                    <option value="ACTUAR">ACTUAR (A)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 text-[10px] uppercase mb-1">
                  Hallazgo / No Conformidad Identificada
                </label>
                <input
                  type="text"
                  required
                  value={newActivity.hallazgo}
                  onChange={(e) => setNewActivity({ ...newActivity, hallazgo: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  placeholder="Descripción del incumplimiento..."
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 text-[10px] uppercase mb-1">
                  Actividad a Desarrollar (Clara, Medible y Ejecutable)
                </label>
                <textarea
                  rows={2}
                  required
                  value={newActivity.actividad}
                  onChange={(e) => setNewActivity({ ...newActivity, actividad: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 font-medium"
                  placeholder="Acción concreta a realizar..."
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 text-[10px] uppercase mb-1">Responsables</label>
                  <input
                    type="text"
                    value={newActivity.responsable}
                    onChange={(e) =>
                      setNewActivity({ ...newActivity, responsable: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 text-[10px] uppercase mb-1">Recurso Asignado</label>
                  <select
                    value={newActivity.recursoAsignado}
                    onChange={(e) =>
                      setNewActivity({
                        ...newActivity,
                        recursoAsignado: e.target.value as RecursoTipo,
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  >
                    <option value="Humano">Humano</option>
                    <option value="Técnico">Técnico</option>
                    <option value="Financiero">Financiero</option>
                    <option value="Locativo">Locativo</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 text-[10px] uppercase mb-1">
                  Evidencia Requerida
                </label>
                <input
                  type="text"
                  value={newActivity.evidenciaRequerida}
                  onChange={(e) =>
                    setNewActivity({ ...newActivity, evidenciaRequerida: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 text-[10px] uppercase mb-1">
                  Observaciones / Marco Legal (Ej. Dec 1072/15)
                </label>
                <input
                  type="text"
                  value={newActivity.observaciones}
                  onChange={(e) =>
                    setNewActivity({ ...newActivity, observaciones: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold uppercase tracking-wider text-[11px]"
                >
                  Guardar Actividad
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal for deleting activity confirmation */}
      {deletingActivity && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center space-x-3 text-red-600">
              <div className="p-2.5 bg-red-100 rounded-full flex-shrink-0">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  ¿Eliminar actividad del Plan?
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Esta acción eliminará permanentemente esta actividad de la matriz.
                </p>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-700 space-y-1">
              <p className="font-bold text-slate-900">
                Numeral: <span className="font-mono text-blue-900">{deletingActivity.numeralEstandar}</span>
              </p>
              <p className="italic text-slate-600 line-clamp-3">
                "{deletingActivity.actividad}"
              </p>
              {deletingActivity.responsable && (
                <p className="text-[11px] text-slate-500 mt-1">
                  Responsable: {deletingActivity.responsable}
                </p>
              )}
            </div>

            <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setDeletingActivity(null)}
                className="px-4 py-2 rounded-lg border border-slate-300 hover:bg-slate-50 font-bold text-xs text-slate-700 cursor-pointer transition"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={confirmDeleteActivity}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center space-x-1.5 cursor-pointer transition shadow-xs"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Sí, Eliminar</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

