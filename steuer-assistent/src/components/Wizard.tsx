import { useState } from 'react';
import type { Section, Answers } from '../types';
import ProgressBar from './ProgressBar';
import QuestionRenderer from './QuestionRenderer';
import Summary from './Summary';
import FileUpload, { type UploadedFile } from './FileUpload';
import { sendEmail, downloadExcel } from '../utils/submit';

interface Props {
  sections: Section[];
  initialAnswers?: Answers;
  clientName: string;
  mandantId: string;
  steuerjahr: number;
}

function formatValue(value: Answers[string]): string {
  if (value === true) return 'Ja';
  if (value === false) return 'Nein';
  if (Array.isArray(value)) return (value as string[]).join(', ');
  if (value === '' || value === undefined || value === null) return '';
  return String(value);
}

// Schritt-Index: 0…(sections.length-1) = Fragen, sections.length = Upload, sections.length+1 = Zusammenfassung
const UPLOAD_STEP = (sections: Section[]) => sections.length;

export default function Wizard({ sections, initialAnswers = {}, clientName, mandantId, steuerjahr }: Props) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>(initialAnswers);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [showSummary, setShowSummary] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const uploadStep = UPLOAD_STEP(sections);
  const hasVorjahr = Object.keys(initialAnswers).length > 0;
  const isUploadStep = step === uploadStep;
  const totalMB = files.reduce((s, f) => s + f.size, 0) / (1024 * 1024);
  const overLimit = totalMB > 18;

  const buildRows = () =>
    sections.flatMap((section) =>
      section.questions
        .filter((q) => answers[q.id] !== undefined && answers[q.id] !== '' && q.type !== 'info')
        .map((q) => ({ abschnitt: section.title, frage: q.label, antwort: formatValue(answers[q.id]) })),
    );

  const handleChange = (id: string, value: Answers[string]) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const handleNext = () => {
    const maxStep = uploadStep; // letzter Schritt vor Summary
    if (step < maxStep) {
      setStep((s) => s + 1);
    } else {
      setShowSummary(true);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    if (showSummary) setShowSummary(false);
    else if (step > 0) setStep((s) => s - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setSubmitError('');
    const params = { clientName, mandantId, steuerjahr, rows: buildRows(), files };
    try {
      downloadExcel(params);
      await sendEmail(params);
      setSubmitted(true);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Fehler beim Senden');
    } finally {
      setSubmitting(false);
    }
  };

  if (showSummary) {
    return (
      <Summary
        sections={sections}
        answers={answers}
        files={files}
        onBack={handleBack}
        onSubmit={handleSubmit}
        submitting={submitting}
        submitError={submitError}
        submitted={submitted}
      />
    );
  }

  // ── Belegupload-Schritt ──────────────────────────────────────
  if (isUploadStep) {
    return (
      <div>
        <ProgressBar
          current={step}
          total={uploadStep + 1}
          sectionTitle="Belege & Dokumente hochladen"
        />
        <p className="text-slate-500 text-sm mb-6 -mt-4">
          Laden Sie Ihre Belege hoch – z.B. Lohnsteuerbescheinigung, Fahrtkosten-Nachweise,
          Rechnungen. Alle Dateien werden verschlüsselt übertragen.
        </p>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm mb-5">
          <FileUpload files={files} onChange={setFiles} />
        </div>

        {overLimit && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
            ⚠️ Die Dateien überschreiten das Limit von 18 MB. Bitte entfernen Sie einige Dokumente
            oder senden Sie diese separat per E-Mail.
          </div>
        )}

        <div className="flex gap-3 mt-8">
          <button
            onClick={handleBack}
            className="flex-1 border border-slate-300 text-slate-600 py-3 rounded-xl font-medium hover:bg-slate-50 transition-colors"
          >
            ← Zurück
          </button>
          <button
            onClick={handleNext}
            disabled={overLimit}
            className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow disabled:opacity-50"
          >
            Zur Zusammenfassung
          </button>
        </div>
      </div>
    );
  }

  // ── Fragen-Schritte ─────────────────────────────────────────
  const currentSection = sections[step];

  return (
    <div>
      {hasVorjahr && (
        <div className="mb-6 flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
          <span className="text-lg">📋</span>
          <div>
            <strong>Vorjahreswerte vorausgefüllt.</strong> Bitte prüfen Sie alle Angaben
            und korrigieren Sie, was sich geändert hat.
          </div>
        </div>
      )}

      <ProgressBar
        current={step}
        total={uploadStep + 1}
        sectionTitle={currentSection.title}
      />

      {currentSection.subtitle && (
        <p className="text-slate-500 text-sm mb-6 -mt-4">{currentSection.subtitle}</p>
      )}

      <div>
        {currentSection.questions.map((q) => (
          <QuestionRenderer key={q.id} question={q} answers={answers} onChange={handleChange} />
        ))}
      </div>

      <div className="flex gap-3 mt-8">
        {step > 0 && (
          <button
            onClick={handleBack}
            className="flex-1 border border-slate-300 text-slate-600 py-3 rounded-xl font-medium hover:bg-slate-50 transition-colors"
          >
            ← Zurück
          </button>
        )}
        <button
          onClick={handleNext}
          className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow"
        >
          Weiter →
        </button>
      </div>
    </div>
  );
}
