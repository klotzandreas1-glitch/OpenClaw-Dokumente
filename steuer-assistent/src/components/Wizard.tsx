import { useState } from 'react';
import type { Section, Answers } from '../types';
import ProgressBar from './ProgressBar';
import QuestionRenderer from './QuestionRenderer';
import Summary from './Summary';

interface Props {
  sections: Section[];
}

export default function Wizard({ sections }: Props) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [showSummary, setShowSummary] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const isSummary = showSummary;
  const currentSection = sections[step];

  const handleChange = (id: string, value: Answers[string]) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const handleNext = () => {
    if (step < sections.length - 1) {
      setStep((s) => s + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setShowSummary(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    if (showSummary) {
      setShowSummary(false);
    } else if (step > 0) {
      setStep((s) => s - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = () => {
    console.log('Eingaben:', JSON.stringify(answers, null, 2));
    setSubmitted(true);
  };

  if (isSummary) {
    return (
      <Summary
        sections={sections}
        answers={answers}
        onBack={handleBack}
        onSubmit={handleSubmit}
        submitted={submitted}
      />
    );
  }

  return (
    <div>
      <ProgressBar
        current={step}
        total={sections.length}
        sectionTitle={currentSection.title}
      />

      {currentSection.subtitle && (
        <p className="text-slate-500 text-sm mb-6 -mt-4">{currentSection.subtitle}</p>
      )}

      <div>
        {currentSection.questions.map((q) => (
          <QuestionRenderer
            key={q.id}
            question={q}
            answers={answers}
            onChange={handleChange}
          />
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
