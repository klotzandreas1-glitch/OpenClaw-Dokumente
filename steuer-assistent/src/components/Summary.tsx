import type { Section, Answers } from '../types';
import type { UploadedFile } from './FileUpload';

interface Props {
  sections: Section[];
  answers: Answers;
  files: UploadedFile[];
  onBack: () => void;
  onSubmit: () => void;
  submitting: boolean;
  submitError: string;
  submitted: boolean;
}

function formatValue(value: Answers[string]): string {
  if (value === true) return 'Ja';
  if (value === false) return 'Nein';
  if (Array.isArray(value)) return (value as string[]).join(', ');
  if (value === '' || value === undefined || value === null) return '—';
  return String(value);
}

function formatSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function Summary({ sections, answers, files, onBack, onSubmit, submitting, submitError, submitted }: Props) {
  if (submitted) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-6">✅</div>
        <h2 className="text-2xl font-bold text-slate-800 mb-3">Vielen Dank!</h2>
        <p className="text-slate-600 max-w-md mx-auto">
          Ihre Angaben und Dokumente wurden erfolgreich übermittelt. Wir melden
          uns zeitnah bei Ihnen, falls wir noch etwas benötigen.
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

      {/* Fragebogen-Antworten */}
      {sections.map((section) => {
        const relevant = section.questions.filter(
          (q) => answers[q.id] !== undefined && answers[q.id] !== '' && q.type !== 'info',
        );
        if (relevant.length === 0) return null;
        return (
          <div key={section.id} className="mb-4 bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="bg-slate-50 border-b border-slate-200 px-5 py-3">
              <h3 className="font-semibold text-slate-700">{section.title}</h3>
            </div>
            <div className="divide-y divide-slate-100">
              {relevant.map((q) => (
                <div key={q.id} className="flex gap-4 px-5 py-3">
                  <span className="text-slate-500 text-sm flex-1">{q.label}</span>
                  <span className="font-medium text-slate-800 text-sm text-right">
                    {formatValue(answers[q.id])}
                    {q.unit && answers[q.id] !== undefined && answers[q.id] !== '' ? ` ${q.unit}` : ''}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {/* Hochgeladene Belege */}
      <div className="mb-4 bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="bg-slate-50 border-b border-slate-200 px-5 py-3">
          <h3 className="font-semibold text-slate-700">Hochgeladene Belege</h3>
        </div>
        {files.length === 0 ? (
          <p className="px-5 py-4 text-sm text-slate-400">Keine Dokumente hochgeladen.</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {files.map((f, i) => (
              <div key={i} className="flex items-center gap-3 px-5 py-3">
                <span>{f.type === 'application/pdf' ? '📄' : '🖼️'}</span>
                <span className="text-sm text-slate-700 flex-1 truncate">{f.name}</span>
                <span className="text-xs text-slate-400">{formatSize(f.size)}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {submitError && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
          ⚠️ Fehler: {submitError}
        </div>
      )}

      <div className="flex gap-3 mt-6">
        <button
          onClick={onBack}
          disabled={submitting}
          className="flex-1 border border-slate-300 text-slate-600 py-3 rounded-xl font-medium hover:bg-slate-50 transition-colors disabled:opacity-50"
        >
          ← Zurück bearbeiten
        </button>
        <button
          onClick={onSubmit}
          disabled={submitting}
          className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow disabled:opacity-50"
        >
          {submitting ? 'Wird gesendet …' : 'Absenden ✓'}
        </button>
      </div>
    </div>
  );
}
