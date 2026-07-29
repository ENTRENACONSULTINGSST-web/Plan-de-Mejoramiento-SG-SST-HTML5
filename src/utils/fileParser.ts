import * as XLSX from 'xlsx';

export interface ParsedEvaluationDoc {
  fileName: string;
  extractedText: string;
  detectedPercentage?: number;
  detectedStandardsCount?: 7 | 21 | 60;
  itemCount: number;
}

/**
 * Parses uploaded evaluation files (.xlsx, .xls, .csv, .txt) including complete 71-item / 60-standard Decree 1072 / Res 0312 sheets.
 */
export async function parseEvaluationFile(file: File): Promise<ParsedEvaluationDoc> {
  const fileName = file.name;
  const isExcel = /\.xlsx?$/i.test(fileName);
  const isCsv = /\.csv$/i.test(fileName);

  if (isExcel || isCsv) {
    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });

    let fullText = '';
    let totalRows = 0;
    let detectedPct: number | undefined = undefined;

    workbook.SheetNames.forEach((sheetName) => {
      const sheet = workbook.Sheets[sheetName];
      if (!sheet) return;

      const csvData = XLSX.utils.sheet_to_csv(sheet);
      if (csvData && csvData.trim()) {
        fullText += `--- HOJA: ${sheetName} ---\n` + csvData + '\n\n';
      }

      // Check rows for potential score / percentage
      const rows = XLSX.utils.sheet_to_json<Record<string, any>>(sheet, { header: 1 });
      totalRows += rows.length;

      rows.forEach((row: any) => {
        if (Array.isArray(row)) {
          const rowStr = row.join(' ').toLowerCase();
          // Look for percentage patterns like 58.5%, 75%, 82.3% or puntaje total
          if (rowStr.includes('cumplimiento') || rowStr.includes('puntaje') || rowStr.includes('porcentaje') || rowStr.includes('resultado')) {
            row.forEach((cell: any) => {
              if (typeof cell === 'number' && cell > 0 && cell <= 100) {
                if (detectedPct === undefined) detectedPct = Math.round(cell * 10) / 10;
              } else if (typeof cell === 'string') {
                const match = cell.match(/(\d{1,2}(?:\.\d{1,2})?)\s*%/);
                if (match && match[1]) {
                  const val = parseFloat(match[1]);
                  if (val >= 0 && val <= 100 && detectedPct === undefined) {
                    detectedPct = val;
                  }
                }
              }
            });
          }
        }
      });
    });

    return {
      fileName,
      extractedText: fullText.trim() || `[Archivo Excel/CSV sin texto legible: ${fileName}]`,
      detectedPercentage: detectedPct,
      itemCount: totalRows,
    };
  } else {
    // Plain text or markdown or log
    const text = await file.text();
    let detectedPct: number | undefined = undefined;
    const match = text.match(/(\d{1,2}(?:\.\d{1,2})?)\s*%/);
    if (match && match[1]) {
      const val = parseFloat(match[1]);
      if (val >= 0 && val <= 100) detectedPct = val;
    }

    return {
      fileName,
      extractedText: text,
      detectedPercentage: detectedPct,
      itemCount: text.split('\n').length,
    };
  }
}
