import { useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertTriangle,
  Award,
  BookOpenCheck,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Download,
  Image as ImageIcon,
  Printer,
  RefreshCw,
  RotateCcw,
  Sparkles,
  X,
} from 'lucide-react';
import { PERSONA_OPTIONS } from '../data/presets';
import type { InterviewConfig, InterviewReport } from '../types/interview';
import { renderReadinessBadgeToCanvas } from '../utils/badgeCanvas';

interface ScorecardScreenProps {
  config: InterviewConfig;
  report: InterviewReport;
  onStartNewInterview: () => void;
  onCycleDemo?: () => void;
}

export function ScorecardScreen({
  config,
  report,
  onStartNewInterview,
  onCycleDemo,
}: ScorecardScreenProps) {
  const [expandedQuestions, setExpandedQuestions] = useState<Record<number, boolean>>(() => {
    const initial: Record<number, boolean> = {};
    report.questionBreakdowns.forEach((item, idx) => {
      initial[item.questionNumber] = idx === 0;
    });
    return initial;
  });

  // Reset first-question accordion open when cycling between demo presets
  useEffect(() => {
    const next: Record<number, boolean> = {};
    report.questionBreakdowns.forEach((item, idx) => {
      next[item.questionNumber] = idx === 0;
    });
    setExpandedQuestions(next);
  }, [report]);

  const [badgeModalOpen, setBadgeModalOpen] = useState(false);
  const [badgeDataUrl, setBadgeDataUrl] = useState('');
  const hiddenCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const personaName = useMemo(
    () => PERSONA_OPTIONS.find((p) => p.id === config.persona)?.name || 'Panelist',
    [config.persona]
  );

  const toggleQuestion = (qNum: number) => {
    setExpandedQuestions((prev) => ({ ...prev, [qNum]: !prev[qNum] }));
  };

  const allExpanded = useMemo(
    () => report.questionBreakdowns.every((q) => Boolean(expandedQuestions[q.questionNumber])),
    [expandedQuestions, report.questionBreakdowns]
  );

  const handleToggleAll = () => {
    const target = !allExpanded;
    const next: Record<number, boolean> = {};
    report.questionBreakdowns.forEach((q) => {
      next[q.questionNumber] = target;
    });
    setExpandedQuestions(next);
  };

  // Circular gauge SVG geometry
  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  const clampedScore = Math.max(0, Math.min(100, report.overallScore));
  const strokeDashoffset = circumference - (clampedScore / 100) * circumference;

  const scoreToneClass =
    clampedScore >= 80
      ? 'text-emerald-600 dark:text-emerald-400'
      : clampedScore >= 60
      ? 'text-indigo-600 dark:text-indigo-400'
      : 'text-amber-600 dark:text-amber-400';

  const handleGenerateBadge = () => {
    setBadgeDataUrl('');
    setBadgeModalOpen(true);
  };

  useEffect(() => {
    if (!badgeModalOpen || !hiddenCanvasRef.current) return;
    let active = true;
    renderReadinessBadgeToCanvas(hiddenCanvasRef.current, {
      score: clampedScore,
      track: config.track,
      company: config.company,
      readinessLabel: report.readinessLabel,
      personaName,
    }).then((url) => {
      if (active) setBadgeDataUrl(url);
    });
    return () => {
      active = false;
    };
  }, [badgeModalOpen, clampedScore, config.company, config.track, personaName, report.readinessLabel]);

  const handleDownloadBadge = () => {
    if (!badgeDataUrl) return;
    const link = document.createElement('a');
    const safeCompany = config.company.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    link.download = `readiness-badge-${safeCompany}-${clampedScore}.png`;
    link.href = badgeDataUrl;
    link.click();
  };

  const handlePrintPdf = () => {
    window.print();
  };

  const { clarityStructureScore, technicalAlignmentScore, answerDepth } = report.communicationMetrics;

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:py-10">
      {/* Hidden canvas for badge rendering */}
      <canvas ref={hiddenCanvasRef} className="hidden" aria-hidden="true" />

      {/* Top Action & Context Header */}
      <section className="flex flex-col justify-between gap-5 border-b border-slate-200 pb-6 lg:flex-row lg:items-center dark:border-slate-800">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
            <span>Interview Readiness Scorecard</span>
            {report.isDemo && (
              <>
                <span aria-hidden="true">·</span>
                {onCycleDemo ? (
                  <button
                    type="button"
                    onClick={onCycleDemo}
                    className="no-print inline-flex items-center gap-1.5 rounded-md border border-emerald-300 bg-emerald-50 px-2.5 py-1 text-left text-xs font-semibold text-emerald-800 transition-colors hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 dark:hover:bg-emerald-900/60 cursor-pointer"
                  >
                    <RefreshCw className="h-3 w-3 shrink-0" />
                    <span>
                      Judge Demo: {config.track} @ {config.company} — Click again to cycle scenarios
                    </span>
                  </button>
                ) : (
                  <span className="text-emerald-600 dark:text-emerald-400">
                    Judge Demo: {config.track} @ {config.company}
                  </span>
                )}
              </>
            )}
          </div>
          <h1 className="font-display mt-1.5 break-words text-xl font-bold tracking-tight text-slate-900 sm:text-2xl lg:text-3xl dark:text-white [text-wrap:balance]">
            {config.track} @ {config.company}
          </h1>
          <p className="mt-1 text-xs text-slate-500 sm:text-sm dark:text-slate-400">
            {config.mode} Round · {personaName} · {config.languageMode}
          </p>
        </div>

        <div className="no-print flex w-full flex-col gap-2.5 sm:flex-row sm:flex-wrap lg:w-auto">
          <button
            type="button"
            onClick={handlePrintPdf}
            className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-800 transition-colors hover:bg-slate-100 sm:min-h-[40px] sm:w-auto whitespace-nowrap cursor-pointer dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <Printer className="h-4 w-4 shrink-0" />
            <span>Download PDF Report</span>
          </button>

          <button
            type="button"
            onClick={handleGenerateBadge}
            className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-center text-xs font-semibold text-white transition-colors hover:bg-emerald-700 sm:min-h-[40px] sm:w-auto sm:whitespace-nowrap cursor-pointer dark:bg-emerald-600 dark:hover:bg-emerald-500"
          >
            <ImageIcon className="h-4 w-4 shrink-0" />
            <span>Generate Shareable Readiness Badge</span>
          </button>

          <button
            type="button"
            onClick={onStartNewInterview}
            className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-indigo-700 sm:min-h-[40px] sm:w-auto whitespace-nowrap cursor-pointer dark:bg-indigo-600 dark:hover:bg-indigo-500"
          >
            <RotateCcw className="h-4 w-4 shrink-0" />
            <span>New Interview</span>
          </button>
        </div>
      </section>

      {/* Top Analytics Row: Overall Circular Gauge + Communication & Response Quality Metrics */}
      <section className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Overall Readiness Score Gauge (4 cols) */}
        <div className="print-break-inside-avoid flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white p-6 text-center lg:col-span-4 dark:border-slate-800 dark:bg-slate-900">
          <div className="relative flex h-40 w-40 items-center justify-center">
            <svg className="h-full w-full -rotate-90" viewBox="0 0 140 140" aria-hidden="true">
              <circle
                cx="70"
                cy="70"
                r={radius}
                fill="none"
                strokeWidth="12"
                className="stroke-slate-100 dark:stroke-slate-800"
              />
              <circle
                cx="70"
                cy="70"
                r={radius}
                fill="none"
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className={`transition-all duration-700 ${
                  clampedScore >= 80
                    ? 'stroke-emerald-500'
                    : clampedScore >= 60
                    ? 'stroke-indigo-500'
                    : 'stroke-amber-500'
                }`}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-mono text-4xl font-bold tabular-nums text-slate-900 dark:text-white">
                {clampedScore}
              </span>
              <span className="font-mono text-xs font-medium text-slate-500 dark:text-slate-400">
                / 100
              </span>
            </div>
          </div>

          <h2 className={`font-display mt-3 text-lg font-bold ${scoreToneClass}`}>
            {report.readinessLabel}
          </h2>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Overall Readiness Score
          </p>

          {/* 4-Dimension Evaluation Rubric */}
          <div className="mt-5 grid w-full grid-cols-2 gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
            <div>
              <div className="font-mono text-base font-bold tabular-nums text-slate-900 dark:text-white">
                {report.evaluationRubric?.technical_accuracy ?? report.technicalDepthScore}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                Technical Accuracy
              </div>
            </div>
            <div>
              <div className="font-mono text-base font-bold tabular-nums text-slate-900 dark:text-white">
                {report.evaluationRubric?.communication_clarity ?? report.communicationScore}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                Communication Clarity
              </div>
            </div>
            <div>
              <div className="font-mono text-base font-bold tabular-nums text-slate-900 dark:text-white">
                {report.evaluationRubric?.industry_alignment ?? report.overallScore}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                Industry Alignment
              </div>
            </div>
            <div>
              <div className="font-mono text-base font-bold tabular-nums text-slate-900 dark:text-white">
                {report.evaluationRubric?.confidence_tone ?? report.confidenceScore}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                Confidence Tone
              </div>
            </div>
          </div>
        </div>

        {/* Executive Summary, Skill Badges & Communication Quality Metrics (8 cols) */}
        <div className="print-break-inside-avoid flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-6 lg:col-span-8 dark:border-slate-800 dark:bg-slate-900">
          <div>
            <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-white">
              Executive Panel Summary
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
              {report.executiveSummary}
            </p>

            {/* Skill Badges */}
            <div className="mt-5">
              <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Observed Skill Signals
              </h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {report.skillBadges.map((badge) => (
                  <span
                    key={badge}
                    className="inline-flex items-center gap-1.5 rounded-md border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-900 dark:border-indigo-900/60 dark:bg-indigo-950/60 dark:text-indigo-200"
                  >
                    <Award className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                    {badge}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Communication & Response Quality Metrics */}
          <div className="mt-6 border-t border-slate-100 pt-5 dark:border-slate-800">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Communication &amp; Response Quality Metrics
              </h3>
              <span className="font-mono text-xs font-semibold tabular-nums text-slate-600 dark:text-slate-400">
                {answerDepth.totalWords} total words across {report.questionBreakdowns.length}{' '}
                responses
              </span>
            </div>

            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {/* 1. Response Clarity & Structure Score */}
              <div className="rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-3 dark:border-slate-800 dark:bg-slate-950/60">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="font-mono text-xl font-bold tabular-nums text-slate-900 dark:text-white">
                    {clarityStructureScore}
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                      /100
                    </span>
                  </span>
                  <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">
                    STAR &amp; Flow
                  </span>
                </div>
                <div className="mt-1 text-xs font-medium text-slate-700 dark:text-slate-300">
                  Response Clarity &amp; Structure
                </div>
              </div>

              {/* 2. Technical & Role Alignment Score */}
              <div className="rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-3 dark:border-slate-800 dark:bg-slate-950/60">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="font-mono text-xl font-bold tabular-nums text-slate-900 dark:text-white">
                    {technicalAlignmentScore}
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                      /100
                    </span>
                  </span>
                  <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                    Role Fit
                  </span>
                </div>
                <div className="mt-1 text-xs font-medium text-slate-700 dark:text-slate-300">
                  Technical &amp; Role Alignment
                </div>
              </div>

              {/* 3. Answer Depth & Conciseness Metric */}
              <div className="rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-3 dark:border-slate-800 dark:bg-slate-950/60">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="font-mono text-xl font-bold tabular-nums text-slate-900 dark:text-white">
                    {answerDepth.averageWordsPerAnswer}
                    <span className="ml-1 text-xs font-medium text-slate-500 dark:text-slate-400">
                      avg words
                    </span>
                  </span>
                  <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                    {answerDepth.concisenessRating}
                  </span>
                </div>
                <div className="mt-1 text-xs font-medium text-slate-700 dark:text-slate-300">
                  Answer Depth &amp; Conciseness
                </div>
              </div>
            </div>

            <p className="mt-2.5 text-xs text-slate-500 dark:text-slate-400">
              {answerDepth.concisenessGuidance}
            </p>
          </div>
        </div>
      </section>

      {/* Strengths & Actionable Improvements */}
      <section className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="print-break-inside-avoid rounded-xl border border-slate-200 bg-white p-5 sm:p-6 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
            <CheckCircle2 className="h-5 w-5" />
            <h2 className="font-display text-base font-semibold text-slate-900 dark:text-white">
              Key Strengths
            </h2>
          </div>
          <ul className="mt-3 space-y-2.5 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
            {report.strengths.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span className="font-mono mt-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  0{idx + 1}.
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="print-break-inside-avoid rounded-xl border border-slate-200 bg-white p-5 sm:p-6 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
            <AlertTriangle className="h-5 w-5" />
            <h2 className="font-display text-base font-semibold text-slate-900 dark:text-white">
              Priority Improvements
            </h2>
          </div>
          <ul className="mt-3 space-y-2.5 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
            {report.improvements.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span className="font-mono mt-0.5 text-xs font-semibold text-amber-600 dark:text-amber-400">
                  0{idx + 1}.
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Tonight's Revision Cheat Sheet */}
      {report.finalCheatSheet && report.finalCheatSheet.length > 0 && (
        <section className="print-break-inside-avoid mt-6 rounded-xl border border-indigo-200 bg-indigo-50/40 p-5 sm:p-6 dark:border-indigo-900/60 dark:bg-indigo-950/30">
          <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-400">
            <BookOpenCheck className="h-5 w-5" />
            <h2 className="font-display text-base font-semibold text-slate-900 dark:text-white">
              Tonight&apos;s Revision Cheat Sheet
            </h2>
          </div>
          <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
            Key concepts, missed technical keywords, and architecture patterns prioritized for your
            next round.
          </p>
          <ul className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
            {report.finalCheatSheet.map((item, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2.5 rounded-lg border border-indigo-200/70 bg-white p-3.5 text-sm leading-relaxed text-slate-700 dark:border-indigo-900/50 dark:bg-slate-900 dark:text-slate-200"
              >
                <span className="font-mono mt-0.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                  0{idx + 1}.
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Question-by-Question Breakdown Accordions */}
      <section className="mt-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-lg font-bold text-slate-900 sm:text-xl dark:text-white">
              Question-by-Question Breakdown
            </h2>
            <p className="text-xs text-slate-500 sm:text-sm dark:text-slate-400">
              Detailed critique, English refinement, and polished model answers for each prompt.
            </p>
          </div>

          <button
            type="button"
            onClick={handleToggleAll}
            className="no-print min-h-[40px] w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100 sm:w-auto dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 cursor-pointer"
          >
            {allExpanded ? 'Collapse All' : 'Expand All'}
          </button>
        </div>

        <div className="mt-4 space-y-4">
          {report.questionBreakdowns.map((item) => {
            const isOpen = Boolean(expandedQuestions[item.questionNumber]);

            return (
              <article
                key={item.questionNumber}
                className="print-break-inside-avoid rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
              >
                <button
                  type="button"
                  onClick={() => toggleQuestion(item.questionNumber)}
                  aria-expanded={isOpen}
                  className="flex w-full items-start justify-between gap-4 p-5 text-left cursor-pointer"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="font-mono font-semibold text-indigo-600 dark:text-indigo-400">
                        Question {item.questionNumber}
                      </span>
                      <span aria-hidden="true" className="text-slate-400">
                        ·
                      </span>
                      <span className="font-mono font-semibold tabular-nums text-slate-700 dark:text-slate-300">
                        Score: {item.score}/100
                      </span>
                    </div>
                    <h3 className="font-display mt-1 text-base font-semibold text-slate-900 dark:text-slate-100">
                      {item.question}
                    </h3>
                  </div>

                  <span className="no-print mt-1 shrink-0 text-slate-400">
                    {isOpen ? (
                      <ChevronUp className="h-5 w-5" />
                    ) : (
                      <ChevronDown className="h-5 w-5" />
                    )}
                  </span>
                </button>

                <div
                  className={`${
                    isOpen ? 'block' : 'hidden'
                  } print-expand space-y-4 border-t border-slate-100 px-5 pb-5 pt-4 dark:border-slate-800`}
                >
                  <div>
                    <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                      Your Response
                    </h4>
                    <p className="mt-1.5 rounded-lg border border-slate-200 bg-slate-50 p-3.5 text-sm leading-relaxed text-slate-800 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-200">
                      {item.userAnswer}
                    </p>
                  </div>

                  {item.englishTranslation && (
                    <div>
                      <h4 className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                        Polished English Translation (From Comfort Mode)
                      </h4>
                      <p className="mt-1.5 rounded-lg border border-indigo-200 bg-indigo-50/50 p-3.5 text-sm leading-relaxed text-slate-800 dark:border-indigo-900/50 dark:bg-indigo-950/30 dark:text-slate-200">
                        {item.englishTranslation}
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    <div>
                      <h4 className="text-xs font-semibold text-amber-700 dark:text-amber-400">
                        Constructive Feedback
                      </h4>
                      <p className="mt-1.5 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                        {item.feedback}
                      </p>
                    </div>

                    <div>
                      <h4 className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                        <Sparkles className="h-3.5 w-3.5" />
                        Polished Sample Answer
                      </h4>
                      <p className="mt-1.5 rounded-lg border border-emerald-200 bg-emerald-50/50 p-3.5 text-sm leading-relaxed text-slate-800 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-slate-200">
                        {item.polishedSampleAnswer}
                      </p>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Shareable Readiness Badge Preview Modal */}
      {badgeModalOpen && (
        <div
          className="no-print fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-3 backdrop-blur-xs sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="badge-modal-title"
        >
          <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-xl border border-slate-200 bg-white p-4 shadow-2xl sm:max-w-2xl sm:p-6 lg:max-w-3xl dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-start justify-between gap-3 sm:items-center sm:gap-4">
              <div className="min-w-0">
                <h2
                  id="badge-modal-title"
                  className="font-display text-base font-bold text-slate-900 sm:text-lg dark:text-white"
                >
                  Shareable Interview Readiness Badge
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Generated via HTML5 Canvas · Ready for LinkedIn or portfolio sharing
                </p>
              </div>
              <button
                type="button"
                onClick={() => setBadgeModalOpen(false)}
                aria-label="Close badge preview"
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 overflow-hidden rounded-lg border border-slate-200 bg-slate-950 dark:border-slate-800">
              {badgeDataUrl ? (
                <img
                  src={badgeDataUrl}
                  alt={`Interview Ready: ${clampedScore}/100 – ${config.track} @ ${config.company}`}
                  referrerPolicy="no-referrer"
                  className="h-auto w-full object-contain"
                />
              ) : (
                <div className="flex h-48 items-center justify-center text-sm text-slate-400 sm:h-64">
                  Rendering badge...
                </div>
              )}
            </div>

            <div className="mt-5 flex flex-col-reverse gap-2.5 sm:flex-row sm:items-center sm:justify-end sm:gap-3">
              <button
                type="button"
                onClick={() => setBadgeModalOpen(false)}
                className="min-h-[44px] w-full rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 sm:min-h-[40px] sm:w-auto dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800 cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handleDownloadBadge}
                disabled={!badgeDataUrl}
                className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:opacity-50 sm:min-h-[40px] sm:w-auto cursor-pointer"
              >
                <Download className="h-4 w-4 shrink-0" />
                Download PNG Badge
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
