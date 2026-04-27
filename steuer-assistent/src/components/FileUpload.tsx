import { useRef, useState } from 'react';

export interface UploadedFile {
  name: string;
  type: string;
  size: number;
  data: string; // base64 ohne data-URL-Prefix
}

interface Props {
  files: UploadedFile[];
  onChange: (files: UploadedFile[]) => void;
}

const ACCEPT = '.pdf,.jpg,.jpeg,.png,.heic,.heif';
const MAX_TOTAL_MB = 18;

function formatSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function readAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(',')[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

const KATEGORIEN = [
  'Lohnsteuerbescheinigung',
  'Fahrtkosten-Nachweis',
  'Arbeitsmittel-Rechnung',
  'Fortbildungsnachweis',
  'Sonstiger Beleg',
];

export default function FileUpload({ files, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [kategorien, setKategorien] = useState<Record<string, string>>({});

  const totalBytes = files.reduce((s, f) => s + f.size, 0);
  const totalMB = totalBytes / (1024 * 1024);
  const overLimit = totalMB > MAX_TOTAL_MB;

  async function addFiles(raw: FileList | null) {
    if (!raw || raw.length === 0) return;
    setLoading(true);
    const neu: UploadedFile[] = [];
    for (const file of Array.from(raw)) {
      try {
        const data = await readAsBase64(file);
        neu.push({ name: file.name, type: file.type, size: file.size, data });
      } catch {
        // Datei überspringen wenn Lesefehler
      }
    }
    onChange([...files, ...neu]);
    setLoading(false);
  }

  function remove(index: number) {
    const next = files.filter((_, i) => i !== index);
    onChange(next);
    setKategorien((prev) => {
      const k = { ...prev };
      delete k[String(index)];
      return k;
    });
  }

  function setKategorie(index: number, kat: string) {
    setKategorien((prev) => ({ ...prev, [String(index)]: kat }));
  }

  return (
    <div>
      {/* Drop-Zone */}
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          void addFiles(e.dataTransfer.files);
        }}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
          dragging
            ? 'border-blue-500 bg-blue-50'
            : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50'
        }`}
      >
        <div className="text-4xl mb-3">📎</div>
        <p className="font-medium text-slate-700">
          {loading ? 'Dateien werden geladen …' : 'Dateien hierher ziehen oder klicken'}
        </p>
        <p className="text-sm text-slate-400 mt-1">
          PDF, JPG, PNG, HEIC – max. {MAX_TOTAL_MB} MB gesamt
        </p>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={ACCEPT}
          className="hidden"
          onChange={(e) => void addFiles(e.target.files)}
        />
      </div>

      {/* Gesamtgröße-Anzeige */}
      {files.length > 0 && (
        <div className={`mt-3 text-sm px-3 py-2 rounded-lg flex justify-between ${
          overLimit ? 'bg-red-50 text-red-700' : 'bg-slate-50 text-slate-500'
        }`}>
          <span>{files.length} Datei{files.length !== 1 ? 'en' : ''} ausgewählt</span>
          <span className="font-medium">
            {formatSize(totalBytes)} / {MAX_TOTAL_MB} MB
            {overLimit && ' ⚠️ Limit überschritten'}
          </span>
        </div>
      )}

      {/* Dateiliste */}
      {files.length > 0 && (
        <div className="mt-3 space-y-2">
          {files.map((f, i) => (
            <div
              key={i}
              className="bg-white border border-slate-200 rounded-xl p-3 flex gap-3 items-start"
            >
              <span className="text-2xl mt-0.5">
                {f.type === 'application/pdf' ? '📄' : '🖼️'}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-800 truncate">{f.name}</p>
                <p className="text-xs text-slate-400">{formatSize(f.size)}</p>
                <select
                  value={kategorien[String(i)] ?? ''}
                  onChange={(e) => setKategorie(i, e.target.value)}
                  className="mt-1.5 text-xs border border-slate-200 rounded-lg px-2 py-1 text-slate-600 w-full max-w-xs focus:outline-none focus:ring-1 focus:ring-blue-400"
                >
                  <option value="">Kategorie wählen (optional)</option>
                  {KATEGORIEN.map((k) => (
                    <option key={k} value={k}>{k}</option>
                  ))}
                </select>
              </div>
              <button
                onClick={() => remove(i)}
                className="text-slate-400 hover:text-red-500 transition-colors text-lg leading-none mt-0.5"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {files.length === 0 && (
        <p className="text-center text-sm text-slate-400 mt-4">
          Keine Dokumente hochgeladen – Sie können den Fragebogen auch ohne Belege absenden.
        </p>
      )}
    </div>
  );
}
