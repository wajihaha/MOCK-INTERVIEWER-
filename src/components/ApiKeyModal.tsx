import { useState, useEffect } from 'react';
import { CheckCircle2, ExternalLink, Eye, EyeOff, KeyRound, Trash2, X } from 'lucide-react';
import { getStoredGroqApiKey, resolveGroqApiKey, saveGroqApiKey } from '../services/groqService';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onKeyChanged: () => void;
}

export function ApiKeyModal({ isOpen, onClose, onKeyChanged }: ApiKeyModalProps) {
  const [inputKey, setInputKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [keySource, setKeySource] = useState<'localStorage' | 'env' | 'none'>('none');

  useEffect(() => {
    if (isOpen) {
      setInputKey(getStoredGroqApiKey());
      setKeySource(resolveGroqApiKey().source);
      setStatusMessage(null);
      setShowKey(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputKey.trim();
    if (!trimmed) {
      saveGroqApiKey('');
      setKeySource(resolveGroqApiKey().source);
      onKeyChanged();
      setStatusMessage('Cleared browser-saved API key.');
      return;
    }

    if (!trimmed.startsWith('gsk_')) {
      setStatusMessage('Groq API keys normally start with "gsk_". Saved anyway — verify if requests fail.');
    } else {
      setStatusMessage('Groq API key saved securely in your browser.');
    }

    saveGroqApiKey(trimmed);
    setKeySource(resolveGroqApiKey().source);
    onKeyChanged();
  };

  const handleClear = () => {
    saveGroqApiKey('');
    setInputKey('');
    setKeySource(resolveGroqApiKey().source);
    onKeyChanged();
    setStatusMessage('Saved browser key removed.');
  };

  return (
    <div
      className="no-print fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-3 backdrop-blur-xs sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="api-key-modal-title"
    >
      <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-xl border border-slate-200 bg-white p-4 shadow-xl sm:max-w-lg sm:p-6 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-start justify-between gap-3 sm:gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/70 dark:text-indigo-400">
              <KeyRound className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <h2
                id="api-key-modal-title"
                className="font-display text-base font-bold text-slate-900 sm:text-lg dark:text-slate-100"
              >
                API Key Settings
              </h2>
              <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                Direct browser-to-Groq connection (openai/gpt-oss-20b)
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close API Key Settings"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100 cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-3.5 text-xs leading-relaxed text-slate-600 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-300">
          <p>
            Your key is stored only in <span className="font-mono font-medium">localStorage</span> on
            this device and sent directly to Groq. No backend or database stores your credentials.
          </p>
          <div className="mt-2 flex flex-col gap-1.5 pt-1 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
            <span className="font-medium text-slate-700 dark:text-slate-200">
              Active source:{' '}
              {keySource === 'localStorage'
                ? 'Browser Key (localStorage)'
                : keySource === 'env'
                ? 'Environment Key (VITE_GROQ_API_KEY)'
                : 'Not configured'}
            </span>
            <a
              href="https://console.groq.com/keys"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-semibold text-indigo-600 hover:underline dark:text-indigo-400"
            >
              Get a free Groq key
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>

        <form onSubmit={handleSave} className="mt-5 space-y-4">
          <div>
            <label
              htmlFor="groq-api-key-input"
              className="block text-sm font-medium text-slate-800 dark:text-slate-200"
            >
              Groq API Key
            </label>
            <div className="relative mt-1.5">
              <input
                id="groq-api-key-input"
                type={showKey ? 'text' : 'password'}
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value)}
                placeholder="gsk_..."
                autoComplete="off"
                spellCheck={false}
                className="font-mono w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-3.5 pr-11 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder-slate-600"
              />
              <button
                type="button"
                onClick={() => setShowKey((prev) => !prev)}
                aria-label={showKey ? 'Hide API key' : 'Show API key'}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
              >
                {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {statusMessage && (
            <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/60 dark:text-emerald-300">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>{statusMessage}</span>
            </div>
          )}

          <div className="flex flex-col-reverse gap-2.5 pt-2 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={handleClear}
              disabled={!getStoredGroqApiKey()}
              className="inline-flex min-h-[44px] w-full items-center justify-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 sm:min-h-[38px] sm:w-auto dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800 cursor-pointer"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Clear Saved Key
            </button>

            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={onClose}
                className="min-h-[44px] w-full rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 sm:min-h-[38px] sm:w-auto dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800 cursor-pointer"
              >
                Close
              </button>
              <button
                type="submit"
                className="min-h-[44px] w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 sm:min-h-[38px] sm:w-auto dark:bg-indigo-600 dark:hover:bg-indigo-500 cursor-pointer"
              >
                Save Key
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
