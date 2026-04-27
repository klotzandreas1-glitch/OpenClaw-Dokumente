import * as XLSX from 'xlsx';

export interface Row {
  abschnitt: string;
  frage: string;
  antwort: string;
}

export interface SubmitParams {
  clientName: string;
  mandantId: string;
  steuerjahr: number;
  rows: Row[];
}

// Sofort-Download für den Mandanten (client-seitig)
export function downloadExcel({ clientName, mandantId, steuerjahr, rows }: SubmitParams) {
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet([
    ['Abschnitt', 'Frage', 'Antwort'],
    ...rows.map((r) => [r.abschnitt, r.frage, r.antwort]),
  ]);
  ws['!cols'] = [{ wch: 28 }, { wch: 58 }, { wch: 28 }];
  XLSX.utils.book_append_sheet(wb, ws, 'Anlage N');
  XLSX.writeFile(wb, `${mandantId}_${clientName}_AnlageN_${steuerjahr}.xlsx`);
}

// Formatiertes Excel per E-Mail via Vercel-Funktion
export async function sendEmail(params: SubmitParams) {
  const res = await fetch('/api/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  const data = (await res.json()) as { success?: boolean; error?: string };
  if (!data.success) throw new Error(data.error ?? 'Fehler beim E-Mail-Versand');
}
