import React, { useState } from 'react';
import { EmpresaInfo, PlanMejoramientoSST } from '../types';
import { HALLAZGOS_PREDETERMINADOS } from '../data/standardsData';
import { parseEvaluationFile } from '../utils/fileParser';
import {
  Sparkles,
  Building2,
  AlertCircle,
  Loader2,
  Upload,
  FileSpreadsheet,
  RefreshCw,
  CheckCircle2,
  ArrowRight,
  FileJson2,
} from 'lucide-react';

interface CompanyProfileFormProps {
  initialInfo: EmpresaInfo;
  onPlanGenerated: (newPlan: PlanMejoramientoSST) => void;
  onCompanyInfoUpdate?: (updatedInfo: EmpresaInfo) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export const CompanyProfileForm: React.FC<CompanyProfileFormProps> = ({
  initialInfo,
  onPlanGenerated,
  onCompanyInfoUpdate,
  isLoading,
  setIsLoading,
}) => {
  const [empresa, setEmpresa] = useState<EmpresaInfo>(initialInfo);

  React.useEffect(() => {
    setEmpresa(initialInfo);
  }, [initialInfo]);

  const updateEmpresaState = (updater: (prev: EmpresaInfo) => EmpresaInfo) => {
    setEmpresa((prev) => {
      const next = updater(prev);
      if (onCompanyInfoUpdate) {
        onCompanyInfoUpdate(next);
      }
      return next;
    });
  };

  const [selectedHallazgos, setSelectedHallazgos] = useState<string[]>([
    '1.1.1',
    '1.2.1',
    '2.2.1',
    '5.1.1',
    '4.1.2',
    '5.2.1',
  ]);
  const [hallazgosTextoLibre, setHallazgosTextoLibre] = useState<string>(
    'No se cuenta con la documentación de entrega de Elementos de Protección Personal (EPP). El plan de capacitaciones no tiene indicadores de cobertura. Falta auditoría anual por parte del representante legal.'
  );
  const [instruccionesAdicionales, setInstruccionesAdicionales] = useState<string>(
    'Enfocar la ejecución de actividades prioritarias en los primeros 3 meses del año para evitar sanciones de la ARL y del Ministerio del Trabajo.'
  );
  const [fileStatus, setFileStatus] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isExtractingHallazgos, setIsExtractingHallazgos] = useState<boolean>(false);
  const [extractionSuccessMsg, setExtractionSuccessMsg] = useState<string | null>(null);

  // Función para cargar y probar el JSON desde public/evaluacionSGSST.json
  const handleCargarJSONEstatico = async () => {
    try {
      const response = await fetch(`${import.meta.env.BASE_URL}evaluacionSGSST.json`);

      if (!response.ok) {
        throw new Error(`No se pudo encontrar el archivo JSON (Status: ${response.status})`);
      }

      const data = await response.json();
      console.log('✅ Datos de autoevaluación cargados desde public/:', data);

      if (data.evaluacion && Array.isArray(data.evaluacion)) {
        alert(`¡JSON de prueba cargado con éxito!\nConsecutivo: ${data.consecutivo || 'N/A'}\nPuntaje Total: ${data.puntajeTotal}`);
      } else {
        alert('El JSON se cargó correctamente, pero no contiene la estructura "evaluacion" esperada.');
      }
    } catch (error) {
      console.error('❌ Error al procesar el JSON estático:', error);
      alert('Error al cargar evaluacionSGSST.json. Verifica que el archivo esté guardado dentro de la carpeta "public".');
    }
  };

