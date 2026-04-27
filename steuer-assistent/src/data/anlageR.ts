import type { Section } from '../types';

export const anlageRSections: Section[] = [
  {
    id: 'r_renten',
    title: 'Anlage R – Renten',
    subtitle: 'Einkünfte aus gesetzlicher Rente und Versorgungsbezügen (Zeilen 4–24)',
    questions: [
      {
        id: 'r_gesetzliche_rente',
        label: 'Beziehen Sie eine gesetzliche Altersrente (Deutsche Rentenversicherung)?',
        type: 'yesno',
        required: true,
        followUps: [
          {
            whenValue: true,
            questions: [
              {
                id: 'r_rentenbeginn',
                label: 'Jahr des Rentenbeginns',
                hint: 'Entscheidend für den steuerpflichtigen Anteil (Besteuerungsanteil).',
                type: 'number',
              },
              {
                id: 'r_jahresbruttorente',
                label: 'Jahresbruttorente (laut Rentenbescheid)',
                hint: 'Bitte den Jahresbetrag aus dem Rentenbescheid eintragen.',
                type: 'currency',
                unit: '€',
              },
              {
                id: 'r_rentenanpassung',
                label: 'Gab es im Steuerjahr eine Rentenanpassung?',
                type: 'yesno',
                followUps: [
                  {
                    whenValue: true,
                    questions: [
                      {
                        id: 'r_anpassungsbetrag',
                        label: 'Erhöhungsbetrag durch Rentenanpassung',
                        type: 'currency',
                        unit: '€',
                      },
                    ],
                  },
                ],
              },
              {
                id: 'r_rentenbescheinigung',
                label: 'Liegt die Rentenbezugsmitteilung / Bescheinigung vor?',
                hint: 'Wird jährlich von der Deutschen Rentenversicherung zugeschickt.',
                type: 'yesno',
              },
            ],
          },
        ],
      },
      {
        id: 'r_witwen_waisenrente',
        label: 'Beziehen Sie eine Witwen-, Witwer- oder Waisenrente?',
        type: 'yesno',
        followUps: [
          {
            whenValue: true,
            questions: [
              {
                id: 'r_hinterbliebenen_betrag',
                label: 'Jahresbetrag der Hinterbliebenenrente',
                type: 'currency',
                unit: '€',
              },
              {
                id: 'r_hinterbliebenen_beginn',
                label: 'Jahr des Rentenbeginns',
                type: 'number',
              },
            ],
          },
        ],
      },
      {
        id: 'r_erwerbsminderung',
        label: 'Beziehen Sie eine Erwerbsminderungs- oder Berufsunfähigkeitsrente?',
        type: 'yesno',
        followUps: [
          {
            whenValue: true,
            questions: [
              {
                id: 'r_em_betrag',
                label: 'Jahresbetrag',
                type: 'currency',
                unit: '€',
              },
              {
                id: 'r_em_beginn',
                label: 'Jahr des Rentenbeginns',
                type: 'number',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'r_private_renten',
    title: 'Anlage R – Private Renten & Pensionen',
    subtitle: 'Betriebsrenten, private Leibrenten, Pensionskassen',
    questions: [
      {
        id: 'r_betriebsrente',
        label: 'Beziehen Sie eine Betriebsrente oder Pension vom früheren Arbeitgeber?',
        hint: 'Diese werden als Versorgungsbezüge besteuert (Anlage N, nicht Anlage R) – bitte prüfen.',
        type: 'yesno',
        followUps: [
          {
            whenValue: true,
            questions: [
              {
                id: 'r_betriebsrente_betrag',
                label: 'Jahresbetrag Betriebsrente / Pension',
                type: 'currency',
                unit: '€',
              },
              {
                id: 'r_betriebsrente_lsb',
                label: 'Liegt eine Lohnsteuerbescheinigung dafür vor?',
                type: 'yesno',
              },
            ],
          },
        ],
      },
      {
        id: 'r_private_leibrente',
        label: 'Beziehen Sie eine private Leibrente (z.B. aus Rentenversicherung)?',
        type: 'yesno',
        followUps: [
          {
            whenValue: true,
            questions: [
              {
                id: 'r_leibrente_betrag',
                label: 'Jahresbetrag der privaten Leibrente',
                type: 'currency',
                unit: '€',
              },
              {
                id: 'r_leibrente_beginn',
                label: 'Jahr des Rentenbeginns',
                hint: 'Bestimmt den Ertragsanteil (steuerpflichtiger Teil).',
                type: 'number',
              },
            ],
          },
        ],
      },
      {
        id: 'r_auslandsrente',
        label: 'Beziehen Sie eine Rente aus dem Ausland?',
        hint: 'Z.B. aus der Schweiz, Österreich, USA oder anderen Ländern.',
        type: 'yesno',
        followUps: [
          {
            whenValue: true,
            questions: [
              {
                id: 'r_auslandsrente_land',
                label: 'Aus welchem Land?',
                type: 'text',
              },
              {
                id: 'r_auslandsrente_betrag',
                label: 'Jahresbetrag (in Euro)',
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
