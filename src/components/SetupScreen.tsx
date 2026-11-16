import { useMemo, useState } from 'react';
import {
  ArrowRight,
  Award,
  Briefcase,
  Building2,
  Check,
  ChevronDown,
  ChevronUp,
  Clock,
  FileText,
  GraduationCap,
  KeyRound,
  Languages,
  Search,
  ShieldAlert,
  Sparkles,
  UserCheck,
  Zap,
} from 'lucide-react';
import {
  COMPANY_CATEGORIES,
  COMPANY_PRESETS,
  NED_TRACKS,
  PERSONA_OPTIONS,
} from '../data/presets';
import type {
  CompanyCategory,
  InterviewConfig,
  InterviewMode,
  LanguageMode,
  PersonaId,
  QuestionCount,
} from '../types/interview';

interface SetupScreenProps {
  config: InterviewConfig;
  onChangeConfig: (next: InterviewConfig) => void;
  onStartInterview: () => void;
  onLaunchJudgeDemo: () => void;
  hasApiKey: boolean;
  onOpenApiKeyModal: () => void;
}

export function SetupScreen({
  config,
  onChangeConfig,
  onStartInterview,
  onLaunchJudgeDemo,
  hasApiKey,
  onOpenApiKeyModal,
}: SetupScreenProps) {
  const [companyCategoryFilter, setCompanyCategoryFilter] = useState<'All' | CompanyCategory>('All');
  const [companyQuery, setCompanyQuery] = useState('');
  const [showContextInputs, setShowContextInputs] = useState(
    Boolean(config.jobDescription || config.resumeText)
  );

  const filteredCompanies = useMemo(() => {
    const q = companyQuery.trim().toLowerCase();
    return COMPANY_PRESETS.filter((item) => {
      const matchesCategory =
        companyCategoryFilter === 'All' || item.category === companyCategoryFilter;
      const matchesQuery =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.focusHint.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [companyCategoryFilter, companyQuery]);

  const selectedCompanyMeta = useMemo(
    () => COMPANY_PRESETS.find((c) => c.name === config.company),
    [config.company]
  );

  const updateField = <K extends keyof InterviewConfig>(key: K, value: InterviewConfig[K]) => {
    onChangeConfig({ ...config, [key]: value });
  };

  const getPersonaIcon = (id: PersonaId) => {
    switch (id) {
      case 'friendly_hr':
        return <UserCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />;
      case 'strict_tech_lead':
        return <Briefcase className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />;
      case 'stress_tester':
        return <ShieldAlert className="h-4 w-4 text-amber-600 dark:text-amber-400" />;
    }
  };

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:py-10">
      {/* Top Hero Header & Instant Judge Demo */}
      <section className="flex flex-col justify-between gap-5 border-b border-slate-200 pb-6 md:flex-row md:items-end lg:pb-8 dark:border-slate-800">
        <div className="w-full max-w-2xl">
          <p className="text-xs font-semibold tracking-wide text-indigo-600 dark:text-indigo-400">
            NED University of Engineering & Technology · Career Readiness Simulator
          </p>
          <h1 className="font-display mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl dark:text-white [text-wrap:balance]">
            Practice real technical and HR interviews before placement season.
          </h1>
          <p className="mt-2.5 text-sm leading-relaxed text-slate-600 sm:mt-3 sm:text-base dark:text-slate-300">
            Configure your engineering discipline, target Pakistani or global employer, interviewer
            persona, and optional Roman Urdu comfort mode—then receive instant rubric scoring.
          </p>
        </div>

        <div className="flex w-full flex-col items-stretch gap-2 sm:w-auto sm:flex-row sm:items-center md:shrink-0">
          <button
            type="button"
            onClick={onLaunchJudgeDemo}
            className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg border border-emerald-600 bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-emerald-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 sm:w-auto whitespace-nowrap shrink-0 cursor-pointer dark:border-emerald-500 dark:bg-emerald-600 dark:hover:bg-emerald-500"
          >
            <Award className="h-4 w-4 shrink-0" />
            <span>Instant Judge Demo</span>
          </button>
        </div>
      </section>

      {/* Main Two-Column Setup Grid */}
      <div className="mt-6 grid grid-cols-1 gap-6 sm:mt-8 lg:grid-cols-12 lg:gap-8">
        {/* Left Column: Track, Employer & Optional JD/CV (7 cols) */}
        <div className="min-w-0 space-y-6 lg:col-span-7">
          {/* 1. NED Engineering & Industry Track */}
          <section className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-2.5">
              <GraduationCap className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-slate-100">
                01. NED Engineering & Industry Track
              </h2>
            </div>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Tailors technical terminology, core coursework concepts, and industry scenarios.
            </p>

            <div className="mt-4">
              <label htmlFor="ned-track-select" className="sr-only">
                Select NED Engineering or Industry Track
              </label>
              <select
                id="ned-track-select"
                value={config.track}
                onChange={(e) => updateField('track', e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 cursor-pointer"
              >
                {NED_TRACKS.map((track) => (
                  <option key={track} value={track}>
                    {track}
                  </option>
                ))}
              </select>
            </div>
          </section>

          {/* 2. Target Company Presets */}
          <section className="rounded-xl border border-slate-200 bg-white p-4 sm:p-6 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex flex-col gap-1.5 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-2">
              <div className="flex items-center gap-2.5">
                <Building2 className="h-5 w-5 shrink-0 text-indigo-600 dark:text-indigo-400" />
                <h2 className="font-display text-base font-semibold text-slate-900 sm:text-lg dark:text-slate-100">
                  02. Target Company Preset
                </h2>
              </div>
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Selected: <strong className="text-slate-900 dark:text-white">{config.company}</strong>
              </span>
            </div>

            {/* Search Input */}
            <div className="relative mt-4">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={companyQuery}
                onChange={(e) => setCompanyQuery(e.target.value)}
                placeholder="Search companies (e.g., Systems Limited, Engro, K-Electric, Google)..."
                aria-label="Search target companies"
                className="w-full rounded-lg border border-slate-300 bg-slate-50 py-2 pl-9 pr-3.5 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:bg-slate-950"
              />
            </div>

            {/* Category Filter Tabs */}
            <div className="mt-3 flex flex-wrap gap-1.5" role="tablist" aria-label="Employer categories">
              {(['All', ...COMPANY_CATEGORIES] as const).map((cat) => {
                const active = companyCategoryFilter === cat;
                const shortLabel =
                  cat === 'Energy, Power & Industrial (Core Engineering)'
                    ? 'Energy & Industrial'
                    : cat === 'Pakistani Tech & Software'
                    ? 'PK Tech & Software'
                    : cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setCompanyCategoryFilter(cat)}
                    className={`min-h-[36px] rounded-md px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      active
                        ? 'bg-indigo-600 text-white dark:bg-indigo-500'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                    }`}
                  >
                    {shortLabel}
                  </button>
                );
              })}
            </div>

            {/* Company Selector Grid */}
            <div className="mt-4 max-h-60 overflow-y-auto pr-1">
              {filteredCompanies.length === 0 ? (
                <p className="py-6 text-center text-sm text-slate-500 dark:text-slate-400">
                  No matching preset found. Try clearing your search filter.
                </p>
              ) : (
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {filteredCompanies.map((company) => {
                    const isSelected = config.company === company.name;
                    return (
                      <button
                        key={company.name}
                        type="button"
                        onClick={() => updateField('company', company.name)}
                        className={`flex items-center justify-between gap-2 rounded-lg border px-3 py-2.5 text-left transition-colors cursor-pointer ${
                          isSelected
                            ? 'border-indigo-600 bg-indigo-50/80 text-indigo-950 dark:border-indigo-400 dark:bg-indigo-950/60 dark:text-indigo-100'
                            : 'border-slate-200 bg-white text-slate-800 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950/50 dark:text-slate-200 dark:hover:border-slate-700 dark:hover:bg-slate-800/60'
                        }`}
                      >
                        <div className="min-w-0">
                          <div className="truncate text-sm font-semibold">{company.name}</div>
                          <div className="truncate text-xs text-slate-500 dark:text-slate-400">
                            {company.category}
                          </div>
                        </div>
                        {isSelected && (
                          <Check className="h-4 w-4 shrink-0 text-indigo-600 dark:text-indigo-400" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {selectedCompanyMeta && (
              <div className="mt-4 border-t border-slate-100 pt-3 text-xs text-slate-600 dark:border-slate-800 dark:text-slate-400">
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  Interview Focus:
                </span>{' '}
                {selectedCompanyMeta.focusHint}
              </div>
            )}
          </section>

          {/* 3. Optional Context Inputs (Collapsible JD & CV) */}
          <section className="rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
            <button
              type="button"
              onClick={() => setShowContextInputs((prev) => !prev)}
              aria-expanded={showContextInputs}
              className="flex w-full items-center justify-between gap-3 p-4 text-left sm:gap-4 sm:p-6 cursor-pointer"
            >
              <div className="flex min-w-0 items-start gap-2.5 sm:items-center">
                <FileText className="mt-0.5 h-5 w-5 shrink-0 text-indigo-600 sm:mt-0 dark:text-indigo-400" />
                <div className="min-w-0">
                  <h2 className="font-display text-sm font-semibold text-slate-900 sm:text-base dark:text-slate-100">
                    Optional Context: Job Description & Resume / CV
                  </h2>
                  <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                    Paste a JD or your NED FYP & project bullets for personalized probing questions
                  </p>
                </div>
              </div>
              {showContextInputs ? (
                <ChevronUp className="h-5 w-5 shrink-0 text-slate-400" />
              ) : (
                <ChevronDown className="h-5 w-5 shrink-0 text-slate-400" />
              )}
            </button>

            {showContextInputs && (
              <div className="space-y-4 border-t border-slate-100 px-5 pb-5 pt-4 sm:px-6 sm:pb-6 dark:border-slate-800">
                <div>
                  <label
                    htmlFor="jd-input"
                    className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
                  >
                    Target Job Description (Optional)
                  </label>
                  <textarea
                    id="jd-input"
                    rows={3}
                    value={config.jobDescription}
                    onChange={(e) => updateField('jobDescription', e.target.value)}
                    placeholder="Paste key responsibilities or skills from the job posting..."
                    className="mt-1.5 w-full rounded-lg border border-slate-300 bg-slate-50 p-3 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:bg-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder-slate-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="resume-input"
                    className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
                  >
                    Plain-Text Resume / CV or FYP Summary (Optional)
                  </label>
                  <textarea
                    id="resume-input"
                    rows={4}
                    value={config.resumeText}
                    onChange={(e) => updateField('resumeText', e.target.value)}
                    placeholder="e.g. Final year NED Mechanical student. FYP: Solar-assisted HVAC heat recovery unit. Internship at Lucky Cement..."
                    className="mt-1.5 w-full rounded-lg border border-slate-300 bg-slate-50 p-3 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:bg-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder-slate-500"
                  />
                </div>
              </div>
            )}
          </section>
        </div>

        {/* Right Column: Persona, Mode, Language & Session Settings (5 cols) */}
        <div className="min-w-0 space-y-6 lg:col-span-5">
          {/* 4. Interviewer Persona Selector */}
          <section className="rounded-xl border border-slate-200 bg-white p-4 sm:p-6 dark:border-slate-800 dark:bg-slate-900">
            <h2 className="font-display text-base font-semibold text-slate-900 sm:text-lg dark:text-slate-100">
              03. Interviewer Persona
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Select the style and pressure level of your interviewer.
            </p>

            <div className="mt-4 space-y-2.5">
              {PERSONA_OPTIONS.map((persona) => {
                const isSelected = config.persona === persona.id;
                return (
                  <button
                    key={persona.id}
                    type="button"
                    onClick={() => updateField('persona', persona.id)}
                    className={`w-full rounded-lg border p-3.5 text-left transition-colors cursor-pointer ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/70 dark:border-indigo-400 dark:bg-indigo-950/50'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950/40 dark:hover:border-slate-700 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-2">
                      <div className="flex items-center gap-2">
                        {getPersonaIcon(persona.id)}
                        <span className="font-display text-sm font-semibold text-slate-900 dark:text-white">
                          {persona.name}
                        </span>
                      </div>
                      <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                        {persona.subtitle}
                      </span>
                    </div>
                    <p className="mt-1.5 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                      {persona.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </section>

          {/* 5. Interview Mode, Language & Session Controls */}
          <section className="rounded-xl border border-slate-200 bg-white p-4 sm:p-6 dark:border-slate-800 dark:bg-slate-900">
            <h2 className="font-display text-base font-semibold text-slate-900 sm:text-lg dark:text-slate-100">
              04. Format & Language
            </h2>

            {/* Interview Mode Segmented Control */}
            <div className="mt-4">
              <span className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Interview Focus
              </span>
              <div className="mt-1.5 grid grid-cols-1 gap-1 rounded-lg bg-slate-100 p-1 sm:grid-cols-3 dark:bg-slate-950">
                {(['Technical', 'HR/Behavioral', 'Mixed'] as InterviewMode[]).map((mode) => {
                  const active = config.mode === mode;
                  return (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => updateField('mode', mode)}
                      className={`min-h-[40px] rounded-md px-2.5 py-2 text-xs font-semibold transition-colors whitespace-nowrap sm:min-h-0 cursor-pointer ${
                        active
                          ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-800 dark:text-white'
                          : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
                      }`}
                    >
                      {mode}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Language Mode Toggle */}
            <div className="mt-4">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
                <Languages className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>Language Mode</span>
              </div>
              <div className="mt-1.5 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {(
                  [
                    'Corporate English',
                    'Hinglish / Roman Urdu Comfort Mode',
                  ] as LanguageMode[]
                ).map((lang) => {
                  const active = config.languageMode === lang;
                  return (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => updateField('languageMode', lang)}
                      className={`rounded-lg border px-3 py-2.5 text-left transition-colors cursor-pointer ${
                        active
                          ? 'border-indigo-600 bg-indigo-50/70 text-indigo-950 dark:border-indigo-400 dark:bg-indigo-950/60 dark:text-indigo-100'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-300 dark:hover:bg-slate-800/50'
                      }`}
                    >
                      <div className="text-xs font-semibold">
                        {lang === 'Corporate English'
                          ? 'Corporate English'
                          : 'Hinglish / Roman Urdu'}
                      </div>
                      <div className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                        {lang === 'Corporate English'
                          ? 'Standard formal practice'
                          : 'Comfort mode + English translation'}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Session Settings: Question Count & Timer */}
            <div className="mt-5 grid grid-cols-1 gap-4 border-t border-slate-100 pt-4 sm:grid-cols-2 dark:border-slate-800">
              <div>
                <span className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Session Length
                </span>
                <div className="mt-1.5 grid grid-cols-2 gap-1 rounded-lg bg-slate-100 p-1 dark:bg-slate-950">
                  {([3, 5] as QuestionCount[]).map((count) => {
                    const active = config.questionCount === count;
                    return (
                      <button
                        key={count}
                        type="button"
                        onClick={() => updateField('questionCount', count)}
                        className={`rounded-md px-2.5 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                          active
                            ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-800 dark:text-white'
                            : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
                        }`}
                      >
                        {count} Questions
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <span className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Countdown Timer
                </span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={config.timerEnabled}
                  onClick={() => updateField('timerEnabled', !config.timerEnabled)}
                  className={`mt-1.5 flex w-full items-center justify-between rounded-lg border px-3 py-2 text-xs font-semibold transition-colors cursor-pointer ${
                    config.timerEnabled
                      ? 'border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                      : 'border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400'
                  }`}
                >
                  <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                    <Clock className="h-3.5 w-3.5" />
                    60s / Question
                  </span>
                  <span className="font-mono">{config.timerEnabled ? 'ON' : 'OFF'}</span>
                </button>
              </div>
            </div>

            {/* API Key Status & Primary Launch CTA */}
            {!hasApiKey && (
              <div className="mt-5 flex flex-col items-start justify-between gap-3 rounded-lg border border-amber-200 bg-amber-50 p-3.5 text-xs text-amber-900 sm:flex-row sm:items-center dark:border-amber-900/60 dark:bg-amber-950/50 dark:text-amber-200">
                <div>
                  <p className="font-semibold">Groq API Key needed for live AI interviews</p>
                  <p className="mt-0.5 text-amber-800 dark:text-amber-300/90">
                    Paste a free <span className="font-mono">gsk_...</span> key or preview instantly
                    with Judge Demo.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onOpenApiKeyModal}
                  className="inline-flex min-h-[40px] w-full items-center justify-center gap-1.5 rounded-md border border-amber-300 bg-white px-3 py-1.5 text-xs font-semibold text-amber-900 hover:bg-amber-100 sm:min-h-[34px] sm:w-auto whitespace-nowrap shrink-0 cursor-pointer dark:border-amber-800 dark:bg-slate-900 dark:text-amber-200 dark:hover:bg-slate-800"
                >
                  <KeyRound className="h-3.5 w-3.5" />
                  Add Key
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={onStartInterview}
              className="mt-5 flex min-h-[48px] w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:text-base cursor-pointer dark:bg-indigo-600 dark:hover:bg-indigo-500"
            >
              <Zap className="h-4 w-4 shrink-0" />
              <span>Start Mock Interview</span>
              <ArrowRight className="h-4 w-4 shrink-0" />
            </button>

            <p className="mt-2.5 flex items-center justify-center gap-1.5 text-center text-xs text-slate-500 dark:text-slate-400">
              <Sparkles className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>
                {config.questionCount} questions · {config.mode} · {config.company}
              </span>
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
