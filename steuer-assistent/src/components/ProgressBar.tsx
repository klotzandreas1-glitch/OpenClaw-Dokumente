interface Props {
  current: number;
  total: number;
  sectionTitle: string;
}

export default function ProgressBar({ current, total, sectionTitle }: Props) {
  const pct = Math.round(((current + 1) / total) * 100);

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-slate-600">
          Abschnitt {current + 1} von {total}
        </span>
        <span className="text-sm text-slate-500">{pct} %</span>
      </div>
      <div className="w-full bg-slate-200 rounded-full h-2 mb-3">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
      <h2 className="text-xl font-semibold text-slate-800">{sectionTitle}</h2>
    </div>
  );
}