  const handleExtractHallazgos = async (customTextToAnalyze?: string) => {
    setIsExtractingHallazgos(true);
    setExtractionSuccessMsg(null);
    setErrorMessage(null);

    try {
      const textToAnalyze = customTextToAnalyze || hallazgosTextoLibre;

      const response = await fetch('/api/plan-mejoramiento/extract-hallazgos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          documentoTexto: textToAnalyze,
          empresaInfo: empresa,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Error al extraer no conformidades.');
      }

      const data = await response.json();

      if (data.hallazgosTexto) {
        setHallazgosTextoLibre(data.hallazgosTexto);
      }

      if (Array.isArray(data.numeralesEstandar) && data.numeralesEstandar.length > 0) {
        setSelectedHallazgos((prev) => {
          const combined = new Set([...prev, ...data.numeralesEstandar]);
          return Array.from(combined);
        });
      }

      if (
        typeof data.porcentajeCalculado === 'number' &&
        data.porcentajeCalculado >= 0 &&
        data.porcentajeCalculado <= 100
      ) {
        updateEmpresaState((prev) => ({
          ...prev,
          porcentajeCumplimiento: data.porcentajeCalculado,
        }));
      }

      setExtractionSuccessMsg(
        data.resumenInconformidades ||
          '¡Sección de hallazgos actualizada exitosamente con las no conformidades detectadas!'
      );
    } catch (err: any) {
      console.error('Error al actualizar hallazgos:', err);
      setErrorMessage(
        err.message || 'No se pudo completar el análisis automático de no conformidades.'
      );
    } finally {
      setIsExtractingHallazgos(false);
    }
  };

  const handleTamanoChange = (tamano: 'micro' | 'pequena' | 'mediana_grande') => {
    let numEstandares: 7 | 21 | 60 = 21;
    if (tamano === 'micro') numEstandares = 7;
    if (tamano === 'pequena') numEstandares = 21;
    if (tamano === 'mediana_grande') numEstandares = 60;

    updateEmpresaState((prev) => ({
      ...prev,
      tamanoEmpresa: tamano,
      numeroEstandares: numEstandares,
    }));
  };

