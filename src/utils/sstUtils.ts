import { EmpresaInfo, ResumenEjecutivo, PlanMejoramientoSST, MonthKey } from '../types';

export const MONTH_KEYS: MonthKey[] = [
  'ene',
  'feb',
  'mar',
  'abr',
  'may',
  'jun',
  'jul',
  'ago',
  'sep',
  'oct',
  'nov',
  'dic',
];

export const MONTH_NAMES: { [key in MonthKey]: string } = {
  ene: 'Enero',
  feb: 'Febrero',
  mar: 'Marzo',
  abr: 'Abril',
  may: 'Mayo',
  jun: 'Junio',
  jul: 'Julio',
  ago: 'Agosto',
  sep: 'Septiembre',
  oct: 'Octubre',
  nov: 'Noviembre',
  dic: 'Diciembre',
};

/**
 * Returns current date info
 */
export function getCurrentCalendarInfo() {
  const now = new Date();
  const year = now.getFullYear();
  const monthIdx = now.getMonth(); // 0 to 11
  const monthKey = MONTH_KEYS[monthIdx];
  const monthName = MONTH_NAMES[monthKey];
  return {
    now,
    year,
    monthIdx,
    monthKey,
    monthName,
    pastMonthKeys: MONTH_KEYS.slice(0, monthIdx),
    currentAndFutureMonthKeys: MONTH_KEYS.slice(monthIdx),
  };
}

/**
 * Ensures schedule activities are aligned with real time (present and future months).
 * Removes 'planeado: true' from past months if unexecuted, shifting planned work to current & upcoming months.
 */
export function ajustarCronogramaTiempoReal(plan: PlanMejoramientoSST): PlanMejoramientoSST {
  const { monthIdx, monthKey } = getCurrentCalendarInfo();

  const actividadesAjustadas = plan.actividades.map((act) => {
    const pm = { ...act.planeacionMensual };
    let teniaPlaneadoPasadoSinEjecutar = false;

    // Clear unexecuted planning from past months
    MONTH_KEYS.forEach((mKey, idx) => {
      if (idx < monthIdx) {
        if (pm[mKey]?.planeado && !pm[mKey]?.ejecutado) {
          teniaPlaneadoPasadoSinEjecutar = true;
          pm[mKey] = { ...pm[mKey], planeado: false };
        }
      }
    });

    // Verify if there is any planning in current or future months
    const tienePlaneadoPresenteOFuturo = MONTH_KEYS.slice(monthIdx).some(
      (mKey) => pm[mKey]?.planeado
    );

    // If it was cleared or had no future planning, schedule starting from current month
    if (teniaPlaneadoPasadoSinEjecutar || !tienePlaneadoPresenteOFuturo) {
      const curKey = monthKey;
      const nextIdx = Math.min(monthIdx + 1, 11);
      const nextKey = MONTH_KEYS[nextIdx];

      pm[curKey] = { planeado: true, ejecutado: pm[curKey]?.ejecutado || false };
      if (nextIdx !== monthIdx) {
        pm[nextKey] = { planeado: true, ejecutado: pm[nextKey]?.ejecutado || false };
      }
    }

    return {
      ...act,
      planeacionMensual: pm,
    };
  });

  return {
    ...plan,
    actividades: actividadesAjustadas,
  };
}

/**
 * Returns official legal classification under Resolution 0312 of 2019 Article 27
 */
export function getClasificacionLegal(porcentaje: number): string {
  const pct = Math.round(porcentaje * 10) / 10;
  if (pct < 60) {
    return `CRÍTICO (${pct}%) - Obligatoria presentación de Plan de Mejoramiento a la ARL dentro de los tres (3) meses conforme a Res. 0312 de 2019 Art. 27.`;
  }
  if (pct <= 85) {
    return `MODERADAMENTE ACEPTABLE (${pct}%) - Plan de Mejoramiento obligatorio a disposición de la ARL y enviar reporte de avances a los seis (6) meses conforme a Res. 0312 de 2019 Art. 27.`;
  }
  return `ACEPTABLE (${pct}%) - Plan de Mejoramiento continuo e incorporación de acciones preventivas y correctivas en el Plan Anual SG-SST conforme a Res. 0312 de 2019 Art. 27.`;
}

/**
 * Dynamically computes executive diagnosis text matching the company's real percentage and profile.
 */
export function getDiagnosticoEjecutivo(empresaInfo: EmpresaInfo, noConformidadesCount?: number): string {
  const pct = Math.round(empresaInfo.porcentajeCumplimiento * 10) / 10;
  const nombre = empresaInfo.nombre || 'La empresa';
  const numEstandares = empresaInfo.numeroEstandares || 21;

  if (pct < 60) {
    return `La empresa "${nombre}" obtuvo un puntaje del ${pct}% en la autoevaluación de ${numEstandares} estándares mínimos (Res. 0312/19). Clasificada en nivel CRÍTICO (< 60%), requiere implementar prioritariamente acciones correctivas inmediatas en liderazgo, matriz IPEVR, vigilancia epidemiológica y respuesta ante emergencias, con reporte obligatorio a la ARL.`;
  }
  if (pct <= 85) {
    return `La empresa "${nombre}" obtuvo un puntaje del ${pct}% en la autoevaluación de ${numEstandares} estándares mínimos (Res. 0312/19). Clasificada en nivel MODERADAMENTE ACEPTABLE (60% - 85%), debe estructurar el Plan de Mejoramiento para subsanar los hallazgos identificados e integrar los controles en la gestión anual con seguimiento semestral.`;
  }
  return `La empresa "${nombre}" obtuvo un puntaje del ${pct}% en la autoevaluación de ${numEstandares} estándares mínimos (Res. 0312/19). Clasificada en nivel ACEPTABLE (> 85%), cuenta con una base sólida en su SG-SST y debe enfocar el Plan de Mejora en la auditoría periódica, la mejora continua y el mantenimiento de evidencias.`;
}

/**
 * Returns legal status badge color class
 */
export function getLegalStatusBadgeColor(pct: number): string {
  if (pct < 60) return 'bg-red-500/20 text-red-300 border-red-500/40';
  if (pct <= 85) return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
  return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
}

/**
 * Updates a PlanMejoramientoSST object so its executive summary dynamically matches the company percentage,
 * and its schedule is validated for present & future calendar months.
 */
export function updateResumenConPorcentaje<T extends { empresaInfo: EmpresaInfo; resumenEjecutivo: ResumenEjecutivo; actividades: any[] }>(
  plan: T
): T {
  const pct = plan.empresaInfo.porcentajeCumplimiento;
  const planConResumen = {
    ...plan,
    resumenEjecutivo: {
      ...plan.resumenEjecutivo,
      clasificacionLegal: getClasificacionLegal(pct),
      diagnosticoGeneral: getDiagnosticoEjecutivo(plan.empresaInfo),
    },
  };

  return ajustarCronogramaTiempoReal(planConResumen as any) as unknown as T;
}

