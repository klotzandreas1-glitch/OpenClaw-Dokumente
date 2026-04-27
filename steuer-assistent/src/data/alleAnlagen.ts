import type { Section } from '../types';
import { anlageNSections } from './anlageN';
import { anlageKAPSections } from './anlageKAP';
import { anlageVorsorgeSections } from './anlageVorsorge';
import { anlageKindSections } from './anlageKind';
import { anlageVSections } from './anlageV';
import { anlageRSections } from './anlageR';
import { anlageHaushaltsnaheSections } from './anlageHaushaltsnahe';
import { anlageSections_S } from './anlageS';
import { anlageGSections } from './anlageG';
import { anlageSOSections } from './anlageSO';
import { anlageAVSections } from './anlageAV';

export interface AnlageInfo {
  id: string;
  kurzTitel: string;
  titel: string;
  beschreibung: string;
  emoji: string;
  sections: Section[];
  pflicht?: boolean;
}

export const ALLE_ANLAGEN: AnlageInfo[] = [
  {
    id: 'N',
    kurzTitel: 'Anlage N',
    titel: 'Nichtselbstständige Arbeit',
    beschreibung: 'Arbeitnehmer, Angestellte, Beamte – Lohn und Gehalt',
    emoji: '💼',
    sections: anlageNSections,
    pflicht: true,
  },
  {
    id: 'KAP',
    kurzTitel: 'Anlage KAP',
    titel: 'Kapitalerträge',
    beschreibung: 'Bankzinsen, Dividenden, Aktienverkäufe, Fonds',
    emoji: '🏦',
    sections: anlageKAPSections,
  },
  {
    id: 'VORSORGE',
    kurzTitel: 'Vorsorgeaufwand',
    titel: 'Vorsorgeaufwendungen',
    beschreibung: 'Kranken-, Renten-, Lebens- und Haftpflichtversicherung',
    emoji: '🛡️',
    sections: anlageVorsorgeSections,
  },
  {
    id: 'KIND',
    kurzTitel: 'Anlage Kind',
    titel: 'Kinder',
    beschreibung: 'Kindergeld, Kinderbetreuung, Schulgeld, Ausbildung',
    emoji: '👨‍👩‍👧',
    sections: anlageKindSections,
  },
  {
    id: 'V',
    kurzTitel: 'Anlage V',
    titel: 'Vermietung & Verpachtung',
    beschreibung: 'Mieteinnahmen, Schuldzinsen, Reparaturen, Abschreibung',
    emoji: '🏠',
    sections: anlageVSections,
  },
  {
    id: 'R',
    kurzTitel: 'Anlage R',
    titel: 'Renten & Pensionen',
    beschreibung: 'Gesetzliche Rente, Betriebsrente, private Leibrente',
    emoji: '👴',
    sections: anlageRSections,
  },
  {
    id: 'HAUSH',
    kurzTitel: 'Haushaltsnahe',
    titel: 'Haushaltsnahe Leistungen',
    beschreibung: 'Putzhilfe, Handwerker, Pflegedienst, Gartenpflege',
    emoji: '🔧',
    sections: anlageHaushaltsnaheSections,
  },
  {
    id: 'S',
    kurzTitel: 'Anlage S',
    titel: 'Selbstständige Tätigkeit',
    beschreibung: 'Freiberufler, Ärzte, Berater, Künstler (§ 18 EStG)',
    emoji: '📋',
    sections: anlageSections_S,
  },
  {
    id: 'G',
    kurzTitel: 'Anlage G',
    titel: 'Gewerbebetrieb',
    beschreibung: 'Einzelunternehmen, Personengesellschaften (§ 15 EStG)',
    emoji: '🏭',
    sections: anlageGSections,
  },
  {
    id: 'SO',
    kurzTitel: 'Anlage SO',
    titel: 'Sonstige Einkünfte',
    beschreibung: 'Unterhalt, Immobilienverkauf, Kryptowährungen',
    emoji: '💱',
    sections: anlageSOSections,
  },
  {
    id: 'AV',
    kurzTitel: 'Anlage AV',
    titel: 'Riester-Rente',
    beschreibung: 'Riester-Vertrag, staatliche Zulagen, Wohn-Riester',
    emoji: '💰',
    sections: anlageAVSections,
  },
];
