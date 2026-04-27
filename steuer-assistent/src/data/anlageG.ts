import type { Section } from '../types';

export const anlageGSections: Section[] = [
  {
    id: 'g_grundangaben',
    title: 'Anlage G – Gewerbebetrieb',
    subtitle: 'Einkünfte aus Gewerbebetrieb (§ 15 EStG)',
    questions: [
      {
        id: 'g_betriebsart',
        label: 'Art des Gewerbebetriebs',
        type: 'text',
        hint: 'Z.B. Einzelhandel, Gastronomie, Handwerk, Online-Handel.',
        required: true,
      },
      {
        id: 'g_rechtsform',
        label: 'Rechtsform',
        type: 'select',
        options: ['Einzelunternehmen', 'GbR', 'OHG', 'KG', 'GmbH & Co. KG', 'Sonstige'],
        required: true,
      },
      {
        id: 'g_gewinnermittlung',
        label: 'Art der Gewinnermittlung',
        type: 'select',
        options: [
          'Einnahmen-Überschuss-Rechnung (EÜR)',
          'Bilanz / Betriebsvermögensvergleich',
        ],
        required: true,
      },
      {
        id: 'g_umsatz',
        label: 'Jahresumsatz (Betriebseinnahmen)',
        type: 'currency',
        unit: '€',
        required: true,
      },
      {
        id: 'g_gewinn',
        label: 'Gewinn / Verlust des Gewerbebetriebs',
        type: 'currency',
        unit: '€',
      },
      {
        id: 'g_gewerbesteuer',
        label: 'Haben Sie Gewerbesteuer gezahlt?',
        type: 'yesno',
        followUps: [
          {
            whenValue: true,
            questions: [
              {
                id: 'g_gewerbesteuer_betrag',
                label: 'Gezahlte Gewerbesteuer',
                hint: 'Wird auf die Einkommensteuer angerechnet.',
                type: 'currency',
                unit: '€',
              },
            ],
          },
        ],
      },
      {
        id: 'g_buchfuehrung_vorhanden',
        label: 'Liegt eine fertige EÜR oder Bilanz vor?',
        type: 'yesno',
      },
      {
        id: 'g_verlust_vorjahr',
        label: 'Gibt es Verlustvorträge aus Vorjahren?',
        type: 'yesno',
        followUps: [
          {
            whenValue: true,
            questions: [
              {
                id: 'g_verlust_betrag',
                label: 'Verlustvortrag aus Vorjahren',
                type: 'currency',
                unit: '€',
              },
            ],
          },
        ],
      },
    ],
  },
];
