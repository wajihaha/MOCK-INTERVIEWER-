import type {
  CompanyCategory,
  CompanyPreset,
  InterviewConfig,
  InterviewReport,
  PersonaOption,
  QAPair,
} from '../types/interview';

export const NED_TRACKS: readonly string[] = [
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

export const JUDGE_DEMO_CONFIG: InterviewConfig = {
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
    'Final Year BS Software Engineering student at NED University (CGPA 3.68). FYP: Smart Campus Energy & Attendance Portal using React, Express, and PostgreSQL. Summer Intern at a Karachi software house building REST endpoints.',
};

export const JUDGE_DEMO_QA: QAPair[] = [
  {
    questionIndex: 1,
    question:
      'In your NED Final Year Project (Smart Campus Energy & Attendance Portal), how did you structure the database schema to avoid N+1 query bottlenecks when generating daily department reports?',
    answer:
      'Basically humne PostgreSQL use kiya tha aur um shuru mein har student ke liye separate query chal rahi thi, like report page slow ho gaya tha. Phir maine SQL JOINs aur composite indexing lagayi department_id aur date par, aur aggregate COUNT queries use ki taake ek single query mein poora summary data aa jaye.',
    fillerWords: { um: 1, uh: 0, like: 1, basically: 1, total: 3 },
    usedHint: false,
    timeSpentSeconds: 42,
  },
  {
    questionIndex: 2,
    question:
      'If Systems Limited puts you on an enterprise banking client project and a production API suddenly starts timing out under peak load, what systematic steps would you take in the first 15 minutes?',
    answer:
      'Sab se pehle main server logs aur APM metrics check karunga ke bottleneck database layer par hai ya application CPU par. Uh, agar slow queries dikhein toh EXPLAIN ANALYZE run karunga, connection pool exhaustion check karunga, aur urgent mitigation ke liye read-heavy endpoints par short-TTL Redis caching ya rate limiting enable karunga.',
    fillerWords: { um: 0, uh: 1, like: 0, basically: 0, total: 1 },
    usedHint: false,
    timeSpentSeconds: 48,
  },
  {
    questionIndex: 3,
    question:
      'Explain the practical difference between Composition and Inheritance in Object-Oriented Programming, and when inheritance becomes an anti-pattern in large enterprise codebases.',
    answer:
      'Inheritance mein "is-a" relationship hota hai jahan child class parent ki properties inherit karti hai, lekin agar hierarchy deep ho jaye toh tight coupling create hoti hai. Composition "has-a" approach hai jahan hum small modular behaviors inject karte hain, jo testing aur future changes ke liye zyada flexible hota hai.',
    fillerWords: { um: 0, uh: 0, like: 0, basically: 0, total: 0 },
    usedHint: true,
    timeSpentSeconds: 39,
  },
  {
    questionIndex: 4,
    question:
      'Tell me about a time during your internship or university group project when a teammate disagreed with your technical approach. How did you resolve it without delaying the deadline?',
    answer:
      'Meri FYP team mein ek member NoSQL chahta tha aur um main PostgreSQL suggest kar raha tha kyunki hamara attendance aur energy logs relational data tha. Humne 30 minutes baith kar dono schemas ka pros/cons table banaya, aur jab unko reporting queries ka complexity difference dikhaya toh hum dono SQL par agree ho gaye.',
    fillerWords: { um: 1, uh: 0, like: 0, basically: 0, total: 1 },
    usedHint: false,
    timeSpentSeconds: 45,
  },
  {
    questionIndex: 5,
    question:
      'How do you design idempotent REST APIs for payment or critical state-changing operations so duplicate client retries never corrupt records?',
    answer:
      'Client har request ke header mein ek unique Idempotency-Key UUID bhejta hai. Server transaction start karne se pehle check karta hai ke yeh key database ya Redis mein already processed toh nahi hai; agar processed hai toh wahi cached response return hota hai instead of dubara record insert karne ke.',
    fillerWords: { um: 0, uh: 0, like: 0, basically: 0, total: 0 },
    usedHint: false,
    timeSpentSeconds: 36,
  },
];

export const JUDGE_DEMO_REPORT: InterviewReport = {
  overallScore: 86,
  readinessLabel: 'Strong Hire Potential',
  executiveSummary:
    'Solid engineering fundamentals and practical troubleshooting instincts aligned well with Systems Limited enterprise delivery standards. Even while answering in Comfort Mode (Hinglish/Roman Urdu), your architectural reasoning on SQL indexing, connection pooling, and idempotency keys is accurate and production-minded. Refining verbal conciseness and trimming minor filler words will elevate you to top-tier readiness.',
  communicationScore: 82,
  technicalDepthScore: 89,
  confidenceScore: 87,
  evaluationRubric: {
    technical_accuracy: 89,
    communication_clarity: 82,
    industry_alignment: 88,
    confidence_tone: 87,
  },
  finalCheatSheet: [
    'SQL Query Profiling: Explain N+1 query detection with EXPLAIN ANALYZE, covering composite B-tree index column ordering and connection pool sizing (PgBouncer / Pool max).',
    'Distributed Idempotency: Distinguish unique constraint enforcement vs. Redis atomic SETNX locks for concurrent in-flight payment retries (HTTP 200 replay vs. 409 Conflict).',
    'STAR Behavioral Framing: Always close conflict-resolution stories with a quantified Result (e.g., hours saved, sprint velocity, or zero regression defects).',
    'OOP Architecture Patterns: Prepare one concrete enterprise refactoring example replacing deep inheritance with Strategy / Dependency Injection composition.',
  ],
  skillBadges: [
    'Strong Problem Solving',
    'Production Triage Mindset',
    'Solid Database Fundamentals',
    'Collaborative Team Player',
  ],
  strengths: [
    'Identified root-cause database bottlenecks using EXPLAIN ANALYZE, composite indexing, and Redis read-caching rather than guessing.',
    'Demonstrated clear conflict resolution using objective trade-off tables during your NED Final Year Project.',
    'Accurately articulated idempotency key workflows for fault-tolerant enterprise APIs.',
  ],
  improvements: [
    'Quantify impact where possible (e.g., exact query latency reduction from 1.2s to 45ms after adding composite indexes).',
    'Watch minor filler words ("basically", "um", "like") at the start of technical explanations—pause for one second instead.',
    'Practice delivering the same structured points fluently in Corporate English for client-facing rounds.',
  ],
  questionBreakdowns: [
    {
      questionNumber: 1,
      question: JUDGE_DEMO_QA[0].question,
      userAnswer: JUDGE_DEMO_QA[0].answer,
      englishTranslation:
        'We used PostgreSQL, and initially our reporting page slowed down because separate queries executed per student. I resolved this by adding composite indexes on (department_id, date) and consolidating the logic into single aggregate COUNT queries with SQL JOINs.',
      score: 85,
      feedback:
        'Accurate diagnosis and fix for N+1 queries. Mentioning exact before/after query execution times or row counts would make this answer stand out even more.',
      polishedSampleAnswer:
        'In our Smart Campus Portal built on PostgreSQL, our initial ORM implementation triggered N+1 queries per student on the daily department report. I profiled the endpoint, replaced the loop with a single SQL JOIN and GROUP BY aggregate query, and added a composite index on (department_id, attendance_date), reducing report generation time by over 80%.',
    },
    {
      questionNumber: 2,
      question: JUDGE_DEMO_QA[1].question,
      userAnswer: JUDGE_DEMO_QA[1].answer,
      englishTranslation:
        'First, I would inspect server logs and APM metrics to isolate whether the bottleneck is at the database or application CPU layer. If slow queries appear, I would run EXPLAIN ANALYZE, check for connection pool exhaustion, and apply short-TTL Redis caching or rate limiting on read-heavy endpoints for immediate relief.',
      score: 91,
      feedback:
        'Excellent structured incident response! Checking telemetry before jumping to conclusions and separating diagnosis from short-term mitigation shows strong engineering maturity.',
      polishedSampleAnswer:
        'In the first 15 minutes, I would triage systematically using APM dashboards and logs to isolate whether latency stems from CPU saturation, downstream dependencies, or database locks. If database-bound, I would inspect active locks, run EXPLAIN ANALYZE on top slow queries, verify connection pool utilization, and deploy immediate mitigations such as short-TTL Redis caching or temporary rate limiting while preparing a permanent fix.',
    },
    {
      questionNumber: 3,
      question: JUDGE_DEMO_QA[2].question,
      userAnswer: JUDGE_DEMO_QA[2].answer,
      englishTranslation:
        'Inheritance represents an "is-a" relationship where child classes inherit parent behavior, which creates tight coupling as hierarchies deepen. Composition uses a "has-a" approach by injecting small modular behaviors, improving testability and flexibility for future changes.',
      score: 84,
      feedback:
        'Clear conceptual contrast. Adding a concrete example (such as avoiding a fragile multi-level User -> Employee -> Manager inheritance tree by composing Role/Permission strategies) will make it memorable.',
      polishedSampleAnswer:
        'Inheritance models an "is-a" relationship, whereas composition models a "has-a" capability. In large enterprise systems, deep inheritance trees become an anti-pattern because changes to a base class ripple unpredictably across subclasses (the fragile base class problem). Favoring composition lets us inject focused, interface-driven dependencies that are far easier to unit test and swap without breaking sibling classes.',
    },
    {
      questionNumber: 4,
      question: JUDGE_DEMO_QA[3].question,
      userAnswer: JUDGE_DEMO_QA[3].answer,
      englishTranslation:
        'During my FYP, a teammate preferred NoSQL while I recommended PostgreSQL because our attendance and energy logs were inherently relational. We spent 30 minutes building a pros-and-cons comparison table, and once we evaluated the reporting query complexity, we aligned on SQL.',
      score: 83,
      feedback:
        'Great behavioral story showing data-backed collaboration without ego. Try framing it explicitly with Situation, Task, Action, and Result (STAR) and mention the outcome.',
      polishedSampleAnswer:
        'During our NED Final Year Project, a teammate advocated for MongoDB while I favored PostgreSQL for our attendance and energy datasets. Rather than debating opinions, I proposed a 30-minute technical spike comparing schema design, transactional integrity, and multi-table reporting queries. Seeing the concrete trade-offs side by side, our team unanimously adopted PostgreSQL and delivered the analytics module two days ahead of schedule.',
    },
    {
      questionNumber: 5,
      question: JUDGE_DEMO_QA[4].question,
      userAnswer: JUDGE_DEMO_QA[4].answer,
      englishTranslation:
        'The client sends a unique Idempotency-Key UUID in the request header. Before starting the database transaction, the server checks Redis or the database to see if that key was already processed; if so, it returns the stored response instead of inserting duplicate records.',
      score: 88,
      feedback:
        'Spot-on mechanism! To reach 95+, mention handling concurrent in-flight requests with the same key (e.g., atomic lock or unique DB constraint) and returning 409/200 consistently.',
      polishedSampleAnswer:
        'To guarantee idempotency on critical mutations, the client generates a UUID Idempotency-Key header per logical operation. On receipt, the server acquires an atomic lock or unique database constraint on that key; if the key has already completed, it immediately replays the original status code and payload without re-executing the business transaction, preventing duplicate charges even under network retries.',
    },
  ],
  totalFillerWords: {
    um: 2,
    uh: 1,
    like: 1,
    basically: 1,
    total: 5,
  },
  isDemo: true,
  completedAt: '2026-11-13T14:30:00.000Z',
};
