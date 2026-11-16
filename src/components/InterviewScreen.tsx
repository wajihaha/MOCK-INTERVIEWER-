import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertCircle,
  ArrowLeft,
  Building2,
  Clock,
  KeyRound,
  Lightbulb,
  Loader2,
  Mic,
  MicOff,
  RefreshCw,
  Send,
  UserCheck,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { PERSONA_OPTIONS } from '../data/presets';
import {
  GroqApiError,
  generateFinalEvaluation,
  generateNextInterviewTurn,
  generateQuestionHint,
} from '../services/groqService';
import type {
  ChatMessage,
  EvaluationRubric,
  InterviewConfig,
  InterviewReport,
  QAPair,
} from '../types/interview';
import { detectFillerWords } from '../utils/fillerWords';

interface SpeechRecognitionAlternativeLike {
  transcript: string;
}

interface SpeechRecognitionResultLike {
  isFinal: boolean;
  0: SpeechRecognitionAlternativeLike;
}

interface SpeechRecognitionEventLike {
  resultIndex: number;
  results: ArrayLike<SpeechRecognitionResultLike>;
}

interface SpeechRecognitionErrorEventLike {
  error: string;
}

interface SpeechRecognitionInstance {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEventLike) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

interface WindowWithSpeech extends Window {
  SpeechRecognition?: new () => SpeechRecognitionInstance;
  webkitSpeechRecognition?: new () => SpeechRecognitionInstance;
}

interface InterviewScreenProps {
  config: InterviewConfig;
  onComplete: (report: InterviewReport, qaPairs: QAPair[]) => void;
  onExitToSetup: () => void;
  onOpenApiKeyModal: () => void;
}

