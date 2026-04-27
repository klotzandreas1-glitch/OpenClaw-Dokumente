import type { Section } from '../types';

export const anlageAVSections: Section[] = [
  {
    id: 'av_riester',
    title: 'Anlage AV – Riester-Rente',
    subtitle: 'Zusätzliche Altersvorsorge nach § 10a EStG (Sonderausgaben)',
    questions: [
      {
        id: 'av_riester_vorhanden',
        label: 'Haben Sie einen Riester-Vertrag (Rentenversicherung, Banksparplan, Fondssparplan, Wohn-Riester)?',
        type: 'yesno',
        required: true,
        followUps: [
          {
            whenValue: true,
            questions: [
              {
                id: 'av_riester_beitraege',
                label: 'Eigene Beiträge ins Steuerjahr (ohne staatliche Zulagen)',
                hint: 'Aus der jährlichen Bescheinigung des Anbieters.',
                type: 'currency',
                unit: '€',
              },
              {
                id: 'av_riester_zulagen',
                label: 'Erhaltene staatliche Zulagen (Grundzulage + Kinderzulage)',
                hint: 'Grundzulage 175 €, Kinderzulage 185 € (vor 2008: 300 €) pro Kind.',
                type: 'currency',
                unit: '€',
              },
              {
                id: 'av_riester_bescheinigung',
                label: 'Liegt die Bescheinigung des Riester-Anbieters vor?',
                hint: 'Wird jährlich vom Anbieter ausgestellt (§ 10a Abs. 5 EStG).',
                type: 'yesno',
              },
              {
                id: 'av_riester_anbieter',
                label: 'Name des Riester-Anbieters / Versicherung',
                type: 'text',
              },
              {
                id: 'av_wohnriester',
                label: 'Handelt es sich um einen Wohn-Riester (Eigenheimrente)?',
                hint: 'Für selbstgenutztes Wohneigentum.',
                type: 'yesno',
              },
            ],
          },
        ],
      },
    ],
  },
];