  const handleToggleHallazgo = (numeral: string) => {
    setSelectedHallazgos((prev) =>
      prev.includes(numeral) ? prev.filter((id) => id !== numeral) : [...prev, numeral]
    );
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileStatus(`Procesando archivo "${file.name}" (Excel / CSV / Texto)...`);
    setErrorMessage(null);

    try {
      const parsedDoc = await parseEvaluationFile(file);

      if (parsedDoc.detectedPercentage !== undefined) {
        updateEmpresaState((prev) => ({
          ...prev,
          porcentajeCumplimiento: parsedDoc.detectedPercentage!,
        }));
      }

      setFileStatus(
        `Documento "${file.name}" leído (${parsedDoc.itemCount} filas). Extrayendo no conformidades con IA...`
      );

      await handleExtractHallazgos(
        `DOCUMENTO CORTADO O EVALUACIÓN COMPLETA (${file.name}):\n\n${parsedDoc.extractedText}`
      );

      setFileStatus(`¡Documento "${file.name}" procesado con éxito! Hallazgos y porcentaje actualizados.`);
    } catch (err: any) {
      console.error('Error al procesar archivo:', err);
      setFileStatus(`Error al procesar "${file.name}".`);
      setErrorMessage(
        `No se pudo analizar el archivo "${file.name}": ${err.message || 'Asegúrese de subir un archivo Excel (.xlsx, .xls), CSV o de texto con la autoevaluación.'}`
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const hallazgosSeleccionadosInfo = HALLAZGOS_PREDETERMINADOS.filter((h) =>
        selectedHallazgos.includes(h.numeral)
      ).map((h) => `[Estándar ${h.numeral} - ${h.estandar}]: ${h.hallazgo}`);

      const todosLosHallazgos = [
        ...hallazgosSeleccionadosInfo,
        hallazgosTextoLibre ? `Hallazgos adicionales: ${hallazgosTextoLibre}` : '',
      ]
        .filter(Boolean)
        .join('\n');

      const response = await fetch('/api/plan-mejoramiento/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          empresaInfo: empresa,
          hallazgos: todosLosHallazgos,
          instruccionesAdicionales,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Ocurrió un error al generar el plan de mejora.');
      }

      const generatedPlan: PlanMejoramientoSST = await response.json();

      if (generatedPlan && Array.isArray(generatedPlan.actividades)) {
        generatedPlan.actividades = generatedPlan.actividades.map((act, idx) => ({
          ...act,
          id: act.id || `act-${Date.now().toString(36)}-${idx}-${Math.random().toString(36).substring(2, 7)}`,
        }));
      }

      onPlanGenerated(generatedPlan);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(
        err.message || 'No se pudo conectar con el servidor para generar el plan con IA.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Title Header */}
      <div className="bg-white rounded-xl p-5 sm:p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-2 text-[10px] font-bold uppercase tracking-wider text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Consultoría IA SG-SST Colombia</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 uppercase tracking-tight">
            Generador Inteligente de Plan de Mejoramiento SST
          </h2>
          <p className="text-xs text-slate-500">
            Cargue su autoevaluación o seleccione las no conformidades. La IA estructurará el Plan de Mejora bajo la metodología PHVA (Res. 0312/19 y Dec. 1072/15).
          </p>
        </div>

        <div className="flex items-center space-x-3 bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-700">
          <Building2 className="w-5 h-5 text-slate-600 flex-shrink-0" />
          <div>
            <p className="font-bold text-slate-900 uppercase">{empresa.nombre || 'Empresa sin nombre'}</p>
            <p className="text-[10px] text-slate-500 font-medium">
              {empresa.numeroEstandares} Estándares Mínimos (Riesgo {empresa.nivelRiesgo})
            </p>
          </div>
        </div>
      </div>

      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start space-x-3 text-red-900 text-xs">
          <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-bold uppercase">Atención en la generación</h4>
            <p className="text-red-800 mt-0.5">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Document Upload Section */}
      <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <div className="flex items-center space-x-2">
            <Upload className="w-4 h-4 text-emerald-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Cargar Autoevaluación de Estándares Mínimos (Excel / PDF / Texto)
            </h3>
          </div>
          <span className="text-[10px] font-bold text-slate-400 uppercase">Res. 0312</span>
        </div>

        <p className="text-xs text-slate-500">
          Sube el documento de evaluación inicial (Excel, PDF o informe de auditoría) para extraer automáticamente las no conformidades.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
          <label className="flex-1 w-full flex items-center justify-center px-4 py-3 border-2 border-dashed border-slate-300 rounded-xl hover:border-slate-400 bg-slate-50/50 cursor-pointer transition">
            <div className="flex items-center space-x-2 text-xs text-slate-600">
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span className="font-semibold">Seleccionar o arrastrar archivo (.xlsx, .pdf, .txt)</span>
            </div>
            <input
              type="file"
              accept=".xlsx, .xls, .pdf, .txt, .csv"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>

          <button
            type="button"
            onClick={() => handleExtractHallazgos()}
            disabled={isExtractingHallazgos}
            className="w-full sm:w-auto px-4 py-3 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-xs transition flex items-center justify-center space-x-2 cursor-pointer flex-shrink-0"
          >
            {isExtractingHallazgos ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Extrayendo con IA...</span>
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 text-emerald-300" />
                <span>Actualizar sección de hallazgos</span>
              </>
            )}
          </button>
        </div>

        {fileStatus && (
          <p className="text-[11px] font-medium text-emerald-800 bg-emerald-50 p-2.5 rounded-lg border border-emerald-200 flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{fileStatus}</span>
          </p>
        )}

        {extractionSuccessMsg && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-900 text-xs flex items-start space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-bold uppercase text-[10px] text-emerald-800">
                Sección de Hallazgos Actualizada
              </p>
              <p className="text-emerald-900 mt-0.5">{extractionSuccessMsg}</p>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Company Profile */}
        <div className="bg-white rounded-xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
            <span className="w-5 h-5 rounded-md bg-slate-900 text-white font-mono font-bold text-[10px] flex items-center justify-center">
              1
            </span>
            <h3 className="font-bold text-slate-900 text-xs sm:text-sm uppercase tracking-wider">
              Información General de la Empresa
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-tighter text-[10px] mb-1">
                Nombre o Razón Social *
              </label>
              <input
                type="text"
                required
                value={empresa.nombre}
                onChange={(e) => updateEmpresaState((prev) => ({ ...prev, nombre: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-1 focus:ring-slate-800"
                placeholder="Ej. Logística Integral S.A.S."
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-tighter text-[10px] mb-1">
                NIT o Identificación
              </label>
              <input
                type="text"
                value={empresa.nit}
                onChange={(e) => updateEmpresaState((prev) => ({ ...prev, nit: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-1 focus:ring-slate-800"
                placeholder="Ej. 901.234.567-8"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-tighter text-[10px] mb-1">
                Ciudad / Ubicación
              </label>
              <input
                type="text"
                value={empresa.ciudad}
                onChange={(e) => updateEmpresaState((prev) => ({ ...prev, ciudad: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-1 focus:ring-slate-800"
                placeholder="Ej. Bogotá, D.C."
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-tighter text-[10px] mb-1">
                Tamaño de la Empresa (Res. 0312)
              </label>
              <select
                value={empresa.tamanoEmpresa}
                onChange={(e) =>
                  handleTamanoChange(e.target.value as 'micro' | 'pequena' | 'mediana_grande')
                }
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-1 focus:ring-slate-800"
              >
                <option value="micro">1 a 10 trabajadores (7 Estándares Mínimos)</option>
                <option value="pequena">11 a 50 trabajadores (21 Estándares Mínimos)</option>
                <option value="mediana_grande">Más de 50 trabaj. o Riesgo IV/V (60 Estándares)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-tighter text-[10px] mb-1">
                Nivel de Riesgo ARL
              </label>
              <select
                value={empresa.nivelRiesgo}
                onChange={(e) =>
                  updateEmpresaState((prev) => ({
                    ...prev,
                    nivelRiesgo: e.target.value as 'I' | 'II' | 'III' | 'IV' | 'V',
                  }))
                }
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-1 focus:ring-slate-800"
              >
                <option value="I">Riesgo I (Mínimo - Ej. Oficinas)</option>
                <option value="II">Riesgo II (Bajo - Comercio/Almacén)</option>
                <option value="III">Riesgo III (Medio - Procesos/Manufactura)</option>
                <option value="IV">Riesgo IV (Alto - Transporte/Construcción)</option>
                <option value="V">Riesgo V (Máximo - Minería/Eléctrico)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-tighter text-[10px] mb-1">
                Cumplimiento Autoevaluación (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={empresa.porcentajeCumplimiento}
                onChange={(e) =>
                  updateEmpresaState((prev) => ({
                    ...prev,
                    porcentajeCumplimiento: parseFloat(e.target.value) || 0,
                  }))
                }
                className="w-full px-3 py-2 rounded-lg border border-slate-300 font-bold text-amber-600 focus:ring-1 focus:ring-slate-800"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block font-bold text-slate-700 uppercase tracking-tighter text-[10px] mb-1">
                Responsable del SG-SST (Licencia &amp; Curso 50 hrs)
              </label>
              <input
                type="text"
                value={empresa.responsableSGSST}
                onChange={(e) =>
                  updateEmpresaState((prev) => ({ ...prev, responsableSGSST: e.target.value }))
                }
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-1 focus:ring-slate-800"
                placeholder="Ej. JUAN CARLOS PERDOMO - Lic. 4522-SST"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-tighter text-[10px] mb-1">
                Fecha de Evaluación
              </label>
              <input
                type="date"
                value={empresa.fechaEvaluacion}
                onChange={(e) =>
                  updateEmpresaState((prev) => ({ ...prev, fechaEvaluacion: e.target.value }))
                }
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-1 focus:ring-slate-800"
              />
            </div>
          </div>
        </div>

        {/* Step 2: Select Findings from Res. 0312 */}
        <div className="bg-white rounded-xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2">
              <span className="w-5 h-5 rounded-md bg-slate-900 text-white font-mono font-bold text-[10px] flex items-center justify-center">
                2
              </span>
              <h3 className="font-bold text-slate-900 text-xs sm:text-sm uppercase tracking-wider">
                Selección de Hallazgos Frecuentes (Res. 0312 / Dec. 1072)
              </h3>
            </div>
            <span className="text-[10px] font-bold text-slate-500 uppercase">
              {selectedHallazgos.length} de {HALLAZGOS_PREDETERMINADOS.length} Seleccionados
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {HALLAZGOS_PREDETERMINADOS.map((item) => {
              const isChecked = selectedHallazgos.includes(item.numeral);
              return (
                <div
                  key={item.numeral}
                  onClick={() => handleToggleHallazgo(item.numeral)}
                  className={`p-3 rounded-xl border transition cursor-pointer flex items-start space-x-3 text-xs ${
                    isChecked
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                      : 'bg-slate-50/50 border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => {}}
                    className="mt-0.5 rounded text-slate-900 focus:ring-slate-800 w-4 h-4"
                  />
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${isChecked ? 'bg-slate-800 text-slate-200' : 'bg-slate-200 text-slate-800'}`}>
                        {item.numeral}
                      </span>
                      <span className="font-semibold">{item.estandar}</span>
                    </div>
                    <p className={`mt-1 leading-snug text-[11px] ${isChecked ? 'text-slate-300' : 'text-slate-500'}`}>
                      {item.hallazgo}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <label className="block font-bold text-slate-900 text-xs uppercase tracking-wider">
                  Hallazgos o No Conformidades Específicas
                </label>
                <p className="text-[11px] text-slate-500">
                  Describa no conformidades adicionales o use el botón de extracción con IA.
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleExtractHallazgos()}
                disabled={isExtractingHallazgos}
                className="inline-flex items-center justify-center space-x-1.5 px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white text-xs font-bold rounded-lg shadow-xs transition cursor-pointer flex-shrink-0"
              >
                {isExtractingHallazgos ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Analizando con IA...</span>
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 text-emerald-300" />
                    <span>Actualizar sección de hallazgos</span>
                  </>
                )}
              </button>
            </div>

            {/* BOTÓN DE PRUEBA PARA CARGAR EL JSON ESTÁTICO */}
            <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={handleCargarJSONEstatico}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition flex items-center space-x-2 cursor-pointer"
              >
                <FileJson2 className="w-4 h-4 text-white" />
                <span>Cargar JSON de Prueba</span>
              </button>
            </div>

            <textarea
              rows={4}
              value={hallazgosTextoLibre}
              onChange={(e) => setHallazgosTextoLibre(e.target.value)}
              className="w-full p-3.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-slate-800 text-xs text-slate-800 font-sans leading-relaxed shadow-inner"
              placeholder="Describa otros hallazgos detectados en la autoevaluación, visita de la ARL o inspección del Ministerio..."
            />
          </div>

          <div className="space-y-1">
            <label className="block font-bold text-slate-700 text-[10px] uppercase tracking-wider">
              Instrucciones o Enfoque Adicional para la IA
            </label>
            <input
              type="text"
              value={instruccionesAdicionales}
              onChange={(e) => setInstruccionesAdicionales(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-1 focus:ring-slate-800 text-xs text-slate-800"
              placeholder="Ej. Priorizar capacitación del COPASST en el primer trimestre..."
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-slate-200">
          <p className="text-xs text-slate-500 font-medium">
            Al hacer clic, la IA procesará la información y actualizará automáticamente la <strong className="text-slate-800">Sección 2: Plan de Mejoramiento SG-SST (Matriz PHVA)</strong>.
          </p>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto px-8 py-3.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition flex items-center justify-center space-x-2 cursor-pointer flex-shrink-0"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Generando Plan de Mejoramiento...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-emerald-300" />
                <span>Generar y Actualizar Plan de Mejoramiento (Sección 2)</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};