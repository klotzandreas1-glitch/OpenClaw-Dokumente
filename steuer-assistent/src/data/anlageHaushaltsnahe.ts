import type { Section } from '../types';

export const anlageHaushaltsnaheSections: Section[] = [
  {
    id: 'haush_dienstleistungen',
    title: 'Haushaltsnahe Dienstleistungen',
    subtitle: '20 % der Kosten absetzbar, max. 4.000 € Steuerermäßigung (§ 35a EStG)',
    questions: [
      {
        id: 'haush_putzhilfe',
        label: 'Beschäftigen Sie eine Putzkraft, Haushaltshilfe oder einen Reinigungsdienst?',
        hint: 'Nur bei Überweisung und Rechnung – keine Barzahlung!',
        type: 'yesno',
        followUps: [
          {
            whenValue: true,
            questions: [
              {
                id: 'haush_putzhilfe_betrag',
                label: 'Gezahlte Kosten im Steuerjahr',
                type: 'currency',
                unit: '€',
              },
              {
                id: 'haush_putzhilfe_art',
                label: 'Art der Beschäftigung',
                type: 'select',
                options: ['Minijob (450-€-Basis)', 'Sozialversicherungspflichtig', 'Gewerblicher Dienstleister / Reinigungsfirma'],
              },
            ],
          },
        ],
      },
      {
        id: 'haush_gartenpflege',
        label: 'Haben Sie Kosten für Gartenpflege oder Gartengestaltung gehabt?',
        type: 'yesno',
        followUps: [
          {
            whenValue: true,
            questions: [
              {
                id: 'haush_garten_betrag',
                label: 'Kosten Gartenpflege',
                type: 'currency',
                unit: '€',
              },
            ],
          },
        ],
      },
      {
        id: 'haush_pflege',
        label: 'Haben Sie Kosten für Pflege- oder Betreuungsdienste im Haushalt?',
        hint: 'Z.B. ambulanter Pflegedienst, Hauskrankenpflege.',
        type: 'yesno',
        followUps: [
          {
            whenValue: true,
            questions: [
              {
                id: 'haush_pflege_betrag',
                label: 'Kosten Pflege / Betreuung',
                type: 'currency',
                unit: '€',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'haush_handwerker',
    title: 'Handwerkerleistungen',
    subtitle: '20 % des Arbeitslohns absetzbar, max. 1.200 € Steuerermäßigung',
    questions: [
      {
        id: 'haush_handwerker_vorhanden',
        label: 'Haben Sie Handwerker für Arbeiten in Ihrem Haushalt beauftragt?',
        hint: 'Nur der Arbeitslohn (nicht Material) ist absetzbar. Zahlung muss per Überweisung erfolgt sein.',
        type: 'yesno',
        followUps: [
          {
            whenValue: true,
            questions: [
              {
                id: 'haush_handwerker_arten',
                label: 'Welche Arbeiten wurden durchgeführt?',
                type: 'multiselect',
                options: [
                  'Malerarbeiten / Tapezieren',
                  'Sanitär / Heizung',
                  'Elektroinstallation',
                  'Bodenbelag / Fliesen',
                  'Dach / Fassade',
                  'Schornsteinfeger',
                  'Fenster / Türen',
                  'Gartengestaltung',
                  'Sonstige Reparaturen',
                ],
              },
              {
                id: 'haush_handwerker_arbeitslohn',
                label: 'Arbeitslohn gesamt (aus den Rechnungen, ohne Material)',
                hint: 'Der Arbeitslohnanteil muss in der Rechnung separat ausgewiesen sein.',
                type: 'currency',
                unit: '€',
              },
              {
                id: 'haush_handwerker_gesamt',
                label: 'Rechnungsgesamtbetrag (inkl. Material)',
                type: 'currency',
                unit: '€',
              },
            ],
          },
        ],
      },
      {
        id: 'haush_schornstein',
        label: 'Haben Sie Kosten für den Schornsteinfeger gehabt?',
        type: 'yesno',
        followUps: [
          {
            whenValue: true,
            questions: [
              {
                id: 'haush_schornstein_betrag',
                label: 'Kosten Schornsteinfeger (Arbeitslohnanteil)',
                type: 'currency',
                unit: '€',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'haush_minijob',
    title: 'Haushaltsnahe Beschäftigung (Minijob)',
    subtitle: 'Geringfügige Beschäftigung im Privathaushalt – 20 % absetzbar, max. 510 €',
    questions: [
      {
        id: 'haush_minijob_vorhanden',
        label: 'Beschäftigen Sie eine Person auf Minijob-Basis in Ihrem Haushalt?',
        hint: 'Angemeldet bei der Minijob-Zentrale (Haushaltsscheckverfahren).',
        type: 'yesno',
        followUps: [
          {
            whenValue: true,
            questions: [
              {
                id: 'haush_minijob_betrag',
                label: 'Gezahlte Vergütung + Abgaben gesamt im Steuerjahr',
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
