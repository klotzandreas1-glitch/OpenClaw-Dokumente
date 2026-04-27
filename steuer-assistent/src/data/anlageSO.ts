import type { Section } from '../types';

export const anlageSOSections: Section[] = [
  {
    id: 'so_unterhalt',
    title: 'Anlage SO – Unterhalt & Sonstige Einkünfte',
    subtitle: 'Einkünfte aus privaten Veräußerungen, Unterhalt, Spekulationsgeschäften (§ 22 EStG)',
    questions: [
      {
        id: 'so_unterhalt_erhalten',
        label: 'Haben Sie Unterhaltszahlungen von einem Ex-Partner erhalten?',
        hint: 'Nur wenn der Zahler das Realsplitting beantragt hat (Anlage U ausgefüllt).',
        type: 'yesno',
        followUps: [
          {
            whenValue: true,
            questions: [
              {
                id: 'so_unterhalt_betrag',
                label: 'Erhaltene Unterhaltszahlungen',
                type: 'currency',
                unit: '€',
              },
            ],
          },
        ],
      },
      {
        id: 'so_immobilien_verkauf',
        label: 'Haben Sie eine Immobilie verkauft (Haltedauer unter 10 Jahre)?',
        hint: 'Privates Veräußerungsgeschäft – steuerpflichtig wenn Haltedauer unter 10 Jahren.',
        type: 'yesno',
        followUps: [
          {
            whenValue: true,
            questions: [
              {
                id: 'so_immo_verkaufspreis',
                label: 'Verkaufspreis',
                type: 'currency',
                unit: '€',
              },
              {
                id: 'so_immo_anschaffungskosten',
                label: 'Ursprüngliche Anschaffungskosten',
                type: 'currency',
                unit: '€',
              },
              {
                id: 'so_immo_haltedauer',
                label: 'Haltedauer',
                hint: 'Kauf- und Verkaufsdatum (TT.MM.JJJJ – TT.MM.JJJJ)',
                type: 'text',
              },
            ],
          },
        ],
      },
      {
        id: 'so_sonstige_veraeusserung',
        label: 'Haben Sie sonstige Wirtschaftsgüter verkauft (Haltedauer unter 1 Jahr)?',
        hint: 'Z.B. Gold, Kryptowährungen, Edelmetalle, Sammlerstücke.',
        type: 'yesno',
        followUps: [
          {
            whenValue: true,
            questions: [
              {
                id: 'so_veraeusserung_art',
                label: 'Art des verkauften Wirtschaftsguts',
                type: 'text',
              },
              {
                id: 'so_veraeusserung_gewinn',
                label: 'Gewinn / Verlust aus Verkauf',
                type: 'currency',
                unit: '€',
              },
            ],
          },
        ],
      },
      {
        id: 'so_krypto',
        label: 'Haben Sie Kryptowährungen (Bitcoin, Ethereum etc.) verkauft oder getauscht?',
        hint: 'Steuerpflichtig wenn Haltedauer unter 1 Jahr – auch Tausch Krypto gegen Krypto!',
        type: 'yesno',
        followUps: [
          {
            whenValue: true,
            questions: [
              {
                id: 'so_krypto_gewinn',
                label: 'Gewinn / Verlust aus Krypto-Transaktionen',
                hint: 'Verkaufspreis minus Anschaffungskosten (FIFO-Methode).',
                type: 'currency',
                unit: '€',
              },
              {
                id: 'so_krypto_nachweis',
                label: 'Liegt ein Transaktionsauszug / Nachweis vor?',
                type: 'yesno',
              },
            ],
          },
        ],
      },
      {
        id: 'so_leibrente_zahlung',
        label: 'Zahlen Sie eine Leibrente oder wiederkehrende Leistungen?',
        type: 'yesno',
        followUps: [
          {
            whenValue: true,
            questions: [
              {
                id: 'so_leibrente_betrag',
                label: 'Jährlicher Zahlungsbetrag',
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
