import type {
  CompanyCategory,
  CompanyPreset,
  DemoScenarioPreset,
  InterviewConfig,
  InterviewReport,
  PersonaOption,
  QuestionEvaluation,
} from '../types/interview';
import { computeAnswerDepthMetrics } from '../utils/responseMetrics';

export const ENGINEERING_TRACKS: readonly string[] = [
  'Software Engineering & CS',
  'Artificial Intelligence & Data Science',
  'Electrical & Electronics Engineering',
  'Mechanical Engineering',
  'Civil & Infrastructure Engineering',
  'Chemical & Process Engineering',
  'Industrial & Manufacturing Engineering',
  'Telecommunications Engineering',
  'Mechatronics & Robotics',
  'Biomedical Engineering',
  'Textile & Materials Engineering',
  'Petroleum & Gas Engineering',
  'Finance, Management & HR',
];

export const COMPANY_CATEGORIES: readonly CompanyCategory[] = [
  'Pakistani Tech & Software',
  'Energy, Power & Industrial (Core Engineering)',
  'Telecom & Banking',
  'International & MNCs',
];

export const COMPANY_PRESETS: readonly CompanyPreset[] = [
  // Pakistani Tech & Software
  {
    name: 'Systems Limited',
    category: 'Pakistani Tech & Software',
    focusHint: 'Enterprise systems, OOP, databases, cloud architecture & client delivery',
  },
  {
    name: '10Pearls',
    category: 'Pakistani Tech & Software',
    focusHint: 'Agile product engineering, full-stack systems, clean code & UX collaboration',
  },
  {
    name: 'Folio3',
    category: 'Pakistani Tech & Software',
    focusHint: 'Web/mobile apps, ERP integrations, AI solutions & problem solving',
  },
  {
    name: 'Netsol Technologies',
    category: 'Pakistani Tech & Software',
    focusHint: 'FinTech & asset finance platforms, scalable backend & enterprise reliability',
  },
  {
    name: 'Arbisoft',
    category: 'Pakistani Tech & Software',
    focusHint: 'Python/Django, EdTech/web scale, algorithms & software craftsmanship',
  },
  {
    name: 'Confiz',
    category: 'Pakistani Tech & Software',
    focusHint: 'Retail tech, cloud engineering, microservices & data pipelines',
  },
  {
    name: 'Afiniti',
    category: 'Pakistani Tech & Software',
    focusHint: 'Applied AI, statistical modeling, high-throughput C++/Python & math rigor',
  },
  {
    name: 'Contour Software',
    category: 'Pakistani Tech & Software',
    focusHint: 'Vertical SaaS products, maintainable codebases & long-term ownership',
  },
  {
    name: 'Motive',
    category: 'Pakistani Tech & Software',
    focusHint: 'IoT fleet telemetry, distributed systems, computer vision & high-scale APIs',
  },
  {
    name: 'Dubizzle Labs',
    category: 'Pakistani Tech & Software',
    focusHint: 'High-traffic marketplaces, caching, search optimization & mobile scale',
  },

  // Energy, Power & Industrial (Core Engineering)
  {
    name: 'K-Electric',
    category: 'Energy, Power & Industrial (Core Engineering)',
    focusHint: 'Power distribution, grid reliability, SCADA, protection & HSE compliance',
  },
  {
    name: 'Sui Southern Gas (SSGC)',
    category: 'Energy, Power & Industrial (Core Engineering)',
    focusHint: 'Pipeline integrity, gas transmission, instrumentation & field safety',
  },
  {
    name: 'Pakistan State Oil (PSO)',
    category: 'Energy, Power & Industrial (Core Engineering)',
    focusHint: 'Supply chain operations, terminal engineering, quality assurance & logistics',
  },
  {
    name: 'Engro Corporation',
    category: 'Energy, Power & Industrial (Core Engineering)',
    focusHint: 'Process engineering, plant reliability, HSE excellence & leadership potential',
  },
  {
    name: 'Lucky Cement',
    category: 'Energy, Power & Industrial (Core Engineering)',
    focusHint: 'Heavy plant automation, mechanical maintenance, kilns & energy efficiency',
  },
  {
    name: 'Fatima Group',
    category: 'Energy, Power & Industrial (Core Engineering)',
    focusHint: 'Fertilizer plant operations, chemical process optimization & teamwork',
  },
  {
    name: 'Packages Limited',
    category: 'Energy, Power & Industrial (Core Engineering)',
    focusHint: 'Industrial manufacturing, lean Six Sigma, packaging machinery & QA',
  },
  {
    name: 'Atlas Honda',
    category: 'Energy, Power & Industrial (Core Engineering)',
    focusHint: 'Automotive assembly, kaizen, tooling design & production quality control',
  },
  {
    name: 'Indus Motor Company (Toyota)',
    category: 'Energy, Power & Industrial (Core Engineering)',
    focusHint: 'Toyota Production System, Kaizen, supply chain & industrial engineering',
  },

  // Telecom & Banking
  {
    name: 'Jazz',
    category: 'Telecom & Banking',
    focusHint: 'Telecom networks, 4G/5G optimization, digital fintech (JazzCash) & analytics',
  },
  {
    name: 'PTCL',
    category: 'Telecom & Banking',
    focusHint: 'Fiber optics, core IP routing, enterprise connectivity & operations',
  },
  {
    name: 'Telenor',
    category: 'Telecom & Banking',
    focusHint: 'Network engineering, customer-centric digital services & agile delivery',
  },
  {
    name: 'HBL',
    category: 'Telecom & Banking',
    focusHint: 'Core banking tech, digital payments, cybersecurity, risk & management trainee',
  },
  {
    name: 'Meezan Bank',
    category: 'Telecom & Banking',
    focusHint: 'Islamic banking technology, Shariah-compliant finance, reliability & ethics',
  },
  {
    name: 'UBL',
    category: 'Telecom & Banking',
    focusHint: 'Digital banking innovation, data analytics, treasury & graduate programs',
  },

  // International & MNCs
  {
    name: 'Unilever Pakistan',
    category: 'International & MNCs',
    focusHint: 'Supply chain, FMCG operations, leadership competencies & purpose-driven impact',
  },
  {
    name: 'Procter & Gamble (P&G)',
    category: 'International & MNCs',
    focusHint: 'PEAK behavioral stories, ownership, data-driven manufacturing & leadership',
  },
  {
    name: 'Nestlé',
    category: 'International & MNCs',
    focusHint: 'Process safety, automation, quality management & continuous improvement',
  },
  {
    name: 'Siemens',
    category: 'International & MNCs',
    focusHint: 'Industrial automation, PLC/SCADA, power systems & precision engineering',
  },
  {
    name: 'Schlumberger (SLB)',
    category: 'International & MNCs',
    focusHint: 'Field engineering resilience, reservoir/drilling fundamentals & global safety',
  },
  {
    name: 'Shell',
    category: 'International & MNCs',
    focusHint: 'Capacity-Achievement-Relationship (CAR), energy transition & operational safety',
  },
  {
    name: 'Google',
    category: 'International & MNCs',
    focusHint: 'Data structures & algorithms, system design, scalability & Googleyness',
  },
  {
    name: 'Microsoft',
    category: 'International & MNCs',
    focusHint: 'Problem solving, clean architecture, growth mindset & distributed cloud',
  },
  {
    name: 'Amazon',
    category: 'International & MNCs',
    focusHint: 'Leadership Principles (Customer Obsession, Ownership) & scalable design',
  },
  {
    name: 'General Startup',
    category: 'International & MNCs',
    focusHint: 'First-principles thinking, rapid shipping, adaptability & full ownership',
  },
];

export const PERSONA_OPTIONS: readonly PersonaOption[] = [
  {
    id: 'friendly_hr',
    name: 'Friendly HR',
    subtitle: 'Supportive & encouraging',
    description:
      'Warm conversational tone focused on cultural fit, communication clarity, teamwork, and confidence building.',
    styleTag: 'Supportive',
  },
  {
    id: 'strict_tech_lead',
    name: 'Strict Tech Lead',
    subtitle: 'Deep technical probing',
    description:
      'Direct, detail-oriented engineering lead who challenges assumptions, architecture trade-offs, and fundamentals.',
    styleTag: 'Technical Depth',
  },
  {
    id: 'stress_tester',
    name: 'Stress Tester',
    subtitle: 'Challenging follow-ups',
    description:
      'High-pressure panelist testing composure under tight constraints, edge cases, and sharp skeptical follow-ups.',
    styleTag: 'High Pressure',
  },
];

interface DemoBlueprint {
  config: InterviewConfig;
  overallScore: number;
  readinessLabel: string;
  executiveSummary: string;
  clarityStructureScore: number;
  technicalAlignmentScore: number;
  confidenceScore: number;
  industryAlignmentScore: number;
  finalCheatSheet: string[];
  skillBadges: string[];
  strengths: string[];
  improvements: string[];
  questionBreakdowns: QuestionEvaluation[];
}

function buildDemoPreset(blueprint: DemoBlueprint, index: number): DemoScenarioPreset {
  const answerDepth = computeAnswerDepthMetrics(
    blueprint.questionBreakdowns.map((q) => q.userAnswer)
  );

  const report: InterviewReport = {
    overallScore: blueprint.overallScore,
    readinessLabel: blueprint.readinessLabel,
    executiveSummary: blueprint.executiveSummary,
    communicationScore: blueprint.clarityStructureScore,
    technicalDepthScore: blueprint.technicalAlignmentScore,
    confidenceScore: blueprint.confidenceScore,
    communicationMetrics: {
      clarityStructureScore: blueprint.clarityStructureScore,
      technicalAlignmentScore: blueprint.technicalAlignmentScore,
      answerDepth,
    },
    evaluationRubric: {
      technical_accuracy: blueprint.technicalAlignmentScore,
      communication_clarity: blueprint.clarityStructureScore,
      industry_alignment: blueprint.industryAlignmentScore,
      confidence_tone: blueprint.confidenceScore,
    },
    finalCheatSheet: blueprint.finalCheatSheet,
    skillBadges: blueprint.skillBadges,
    strengths: blueprint.strengths,
    improvements: blueprint.improvements,
    questionBreakdowns: blueprint.questionBreakdowns,
    isDemo: true,
    demoIndex: index,
    completedAt: '2026-11-18T10:30:00.000Z',
  };

  return {
    track: blueprint.config.track,
    config: blueprint.config,
    report,
  };
}

