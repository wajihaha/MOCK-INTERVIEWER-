import { useCallback, useEffect, useRef, useState } from 'react';
import { ApiKeyModal } from './components/ApiKeyModal';
import { InterviewScreen } from './components/InterviewScreen';
import { Navbar } from './components/Navbar';
import { ScorecardScreen } from './components/ScorecardScreen';
import { SetupScreen } from './components/SetupScreen';
import {
  ENGINEERING_TRACKS,
  JUDGE_DEMO_PRESETS,
  getJudgeDemoForTrack,
} from './data/presets';
import { resolveGroqApiKey } from './services/groqService';
import type {
  AppScreen,
  InterviewConfig,
  InterviewReport,
  QAPair,
} from './types/interview';

const THEME_STORAGE_KEY = 'smart_mock_theme';

const DEFAULT_CONFIG: InterviewConfig = {
  track: ENGINEERING_TRACKS[0],
  company: 'Systems Limited',
  persona: 'friendly_hr',
  mode: 'Mixed',
  languageMode: 'Corporate English',
  questionCount: 5,
  timerEnabled: false,
  jobDescription: '',
  resumeText: '',
};

export default function App() {
  const [isDark, setIsDark] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      if (saved === 'dark') return true;
      if (saved === 'light') return false;
      return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
    } catch {
      return false;
    }
  });

  const [screen, setScreen] = useState<AppScreen>('setup');
  const [config, setConfig] = useState<InterviewConfig>(DEFAULT_CONFIG);
  const [activeInterviewConfig, setActiveInterviewConfig] = useState<InterviewConfig | null>(null);
  const [scorecardConfig, setScorecardConfig] = useState<InterviewConfig>(DEFAULT_CONFIG);
  const [report, setReport] = useState<InterviewReport | null>(null);
  const [sessionId, setSessionId] = useState(0);

  const lastDemoTrackRef = useRef<string | null>(null);
  const lastDemoIndexRef = useRef<number>(-1);

  const [apiKeyModalOpen, setApiKeyModalOpen] = useState(false);
  const [hasApiKey, setHasApiKey] = useState<boolean>(() => Boolean(resolveGroqApiKey().key));

  // Sync `.dark` class on <html>
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      localStorage.setItem(THEME_STORAGE_KEY, isDark ? 'dark' : 'light');
    } catch {
      // Ignore storage errors
    }
  }, [isDark]);

  const refreshApiKeyStatus = useCallback(() => {
    setHasApiKey(Boolean(resolveGroqApiKey().key));
  }, []);

  const handleStartInterview = () => {
    if (!resolveGroqApiKey().key) {
      setApiKeyModalOpen(true);
      return;
    }
    setActiveInterviewConfig(config);
    setSessionId((prev) => prev + 1);
    setScreen('interview');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLaunchJudgeDemo = () => {
    let targetIndex: number;
    if (
      lastDemoTrackRef.current === config.track &&
      lastDemoIndexRef.current >= 0
    ) {
      targetIndex = (lastDemoIndexRef.current + 1) % JUDGE_DEMO_PRESETS.length;
    } else {
      const matched = getJudgeDemoForTrack(config.track);
      targetIndex = JUDGE_DEMO_PRESETS.findIndex((p) => p.track === matched.track);
      if (targetIndex < 0) targetIndex = 0;
    }

    lastDemoTrackRef.current = config.track;
    lastDemoIndexRef.current = targetIndex;

    const chosen = JUDGE_DEMO_PRESETS[targetIndex];
    setScorecardConfig(chosen.config);
    setReport(chosen.report);
    setScreen('scorecard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCycleDemoFromScorecard = () => {
    const currentIndex =
      typeof report?.demoIndex === 'number'
        ? report.demoIndex
        : lastDemoIndexRef.current >= 0
        ? lastDemoIndexRef.current
        : 0;
    const nextIndex = (currentIndex + 1) % JUDGE_DEMO_PRESETS.length;
    lastDemoIndexRef.current = nextIndex;
    const chosen = JUDGE_DEMO_PRESETS[nextIndex];
    setScorecardConfig(chosen.config);
    setReport(chosen.report);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleInterviewComplete = (
    generatedReport: InterviewReport,
    _completedPairs: QAPair[]
  ) => {
    if (activeInterviewConfig) {
      setScorecardConfig(activeInterviewConfig);
    }
    setReport(generatedReport);
    setActiveInterviewConfig(null);
    setScreen('scorecard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigate = (target: AppScreen) => {
    if (target === 'interview' && !activeInterviewConfig) return;
    if (target === 'scorecard' && !report) return;
    setScreen(target);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <Navbar
        currentScreen={screen}
        canAccessInterview={Boolean(activeInterviewConfig)}
        canAccessScorecard={Boolean(report)}
        onNavigate={handleNavigate}
        isDark={isDark}
        onToggleTheme={() => setIsDark((prev) => !prev)}
        hasApiKey={hasApiKey}
        onOpenApiKeyModal={() => setApiKeyModalOpen(true)}
      />

      <div className="flex-1">
        {screen === 'setup' && (
          <SetupScreen
            config={config}
            onChangeConfig={setConfig}
            onStartInterview={handleStartInterview}
            onLaunchJudgeDemo={handleLaunchJudgeDemo}
            hasApiKey={hasApiKey}
            onOpenApiKeyModal={() => setApiKeyModalOpen(true)}
          />
        )}

        {screen === 'interview' && activeInterviewConfig && (
          <InterviewScreen
            key={sessionId}
            config={activeInterviewConfig}
            onComplete={handleInterviewComplete}
            onExitToSetup={() => {
              setActiveInterviewConfig(null);
              setScreen('setup');
            }}
            onOpenApiKeyModal={() => setApiKeyModalOpen(true)}
          />
        )}

        {screen === 'scorecard' && report && (
          <ScorecardScreen
            config={scorecardConfig}
            report={report}
            onStartNewInterview={() => {
              setScreen('setup');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onCycleDemo={report.isDemo ? handleCycleDemoFromScorecard : undefined}
          />
        )}
      </div>

      <footer className="no-print border-t border-slate-200/80 bg-white/60 px-4 py-4 text-center text-xs text-slate-500 dark:border-slate-800/80 dark:bg-slate-950/60 dark:text-slate-400">
        Smart Mock Interviewer · Built by Coding Club (Wajiha Fatima &amp;Haniya Ayaz ) · Global AI Career Readiness Simulator
      </footer>

      <ApiKeyModal
        isOpen={apiKeyModalOpen}
        onClose={() => setApiKeyModalOpen(false)}
        onKeyChanged={refreshApiKeyStatus}
      />
    </div>
  );
}
