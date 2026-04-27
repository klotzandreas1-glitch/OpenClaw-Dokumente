import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';
import ExcelJS from 'exceljs';

// ── Konfiguration ────────────────────────────────────────────────
const RESEND_API_KEY  = 'RESEND_KEY_HIER_EINTRAGEN';
const KANZLEI_EMAIL   = 'klotzandreas1@yahoo.de';
const ABSENDER        = 'Steuer-Assistent <onboarding@resend.dev>';
// ────────────────────────────────────────────────────────────────

interface Row {
  abschnitt: string;
  frage: string;
  antwort: string;
}

interface SubmitBody {
  clientName: string;
  mandantId: string;
  steuerjahr: number;
  rows: Row[];
}

const BLAU       = '2563EB';
const BLAU_HELL  = 'EFF6FF';
const GRAU       = 'F8FAFC';
const WEISS      = 'FFFFFF';
const RAND       = { style: 'thin' as const, color: { argb: 'FFE2E8F0' } };
const RAHMEN     = { top: RAND, left: RAND, bottom: RAND, right: RAND };

async function buildExcel(body: SubmitBody): Promise<Buffer> {
  const { clientName, mandantId, steuerjahr, rows } = body;

  const wb = new ExcelJS.Workbook();
  wb.creator = 'Steuer-Assistent';
  wb.created = new Date();

  const ws = wb.addWorksheet('Anlage N', {
    views: [{ state: 'frozen', ySplit: 3 }],
    pageSetup: { paperSize: 9, orientation: 'landscape', fitToPage: true },
  });

  // ── Titelzeile ─────────────────────────────────────────────────
  ws.mergeCells('A1:C1');
  const titel = ws.getCell('A1');
  titel.value = `Einkommensteuererklärung ${steuerjahr}  –  Anlage N  –  ${clientName}  (${mandantId})`;
  titel.font = { bold: true, size: 13, color: { argb: `FF${WEISS}` } };
  titel.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: `FF${BLAU}` } };
  titel.alignment = { vertical: 'middle', horizontal: 'center' };
  ws.getRow(1).height = 28;

  // ── Leerzeile ──────────────────────────────────────────────────
  ws.addRow([]);

  // ── Spaltenüberschriften ────────────────────────────────────────
  const headerRow = ws.addRow(['Anlage / Abschnitt', 'Frage', 'Antwort']);
  headerRow.eachCell((cell) => {
    cell.font = { bold: true, color: { argb: `FF${WEISS}` }, size: 10 };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: `FF${BLAU}` } };
    cell.alignment = { vertical: 'middle', wrapText: true };
    cell.border = RAHMEN;
  });
  headerRow.height = 20;

  // ── Daten nach Abschnitt gruppieren ────────────────────────────
  const gruppen = new Map<string, Row[]>();
  for (const row of rows) {
    if (!gruppen.has(row.abschnitt)) gruppen.set(row.abschnitt, []);
    gruppen.get(row.abschnitt)!.push(row);
  }

  let zeilenfarbToggle = false;

  for (const [abschnitt, zeilen] of gruppen) {
    // Abschnitts-Trennzeile
    const sectionRow = ws.addRow([abschnitt, '', '']);
    ws.mergeCells(`A${sectionRow.number}:C${sectionRow.number}`);
    sectionRow.getCell(1).value = `▸  ${abschnitt}`;
    sectionRow.getCell(1).font = { bold: true, size: 10, color: { argb: `FF${BLAU}` } };
    sectionRow.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: `FF${BLAU_HELL}` } };
    sectionRow.getCell(1).alignment = { vertical: 'middle' };
    sectionRow.getCell(1).border = RAHMEN;
    sectionRow.height = 18;

    for (const z of zeilen) {
      const farbe = zeilenfarbToggle ? GRAU : WEISS;
      const r = ws.addRow([abschnitt, z.frage, z.antwort]);
      r.eachCell((cell, col) => {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: `FF${farbe}` } };
        cell.alignment = { vertical: 'middle', wrapText: true };
        cell.border = RAHMEN;
        cell.font = { size: 10 };
        if (col === 1) cell.font = { size: 10, color: { argb: 'FF64748B' } };
        if (col === 3) cell.font = { size: 10, bold: true };
      });
      r.height = 16;
      zeilenfarbToggle = !zeilenfarbToggle;
    }
  }

  // ── Spaltenbreiten ─────────────────────────────────────────────
  ws.getColumn(1).width = 28;
  ws.getColumn(2).width = 60;
  ws.getColumn(3).width = 30;

  const buffer = await wb.xlsx.writeBuffer();
  return Buffer.from(buffer);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const body = req.body as SubmitBody;
  if (!body?.clientName || !body?.rows?.length) {
    return res.status(400).json({ error: 'Fehlende Pflichtfelder' });
  }

  try {
    const excelBuffer = await buildExcel(body);
    const filename = `${body.mandantId}_${body.clientName}_AnlageN_${body.steuerjahr}.xlsx`;

    const htmlTabelle = body.rows
      .map(
        (r) =>
          `<tr>
            <td style="padding:5px 8px;border:1px solid #e2e8f0;color:#64748b;font-size:12px">${r.abschnitt}</td>
            <td style="padding:5px 8px;border:1px solid #e2e8f0;font-size:12px">${r.frage}</td>
            <td style="padding:5px 8px;border:1px solid #e2e8f0;font-weight:600;font-size:12px">${r.antwort}</td>
          </tr>`,
      )
      .join('');

    const html = `
      <div style="font-family:sans-serif;max-width:800px">
        <h2 style="color:#1e293b">Anlage N ${body.steuerjahr} – ${body.clientName}</h2>
        <p style="color:#64748b">Mandant-ID: <strong>${body.mandantId}</strong></p>
        <p style="color:#64748b;font-size:13px">Die Excel-Datei finden Sie im Anhang.</p>
        <table style="border-collapse:collapse;width:100%;margin-top:16px">
          <thead>
            <tr>
              <th style="padding:8px;background:#2563eb;color:#fff;border:1px solid #2563eb;text-align:left;font-size:12px">Abschnitt</th>
              <th style="padding:8px;background:#2563eb;color:#fff;border:1px solid #2563eb;text-align:left;font-size:12px">Frage</th>
              <th style="padding:8px;background:#2563eb;color:#fff;border:1px solid #2563eb;text-align:left;font-size:12px">Antwort</th>
            </tr>
          </thead>
          <tbody>${htmlTabelle}</tbody>
        </table>
      </div>`;

    const resend = new Resend(RESEND_API_KEY);
    await resend.emails.send({
      from: ABSENDER,
      to: KANZLEI_EMAIL,
      subject: `Anlage N ${body.steuerjahr} – ${body.clientName} (${body.mandantId})`,
      html,
      attachments: [{ filename, content: excelBuffer.toString('base64') }],
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: String(err) });
  }
}
