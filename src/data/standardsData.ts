import { StandardItem, PlanMejoramientoSST } from '../types';

export const ESTANDARES_RES_0312: StandardItem[] = [
  // 7 ESTÁNDARES (≤10 trabajadores Riesgo I, II, III)
  { numeral: '1.1.1', phva: 'PLANEAR', nombre: 'Asignación de persona que diseña el SG-SST', aplicaA: '7', marcoLegal: 'Res. 0312/19 Art 3' },
  { numeral: '1.1.4', phva: 'PLANEAR', nombre: 'Afiliación al Sistema General de Riesgos Laborales', aplicaA: '7', marcoLegal: 'Dec. 1072/15 Art 2.2.4.2.1' },
  { numeral: '1.2.1', phva: 'PLANEAR', nombre: 'Conformación y funcionamiento del COPASST / Vigía en SST', aplicaA: '7', marcoLegal: 'Res. 2013/86, Dec. 1072/15' },
  { numeral: '2.1.1', phva: 'HACER', nombre: 'Capacitación en SST (Programa anual)', aplicaA: '7', marcoLegal: 'Dec. 1072/15 Art 2.2.4.6.11' },
  { numeral: '3.1.1', phva: 'PLANEAR', nombre: 'Elaboración del Plan Anual de Trabajo', aplicaA: '7', marcoLegal: 'Dec. 1072/15 Art 2.2.4.6.12' },
  { numeral: '4.1.2', phva: 'HACER', nombre: 'Evaluaciones médicas ocupacionales', aplicaA: '7', marcoLegal: 'Res. 2346/07, Dec. 1072/15' },
  { numeral: '5.1.1', phva: 'HACER', nombre: 'Identificación de peligros y valoración de riesgos (IPEVR)', aplicaA: '7', marcoLegal: 'Dec. 1072/15 Art 2.2.4.6.15' },
  { numeral: '6.1.1', phva: 'HACER', nombre: 'Medidas de prevención y control frente a peligros/riesgos', aplicaA: '7', marcoLegal: 'Dec. 1072/15 Art 2.2.4.6.24' },

  // 21 ESTÁNDARES ADICIONALES (11 a 50 trabajadores Riesgo I, II, III)
  { numeral: '1.1.2', phva: 'PLANEAR', nombre: 'Asignación de recursos para el SG-SST (Financieros, Humanos, Técnicos)', aplicaA: '21', marcoLegal: 'Dec. 1072/15 Art 2.2.4.6.8' },
  { numeral: '1.1.3', phva: 'PLANEAR', nombre: 'Conformación y funcionamiento del Comité de Convivencia Laboral', aplicaA: '21', marcoLegal: 'Res. 652/12 y Res. 1356/12' },
  { numeral: '1.2.2', phva: 'PLANEAR', nombre: 'Capacitación de los integrantes del COPASST / Vigía', aplicaA: '21', marcoLegal: 'Dec. 1072/15 Art 2.2.4.6.12' },
  { numeral: '2.2.1', phva: 'PLANEAR', nombre: 'Política de Seguridad y Salud en el Trabajo firmada y divulgada', aplicaA: '21', marcoLegal: 'Dec. 1072/15 Art 2.2.4.6.5' },
  { numeral: '2.3.1', phva: 'PLANEAR', nombre: 'Objetivos del SG-SST expresados de forma clara y medible', aplicaA: '21', marcoLegal: 'Dec. 1072/15 Art 2.2.4.6.18' },
  { numeral: '2.4.1', phva: 'PLANEAR', nombre: 'Evaluación inicial del SG-SST', aplicaA: '21', marcoLegal: 'Dec. 1072/15 Art 2.2.4.6.16' },
  { numeral: '2.8.1', phva: 'PLANEAR', nombre: 'Archivo y retención documental del SG-SST (20 años)', aplicaA: '21', marcoLegal: 'Dec. 1072/15 Art 2.2.4.6.13' },
  { numeral: '2.11.1', phva: 'PLANEAR', nombre: 'Mantenimiento periódico de instalaciones, equipos y herramientas', aplicaA: '21', marcoLegal: 'Dec. 1072/15 Art 2.2.4.6.24' },
  { numeral: '3.1.2', phva: 'PLANEAR', nombre: 'Asignación de presupuesto anual para SG-SST', aplicaA: '21', marcoLegal: 'Dec. 1072/15 Art 2.2.4.6.8' },
  { numeral: '4.1.1', phva: 'HACER', nombre: 'Diagnóstico de condiciones de salud de los trabajadores', aplicaA: '21', marcoLegal: 'Res. 2346/07' },
  { numeral: '4.2.1', phva: 'VERIFICAR', nombre: 'Registro y seguimiento a accidentes de trabajo y enfermedades laborales (ATEL)', aplicaA: '21', marcoLegal: 'Dec. 1072/15 Art 2.2.4.6.32' },
  { numeral: '4.2.2', phva: 'VERIFICAR', nombre: 'Investigación de accidentes, incidentes y enfermedades laborales', aplicaA: '21', marcoLegal: 'Res. 1401/07' },
  { numeral: '5.2.1', phva: 'HACER', nombre: 'Plan de prevención, preparación y respuesta ante emergencias', aplicaA: '21', marcoLegal: 'Dec. 1072/15 Art 2.2.4.6.25' },
  { numeral: '6.1.2', phva: 'VERIFICAR', nombre: 'Inspecciones periódicas a instalaciones, maquinaria y equipos', aplicaA: '21', marcoLegal: 'Dec. 1072/15 Art 2.2.4.6.24' },
  { numeral: '7.1.1', phva: 'ACTUAR', nombre: 'Acciones preventivas y correctivas basadas en hallazgos', aplicaA: '21', marcoLegal: 'Dec. 1072/15 Art 2.2.4.6.33' },

  // 60 ESTÁNDARES ( >50 trabajadores o Riesgo IV y V )
  { numeral: '1.2.3', phva: 'PLANEAR', nombre: 'Asignación de funciones y responsabilidades en SST a todos los niveles', aplicaA: '60', marcoLegal: 'Dec. 1072/15 Art 2.2.4.6.8' },
  { numeral: '2.5.1', phva: 'PLANEAR', nombre: 'Matriz legal actualizada con normatividad vigente', aplicaA: '60', marcoLegal: 'Dec. 1072/15 Art 2.2.4.6.12' },
  { numeral: '2.7.1', phva: 'PLANEAR', nombre: 'Procedimiento para adquisición de productos y contratación de servicios con criterios de SST', aplicaA: '60', marcoLegal: 'Dec. 1072/15 Art 2.2.4.6.27' },
  { numeral: '2.10.1', phva: 'HACER', nombre: 'Suministro y gestión de Elementos de Protección Personal (EPP)', aplicaA: '60', marcoLegal: 'Dec. 1072/15 Art 2.2.4.6.24' },
  { numeral: '3.1.3', phva: 'VERIFICAR', nombre: 'Medición de indicadores del SG-SST (Estructura, Proceso y Resultado)', aplicaA: '60', marcoLegal: 'Dec. 1072/15 Art 2.2.4.6.19-22' },
  { numeral: '6.1.3', phva: 'VERIFICAR', nombre: 'Auditoría anual del SG-SST por personal independiente', aplicaA: '60', marcoLegal: 'Dec. 1072/15 Art 2.2.4.6.29' },
  { numeral: '6.1.4', phva: 'ACTUAR', nombre: 'Revisión por la alta dirección anual y plan de mejora continuada', aplicaA: '60', marcoLegal: 'Dec. 1072/15 Art 2.2.4.6.31' }
];

