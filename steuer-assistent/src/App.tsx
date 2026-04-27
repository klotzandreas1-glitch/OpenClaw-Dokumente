import { useMemo } from 'react';
import Wizard from './components/Wizard';
import Admin from './pages/Admin';
import { anlageNSections } from './data/anlageN';
import { parseMandantUrl } from './utils/encode';
import './index.css';

const STEUERJAHR = new Date().getFullYear() - 1;

export default function App() {
  const { mandantId, clientName, vorjahrAnswers, isAdmin } = useMemo(
    () => parseMandantUrl(),
    [],
  );

  if (isAdmin) {
    return <Admin />;
  }

  const displayName = clientName || 'Mandant';

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-1 flex-wrap">
            <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wide">
              Einkommensteuererklärung {STEUERJAHR}
            </span>
            <span className="bg-slate-100 text-slate-500 text-xs font-medium px-2.5 py-1 rounded-full">
              Anlage N
            </span>
            {clientName && (
              <span className="bg-green-100 text-green-700 text-xs font-medium px-2.5 py-1 rounded-full">
                {displayName}
              </span>
            )}
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mt-3">Steuerdaten-Erfassung</h1>
          <p className="text-slate-500 mt-2">
            Bitte beantworten Sie die folgenden Fragen so vollständig wie möglich.
            Alle Angaben werden verschlüsselt übertragen.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <Wizard
            sections={anlageNSections}
            initialAnswers={vorjahrAnswers}
            clientName={displayName}
            mandantId={mandantId || 'unbekannt'}
            steuerjahr={STEUERJAHR}
          />
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">
          Ihre Daten werden ausschließlich für die Erstellung Ihrer Steuererklärung
          verwendet und nicht an Dritte weitergegeben.
        </p>
      </div>
    </div>
  );
}
