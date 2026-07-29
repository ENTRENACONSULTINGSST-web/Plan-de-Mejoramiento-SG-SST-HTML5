var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_vite = require("vite");
var import_genai = require("@google/genai");
var import_dotenv = __toESM(require("dotenv"), 1);
import_dotenv.default.config();
var app = (0, import_express.default)();
var PORT = 3e3;
app.use(import_express.default.json({ limit: "10mb" }));
var apiKey = process.env.GEMINI_API_KEY || "";
var ai = apiKey ? new import_genai.GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build"
    }
  }
}) : null;
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    hasApiKey: !!apiKey,
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  });
});
app.post("/api/plan-mejoramiento/generate", async (req, res) => {
  try {
    const { empresaInfo, hallazgos, instruccionesAdicionales } = req.body;
    if (!empresaInfo || !empresaInfo.nombre) {
      return res.status(400).json({
        error: "Se requiere la informaci\xF3n de la empresa (empresaInfo.nombre)."
      });
    }
    if (!ai) {
      return res.status(503).json({
        error: "La API Key de Gemini no est\xE1 configurada en el servidor. Configure GEMINI_API_KEY en las variables de entorno."
      });
    }
    const currentDate = /* @__PURE__ */ new Date();
    const currentYear = currentDate.getFullYear();
    const monthKeys = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
    const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    const currentMonthIdx = currentDate.getMonth();
    const currentMonthKey = monthKeys[currentMonthIdx];
    const currentMonthName = monthNames[currentMonthIdx];
    const pastMonthKeys = monthKeys.slice(0, currentMonthIdx);
    const futureMonthKeys = monthKeys.slice(currentMonthIdx);
    const promptText = `
    INSTRUCCIONES PARA EL CONSULTOR EXPERTO SG-SST (COLOMBIA):
    Act\xFAa como un Consultor Experto en Seguridad y Salud en el Trabajo (SG-SST) en Colombia, con profundo conocimiento del Decreto 1072 de 2015 y la Resoluci\xF3n 0312 de 2019.
    
    INFORMACI\xD3N DE LA EMPRESA EVALUADA:
    - Nombre de la Empresa: ${empresaInfo.nombre}
    - NIT: ${empresaInfo.nit || "No especificado"}
    - Tama\xF1o de Empresa: ${empresaInfo.tamanoEmpresa} (${empresaInfo.numeroEstandares || 21} Est\xE1ndares M\xEDnimos / Evaluables Decreto 1072)
    - Nivel de Riesgo ARL: Riesgo ${empresaInfo.nivelRiesgo || "III"}
    - Porcentaje Actual de Cumplimiento: ${empresaInfo.porcentajeCumplimiento}%
    - Responsable SG-SST: ${empresaInfo.responsableSGSST || "Por asignar"}
    - Fecha de Evaluaci\xF3n: ${empresaInfo.fechaEvaluacion || currentDate.toISOString().split("T")[0]}
    - Ciudad / Ubicaci\xF3n: ${empresaInfo.ciudad || "Colombia"}

    HALLAZGOS DE AUTOEVALUACI\xD3N Y NO CONFORMIDADES REPORTADAS:
    ${typeof hallazgos === "string" ? hallazgos : JSON.stringify(hallazgos, null, 2)}

    INSTRUCCIONES ADICIONALES DEL CLIENTE:
    ${instruccionesAdicionales || "Ninguna"}

    REQUISITOS OBLIGATORIOS PARA EL PLAN DE MEJORAMIENTO:
    1. El diagnosticoGeneral y clasificacionLegal DEBEN mencionar exactamente el porcentaje actual de cumplimiento de la empresa (${empresaInfo.porcentajeCumplimiento}%) y el nombre de la empresa (${empresaInfo.nombre}). NUNCA uses cifras est\xE1ticas como "58.5%" a menos que ese sea el valor exacto enviado.
       - Si es < 60%: Clasificaci\xF3n CR\xCDTICO (< 60%).
       - Si es 60% a 85%: Clasificaci\xF3n MODERADAMENTE ACEPTABLE (60% - 85%).
       - Si es > 85%: Clasificaci\xF3n ACEPTABLE (> 85%).
    2. REGLA DE CALENDARIO EN TIEMPO REAL:
       - Fecha actual de generaci\xF3n: ${currentDate.toISOString().split("T")[0]} (A\xF1o ${currentYear}, Mes actual: ${currentMonthName.toUpperCase()} - ${currentMonthKey}).
       - CADA actividad a planear DEBE programarse en TIEMPO REAL: en el mes actual (${currentMonthName.toUpperCase()}) y en los meses FUTUROS (${futureMonthKeys.map((m) => m.toUpperCase()).join(", ")}).
       - Queda ESTRICTAMENTE PROHIBIDO marcar 'planeado': true en meses PASADOS del a\xF1o (${pastMonthKeys.length > 0 ? pastMonthKeys.map((m) => m.toUpperCase()).join(", ") : "Ninguno"}), a menos que la actividad ya se haya ejecutado realmente ('ejecutado': true).
    3. Generar la Matriz de Actividades y Cronograma (PHVA) completa resolviendo CADA UNO de los hallazgos y no conformidades reportadas.
    4. Clasificar CADA actividad en la matriz indicando:
       - Numeral del est\xE1ndar (Res. 0312 / Dec 1072, ej: "1.1.1", "1.1.2", "1.2.1", "2.1.1", "2.2.1", "2.5.1", "3.1.1", "4.1.2", "5.1.1", "5.2.1", "6.1.1", "7.1.1", etc.)
       - Descripci\xF3n del est\xE1ndar
       - Descripci\xF3n del hallazgo o incumplimiento
       - Fase PHVA correspondiente ("PLANEAR", "HACER", "VERIFICAR", "ACTUAR")
       - Actividad a desarrollar (Acci\xF3n clara, medible y ejecutable con lenguaje normativo colombiano)
       - Planeaci\xF3n mensual: distribuci\xF3n en las 12 claves del a\xF1o ("ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"). Cada mes debe ser un objeto { "planeado": boolean, "ejecutado": boolean }.
       - Responsable(s) (ej: "Gerencia General / Alta Direcci\xF3n", "Responsable SG-SST", "COPASST", "ARL", "IPS M\xE9dico Ocupacional")
       - Evidencia requerida (documentaci\xF3n u operaci\xF3n demostrable)
       - Observaciones (Art\xEDculos espec\xEDficos del Decreto 1072/2015 y Res 0312/2019)
       - Recurso asignado ("Humano", "T\xE9cnico", "Financiero", "Locativo")
    5. Garantizar que el lenguaje cumpla rigurosamente con la normativa legal colombiana vigente.
    `;
    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: promptText,
      config: {
        systemInstruction: "Eres un Consultor Experto en SG-SST en Colombia (Decreto 1072 de 2015 y Resoluci\xF3n 0312 de 2019). Devuelve la respuesta en formato JSON estructurado siguiendo el esquema solicitado.",
        temperature: 0.2,
        responseMimeType: "application/json",
        responseSchema: {
          type: import_genai.Type.OBJECT,
          properties: {
            empresaInfo: {
              type: import_genai.Type.OBJECT,
              properties: {
                nombre: { type: import_genai.Type.STRING },
                nit: { type: import_genai.Type.STRING },
                tamanoEmpresa: { type: import_genai.Type.STRING },
                nivelRiesgo: { type: import_genai.Type.STRING },
                numeroEstandares: { type: import_genai.Type.INTEGER },
                porcentajeCumplimiento: { type: import_genai.Type.NUMBER },
                responsableSGSST: { type: import_genai.Type.STRING },
                fechaEvaluacion: { type: import_genai.Type.STRING },
                ciudad: { type: import_genai.Type.STRING }
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
                "ciudad"
              ]
            },
            resumenEjecutivo: {
              type: import_genai.Type.OBJECT,
              properties: {
                clasificacionLegal: { type: import_genai.Type.STRING },
                diagnosticoGeneral: { type: import_genai.Type.STRING },
                prioridadesInmediatas: {
                  type: import_genai.Type.ARRAY,
                  items: { type: import_genai.Type.STRING }
                },
                maroLegalAplicable: {
                  type: import_genai.Type.ARRAY,
                  items: { type: import_genai.Type.STRING }
                }
              },
              required: [
                "clasificacionLegal",
                "diagnosticoGeneral",
                "prioridadesInmediatas",
                "maroLegalAplicable"
              ]
            },
            actividades: {
              type: import_genai.Type.ARRAY,
              items: {
                type: import_genai.Type.OBJECT,
                properties: {
                  id: { type: import_genai.Type.STRING },
                  numeralEstandar: { type: import_genai.Type.STRING },
                  descripcionEstandar: { type: import_genai.Type.STRING },
                  hallazgo: { type: import_genai.Type.STRING },
                  phva: { type: import_genai.Type.STRING },
                  actividad: { type: import_genai.Type.STRING },
                  planeacionMensual: {
                    type: import_genai.Type.OBJECT,
                    properties: {
                      ene: {
                        type: import_genai.Type.OBJECT,
                        properties: {
                          planeado: { type: import_genai.Type.BOOLEAN },
                          ejecutado: { type: import_genai.Type.BOOLEAN }
                        }
                      },
                      feb: {
                        type: import_genai.Type.OBJECT,
                        properties: {
                          planeado: { type: import_genai.Type.BOOLEAN },
                          ejecutado: { type: import_genai.Type.BOOLEAN }
                        }
                      },
                      mar: {
                        type: import_genai.Type.OBJECT,
                        properties: {
                          planeado: { type: import_genai.Type.BOOLEAN },
                          ejecutado: { type: import_genai.Type.BOOLEAN }
                        }
                      },
                      abr: {
                        type: import_genai.Type.OBJECT,
                        properties: {
                          planeado: { type: import_genai.Type.BOOLEAN },
                          ejecutado: { type: import_genai.Type.BOOLEAN }
                        }
                      },
                      may: {
                        type: import_genai.Type.OBJECT,
                        properties: {
                          planeado: { type: import_genai.Type.BOOLEAN },
                          ejecutado: { type: import_genai.Type.BOOLEAN }
                        }
                      },
                      jun: {
                        type: import_genai.Type.OBJECT,
                        properties: {
                          planeado: { type: import_genai.Type.BOOLEAN },
                          ejecutado: { type: import_genai.Type.BOOLEAN }
                        }
                      },
                      jul: {
                        type: import_genai.Type.OBJECT,
                        properties: {
                          planeado: { type: import_genai.Type.BOOLEAN },
                          ejecutado: { type: import_genai.Type.BOOLEAN }
                        }
                      },
                      ago: {
                        type: import_genai.Type.OBJECT,
                        properties: {
                          planeado: { type: import_genai.Type.BOOLEAN },
                          ejecutado: { type: import_genai.Type.BOOLEAN }
                        }
                      },
                      sep: {
                        type: import_genai.Type.OBJECT,
                        properties: {
                          planeado: { type: import_genai.Type.BOOLEAN },
                          ejecutado: { type: import_genai.Type.BOOLEAN }
                        }
                      },
                      oct: {
                        type: import_genai.Type.OBJECT,
                        properties: {
                          planeado: { type: import_genai.Type.BOOLEAN },
                          ejecutado: { type: import_genai.Type.BOOLEAN }
                        }
                      },
                      nov: {
                        type: import_genai.Type.OBJECT,
                        properties: {
                          planeado: { type: import_genai.Type.BOOLEAN },
                          ejecutado: { type: import_genai.Type.BOOLEAN }
                        }
                      },
                      dic: {
                        type: import_genai.Type.OBJECT,
                        properties: {
                          planeado: { type: import_genai.Type.BOOLEAN },
                          ejecutado: { type: import_genai.Type.BOOLEAN }
                        }
                      }
                    }
                  },
                  responsable: { type: import_genai.Type.STRING },
                  evidenciaRequerida: { type: import_genai.Type.STRING },
                  observaciones: { type: import_genai.Type.STRING },
                  recursoAsignado: { type: import_genai.Type.STRING }
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
                  "recursoAsignado"
                ]
              }
            }
          },
          required: ["empresaInfo", "resumenEjecutivo", "actividades"]
        }
      }
    });
    const textOutput = response.text || "";
    const parsedData = JSON.parse(textOutput);
    if (parsedData && Array.isArray(parsedData.actividades)) {
      parsedData.actividades = parsedData.actividades.map((act, idx) => ({
        ...act,
        id: act.id || `act-${Date.now().toString(36)}-${idx}-${Math.random().toString(36).substring(2, 7)}`
      }));
    }
    return res.json(parsedData);
  } catch (error) {
    console.error("Error generating Plan de Mejora SST:", error);
    return res.status(500).json({
      error: error?.message || "Error al generar el Plan de Mejora SST."
    });
  }
});
app.post("/api/plan-mejoramiento/extract-hallazgos", async (req, res) => {
  try {
    const { documentoTexto, empresaInfo } = req.body;
    if (!ai) {
      return res.status(503).json({
        error: "La API Key de Gemini no est\xE1 configurada en el servidor."
      });
    }
    const promptText = `
    INSTRUCCIONES PARA EL CONSULTOR AUDITOR SG-SST (COLOMBIA):
    Act\xFAa como un Auditor Experto en Seguridad y Salud en el Trabajo (SG-SST) bajo la Resoluci\xF3n 0312 de 2019 y Decreto 1072 de 2015 en Colombia.

    INFORMACI\xD3N DE LA EMPRESA:
    - Nombre: ${empresaInfo?.nombre || "Empresa en Evaluaci\xF3n"}
    - Tama\xF1o: ${empresaInfo?.tamanoEmpresa || "pequena"} (${empresaInfo?.numeroEstandares || 21} Est\xE1ndares M\xEDnimos / 71 \xCDtems Evaluables)
    - Nivel de Riesgo ARL: ${empresaInfo?.nivelRiesgo || "III"}
    - % Cumplimiento Registrado: ${empresaInfo?.porcentajeCumplimiento || 50}%

    DOCUMENTO O TEXTO A ANALIZAR (AUTOEVALUACI\xD3N DE 71 \xCDTEMS DECCRETO 1072 / RES 0312 / AUDITOR\xCDA / INFORME):
    ${documentoTexto || "Sin documento adjunto."}

    TAREA Y REQUISITOS:
    1. Analizar minuciosamente el texto o tabla. El documento puede contener la autoevaluaci\xF3n completa de 60 est\xE1ndares o 71 \xEDtems del Decreto 1072.
    2. Extraer TODAS las no conformidades, incumplimientos o \xEDtems marcados como "NO CUMPLE", "0%", "PENDIENTE", "NO REALIZADO", "PARCIAL" o "NO APLICA SIN JUSTIFICACI\xD3N".
    3. Identificar TODOS los numerales de los est\xE1ndares o \xEDtems que presentan no conformidad (ej: ["1.1.1", "1.1.2", "1.1.3", "1.1.4", "1.2.1", "1.2.2", "1.2.3", "2.1.1", "2.2.1", "2.3.1", "2.4.1", "2.5.1", "2.7.1", "2.8.1", "2.10.1", "2.11.1", "3.1.1", "3.1.2", "3.1.3", "4.1.1", "4.1.2", "4.2.1", "4.2.2", "5.1.1", "5.2.1", "6.1.1", "6.1.2", "6.1.3", "6.1.4", "7.1.1"]). Extrae TODOS los numerales correspondientes a no conformidades sin omitir ninguno.
    4. Si en el documento se especifica un porcentaje global de cumplimiento calculado o puntaje total obtenido (ej: 58.5%, 72.0%, 85.0%), devu\xE9lvelo en 'porcentajeCalculado'.
    5. Presentar 'hallazgosTexto' como un listado claro en vi\xF1etas ordenado por ciclo PHVA con terminolog\xEDa t\xE9cnica oficial del SG-SST en Colombia.
    `;
    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: promptText,
      config: {
        systemInstruction: "Extrae y estructura exhaustivamente las no conformidades de la autoevaluaci\xF3n SG-SST (Decreto 1072 / Res 0312) en formato JSON.",
        temperature: 0.2,
        responseMimeType: "application/json",
        responseSchema: {
          type: import_genai.Type.OBJECT,
          properties: {
            hallazgosTexto: {
              type: import_genai.Type.STRING,
              description: "Texto formateado en vi\xF1etas con la lista detallada de todas las no conformidades extra\xEDdas."
            },
            numeralesEstandar: {
              type: import_genai.Type.ARRAY,
              items: { type: import_genai.Type.STRING },
              description: "Lista de todos los numerales de est\xE1ndares o \xEDtems con hallazgo (ej: ['1.1.1', '1.1.2', '2.2.1', '5.1.1'])"
            },
            porcentajeCalculado: {
              type: import_genai.Type.NUMBER,
              description: "Porcentaje de cumplimiento detectado o calculado en la autoevaluaci\xF3n (ej: 65 textualmente o 65.5). Opcional si no aparece."
            },
            resumenInconformidades: {
              type: import_genai.Type.STRING,
              description: "Diagn\xF3stico ejecutivo o resumen sint\xE9tico del an\xE1lisis realizado."
            }
          },
          required: ["hallazgosTexto", "numeralesEstandar", "resumenInconformidades"]
        }
      }
    });
    const parsed = JSON.parse(response.text || "{}");
    return res.json(parsed);
  } catch (error) {
    console.error("Error extrayendo hallazgos:", error);
    return res.status(500).json({
      error: error?.message || "Error al extraer no conformidades con IA."
    });
  }
});
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
