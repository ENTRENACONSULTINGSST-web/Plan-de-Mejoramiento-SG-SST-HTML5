import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEY || "";
const ai = apiKey
  ? new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    })
  : null;

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    hasApiKey: !!apiKey,
    timestamp: new Date().toISOString(),
  });
});

// Endpoint to generate Plan de Mejoramiento SST based on findings and company profile
app.post("/api/plan-mejoramiento/generate", async (req, res) => {
  try {
    const { empresaInfo, hallazgos, instruccionesAdicionales } = req.body;

    if (!empresaInfo || !empresaInfo.nombre) {
      return res.status(400).json({
        error: "Se requiere la información de la empresa (empresaInfo.nombre).",
      });
    }

    if (!ai) {
      return res.status(503).json({
        error:
          "La API Key de Gemini no está configurada en el servidor. Configure GEMINI_API_KEY en las variables de entorno.",
      });
    }

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const monthKeys = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
    const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    const currentMonthIdx = currentDate.getMonth(); // 0-based index
    const currentMonthKey = monthKeys[currentMonthIdx];
    const currentMonthName = monthNames[currentMonthIdx];
    const pastMonthKeys = monthKeys.slice(0, currentMonthIdx);
    const futureMonthKeys = monthKeys.slice(currentMonthIdx);

    const promptText = `
    INSTRUCCIONES PARA EL CONSULTOR EXPERTO SG-SST (COLOMBIA):
    Actúa como un Consultor Experto en Seguridad y Salud en el Trabajo (SG-SST) en Colombia, con profundo conocimiento del Decreto 1072 de 2015 y la Resolución 0312 de 2019.
    
    INFORMACIÓN DE LA EMPRESA EVALUADA:
    - Nombre de la Empresa: ${empresaInfo.nombre}
    - NIT: ${empresaInfo.nit || "No especificado"}
    - Tamaño de Empresa: ${empresaInfo.tamanoEmpresa} (${empresaInfo.numeroEstandares || 21} Estándares Mínimos / Evaluables Decreto 1072)
    - Nivel de Riesgo ARL: Riesgo ${empresaInfo.nivelRiesgo || "III"}
    - Porcentaje Actual de Cumplimiento: ${empresaInfo.porcentajeCumplimiento}%
    - Responsable SG-SST: ${empresaInfo.responsableSGSST || "Por asignar"}
    - Fecha de Evaluación: ${empresaInfo.fechaEvaluacion || currentDate.toISOString().split("T")[0]}
    - Ciudad / Ubicación: ${empresaInfo.ciudad || "Colombia"}

    HALLAZGOS DE AUTOEVALUACIÓN Y NO CONFORMIDADES REPORTADAS:
    ${typeof hallazgos === "string" ? hallazgos : JSON.stringify(hallazgos, null, 2)}

    INSTRUCCIONES ADICIONALES DEL CLIENTE:
    ${instruccionesAdicionales || "Ninguna"}

    REQUISITOS OBLIGATORIOS PARA EL PLAN DE MEJORAMIENTO:
    1. El diagnosticoGeneral y clasificacionLegal DEBEN mencionar exactamente el porcentaje actual de cumplimiento de la empresa (${empresaInfo.porcentajeCumplimiento}%) y el nombre de la empresa (${empresaInfo.nombre}). NUNCA uses cifras estáticas como "58.5%" a menos que ese sea el valor exacto enviado.
       - Si es < 60%: Clasificación CRÍTICO (< 60%).
       - Si es 60% a 85%: Clasificación MODERADAMENTE ACEPTABLE (60% - 85%).
       - Si es > 85%: Clasificación ACEPTABLE (> 85%).
    2. REGLA DE CALENDARIO EN TIEMPO REAL:
       - Fecha actual de generación: ${currentDate.toISOString().split("T")[0]} (Año ${currentYear}, Mes actual: ${currentMonthName.toUpperCase()} - ${currentMonthKey}).
       - CADA actividad a planear DEBE programarse en TIEMPO REAL: en el mes actual (${currentMonthName.toUpperCase()}) y en los meses FUTUROS (${futureMonthKeys.map((m) => m.toUpperCase()).join(", ")}).
       - Queda ESTRICTAMENTE PROHIBIDO marcar 'planeado': true en meses PASADOS del año (${pastMonthKeys.length > 0 ? pastMonthKeys.map((m) => m.toUpperCase()).join(", ") : "Ninguno"}), a menos que la actividad ya se haya ejecutado realmente ('ejecutado': true).
    3. Generar la Matriz de Actividades y Cronograma (PHVA) completa resolviendo CADA UNO de los hallazgos y no conformidades reportadas.
    4. Clasificar CADA actividad en la matriz indicando:
       - Numeral del estándar (Res. 0312 / Dec 1072, ej: "1.1.1", "1.1.2", "1.2.1", "2.1.1", "2.2.1", "2.5.1", "3.1.1", "4.1.2", "5.1.1", "5.2.1", "6.1.1", "7.1.1", etc.)
       - Descripción del estándar
       - Descripción del hallazgo o incumplimiento
       - Fase PHVA correspondiente ("PLANEAR", "HACER", "VERIFICAR", "ACTUAR")
       - Actividad a desarrollar (Acción clara, medible y ejecutable con lenguaje normativo colombiano)
       - Planeación mensual: distribución en las 12 claves del año ("ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"). Cada mes debe ser un objeto { "planeado": boolean, "ejecutado": boolean }.
       - Responsable(s) (ej: "Gerencia General / Alta Dirección", "Responsable SG-SST", "COPASST", "ARL", "IPS Médico Ocupacional")
       - Evidencia requerida (documentación u operación demostrable)
       - Observaciones (Artículos específicos del Decreto 1072/2015 y Res 0312/2019)
       - Recurso asignado ("Humano", "Técnico", "Financiero", "Locativo")
    5. Garantizar que el lenguaje cumpla rigurosamente con la normativa legal colombiana vigente.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: promptText,
      config: {
        systemInstruction:
          "Eres un Consultor Experto en SG-SST en Colombia (Decreto 1072 de 2015 y Resolución 0312 de 2019). Devuelve la respuesta en formato JSON estructurado siguiendo el esquema solicitado.",
        temperature: 0.2,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            empresaInfo: {
              type: Type.OBJECT,
              properties: {
                nombre: { type: Type.STRING },
                nit: { type: Type.STRING },
                tamanoEmpresa: { type: Type.STRING },
                nivelRiesgo: { type: Type.STRING },
                numeroEstandares: { type: Type.INTEGER },
                porcentajeCumplimiento: { type: Type.NUMBER },
                responsableSGSST: { type: Type.STRING },
                fechaEvaluacion: { type: Type.STRING },
                ciudad: { type: Type.STRING },
              },
              required: [
                "nombre",
                "nit",
                "tamanoEmpresa",
                "nivelRiesgo",
                "numeroEstandares",
                "porcentajeCumplimiento",
                "responsableSGSST",
                "fechaEvaluacion",
                "ciudad",
              ],
            },
            resumenEjecutivo: {
              type: Type.OBJECT,
              properties: {
                clasificacionLegal: { type: Type.STRING },
                diagnosticoGeneral: { type: Type.STRING },
                prioridadesInmediatas: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                maroLegalAplicable: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
              },
              required: [
                "clasificacionLegal",
                "diagnosticoGeneral",
                "prioridadesInmediatas",
                "maroLegalAplicable",
              ],
            },
            actividades: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  numeralEstandar: { type: Type.STRING },
                  descripcionEstandar: { type: Type.STRING },
                  hallazgo: { type: Type.STRING },
                  phva: { type: Type.STRING },
                  actividad: { type: Type.STRING },
                  planeacionMensual: {
                    type: Type.OBJECT,
                    properties: {
                      ene: {
                        type: Type.OBJECT,
                        properties: {
                          planeado: { type: Type.BOOLEAN },
                          ejecutado: { type: Type.BOOLEAN },
                        },
                      },
                      feb: {
                        type: Type.OBJECT,
                        properties: {
                          planeado: { type: Type.BOOLEAN },
                          ejecutado: { type: Type.BOOLEAN },
                        },
                      },
                      mar: {
                        type: Type.OBJECT,
                        properties: {
                          planeado: { type: Type.BOOLEAN },
                          ejecutado: { type: Type.BOOLEAN },
                        },
                      },
                      abr: {
                        type: Type.OBJECT,
                        properties: {
                          planeado: { type: Type.BOOLEAN },
                          ejecutado: { type: Type.BOOLEAN },
                        },
                      },
                      may: {
                        type: Type.OBJECT,
                        properties: {
                          planeado: { type: Type.BOOLEAN },
                          ejecutado: { type: Type.BOOLEAN },
                        },
                      },
                      jun: {
                        type: Type.OBJECT,
                        properties: {
                          planeado: { type: Type.BOOLEAN },
                          ejecutado: { type: Type.BOOLEAN },
                        },
                      },
                      jul: {
                        type: Type.OBJECT,
                        properties: {
                          planeado: { type: Type.BOOLEAN },
                          ejecutado: { type: Type.BOOLEAN },
                        },
                      },
                      ago: {
                        type: Type.OBJECT,
                        properties: {
                          planeado: { type: Type.BOOLEAN },
                          ejecutado: { type: Type.BOOLEAN },
                        },
                      },
                      sep: {
                        type: Type.OBJECT,
                        properties: {
                          planeado: { type: Type.BOOLEAN },
                          ejecutado: { type: Type.BOOLEAN },
                        },
                      },
                      oct: {
                        type: Type.OBJECT,
                        properties: {
                          planeado: { type: Type.BOOLEAN },
                          ejecutado: { type: Type.BOOLEAN },
                        },
                      },
                      nov: {
                        type: Type.OBJECT,
                        properties: {
                          planeado: { type: Type.BOOLEAN },
                          ejecutado: { type: Type.BOOLEAN },
                        },
                      },
                      dic: {
                        type: Type.OBJECT,
                        properties: {
                          planeado: { type: Type.BOOLEAN },
                          ejecutado: { type: Type.BOOLEAN },
                        },
                      },
                    },
                  },
                  responsable: { type: Type.STRING },
                  evidenciaRequerida: { type: Type.STRING },
                  observaciones: { type: Type.STRING },
                  recursoAsignado: { type: Type.STRING },
                },
                required: [
                  "id",
                  "numeralEstandar",
                  "descripcionEstandar",
                  "hallazgo",
                  "phva",
                  "actividad",
                  "planeacionMensual",
                  "responsable",
                  "evidenciaRequerida",
                  "observaciones",
                  "recursoAsignado",
                ],
              },
            },
          },
          required: ["empresaInfo", "resumenEjecutivo", "actividades"],
        },
      },
    });

    const textOutput = response.text || "";
    const parsedData = JSON.parse(textOutput);

    if (parsedData && Array.isArray(parsedData.actividades)) {
      parsedData.actividades = parsedData.actividades.map((act: any, idx: number) => ({
        ...act,
        id: act.id || `act-${Date.now().toString(36)}-${idx}-${Math.random().toString(36).substring(2, 7)}`,
      }));
    }

    return res.json(parsedData);
  } catch (error: any) {
    console.error("Error generating Plan de Mejora SST:", error);
    return res.status(500).json({
      error: error?.message || "Error al generar el Plan de Mejora SST.",
    });
  }
});

// Endpoint to analyze document/text and automatically extract non-conformities (hallazgos)
app.post("/api/plan-mejoramiento/extract-hallazgos", async (req, res) => {
  try {
    const { documentoTexto, empresaInfo } = req.body;

    if (!ai) {
      return res.status(503).json({
        error: "La API Key de Gemini no está configurada en el servidor.",
      });
    }

    const promptText = `
    INSTRUCCIONES PARA EL CONSULTOR AUDITOR SG-SST (COLOMBIA):
    Actúa como un Auditor Experto en Seguridad y Salud en el Trabajo (SG-SST) bajo la Resolución 0312 de 2019 y Decreto 1072 de 2015 en Colombia.

    INFORMACIÓN DE LA EMPRESA:
    - Nombre: ${empresaInfo?.nombre || "Empresa en Evaluación"}
    - Tamaño: ${empresaInfo?.tamanoEmpresa || "pequena"} (${empresaInfo?.numeroEstandares || 21} Estándares Mínimos / 71 Ítems Evaluables)
    - Nivel de Riesgo ARL: ${empresaInfo?.nivelRiesgo || "III"}
    - % Cumplimiento Registrado: ${empresaInfo?.porcentajeCumplimiento || 50}%

    DOCUMENTO O TEXTO A ANALIZAR (AUTOEVALUACIÓN DE 71 ÍTEMS DECCRETO 1072 / RES 0312 / AUDITORÍA / INFORME):
    ${documentoTexto || "Sin documento adjunto."}

    TAREA Y REQUISITOS:
    1. Analizar minuciosamente el texto o tabla. El documento puede contener la autoevaluación completa de 60 estándares o 71 ítems del Decreto 1072.
    2. Extraer TODAS las no conformidades, incumplimientos o ítems marcados como "NO CUMPLE", "0%", "PENDIENTE", "NO REALIZADO", "PARCIAL" o "NO APLICA SIN JUSTIFICACIÓN".
    3. Identificar TODOS los numerales de los estándares o ítems que presentan no conformidad (ej: ["1.1.1", "1.1.2", "1.1.3", "1.1.4", "1.2.1", "1.2.2", "1.2.3", "2.1.1", "2.2.1", "2.3.1", "2.4.1", "2.5.1", "2.7.1", "2.8.1", "2.10.1", "2.11.1", "3.1.1", "3.1.2", "3.1.3", "4.1.1", "4.1.2", "4.2.1", "4.2.2", "5.1.1", "5.2.1", "6.1.1", "6.1.2", "6.1.3", "6.1.4", "7.1.1"]). Extrae TODOS los numerales correspondientes a no conformidades sin omitir ninguno.
    4. Si en el documento se especifica un porcentaje global de cumplimiento calculado o puntaje total obtenido (ej: 58.5%, 72.0%, 85.0%), devuélvelo en 'porcentajeCalculado'.
    5. Presentar 'hallazgosTexto' como un listado claro en viñetas ordenado por ciclo PHVA con terminología técnica oficial del SG-SST en Colombia.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: promptText,
      config: {
        systemInstruction:
          "Extrae y estructura exhaustivamente las no conformidades de la autoevaluación SG-SST (Decreto 1072 / Res 0312) en formato JSON.",
        temperature: 0.2,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            hallazgosTexto: {
              type: Type.STRING,
              description: "Texto formateado en viñetas con la lista detallada de todas las no conformidades extraídas.",
            },
            numeralesEstandar: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Lista de todos los numerales de estándares o ítems con hallazgo (ej: ['1.1.1', '1.1.2', '2.2.1', '5.1.1'])",
            },
            porcentajeCalculado: {
              type: Type.NUMBER,
              description: "Porcentaje de cumplimiento detectado o calculado en la autoevaluación (ej: 65 textualmente o 65.5). Opcional si no aparece.",
            },
            resumenInconformidades: {
              type: Type.STRING,
              description: "Diagnóstico ejecutivo o resumen sintético del análisis realizado.",
            },
          },
          required: ["hallazgosTexto", "numeralesEstandar", "resumenInconformidades"],
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    return res.json(parsed);
  } catch (error: any) {
    console.error("Error extrayendo hallazgos:", error);
    return res.status(500).json({
      error: error?.message || "Error al extraer no conformidades con IA.",
    });
  }
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
