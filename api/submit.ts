import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';
import * as XLSX from 'xlsx';

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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { clientName, mandantId, steuerjahr, rows } = req.body as SubmitBody;

  if (!clientName || !rows?.length) {
    return res.status(400).json({ error: 'Fehlende Pflichtfelder' });
  }

  try {
    // ── Excel erstellen ──────────────────────────────────────────
    const wb = XLSX.utils.book_new();

    const header = [['Abschnitt', 'Frage', 'Antwort']];
    const dataRows = rows.map((r) => [r.abschnitt, r.frage, r.antwort]);
    const wsData = [...header, ...dataRows];

    const ws = XLSX.utils.aoa_to_sheet(wsData);

    // Spaltenbreiten
    ws['!cols'] = [{ wch: 30 }, { wch: 60 }, { wch: 30 }];

    XLSX.utils.book_append_sheet(wb, ws, 'Anlage N');
    const excelBuffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' }) as Buffer;

    // ── E-Mail senden ────────────────────────────────────────────
    const resend = new Resend(process.env.RESEND_API_KEY);
    const recipient = process.env.KANZLEI_EMAIL ?? '';

    if (!recipient) {
      return res.status(500).json({ error: 'KANZLEI_EMAIL nicht konfiguriert' });
    }

    await resend.emails.send({
      from: 'Steuer-Assistent <onboarding@resend.dev>',
      to: recipient,
      subject: `Anlage N ${steuerjahr} – ${clientName} (${mandantId})`,
      html: `
        <p>Guten Tag,</p>
        <p>Mandant <strong>${clientName}</strong> (ID: ${mandantId}) hat den Fragebogen
        für das Steuerjahr <strong>${steuerjahr}</strong> ausgefüllt.</p>
        <p>Die ausgefüllten Daten finden Sie im beigefügten Excel-Dokument.</p>
        <hr/>
        <p style="font-size:12px;color:#888">Steuer-Assistent – automatisch generiert</p>
      `,
      attachments: [
        {
          filename: `${mandantId}_${clientName}_AnlageN_${steuerjahr}.xlsx`,
          content: excelBuffer.toString('base64'),
        },
      ],
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Fehler beim Verarbeiten der Anfrage' });
  }
}