export const EJEMPLO_PLAN_MEJORAMIENTO: PlanMejoramientoSST = {
  empresaInfo: {
    nombre: 'Industrias y Servicios S.A.S.',
    nit: '900.123.456-7',
    tamanoEmpresa: 'pequena',
    nivelRiesgo: 'III',
    numeroEstandares: 21,
    porcentajeCumplimiento: 58.5,
    responsableSGSST: 'Ing. Carlos Mendoza (Lic. SST 14589-2023)',
    fechaEvaluacion: '2026-07-15',
    ciudad: 'Bogotá D.C., Colombia'
  },
  resumenEjecutivo: {
    clasificacionLegal: 'CRÍTICO (< 60%) - Obligatoria presentación de Plan de Mejoramiento a la ARL conforme a Res. 0312 de 2019 Art 27.',
    diagnosticoGeneral: 'La empresa obtuvo un porcentaje del 58.5% en la autoevaluación de estándares mínimos. Presenta ausencias críticas en la formalización de la Política de SST, la actualización de la matriz IPEVR, la conformación del COPASST y el Plan de Emergencias.',
    prioridadesInmediatas: [
      'Firmar y divulgar la Política del SG-SST y la asignación formal de responsabilidades.',
      'Conformar e instalar el COPASST / Vigía de SST con sus actas correspondientes.',
      'Actualizar la Matriz IPEVR (GTC 45) con la participación directa de los trabajadores.',
      'Estructurar el Plan de Prevención, Preparación y Respuesta ante Emergencias y realizar un simulacro.'
    ],
    maroLegalAplicable: [
      'Decreto 1072 de 2015 (Único Reglamentario del Sector Trabajo - Capítulo 6 SG-SST)',
      'Resolución 0312 de 2019 (Estándares Mínimos del SG-SST)',
      'Ley 1562 de 2012 (Sistema General de Riesgos Laborales)',
      'Resolución 2013 de 1986 y Resolución 652 de 2012 (COPASST y Comité Convivencia)'
    ]
  },
  actividades: [
    {
      id: 'act-1',
      numeralEstandar: '1.1.1',
      descripcionEstandar: 'Asignación de persona que diseña el SG-SST',
      hallazgo: 'La persona a cargo del SG-SST no cuenta con licencia vigente ni soporte del curso de 50 horas de la ARL.',
      phva: 'PLANEAR',
      actividad: 'Asignar formalmente por escrito al responsable del SG-SST garantizando licencia en SST vigente y certificado de curso virtual de 50/20 horas actualizado.',
      planeacionMensual: {
        ene: { planeado: true, ejecutado: true },
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
        dic: { planeado: false, ejecutado: false }
      },
      responsable: 'Gerencia General / Alta Dirección',
      evidenciaRequerida: 'Carta de asignación firmada, copia de Licencia en SST vigente y Certificado del curso 50 horas.',
      observaciones: 'Cumplimiento Decreto 1072/15 Art 2.2.4.6.8 Numeral 2 y Res 0312/19 Art 3 y 9.',
      recursoAsignado: 'Humano'
    },
    {
      id: 'act-2',
      numeralEstandar: '1.2.1',
      descripcionEstandar: 'Conformación y funcionamiento del COPASST / Vigía en SST',
      hallazgo: 'El COPASST venció sus periodos de vigencia y no se han realizado reuniones mensuales de seguimiento.',
      phva: 'PLANEAR',
      actividad: 'Convocatoria, elección, conformación e instalación del COPASST para el periodo 2026-2028 y cronograma de reuniones mensuales.',
      planeacionMensual: {
        ene: { planeado: true, ejecutado: true },
        feb: { planeado: true, ejecutado: false },
        mar: { planeado: true, ejecutado: false },
        abr: { planeado: false, ejecutado: false },
        may: { planeado: false, ejecutado: false },
        jun: { planeado: false, ejecutado: false },
        jul: { planeado: false, ejecutado: false },
        ago: { planeado: false, ejecutado: false },
        sep: { planeado: false, ejecutado: false },
        oct: { planeado: false, ejecutado: false },
        nov: { planeado: false, ejecutado: false },
        dic: { planeado: false, ejecutado: false }
      },
      responsable: 'Responsable SG-SST / COPASST',
      evidenciaRequerida: 'Convocatoria, Votaciones, Acta de Constitución y Actas de reuniones mensuales firmadas.',
      observaciones: 'Resolución 2013 de 1986 y Decreto 1072/15 Art 2.2.4.6.12.',
      recursoAsignado: 'Humano'
    },
    {
      id: 'act-3',
      numeralEstandar: '2.2.1',
      descripcionEstandar: 'Política de Seguridad y Salud en el Trabajo firmada y divulgada',
      hallazgo: 'La Política de SST no ha sido actualizada con la fecha del presente año ni se encuentra divulgada al personal nuevo.',
      phva: 'PLANEAR',
      actividad: 'Revisar, firmar por parte del Representante Legal y publicar la Política del SG-SST, ejecutando jornada de divulgación con evaluación de comprensión.',
      planeacionMensual: {
        ene: { planeado: true, ejecutado: true },
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
        dic: { planeado: false, ejecutado: false }
      },
      responsable: 'Representante Legal / Responsable SG-SST',
      evidenciaRequerida: 'Documento de Política fechado y firmado, Registro de asistencia a divulgación y publicación en cartelera.',
      observaciones: 'Decreto 1072 de 2015 Artículos 2.2.4.6.5 a 2.2.4.6.7.',
      recursoAsignado: 'Financiero'
    },
    {
      id: 'act-4',
      numeralEstandar: '5.1.1',
      descripcionEstandar: 'Identificación de peligros y valoración de riesgos (IPEVR)',
      hallazgo: 'La Matriz de Peligros IPEVR no incluye los nuevos puestos de trabajo ni la metodología de la Guía GTC 45 actualizada.',
      phva: 'HACER',
      actividad: 'Elaborar e implementar la Matriz de Identificación de Peligros, Evaluación y Valoración de Riesgos (IPEVR) en todas las sedes con participación de los trabajadores.',
      planeacionMensual: {
        ene: { planeado: false, ejecutado: false },
        feb: { planeado: true, ejecutado: false },
        mar: { planeado: true, ejecutado: false },
        abr: { planeado: false, ejecutado: false },
        may: { planeado: false, ejecutado: false },
        jun: { planeado: false, ejecutado: false },
        jul: { planeado: false, ejecutado: false },
        ago: { planeado: false, ejecutado: false },
        sep: { planeado: false, ejecutado: false },
        oct: { planeado: false, ejecutado: false },
        nov: { planeado: false, ejecutado: false },
        dic: { planeado: false, ejecutado: false }
      },
      responsable: 'Consultor SST / COPASST / Trabajo en Equipo',
      evidenciaRequerida: 'Matriz IPEVR (GTC 45) diligenciada, registro de participación de trabajadores y plan de intervención prioritario.',
      observaciones: 'Decreto 1072 de 2015 Art 2.2.4.6.15.',
      recursoAsignado: 'Técnico'
    },
    {
      id: 'act-5',
      numeralEstandar: '4.1.2',
      descripcionEstandar: 'Evaluaciones médicas ocupacionales',
      hallazgo: 'Existen trabajadores antiguos sin certificados de exámenes médicos periódicos y falta Profesiograma.',
      phva: 'HACER',
      actividad: 'Diseñar el Profesiograma corporativo con IPS autorizada y ejecutar la programación de evaluaciones médicas periódicas e ingreso.',
      planeacionMensual: {
        ene: { planeado: false, ejecutado: false },
        feb: { planeado: true, ejecutado: false },
        mar: { planeado: true, ejecutado: false },
        abr: { planeado: true, ejecutado: false },
        may: { planeado: false, ejecutado: false },
        jun: { planeado: false, ejecutado: false },
        jul: { planeado: false, ejecutado: false },
        ago: { planeado: false, ejecutado: false },
        sep: { planeado: false, ejecutado: false },
        oct: { planeado: false, ejecutado: false },
        nov: { planeado: false, ejecutado: false },
        dic: { planeado: false, ejecutado: false }
      },
      responsable: 'Responsable SG-SST / IPS Médico Ocupacional',
      evidenciaRequerida: 'Profesiograma firmado por Médico Especialista con Licencia, Certificados de Aptitud Médica e Informe de Diagnóstico de Salud.',
      observaciones: 'Resolución 2346 de 2007 y Res 1918 de 2009.',
      recursoAsignado: 'Financiero'
    },
    {
      id: 'act-6',
      numeralEstandar: '5.2.1',
      descripcionEstandar: 'Plan de prevención, preparación y respuesta ante emergencias',
      hallazgo: 'El Plan de Emergencias no cuenta con plano de evacuación ni señalización y la brigada no ha sido entrenada.',
      phva: 'HACER',
      actividad: 'Actualizar el Plan de Emergencias, conformar y capacitar la Brigada de Emergencias y realizar recarga y mantenimiento de extintores.',
      planeacionMensual: {
        ene: { planeado: false, ejecutado: false },
        feb: { planeado: false, ejecutado: false },
        mar: { planeado: true, ejecutado: false },
        abr: { planeado: true, ejecutado: false },
        may: { planeado: true, ejecutado: false },
        jun: { planeado: false, ejecutado: false },
        jul: { planeado: false, ejecutado: false },
        ago: { planeado: false, ejecutado: false },
        sep: { planeado: false, ejecutado: false },
        oct: { planeado: false, ejecutado: false },
        nov: { planeado: false, ejecutado: false },
        dic: { planeado: false, ejecutado: false }
      },
      responsable: 'Responsable SG-SST / Brigada de Emergencias / ARL',
      evidenciaRequerida: 'Documento Plan de Emergencias, Planos de Evacuación, Actas de capacitación de la Brigada y Certificados de extintores.',
      observaciones: 'Decreto 1072 de 2015 Art 2.2.4.6.25.',
      recursoAsignado: 'Locativo'
    },
    {
      id: 'act-7',
      numeralEstandar: '4.2.2',
      descripcionEstandar: 'Investigación de accidentes, incidentes y enfermedades laborales',
      hallazgo: 'Falta un procedimiento estandarizado para investigación de accidentes conforme a Res 1401/07.',
      phva: 'VERIFICAR',
      actividad: 'Implementar el procedimiento de investigación de ATEL con la conformación del equipo investigador (Jefe inmediato, COPASST y Responsable SG-SST).',
      planeacionMensual: {
        ene: { planeado: false, ejecutado: false },
        feb: { planeado: false, ejecutado: false },
        mar: { planeado: false, ejecutado: false },
        abr: { planeado: true, ejecutado: false },
        may: { planeado: false, ejecutado: false },
        jun: { planeado: false, ejecutado: false },
        jul: { planeado: false, ejecutado: false },
        ago: { planeado: false, ejecutado: false },
        sep: { planeado: false, ejecutado: false },
        oct: { planeado: false, ejecutado: false },
        nov: { planeado: false, ejecutado: false },
        dic: { planeado: false, ejecutado: false }
      },
      responsable: 'Responsable SG-SST / Equipo Investigador',
      evidenciaRequerida: 'Procedimiento documentado de ATEL, Formato FURAT, Informes de investigación y lecciones aprendidas.',
      observaciones: 'Resolución 1401 de 2007.',
      recursoAsignado: 'Técnico'
    },
    {
      id: 'act-8',
      numeralEstandar: '7.1.1',
      descripcionEstandar: 'Acciones preventivas y correctivas basadas en hallazgos',
      hallazgo: 'No existe un formato consolidado para el seguimiento a las acciones correctivas, preventivas y de mejora derivadas de inspecciones o auditorías.',
      phva: 'ACTUAR',
      actividad: 'Establecer el procedimiento de Acciones Preventivas, Correctivas y de Mejora (APCM), realizando seguimiento trimestral a la eficacia de las medidas tomadas.',
      planeacionMensual: {
        ene: { planeado: false, ejecutado: false },
        feb: { planeado: false, ejecutado: false },
        mar: { planeado: false, ejecutado: false },
        abr: { planeado: false, ejecutado: false },
        may: { planeado: true, ejecutado: false },
        jun: { planeado: false, ejecutado: false },
        jul: { planeado: false, ejecutado: false },
        ago: { planeado: true, ejecutado: false },
        sep: { planeado: false, ejecutado: false },
        oct: { planeado: false, ejecutado: false },
        nov: { planeado: true, ejecutado: false },
        dic: { planeado: false, ejecutado: false }
      },
      responsable: 'Responsable SG-SST / Alta Dirección',
      evidenciaRequerida: 'Procedimiento de APCM, Matriz de seguimiento a acciones de mejora y actas de cierre de hallazgos.',
      observaciones: 'Decreto 1072 de 2015 Artículos 2.2.4.6.33 y 2.2.4.6.34.',
      recursoAsignado: 'Humano'
    }
  ]
};

