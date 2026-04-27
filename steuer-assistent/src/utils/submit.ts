import * as XLSX from 'xlsx';
import { KANZLEI_EMAIL } from '../config';

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

export async function sendEmail({ clientName, mandantId, steuerjahr, rows }: SubmitParams) {
  const tableRows = rows
    .map(
      (r) =>
        `<tr>` +
        `<td style="padding:4px 8px;border:1px solid #e2e8f0;color:#64748b">${r.abschnitt}</td>` +
        `<td style="padding:4px 8px;border:1px solid #e2e8f0">${r.frage}</td>` +
        `<td style="padding:4px 8px;border:1px solid #e2e8f0;font-weight:500">${r.antwort}</td>` +
        `</tr>`,
    )
    .join('');

  const message =
    `<h2 style="font-family:sans-serif">Anlage N ${steuerjahr} – ${clientName}</h2>` +
    `<p style="font-family:sans-serif">Mandant-ID: <strong>${mandantId}</strong></p>` +
    `<table style="border-collapse:collapse;width:100%;font-size:13px;font-family:sans-serif">` +
    `<thead><tr>` +
    `<th style="padding:6px 8px;background:#f8fafc;border:1px solid #e2e8f0;text-align:left">Abschnitt</th>` +
    `<th style="padding:6px 8px;background:#f8fafc;border:1px solid #e2e8f0;text-align:left">Frage</th>` +
    `<th style="padding:6px 8px;background:#f8fafc;border:1px solid #e2e8f0;text-align:left">Antwort</th>` +
    `</tr></thead><tbody>${tableRows}</tbody></table>`;

  const res = await fetch(`https://formsubmit.co/ajax/${KANZLEI_EMAIL}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      _subject: `Anlage N ${steuerjahr} – ${clientName} (${mandantId})`,
      _captcha: 'false',
      _template: 'table',
      name: clientName,
      mandant_id: mandantId,
      steuerjahr: String(steuerjahr),
      message,
    }),
  });

  const data = (await res.json()) as { success: string; message?: string };
  if (data.success !== 'true') throw new Error(data.message ?? 'Fehler beim E-Mail-Versand');
}
