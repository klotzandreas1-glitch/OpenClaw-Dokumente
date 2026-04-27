import type { Section } from '../types';

export const anlageSections_S: Section[] = [
  {
    id: 's_grundangaben',
    title: 'Anlage S – Selbstständige Tätigkeit',
    subtitle: 'Freiberufler, Ärzte, Anwälte, Künstler, freie Mitarbeiter (§ 18 EStG)',
    questions: [
      {
        id: 's_taetigkeitsart',
        label: 'Welche selbstständige Tätigkeit üben Sie aus?',
        type: 'text',
        hint: 'Z.B. Arzt, Architekt, Steuerberater, IT-Berater, Journalist, Künstler.',
        required: true,
      },
      {
        id: 's_gewinnermittlung',
        label: 'Wie ermitteln Sie Ihren Gewinn?',
        type: 'select',
        options: [
          'Einnahmen-Überschuss-Rechnung (EÜR) – Formular liegt vor',
          'Einnahmen-Überschuss-Rechnung (EÜR) – muss noch erstellt werden',
          'Bilanz / doppelte Buchführung',
        ],
        required: true,
      },
      {
        id: 's_umsatz',
        label: 'Gesamtumsatz (Einnahmen) im Steuerjahr',
        type: 'currency',
        unit: '€',
        required: true,
      },
      {
        id: 's_gewinn',
        label: 'Vorläufiger Gewinn / Überschuss',
        hint: 'Einnahmen minus Betriebsausgaben.',
        type: 'currency',
        unit: '€',
      },
      {
        id: 's_umsatzsteuer',
        label: 'Sind Sie umsatzsteuerpflichtig?',
        type: 'yesno',
        followUps: [
          {
            whenValue: true,
            questions: [
              {
                id: 's_ust_nummer',
                label: 'Umsatzsteuer-Identifikationsnummer (USt-IdNr.)',
                type: 'text',
              },
            ],
          },
        ],
      },
      {
        id: 's_kleinunternehmer',
        label: 'Sind Sie Kleinunternehmer (§ 19 UStG)?',
        hint: 'Umsatz unter 22.000 € im Vorjahr und voraussichtlich unter 50.000 € im laufenden Jahr.',
        type: 'yesno',
      },
    ],
  },
  {
    id: 's_betriebsausgaben',
    title: 'Anlage S – Betriebsausgaben',
    subtitle: 'Wichtigste Kostenpositionen für die EÜR',
    questions: [
      {
        id: 's_bueromaterial',
        label: 'Kosten für Büromaterial, Software, Fachliteratur',
        type: 'currency',
        unit: '€',
      },
      {
        id: 's_telefon_internet',
        label: 'Telefon, Internet (beruflicher Anteil)',
        type: 'currency',
        unit: '€',
      },
      {
        id: 's_fahrtkosten',
        label: 'Fahrtkosten (PKW, Bahn – beruflich)',
        hint: 'Bei eigenem PKW: Fahrtenbuch oder 1-%-Regel.',
        type: 'currency',
        unit: '€',
      },
      {
        id: 's_arbeitszimmer',
        label: 'Arbeitszimmer / Homeoffice-Pauschale',
        type: 'currency',
        unit: '€',
      },
      {
        id: 's_versicherungen',
        label: 'Berufliche Versicherungen (Berufshaftpflicht etc.)',
        type: 'currency',
        unit: '€',
      },
      {
        id: 's_sonstige_ausgaben',
        label: 'Sonstige Betriebsausgaben',
        type: 'currency',
        unit: '€',
      },
      {
        id: 's_euer_vorhanden',
        label: 'Liegt eine fertige EÜR vor, die wir verwenden sollen?',
        type: 'yesno',
      },
    ],
  },
];
