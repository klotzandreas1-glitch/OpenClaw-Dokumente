import type { Section } from '../types';

export const anlageVorsorgeSections: Section[] = [
  {
    id: 'vorsorge_rente',
    title: 'Vorsorgeaufwand – Altersvorsorge',
    subtitle: 'Beiträge zur gesetzlichen und privaten Rentenversicherung',
    questions: [
      {
        id: 'vorsorge_grv',
        label: 'Haben Sie Beiträge zur gesetzlichen Rentenversicherung (GRV) geleistet?',
        hint: 'Als Arbeitnehmer automatisch – Betrag steht auf der Lohnsteuerbescheinigung (Zeile 22a).',
        type: 'yesno',
        followUps: [
          {
            whenValue: true,
            questions: [
              {
                id: 'vorsorge_grv_betrag',
                label: 'Arbeitnehmer-Anteil GRV (aus Lohnsteuerbescheinigung)',
                type: 'currency',
                unit: '€',
              },
            ],
          },
        ],
      },
      {
        id: 'vorsorge_basisrente',
        label: 'Zahlen Sie Beiträge in eine Basisrente (Rürup-Rente)?',
        hint: 'Absetzbar bis 29.344 € (2025, Alleinstehende) bzw. 58.688 € (Ehepaare).',
        type: 'yesno',
        followUps: [
          {
            whenValue: true,
            questions: [
              {
                id: 'vorsorge_basisrente_betrag',
                label: 'Jahresbeitrag Basisrente',
                type: 'currency',
                unit: '€',
              },
              {
                id: 'vorsorge_basisrente_bescheinigung',
                label: 'Liegt die Bescheinigung des Versicherers vor?',
                type: 'yesno',
              },
            ],
          },
        ],
      },
      {
        id: 'vorsorge_beamtenversorgung',
        label: 'Zahlen Sie Beiträge zu einer berufsständischen Versorgungseinrichtung?',
        hint: 'Z.B. Ärztekammer, Rechtsanwaltskammer, Architektenkammer.',
        type: 'yesno',
        followUps: [
          {
            whenValue: true,
            questions: [
              {
                id: 'vorsorge_beamtenversorgung_betrag',
                label: 'Jahresbeitrag',
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
    id: 'vorsorge_kranken',
    title: 'Vorsorgeaufwand – Kranken- & Pflegeversicherung',
    subtitle: 'Basisabsicherung Kranken- und Pflegeversicherung',
    questions: [
      {
        id: 'vorsorge_kv_art',
        label: 'Wie sind Sie krankenversichert?',
        type: 'select',
        options: [
          'Gesetzlich pflichtversichert (Arbeitnehmer)',
          'Gesetzlich freiwillig versichert',
          'Privat krankenversichert (PKV)',
        ],
        required: true,
        followUps: [
          {
            whenValue: 'Gesetzlich pflichtversichert (Arbeitnehmer)',
            questions: [
              {
                id: 'vorsorge_gkv_betrag',
                label: 'Arbeitnehmer-Anteil Krankenversicherung (aus Lohnsteuerbescheinigung, Zeile 23)',
                type: 'currency',
                unit: '€',
              },
              {
                id: 'vorsorge_gpv_betrag',
                label: 'Arbeitnehmer-Anteil Pflegeversicherung (Zeile 24)',
                type: 'currency',
                unit: '€',
              },
            ],
          },
          {
            whenValue: 'Gesetzlich freiwillig versichert',
            questions: [
              {
                id: 'vorsorge_gkv_frei_betrag',
                label: 'Gezahlte KV-Beiträge gesamt (Arbeitnehmer- und ggf. Arbeitgeberanteil)',
                type: 'currency',
                unit: '€',
              },
            ],
          },
          {
            whenValue: 'Privat krankenversichert (PKV)',
            questions: [
              {
                id: 'vorsorge_pkv_betrag',
                label: 'PKV-Jahresprämie gesamt (inkl. Krankengeldanteil)',
                type: 'currency',
                unit: '€',
              },
              {
                id: 'vorsorge_pkv_ag_zuschuss',
                label: 'Arbeitgeberzuschuss zur PKV',
                hint: 'Steht auf der Lohnsteuerbescheinigung, Zeile 25.',
                type: 'currency',
                unit: '€',
              },
              {
                id: 'vorsorge_pkv_bescheinigung',
                label: 'Liegt die Beitragsbescheinigung des Versicherers vor?',
                hint: 'Der Versicherer ist zur Ausstellung verpflichtet.',
                type: 'yesno',
              },
            ],
          },
        ],
      },
      {
        id: 'vorsorge_zusatzkranken',
        label: 'Zahlen Sie Beiträge zu einer privaten Krankenzusatzversicherung?',
        hint: 'Z.B. Zahnzusatz, Krankenhaustagegeld, Auslandskrankenversicherung.',
        type: 'yesno',
        followUps: [
          {
            whenValue: true,
            questions: [
              {
                id: 'vorsorge_zusatzkranken_betrag',
                label: 'Jahresbeiträge Zusatzversicherung gesamt',
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
    id: 'vorsorge_sonstige',
    title: 'Vorsorgeaufwand – Sonstige Versicherungen',
    subtitle: 'Weitere absetzbare Vorsorgeaufwendungen (max. 1.900 € / 2.800 € Höchstbetrag)',
    questions: [
      {
        id: 'vorsorge_bu',
        label: 'Zahlen Sie Beiträge zu einer Berufsunfähigkeitsversicherung (BU)?',
        type: 'yesno',
        followUps: [
          {
            whenValue: true,
            questions: [
              {
                id: 'vorsorge_bu_betrag',
                label: 'Jahresbeitrag BU',
                type: 'currency',
                unit: '€',
              },
            ],
          },
        ],
      },
      {
        id: 'vorsorge_unfall',
        label: 'Zahlen Sie Beiträge zu einer privaten Unfallversicherung?',
        type: 'yesno',
        followUps: [
          {
            whenValue: true,
            questions: [
              {
                id: 'vorsorge_unfall_betrag',
                label: 'Jahresbeitrag Unfallversicherung',
                type: 'currency',
                unit: '€',
              },
            ],
          },
        ],
      },
      {
        id: 'vorsorge_haftpflicht',
        label: 'Zahlen Sie Beiträge zu einer privaten Haftpflichtversicherung?',
        type: 'yesno',
        followUps: [
          {
            whenValue: true,
            questions: [
              {
                id: 'vorsorge_haftpflicht_betrag',
                label: 'Jahresbeitrag Haftpflichtversicherung',
                type: 'currency',
                unit: '€',
              },
            ],
          },
        ],
      },
      {
        id: 'vorsorge_lebensversicherung',
        label: 'Haben Sie eine Lebensversicherung mit Vertragsbeginn vor 2005?',
        hint: 'Nur Altverträge (Abschluss vor 01.01.2005) sind noch als Vorsorgeaufwand absetzbar.',
        type: 'yesno',
        followUps: [
          {
            whenValue: true,
            questions: [
              {
                id: 'vorsorge_lebensversicherung_betrag',
                label: 'Jahresbeitrag Lebensversicherung',
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
