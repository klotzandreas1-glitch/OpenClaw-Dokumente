import { useState } from 'react';
import { ALLE_ANLAGEN, type AnlageInfo } from '../data/alleAnlagen';

interface Props {
  onWeiter: (ausgewaehlte: AnlageInfo[]) => void;
}

export default function AnlagenAuswahl({ onWeiter }: Props) {
  const [ausgewaehlt, setAusgewaehlt] = useState<Set<string>>(
    new Set(ALLE_ANLAGEN.filter((a) => a.pflicht).map((a) => a.id)),
  );

  const toggle = (id: string) => {
    setAusgewaehlt((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleWeiter = () => {
    const ausgewaehlte = ALLE_ANLAGEN.filter((a) => ausgewaehlt.has(a.id));
    onWeiter(ausgewaehlte);
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-slate-800 mb-1">
        Was trifft auf Sie zu?
      </h2>
      <p className="text-slate-500 text-sm mb-6">
        Wählen Sie alle Punkte aus, die auf Ihre Situation zutreffen.
        Wir fragen dann nur die relevanten Abschnitte ab.
      </p>

      <div className="space-y-3 mb-8">
        {ALLE_ANLAGEN.map((anlage) => {
          const aktiv = ausgewaehlt.has(anlage.id);
          return (
            <button
              key={anlage.id}
              type="button"
              onClick={() => !anlage.pflicht && toggle(anlage.id)}
              className={`w-full text-left rounded-xl border-2 p-4 transition-all ${
                aktiv
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              } ${anlage.pflicht ? 'cursor-default' : 'cursor-pointer'}`}
            >
              <div className="flex items-center gap-4">
                {/* Checkbox */}
                <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all ${
                  aktiv ? 'border-blue-500 bg-blue-500' : 'border-slate-300 bg-white'
                }`}>
                  {aktiv && (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 12 12">
                      <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>

                {/* Icon + Text */}
                <span className="text-2xl">{anlage.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-800">{anlage.kurzTitel}</span>
                    {anlage.pflicht && (
                      <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
                        immer dabei
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-500 mt-0.5">{anlage.beschreibung}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 text-sm text-amber-800">
        <strong>Hinweis:</strong> Haben Sie weitere Einkunftsarten wie Vermietung (Anlage V),
        Selbstständigkeit (Anlage S) oder Rente (Anlage R)? Diese Anlagen werden in den
        nächsten Versionen ergänzt. Bitte teilen Sie uns diese Sachverhalte im
        Kommentarfeld am Ende mit.
      </div>

      <button
        onClick={handleWeiter}
        className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow text-lg"
      >
        Fragebogen starten →
      </button>
    </div>
  );
}
