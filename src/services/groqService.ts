import type {
  CommunicationQualityMetrics,
  EvaluationRubric,
  InterviewConfig,
  InterviewReport,
  PersonaId,
  QAPair,
} from '../types/interview';
import { computeAnswerDepthMetrics } from '../utils/responseMetrics';

const GROQ_CHAT_COMPLETIONS_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = 'openai/gpt-oss-20b';
const LOCAL_STORAGE_KEY = 'smart_mock_groq_api_key';

const SCENARIO_ANGLES: readonly string[] = [
  'Production Failure & Root-Cause Triage under realistic constraints',
  'System Architecture Trade-Offs, Scalability & Cost Optimization',
  'Cross-Functional Collaboration, Stakeholder Alignment & STAR Ownership',
  'First-Principles Fundamentals Applied to Modern Industry Standards',
  'Safety, Reliability, Edge-Case Resilience & Quality Assurance',
  'Real-World Project Deep-Dive, Metrics Impact & Lessons Learned',
];

export interface SessionVarietyContext {
  sessionSeed: string;
  scenarioAngle: string;
}

export function createSessionVarietyContext(): SessionVarietyContext {
  const randomToken = Math.random().toString(36).slice(2, 8).toUpperCase();
  const timestamp = Date.now().toString(36).toUpperCase();
  const angleIndex = Math.floor(Math.random() * SCENARIO_ANGLES.length);
  return {
    sessionSeed: `${timestamp}-${randomToken}`,
    scenarioAngle: SCENARIO_ANGLES[angleIndex],
  };
}

export class GroqApiError extends Error {
  code: 'MISSING_KEY' | 'INVALID_KEY' | 'RATE_LIMIT' | 'NETWORK' | 'BAD_RESPONSE';
  status?: number;

  constructor(
    message: string,
    code: 'MISSING_KEY' | 'INVALID_KEY' | 'RATE_LIMIT' | 'NETWORK' | 'BAD_RESPONSE',
    status?: number
  ) {
    super(message);
    this.name = 'GroqApiError';
    this.code = code;
    this.status = status;
  }
}

export function getStoredGroqApiKey(): string {
  try {
    return localStorage.getItem(LOCAL_STORAGE_KEY)?.trim() || '';
  } catch {
    return '';
  }
}

export function saveGroqApiKey(key: string): void {
  try {
    const trimmed = key.trim();
    if (trimmed) {
      localStorage.setItem(LOCAL_STORAGE_KEY, trimmed);
    } else {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
  } catch {
    // Ignore storage restriction errors
  }
}

export function resolveGroqApiKey(): { key: string; source: 'localStorage' | 'env' | 'none' } {
  const localKey = getStoredGroqApiKey();
  if (localKey) {
    return { key: localKey, source: 'localStorage' };
  }
  const envKey = (import.meta.env.VITE_GROQ_API_KEY as string | undefined)?.trim() || '';
  if (envKey) {
    return { key: envKey, source: 'env' };
  }
  return { key: '', source: 'none' };
}

/**
 * Safely extract a JSON object `{...}` from arbitrary LLM text output
 * (without relying on `response_format: { type: "json_object" }`).
 */
export function extractJsonObject<T>(rawText: string): T {
  const cleaned = rawText
    .replace(/```json\s*/gi, '')
    .replace(/```\s*/g, '')
    .trim();

  // Direct parse attempt
  try {
    return JSON.parse(cleaned) as T;
  } catch {
    // Fallback: locate balanced outer `{ ... }`
  }

  const firstBrace = cleaned.indexOf('{');
  if (firstBrace === -1) {
    throw new GroqApiError(
      'The AI response did not contain structured JSON. Please retry.',
      'BAD_RESPONSE'
    );
  }

  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let i = firstBrace; i < cleaned.length; i++) {
    const ch = cleaned[i];
    if (escaped) {
      escaped = false;
      continue;
    }
    if (ch === '\\' && inString) {
      escaped = true;
      continue;
    }
    if (ch === '"') {
      inString = !inString;
      continue;
    }
    if (!inString) {
      if (ch === '{') depth++;
      else if (ch === '}') {
        depth--;
        if (depth === 0) {
          const candidate = cleaned.slice(firstBrace, i + 1);
          try {
            return JSON.parse(candidate) as T;
          } catch {
            break;
          }
        }
      }
    }
  }

  // Last resort slice from first `{` to last `}`
  const lastBrace = cleaned.lastIndexOf('}');
  if (lastBrace > firstBrace) {
    const fallbackCandidate = cleaned.slice(firstBrace, lastBrace + 1);
    try {
      return JSON.parse(fallbackCandidate) as T;
    } catch {
      // Fall through
    }
  }

  throw new GroqApiError(
    'Could not parse the AI evaluation cleanly. Please try again.',
    'BAD_RESPONSE'
  );
}

