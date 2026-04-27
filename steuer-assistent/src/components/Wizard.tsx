import { useState } from 'react';
import type { Section, Answers } from '../types';
import ProgressBar from './ProgressBar';
import QuestionRenderer from './QuestionRenderer';
import Summary from './Summary';
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

export default function Wizard({ sections, initialAnswers = {}, clientName, mandantId, steuerjahr }: Props) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>(initialAnswers);
  const [showSummary, setShowSummary] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const hasVorjahr = Object.keys(initialAnswers).length > 0;
  const currentSection = sections[step];

  const buildRows = () =>
    sections.flatMap((section) =>
      section.questions
        .filter((q) => {
          const v = answers[q.id];
          return v !== undefined && v !== '' && q.type !== 'info';
        })
        .map((q) => ({
          abschnitt: section.title,
          frage: q.label,
          antwort: formatValue(answers[q.id]),
        })),
    );

  const handleChange = (id: string, value: Answers[string]) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const handleNext = () => {
    if (step < sections.length - 1) {
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
    const params = { clientName, mandantId, steuerjahr, rows: buildRows() };
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
        onBack={handleBack}
        onSubmit={handleSubmit}
        submitting={submitting}
        submitError={submitError}
        submitted={submitted}
      />
    );
  }

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

      <ProgressBar current={step} total={sections.length} sectionTitle={currentSection.title} />

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
          {step < sections.length - 1 ? 'Weiter →' : 'Zur Zusammenfassung'}
        </button>
      </div>
    </div>
  );
}