export const JUDGE_DEMO_PRESETS: DemoScenarioPreset[] = [
  // 1. Software Engineering & CS (Score: 86, Hinglish / Roman Urdu Comfort Mode)
  buildDemoPreset(
    {
      config: {
        track: 'Software Engineering & CS',
        company: 'Systems Limited',
        persona: 'strict_tech_lead',
        mode: 'Mixed',
        languageMode: 'Hinglish / Roman Urdu Comfort Mode',
        questionCount: 5,
        timerEnabled: true,
        jobDescription:
          'Associate Software Engineer — Full-stack enterprise web applications using React, Node.js, REST APIs, and relational databases. Strong grasp of OOP, SQL optimization, and Agile teamwork.',
        resumeText:
          'Final Year BS Software Engineering student (CGPA 3.68). Capstone: Smart Campus Energy & Attendance Portal using React, Express, and PostgreSQL. Summer Intern building REST endpoints.',
      },
      overallScore: 86,
      readinessLabel: 'Strong Hire Potential',
      executiveSummary:
        'Solid engineering fundamentals and practical troubleshooting instincts aligned well with Systems Limited enterprise delivery standards. Even while answering in Comfort Mode (Hinglish/Roman Urdu), your architectural reasoning on SQL indexing, connection pooling, and idempotency keys is accurate and production-minded.',
      clarityStructureScore: 83,
      technicalAlignmentScore: 89,
      confidenceScore: 87,
      industryAlignmentScore: 88,
      finalCheatSheet: [
        'SQL Query Profiling: Explain N+1 query detection with EXPLAIN ANALYZE, composite B-tree index column ordering, and PgBouncer pool sizing.',
        'Distributed Idempotency: Distinguish unique DB constraint enforcement vs. Redis atomic SETNX locks for concurrent payment retries.',
        'STAR Behavioral Framing: Always close conflict-resolution stories with a quantified Result (latency saved, sprint velocity, or defect reduction).',
        'OOP Refactoring: Prepare one enterprise example replacing deep inheritance with Strategy or Dependency Injection composition.',
      ],
      skillBadges: [
        'Production Triage Mindset',
        'Database Optimization',
        'API Reliability',
        'Collaborative Problem Solver',
      ],
      strengths: [
        'Diagnosed database bottlenecks systematically using EXPLAIN ANALYZE, composite indexing, and short-TTL Redis caching.',
        'Demonstrated data-backed conflict resolution using objective pros/cons trade-off tables during capstone work.',
        'Accurately articulated idempotency key workflows for fault-tolerant enterprise APIs.',
      ],
      improvements: [
        'Quantify impact explicitly (e.g., report generation latency reduced from 1.2s to 45ms after indexing).',
        'Practice delivering the same structured points fluently in Corporate English for client-facing panels.',
        'Mention concurrent in-flight lock handling (HTTP 409 vs cached 200 replay) in idempotency explanations.',
      ],
      questionBreakdowns: [
        {
          questionNumber: 1,
          question:
            'In your Smart Campus Energy & Attendance Portal capstone, how did you structure the database schema to avoid N+1 query bottlenecks when generating daily department reports?',
          userAnswer:
            'Humne PostgreSQL use kiya tha aur shuru mein har student ke liye separate query chal rahi thi jisse report page slow ho gaya tha. Phir maine SQL JOINs aur composite indexing lagayi department_id aur date par, aur aggregate COUNT queries use ki taake ek single query mein poora summary data aa jaye.',
          englishTranslation:
            'We used PostgreSQL, and initially our reporting page slowed down because separate queries executed per student. I resolved this by adding composite indexes on (department_id, date) and consolidating the logic into single aggregate COUNT queries with SQL JOINs.',
          score: 85,
          feedback:
            'Accurate diagnosis and fix for N+1 queries. Mentioning exact before/after query execution times or row counts would strengthen measurable impact.',
          polishedSampleAnswer:
            'In our Smart Campus Portal built on PostgreSQL, our initial ORM implementation triggered N+1 queries per student on daily reports. I profiled the endpoint, replaced the loop with a single SQL JOIN and GROUP BY aggregate query, and added a composite index on (department_id, attendance_date), cutting report latency by over 80%.',
        },
        {
          questionNumber: 2,
          question:
            'If a production banking API starts timing out under peak load during a client rollout, what systematic steps would you take in the first 15 minutes?',
          userAnswer:
            'Sab se pehle main server logs aur APM metrics check karunga ke bottleneck database layer par hai ya application CPU par. Agar slow queries dikhein toh EXPLAIN ANALYZE run karunga, connection pool exhaustion check karunga, aur urgent mitigation ke liye read-heavy endpoints par short-TTL Redis caching ya rate limiting enable karunga.',
          englishTranslation:
            'First, I would inspect server logs and APM metrics to isolate whether the bottleneck is at the database or application CPU layer. If slow queries appear, I would run EXPLAIN ANALYZE, check for connection pool exhaustion, and apply short-TTL Redis caching or rate limiting on read-heavy endpoints.',
          score: 91,
          feedback:
            'Excellent structured incident response! Separating telemetry triage from short-term mitigation shows strong production maturity.',
          polishedSampleAnswer:
            'In the first 15 minutes, I would inspect APM dashboards and structured logs to isolate CPU saturation, downstream timeouts, or DB lock contention. Once confirmed database-bound, I would inspect pg_stat_activity, run EXPLAIN ANALYZE on top offenders, verify connection pool saturation, and enable short-TTL Redis caching or rate limiting on read-heavy paths.',
        },
        {
          questionNumber: 3,
          question:
            'Explain the practical difference between Composition and Inheritance in OOP, and when inheritance becomes an anti-pattern in enterprise codebases.',
          userAnswer:
            'Inheritance mein "is-a" relationship hota hai jahan child class parent ki properties inherit karti hai, lekin agar hierarchy deep ho jaye toh tight coupling create hoti hai. Composition "has-a" approach hai jahan hum modular behaviors inject karte hain, jo testing aur future changes ke liye zyada flexible hota hai.',
          englishTranslation:
            'Inheritance represents an "is-a" relationship where child classes inherit parent behavior, creating tight coupling as hierarchies deepen. Composition uses a "has-a" approach by injecting modular behaviors, improving testability and flexibility.',
          score: 84,
          feedback:
            'Clear conceptual contrast. Adding a concrete example (fragile base class problem in role/permission hierarchies) makes it memorable.',
          polishedSampleAnswer:
            'Inheritance models an "is-a" hierarchy, while composition models a "has-a" capability. Deep inheritance becomes an anti-pattern when base-class edits ripple across unrelated subclasses. Composition lets us inject focused, interface-backed strategies that are cleanly unit-tested and swapped at runtime.',
        },
        {
          questionNumber: 4,
          question:
            'Tell me about a time in a group project when a teammate disagreed with your technical approach. How did you resolve it without slipping the deadline?',
          userAnswer:
            'Meri team mein ek member NoSQL chahta tha aur main PostgreSQL suggest kar raha tha kyunki hamara attendance aur energy logs relational data tha. Humne 30 minutes baith kar dono schemas ka pros/cons table banaya, aur jab reporting queries ka complexity difference dikhaya toh hum dono SQL par agree ho gaye.',
          englishTranslation:
            'A teammate preferred NoSQL while I recommended PostgreSQL because our attendance and energy logs were inherently relational. We spent 30 minutes building a pros-and-cons comparison table, and once we evaluated reporting query complexity, we aligned on SQL.',
          score: 83,
          feedback:
            'Great behavioral story showing objective collaboration without ego. Close with the concrete Result (STAR) such as shipping on time.',
          polishedSampleAnswer:
            'Situation: During our capstone, a teammate pushed for MongoDB while our attendance and metering data was strictly relational. Action: I proposed a 30-minute spike comparing schema integrity and multi-table reporting joins side by side. Result: The team aligned unanimously on PostgreSQL and delivered the analytics dashboard two days ahead of deadline.',
        },
        {
          questionNumber: 5,
          question:
            'How do you design idempotent REST APIs for payment or critical state-changing operations so duplicate client retries never corrupt records?',
          userAnswer:
            'Client har request ke header mein ek unique Idempotency-Key UUID bhejta hai. Server transaction start karne se pehle check karta hai ke yeh key database ya Redis mein already processed toh nahi hai; agar processed hai toh wahi cached response return hota hai instead of dubara record insert karne ke.',
          englishTranslation:
            'The client sends a unique Idempotency-Key UUID in the request header. Before starting the database transaction, the server checks Redis or the database to see if that key was already processed; if so, it replays the stored response instead of inserting duplicate records.',
          score: 88,
          feedback:
            'Spot-on mechanism! Mentioning concurrent in-flight lock handling and payload mismatch checks (HTTP 422/409) takes it to 95+.',
          polishedSampleAnswer:
            'The client generates a UUID Idempotency-Key header per logical mutation. On arrival, the server acquires an atomic Redis/DB lock on the key: completed keys replay the stored status and body, while in-flight duplicates receive 409 Conflict—preventing double charges under network retries.',
        },
      ],
    },
    0
  ),

  // 2. Artificial Intelligence & Data Science (Score: 91)
  buildDemoPreset(
    {
      config: {
        track: 'Artificial Intelligence & Data Science',
        company: 'Afiniti',
        persona: 'strict_tech_lead',
        mode: 'Technical',
        languageMode: 'Corporate English',
        questionCount: 3,
        timerEnabled: true,
        jobDescription:
          'Junior Applied AI / Data Scientist — Production ML pipelines, class imbalance handling, uplift/propensity modeling, statistical validation, and low-latency Python inference.',
        resumeText:
          'B.S. Data Science graduate. Built a real-time churn and call-routing propensity model using XGBoost and LightGBM; deployed FastAPI inference service handling 400 req/s.',
      },
      overallScore: 91,
      readinessLabel: 'Top Candidate Fit',
      executiveSummary:
        'Exceptional command of applied machine learning trade-offs, calibration, and production inference latency tailored to Afiniti. Your distinction between ROC-AUC and PR-AUC on skewed targets and clear leakage prevention strategy stood out.',
      clarityStructureScore: 90,
      technicalAlignmentScore: 93,
      confidenceScore: 90,
      industryAlignmentScore: 92,
      finalCheatSheet: [
        'Imbalanced Classification: Compare PR-AUC, F1, and calibrated Brier Score vs. misleading accuracy/ROC-AUC on 1% positive classes.',
        'Target Leakage Prevention: Fit scalers, target encoders, and SMOTE strictly inside cross-validation folds or time-based splits.',
        'Production Inference P99: Discuss ONNX Runtime, Treelite compilation, batching, and feature-store caching under strict <50ms SLAs.',
      ],
      skillBadges: [
        'Statistical Rigor',
        'Leakage-Free Pipelines',
        'Low-Latency ML Serving',
      ],
      strengths: [
        'Selected PR-AUC and expected calibration error appropriately over vanilla accuracy for skewed datasets.',
        'Identified temporal data leakage risks immediately when handling rolling customer features.',
        'Proposed concrete tree compilation (Treelite/ONNX) and feature pre-fetching to hit sub-30ms inference.',
      ],
      improvements: [
        'Reference cost-sensitive threshold tuning tied directly to business revenue per true positive vs false alarm.',
        'Clarify how you monitor feature drift (PSI / KS test) after model deployment.',
      ],
      questionBreakdowns: [
        {
          questionNumber: 1,
          question:
            'Your training dataset for customer conversion has only 1.8% positive outcomes. Why can ROC-AUC mislead stakeholders here, and which evaluation metrics would you pair instead?',
          userAnswer:
            'With 1.8% positives, the huge true-negative pool suppresses the false-positive rate in ROC-AUC, making a mediocre model look like 0.90+. I rely on Precision-Recall AUC, Precision@K for top deciles, and Brier Score or log-loss to ensure predicted probabilities are well calibrated for downstream routing.',
          score: 93,
          feedback:
            'Crisp, mathematically accurate answer naming PR-AUC, Precision@K, and probability calibration.',
          polishedSampleAnswer:
            'Because ROC-AUC uses False Positive Rate (FP / (FP + TN)), an abundance of true negatives masks thousands of false positives when base rate is 1.8%. I evaluate with PR-AUC, lift at top deciles, and calibrated log-loss/Brier Score, then set decision thresholds via expected business value.',
        },
        {
          questionNumber: 2,
          question:
            'How do you prevent subtle data leakage when building rolling 7-day behavioral aggregates for a time-series pairing model?',
          userAnswer:
            'We must enforce strict point-in-time joins so features at timestamp T only aggregate events strictly before T minus any ingestion lag. All normalization, target encoding, and missing-value imputation must fit exclusively on the training time window before touching validation or out-of-time test splits.',
          score: 91,
          feedback:
            'Strong grasp of point-in-time correctness and pipeline isolation. Mentioning feature-store offline/online parity would make it complete.',
          polishedSampleAnswer:
            'I enforce strict temporal splits rather than random K-fold, computing rolling aggregates via point-in-time joins bounded strictly prior to prediction timestamp T (accounting for ETL lag). All transformers—imputers, scalers, target encoders—are wrapped in a Pipeline fitted solely on the training horizon.',
        },
        {
          questionNumber: 3,
          question:
            'If an ensemble of LightGBM models violates a 25ms P99 latency SLA in production, how would you diagnose and optimize inference without sacrificing accuracy?',
          userAnswer:
            'First I profile Python serialization vs tree traversal time. Often Pydantic validation or per-request pandas DataFrame creation dominates latency, so switching to NumPy arrays, exporting trees via ONNX or Treelite in C++, and caching static user features in Redis cuts P99 under 10ms.',
          score: 89,
          feedback:
            'Excellent identification of pandas overhead in hot paths plus Treelite/ONNX optimization.',
          polishedSampleAnswer:
            'I would benchmark request overhead vs model compute first—eliminating pandas DataFrame construction in favor of contiguous NumPy buffers often removes 60% of latency. Next, I would compile LightGBM via Treelite/ONNX Runtime, prune redundant trees via early distillation if needed, and pre-hydrate slow-changing features in Redis.',
        },
      ],
    },
    1
  ),

  // 3. Electrical & Electronics Engineering (Score: 82)
  buildDemoPreset(
    {
      config: {
        track: 'Electrical & Electronics Engineering',
        company: 'K-Electric',
        persona: 'strict_tech_lead',
        mode: 'Technical',
        languageMode: 'Corporate English',
        questionCount: 3,
        timerEnabled: true,
        jobDescription:
          'Graduate Electrical Engineer (Grid & Protection) — 132kV/11kV substation operations, differential & distance protection relays, SCADA telemetry, and fault clearance.',
        resumeText:
          'B.E. Electrical Engineering (Power). Capstone: Automated Feeder Fault Isolation using IEC 61850 relays and ETAP load-flow simulation. Summer intern at 132kV grid station.',
      },
      overallScore: 82,
      readinessLabel: 'Interview Ready',
      executiveSummary:
        'Strong practical understanding of substation protection schemes, CT saturation risks, and power factor correction principles suited to K-Electric grid operations. Expanding slightly on arc-flash PPE boundaries and relay coordination margins will push your score into the 90s.',
      clarityStructureScore: 80,
      technicalAlignmentScore: 84,
      confidenceScore: 82,
      industryAlignmentScore: 84,
      finalCheatSheet: [
        'Protection Coordination: Verify CTI (Coordination Time Interval ~0.25–0.4s) between downstream overcurrent (50/51) and upstream relays.',
        'CT Safety Rule: NEVER open-circuit an energized Current Transformer secondary—extreme induced voltage destroys insulation and risks fatal shock.',
        'Power Factor & Harmonics: Use detuned capacitor banks (7% or 14% reactor) where VFD harmonic loads exist to avoid parallel resonance.',
      ],
      skillBadges: [
        'Substation Protection',
        'Power System Safety',
        'ETAP & Load Flow',
      ],
      strengths: [
        'Accurately explained why a Current Transformer secondary must always remain shorted or loaded before disconnection.',
        'Understood differential (87T) slope bias characteristics to prevent false tripping on external through-faults.',
      ],
      improvements: [
        'Include specific relay ANSI device numbers (50/51, 87T, 21) and typical coordination time intervals (CTI).',
        'Highlight Lockout/Tagout (LOTO) verification steps alongside technical troubleshooting.',
      ],
      questionBreakdowns: [
        {
          questionNumber: 1,
          question:
            'Why is open-circuiting the secondary winding of an energized Current Transformer (CT) considered a severe substation hazard, and what is the safe procedure before maintenance?',
          userAnswer:
            'When the secondary is opened while primary load current flows, there is no opposing secondary MMF, so all primary current becomes magnetizing current. This drives the core into deep saturation and induces dangerously high peak voltages across the open terminals. Before disconnecting meters, we must close the CT shorting link first.',
          score: 88,
          feedback:
            'Clear electromagnetic explanation and correct shorting-link safety procedure.',
          polishedSampleAnswer:
            'With an open secondary, opposing demagnetizing flux vanishes, forcing full primary current into the magnetizing branch. Core saturation produces sharp flux reversals (dΦ/dt) and multi-kilovolt spikes that cause insulation breakdown or arc flash. Safe isolation requires engaging the dedicated CT shorting terminal block and verifying LOTO prior to detaching any relay lead.',
        },
        {
          questionNumber: 2,
          question:
            'In transformer differential protection (87T), why do we configure a percentage restraint (bias) slope instead of a flat pick-up threshold?',
          userAnswer:
            'Because CT ratio errors, tap-changer positions, and slight CT saturation during heavy external faults can create spill current even when there is no internal fault. A percentage bias slope scales the trip threshold up as through-current rises so the relay stays stable.',
          score: 82,
          feedback:
            'Good grasp of CT mismatch and external through-fault stability. Also mention second-harmonic restraint for magnetizing inrush.',
          polishedSampleAnswer:
            'A flat threshold would nuisance-trip during heavy external faults due to tap-changer mismatch and asymmetric CT saturation. Dual-slope percentage restraint increases required differential current proportionally with through-current, while 2nd-harmonic restraint blocks false trips during transformer energization inrush.',
        },
        {
          questionNumber: 3,
          question:
            'An industrial 11kV feeder shows low lagging power factor (0.74) with heavy VFD motor loads. What risk occurs if you install standard plain capacitor banks?',
          userAnswer:
            'Standard capacitors can interact with the system inductance and create harmonic resonance with the VFD harmonics, overheating the capacitors and distorting feeder voltage. We should check harmonic spectrum and install detuned capacitor banks with series reactors.',
          score: 76,
          feedback:
            'Correctly identified harmonic resonance and detuned reactors. Specify typical detuning frequencies (e.g., 189 Hz / 7% reactor for 5th harmonic mitigation).',
          polishedSampleAnswer:
            'Plain capacitor banks can form a parallel resonant circuit near the 5th or 7th harmonic generated by VFDs, amplifying harmonic currents and causing capacitor failure or breaker tripping. I would run an IEEE 519 harmonic audit and deploy detuned capacitor banks (e.g., 7% series reactors tuned to ~189 Hz) to eliminate resonance.',
        },
      ],
    },
    2
  ),

  // 4. Mechanical Engineering (Score: 79)
  buildDemoPreset(
    {
      config: {
        track: 'Mechanical Engineering',
        company: 'Engro Corporation',
        persona: 'stress_tester',
        mode: 'Mixed',
        languageMode: 'Corporate English',
        questionCount: 3,
        timerEnabled: true,
        jobDescription:
          'Graduate Mechanical Engineer (Rotating Equipment & Plant Reliability) — Centrifugal pumps, compressors, vibration diagnostics, thermodynamic cycles, and preventive maintenance.',
        resumeText:
          'B.E. Mechanical Engineering. Capstone: Waste-heat recovery Rankine cycle prototype for industrial exhaust. Maintenance intern on centrifugal pumps and heat exchangers.',
      },
      overallScore: 79,
      readinessLabel: 'Developing Readiness',
      executiveSummary:
        'Good fundamental engineering intuition on pump cavitation and shell-and-tube heat exchanger maintenance under stress-test questioning. To reach top readiness for Engro reliability panels, tighten answers with exact formulas (NPSHa vs NPSHr) and quantitative maintenance metrics.',
      clarityStructureScore: 76,
      technicalAlignmentScore: 81,
      confidenceScore: 80,
      industryAlignmentScore: 81,
      finalCheatSheet: [
        'Cavitation Equation: NPSHa = P_atm/ρg + H_static - H_friction - P_vapor/ρg; keep NPSHa >= NPSHr + 0.5–1.0m safety margin.',
        'Vibration Diagnostics: 1x RPM = unbalance; 2x RPM axial = misalignment; high-frequency bearing harmonics = outer/inner race wear.',
        'Permit-to-Work (PTW) & HSE: Always pair mechanical interventions with isolation, blinding/spading, and zero-energy verification.',
      ],
      skillBadges: [
        'Rotating Equipment Basics',
        'Calm Under Pressure',
        'Thermodynamic Reasoning',
      ],
      strengths: [
        'Remained composed during skeptical follow-ups and avoided bluffing when pressed on details.',
        'Identified suction line pressure drop and elevated fluid temperature as primary cavitation triggers.',
      ],
      improvements: [
        'State the explicit NPSHa equation terms rather than summarizing qualitatively.',
        'Use STAR framing when explaining field maintenance internships so your individual contribution stands out.',
      ],
      questionBreakdowns: [
        {
          questionNumber: 1,
          question:
            'A centrifugal boiler feed pump begins rattling like gravel inside the casing and discharge pressure drops 25%. Explain the root physics and three immediate checks you perform.',
          userAnswer:
            'That sounds like cavitation—local pressure at the impeller eye drops below the fluid vapor pressure, forming vapor bubbles that implode violently at higher pressure zones. I would check suction strainer blockage, liquid temperature rising too high, and suction tank level or valve partially closed.',
          score: 83,
          feedback:
            'Solid root physics and practical troubleshooting checks. Mentioning NPSHa < NPSHr margin and pitting damage on impeller vanes makes it stronger.',
          polishedSampleAnswer:
            'Those symptoms indicate cavitation: NPSHa has fallen below the pump’s NPSHr, allowing local pressure at the impeller eye to drop below vapor pressure so bubbles form and violently collapse, pitting the impeller. Immediately I would verify suction tank head, inspect suction strainers/valves for restriction, and check feedwater temperature.',
        },
        {
          questionNumber: 2,
          question:
            'Why do we typically prefer counter-flow over parallel-flow in industrial shell-and-tube heat exchangers, and what constraint forces a switch to multi-pass designs?',
          userAnswer:
            'Counter-flow maintains a more uniform temperature difference across the exchanger length, giving a higher Log Mean Temperature Difference (LMTD) and allowing the cold outlet to exceed the hot outlet temperature. Multi-pass tubes boost fluid velocity to raise convective heat transfer and reduce fouling.',
          score: 79,
          feedback:
            'Good LMTD comparison. Note the trade-off: multi-pass introduces correction factor F < 1 and higher tube-side pressure drop.',
          polishedSampleAnswer:
            'Counter-flow maximizes LMTD and enables temperature cross (cold outlet hotter than hot outlet), requiring less surface area for the same heat duty. Multi-pass arrangements increase tube-side Reynolds number and heat transfer coefficient while limiting shell length, balanced against higher pressure drop and an LMTD correction factor F < 1.',
        },
        {
          questionNumber: 3,
          question:
            'Describe a time when a mechanical test or lab setup failed unexpectedly before a deadline. What did you personally change?',
          userAnswer:
            'In our waste-heat recovery capstone, the brazed plate condenser leaked at 6 bar during hydrostatic testing. I stripped the joint, inspected gasket seating, discovered uneven torque sequence on the tie-rods, and implemented a cross-pattern torque procedure with pressure-hold logging.',
          score: 75,
          feedback:
            'Good hands-on ownership. Add the quantitative Result (e.g., passed 10-bar hydrotest with zero drop over 30 minutes and finished testing on schedule).',
          polishedSampleAnswer:
            'Situation: Two weeks before capstone defense, our condenser leaked at 6 bar during hydrotesting. Task: Identify the failure mode without missing our thermal validation window. Action: I traced uneven flange compression, drafted a staggered cross-pattern torque sequence with calibrated wrench steps, and replaced the seal. Result: Passed a 10-bar 30-minute hold test with zero pressure decay.',
        },
      ],
    },
    3
  ),

  // 5. Civil & Infrastructure Engineering (Score: 76)
  buildDemoPreset(
    {
      config: {
        track: 'Civil & Infrastructure Engineering',
        company: 'Lucky Cement',
        persona: 'friendly_hr',
        mode: 'Mixed',
        languageMode: 'Corporate English',
        questionCount: 3,
        timerEnabled: false,
        jobDescription:
          'Graduate Civil / Structural Site Engineer — Industrial foundation works, concrete mix QC, ACI/ASTM testing, batching plant coordination, and site safety.',
        resumeText:
          'B.E. Civil Engineering. Capstone: Performance evaluation of fly-ash and silica-fume blended high-strength concrete under sulfate exposure. Site intern on commercial foundation pouring.',
      },
      overallScore: 76,
      readinessLabel: 'Developing Readiness',
      executiveSummary:
        'Approachable communication style and relevant concrete materials background aligned with Lucky Cement technical services. Strengthening your recall of exact ASTM test tolerances, water-cement ratio limits, and site concrete rejection protocols will elevate your readiness.',
      clarityStructureScore: 78,
      technicalAlignmentScore: 74,
      confidenceScore: 77,
      industryAlignmentScore: 76,
      finalCheatSheet: [
        'Water-Cement Ratio (Abrams Law): Lowering w/c increases compressive strength and reduces permeability, provided full compaction is achieved.',
        'Field Concrete QC: Slump test (ASTM C143), temperature check (<32°C hot weather concreting), air content, and 7/28-day cylinder breaks (ASTM C39).',
        'Sulfate Attack Mitigation: Use Type V / sulfate-resistant cement or supplementary cementitious materials (fly ash / slag) to cut C3A and Ca(OH)2.',
      ],
      skillBadges: [
        'Concrete Materials Focus',
        'Clear Site Communication',
        'Growth Potential',
      ],
      strengths: [
        'Connected supplementary cementitious materials (silica fume & fly ash) clearly to durability against sulfate attack.',
        'Showed genuine respect for site safety and clear coordination with batching crews.',
      ],
      improvements: [
        'Cite exact ASTM standard names (ASTM C143 slump, C39 compression) and numerical curing thresholds.',
        'Elaborate on how you handle pushback from contractors when rejecting an out-of-spec transit mixer.',
      ],
      questionBreakdowns: [
        {
          questionNumber: 1,
          question:
            'A ready-mix concrete truck arrives on site during 40°C summer heat, and the measured slump is 40mm below specification. A foreman asks to add water on site. How do you respond?',
          userAnswer:
            'Adding unmeasured water on site increases the water-cement ratio, which permanently reduces 28-day compressive strength and increases shrinkage cracking. Instead, we check the batch ticket for allowed water trim or dose a calibrated superplasticizer if permitted by the mix design, or reject the load.',
          score: 80,
          feedback:
            'Good adherence to quality control and superplasticizer alternative. Mention ASTM C94 transit time/drum revolution limits as well.',
          polishedSampleAnswer:
            'I would firmly decline arbitrary water addition because raising the water-cement ratio degrades compressive strength and durability. I would check the batch ticket (time elapsed and remaining water allowance per ASTM C94), verify concrete temperature, and either dose an approved high-range water reducer under engineer sign-off or reject the truck.',
        },
        {
          questionNumber: 2,
          question:
            'How does incorporating silica fume and fly ash improve concrete durability for coastal or industrial chemical foundations?',
          userAnswer:
            'They react pozzolanically with calcium hydroxide released during cement hydration to form extra C-S-H gel. That fills capillary pores, reduces permeability against chloride and sulfate ingress, and lowers heat of hydration in thick pours.',
          score: 77,
          feedback:
            'Accurate pozzolanic mechanism! Add that early curing discipline is critical since blended mixes gain strength slightly slower at 7 days.',
          polishedSampleAnswer:
            'Fly ash and silica fume undergo pozzolanic reaction with free Ca(OH)2 to generate secondary C-S-H gel, refining pore structure and drastically cutting permeability to sulfates and chlorides. Additionally, fly ash lowers peak hydration temperature in mass foundations—though strict early moist curing is essential to prevent plastic shrinkage.',
        },
        {
          questionNumber: 3,
          question:
            'Tell me about a time you coordinated across a team under tight deadlines during your site internship or capstone.',
          userAnswer:
            'During concrete cylinder casting for 36 test specimens, two teammates had scheduling conflicts. I created a clear labeling matrix and batching checklist the night before so the remaining group cast and cured every specimen without mixing up batch IDs.',
          score: 71,
          feedback:
            'Nice initiative, but brief. Expand using STAR to explain how many mixes were tracked and the zero-error outcome at 28-day testing.',
          polishedSampleAnswer:
            'Situation: On casting day for 36 sulfate-exposure cylinders across four mix designs, two lab partners had exam conflicts. Task: Prevent sample mislabeling during rapid batching. Action: I built a color-coded mold matrix and pre-weighed admixture kits the night before. Result: All 36 cylinders were cast, demolded, and cured on time with 100% traceability through 28-day ASTM C39 breaks.',
        },
      ],
    },
    4
  ),

  // 6. Chemical & Process Engineering (Score: 88)
  buildDemoPreset(
    {
      config: {
        track: 'Chemical & Process Engineering',
        company: 'Fatima Group',
        persona: 'strict_tech_lead',
        mode: 'Technical',
        languageMode: 'Corporate English',
        questionCount: 3,
        timerEnabled: true,
        jobDescription:
          'Trainee Chemical / Process Engineer — Ammonia/urea process optimization, distillation & absorption columns, HAZOP safety reviews, and Aspen HYSYS simulation.',
        resumeText:
          'B.E. Chemical Engineering. Capstone: Aspen Plus & HYSYS optimization of CO2 capture amine absorber column reducing reboiler steam duty by 14%. Intern at process plant.',
      },
      overallScore: 88,
      readinessLabel: 'Strong Hire Potential',
      executiveSummary:
        'Strong process engineering fundamentals across distillation flooding, HAZOP guidewords, and energy integration directly applicable to Fatima Group fertilizer units. Including specific safety integrity level (SIL) or relief valve sizing references will round out your profile.',
      clarityStructureScore: 87,
      technicalAlignmentScore: 90,
      confidenceScore: 86,
      industryAlignmentScore: 89,
      finalCheatSheet: [
        'Distillation Flooding vs Weeping: Monitor tray ΔP and overhead product purity; reduce boil-up or feed rate when approaching jet/downcomer flooding.',
        'HAZOP Methodology: Pair process parameters (Flow, Pressure, Temperature) with guidewords (No, More, Less, Reverse) to identify safeguards and LOPA layers.',
        'Heat Integration (Pinch Analysis): Never transfer heat across the thermodynamic pinch point; match hot/cold streams within ΔT_min.',
      ],
      skillBadges: [
        'Process Simulation & Energy',
        'HAZOP Safety Mindset',
        'Mass Transfer Depth',
      ],
      strengths: [
        'Distinguished downcomer flooding from weeping clearly using tray ΔP signatures.',
        'Applied structured HAZOP guidewords accurately to an exothermic reactor cooling failure scenario.',
      ],
      improvements: [
        'Quantify economic impact in your Aspen capstone (e.g., annual MMBtu steam savings alongside 14% duty cut).',
        'Mention PSV (Pressure Safety Valve) set-pressure margin relative to MAWP during overpressure protection.',
      ],
      questionBreakdowns: [
        {
          questionNumber: 1,
          question:
            'In a packed or trayed distillation column, how do plant DCS trends distinguish between tray flooding and weeping, and what control action restores stability?',
          userAnswer:
            'Flooding shows a sharp spike in column differential pressure (ΔP), erratic bottom level, and loss of overhead purity as liquid entrains upward. Weeping shows abnormally low ΔP and poor separation efficiency because vapor velocity is too low to hold liquid on trays. For flooding, we immediately cut reboiler steam duty and verify feed preheat.',
          score: 90,
          feedback:
            'Spot-on operational diagnosis linking DCS ΔP and level trends directly to hydraulics.',
          polishedSampleAnswer:
            'Flooding manifests as rapidly rising tray ΔP, dropping bottoms level (liquid holdup in the column), and heavy-key carryover overhead; weeping exhibits abnormally low ΔP and degraded tray efficiency from liquid bypassing down through perforations. To arrest flooding, I step down reboiler duty/reflux ratio and inspect for fouled downcomers or foaming.',
        },
        {
          questionNumber: 2,
          question:
            'Walk through how you would apply HAZOP guidewords if cooling water flow is lost to an exothermic jacketed reactor.',
          userAnswer:
            'Parameter is Cooling Water Flow, Guideword is NO/LESS Flow. Cause could be pump trip or closed isolation valve. Consequence is uncontrolled temperature rise leading to thermal runaway and overpressure. Safeguards include high-temperature alarm, automatic interlock shutting reactant feed, and an adequately sized PSV.',
          score: 89,
          feedback:
            'Well-structured HAZOP sequence (Deviation -> Cause -> Consequence -> Safeguards). Mentioning independent protection layers (IPLs) adds polish.',
          polishedSampleAnswer:
            'Using Deviation "NO/LESS Cooling Water Flow": Potential causes include cooling pump trip or failed-closed control valve. Consequence is adiabatic temperature runaway and vessel overpressure. Safeguards follow LOPA layers: DCS high-temperature/low-flow alarms, an independent SIL-rated SIS trip stopping reactant feed, and a two-phase relief PSV routed to flare/scrubber.',
        },
        {
          questionNumber: 3,
          question:
            'In your CO2 amine absorber simulation, what trade-off did you balance between lean amine circulation rate and reboiler steam consumption?',
          userAnswer:
            'Higher amine circulation improves CO2 absorption driving force and lowers absorber height, but increases sensible heat and stripping steam load in the regenerator. We ran sensitivity sweeps in HYSYS on rich loading and lean temperature approach to cut steam duty by 14% while staying below corrosion velocity limits.',
          score: 85,
          feedback:
            'Great coupling of mass transfer driving force with downstream reboiler economics and corrosion limits.',
          polishedSampleAnswer:
            'Increasing lean amine circulation lowers absorber stage count, yet penalizes regenerator reboiler duty via sensible heating and pumping power. By running sensitivity curves in Aspen HYSYS targeting optimal rich loading (~0.42 mol CO2/mol amine) and heat-exchanger pinch recovery, we reduced reboiler steam by 14% without exceeding amine corrosion limits.',
        },
      ],
    },
    5
  ),

  // 7. Industrial & Manufacturing Engineering (Score: 84, Hinglish / Roman Urdu Comfort Mode)
  buildDemoPreset(
    {
      config: {
        track: 'Industrial & Manufacturing Engineering',
        company: 'Indus Motor Company (Toyota)',
        persona: 'strict_tech_lead',
        mode: 'Mixed',
        languageMode: 'Hinglish / Roman Urdu Comfort Mode',
        questionCount: 3,
        timerEnabled: true,
        jobDescription:
          'Graduate Industrial Engineer (TPS & Production Planning) — Line balancing, Takt time vs Cycle time, SMED changeover reduction, 5S/Kaizen, and OEE improvement.',
        resumeText:
          'B.E. Industrial & Manufacturing Engineering. Capstone: Cycle-time balancing and SMED fixture redesign on an automotive sub-assembly line reducing bottleneck delay by 18%.',
      },
      overallScore: 84,
      readinessLabel: 'Interview Ready',
      executiveSummary:
        'Strong practical grasp of Toyota Production System (TPS) pillars, line balancing, and OEE loss decomposition. Comfort-mode explanations translated cleanly into disciplined manufacturing terminology; tightening OEE numerical examples will elevate executive polish.',
      clarityStructureScore: 82,
      technicalAlignmentScore: 86,
      confidenceScore: 85,
      industryAlignmentScore: 87,
      finalCheatSheet: [
        'Takt vs Cycle Time: Takt = Available Production Time / Customer Demand; every station cycle time must sit <= Takt without overburden (Muri).',
        'OEE Formula: Availability x Performance x Quality (World-Class benchmark ~85%).',
        'SMED Method: Convert Internal setup steps (machine stopped) into External steps (prepared while running) before streamlining clamps.',
      ],
      skillBadges: [
        'TPS & Kaizen Mindset',
        'Bottleneck Diagnostics',
        'SMED Optimization',
      ],
      strengths: [
        'Separated internal vs external changeover tasks cleanly when explaining SMED setup reduction.',
        'Used root-cause 5-Why logic before proposing automation or headcount additions.',
      ],
      improvements: [
        'Always express OEE gains by breaking down which component moved (Availability, Performance, or Quality).',
        'Practice delivering TPS terminology crisply in English for cross-functional plant reviews.',
      ],
      questionBreakdowns: [
        {
          questionNumber: 1,
          question:
            'Explain the difference between Takt Time and Cycle Time on an assembly line, and what happens if Workstation 4 exceeds Takt Time by 8 seconds.',
          userAnswer:
            'Takt time customer demand se calculate hota hai—available shift time divided by required units—aur cycle time actual time hai jo ek station ko kaam complete karne mein lagta hai. Agar Station 4 takt time se 8 seconds zyada le raha hai toh woh bottleneck ban jayega, upstream WIP pile up hoga aur shift target miss hoga.',
          englishTranslation:
            'Takt time is driven by customer demand—available shift time divided by required units—whereas cycle time is the actual time a station takes to finish its operation. If Station 4 exceeds takt time by 8 seconds, it becomes the line bottleneck, building upstream WIP and causing missed shift targets.',
          score: 86,
          feedback:
            'Accurate distinction and clear identification of WIP buildup and missed takt.',
          polishedSampleAnswer:
            'Takt time sets the customer-demand drumbeat (Available Time / Demand), while Cycle Time is a station’s observed execution time. If Station 4 runs 8 seconds above takt, it starves downstream stations, accumulates upstream WIP, and forces overtime or missed volume—requiring motion study (Yamazumi chart) to rebalance non-value-added steps.',
        },
        {
          questionNumber: 2,
          question:
            'How would you apply SMED (Single-Minute Exchange of Die) to cut a 45-minute stamping press changeover down below 15 minutes?',
          userAnswer:
            'Sab se pehle video time study karke internal aur external activities alag karunga. Jo kaam machine chalte waqt ho sakte hain—jaise next die pre-heating, tool trolley staging, aur bolts check karna—unhe external kar dunga. Phir internal clamping ko quick-release hydraulic clamps aur standardized locating pins se fast karunga.',
          englishTranslation:
            'First, I would film the changeover to separate internal and external activities. Tasks possible while the press runs—such as pre-heating the next die, staging tool trolleys, and verifying bolts—move externally. Then I convert internal fastening to quick-release clamps and standardized locating pins.',
          score: 85,
          feedback:
            'Textbook TPS SMED execution! Mentioning parallel two-operator choreography further compresses internal time.',
          polishedSampleAnswer:
            'I start by videotaping the changeover to classify Internal (machine stopped) vs. External (machine running) elements. Moving die pre-staging, gauge checks, and kitting to External typically cuts 40% immediately; next, I eliminate bolt adjustments via standardized die heights, zero-point locating pins, and parallel operator standard work.',
        },
        {
          questionNumber: 3,
          question:
            'Your assembly cell reports 68% OEE despite zero major machine breakdowns. Where do you investigate first?',
          userAnswer:
            'Agar major breakdowns zero hain toh Availability high hogi, matlab loss Performance (micro-stoppages, slow cycle speed) ya Quality (rework aur scrap) mein chhupa hai. Main Pareto chart banaunga minor stops aur defect codes ka taake top 20% chronic losses pakar sakein.',
          englishTranslation:
            'If major breakdowns are zero, Availability is likely healthy, meaning the OEE loss hides inside Performance (micro-stoppages, reduced speed) or Quality (rework and scrap). I would build a Pareto chart of minor stops and defect codes to isolate the top 20% chronic losses.',
          score: 81,
          feedback:
            'Smart OEE decomposition! Also verify planned downtime / changeover minutes inside Availability.',
          polishedSampleAnswer:
            'Because OEE = Availability x Performance x Quality, low OEE without major breakdowns points toward setup losses in Availability, micro-stoppages/speed drops in Performance, or first-pass yield defects in Quality. I would pull line-side Andon logs and run a Pareto analysis on micro-stops and rework modes before launching a focused Kaizen.',
        },
      ],
    },
    6
  ),

  // 8. Telecommunications Engineering (Score: 85)
  buildDemoPreset(
    {
      config: {
        track: 'Telecommunications Engineering',
        company: 'Jazz',
        persona: 'friendly_hr',
        mode: 'Mixed',
        languageMode: 'Corporate English',
        questionCount: 3,
        timerEnabled: true,
        jobDescription:
          'Trainee RF & Core Network Engineer — 4G LTE / 5G NR optimization, RSRP/SINR KPI troubleshooting, IP/MPLS backhaul, and cross-functional service reliability.',
        resumeText:
          'B.E. Telecommunications Engineering. Capstone: Urban 5G beamforming & handover optimization simulation in MATLAB. Intern in RAN optimization team analyzing drive-test logs.',
      },
      overallScore: 85,
      readinessLabel: 'Interview Ready',
      executiveSummary:
        'Well-rounded blend of RF KPI diagnostic skills and collaborative customer-centric mindset fitting Jazz network teams. Deepening your knowledge of 5G NSA vs SA core architectures and microwave/fiber backhaul SLA metrics will make your answers even sharper.',
      clarityStructureScore: 86,
      technicalAlignmentScore: 84,
      confidenceScore: 86,
      industryAlignmentScore: 85,
      finalCheatSheet: [
        'LTE RF KPIs: Distinguish RSRP (coverage strength), RSRQ (quality under load), and SINR (interference-to-noise ratio controlling MCS/throughput).',
        'Pilot Pollution / Overshooting: Fix strong RSRP + poor SINR via electrical downtilt adjustment, PCI planning, and neighbor list cleanup.',
        'Backhaul Bottlenecks: Verify PRB utilization vs S1/NG backhaul packet loss or jitter before blaming radio.',
      ],
      skillBadges: [
        'RF KPI Diagnostics',
        'LTE/5G Optimization',
        'Clear Communicator',
      ],
      strengths: [
        'Diagnosed high-RSRP / low-SINR coverage overlap cleanly during urban sector troubleshooting.',
        'Demonstrated strong teamwork and communication clarity in describing drive-test coordination.',
      ],
      improvements: [
        'Include specific parameter names such as A3 handover offset, Time-to-Trigger (TTT), and CQI mapping.',
        'Tie network fixes directly to end-user NPS / VoLTE drop-call rate improvements.',
      ],
      questionBreakdowns: [
        {
          questionNumber: 1,
          question:
            'Drive-test logs on an urban LTE sector show strong RSRP (-78 dBm) yet terrible SINR (-2 dB) and low user throughput. What is happening and how do you fix it?',
          userAnswer:
            'Strong RSRP with poor SINR means the user receives a strong serving signal, but neighboring cells are causing heavy co-channel interference or pilot pollution—often from an overshooting site. I would inspect timing advance plots, adjust antenna electrical downtilt on the overshooter, and check for PCI mod-3 conflicts.',
          score: 88,
          feedback:
            'Accurate RF diagnosis naming overshooting, electrical downtilt, and PCI mod-3 interference.',
          polishedSampleAnswer:
            'This classic signature indicates co-channel interference or pilot pollution from overlapping cells. I would review Timing Advance distribution to spot overshooting sectors, increase electrical downtilt or reduce reference-signal power on interfering neighbors, and audit PCI mod-3/mod-6 collisions to raise SINR and CQI.',
        },
        {
          questionNumber: 2,
          question:
            'How do you reduce ping-pong handovers along a busy highway corridor without causing late-handover call drops?',
          userAnswer:
            'Ping-pong happens when A3 hysteresis is too small or Time-to-Trigger (TTT) is too short. We slightly increase hysteresis or TTT so the UE waits for stable signal dominance, while carefully testing drive logs so faster-moving highway vehicles still hand over before losing RSRP.',
          score: 84,
          feedback:
            'Good balance between hysteresis/TTT tuning and mobility speed constraints.',
          polishedSampleAnswer:
            'I tune the Event A3 Cell Individual Offset, hysteresis margin, and Time-to-Trigger (TTT) based on vehicle speed distribution. Increasing TTT/hysteresis suppresses transient ping-pong, while speed-dependent scaling prevents Radio Link Failures (RLF) for high-speed highway traffic.',
        },
        {
          questionNumber: 3,
          question:
            'Tell me about a time you had to explain complex technical findings to a non-technical stakeholder or field crew.',
          userAnswer:
            'During my internship, site technicians wanted to replace hardware on a slow sector. I translated the PRB utilization and backhaul latency graphs into a simple one-page visual showing congestion came from a misconfigured microwave link rather than the RRU, saving unnecessary tower climbs.',
          score: 83,
          feedback:
            'Great practical STAR example showing business impact and clear cross-team translation.',
          polishedSampleAnswer:
            'Situation: Field crews planned an urgent RRU hardware swap on a degraded cell. Task: Prevent an unnecessary tower outage by showing the fault was transport-side. Action: I turned raw PRB and S1 packet-loss logs into a 3-bullet visual comparing radio vs microwave throughput. Result: We re-routed microwave capacity remotely in 20 minutes and avoided a 4-hour site downtime.',
        },
      ],
    },
    7
  ),

  // 9. Mechatronics & Robotics (Score: 94)
  buildDemoPreset(
    {
      config: {
        track: 'Mechatronics & Robotics',
        company: 'Motive',
        persona: 'strict_tech_lead',
        mode: 'Technical',
        languageMode: 'Corporate English',
        questionCount: 3,
        timerEnabled: true,
        jobDescription:
          'Embedded & Robotics Engineer — Sensor fusion (IMU/GNSS/Camera), ROS 2 real-time control loops, PID/EKF state estimation, and edge AI telemetry.',
        resumeText:
          'B.E. Mechatronics Engineering. Capstone: Autonomous warehouse AMR using ROS 2, Extended Kalman Filter (IMU + wheel encoders + LiDAR), and STM32 FOC motor controllers.',
      },
      overallScore: 94,
      readinessLabel: 'Exceptional Hire',
      executiveSummary:
        'Outstanding systems-level mastery bridging embedded RTOS deterministic timing, Extended Kalman Filter sensor fusion, and anti-windup PID control. Your engineering precision and quantifiable validation results align directly with Motive IoT and edge-robotics standards.',
      clarityStructureScore: 93,
      technicalAlignmentScore: 95,
      confidenceScore: 94,
      industryAlignmentScore: 94,
      finalCheatSheet: [
        'EKF Sensor Fusion: Separate high-rate IMU prediction (100–200 Hz) from lower-rate LiDAR/GPS measurement updates with Mahalanobis outlier gating.',
        'PID Integrity: Always implement derivative-on-measurement (avoids derivative kick) and conditional integration / back-calculation anti-windup.',
        'Embedded RTOS Determinism: Keep ISRs tiny (defer parsing via DMA + ring buffers to high-priority RTOS tasks; never allocate heap dynamically in control loops).',
      ],
      skillBadges: [
        'Embedded & RTOS Mastery',
        'Sensor Fusion Architecture',
        'Control Systems Precision',
      ],
      strengths: [
        'Articulated exact EKF predict/update covariance mechanics and outlier gating for wheel slip.',
        'Demonstrated disciplined real-time firmware habits (DMA, lock-free ring buffers, anti-windup PID).',
        'Backed claims with quantitative closed-loop overshoot and RMS localization accuracy numbers.',
      ],
      improvements: [
        'Keep concise pacing during deep architectural answers so panel follow-ups fit comfortably inside timeboxes.',
      ],
      questionBreakdowns: [
        {
          questionNumber: 1,
          question:
            'In your warehouse AMR using an Extended Kalman Filter, how do you fuse high-rate IMU data with noisy wheel encoders during wheel slip on wet floors?',
          userAnswer:
            'During slip, wheel odometry over-reports distance while the accelerometer/gyro reflects true inertia. In our EKF, we tune the process/measurement noise covariance Q and R dynamically and apply Mahalanobis distance gating on encoder innovation residuals—so if slip spikes the residual beyond a 3-sigma chi-squared threshold, we downweight odometry and trust IMU + LiDAR scan matching.',
          score: 95,
          feedback:
            'World-class answer! Dynamic covariance scaling plus chi-squared innovation gating is production robotics best practice.',
          polishedSampleAnswer:
            'I decouple prediction at 200 Hz via IMU integration from asynchronous measurement updates (wheel encoders and 20 Hz LiDAR odometry). To survive wheel slip, we monitor the innovation covariance and apply Mahalanobis chi-squared gating—rejecting or inflating R on encoder measurements when yaw-rate or linear acceleration diverges from gyro predictions.',
        },
        {
          questionNumber: 2,
          question:
            'Your STM32 motor PID controller exhibits huge overshoot after the robot hits an obstacle and clears it. What control flaw caused this and how do you fix it?',
          userAnswer:
            'That is classic integral windup—while stalled against the obstacle, error persisted and the integral term accumulated massively until actuator saturation cleared. Fix is clamping the integrator or using back-calculation anti-windup, plus taking derivative on measurement rather than error to avoid derivative kick on setpoint steps.',
          score: 94,
          feedback:
            'Pinpoint diagnosis and clean dual fix (back-calculation anti-windup + derivative-on-measurement).',
          polishedSampleAnswer:
            'Obstacle stall causes actuator saturation while the integral accumulator keeps winding up, releasing massive stored energy once freed. I implement conditional integration or back-calculation anti-windup proportional to (u_saturated - u_raw), paired with derivative-on-measurement and a low-pass filter on the D-term.',
        },
        {
          questionNumber: 3,
          question:
            'How do you architect UART/CAN telemetry parsing on an embedded microcontroller so heavy sensor bursts never jitter a 1 kHz motor control loop?',
          userAnswer:
            'Never parse inside ISRs or run malloc in the loop. We configure circular DMA into a static double/ring buffer, raise a lightweight FreeRTOS task notification on frame completion, and pin the 1 kHz motor FOC control loop at the highest RTOS priority with deterministic fixed-point or FPU timing.',
          score: 93,
          feedback:
            'Textbook real-time embedded architecture—DMA + zero-allocation buffers + strict priority separation.',
          polishedSampleAnswer:
            'I offload byte reception entirely to peripheral DMA writing into a static lock-free ring buffer. Only the deterministic 1 kHz control task runs at highest RTOS priority with zero heap allocation, while a lower-priority communications task frames and forwards telemetry packets when CPU headroom permits.',
        },
      ],
    },
    8
  ),

  // 10. Biomedical Engineering (Score: 81)
  buildDemoPreset(
    {
      config: {
        track: 'Biomedical Engineering',
        company: 'Siemens',
        persona: 'friendly_hr',
        mode: 'Mixed',
        languageMode: 'Corporate English',
        questionCount: 3,
        timerEnabled: false,
        jobDescription:
          'Clinical Systems & Medical Device Engineer — Bio-signal acquisition (ECG/EMG), IEC 60601 electrical safety, hospital equipment calibration, and regulatory compliance.',
        resumeText:
          'B.E. Biomedical Engineering. Capstone: Portable 3-lead ECG front-end with right-leg drive interference rejection and arrhythmia alert. Clinical engineering intern at tertiary hospital.',
      },
      overallScore: 81,
      readinessLabel: 'Interview Ready',
      executiveSummary:
        'Strong empathy for patient safety paired with solid instrumentation fundamentals (CMRR, notch vs right-leg drive, and IEC 60601 leakage limits). Sharpening quantitative regulatory knowledge (ISO 13485 traceability & Risk Management ISO 14971) will differentiate you for Siemens Healthineers roles.',
      clarityStructureScore: 83,
      technicalAlignmentScore: 80,
      confidenceScore: 81,
      industryAlignmentScore: 82,
      finalCheatSheet: [
        'ECG Signal Conditioning: Use high-CMRR instrumentation amplifier (>100 dB) + Driven Right Leg (DRL) + high-pass baseline wander removal (0.05–0.5 Hz).',
        'IEC 60601 Patient Safety: Distinguish Type BF/CF applied parts; Type CF (cardiac floating) restricts patient leakage current to <= 10 µA normal condition.',
        'Medical Quality Systems: ISO 13485 (QMS & Design History File) + ISO 14971 (Risk Management FMEA).',
      ],
      skillBadges: [
        'Patient Safety First',
        'Bio-Signal Conditioning',
        'Clinical Collaboration',
      ],
      strengths: [
        'Explained why 50/60 Hz notch filters must not distort QRS complex morphology without careful Q-factor selection.',
        'Showed patient-first composure when describing hospital ICU equipment triage.',
      ],
      improvements: [
        'Memorize exact IEC 60601-1 patient auxiliary/leakage current thresholds for Type BF vs CF.',
        'Highlight ISO 14971 FMEA risk mitigation in your capstone design choices.',
      ],
      questionBreakdowns: [
        {
          questionNumber: 1,
          question:
            'In your 3-lead ECG front-end, why is high Common-Mode Rejection Ratio (CMRR) plus a Driven Right Leg (DRL) circuit preferable to relying solely on an aggressive 50Hz analog notch filter?',
          userAnswer:
            'Mains 50Hz noise couples strongly into the body as a common-mode signal. An instrumentation amp with high CMRR and a Driven Right Leg feedback loop cancels that interference at the source without distorting diagnostic ECG components near 50Hz, whereas overly wide notch filters can ring or attenuate sharp QRS peaks.',
          score: 84,
          feedback:
            'Great instrumentation reasoning balancing interference cancellation against diagnostic waveform fidelity.',
          polishedSampleAnswer:
            'Because diagnostic ECG bandwidth spans 0.05–150 Hz, an aggressive analog notch filter introduces phase distortion and ringing on sharp R-waves. Combining an instrumentation amplifier (>100 dB CMRR) with a Driven Right Leg (DRL) active feedback loop suppresses 50/60 Hz common-mode pickup safely prior to digitization.',
        },
        {
          questionNumber: 2,
          question:
            'What is the difference between Type BF and Type CF medical electrical applied parts under IEC 60601-1, and why does isolation barrier design matter?',
          userAnswer:
            'Both are floating (isolated) applied parts, but Type CF is rated for direct cardiac connection like defibrillators or invasive catheters, so its allowable patient leakage current is much stricter—around 10 microamps normal condition—to avoid microshock ventricular fibrillation.',
          score: 80,
          feedback:
            'Accurate microshock rationale and 10 µA Type CF limit! Mention galvanic isolation (optocouplers / isolated DC-DC converters) for implementation.',
          polishedSampleAnswer:
            'While both BF (Body Floating) and CF (Cardiac Floating) isolate the patient from earth, Type CF applies to direct cardiac contact where microamp currents can trigger ventricular fibrillation—capping normal patient leakage at 10 µA (vs. 100 µA for BF). Achieving this requires reinforced galvanic isolation barriers across power and signal lines.',
        },
        {
          questionNumber: 3,
          question:
            'During your hospital clinical engineering internship, how did you prioritize when two ICU monitors flagged calibration drift simultaneously?',
          userAnswer:
            'I checked with the charge nurse first on patient acuity, moved a verified backup monitor to the higher-acuity bed within 5 minutes so care never paused, then ran simulator verification on the drifting units offline and logged both in the CMMS.',
          score: 79,
          feedback:
            'Practical clinical triage and zero disruption to patient care. Add exact preventive maintenance tag/checklist follow-through.',
          polishedSampleAnswer:
            'Situation: Two ICU bedside monitors showed SpO2/NIBP drift during morning rounds. Action: I coordinated immediately with the charge nurse, swapped in calibrated standby units from biomedical storage within 4 minutes, then tested both suspect monitors on a Fluke patient simulator and logged corrective PM records in the CMMS.',
        },
      ],
    },
    9
  ),

  // 11. Textile & Materials Engineering (Score: 74, Hinglish / Roman Urdu Comfort Mode)
  buildDemoPreset(
    {
      config: {
        track: 'Textile & Materials Engineering',
        company: 'Packages Limited',
        persona: 'stress_tester',
        mode: 'Mixed',
        languageMode: 'Hinglish / Roman Urdu Comfort Mode',
        questionCount: 3,
        timerEnabled: true,
        jobDescription:
          'Graduate Quality & Materials Engineer — Polymer/paper/textile tensile testing, GSM & moisture control, dye/ink shade consistency, and Six Sigma defect reduction.',
        resumeText:
          'B.E. Textile & Materials Engineering. Capstone: Recycled cellulose-polymer composite film barrier optimization. Intern in textile QA lab running Martindale and tensile tests.',
      },
      overallScore: 74,
      readinessLabel: 'Developing Readiness',
      executiveSummary:
        'Good hands-on familiarity with lab testing instruments and practical root-cause curiosity under high-pressure questioning. To reach 85+ readiness, strengthen statistical process control metrics (Cpk / standard deviation) and frame quality troubleshooting with clearer structured steps.',
      clarityStructureScore: 72,
      technicalAlignmentScore: 75,
      confidenceScore: 76,
      industryAlignmentScore: 74,
      finalCheatSheet: [
        'Process Capability (Cp vs Cpk): Cp measures spread vs tolerance width; Cpk captures centering—target Cpk >= 1.33 for industrial QA.',
        'Spectrophotometer Color QC: Control Delta-E (ΔE <= 1.0) under D65 illuminant; check metamerism under TL84/store lighting.',
        'ASTM / ISO Conditioning: Always condition hygroscopic textile/paper samples at 21±1°C and 65±2% RH (ASTM D1776) before tensile/GSM testing.',
      ],
      skillBadges: [
        'Lab Testing Hands-On',
        'Comfort Mode Resilience',
        'Defect Investigation',
      ],
      strengths: [
        'Correctly flagged ambient relative humidity conditioning before running tensile and GSM tests.',
        'Identified spectrophotometer ΔE checks and standard illuminants during shade variation probing.',
      ],
      improvements: [
        'Learn exact ASTM D1776 conditioning tolerances (65% RH, 21°C) and Cpk capability targets.',
        'Structure responses clearly: Root Cause -> Lab Verification -> Corrective Preventive Action (CAPA).',
        'Avoid overly brief answers on quantitative statistical quality control questions.',
      ],
      questionBreakdowns: [
        {
          questionNumber: 1,
          question:
            'If a production batch fails tensile strength in the afternoon shift despite using the exact same raw resin/fiber lot as the morning shift, what environmental or machine factors do you audit first?',
          userAnswer:
            'Sab se pehle lab conditioning check karunga kyunki cotton aur cellulose materials mein humidity change hone se tensile strength aur GSM vary karta hai. Phir extrusion ya tension rollers ka temperature profile aur nip pressure check karunga ke afternoon shift mein overheating ya improper stretching toh nahi hui.',
          englishTranslation:
            'First, I would verify lab humidity conditioning because moisture shifts alter tensile strength and GSM in cellulose/textile materials. Then I would audit line temperature profiles and nip roller tension to check for afternoon overheating or draw-ratio drift.',
          score: 77,
          feedback:
            'Good practical check on conditioning and draw tension! Mentioning ASTM D1776 standard atmosphere (21°C, 65% RH) sharpens authority.',
          polishedSampleAnswer:
            'First, I confirm test specimens were conditioned to ASTM D1776 (21±1°C, 65±2% RH) because hygroscopic shifts skew tensile readings. On the line, I audit nip roller pressure, draw-ratio tension, and barrel/dryer zone temperature logs across shifts, then measure Cpk to isolate machine drift.',
        },
        {
          questionNumber: 2,
          question:
            'A buyer rejects a dyed/printed shipment citing shade variation under showroom LED lighting even though it passed daylight inspection. Explain the phenomenon and your QA check.',
          userAnswer:
            'Isko metamerism kehte hain—do samples ek light source (D65 daylight) mein same lagte hain lekin doosre light source (TL84 ya LED) mein alag shade dikhate hain. QA lab mein hum spectrophotometer se multiple illuminants par Delta-E check karte hain aur dye/ink formulation adjust karte hain.',
          englishTranslation:
            'This is metamerism—two samples match under one illuminant (D65 daylight) yet diverge under another (TL84 or LED). In QA, we measure Delta-E on a spectrophotometer across multiple illuminants and adjust pigment/dye recipes.',
          score: 76,
          feedback:
            'Correct diagnosis of metamerism and ΔE! Specify typical commercial acceptance thresholds (ΔE_cmc <= 1.0) to show lab rigor.',
          polishedSampleAnswer:
            'That is metamerism, caused by different spectral reflectance curves matching only under D65 daylight. I implement multi-illuminant spectrophotometer checks (D65, TL84, UV/LED) enforcing ΔE_cmc <= 1.0 across all buyer-specified light boxes before bulk release.',
        },
        {
          questionNumber: 3,
          question:
            'How do you decide whether a process is merely "within spec" versus statistically capable for zero-defect export production?',
          userAnswer:
            'Hum average aur standard deviation check karte hain. Agar variation zyada ho toh tolerances ke andar bhi rejects aa sakte hain, isliye Cpk calculate karke dekhte hain ke process centered hai ya nahi.',
          englishTranslation:
            'We check mean and standard deviation. Even if points sit near tolerances, high variation causes rejects, so we calculate Cpk to verify whether the process is centered.',
          score: 69,
          feedback:
            'Right direction with Cpk, though too brief for a Stress Tester panel. State Cp vs Cpk formulas and the 1.33 industry benchmark.',
          polishedSampleAnswer:
            'Spec limits alone ignore distribution spread and centering. I track SPC X-bar/R charts and compute Cp (potential spread) alongside Cpk (actual centering against nearest spec limit). Export-grade lines require Cpk >= 1.33 (4-sigma); anything below 1.0 demands DOE parameter tightening before scaling.',
        },
      ],
    },
    10
  ),

  // 12. Petroleum & Gas Engineering (Score: 89)
  buildDemoPreset(
    {
      config: {
        track: 'Petroleum & Gas Engineering',
        company: 'Schlumberger (SLB)',
        persona: 'stress_tester',
        mode: 'Technical',
        languageMode: 'Corporate English',
        questionCount: 3,
        timerEnabled: true,
        jobDescription:
          'Field Engineer Trainee (Well Construction / Reservoir) — Drilling mud hydraulics, well control (kick detection & kill sheets), Darcy flow, and remote HSSE leadership.',
        resumeText:
          'B.E. Petroleum Engineering. Capstone: Reservoir simulation & EOR polymer flooding optimization in Eclipse/CMG. PetroBowl team lead & wireline logging workshop.',
      },
      overallScore: 89,
      readinessLabel: 'Strong Hire Potential',
      executiveSummary:
        'Crisp, disciplined field-engineering answers on primary well control, mud-weight margin calculations, and skin-factor diagnostics under stress-tester scrutiny. Adding brief remarks on fatigue management and stop-work authority at remote rig sites will further impress SLB recruiters.',
      clarityStructureScore: 88,
      technicalAlignmentScore: 91,
      confidenceScore: 89,
      industryAlignmentScore: 90,
      finalCheatSheet: [
        'Primary vs Secondary Well Control: Maintain Hydrostatic Pressure (0.052 x MW_ppg x TVD_ft) between Pore Pressure and Fracture Gradient.',
        'Kick Indicators: Pit volume gain, flow-rate increase with pumps off, drilling break, and gas-cut mud—shut in immediately via BOP.',
        'Driller Method vs Wait-and-Weight: Driller circulates kick out in 2 circulations (simpler, fast start); Wait-and-Weight kills in 1 circulation with lower casing shoe pressure.',
      ],
      skillBadges: [
        'Well Control Precision',
        'Reservoir Diagnostics',
        'Composure Under Pressure',
      ],
      strengths: [
        'Recalled the exact hydrostatic pressure constant (0.052 * MW * TVD) and fracture gradient window limits effortlessly.',
        'Compared Driller’s vs Wait-and-Weight kill methods accurately regarding casing shoe pressure exposure.',
      ],
      improvements: [
        'Emphasize Stop-Work Authority (SWA) explicitly whenever discussing rig-floor well control escalation.',
        'Link reservoir skin factor directly to completion/acidizing remediation options.',
      ],
      questionBreakdowns: [
        {
          questionNumber: 1,
          question:
            'While tripping out of a 12,000 ft TVD well, the trip tank shows a 6-barrel gain and flow continues with pumps off. What is happening, and what is your immediate sequence?',
          userAnswer:
            'Those are positive kick indicators—likely swabbing reduced bottomhole pressure below formation pore pressure. I immediately exercise stop-work authority, call the driller to space out, shut in the well via the annular/pipe rams per rig SOP, record SIDPP and SICP once stabilized, and verify kick density.',
          score: 91,
          feedback:
            'Decisive, safety-first well-control sequence naming swabbing, shut-in, and SIDPP/SICP recording.',
          polishedSampleAnswer:
            'This is an active influx (kick), likely induced by swabbing pressure drops during tripping. I immediately initiate well shut-in: alert the rig crew, space out the string clear of the BOP, close the annular preventer/ram with choke closed, monitor pit gain, and log stabilized Shut-In Drill Pipe Pressure (SIDPP) and Shut-In Casing Pressure (SICP) to compute kill mud weight.',
        },
        {
          questionNumber: 2,
          question:
            'Compare the Driller’s Method versus the Wait-and-Weight Method once a gas kick is shut in—when does Wait-and-Weight protect the casing shoe better?',
          userAnswer:
            'Driller’s Method circulates the influx out immediately using original mud weight, then pumps kill mud in a second circulation. Wait-and-Weight builds kill mud first and kills in one circulation. Wait-and-Weight usually produces lower peak casing shoe pressure if open-hole volume exceeds drillpipe capacity because heavy mud enters the annulus sooner.',
          score: 90,
          feedback:
            'Sharp volumetric nuance regarding drillpipe vs open-hole annulus capacity!',
          polishedSampleAnswer:
            'Driller’s Method requires two circulations—circulating the influx out immediately with original mud before weighting up—which avoids waiting while gas migrates, though it yields higher annulus pressures. Wait-and-Weight pumps kill mud in a single circulation, delivering lower peak pressure at the weak casing shoe whenever drillstring internal volume is smaller than open-hole volume.',
        },
        {
          questionNumber: 3,
          question:
            'A pressure buildup test yields a positive Skin Factor of +12. What physical mechanisms cause this, and how do you remediate it?',
          userAnswer:
            'Positive skin indicates near-wellbore formation damage reducing permeability—from drilling mud filtrate invasion, clay swelling, fines migration, or crushed perforation tunnels. Depending on lithology, we remediate via matrix acidizing (HCl for carbonates, mud acid HF/HCl for sandstones) or hydraulic proppant fracturing.',
          score: 86,
          feedback:
            'Accurate physical causes and lithology-matched stimulation choices.',
          polishedSampleAnswer:
            'A +12 skin factor reflects severe near-wellbore flow restriction caused by drilling mud solids invasion, clay swelling, or partial completion/perforation plugging. After confirming damage via Horner/derivative log-log plots, I recommend matrix acidizing tailored to mineralogy (HCl in carbonates, HCl-HF in sandstones) or re-perforating/mini-frac bypass.',
        },
      ],
    },
    11
  ),

  // 13. Finance, Management & HR (Score: 87)
  buildDemoPreset(
    {
      config: {
        track: 'Finance, Management & HR',
        company: 'Meezan Bank',
        persona: 'friendly_hr',
        mode: 'HR/Behavioral',
        languageMode: 'Corporate English',
        questionCount: 3,
        timerEnabled: false,
        jobDescription:
          'Management Trainee Officer (MTO) — Corporate & Islamic banking rotation, credit risk analysis, stakeholder leadership, and ethical client service.',
        resumeText:
          'BBA / Management Sciences (Finance Major, CGPA 3.72). President of Campus Entrepreneurship Society; Summer Intern in Corporate Credit & Islamic Banking Operations.',
      },
      overallScore: 87,
      readinessLabel: 'Strong Hire Potential',
      executiveSummary:
        'Articulate, ethical, and business-savvy responses aligned strongly with Meezan Bank values and Management Trainee leadership expectations. Quantifying credit ratios (DSCR, Current Ratio) and scaling STAR outcomes even further will make you stand out across final assessment centers.',
      clarityStructureScore: 89,
      technicalAlignmentScore: 85,
      confidenceScore: 88,
      industryAlignmentScore: 88,
      finalCheatSheet: [
        'Islamic Finance Modes: Contrast Murabaha (cost-plus asset sale), Ijarah (leasing), and Diminishing Musharakah (co-ownership equity exit).',
        'Corporate Credit Ratios: Debt Service Coverage Ratio (DSCR >= 1.25x), Current Ratio, Leverage, and Cash Conversion Cycle.',
        'STAR Leadership Stories: Lead with Situation/Task in 2 sentences, spend 60% on YOUR specific Actions, close with quantified Result.',
      ],
      skillBadges: [
        'Executive Communication',
        'Ethical Banking Alignment',
        'Structured STAR Storytelling',
      ],
      strengths: [
        'Explained asset-backed Shariah financing (Murabaha vs conventional interest loans) clearly without jargon.',
        'Delivered cohesive STAR behavioral examples demonstrating stakeholder alignment and integrity under pressure.',
      ],
      improvements: [
        'Cite specific credit risk benchmarks (e.g., DSCR >= 1.25x and working-capital inventory days) during commercial analysis.',
        'Keep behavioral intros concise before diving into your decisive actions.',
      ],
      questionBreakdowns: [
        {
          questionNumber: 1,
          question:
            'How would you explain the core operational difference between a Murabaha trade-finance facility and a conventional working-capital loan to a skeptical manufacturing CFO?',
          userAnswer:
            'In conventional lending, money itself earns interest regardless of the underlying asset. In Murabaha, the bank genuinely purchases the raw materials or inventory first, takes constructive ownership and risk briefly, and then sells the asset to the client at an agreed cost-plus profit margin with fixed, transparent repayment—prohibiting compounding penalties.',
          score: 89,
          feedback:
            'Clear, accurate commercial framing highlighting real asset ownership, risk transfer, and transparent fixed pricing.',
          polishedSampleAnswer:
            'Unlike a conventional loan that charges interest on cash lent, Murabaha is a real asset-backed trade contract: the bank procures the specified raw materials, assumes ownership risk prior to sale, and transfers them to the client at disclosed cost plus a fixed profit margin. Pricing stays predictable with no compounding interest on delayed payments.',
        },
        {
          questionNumber: 2,
          question:
            'When evaluating a corporate client’s creditworthiness whose revenue grew 30% yet cash flow turned negative, which financial ratios and red flags do you inspect?',
          userAnswer:
            'Fast revenue growth with negative operating cash flow signals overtrading or working-capital bloat. I inspect Accounts Receivable days (DSO), Inventory turnover days, Cash Conversion Cycle, and Debt Service Coverage Ratio (DSCR) to see if profits are trapped in uncollected receivables.',
          score: 86,
          feedback:
            'Spot-on diagnosis of overtrading and Cash Conversion Cycle stress!',
          polishedSampleAnswer:
            'Rapid top-line growth paired with negative operating cash flow points toward working-capital strain or aggressive revenue recognition. I analyze the Cash Conversion Cycle (DSO, DIO, DPO), aging of receivables, Debt Service Coverage Ratio (DSCR), and short-term debt reliance to distinguish healthy expansion from liquidity distress.',
        },
        {
          questionNumber: 3,
          question:
            'Tell me about a time you led a team through conflicting priorities or an ethical dilemma and how you measured success.',
          userAnswer:
            'As Campus Society President, a major sponsor offered extra funding only if we dropped an agreed student startup showcase slot. I reviewed our charter, met the sponsor transparently to offer branded judging awards instead of cutting student slots, kept 100% of student teams on stage, and still secured full sponsorship.',
          score: 87,
          feedback:
            'Compelling, principled STAR story demonstrating win-win negotiation and integrity.',
          polishedSampleAnswer:
            'Situation: Two weeks before our flagship summit, a lead sponsor demanded cutting student startup pitches for their product demo. Task: Protect student commitments without losing funding. Action: I presented alternative high-visibility award sponsorships and co-branded mentorship lounges that met their ROI goals. Result: Retained 100% of student demo slots and closed the event 18% above sponsorship target.',
        },
      ],
    },
    12
  ),
];

export function getJudgeDemoForTrack(track: string): DemoScenarioPreset {
  return (
    JUDGE_DEMO_PRESETS.find((preset) => preset.track === track) ??
    JUDGE_DEMO_PRESETS[0]
  );
}

export const JUDGE_DEMO_CONFIG: InterviewConfig = JUDGE_DEMO_PRESETS[0].config;
export const JUDGE_DEMO_REPORT: InterviewReport = JUDGE_DEMO_PRESETS[0].report;
