import Wizard from './components/Wizard';
import { anlageNSections } from './data/anlageN';
import './index.css';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wide">
              Einkommensteuererklärung
            </span>
            <span className="bg-slate-100 text-slate-500 text-xs font-medium px-2.5 py-1 rounded-full">
              Anlage N
            </span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mt-3">
            Steuerdaten-Erfassung
          </h1>
          <p className="text-slate-500 mt-2">
            Bitte beantworten Sie die folgenden Fragen so vollständig wie möglich.
            Alle Angaben werden verschlüsselt übertragen.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <Wizard sections={anlageNSections} />
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">
          Ihre Daten werden ausschließlich für die Erstellung Ihrer Steuererklärung
          verwendet und nicht an Dritte weitergegeben.
        </p>
      </div>
    </div>
  );
}
