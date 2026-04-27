import { useState } from 'react';
import type { Answers } from '../types';
import { buildMandantLink, decodeAnswers } from '../utils/encode';

interface Mandant {
  id: string;
  name: string;
  link: string;
  erstellt: string;
}

export default function Admin() {
  const [pin, setPin] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [pinError, setPinError] = useState('');

  // Formular-State
  const [mandantId, setMandantId] = useState('');
  const [clientName, setClientName] = useState('');
  const [vorjahrJson, setVorjahrJson] = useState('');
  const [jsonError, setJsonError] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');
  const [copied, setCopied] = useState(false);

  // Gespeicherte Links (nur im Browser-Speicher)
  const [savedLinks, setSavedLinks] = useState<Mandant[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('mandanten') ?? '[]') as Mandant[];
    } catch {
      return [];
    }
  });

  const correctPin = import.meta.env.VITE_ADMIN_PIN ?? '1234';

  const handleUnlock = () => {
    if (pin === correctPin) {
      setUnlocked(true);
      setPinError('');
    } else {
      setPinError('PIN falsch. Bitte erneut versuchen.');
    }
  };

  const handleGenerate = () => {
    setJsonError('');
    setGeneratedLink('');

    if (!mandantId.trim() || !clientName.trim()) {
      setJsonError('Mandant-ID und Name sind Pflichtfelder.');
      return;
    }

    let vorjahrAnswers: Answers = {};
    if (vorjahrJson.trim()) {
      try {
        vorjahrAnswers = JSON.parse(vorjahrJson) as Answers;
      } catch {
        // Vielleicht ist es ein codierter Link – versuche URL-Parameter zu extrahieren
        try {
          const url = new URL(vorjahrJson);
          const param = url.searchParams.get('vorjahr');
          if (param) vorjahrAnswers = decodeAnswers(param);
        } catch {
          setJsonError('Ungültiges JSON. Bitte prüfen Sie die Vorjahresdaten.');
          return;
        }
      }
    }

    const base = window.location.origin;
    const link = buildMandantLink(base, mandantId.trim(), clientName.trim(), vorjahrAnswers);
    setGeneratedLink(link);

    // Speichern
    const neuerEintrag: Mandant = {
      id: mandantId.trim(),
      name: clientName.trim(),
      link,
      erstellt: new Date().toLocaleDateString('de-DE'),
    };
    const aktualisiert = [neuerEintrag, ...savedLinks.filter((m) => m.id !== mandantId.trim())];
    setSavedLinks(aktualisiert);
    localStorage.setItem('mandanten', JSON.stringify(aktualisiert));
  };

  const copyLink = async (link: string) => {
    await navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const deleteLink = (id: string) => {
    const aktualisiert = savedLinks.filter((m) => m.id !== id);
    setSavedLinks(aktualisiert);
    localStorage.setItem('mandanten', JSON.stringify(aktualisiert));
  };

  if (!unlocked) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 w-full max-w-sm">
          <h1 className="text-2xl font-bold text-slate-800 mb-1">Kanzlei-Zugang</h1>
          <p className="text-slate-500 text-sm mb-6">Bitte geben Sie Ihre Admin-PIN ein.</p>
          <input
            type="password"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleUnlock()}
            placeholder="PIN eingeben"
            className="w-full border border-slate-300 rounded-lg px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {pinError && <p className="text-red-600 text-sm mb-3">{pinError}</p>}
          <button
            onClick={handleUnlock}
            className="w-full bg-blue-600 text-white py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
          >
            Anmelden
          </button>
          <p className="text-xs text-slate-400 mt-4 text-center">
            Standard-PIN: 1234 – bitte in den Vercel-Einstellungen als<br />
            <code className="bg-slate-100 px-1 rounded">VITE_ADMIN_PIN</code> ändern.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <span className="bg-green-100 text-green-700 text-xs font-semibold px-2.5 py-1 rounded-full">
              Kanzlei-Admin
            </span>
            <h1 className="text-3xl font-bold text-slate-900 mt-2">Mandanten-Links</h1>
          </div>
          <a
            href="/"
            className="text-sm text-slate-500 hover:text-slate-700 border border-slate-200 rounded-lg px-3 py-1.5"
          >
            ← Zur App
          </a>
        </div>

        {/* Link generieren */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Neuen Link erstellen</h2>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Mandant-ID <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={mandantId}
                onChange={(e) => setMandantId(e.target.value)}
                placeholder="z.B. M-2024-001"
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Name des Mandanten <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="z.B. Max Mustermann"
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Vorjahresdaten <span className="text-slate-400 font-normal">(optional – JSON aus Vorjahres-Mail einfügen)</span>
            </label>
            <textarea
              value={vorjahrJson}
              onChange={(e) => setVorjahrJson(e.target.value)}
              rows={4}
              placeholder={'{\n  "ag1_bruttoarbeitslohn": 55000,\n  "entfernung_km": 28,\n  ...\n}'}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
            {jsonError && <p className="text-red-600 text-xs mt-1">{jsonError}</p>}
            <p className="text-xs text-slate-400 mt-1">
              Tipp: Den Link aus dem Vorjahr hier einfügen – die Werte werden automatisch extrahiert.
            </p>
          </div>

          <button
            onClick={handleGenerate}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
          >
            Link generieren
          </button>

          {generatedLink && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl">
              <p className="text-sm font-medium text-green-800 mb-2">✓ Link erstellt – an Mandant senden:</p>
              <div className="flex gap-2">
                <input
                  readOnly
                  value={generatedLink}
                  className="flex-1 text-xs bg-white border border-green-300 rounded-lg px-3 py-2 text-slate-700 font-mono truncate"
                />
                <button
                  onClick={() => copyLink(generatedLink)}
                  className="shrink-0 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                >
                  {copied ? 'Kopiert!' : 'Kopieren'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Gespeicherte Links */}
        {savedLinks.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">
              Gespeicherte Links ({savedLinks.length})
            </h2>
            <div className="space-y-3">
              {savedLinks.map((m) => (
                <div
                  key={m.id}
                  className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-800 text-sm">{m.name}</p>
                    <p className="text-xs text-slate-400">{m.id} · erstellt {m.erstellt}</p>
                  </div>
                  <button
                    onClick={() => copyLink(m.link)}
                    className="shrink-0 text-blue-600 hover:text-blue-800 text-sm font-medium px-2"
                  >
                    Kopieren
                  </button>
                  <button
                    onClick={() => window.open(m.link, '_blank')}
                    className="shrink-0 text-slate-400 hover:text-slate-600 text-sm px-2"
                  >
                    Öffnen
                  </button>
                  <button
                    onClick={() => deleteLink(m.id)}
                    className="shrink-0 text-red-400 hover:text-red-600 text-sm px-2"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
