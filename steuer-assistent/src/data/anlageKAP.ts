import type { Section } from '../types';

export const anlageKAPSections: Section[] = [
  {
    id: 'kap_grundangaben',
    title: 'Anlage KAP – Grundangaben',
    subtitle: 'Kapitalerträge, Freistellungsauftrag (Zeilen 1–10 Anlage KAP)',
    questions: [
      {
        id: 'kap_freistellungsauftrag',
        label: 'Haben Sie bei einer oder mehreren Banken einen Freistellungsauftrag erteilt?',
        hint: 'Freistellungsauftrag schützt Kapitalerträge bis 1.000 € (Alleinstehende) bzw. 2.000 € (Ehepaare) vor Abgeltungsteuer.',
        type: 'yesno',
        followUps: [
          {
            whenValue: true,
            questions: [
              {
                id: 'kap_freistellungsauftrag_banken',
                label: 'Bei welchen Banken und in welcher Höhe?',
                hint: 'Z.B. Sparkasse 500 €, DKB 500 €',
                type: 'text',
              },
              {
                id: 'kap_freistellungsauftrag_gesamt',
                label: 'Gesamthöhe aller Freistellungsaufträge',
                type: 'currency',
                unit: '€',
              },
            ],
          },
        ],
      },
      {
        id: 'kap_nv_bescheinigung',
        label: 'Haben Sie eine Nichtveranlagungsbescheinigung (NV-Bescheinigung)?',
        hint: 'Gilt für Personen mit sehr geringem Einkommen – Kapitalerträge werden dann nicht besteuert.',
        type: 'yesno',
      },
      {
        id: 'kap_kirchensteuer',
        label: 'Wurde auf Ihre Kapitalerträge Kirchensteuer einbehalten?',
        hint: 'Zu sehen auf der Jahressteuerbescheinigung der Bank.',
        type: 'yesno',
        followUps: [
          {
            whenValue: true,
            questions: [
              {
                id: 'kap_kirchensteuer_betrag',
                label: 'Einbehaltene Kirchensteuer auf Kapitalerträge',
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
    id: 'kap_zinsen_dividenden',
    title: 'Anlage KAP – Zinsen & Dividenden',
    subtitle: 'Inländische Kapitalerträge (Zeilen 7–14)',
    questions: [
      {
        id: 'kap_jahresbescheinigung',
        label: 'Liegt Ihnen die Jahressteuerbescheinigung Ihrer Bank(en) vor?',
        hint: 'Die Banken stellen diese automatisch aus. Sie finden dort alle relevanten Beträge.',
        type: 'yesno',
        required: true,
      },
      {
        id: 'kap_zinsen',
        label: 'Haben Sie Zinserträge erhalten? (Tagesgeld, Festgeld, Sparbuch, Anleihen)',
        type: 'yesno',
        followUps: [
          {
            whenValue: true,
            questions: [
              {
                id: 'kap_zinsen_betrag',
                label: 'Zinserträge gesamt (vor Steuerabzug)',
                hint: 'Aus der Jahressteuerbescheinigung, Zeile „Kapitalerträge".',
                type: 'currency',
                unit: '€',
              },
              {
                id: 'kap_zinsen_abgeltungsteuer',
                label: 'Einbehaltene Abgeltungsteuer auf Zinsen',
                type: 'currency',
                unit: '€',
              },
            ],
          },
        ],
      },
      {
        id: 'kap_dividenden',
        label: 'Haben Sie Dividenden aus Aktien oder Ausschüttungen aus Fonds erhalten?',
        type: 'yesno',
        followUps: [
          {
            whenValue: true,
            questions: [
              {
                id: 'kap_dividenden_betrag',
                label: 'Dividenden/Ausschüttungen gesamt (vor Steuerabzug)',
                type: 'currency',
                unit: '€',
              },
              {
                id: 'kap_dividenden_abgeltungsteuer',
                label: 'Einbehaltene Abgeltungsteuer auf Dividenden',
                type: 'currency',
                unit: '€',
              },
            ],
          },
        ],
      },
      {
        id: 'kap_vorabpauschale',
        label: 'Wurde eine Vorabpauschale auf Ihre Investmentfonds einbehalten?',
        hint: 'Gilt für thesaurierende ETFs/Fonds – seit 2019 jährlich fällig.',
        type: 'yesno',
        followUps: [
          {
            whenValue: true,
            questions: [
              {
                id: 'kap_vorabpauschale_betrag',
                label: 'Vorabpauschale gesamt',
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
    id: 'kap_veraeusserungen',
    title: 'Anlage KAP – Wertpapierverkäufe',
    subtitle: 'Gewinne und Verluste aus Veräußerungen (Zeilen 15–20)',
    questions: [
      {
        id: 'kap_wertpapiere_verkauft',
        label: 'Haben Sie im Steuerjahr Aktien, ETFs, Fonds oder sonstige Wertpapiere verkauft?',
        type: 'yesno',
        followUps: [
          {
            whenValue: true,
            questions: [
              {
                id: 'kap_veraeussl_gewinn',
                label: 'Gewinn aus Wertpapierverkäufen (laut Jahressteuerbescheinigung)',
                hint: 'Positiver Betrag = Gewinn, negativer Betrag = Verlust.',
                type: 'currency',
                unit: '€',
              },
              {
                id: 'kap_veraeussl_aktien_verlust',
                label: 'Verluste aus Aktienverkäufen (gesonderter Verlusttopf)',
                hint: 'Aktienverluste dürfen nur mit Aktiengewinnen verrechnet werden.',
                type: 'currency',
                unit: '€',
              },
              {
                id: 'kap_veraeussl_abgeltungsteuer',
                label: 'Einbehaltene Abgeltungsteuer auf Veräußerungsgewinne',
                type: 'currency',
                unit: '€',
              },
            ],
          },
        ],
      },
      {
        id: 'kap_verlustverrechnung',
        label: 'Haben Sie einen Verlusttopf aus Vorjahren (nicht verrechnete Verluste)?',
        hint: 'Die Bank weist diesen in der Jahressteuerbescheinigung aus.',
        type: 'yesno',
        followUps: [
          {
            whenValue: true,
            questions: [
              {
                id: 'kap_verlust_vorjahr',
                label: 'Verlustvortrag aus Vorjahren',
                type: 'currency',
                unit: '€',
              },
            ],
          },
        ],
      },
      {
        id: 'kap_günstigerprüfung',
        label: 'Möchten Sie prüfen lassen, ob die Günstigerprüfung sinnvoll ist?',
        hint: 'Falls Ihr persönlicher Steuersatz unter 25 % liegt, kann die Günstigerprüfung Steuern sparen.',
        type: 'yesno',
      },
    ],
  },

  {
    id: 'kap_ausland',
    title: 'Anlage KAP – Ausländische Kapitalerträge',
    subtitle: 'Erträge aus ausländischen Konten und Depots (Zeilen 21–39)',
    questions: [
      {
        id: 'kap_ausland_vorhanden',
        label: 'Haben Sie Konten oder Depots im Ausland oder Erträge aus ausländischen Wertpapieren?',
        hint: 'Z.B. Interactive Brokers, Scalable Capital (ausländische Depotbank), US-Aktien mit Quellensteuer.',
        type: 'yesno',
        followUps: [
          {
            whenValue: true,
            questions: [
              {
                id: 'kap_ausland_ertraege',
                label: 'Ausländische Kapitalerträge gesamt',
                type: 'currency',
                unit: '€',
              },
              {
                id: 'kap_ausland_quellensteuer',
                label: 'Im Ausland einbehaltene Quellensteuer',
                hint: 'Z.B. 15 % US-Quellensteuer auf Dividenden – kann angerechnet werden.',
                type: 'currency',
                unit: '€',
              },
              {
                id: 'kap_ausland_laender',
                label: 'In welchen Ländern?',
                type: 'text',
              },
            ],
          },
        ],
      },
    ],
  },
];