interface ChatCompletionMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

async function callGroqChat(
  messages: ChatCompletionMessage[],
  maxTokens = 1600,
  temperature = 0.7
): Promise<string> {
  const { key } = resolveGroqApiKey();
  if (!key) {
    throw new GroqApiError(
      'No Groq API key found. Add your free gsk_... key in API Key Settings to start.',
      'MISSING_KEY'
    );
  }

  let response: Response;
  try {
    response = await fetch(GROQ_CHAT_COMPLETIONS_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${key}`,
      },
      // IMPORTANT: Never pass response_format: { type: "json_object" }
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages,
        max_tokens: Math.max(1500, maxTokens),
        temperature,
      }),
    });
  } catch {
    throw new GroqApiError(
      'Network error while connecting to Groq. Check your internet connection and retry.',
      'NETWORK'
    );
  }

  if (!response.ok) {
    let errorDetail = '';
    try {
      const errBody = await response.json();
      errorDetail = errBody?.error?.message || '';
    } catch {
      // Ignore parse error
    }

    if (response.status === 401 || response.status === 403) {
      throw new GroqApiError(
        errorDetail || 'Invalid or unauthorized Groq API key. Please check API Key Settings.',
        'INVALID_KEY',
        response.status
      );
    }

    if (response.status === 429) {
      throw new GroqApiError(
        errorDetail || 'Groq rate limit reached. Wait a few seconds and click Retry.',
        'RATE_LIMIT',
        429
      );
    }

    throw new GroqApiError(
      errorDetail || `Groq API request failed with status ${response.status}.`,
      'BAD_RESPONSE',
      response.status
    );
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content;
  if (typeof content !== 'string' || !content.trim()) {
    throw new GroqApiError('Received an empty response from Groq. Please retry.', 'BAD_RESPONSE');
  }

  return content.trim();
}

function describePersona(persona: PersonaId): string {
  switch (persona) {
    case 'friendly_hr':
      return 'Friendly HR: warm, encouraging, supportive, builds candidate confidence while probing behavioral depth, STAR alignment, and cultural fit.';
    case 'strict_tech_lead':
      return 'Strict Tech Lead: direct, analytical, zero-fluff engineering lead who probes technical trade-offs, quantitative constraints, and real implementation details.';
    case 'stress_tester':
      return 'Stress Tester: sharp, skeptical, fast-paced panelist who challenges vague claims, tests composure under pressure, and asks tough edge-case follow-ups.';
  }
}

function buildContextBlock(config: InterviewConfig): string {
  const resumeSummary = config.resumeText.trim()
    ? config.resumeText.trim().slice(0, 1800)
    : `Final-year engineering or technology student/graduate in ${config.track} (probe relevant core coursework, lab projects, internships, and capstone project).`;

  const jdSummary = config.jobDescription.trim()
    ? config.jobDescription.trim().slice(0, 1500)
    : `Entry-level / Graduate Engineer / Management Trainee expectations at ${config.company} for ${config.track}.`;

  return [
    `- Discipline / Track: ${config.track}`,
    `- Target Company: ${config.company}`,
    `- Interviewer Persona: ${describePersona(config.persona)}`,
    `- Interview Mode: ${config.mode}`,
    `- Language Preference: ${
      config.languageMode === 'Hinglish / Roman Urdu Comfort Mode'
        ? 'Hinglish / Roman Urdu Comfort Mode (adapt warmly and conversationally if the candidate replies in Roman Urdu/Hinglish while maintaining high global engineering standards).'
        : 'Corporate English.'
    }`,
    `- Candidate Resume / Capstone Summary:\n${resumeSummary}`,
    `- Target Job Description:\n${jdSummary}`,
  ].join('\n');
}

function clampScore(val: unknown, fallback = 0): number {
  const num = Number(val);
  if (Number.isNaN(num)) return fallback;
  return Math.max(0, Math.min(100, Math.round(num)));
}

export interface NextTurnResult {
  interviewerDialogue: string;
  isInterviewComplete: boolean;
  realtimeFeedbackHint: string;
  evaluationRubric: EvaluationRubric;
  finalCheatSheet: string[];
}

interface RawTurnSchema {
  interviewer_dialogue?: string;
  is_interview_complete?: boolean;
  realtime_feedback_hint?: string;
  evaluation_rubric?: {
    technical_accuracy?: number;
    communication_clarity?: number;
    industry_alignment?: number;
    confidence_tone?: number;
  };
  final_cheat_sheet?: string[];
  reaction?: string;
  question?: string;
}

export async function generateNextInterviewTurn(
  config: InterviewConfig,
  history: QAPair[],
  nextQuestionNumber: number,
  variety?: SessionVarietyContext
): Promise<NextTurnResult> {
  const isFirst = nextQuestionNumber === 1 || history.length === 0;
  const contextBlock = buildContextBlock(config);
  const sessionVariety = variety ?? createSessionVarietyContext();

  const askedQuestionsList = history
    .map((item) => `Q${item.questionIndex}: ${item.question}`)
    .join('\n');

  const transcriptText = history
    .map(
      (item) =>
        `Turn ${item.questionIndex} Interviewer: ${item.question}\nTurn ${item.questionIndex} Candidate Answer: ${item.answer}`
    )
    .join('\n\n');

  const systemPrompt = `You are a Principal Engineering Interviewer & Global Technical Recruiter conducting an authentic, high-signal interview tailored to ${config.company} (${config.track}).

### Session Configuration & Context:
${contextBlock}
- Current Progress: Question ${nextQuestionNumber} of ${config.questionCount}
- Unique Session Seed: ${sessionVariety.sessionSeed}
- Fresh Scenario Angle for This Session: ${sessionVariety.scenarioAngle}

### Core Operational Rules:
1. DEEP PERSONALIZATION (RESUME, JD, TRACK, COMPANY, MODE, PERSONA):
   - Question 1 MUST incorporate the candidate's Track (${config.track}), Target Company (${config.company}), Interview Mode (${config.mode}), Persona tone, and any specific projects, tools, or skill gaps found in their Resume/CV and Job Description.
2. ADAPTIVE FOLLOW-UP LOGIC (TURN 2+):
   - Carefully analyze the candidate's IMMEDIATELY PRECEDING answer.
   - If the previous answer was vague, skipped edge cases, or named a specific tool/project/metric without depth, drill down with a targeted follow-up probing that exact concept or decision.
   - Otherwise, transition smoothly to a fresh, non-overlapping competency relevant to ${config.track} @ ${config.company} in ${config.mode} mode.
3. STRICT ANTI-REPETITION ENGINE:
   - Use Session Seed "${sessionVariety.sessionSeed}" and Scenario Angle "${sessionVariety.scenarioAngle}" to craft fresh, original questions rather than generic textbook clichés.
   - NEVER repeat, rephrase, or overlap with any previously asked question in this session.
4. ACTIONABLE REAL-TIME FEEDBACK:
   - In "realtime_feedback_hint" (Turn 2+), give a crisp 1-sentence coaching tip naming specific missed technical keywords or evaluating STAR structure (Situation, Task, Action, Result). Leave empty on Turn 1.
5. LANGUAGE COMFORT:
   - ${
     config.languageMode === 'Hinglish / Roman Urdu Comfort Mode'
       ? 'Respect Comfort Mode: acknowledge Roman Urdu/Hinglish naturally if used while keeping technical rigor intact.'
       : 'Conduct the interview in crisp, natural Corporate English.'
   }
6. STRICT JSON OUTPUT:
   - Respond ONLY with valid JSON matching the schema below. Do not output markdown fences or text outside the JSON. Ask ONLY ONE focused question inside "interviewer_dialogue".

### JSON Output Schema:
{
  "interviewer_dialogue": "The text spoken or typed by the AI interviewer for the current turn.",
  "is_interview_complete": false,
  "realtime_feedback_hint": "A short, 1-sentence tip pointing out missing keywords or STAR usage (empty string on Turn 1).",
  "evaluation_rubric": {
    "technical_accuracy": 0,
    "communication_clarity": 0,
    "industry_alignment": 0,
    "confidence_tone": 0
  },
  "final_cheat_sheet": []
}`;

  const userPrompt = isFirst
    ? `Start the interview now (Question 1 of ${config.questionCount}) using Session Seed ${sessionVariety.sessionSeed} and Scenario Angle "${sessionVariety.scenarioAngle}". Tailor Question 1 tightly to ${config.track}, ${config.company}, ${config.mode} mode, and the candidate's Resume/JD if provided. Output ONLY the valid JSON object.`
    : `Previously asked questions (DO NOT repeat or rephrase any of these):\n${askedQuestionsList}\n\nFull transcript so far:\n\n${transcriptText}\n\nAnalyze the candidate's latest answer:
1) Provide a specific 1-sentence "realtime_feedback_hint" naming missed technical keywords or STAR alignment.
2) Update "evaluation_rubric" (0-100 integers).
3) In "interviewer_dialogue", ask Question ${nextQuestionNumber} of ${config.questionCount}: either probe deeper into a specific claim/concept from their last answer OR move to a completely fresh, non-overlapping competency for ${config.track} @ ${config.company}.
Set "is_interview_complete" to false and "final_cheat_sheet" to []. Output ONLY the valid JSON object.`;

  const raw = await callGroqChat(
    [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    1600,
    0.72
  );

  try {
    const parsed = extractJsonObject<RawTurnSchema>(raw);
    const dialogue =
      parsed.interviewer_dialogue?.trim() ||
      [parsed.reaction?.trim(), parsed.question?.trim()].filter(Boolean).join('\n\n') ||
      raw.replace(/^["']|["']$/g, '').trim();

    return {
      interviewerDialogue: dialogue,
      isInterviewComplete:
        Boolean(parsed.is_interview_complete) && history.length >= config.questionCount,
      realtimeFeedbackHint: isFirst ? '' : (parsed.realtime_feedback_hint || '').trim(),
      evaluationRubric: {
        technical_accuracy: clampScore(
          parsed.evaluation_rubric?.technical_accuracy,
          isFirst ? 0 : 72
        ),
        communication_clarity: clampScore(
          parsed.evaluation_rubric?.communication_clarity,
          isFirst ? 0 : 74
        ),
        industry_alignment: clampScore(
          parsed.evaluation_rubric?.industry_alignment,
          isFirst ? 0 : 72
        ),
        confidence_tone: clampScore(parsed.evaluation_rubric?.confidence_tone, isFirst ? 0 : 75),
      },
      finalCheatSheet: Array.isArray(parsed.final_cheat_sheet)
        ? parsed.final_cheat_sheet.map((s) => String(s).trim()).filter(Boolean)
        : [],
    };
  } catch {
    return {
      interviewerDialogue: raw.replace(/^["']|["']$/g, '').trim(),
      isInterviewComplete: false,
      realtimeFeedbackHint: '',
      evaluationRubric: {
        technical_accuracy: 0,
        communication_clarity: 0,
        industry_alignment: 0,
        confidence_tone: 0,
      },
      finalCheatSheet: [],
    };
  }
}

export async function generateQuestionHint(
  config: InterviewConfig,
  currentQuestion: string
): Promise<string[]> {
  const systemPrompt = `You are an encouraging global engineering career coach.
Provide 3 concise, structured bullet-point hints on HOW to approach the interview question below WITHOUT giving away the full answer.
Context: Track = ${config.track}, Target Company = ${config.company}, Mode = ${config.mode}.
Return ONLY a valid JSON object:
{"hints": ["Hint 1...", "Hint 2...", "Hint 3..."]}`;

  const raw = await callGroqChat(
    [
      { role: 'system', content: systemPrompt },
      {
        role: 'user',
        content: `Interview Question:\n"${currentQuestion}"\n\nGenerate 3 actionable approach hints in JSON.`,
      },
    ],
    1500,
    0.5
  );

  try {
    const parsed = extractJsonObject<{ hints?: string[] }>(raw);
    if (Array.isArray(parsed.hints) && parsed.hints.length > 0) {
      return parsed.hints.slice(0, 3).map((h) => String(h).trim()).filter(Boolean);
    }
  } catch {
    // Fallback line extraction
  }

  const lines = raw
    .split('\n')
    .map((line) => line.replace(/^[-*•\d.)\s]+/, '').trim())
    .filter((line) => line.length > 8);

  return lines.length > 0
    ? lines.slice(0, 3)
    : [
        'Structure your answer using Context -> Action -> Outcome (STAR) or Problem -> Trade-off -> Solution.',
        `Connect your reasoning to real engineering coursework, labs, or project experience relevant to ${config.company}.`,
        'Include at least one measurable result, technical constraint, or safety/quality metric.',
      ];
}

interface RawEvaluationResponse {
  overallScore?: number;
  readinessLabel?: string;
  executiveSummary?: string;
  clarityStructureScore?: number;
  technicalAlignmentScore?: number;
  communicationScore?: number;
  technicalDepthScore?: number;
  confidenceScore?: number;
  evaluation_rubric?: {
    technical_accuracy?: number;
    communication_clarity?: number;
    industry_alignment?: number;
    confidence_tone?: number;
  };
  final_cheat_sheet?: string[];
  skillBadges?: string[];
  strengths?: string[];
  improvements?: string[];
  questionBreakdowns?: Array<{
    questionNumber?: number;
    score?: number;
    englishTranslation?: string;
    feedback?: string;
    polishedSampleAnswer?: string;
  }>;
}

export async function generateFinalEvaluation(
  config: InterviewConfig,
  qaPairs: QAPair[]
): Promise<InterviewReport> {
  const answerDepth = computeAnswerDepthMetrics(qaPairs.map((q) => q.answer));
  const isComfortMode = config.languageMode === 'Hinglish / Roman Urdu Comfort Mode';
  const contextBlock = buildContextBlock(config);

  const transcript = qaPairs
    .map(
      (qa, idx) =>
        `Q${idx + 1}: ${qa.question}\nCandidate Answer (${qa.wordCount} words): ${qa.answer}`
    )
    .join('\n\n---\n\n');

  const systemPrompt = `You are a Principal Engineering Interviewer & Global Technical Recruiter evaluating an engineering/tech candidate's completed mock interview.
${contextBlock}

DETERMINISTIC RESPONSE LENGTH METRICS:
- Average words per answer: ${answerDepth.averageWordsPerAnswer}
- Total words submitted: ${answerDepth.totalWords}
- Conciseness Band: ${answerDepth.concisenessRating}

EVALUATION RULES:
1. ACTIONABLE EDUCATIONAL FEEDBACK: Do not give generic praise or generic scores. For every question, explicitly state what specific technical keywords/concepts the candidate missed and evaluate whether behavioral/project answers followed the STAR method (Situation, Task, Action, Result).
2. COMMUNICATION & RESPONSE QUALITY METRICS:
   - Score "clarityStructureScore" (0-100 integer): evaluates logical flow, conciseness, and STAR method structuring.
   - Score "technicalAlignmentScore" (0-100 integer): evaluates technical depth and role relevance to ${config.track} @ ${config.company}.
3. RUBRIC & REVISION CHEAT SHEET: Populate "evaluation_rubric" (0-100 integers for technical_accuracy, communication_clarity, industry_alignment, confidence_tone) and "final_cheat_sheet" with 4-6 specific concepts, missed keywords, or architecture patterns the student must revise tonight.
4. ${
    isComfortMode
      ? 'COMFORT MODE TRANSLATION: The candidate may have responded in Hinglish / Roman Urdu mixed with English. Judge their engineering/business ideas fairly without penalizing Roman Urdu phrasing, provide an "englishTranslation" translating their idea into polished corporate English for each question, and provide a "polishedSampleAnswer" in crisp corporate English.'
      : 'Evaluate clarity, technical accuracy, structure, and depth in Corporate English.'
  }

Return ONLY a valid JSON object (no markdown fences, no commentary outside braces) matching this exact schema:
{
  "overallScore": 0-100 integer,
  "readinessLabel": "2-4 word verdict e.g. Interview Ready / Strong Potential / Needs Focused Prep",
  "executiveSummary": "3-4 sentence constructive summary tailored to target company",
  "clarityStructureScore": 0-100 integer,
  "technicalAlignmentScore": 0-100 integer,
  "confidenceScore": 0-100 integer,
  "evaluation_rubric": {
    "technical_accuracy": 0-100 integer,
    "communication_clarity": 0-100 integer,
    "industry_alignment": 0-100 integer,
    "confidence_tone": 0-100 integer
  },
  "final_cheat_sheet": [
    "Specific concept, missed keyword, or architecture pattern to revise tonight"
  ],
  "skillBadges": ["3 to 4 concise skill badges like Strong Problem Solving, Structured STAR Framing, Solid Technical Depth"],
  "strengths": ["3 specific strengths observed from their actual answers"],
  "improvements": ["3 concrete, actionable improvements"],
  "questionBreakdowns": [
    {
      "questionNumber": 1,
      "score": 0-100 integer,
      "englishTranslation": "${isComfortMode ? 'Polished English translation of what the candidate meant' : ''}",
      "feedback": "2-3 sentences naming missed technical keywords and STAR method evaluation",
      "polishedSampleAnswer": "A crisp, high-scoring model answer tailored to this question and company"
    }
  ]
}`;

  const raw = await callGroqChat(
    [
      { role: 'system', content: systemPrompt },
      {
        role: 'user',
        content: `Evaluate all ${qaPairs.length} questions below. Ensure questionBreakdowns has exactly ${qaPairs.length} items and final_cheat_sheet has 4-6 concrete revision items.\n\n${transcript}`,
      },
    ],
    2400,
    0.4
  );

  const parsed = extractJsonObject<RawEvaluationResponse>(raw);
  const overallScore = clampScore(parsed.overallScore, 74);

  const clarityStructureScore = clampScore(
    parsed.clarityStructureScore ??
      parsed.communicationScore ??
      parsed.evaluation_rubric?.communication_clarity,
    overallScore
  );

  const technicalAlignmentScore = clampScore(
    parsed.technicalAlignmentScore ??
      parsed.technicalDepthScore ??
      parsed.evaluation_rubric?.technical_accuracy,
    overallScore
  );

  const confidenceScore = clampScore(
    parsed.confidenceScore ?? parsed.evaluation_rubric?.confidence_tone,
    overallScore
  );

  const evaluationRubric: EvaluationRubric = {
    technical_accuracy: clampScore(
      parsed.evaluation_rubric?.technical_accuracy,
      technicalAlignmentScore
    ),
    communication_clarity: clampScore(
      parsed.evaluation_rubric?.communication_clarity,
      clarityStructureScore
    ),
    industry_alignment: clampScore(
      parsed.evaluation_rubric?.industry_alignment,
      technicalAlignmentScore
    ),
    confidence_tone: clampScore(parsed.evaluation_rubric?.confidence_tone, confidenceScore),
  };

  const communicationMetrics: CommunicationQualityMetrics = {
    clarityStructureScore,
    technicalAlignmentScore,
    answerDepth,
  };

  const finalCheatSheet =
    Array.isArray(parsed.final_cheat_sheet) && parsed.final_cheat_sheet.length > 0
      ? parsed.final_cheat_sheet.slice(0, 6).map((s) => String(s).trim()).filter(Boolean)
      : [
          `${config.track} Core Fundamentals: Review key industry terminology and failure modes relevant to ${config.company}.`,
          'STAR Method Structuring: Quantify Situation, Task, Action, and measurable Result for every project example.',
        ];

  const questionBreakdowns = qaPairs.map((qa, idx) => {
    const match =
      parsed.questionBreakdowns?.find((b) => b.questionNumber === idx + 1) ||
      parsed.questionBreakdowns?.[idx];

    return {
      questionNumber: idx + 1,
      question: qa.question,
      userAnswer: qa.answer,
      englishTranslation:
        isComfortMode && match?.englishTranslation?.trim()
          ? match.englishTranslation.trim()
          : undefined,
      score: clampScore(match?.score, overallScore),
      feedback:
        match?.feedback?.trim() ||
        'Good attempt. Explicitly name core technical keywords, constraints, and structure your answer with STAR (Situation, Task, Action, Result).',
      polishedSampleAnswer:
        match?.polishedSampleAnswer?.trim() ||
        'Structure your answer with the core engineering constraint, the trade-off you evaluated, your concrete action, and a measurable outcome relevant to the role.',
    };
  });

  return {
    overallScore,
    readinessLabel:
      parsed.readinessLabel?.trim() ||
      (overallScore >= 80 ? 'Interview Ready' : 'Developing Readiness'),
    executiveSummary:
      parsed.executiveSummary?.trim() ||
      `Completed ${qaPairs.length} ${config.mode.toLowerCase()} questions targeting ${config.company} (${config.track}). Review the missed technical keywords, STAR feedback, and revision cheat sheet below.`,
    communicationScore: clarityStructureScore,
    technicalDepthScore: technicalAlignmentScore,
    confidenceScore,
    communicationMetrics,
    evaluationRubric,
    finalCheatSheet,
    skillBadges:
      Array.isArray(parsed.skillBadges) && parsed.skillBadges.length > 0
        ? parsed.skillBadges.slice(0, 4).map((s) => String(s).trim())
        : ['Structured Thinker', 'Growth Mindset', 'Domain Foundation'],
    strengths:
      Array.isArray(parsed.strengths) && parsed.strengths.length > 0
        ? parsed.strengths.slice(0, 4).map((s) => String(s).trim())
        : ['Completed all interview questions with relevant context.'],
    improvements:
      Array.isArray(parsed.improvements) && parsed.improvements.length > 0
        ? parsed.improvements.slice(0, 4).map((s) => String(s).trim())
        : ['Quantify project outcomes and tighten STAR Result statements in spoken responses.'],
    questionBreakdowns,
    isDemo: false,
    completedAt: new Date().toISOString(),
  };
}
