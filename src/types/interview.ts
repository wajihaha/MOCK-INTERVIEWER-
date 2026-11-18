export type AppScreen = 'setup' | 'interview' | 'scorecard';

export type PersonaId = 'friendly_hr' | 'strict_tech_lead' | 'stress_tester';

export type InterviewMode = 'Technical' | 'HR/Behavioral' | 'Mixed';

export type LanguageMode = 'Corporate English' | 'Hinglish / Roman Urdu Comfort Mode';

export type QuestionCount = 3 | 5;

export type CompanyCategory =
  | 'Pakistani Tech & Software'
  | 'Energy, Power & Industrial (Core Engineering)'
  | 'Telecom & Banking'
  | 'International & MNCs';

export interface CompanyPreset {
  name: string;
  category: CompanyCategory;
  focusHint: string;
}

export interface PersonaOption {
  id: PersonaId;
  name: string;
  subtitle: string;
  description: string;
  styleTag: string;
}

export interface InterviewConfig {
  track: string;
  company: string;
  persona: PersonaId;
  mode: InterviewMode;
  languageMode: LanguageMode;
  questionCount: QuestionCount;
  timerEnabled: boolean;
  jobDescription: string;
  resumeText: string;
}

export interface AnswerDepthMetrics {
  totalWords: number;
  averageWordsPerAnswer: number;
  shortestAnswerWords: number;
  longestAnswerWords: number;
  concisenessRating:
    | 'Concise & Focused'
    | 'Well-Balanced'
    | 'Brief — Add More Depth'
    | 'Detailed — Tighten Structure';
  concisenessGuidance: string;
}

export interface CommunicationQualityMetrics {
  clarityStructureScore: number;
  technicalAlignmentScore: number;
  answerDepth: AnswerDepthMetrics;
}

export interface EvaluationRubric {
  technical_accuracy: number;
  communication_clarity: number;
  industry_alignment: number;
  confidence_tone: number;
}

export interface QAPair {
  questionIndex: number;
  question: string;
  answer: string;
  wordCount: number;
  usedHint: boolean;
  timeSpentSeconds: number;
  realtimeFeedbackHint?: string;
}

export interface ChatMessage {
  id: string;
  role: 'assistant' | 'user';
  content: string;
  questionNumber?: number;
  reaction?: string;
  feedbackHint?: string;
  timestamp: string;
}

export interface QuestionEvaluation {
  questionNumber: number;
  question: string;
  userAnswer: string;
  englishTranslation?: string;
  score: number;
  feedback: string;
  polishedSampleAnswer: string;
}

export interface InterviewReport {
  overallScore: number;
  readinessLabel: string;
  executiveSummary: string;
  communicationScore: number;
  technicalDepthScore: number;
  confidenceScore: number;
  communicationMetrics: CommunicationQualityMetrics;
  evaluationRubric?: EvaluationRubric;
  finalCheatSheet?: string[];
  skillBadges: string[];
  strengths: string[];
  improvements: string[];
  questionBreakdowns: QuestionEvaluation[];
  isDemo?: boolean;
  demoIndex?: number;
  completedAt: string;
}

export interface DemoScenarioPreset {
  track: string;
  config: InterviewConfig;
  report: InterviewReport;
}
