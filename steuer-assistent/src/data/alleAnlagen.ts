import type { Section } from '../types';
import { anlageNSections } from './anlageN';
import { anlageKAPSections } from './anlageKAP';
import { anlageVorsorgeSections } from './anlageVorsorge';
import { anlageKindSections } from './anlageKind';

export interface AnlageInfo {
  id: string;
  kurzTitel: string;
  titel: string;
  beschreibung: string;
  emoji: string;
  sections: Section[];
  pflicht?: boolean; // immer dabei, kann nicht abgewählt werden
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
];
