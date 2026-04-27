import type { Section } from '../types';

export const anlageVSections: Section[] = [
  {
    id: 'v_objekt',
    title: 'Anlage V – Immobilie',
    subtitle: 'Angaben zum vermieteten Objekt (Zeilen 1–10)',
    questions: [
      {
        id: 'v_anzahl_objekte',
        label: 'Wie viele vermietete Objekte haben Sie?',
        type: 'select',
        options: ['1', '2', '3', 'mehr als 3'],
        required: true,
      },
      {
        id: 'v_art',
        label: 'Art des Objekts',
        type: 'select',
        options: ['Eigentumswohnung', 'Einfamilienhaus', 'Mehrfamilienhaus', 'Gewerbeimmobilie', 'Garagen / Stellplätze', 'Sonstiges'],
        required: true,
      },
      {
        id: 'v_adresse',
        label: 'Adresse des Objekts',
        hint: 'Straße, Hausnummer, PLZ, Ort',
        type: 'text',
        required: true,
      },
      {
        id: 'v_eigentumsanteil',
        label: 'Eigentumsanteil',
        hint: 'Bei Alleineigentum: 100 %. Bei Miteigentum (z.B. Ehepaar): jeweiliger Anteil.',
        type: 'select',
        options: ['100 %', '50 %', '25 %', 'Sonstiger Anteil'],
      },
      {
        id: 'v_anschaffung_jahr',
        label: 'Jahr der Anschaffung / Fertigstellung',
        hint: 'Relevant für Abschreibung (AfA).',
        type: 'number',
      },
      {
        id: 'v_anschaffungskosten',
        label: 'Anschaffungskosten (Kaufpreis + Nebenkosten)',
        hint: 'Grundlage für die jährliche Abschreibung.',
        type: 'currency',
        unit: '€',
      },
    ],
  },
  {
    id: 'v_einnahmen',
    title: 'Anlage V – Mieteinnahmen',
    subtitle: 'Tatsächliche Einnahmen im Steuerjahr (Zeilen 11–21)',
    questions: [
      {
        id: 'v_kaltmiete',
        label: 'Erhaltene Kaltmiete gesamt im Steuerjahr',
        type: 'currency',
        unit: '€',
        required: true,
      },
      {
        id: 'v_nebenkosten_einnahmen',
        label: 'Erhaltene Nebenkosten-Vorauszahlungen / Umlagen',
        type: 'currency',
        unit: '€',
      },
      {
        id: 'v_nebenkostenabrechnung',
        label: 'Wurde eine Nebenkostenabrechnung erstellt?',
        type: 'yesno',
        followUps: [
          {
            whenValue: true,
            questions: [
              {
                id: 'v_nachzahlung',
                label: 'Nachzahlungen durch Mieter erhalten',
                type: 'currency',
                unit: '€',
              },
              {
                id: 'v_erstattung',
                label: 'Erstattungen an Mieter geleistet',
                type: 'currency',
                unit: '€',
              },
            ],
          },
        ],
      },
      {
        id: 'v_mietausfall',
        label: 'Gab es Mietausfall oder Leerstand?',
        type: 'yesno',
        followUps: [
          {
            whenValue: true,
            questions: [
              {
                id: 'v_leerstand_monate',
                label: 'Leerstand in Monaten',
                type: 'number',
                unit: 'Monate',
              },
              {
                id: 'v_leerstand_grund',
                label: 'Grund des Leerstands',
                type: 'select',
                options: ['Renovierung / Sanierung', 'Mietersuche', 'Eigenbedarf vorbereitung', 'Sonstiges'],
              },
            ],
          },
        ],
      },
      {
        id: 'v_eigennutzung',
        label: 'Wird ein Teil des Objekts selbst genutzt?',
        hint: 'Bei Teilselbstnutzung können Kosten nur anteilig abgesetzt werden.',
        type: 'yesno',
        followUps: [
          {
            whenValue: true,
            questions: [
              {
                id: 'v_eigennutzung_anteil',
                label: 'Selbstgenutzter Flächenanteil',
                type: 'select',
                options: ['10 %', '20 %', '25 %', '30 %', '50 %', 'Sonstiger Anteil'],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'v_werbungskosten',
    title: 'Anlage V – Werbungskosten',
    subtitle: 'Absetzbare Kosten rund um die Immobilie (Zeilen 33–55)',
    questions: [
      {
        id: 'v_schuldzinsen',
        label: 'Haben Sie Schuldzinsen für ein Immobiliendarlehen gezahlt?',
        hint: 'Aus der Jahressteuerbescheinigung der finanzierenden Bank.',
        type: 'yesno',
        followUps: [
          {
            whenValue: true,
            questions: [
              {
                id: 'v_schuldzinsen_betrag',
                label: 'Schuldzinsen gesamt im Steuerjahr',
                type: 'currency',
                unit: '€',
              },
            ],
          },
        ],
      },
      {
        id: 'v_hausgeld',
        label: 'Zahlen Sie Hausgeld / Wohngeld (bei Eigentumswohnungen)?',
        type: 'yesno',
        followUps: [
          {
            whenValue: true,
            questions: [
              {
                id: 'v_hausgeld_betrag',
                label: 'Hausgeld gesamt im Steuerjahr',
                hint: 'Nur der nicht-rücklagenbildende Anteil ist sofort absetzbar.',
                type: 'currency',
                unit: '€',
              },
              {
                id: 'v_instandhaltungsruecklage',
                label: 'Davon Anteil Instandhaltungsrücklage',
                hint: 'Erst absetzbar wenn tatsächlich verwendet.',
                type: 'currency',
                unit: '€',
              },
            ],
          },
        ],
      },
      {
        id: 'v_reparaturen',
        label: 'Haben Sie Reparatur- oder Instandhaltungskosten gehabt?',
        type: 'yesno',
        followUps: [
          {
            whenValue: true,
            questions: [
              {
                id: 'v_reparaturen_betrag',
                label: 'Reparaturkosten gesamt',
                type: 'currency',
                unit: '€',
              },
              {
                id: 'v_grosse_erhaltung',
                label: 'Waren einzelne Maßnahmen über 4.000 € (netto)?',
                hint: 'Große Erhaltungsaufwendungen können auf 2–5 Jahre verteilt werden.',
                type: 'yesno',
              },
            ],
          },
        ],
      },
      {
        id: 'v_grundsteuer',
        label: 'Grundsteuer gezahlt',
        type: 'currency',
        unit: '€',
      },
      {
        id: 'v_versicherungen',
        label: 'Gebäudeversicherungen (Feuer, Haftpflicht, etc.) gezahlt',
        type: 'currency',
        unit: '€',
      },
      {
        id: 'v_verwaltungskosten',
        label: 'Haben Sie einen Hausverwalter oder eine Hausverwaltung beauftragt?',
        type: 'yesno',
        followUps: [
          {
            whenValue: true,
            questions: [
              {
                id: 'v_verwaltungskosten_betrag',
                label: 'Verwaltungskosten gesamt',
                type: 'currency',
                unit: '€',
              },
            ],
          },
        ],
      },
      {
        id: 'v_makler',
        label: 'Maklerkosten für Neuvermietung gehabt?',
        type: 'yesno',
        followUps: [
          {
            whenValue: true,
            questions: [
              {
                id: 'v_makler_betrag',
                label: 'Maklerkosten',
                type: 'currency',
                unit: '€',
              },
            ],
          },
        ],
      },
      {
        id: 'v_sonstige_kosten',
        label: 'Sonstige Werbungskosten (Fahrtkosten, Telefon, Büro etc.)',
        type: 'currency',
        unit: '€',
      },
    ],
  },
];