export function InterviewScreen({
  config,
  onComplete,
  onExitToSetup,
  onOpenApiKeyModal,
}: InterviewScreenProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [qaPairs, setQaPairs] = useState<QAPair[]>([]);
  const [currentQuestionNumber, setCurrentQuestionNumber] = useState(1);
  const [currentQuestionText, setCurrentQuestionText] = useState('');

  const [answerDraft, setAnswerDraft] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');

  const [isLoadingTurn, setIsLoadingTurn] = useState(true);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [errorState, setErrorState] = useState<{
    message: string;
    isKeyError: boolean;
    retryAction: 'turn' | 'evaluate' | 'hint' | null;
  } | null>(null);

  // Hints cache per question index
  const [hintsByQuestion, setHintsByQuestion] = useState<Record<number, string[]>>({});
  const [usedHintByQuestion, setUsedHintByQuestion] = useState<Record<number, boolean>>({});
  const [showHintPanel, setShowHintPanel] = useState(false);
  const [isLoadingHint, setIsLoadingHint] = useState(false);

  // Live adaptive feedback & rubric from AI recruiter
  const [latestFeedbackHint, setLatestFeedbackHint] = useState('');
  const [latestRubric, setLatestRubric] = useState<EvaluationRubric | null>(null);

  // Voice & TTS state
  const [isRecording, setIsRecording] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const [autoSpeak, setAutoSpeak] = useState(false);

  // Timer state
  const [secondsLeft, setSecondsLeft] = useState(60);
  const questionStartTimeRef = useRef<number>(Date.now());

  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const baseDraftBeforeSpeechRef = useRef('');
  const committedSpeechRef = useRef('');
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const hasInitializedRef = useRef(false);

  const personaMeta = useMemo(
    () => PERSONA_OPTIONS.find((p) => p.id === config.persona) || PERSONA_OPTIONS[0],
    [config.persona]
  );

  const speechSupported = useMemo(() => {
    const win = window as WindowWithSpeech;
    return Boolean(win.SpeechRecognition || win.webkitSpeechRecognition);
  }, []);

  const ttsSupported = useMemo(() => 'speechSynthesis' in window, []);

  // Combined live text for filler word inspection
  const combinedAnswerText = useMemo(() => {
    return interimTranscript
      ? `${answerDraft}${answerDraft && !answerDraft.endsWith(' ') ? ' ' : ''}${interimTranscript}`
      : answerDraft;
  }, [answerDraft, interimTranscript]);

  const liveFillerCounts = useMemo(
    () => detectFillerWords(combinedAnswerText),
    [combinedAnswerText]
  );

  const speakText = useCallback(
    (text: string, messageId: string) => {
      if (!ttsSupported) return;
      try {
        window.speechSynthesis.cancel();
        if (speakingMessageId === messageId) {
          setSpeakingMessageId(null);
          return;
        }
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        utterance.lang = 'en-US';
        utterance.onend = () => setSpeakingMessageId(null);
        utterance.onerror = () => setSpeakingMessageId(null);
        setSpeakingMessageId(messageId);
        window.speechSynthesis.speak(utterance);
      } catch {
        setSpeakingMessageId(null);
      }
    },
    [speakingMessageId, ttsSupported]
  );

  const stopSpeechSynthesis = useCallback(() => {
    if (ttsSupported) {
      window.speechSynthesis.cancel();
    }
    setSpeakingMessageId(null);
  }, [ttsSupported]);

  const stopVoiceRecording = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // Ignore stop errors
      }
      recognitionRef.current = null;
    }
    setIsRecording(false);
    setInterimTranscript('');
  }, []);

  // Scroll to bottom when messages or typing state update
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, isLoadingTurn, isEvaluating, showHintPanel]);

  // Cleanup voice/TTS on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // Ignore
        }
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const fetchTurn = useCallback(
    async (historyToUse: QAPair[], nextNum: number) => {
      setIsLoadingTurn(true);
      setErrorState(null);
      setShowHintPanel(false);

      try {
        const turn = await generateNextInterviewTurn(config, historyToUse, nextNum);
        const msgId = `ai-q-${nextNum}-${Date.now()}`;

        const aiMessage: ChatMessage = {
          id: msgId,
          role: 'assistant',
          content: turn.interviewerDialogue,
          feedbackHint: turn.realtimeFeedbackHint || undefined,
          questionNumber: nextNum,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        setMessages((prev) => [...prev, aiMessage]);
        setCurrentQuestionText(turn.interviewerDialogue);
        setCurrentQuestionNumber(nextNum);

        if (turn.realtimeFeedbackHint) {
          setLatestFeedbackHint(turn.realtimeFeedbackHint);
        }
        if (
          turn.evaluationRubric &&
          (turn.evaluationRubric.technical_accuracy > 0 ||
            turn.evaluationRubric.communication_clarity > 0)
        ) {
          setLatestRubric(turn.evaluationRubric);
        }

        setSecondsLeft(60);
        questionStartTimeRef.current = Date.now();

        if (autoSpeak && ttsSupported) {
          speakText(turn.interviewerDialogue, msgId);
        }
      } catch (err) {
        const apiErr = err instanceof GroqApiError ? err : null;
        setErrorState({
          message:
            err instanceof Error
              ? err.message
              : 'Failed to generate interview question. Please retry.',
          isKeyError: apiErr?.code === 'MISSING_KEY' || apiErr?.code === 'INVALID_KEY',
          retryAction: 'turn',
        });
      } finally {
        setIsLoadingTurn(false);
      }
    },
    [autoSpeak, config, speakText, ttsSupported]
  );

  // Initial Question 1 load
  useEffect(() => {
    if (hasInitializedRef.current) return;
    hasInitializedRef.current = true;
    fetchTurn([], 1);
  }, [fetchTurn]);

  const handleToggleRecording = () => {
    setVoiceError(null);

    if (isRecording) {
      stopVoiceRecording();
      return;
    }

    const win = window as WindowWithSpeech;
    const SpeechRecognitionCtor = win.SpeechRecognition || win.webkitSpeechRecognition;

    if (!SpeechRecognitionCtor) {
      setVoiceError(
        'Voice-to-text requires a Chromium-based browser (Chrome, Edge) with Web Speech API support.'
      );
      return;
    }

    try {
      const recognition = new SpeechRecognitionCtor();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang =
        config.languageMode === 'Hinglish / Roman Urdu Comfort Mode' ? 'en-PK' : 'en-US';

      baseDraftBeforeSpeechRef.current = answerDraft.trim();
      committedSpeechRef.current = '';

      recognition.onresult = (event: SpeechRecognitionEventLike) => {
        let newFinalChunk = '';
        let currentInterim = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0]?.transcript || '';
          if (event.results[i].isFinal) {
            newFinalChunk += transcript;
          } else {
            currentInterim += transcript;
          }
        }

        if (newFinalChunk) {
          committedSpeechRef.current = `${committedSpeechRef.current} ${newFinalChunk}`.trim();
          const joined = [baseDraftBeforeSpeechRef.current, committedSpeechRef.current]
            .filter(Boolean)
            .join(' ');
          setAnswerDraft(joined);
        }

        setInterimTranscript(currentInterim.trim());
      };

      recognition.onerror = (event: SpeechRecognitionErrorEventLike) => {
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          setVoiceError('Microphone access was denied. Enable mic permission in your browser.');
        } else if (event.error !== 'no-speech' && event.error !== 'aborted') {
          setVoiceError(`Voice recognition error (${event.error}). You can continue typing.`);
        }
        setIsRecording(false);
        setInterimTranscript('');
      };

      recognition.onend = () => {
        setIsRecording(false);
        setInterimTranscript('');
      };

      recognitionRef.current = recognition;
      recognition.start();
      setIsRecording(true);
    } catch {
      setVoiceError('Could not start microphone capture. Please type your response below.');
      setIsRecording(false);
    }
  };

  const runFinalEvaluation = useCallback(
    async (completedPairs: QAPair[]) => {
      setIsEvaluating(true);
      setErrorState(null);
      try {
        const report = await generateFinalEvaluation(config, completedPairs);
        onComplete(report, completedPairs);
      } catch (err) {
        const apiErr = err instanceof GroqApiError ? err : null;
        setErrorState({
          message:
            err instanceof Error
              ? err.message
              : 'Could not complete scorecard evaluation. Please retry.',
          isKeyError: apiErr?.code === 'MISSING_KEY' || apiErr?.code === 'INVALID_KEY',
          retryAction: 'evaluate',
        });
      } finally {
        setIsEvaluating(false);
      }
    },
    [config, onComplete]
  );

  const handleSubmitAnswer = useCallback(
    async (allowEmptyOnTimeout = false) => {
      if (isLoadingTurn || isEvaluating) return;

      const finalText = combinedAnswerText.trim();
      if (!finalText && !allowEmptyOnTimeout) return;

      stopVoiceRecording();
      stopSpeechSynthesis();

      const answerContent =
        finalText || '[No response submitted before the 60-second timer expired]';
      const fillerSnapshot = detectFillerWords(answerContent);
      const elapsedSeconds = Math.max(
        1,
        Math.round((Date.now() - questionStartTimeRef.current) / 1000)
      );

      const userMsg: ChatMessage = {
        id: `user-a-${currentQuestionNumber}-${Date.now()}`,
        role: 'user',
        content: answerContent,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      const newPair: QAPair = {
        questionIndex: currentQuestionNumber,
        question: currentQuestionText,
        answer: answerContent,
        fillerWords: fillerSnapshot,
        usedHint: Boolean(usedHintByQuestion[currentQuestionNumber]),
        timeSpentSeconds: elapsedSeconds,
      };

      const updatedPairs = [...qaPairs, newPair];
      setMessages((prev) => [...prev, userMsg]);
      setQaPairs(updatedPairs);
      setAnswerDraft('');
      setInterimTranscript('');
      setShowHintPanel(false);

      if (currentQuestionNumber >= config.questionCount) {
        await runFinalEvaluation(updatedPairs);
      } else {
        await fetchTurn(updatedPairs, currentQuestionNumber + 1);
      }
    },
    [
      combinedAnswerText,
      config.questionCount,
      currentQuestionNumber,
      currentQuestionText,
      fetchTurn,
      isEvaluating,
      isLoadingTurn,
      qaPairs,
      runFinalEvaluation,
      stopSpeechSynthesis,
      stopVoiceRecording,
      usedHintByQuestion,
    ]
  );

  // Per-question 60s countdown timer
  useEffect(() => {
    if (!config.timerEnabled || isLoadingTurn || isEvaluating || errorState) {
      return;
    }

    if (secondsLeft <= 0) {
      if (combinedAnswerText.trim().length > 0) {
        handleSubmitAnswer(true);
      }
      return;
    }

    const timer = window.setInterval(() => {
      setSecondsLeft((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [
    combinedAnswerText,
    config.timerEnabled,
    errorState,
    handleSubmitAnswer,
    isEvaluating,
    isLoadingTurn,
    secondsLeft,
  ]);

  const handleRequestHint = async () => {
    if (!currentQuestionText || isLoadingTurn || isEvaluating) return;

    const existing = hintsByQuestion[currentQuestionNumber];
    if (existing && existing.length > 0) {
      setShowHintPanel((prev) => !prev);
      return;
    }

    setShowHintPanel(true);
    setIsLoadingHint(true);
    setErrorState(null);

    try {
      const hints = await generateQuestionHint(config, currentQuestionText);
      setHintsByQuestion((prev) => ({ ...prev, [currentQuestionNumber]: hints }));
      setUsedHintByQuestion((prev) => ({ ...prev, [currentQuestionNumber]: true }));
    } catch (err) {
      const apiErr = err instanceof GroqApiError ? err : null;
      setShowHintPanel(false);
      setErrorState({
        message:
          err instanceof Error ? err.message : 'Unable to fetch hint right now. Please retry.',
        isKeyError: apiErr?.code === 'MISSING_KEY' || apiErr?.code === 'INVALID_KEY',
        retryAction: 'hint',
      });
    } finally {
      setIsLoadingHint(false);
    }
  };

  const handleRetry = () => {
    if (!errorState) return;
    if (errorState.retryAction === 'turn') {
      fetchTurn(qaPairs, qaPairs.length + 1);
    } else if (errorState.retryAction === 'evaluate') {
      runFinalEvaluation(qaPairs);
    } else if (errorState.retryAction === 'hint') {
      handleRequestHint();
    }
  };

  const progressPercent = Math.round(
    ((Math.min(currentQuestionNumber, config.questionCount)) / config.questionCount) * 100
  );

  const currentHints = hintsByQuestion[currentQuestionNumber] || [];

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col px-3 py-4 sm:px-6 sm:py-6">
      {/* Progress & Context Header */}
      <section className="rounded-xl border border-slate-200 bg-white p-3.5 sm:p-5 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => {
                stopVoiceRecording();
                stopSpeechSynthesis();
                onExitToSetup();
              }}
              className="inline-flex min-h-[36px] items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800 cursor-pointer"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Setup
            </button>

            <span className="font-mono text-xs font-semibold text-slate-900 sm:text-sm dark:text-white">
              Question {Math.min(currentQuestionNumber, config.questionCount)} of{' '}
              {config.questionCount}
            </span>

            <span className="inline-flex max-w-full items-center gap-1.5 rounded-md border border-indigo-200 bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-800 dark:border-indigo-900/60 dark:bg-indigo-950/60 dark:text-indigo-300">
              <UserCheck className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{personaMeta.name}</span>
            </span>

            <span className="inline-flex max-w-full items-center gap-1.5 rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
              <Building2 className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{config.company}</span>
            </span>
          </div>

          <div className="flex w-full flex-wrap items-center justify-between gap-2 md:w-auto md:justify-end">
            {ttsSupported && (
              <button
                type="button"
                onClick={() => {
                  if (autoSpeak) stopSpeechSynthesis();
                  setAutoSpeak((prev) => !prev);
                }}
                className={`inline-flex min-h-[36px] items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-medium transition-colors cursor-pointer ${
                  autoSpeak
                    ? 'border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300'
                }`}
              >
                {autoSpeak ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
                <span>Auto-Read {autoSpeak ? 'ON' : 'OFF'}</span>
              </button>
            )}

            {config.timerEnabled && (
              <div
                className={`inline-flex min-h-[36px] items-center gap-1.5 rounded-md border px-2.5 py-1 font-mono text-xs font-semibold tabular-nums ${
                  secondsLeft <= 10
                    ? 'border-red-300 bg-red-50 text-red-700 dark:border-red-900/60 dark:bg-red-950/60 dark:text-red-300'
                    : secondsLeft <= 20
                    ? 'border-amber-300 bg-amber-50 text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/60 dark:text-amber-300'
                    : 'border-slate-200 bg-slate-50 text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200'
                }`}
              >
                <Clock className="h-3.5 w-3.5" />
                <span>
                  00:{String(secondsLeft).padStart(2, '0')}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-3.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
          <div
            className="h-full rounded-full bg-indigo-600 transition-all duration-300 dark:bg-indigo-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
          {config.track} · {config.mode} · {config.languageMode}
        </p>
      </section>

      {/* Conversational Chat Transcript */}
      <section
        aria-label="Interview conversation"
        className="mt-4 flex-1 rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
      >
        <div className="max-h-[48vh] min-h-[260px] space-y-4 overflow-y-auto p-3.5 sm:max-h-[54vh] sm:min-h-[320px] sm:p-6">
          {messages.map((msg) => {
            const isAI = msg.role === 'assistant';
            const isSpeaking = speakingMessageId === msg.id;

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isAI ? 'items-start' : 'items-end'}`}
              >
                <div className="mb-1 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    {isAI
                      ? `${personaMeta.name}${msg.questionNumber ? ` · Q${msg.questionNumber}` : ''}`
                      : 'You'}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono text-[11px]">{msg.timestamp}</span>
                </div>

                <div
                  className={`max-w-[94%] break-words rounded-xl px-3.5 py-3 text-sm leading-relaxed sm:max-w-2xl sm:px-4 ${
                    isAI
                      ? 'border border-slate-200 bg-slate-50 text-slate-900 dark:border-slate-800 dark:bg-slate-950/80 dark:text-slate-100'
                      : 'bg-indigo-600 text-white dark:bg-indigo-600'
                  }`}
                >
                  {isAI && msg.reaction && (
                    <p className="mb-2 border-b border-slate-200/80 pb-2 text-xs italic text-slate-600 dark:border-slate-800 dark:text-slate-400">
                      {msg.reaction}
                    </p>
                  )}

                  <p className="whitespace-pre-wrap">{msg.content}</p>

                  {isAI && ttsSupported && (
                    <div className="mt-2.5 flex justify-end">
                      <button
                        type="button"
                        onClick={() =>
                          speakText(
                            msg.reaction ? `${msg.reaction} ${msg.content}` : msg.content,
                            msg.id
                          )
                        }
                        aria-label={isSpeaking ? 'Stop reading question' : 'Read question aloud'}
                        className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium transition-colors cursor-pointer ${
                          isSpeaking
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300'
                            : 'text-slate-500 hover:bg-slate-200/70 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200'
                        }`}
                      >
                        <Volume2 className="h-3.5 w-3.5" />
                        <span>{isSpeaking ? 'Speaking...' : 'Listen'}</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Typing / Evaluation Indicator */}
          {(isLoadingTurn || isEvaluating) && (
            <div className="flex items-start">
              <div className="inline-flex items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-950/80 dark:text-slate-300">
                <Loader2 className="h-4 w-4 animate-spin text-indigo-600 dark:text-indigo-400" />
                <span>
                  {isEvaluating
                    ? 'Evaluating your interview answers and compiling scorecard...'
                    : `${personaMeta.name} is preparing Question ${
                        qaPairs.length + 1
                      }...`}
                </span>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Real-Time STAR & Keyword Coach Insight + Live Rubric */}
        {(latestFeedbackHint || latestRubric) && (
          <div className="border-t border-indigo-200/80 bg-indigo-50/50 px-4 py-3 sm:px-6 dark:border-indigo-900/50 dark:bg-indigo-950/30">
            {latestFeedbackHint && (
              <p className="text-xs leading-relaxed text-indigo-950 dark:text-indigo-100">
                <strong className="font-semibold text-indigo-700 dark:text-indigo-300">
                  Live Coach Tip:{' '}
                </strong>
                {latestFeedbackHint}
              </p>
            )}
            {latestRubric && (
              <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {(
                  [
                    { label: 'Tech Accuracy', val: latestRubric.technical_accuracy },
                    { label: 'Clarity', val: latestRubric.communication_clarity },
                    { label: 'Industry Fit', val: latestRubric.industry_alignment },
                    { label: 'Confidence', val: latestRubric.confidence_tone },
                  ] as const
                ).map((m) => (
                  <div
                    key={m.label}
                    className="flex items-center justify-between rounded-md border border-indigo-200/70 bg-white/80 px-2.5 py-1 text-[11px] dark:border-indigo-900/60 dark:bg-slate-900/70"
                  >
                    <span className="text-slate-600 dark:text-slate-400">{m.label}</span>
                    <span className="font-mono font-bold tabular-nums text-indigo-700 dark:text-indigo-300">
                      {m.val}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Need a Hint? Lifeline Panel */}
        {showHintPanel && (
          <div className="border-t border-amber-200 bg-amber-50/70 px-4 py-3.5 sm:px-6 dark:border-amber-900/50 dark:bg-amber-950/30">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-900 dark:text-amber-300">
                <Lightbulb className="h-4 w-4" />
                <span>Approach Hints (Q{currentQuestionNumber})</span>
              </div>
              <button
                type="button"
                onClick={() => setShowHintPanel(false)}
                className="text-xs font-medium text-amber-800 hover:underline dark:text-amber-300 cursor-pointer"
              >
                Hide
              </button>
            </div>

            {isLoadingHint ? (
              <div className="mt-2 flex items-center gap-2 text-xs text-amber-800 dark:text-amber-200">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Structuring approach hints...</span>
              </div>
            ) : (
              <ul className="mt-2 list-disc space-y-1 pl-5 text-xs leading-relaxed text-amber-950 dark:text-amber-100">
                {currentHints.map((hint, idx) => (
                  <li key={idx}>{hint}</li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* API / Network Error Banner */}
        {errorState && (
          <div className="border-t border-red-200 bg-red-50 px-4 py-3.5 sm:px-6 dark:border-red-900/60 dark:bg-red-950/40">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-start gap-2.5 text-xs text-red-800 dark:text-red-200">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{errorState.message}</span>
              </div>

              <div className="flex items-center gap-2">
                {errorState.isKeyError && (
                  <button
                    type="button"
                    onClick={onOpenApiKeyModal}
                    className="inline-flex items-center gap-1.5 rounded-md border border-red-300 bg-white px-3 py-1.5 text-xs font-semibold text-red-900 hover:bg-red-100 dark:border-red-800 dark:bg-slate-900 dark:text-red-200 cursor-pointer"
                  >
                    <KeyRound className="h-3.5 w-3.5" />
                    API Key Settings
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleRetry}
                  className="inline-flex items-center gap-1.5 rounded-md bg-red-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-800 cursor-pointer"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  Retry
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Answer Composer + Voice Mic + Real-time Filler Word Detector */}
        <div className="border-t border-slate-200 bg-slate-50/70 p-4 sm:p-5 dark:border-slate-800 dark:bg-slate-950/60">
          {/* Live Filler-Word HUD */}
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex flex-wrap items-center gap-2 text-slate-600 dark:text-slate-400">
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                Filler-Word Detector:
              </span>
              <span className="font-mono tabular-nums">
                Total: <strong className="text-slate-900 dark:text-white">{liveFillerCounts.total}</strong>
              </span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums">um: {liveFillerCounts.um}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums">uh: {liveFillerCounts.uh}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums">like: {liveFillerCounts.like}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums">basically: {liveFillerCounts.basically}</span>
            </div>

            {isRecording && (
              <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                Listening via Microphone...
              </span>
            )}
          </div>

          {voiceError && (
            <p className="mb-2.5 text-xs font-medium text-amber-700 dark:text-amber-300">
              {voiceError}
            </p>
          )}

          {config.timerEnabled && secondsLeft === 0 && !combinedAnswerText.trim() && (
            <p className="mb-2.5 text-xs font-medium text-red-700 dark:text-red-300">
              60-second timer reached 00:00. Finish typing/speaking your response or click Submit to continue.
            </p>
          )}

          <textarea
            rows={4}
            value={combinedAnswerText}
            onChange={(e) => {
              setInterimTranscript('');
              setAnswerDraft(e.target.value);
              if (isRecording) {
                baseDraftBeforeSpeechRef.current = e.target.value;
                committedSpeechRef.current = '';
              }
            }}
            onKeyDown={(e) => {
              if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
                e.preventDefault();
                handleSubmitAnswer(false);
              }
            }}
            disabled={isLoadingTurn || isEvaluating}
            placeholder={
              config.languageMode === 'Hinglish / Roman Urdu Comfort Mode'
                ? 'Type or speak naturally in English or Roman Urdu/Hinglish (Ctrl+Enter to submit)...'
                : 'Type or speak your answer using the microphone button (Ctrl+Enter to submit)...'
            }
            className="w-full rounded-lg border border-slate-300 bg-white p-3.5 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder-slate-500"
          />

          <div className="mt-3 flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
            <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto sm:flex-wrap sm:items-center">
              <button
                type="button"
                onClick={handleToggleRecording}
                disabled={isLoadingTurn || isEvaluating}
                title={
                  speechSupported
                    ? isRecording
                      ? 'Stop voice recording'
                      : 'Speak your answer (Web Speech API)'
                    : 'Web Speech API not supported in this browser'
                }
                className={`inline-flex min-h-[44px] w-full items-center justify-center gap-1.5 rounded-lg border px-3 text-xs font-semibold transition-colors disabled:opacity-50 sm:min-h-[40px] sm:w-auto sm:gap-2 sm:px-3.5 whitespace-nowrap cursor-pointer ${
                  isRecording
                    ? 'border-red-500 bg-red-600 text-white hover:bg-red-700'
                    : 'border-slate-300 bg-white text-slate-800 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                {isRecording ? <MicOff className="h-4 w-4 shrink-0" /> : <Mic className="h-4 w-4 shrink-0" />}
                <span>{isRecording ? 'Stop Mic' : 'Speak Answer'}</span>
              </button>

              <button
                type="button"
                onClick={handleRequestHint}
                disabled={isLoadingTurn || isEvaluating || !currentQuestionText}
                className="inline-flex min-h-[44px] w-full items-center justify-center gap-1.5 rounded-lg border border-amber-300 bg-amber-50 px-3 text-xs font-semibold text-amber-900 transition-colors hover:bg-amber-100 disabled:opacity-50 sm:min-h-[40px] sm:w-auto sm:px-3.5 whitespace-nowrap cursor-pointer dark:border-amber-800/80 dark:bg-amber-950/50 dark:text-amber-300 dark:hover:bg-amber-900/50"
              >
                <Lightbulb className="h-4 w-4 shrink-0" />
                <span>Need a Hint?</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() =>
                handleSubmitAnswer(config.timerEnabled && secondsLeft === 0)
              }
              disabled={
                isLoadingTurn ||
                isEvaluating ||
                (!combinedAnswerText.trim() && !(config.timerEnabled && secondsLeft === 0))
              }
              className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50 sm:min-h-[40px] sm:w-auto whitespace-nowrap cursor-pointer dark:bg-indigo-600 dark:hover:bg-indigo-500"
            >
              <span>
                {currentQuestionNumber >= config.questionCount
                  ? 'Finish & Evaluate'
                  : 'Submit Answer'}
              </span>
              <Send className="h-3.5 w-3.5 shrink-0" />
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
