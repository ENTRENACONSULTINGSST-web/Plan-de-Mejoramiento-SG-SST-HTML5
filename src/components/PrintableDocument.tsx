import React, { useState } from 'react';
import { PlanMejoramientoSST, MonthKey } from '../types';
import { ShieldCheck, Printer, FileDown, Loader2, CheckCircle2 } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface PrintableDocumentProps {
  plan: PlanMejoramientoSST;
}

const MONTHS_LIST: { key: MonthKey; label: string }[] = [
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

export const PrintableDocument: React.FC<PrintableDocumentProps> = ({ plan }) => {
  const { empresaInfo, resumenEjecutivo, actividades } = plan;
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [pdfSuccess, setPdfSuccess] = useState(false);

  const handleDownloadPdf = () => {
    setIsGeneratingPdf(true);
    setPdfSuccess(false);

    try {
      const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'letter',
      });

      const safeName = (empresaInfo.nombre || 'Empresa').replace(/[^a-zA-Z0-9]/g, '_');
      const filename = `Plan_Mejoramiento_SST_${safeName}_${empresaInfo.fechaEvaluacion || '2026'}.pdf`;

      // Header Banner
      doc.setFillColor(15, 23, 42); // slate-900
      doc.rect(10, 10, 259, 14, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.text('PLAN DE MEJORAMIENTO DEL SG-SST (RESOLUCIÓN 0312 DE 2019 / DECRETO 1072 DE 2015)', 14, 18);

      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.text(`Código: PM-SST-2026-01  |  Fecha: ${empresaInfo.fechaEvaluacion || '2026-07-29'}  |  Versión 1.0`, 160, 18);

      // Section 1: Company Info
      doc.setFillColor(241, 245, 249); // slate-100
      doc.rect(10, 26, 259, 20, 'F');
      doc.setDrawColor(203, 213, 225);
      doc.rect(10, 26, 259, 20, 'S');

      doc.setTextColor(15, 23, 42);
      doc.setFontSize(8.5);
      doc.setFont('helvetica', 'bold');
      doc.text('1. INFORMACIÓN DE LA EMPRESA EVALUADA', 13, 31);

      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.text(`Razón Social: ${empresaInfo.nombre}`, 13, 37);
      doc.text(`NIT: ${empresaInfo.nit || 'N/A'}`, 110, 37);
      doc.text(`Nivel de Riesgo: Riesgo ${empresaInfo.nivelRiesgo}`, 180, 37);

      doc.text(`Cumplimiento: ${empresaInfo.porcentajeCumplimiento}% (${resumenEjecutivo.clasificacionLegal || 'Por evaluar'})`, 13, 42);
      doc.text(`Ubicación: ${empresaInfo.ciudad || 'Colombia'}`, 110, 42);
      doc.text(`Responsable SG-SST: ${empresaInfo.responsableSGSST || 'Por asignar'}`, 180, 42);

      // Section 2: Executive Summary
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.text('2. DIAGNÓSTICO EJECUTIVO:', 13, 51);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      const diagLines = doc.splitTextToSize(resumenEjecutivo.diagnosticoGeneral || 'Sin diagnóstico registrado.', 250);
      doc.text(diagLines, 13, 55);

      const startY = 55 + (diagLines.length * 3.2) + 2;

      // Section 3: Matrix AutoTable
      const tableData = actividades.map((act) => {
        const sched = MONTHS_LIST.map((m) => {
          const st = act.planeacionMensual[m.key];
          if (st?.planeado && st?.ejecutado) return `${m.label}:P/E`;
          if (st?.planeado) return `${m.label}:P`;
          if (st?.ejecutado) return `${m.label}:E`;
          return `${m.label}:-`;
        }).join(' ');

        return [
          act.numeralEstandar || '-',
          act.phva || '-',
          act.hallazgo || '-',
          act.actividad || '-',
          act.responsable || '-',
          act.evidenciaRequerida || '-',
          act.recursoAsignado || '-',
          sched,
        ];
      });

      autoTable(doc, {
        startY: startY,
        head: [
          [
            'Numeral',
            'PHVA',
            'Hallazgo / Incumplimiento',
            'Actividad a Desarrollar',
            'Responsable',
            'Evidencia Requerida',
            'Recurso',
            'Cronograma (Meses)',
          ],
        ],
        body: tableData,
        theme: 'grid',
        headStyles: {
          fillColor: [30, 41, 59],
          textColor: [255, 255, 255],
          fontSize: 7.5,
          fontStyle: 'bold',
          halign: 'center',
        },
        bodyStyles: {
          fontSize: 7,
          textColor: [15, 23, 42],
          cellPadding: 1.5,
        },
        columnStyles: {
          0: { cellWidth: 16, fontStyle: 'bold', halign: 'center' },
          1: { cellWidth: 14, fontStyle: 'bold', halign: 'center' },
          2: { cellWidth: 42 },
          3: { cellWidth: 50, fontStyle: 'bold' },
          4: { cellWidth: 28 },
          5: { cellWidth: 32 },
          6: { cellWidth: 18, halign: 'center' },
          7: { cellWidth: 58, fontSize: 6 },
        },
        margin: { left: 10, right: 10 },
        didDrawPage: () => {
          const pageCount = (doc as any).internal.getNumberOfPages();
          doc.setFontSize(7);
          doc.setTextColor(100);
          doc.text(
            `Página ${pageCount} - Plan de Mejoramiento SG-SST ${empresaInfo.nombre} - Res. 0312 de 2019`,
            10,
            205
          );
        },
      });

      doc.save(filename);
      setPdfSuccess(true);
      setTimeout(() => setPdfSuccess(false), 3500);
    } catch (err) {
      console.error('Error al generar PDF con jsPDF:', err);
      handlePrint();
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handlePrint = () => {
    try {
      const element = document.getElementById('printable-document-container');
      if (!element) {
        window.print();
        return;
      }

      const printWindow = window.open('', '_blank', 'width=1200,height=900');
      if (printWindow) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html lang="es">
            <head>
              <meta charset="utf-8">
              <title>Plan de Mejoramiento SG-SST - ${empresaInfo.nombre || 'Empresa'}</title>
              <style>
                @media print {
                  @page { size: landscape; margin: 10mm; }
                  body { font-family: system-ui, -apple-system, sans-serif; background: #fff; color: #000; margin: 0; padding: 0; }
                  .no-print { display: none !important; }
                }
                body { font-family: system-ui, -apple-system, sans-serif; padding: 20px; background: #f8fafc; color: #0f172a; }
                .doc-box { background: white; padding: 24px; border: 1px solid #cbd5e1; border-radius: 8px; max-width: 1200px; margin: 0 auto; }
                table { width: 100%; border-collapse: collapse; font-size: 11px; margin-top: 12px; }
                th, td { border: 1px solid #94a3b8; padding: 6px; text-align: left; }
                th { background-color: #1e293b; color: white; text-align: center; font-size: 10px; }
                .btn-print { background: #2563eb; color: white; padding: 10px 20px; border: none; border-radius: 6px; font-weight: bold; cursor: pointer; margin-bottom: 16px; font-size: 13px; }
              </style>
            </head>
            <body>
              <div class="no-print" style="text-align: right; margin-bottom: 12px;">
                <button class="btn-print" onclick="window.print()">🖨️ Imprimir / Guardar como PDF</button>
              </div>
              <div class="doc-box">
                ${element.outerHTML}
              </div>
              <script>
                setTimeout(() => {
                  window.focus();
                  window.print();
                }, 600);
              </script>
            </body>
          </html>
        `);
        printWindow.document.close();
      } else {
        window.print();
      }
    } catch (e) {
      console.error('Error al imprimir:', e);
      window.print();
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Controls Bar */}
      <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden border border-slate-800">
        <div>
          <h3 className="font-bold text-sm text-white flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span>Documento Oficial de Impresión / Guardado PDF</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Formato oficial con membrete normativo (Res. 0312 de 2019 / Dec. 1072 de 2015).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleDownloadPdf}
            disabled={isGeneratingPdf}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold rounded-xl shadow-sm transition flex items-center space-x-2 cursor-pointer text-xs border border-emerald-400/30"
          >
            {isGeneratingPdf ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Generando PDF...</span>
              </>
            ) : pdfSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                <span>¡PDF Descargado!</span>
              </>
            ) : (
              <>
                <FileDown className="w-4 h-4 text-emerald-200" />
                <span>Descargar PDF Directo (.pdf)</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-sm transition flex items-center space-x-2 cursor-pointer text-xs border border-blue-400/30"
          >
            <Printer className="w-4 h-4 text-blue-200" />
            <span>Imprimir / Abrir Diálogo de Impresión</span>
          </button>
        </div>
      </div>

      {/* Official Document Sheet */}
      <div
        id="printable-document-container"
        className="bg-white p-8 rounded-2xl border border-slate-300 shadow-md print:shadow-none print:border-none print:p-0 text-slate-900 text-xs space-y-6"
      >
        {/* Document Header */}
        <div className="border-2 border-slate-800 p-4 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-slate-900 text-white rounded">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <h1 className="font-extrabold text-sm uppercase tracking-wider text-slate-900">
                PLAN DE MEJORAMIENTO DEL SG-SST
              </h1>
              <p className="text-[10px] text-slate-600 font-medium">
                RESOLUCIÓN 0312 DE 2019 Y DECRETO 1072 DE 2015 - COLOMBIA
              </p>
            </div>
          </div>

          <div className="text-right text-[10px] space-y-0.5 border-t sm:border-t-0 sm:border-l border-slate-300 pt-2 sm:pt-0 sm:pl-4">
            <p>
              <strong>Código Documento:</strong> PM-SST-2026-01
            </p>
            <p>
              <strong>Fecha Emisión:</strong> {empresaInfo.fechaEvaluacion}
            </p>
            <p>
              <strong>Versión:</strong> 1.0 (Oficial)
            </p>
          </div>
        </div>

        {/* Company Data Grid */}
        <div className="bg-slate-50 p-4 rounded-lg border border-slate-300 space-y-2">
          <h2 className="font-bold uppercase text-[11px] text-slate-800 border-b border-slate-300 pb-1">
            1. INFORMACIÓN DE LA EMPRESA EVALUADA
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px]">
            <div>
              <span className="text-slate-500 font-medium block">Razón Social:</span>
              <span className="font-bold text-slate-900">{empresaInfo.nombre}</span>
            </div>
            <div>
              <span className="text-slate-500 font-medium block">NIT:</span>
              <span className="font-bold text-slate-900">{empresaInfo.nit || 'N/A'}</span>
            </div>
            <div>
              <span className="text-slate-500 font-medium block">Nivel de Riesgo ARL:</span>
              <span className="font-bold text-slate-900">Riesgo {empresaInfo.nivelRiesgo}</span>
            </div>
            <div>
              <span className="text-slate-500 font-medium block">Estándares Aplicables:</span>
              <span className="font-bold text-slate-900">{empresaInfo.numeroEstandares} Estándares</span>
            </div>
            <div>
              <span className="text-slate-500 font-medium block">Cumplimiento Autoevaluación:</span>
              <span className="font-bold text-slate-900">{empresaInfo.porcentajeCumplimiento}%</span>
            </div>
            <div>
              <span className="text-slate-500 font-medium block">Ciudad / Ubicación:</span>
              <span className="font-bold text-slate-900">{empresaInfo.ciudad}</span>
            </div>
            <div className="col-span-2">
              <span className="text-slate-500 font-medium block">Responsable del SG-SST:</span>
              <span className="font-bold text-slate-900">{empresaInfo.responsableSGSST}</span>
            </div>
          </div>
        </div>

        {/* Legal Status & Priorities */}
        <div className="bg-slate-50 p-4 rounded-lg border border-slate-300 space-y-2">
          <h2 className="font-bold uppercase text-[11px] text-slate-800 border-b border-slate-300 pb-1">
            2. DIAGNÓSTICO EJECUTIVO Y OBLIGACIONES LEGALES
          </h2>
          <p className="text-[11px] leading-relaxed text-slate-800">
            {resumenEjecutivo.diagnosticoGeneral}
          </p>
          <div className="text-[10px] text-slate-700 font-medium pt-1">
            <strong>Clasificación Legal:</strong> {resumenEjecutivo.clasificacionLegal}
          </div>
        </div>

        {/* Matrix Table */}
        <div className="space-y-2">
          <h2 className="font-bold uppercase text-[11px] text-slate-800">
            3. MATRIZ DEL PLAN DE MEJORAMIENTO (METODOLOGÍA PHVA)
          </h2>

          <div className="border border-slate-400 rounded-lg overflow-hidden">
            <table className="w-full text-left text-[10px] border-collapse">
              <thead>
                <tr className="bg-slate-800 text-white font-bold text-center">
                  <th className="p-1.5 border-r border-slate-600 w-12">Numeral</th>
                  <th className="p-1.5 border-r border-slate-600 w-14">PHVA</th>
                  <th className="p-1.5 border-r border-slate-600">Hallazgo / Incumplimiento</th>
                  <th className="p-1.5 border-r border-slate-600">Actividad a Desarrollar</th>
                  <th className="p-1.5 border-r border-slate-600 w-24">Responsable</th>
                  <th className="p-1.5 border-r border-slate-600 w-28">Evidencia Requerida</th>
                  <th className="p-1.5 border-r border-slate-600 w-20">Recurso</th>
                  <th className="p-1.5 w-32">Cronograma (Mes 1 a 12)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-300">
                {actividades.map((act, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                    <td className="p-1.5 font-bold text-center border-r border-slate-300">
                      {act.numeralEstandar}
                    </td>
                    <td className="p-1.5 font-bold text-center border-r border-slate-300">
                      {act.phva}
                    </td>
                    <td className="p-1.5 border-r border-slate-300 italic">{act.hallazgo}</td>
                    <td className="p-1.5 border-r border-slate-300 font-medium">{act.actividad}</td>
                    <td className="p-1.5 border-r border-slate-300">{act.responsable}</td>
                    <td className="p-1.5 border-r border-slate-300">{act.evidenciaRequerida}</td>
                    <td className="p-1.5 text-center border-r border-slate-300">
                      {act.recursoAsignado}
                    </td>
                    <td className="p-1 border-slate-300">
                      <div className="grid grid-cols-6 gap-0.5 text-[8px] text-center font-bold">
                        {MONTHS_LIST.map((m) => {
                          const status = act.planeacionMensual[m.key] || {
                            planeado: false,
                            ejecutado: false,
                          };
                          let badgeText = '-';
                          if (status.planeado && status.ejecutado) badgeText = 'P/E';
                          else if (status.planeado) badgeText = 'P';
                          else if (status.ejecutado) badgeText = 'E';

                          return (
                            <div
                              key={m.key}
                              className={`p-0.5 rounded border ${
                                status.ejecutado
                                  ? 'bg-blue-100 text-blue-900 border-blue-300'
                                  : status.planeado
                                  ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                                  : 'bg-slate-100 text-slate-400 border-slate-200'
                              }`}
                            >
                              <div>{m.label}</div>
                              <div>{badgeText}</div>
                            </div>
                          );
                        })}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Signatures Section */}
        <div className="pt-8 border-t border-slate-300 space-y-4">
          <p className="text-[10px] text-slate-600 italic">
            El presente Plan de Mejoramiento del SG-SST ha sido diseñado y aprobado conforme a los lineamientos vigentes en Colombia (Decreto 1072 de 2015 y Resolución 0312 de 2019).
          </p>

          <div className="grid grid-cols-2 gap-12 pt-12">
            <div className="border-t border-slate-800 text-center text-[10px] space-y-1">
              <p className="font-bold uppercase">{empresaInfo.responsableSGSST || 'Responsable del SG-SST'}</p>
              <p className="text-slate-600">Firma Responsable del Diseño y Ejecución SG-SST</p>
              <p className="text-slate-500 font-mono">Licencia en SST / Certificado 50 Horas ARL</p>
            </div>

            <div className="border-t border-slate-800 text-center text-[10px] space-y-1">
              <p className="font-bold uppercase">Representante Legal / Gerencia</p>
              <p className="text-slate-600">Firma de Aprobación y Asignación de Recursos</p>
              <p className="text-slate-500 font-mono">{empresaInfo.nombre}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

