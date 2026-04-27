import type { Section } from '../types';

export const anlageKindSections: Section[] = [
  {
    id: 'kind_grundangaben',
    title: 'Anlage Kind – Grundangaben',
    subtitle: 'Angaben zu Ihren Kindern (je Kind eine Anlage Kind)',
    questions: [
      {
        id: 'kind_anzahl',
        label: 'Wie viele Kinder möchten Sie in der Steuererklärung angeben?',
        hint: 'Für jedes Kind wird eine eigene Anlage Kind ausgefüllt.',
        type: 'select',
        options: ['1', '2', '3', '4', 'mehr als 4'],
        required: true,
      },
      {
        id: 'kind1_vorname',
        label: 'Vorname des 1. Kindes',
        type: 'text',
        required: true,
      },
      {
        id: 'kind1_geburtsdatum',
        label: 'Geburtsdatum des 1. Kindes',
        hint: 'Format: TT.MM.JJJJ',
        type: 'text',
        required: true,
      },
      {
        id: 'kind1_haushalt',
        label: 'Lebt das Kind in Ihrem Haushalt?',
        type: 'yesno',
        required: true,
        followUps: [
          {
            whenValue: false,
            questions: [
              {
                id: 'kind1_anderer_elternteil',
                label: 'Lebt das Kind beim anderen Elternteil?',
                type: 'yesno',
              },
              {
                id: 'kind1_wohnsitz',
                label: 'Wo lebt das Kind?',
                type: 'text',
              },
            ],
          },
        ],
      },
      {
        id: 'kind1_kindergeld',
        label: 'Haben Sie für dieses Kind Kindergeld erhalten?',
        hint: 'Das Finanzamt prüft automatisch ob Kindergeld oder Kinderfreibetrag günstiger ist.',
        type: 'yesno',
        followUps: [
          {
            whenValue: true,
            questions: [
              {
                id: 'kind1_kindergeld_monate',
                label: 'Für wie viele Monate wurde Kindergeld gezahlt?',
                type: 'number',
                unit: 'Monate',
              },
            ],
          },
        ],
      },
      {
        id: 'kind2_vorhanden',
        label: 'Möchten Sie jetzt das 2. Kind eintragen?',
        type: 'yesno',
        followUps: [
          {
            whenValue: true,
            questions: [
              {
                id: 'kind2_vorname',
                label: 'Vorname des 2. Kindes',
                type: 'text',
              },
              {
                id: 'kind2_geburtsdatum',
                label: 'Geburtsdatum des 2. Kindes',
                type: 'text',
              },
              {
                id: 'kind2_haushalt',
                label: 'Lebt das 2. Kind in Ihrem Haushalt?',
                type: 'yesno',
              },
              {
                id: 'kind2_kindergeld',
                label: 'Kindergeld für das 2. Kind erhalten?',
                type: 'yesno',
              },
            ],
          },
        ],
      },
    ],
  },

  {
    id: 'kind_betreuung',
    title: 'Anlage Kind – Kinderbetreuungskosten',
    subtitle: 'Absetzbar bis 4.000 € pro Kind (2/3 von max. 6.000 €)',
    questions: [
      {
        id: 'kind_betreuung_vorhanden',
        label: 'Haben Sie Kosten für die Betreuung eines Kindes unter 14 Jahren gehabt?',
        hint: 'Kita, Kindergarten, Tagesmutter, Hort, Au-pair (Betreuungsanteil).',
        type: 'yesno',
        followUps: [
          {
            whenValue: true,
            questions: [
              {
                id: 'kind_betreuung_art',
                label: 'Art der Betreuung',
                type: 'multiselect',
                options: ['Kita / Kindergarten', 'Tagesmutter / Tagesvater', 'Schulhort / Nachmittagsbetreuung', 'Au-pair', 'Babysitter', 'Sonstige'],
              },
              {
                id: 'kind_betreuung_betrag',
                label: 'Betreuungskosten gesamt im Steuerjahr',
                hint: 'Nur Kosten mit Rechnung und Überweisung – keine Barzahlung!',
                type: 'currency',
                unit: '€',
              },
              {
                id: 'kind_betreuung_bescheinigung',
                label: 'Liegt eine Bescheinigung / Rechnung des Betreuers vor?',
                type: 'yesno',
              },
            ],
          },
        ],
      },
    ],
  },

  {
    id: 'kind_ausbildung',
    title: 'Anlage Kind – Ausbildung & Schule',
    subtitle: 'Schulgeld, auswärtige Unterbringung, Ausbildungsfreibetrag',
    questions: [
      {
        id: 'kind_schulgeld',
        label: 'Besucht ein Kind eine private Schule / Privatschule?',
        hint: '30 % des Schulgeldes (max. 5.000 €) sind absetzbar.',
        type: 'yesno',
        followUps: [
          {
            whenValue: true,
            questions: [
              {
                id: 'kind_schulgeld_betrag',
                label: 'Jährliches Schulgeld',
                type: 'currency',
                unit: '€',
              },
              {
                id: 'kind_schule_name',
                label: 'Name und Ort der Schule',
                type: 'text',
              },
            ],
          },
        ],
      },
      {
        id: 'kind_berufsausbildung',
        label: 'Befindet sich ein Kind in Berufsausbildung oder Studium und lebt auswärts?',
        hint: 'Ausbildungsfreibetrag: 1.200 € / Jahr (wenn Kind auswärts lebt und über 18 ist).',
        type: 'yesno',
        followUps: [
          {
            whenValue: true,
            questions: [
              {
                id: 'kind_ausbildung_art',
                label: 'Art der Ausbildung',
                type: 'select',
                options: ['Studium', 'Berufsausbildung (Ausbildungsbetrieb)', 'Duales Studium', 'Schulausbildung auswärts'],
              },
              {
                id: 'kind_ausbildung_ort',
                label: 'Ausbildungs-/Studienort',
                type: 'text',
              },
              {
                id: 'kind_ausbildung_unterhalt',
                label: 'Haben Sie Unterhalt an das Kind gezahlt?',
                type: 'yesno',
                followUps: [
                  {
                    whenValue: true,
                    questions: [
                      {
                        id: 'kind_ausbildung_unterhalt_betrag',
                        label: 'Unterhalt gesamt im Steuerjahr',
                        type: 'currency',
                        unit: '€',
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },

  {
    id: 'kind_sonstiges',
    title: 'Anlage Kind – Sonstiges',
    subtitle: 'Behinderung, Entlastungsbetrag für Alleinerziehende',
    questions: [
      {
        id: 'kind_behinderung',
        label: 'Ist ein Kind behindert (Grad der Behinderung festgestellt)?',
        hint: 'Pauschbeträge für behinderte Kinder können übertragen werden.',
        type: 'yesno',
        followUps: [
          {
            whenValue: true,
            questions: [
              {
                id: 'kind_behinderung_grad',
                label: 'Grad der Behinderung (GdB)',
                type: 'select',
                options: ['20', '25', '30', '35', '40', '45', '50', '55', '60', '65', '70', '75', '80', '85', '90', '95', '100'],
              },
              {
                id: 'kind_behinderung_merkzeichen',
                label: 'Besondere Merkzeichen (z.B. H, Bl, G)',
                type: 'text',
              },
            ],
          },
        ],
      },
      {
        id: 'kind_alleinerziehend',
        label: 'Sind Sie alleinerziehend und das Kind lebt bei Ihnen?',
        hint: 'Entlastungsbetrag für Alleinerziehende: 4.260 € für das 1. Kind + 240 € je weiteres Kind.',
        type: 'yesno',
      },
    ],
  },
];
