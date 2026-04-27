import type { Section, Answers } from '../types';

interface Props {
  sections: Section[];
  answers: Answers;
  onBack: () => void;
  onSubmit: () => void;
  submitted: boolean;
}

function formatValue(value: Answers[string]): string {
  if (value === true) return 'Ja';
  if (value === false) return 'Nein';
  if (Array.isArray(value)) return value.join(', ');
  if (value === '' || value === undefined || value === null) return '—';
  return String(value);
}

export default function Summary({ sections, answers, onBack, onSubmit, submitted }: Props) {
  if (submitted) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-6">✅</div>
        <h2 className="text-2xl font-bold text-slate-800 mb-3">
          Vielen Dank!
        </h2>
        <p className="text-slate-600 max-w-md mx-auto">
          Ihre Angaben wurden erfolgreich übermittelt. Wir melden uns zeitnah
          bei Ihnen, falls wir noch weitere Unterlagen benötigen.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-800 mb-2">Zusammenfassung</h2>
      <p className="text-slate-500 mb-8">
        Bitte prüfen Sie Ihre Angaben und klicken Sie dann auf „Absenden".
      </p>

      {sections.map((section) => {
        const relevantAnswers = section.questions.filter(
          (q) => answers[q.id] !== undefined && answers[q.id] !== '',
        );
        if (relevantAnswers.length === 0) return null;

        return (
          <div key={section.id} className="mb-6 bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="bg-slate-50 border-b border-slate-200 px-5 py-3">
              <h3 className="font-semibold text-slate-700">{section.title}</h3>
            </div>
            <div className="divide-y divide-slate-100">
              {relevantAnswers.map((q) => (
                <div key={q.id} className="flex gap-4 px-5 py-3">
                  <span className="text-slate-500 text-sm flex-1">{q.label}</span>
                  <span className="font-medium text-slate-800 text-sm text-right">
                    {formatValue(answers[q.id])}
                    {q.unit && answers[q.id] !== undefined && answers[q.id] !== ''
                      ? ` ${q.unit}`
                      : ''}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      <div className="flex gap-3 mt-8">
        <button
          onClick={onBack}
          className="flex-1 border border-slate-300 text-slate-600 py-3 rounded-xl font-medium hover:bg-slate-50 transition-colors"
        >
          ← Zurück bearbeiten
        </button>
        <button
          onClick={onSubmit}
          className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow"
        >
          Absenden ✓
        </button>
      </div>
    </div>
  );
}
