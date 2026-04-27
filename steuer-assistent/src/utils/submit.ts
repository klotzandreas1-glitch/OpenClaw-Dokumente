import emailjs from '@emailjs/browser';
import * as XLSX from 'xlsx';
import {
  EMAILJS_SERVICE_ID,
  EMAILJS_TEMPLATE_ID,
  EMAILJS_PUBLIC_KEY,
  KANZLEI_EMAIL,
} from '../config';

interface Row {
  abschnitt: string;
  frage: string;
  antwort: string;
}

interface SubmitParams {
  clientName: string;
  mandantId: string;
  steuerjahr: number;
  rows: Row[];
}

export function downloadExcel({ clientName, mandantId, steuerjahr, rows }: SubmitParams) {
  const wb = XLSX.utils.book_new();
  const wsData = [
    ['Abschnitt', 'Frage', 'Antwort'],
    ...rows.map((r) => [r.abschnitt, r.frage, r.antwort]),
  ];
  const ws = XLSX.utils.aoa_to_sheet(wsData);
  ws['!cols'] = [{ wch: 28 }, { wch: 58 }, { wch: 28 }];
  XLSX.utils.book_append_sheet(wb, ws, 'Anlage N');
  XLSX.writeFile(wb, `${mandantId}_${clientName}_AnlageN_${steuerjahr}.xlsx`);
}

export async function sendEmail({ clientName, mandantId, steuerjahr, rows }: SubmitParams) {
  const tableRows = rows
    .map(
      (r) =>
        `<tr><td style="padding:4px 8px;border:1px solid #e2e8f0;color:#64748b">${r.abschnitt}</td>` +
        `<td style="padding:4px 8px;border:1px solid #e2e8f0">${r.frage}</td>` +
        `<td style="padding:4px 8px;border:1px solid #e2e8f0;font-weight:500">${r.antwort}</td></tr>`,
    )
    .join('');

  const formData =
    `<table style="border-collapse:collapse;width:100%;font-size:13px">` +
    `<thead><tr>` +
    `<th style="padding:6px 8px;background:#f8fafc;border:1px solid #e2e8f0;text-align:left">Abschnitt</th>` +
    `<th style="padding:6px 8px;background:#f8fafc;border:1px solid #e2e8f0;text-align:left">Frage</th>` +
    `<th style="padding:6px 8px;background:#f8fafc;border:1px solid #e2e8f0;text-align:left">Antwort</th>` +
    `</tr></thead><tbody>${tableRows}</tbody></table>`;

  await emailjs.send(
    EMAILJS_SERVICE_ID,
    EMAILJS_TEMPLATE_ID,
    {
      to_email:    KANZLEI_EMAIL,
      client_name: clientName,
      mandant_id:  mandantId,
      steuerjahr:  String(steuerjahr),
      form_data:   formData,
    },
    EMAILJS_PUBLIC_KEY,
  );
}
