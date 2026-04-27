import type { Section } from '../types';

export const anlageNSections: Section[] = [
  {
    id: 'arbeitgeber',
    title: 'Arbeitgeber & Arbeitslohn',
    subtitle: 'Angaben aus Ihrer Lohnsteuerbescheinigung (Zeilen 4–22 Anlage N)',
    questions: [
      {
        id: 'anzahl_arbeitgeber',
        label: 'Wie viele Arbeitgeber hatten Sie im Steuerjahr?',
        hint: 'Zählen Sie auch Mini-Jobs, kurzfristige Beschäftigungen und ausgeschiedene Arbeitgeber.',
        type: 'select',
        options: ['1', '2', '3', 'mehr als 3'],
        required: true,
      },
      {
        id: 'ag1_name',
        label: 'Name des Arbeitgebers (1. Arbeitgeber)',
        type: 'text',
        required: true,
      },
      {
        id: 'ag1_bruttoarbeitslohn',
        label: 'Bruttoarbeitslohn (Zeile 3 der Lohnsteuerbescheinigung)',
        hint: 'Tragen Sie den Betrag aus der Lohnsteuerbescheinigung ein.',
        type: 'currency',
        required: true,
        unit: '€',
      },
      {
        id: 'ag1_lohnsteuer',
        label: 'Einbehaltene Lohnsteuer',
        type: 'currency',
        unit: '€',
      },
      {
        id: 'ag1_soli',
        label: 'Solidaritätszuschlag',
        type: 'currency',
        unit: '€',
      },
      {
        id: 'ag1_kirchensteuer_an',
        label: 'Kirchensteuer Arbeitnehmer',
        type: 'currency',
        unit: '€',
      },
      {
        id: 'zweiter_arbeitgeber',
        label: 'Hatten Sie einen zweiten Arbeitgeber?',
        type: 'yesno',
        followUps: [
          {
            whenValue: true,
            questions: [
              {
                id: 'ag2_name',
                label: 'Name des 2. Arbeitgebers',
                type: 'text',
              },
              {
                id: 'ag2_bruttoarbeitslohn',
                label: 'Bruttoarbeitslohn (2. Arbeitgeber)',
                type: 'currency',
                unit: '€',
              },
              {
                id: 'ag2_lohnsteuer',
                label: 'Einbehaltene Lohnsteuer (2. Arbeitgeber)',
                type: 'currency',
                unit: '€',
              },
              {
                id: 'ag2_soli',
                label: 'Solidaritätszuschlag (2. Arbeitgeber)',
                type: 'currency',
                unit: '€',
              },
            ],
          },
        ],
      },
      {
        id: 'versorgungsbezuege',
        label: 'Erhalten Sie eine Betriebsrente, Pension oder Versorgungsbezüge?',
        hint: 'Zum Beispiel vom früheren Arbeitgeber oder als Hinterbliebener.',
        type: 'yesno',
        followUps: [
          {
            whenValue: true,
            questions: [
              {
                id: 'versorgungsbezuege_betrag',
                label: 'Bruttoversorgungsbezüge (Zeile 3 der Lohnsteuerbescheinigung)',
                type: 'currency',
                unit: '€',
              },
              {
                id: 'versorgungsbezuege_beginn',
                label: 'Beginn des Versorgungsbezugs (Jahr)',
                hint: 'Relevant für den Versorgungsfreibetrag.',
                type: 'number',
              },
            ],
          },
        ],
      },
    ],
  },

  {
    id: 'lohnersatz',
    title: 'Lohnersatzleistungen',
    subtitle: 'Unterliegen dem Progressionsvorbehalt (Zeilen 23–28 Anlage N)',
    questions: [
      {
        id: 'lohnersatz_erhalten',
        label: 'Haben Sie Lohnersatzleistungen erhalten?',
        hint: 'Z.B. Arbeitslosengeld, Kurzarbeitergeld, Kranken-, Mutterschafts- oder Elterngeld.',
        type: 'yesno',
        followUps: [
          {
            whenValue: true,
            questions: [
              {
                id: 'lohnersatz_arten',
                label: 'Welche Lohnersatzleistungen haben Sie erhalten?',
                type: 'multiselect',
                options: [
                  'Arbeitslosengeld I',
                  'Kurzarbeitergeld',
                  'Krankengeld',
                  'Mutterschaftsgeld',
                  'Elterngeld',
                  'Insolvenzgeld',
                  'Übergangsgeld',
                  'Sonstige',
                ],
              },
              {
                id: 'lohnersatz_betrag',
                label: 'Gesamtbetrag der Lohnersatzleistungen',
                hint: 'Aus dem Bescheid der Agentur für Arbeit oder Krankenkasse.',
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
    id: 'fahrtkosten',
    title: 'Fahrten zur Arbeitsstätte',
    subtitle: 'Entfernungspauschale (Zeilen 31–38 Anlage N)',
    questions: [
      {
        id: 'entfernung_km',
        label: 'Wie viele Kilometer beträgt die einfache Entfernung zur ersten Tätigkeitsstätte?',
        hint: 'Die kürzeste Straßenverbindung, gerundet auf volle Kilometer.',
        type: 'number',
        unit: 'km',
        required: true,
      },
      {
        id: 'arbeitstage',
        label: 'An wie vielen Tagen sind Sie zur Arbeitsstätte gefahren?',
        hint: 'Abzüglich Homeoffice-Tage, Urlaub, Krankheit.',
        type: 'number',
        unit: 'Tage',
        required: true,
      },
      {
        id: 'verkehrsmittel',
        label: 'Welches Verkehrsmittel haben Sie hauptsächlich genutzt?',
        type: 'select',
        options: [
          'Eigenes Kraftfahrzeug (PKW/Motorrad)',
          'Öffentliche Verkehrsmittel',
          'Kombination PKW + ÖPNV',
          'Fahrrad',
          'Zu Fuß',
        ],
        required: true,
        followUps: [
          {
            whenValue: 'Öffentliche Verkehrsmittel',
            questions: [
              {
                id: 'oepnv_kosten',
                label: 'Tatsächliche Kosten für öffentliche Verkehrsmittel',
                hint: 'Wenn die tatsächlichen Kosten die Entfernungspauschale übersteigen, können diese angesetzt werden.',
                type: 'currency',
                unit: '€',
              },
            ],
          },
          {
            whenValue: 'Kombination PKW + ÖPNV',
            questions: [
              {
                id: 'park_and_ride_km',
                label: 'Kilometer mit dem PKW bis zum Bahnhof/Haltestelle (Park & Ride)',
                type: 'number',
                unit: 'km',
              },
              {
                id: 'oepnv_kosten_kombi',
                label: 'Kosten für den ÖPNV-Teil',
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
    id: 'homeoffice',
    title: 'Homeoffice & Arbeitszimmer',
    subtitle: 'Zeilen 88 und 84–87 Anlage N',
    questions: [
      {
        id: 'homeoffice_tage',
        label: 'An wie vielen Tagen haben Sie ausschließlich von zu Hause gearbeitet?',
        hint: 'Gilt für die Homeoffice-Tagespauschale (6 € pro Tag, max. 1.260 €/Jahr für 2024).',
        type: 'number',
        unit: 'Tage',
        required: true,
      },
      {
        id: 'arbeitszimmer',
        label: 'Haben Sie ein häusliches Arbeitszimmer, das Ihnen ausschließlich und dauerhaft zur beruflichen Nutzung zur Verfügung steht?',
        hint: 'Kein gemischtes Nutzung (z.B. auch als Gästezimmer). Für die volle Jahrespauschale (1.260 €) muss es den Mittelpunkt Ihrer gesamten Tätigkeit bilden.',
        type: 'yesno',
        followUps: [
          {
            whenValue: true,
            questions: [
              {
                id: 'arbeitszimmer_mittelpunkt',
                label: 'Bildet das Arbeitszimmer den Mittelpunkt Ihrer gesamten beruflichen Tätigkeit?',
                hint: 'Ja: Jahrespauschale 1.260 € oder tatsächliche Kosten. Nein: kein Abzug mehr möglich (seit 2023).',
                type: 'yesno',
              },
              {
                id: 'arbeitszimmer_flaeche',
                label: 'Fläche des Arbeitszimmers',
                type: 'number',
                unit: 'm²',
              },
              {
                id: 'arbeitszimmer_gesamtflaeche',
                label: 'Gesamtfläche der Wohnung',
                type: 'number',
                unit: 'm²',
              },
              {
                id: 'arbeitszimmer_jahresmiete',
                label: 'Jährliche Gesamtmiete inkl. Nebenkosten (oder Gebäudekosten bei Eigentum)',
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
    id: 'dienstreisen',
    title: 'Dienstreisen & Auswärtstätigkeiten',
    subtitle: 'Reisekosten, Verpflegungsmehraufwand (Zeilen 49–63 Anlage N)',
    questions: [
      {
        id: 'dienstreisen_vorhanden',
        label: 'Haben Sie im Steuerjahr berufliche Auswärtstätigkeiten / Dienstreisen unternommen?',
        type: 'yesno',
        followUps: [
          {
            whenValue: true,
            questions: [
              {
                id: 'dienstreisen_erstattung',
                label: 'Hat Ihr Arbeitgeber Reisekosten erstattet?',
                type: 'yesno',
                followUps: [
                  {
                    whenValue: true,
                    questions: [
                      {
                        id: 'dienstreisen_erstattung_betrag',
                        label: 'Erstatteter Betrag durch den Arbeitgeber',
                        type: 'currency',
                        unit: '€',
                      },
                    ],
                  },
                ],
              },
              {
                id: 'verpflegungsmehraufwand',
                label: 'Gab es Auswärtstätigkeiten mit Abwesenheit über 8 Stunden?',
                hint: 'Ab 8 Stunden Abwesenheit: 14 €/Tag, ab 24 Stunden: 28 €/Tag (Inland 2024).',
                type: 'yesno',
                followUps: [
                  {
                    whenValue: true,
                    questions: [
                      {
                        id: 'abwesenheit_8h_tage',
                        label: 'Anzahl Tage mit 8–24 Stunden Abwesenheit (Inland)',
                        type: 'number',
                        unit: 'Tage',
                      },
                      {
                        id: 'abwesenheit_24h_tage',
                        label: 'Anzahl Tage mit über 24 Stunden Abwesenheit / ganztägige Auswärtstätigkeit (Inland)',
                        type: 'number',
                        unit: 'Tage',
                      },
                      {
                        id: 'ausland_dienstreisen',
                        label: 'Gab es auch Auslandsdienstreisen?',
                        type: 'yesno',
                        followUps: [
                          {
                            whenValue: true,
                            questions: [
                              {
                                id: 'ausland_laender',
                                label: 'In welche Länder? (Komma-getrennt)',
                                hint: 'Für Ausland gelten länderspezifische Pauschbeträge.',
                                type: 'text',
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
                id: 'fahrtkosten_dienstreise',
                label: 'Sind eigene Fahrtkosten (PKW, Bahn, Flug) entstanden?',
                type: 'yesno',
                followUps: [
                  {
                    whenValue: true,
                    questions: [
                      {
                        id: 'fahrtkosten_pkw_km',
                        label: 'Mit eigenem PKW gefahrene Kilometer (Dienstreisen gesamt)',
                        hint: 'Pauschale 0,30 € / km.',
                        type: 'number',
                        unit: 'km',
                      },
                      {
                        id: 'fahrtkosten_bahn_flug',
                        label: 'Kosten Bahn / Flug / Taxi (nicht erstattete Kosten)',
                        type: 'currency',
                        unit: '€',
                      },
                    ],
                  },
                ],
              },
              {
                id: 'uebernachtungskosten',
                label: 'Sind nicht erstattete Übernachtungskosten entstanden?',
                type: 'yesno',
                followUps: [
                  {
                    whenValue: true,
                    questions: [
                      {
                        id: 'uebernachtungskosten_betrag',
                        label: 'Übernachtungskosten gesamt (nicht erstatteter Anteil)',
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
    id: 'doppelte_haushaltsfuehrung',
    title: 'Doppelte Haushaltsführung',
    subtitle: 'Zeilen 64–83 Anlage N',
    questions: [
      {
        id: 'doppelte_hf',
        label: 'Unterhalten Sie am Beschäftigungsort eine zweite Wohnung (doppelte Haushaltsführung)?',
        hint: 'Voraussetzung: eigener Haupthausstand an einem anderen Ort aus eigenem Interesse und finanzielle Beteiligung.',
        type: 'yesno',
        followUps: [
          {
            whenValue: true,
            questions: [
              {
                id: 'doppelte_hf_ort',
                label: 'Ort der Zweitwohnung',
                type: 'text',
              },
              {
                id: 'doppelte_hf_miete',
                label: 'Monatliche Miete inkl. Nebenkosten der Zweitwohnung',
                hint: 'Maximal 1.000 €/Monat sind abzugsfähig.',
                type: 'currency',
                unit: '€/Monat',
              },
              {
                id: 'doppelte_hf_beginn',
                label: 'Beginn der doppelten Haushaltsführung im Steuerjahr',
                hint: 'Falls sie das ganze Jahr bestand, leer lassen.',
                type: 'text',
              },
              {
                id: 'doppelte_hf_heimfahrten',
                label: 'Anzahl der Heimfahrten zum Haupthausstand',
                hint: 'Eine Heimfahrt pro Woche ist abzugsfähig (Entfernungspauschale).',
                type: 'number',
                unit: 'Fahrten',
              },
              {
                id: 'doppelte_hf_heimfahrt_km',
                label: 'Kilometer je Heimfahrt (einfache Strecke)',
                type: 'number',
                unit: 'km',
              },
            ],
          },
        ],
      },
    ],
  },

  {
    id: 'sonstige_werbungskosten',
    title: 'Sonstige Werbungskosten',
    subtitle: 'Zeilen 89–99 Anlage N',
    questions: [
      {
        id: 'arbeitsmittel',
        label: 'Haben Sie Arbeitsmittel selbst angeschafft?',
        hint: 'PC, Drucker, Schreibtisch, Bürostuhl, Werkzeug etc. – die beruflich genutzt werden.',
        type: 'yesno',
        followUps: [
          {
            whenValue: true,
            questions: [
              {
                id: 'arbeitsmittel_liste',
                label: 'Bitte kurz beschreiben, was angeschafft wurde',
                hint: 'Gegenstände über 800 € netto werden über mehrere Jahre abgeschrieben.',
                type: 'text',
              },
              {
                id: 'arbeitsmittel_kosten',
                label: 'Gesamtkosten der Arbeitsmittel',
                type: 'currency',
                unit: '€',
              },
              {
                id: 'arbeitsmittel_berufl_anteil',
                label: 'Beruflicher Nutzungsanteil',
                hint: 'Bei gemischter Nutzung (z.B. PC): prozentualer beruflicher Anteil.',
                type: 'select',
                options: ['100%', '90%', '75%', '50%', 'Sonstiger Anteil'],
              },
            ],
          },
        ],
      },
      {
        id: 'berufskleidung',
        label: 'Haben Sie typische Berufskleidung angeschafft oder reinigen lassen?',
        hint: 'Nur typische Berufskleidung (Uniform, Schutzkleidung, Robe), keine bürgerliche Kleidung.',
        type: 'yesno',
        followUps: [
          {
            whenValue: true,
            questions: [
              {
                id: 'berufskleidung_kosten',
                label: 'Kosten für Berufskleidung (Kauf + Reinigung)',
                type: 'currency',
                unit: '€',
              },
            ],
          },
        ],
      },
      {
        id: 'fortbildung',
        label: 'Haben Sie Kosten für Fortbildung, Fachkurse oder Seminare gehabt?',
        hint: 'Beruflich veranlasste Weiterbildung, nicht erstattete Kosten.',
        type: 'yesno',
        followUps: [
          {
            whenValue: true,
            questions: [
              {
                id: 'fortbildung_beschreibung',
                label: 'Welche Fortbildungsmaßnahmen?',
                type: 'text',
              },
              {
                id: 'fortbildung_kosten',
                label: 'Gesamtkosten (Kursgebühren, Fahrtkosten, Unterkunft)',
                type: 'currency',
                unit: '€',
              },
            ],
          },
        ],
      },
      {
        id: 'fachliteratur',
        label: 'Haben Sie Fachliteratur, Fachzeitschriften oder berufliche Software gekauft?',
        type: 'yesno',
        followUps: [
          {
            whenValue: true,
            questions: [
              {
                id: 'fachliteratur_kosten',
                label: 'Kosten für Fachliteratur / Software',
                type: 'currency',
                unit: '€',
              },
            ],
          },
        ],
      },
      {
        id: 'gewerkschaft',
        label: 'Sind Sie Mitglied in einer Gewerkschaft oder einem Berufsverband?',
        type: 'yesno',
        followUps: [
          {
            whenValue: true,
            questions: [
              {
                id: 'gewerkschaft_beitrag',
                label: 'Jahresbeitrag',
                type: 'currency',
                unit: '€',
              },
            ],
          },
        ],
      },
      {
        id: 'telefon_internet',
        label: 'Nutzen Sie Ihr privates Telefon oder Internet beruflich?',
        hint: 'Pauschal 20 % der Kosten (max. 20 €/Monat) sind ohne Einzelnachweis absetzbar.',
        type: 'yesno',
        followUps: [
          {
            whenValue: true,
            questions: [
              {
                id: 'telefon_internet_kosten',
                label: 'Monatliche Gesamtkosten Telefon + Internet',
                type: 'currency',
                unit: '€/Monat',
              },
              {
                id: 'telefon_internet_anteil',
                label: 'Geschätzter beruflicher Nutzungsanteil',
                type: 'select',
                options: ['20% (Pauschale)', '30%', '50%', 'Mehr – mit Einzelnachweisen'],
              },
            ],
          },
        ],
      },
      {
        id: 'sonstige_wb_kosten',
        label: 'Haben Sie weitere beruflich veranlasste Kosten, die noch nicht erfasst wurden?',
        hint: 'Z.B. Kontoführungsgebühren (16 € Pauschale), Bewerbungskosten, Berufsverbände etc.',
        type: 'yesno',
        followUps: [
          {
            whenValue: true,
            questions: [
              {
                id: 'sonstige_wb_beschreibung',
                label: 'Beschreibung der sonstigen Werbungskosten',
                type: 'text',
              },
              {
                id: 'sonstige_wb_betrag',
                label: 'Betrag',
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
    id: 'vl_altersvorsorge',
    title: 'Vermögenswirksame Leistungen & Altersvorsorge',
    subtitle: 'Zeilen 95–99 Anlage N',
    questions: [
      {
        id: 'vl_erhalten',
        label: 'Hat Ihr Arbeitgeber vermögenswirksame Leistungen (VL) gezahlt?',
        hint: 'Zu sehen auf der Lohnsteuerbescheinigung (Zeile 15).',
        type: 'yesno',
        followUps: [
          {
            whenValue: true,
            questions: [
              {
                id: 'vl_betrag',
                label: 'VL-Betrag laut Lohnsteuerbescheinigung',
                type: 'currency',
                unit: '€',
              },
              {
                id: 'vl_institut',
                label: 'Bei welchem Institut angelegt? (z.B. Bank, Bausparkasse)',
                type: 'text',
              },
            ],
          },
        ],
      },
      {
        id: 'betriebliche_altersvorsorge',
        label: 'Wurden Beiträge zur betrieblichen Altersvorsorge (bAV) vom Lohn einbehalten?',
        hint: 'Direktversicherung, Pensionskasse, Pensionsfonds – zu sehen auf der Lohnsteuerbescheinigung.',
        type: 'yesno',
        followUps: [
          {
            whenValue: true,
            questions: [
              {
                id: 'bav_betrag',
                label: 'Beitrag zur betrieblichen Altersvorsorge (steuerfrei)',
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
    id: 'unterlagen',
    title: 'Unterlagen & Belege',
    subtitle: 'Bitte halten Sie folgende Dokumente bereit',
    questions: [
      {
        id: 'lohnsteuerbescheinigung_vorhanden',
        label: 'Liegt Ihnen die Lohnsteuerbescheinigung vor?',
        hint: 'Ausgestellt vom Arbeitgeber, häufig auch digital über das Lohnabrechungssystem.',
        type: 'yesno',
        required: true,
      },
      {
        id: 'belege_werbungskosten',
        label: 'Haben Sie Belege für Ihre Werbungskosten gesammelt?',
        hint: 'Quittungen, Rechnungen, Kontoauszüge – wichtig bei Beträgen über dem Pauschbetrag (1.230 €).',
        type: 'yesno',
      },
      {
        id: 'hinweis_belege',
        label: 'Hinweis: Bitte reichen Sie alle Belege zusammen mit diesem Fragebogen ein.',
        hint: 'Scans oder Fotos der Originalbelege sind ausreichend.',
        type: 'info',
      },
      {
        id: 'anmerkungen',
        label: 'Haben Sie weitere Anmerkungen oder besondere Umstände mitzuteilen?',
        hint: 'Z.B. Jobwechsel, Kündigung, Auslandsaufenthalt, Kurzarbeit etc.',
        type: 'text',
      },
    ],
  },
];
