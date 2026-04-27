import type { Question, Answers } from '../types';

interface Props {
  question: Question;
  answers: Answers;
  onChange: (id: string, value: Answers[string]) => void;
  depth?: number;
}

export default function QuestionRenderer({ question, answers, onChange, depth = 0 }: Props) {
  const value = answers[question.id];

  const activeFollowUps = question.followUps?.find((fu) => {
    if (typeof fu.whenValue === 'boolean') return value === fu.whenValue;
    if (Array.isArray(fu.whenValue)) return fu.whenValue.includes(value as string);
    return value === fu.whenValue;
  });

  const borderColor = depth === 0 ? 'border-slate-200' : 'border-blue-200 bg-blue-50/40';

  return (
    <div className={`mb-5 ${depth > 0 ? 'ml-6 pl-4 border-l-2 border-blue-300' : ''}`}>
      <div className={`bg-white rounded-xl border ${borderColor} p-5 shadow-sm`}>
        {question.type === 'info' ? (
          <div className="flex gap-3 items-start text-blue-700 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <span className="text-lg mt-0.5">ℹ️</span>
            <div>
              <p className="font-medium">{question.label}</p>
              {question.hint && <p className="text-sm text-blue-600 mt-1">{question.hint}</p>}
            </div>
          </div>
        ) : (
          <>
            <label className="block font-medium text-slate-800 mb-1">
              {question.label}
              {question.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            {question.hint && (
              <p className="text-sm text-slate-500 mb-3">{question.hint}</p>
            )}
            <FieldInput question={question} value={value} onChange={onChange} />
          </>
        )}
      </div>

      {activeFollowUps?.questions.map((fq) => (
        <QuestionRenderer
          key={fq.id}
          question={fq}
          answers={answers}
          onChange={onChange}
          depth={depth + 1}
        />
      ))}
    </div>
  );
}

interface FieldProps {
  question: Question;
  value: Answers[string];
  onChange: (id: string, value: Answers[string]) => void;
}

function FieldInput({ question, value, onChange }: FieldProps) {
  const { id, type, options, unit } = question;

  const inputClass =
    'w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base';

  if (type === 'yesno') {
    return (
      <div className="flex gap-3">
        {(['Ja', 'Nein'] as const).map((label) => {
          const val = label === 'Ja';
          const active = value === val;
          return (
            <button
              key={label}
              type="button"
              onClick={() => onChange(id, val)}
              className={`flex-1 py-2.5 rounded-lg border-2 font-medium transition-all ${
                active
                  ? label === 'Ja'
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-red-400 bg-red-50 text-red-700'
                  : 'border-slate-200 text-slate-600 hover:border-slate-400'
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>
    );
  }

  if (type === 'select') {
    return (
      <select
        className={inputClass}
        value={(value as string) ?? ''}
        onChange={(e) => onChange(id, e.target.value)}
      >
        <option value="">Bitte auswählen …</option>
        {options?.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    );
  }

  if (type === 'multiselect') {
    const selected: string[] = Array.isArray(value) ? (value as string[]) : [];
    const toggle = (opt: string) => {
      const next = selected.includes(opt)
        ? selected.filter((s) => s !== opt)
        : [...selected, opt];
      onChange(id, next);
    };
    return (
      <div className="flex flex-wrap gap-2">
        {options?.map((o) => {
          const active = selected.includes(o);
          return (
            <button
              key={o}
              type="button"
              onClick={() => toggle(o)}
              className={`px-3 py-1.5 rounded-full border text-sm font-medium transition-all ${
                active
                  ? 'border-blue-500 bg-blue-100 text-blue-700'
                  : 'border-slate-300 text-slate-600 hover:border-blue-400'
              }`}
            >
              {o}
            </button>
          );
        })}
      </div>
    );
  }

  if (type === 'currency' || type === 'number') {
    return (
      <div className="flex gap-2 items-center">
        <input
          type="number"
          min="0"
          step={type === 'currency' ? '0.01' : '1'}
          className={inputClass}
          value={(value as number) ?? ''}
          onChange={(e) =>
            onChange(id, e.target.value === '' ? '' : Number(e.target.value))
          }
          placeholder={type === 'currency' ? '0,00' : '0'}
        />
        {unit && <span className="text-slate-500 whitespace-nowrap text-sm">{unit}</span>}
      </div>
    );
  }

  return (
    <textarea
      className={`${inputClass} resize-none`}
      rows={3}
      value={(value as string) ?? ''}
      onChange={(e) => onChange(id, e.target.value)}
      placeholder="Ihre Eingabe …"
    />
  );
}
