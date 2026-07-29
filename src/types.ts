export type PHVAStage = 'PLANEAR' | 'HACER' | 'VERIFICAR' | 'ACTUAR';

export type RecursoTipo = 'Humano' | 'Técnico' | 'Financiero' | 'Locativo';

export type MonthKey = 'ene' | 'feb' | 'mar' | 'abr' | 'may' | 'jun' | 'jul' | 'ago' | 'sep' | 'oct' | 'nov' | 'dic';

export interface MonthStatus {
  planeado: boolean;
  ejecutado: boolean;
}

export type MonthlyPlanning = Record<MonthKey, MonthStatus>;

export interface ActividadMejora {
  id: string;
  numeralEstandar: string;
  descripcionEstandar: string;
  hallazgo: string;
  phva: PHVAStage;
  actividad: string;
  planeacionMensual: MonthlyPlanning;
  responsable: string;
  evidenciaRequerida: string;
  observaciones: string;
  recursoAsignado: RecursoTipo;
}

export interface EmpresaInfo {
  nombre: string;
  nit: string;
  tamanoEmpresa: 'micro' | 'pequena' | 'mediana_grande'; // <=10, 11-50, >50
  nivelRiesgo: 'I' | 'II' | 'III' | 'IV' | 'V';
  numeroEstandares: 7 | 21 | 60;
  porcentajeCumplimiento: number;
  responsableSGSST: string;
  fechaEvaluacion: string;
  ciudad: string;
}

export interface ResumenEjecutivo {
  clasificacionLegal: string;
  diagnosticoGeneral: string;
  prioridadesInmediatas: string[];
  maroLegalAplicable: string[];
}

export interface PlanMejoramientoSST {
  empresaInfo: EmpresaInfo;
  resumenEjecutivo: ResumenEjecutivo;
  actividades: ActividadMejora[];
}

export interface StandardItem {
  numeral: string;
  phva: PHVAStage;
  nombre: string;
  aplicaA: '7' | '21' | '60';
  marcoLegal: string;
}