export const HALLAZGOS_PREDETERMINADOS = [
  {
    numeral: '1.1.1',
    estandar: 'Persona que diseña el SG-SST',
    hallazgo: 'El diseñador del SG-SST no presenta licencia vigente de SST ni certificado del curso de 50 horas de la ARL.'
  },
  {
    numeral: '1.2.1',
    estandar: 'COPASST / Vigía de SST',
    hallazgo: 'No se cuenta con acta de conformación ni votación del COPASST o asignación del Vigía de SST.'
  },
  {
    numeral: '2.1.1',
    estandar: 'Programa de Capacitación Anual',
    hallazgo: 'No se ha elaborado ni ejecutado el programa anual de capacitación en SST para los trabajadores.'
  },
  {
    numeral: '2.2.1',
    estandar: 'Política del SG-SST',
    hallazgo: 'La Política de SST no está firmada por el representante legal actual ni ha sido divulgada al personal.'
  },
  {
    numeral: '3.1.1',
    estandar: 'Plan Anual de Trabajo',
    hallazgo: 'No se cuenta con un Plan Anual de Trabajo firmado con metas, responsables y recursos definidos.'
  },
  {
    numeral: '4.1.2',
    estandar: 'Evaluaciones Médicas Ocupacionales',
    hallazgo: 'No se realizan exámenes médicos de ingreso, periódicos ni de retiro conforme al profesiograma.'
  },
  {
    numeral: '5.1.1',
    estandar: 'Matriz de Peligros IPEVR (GTC 45)',
    hallazgo: 'La identificación de peligros no cubre la totalidad de los cargos ni procesos productivos actuales.'
  },
  {
    numeral: '5.2.1',
    estandar: 'Plan de Emergencias',
    hallazgo: 'Ausencia de Plan de Emergencias estructurado, planos de evacuación y brigada conformada.'
  },
  {
    numeral: '6.1.1',
    estandar: 'Inspecciones y Mantenimiento',
    hallazgo: 'No se realizan inspecciones planeadas de seguridad ni mantenimiento preventivo a equipos/herramientas.'
  },
  {
    numeral: '7.1.1',
    estandar: 'Acciones Correctivas y Preventivas',
    hallazgo: 'No existe matriz ni procedimiento para documentar y cerrar las acciones correctivas del SG-SST.'
  }
];
