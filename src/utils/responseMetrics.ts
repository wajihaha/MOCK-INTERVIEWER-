import type { AnswerDepthMetrics } from '../types/interview';

export function countWords(text: string): number {
  const cleaned = text.trim();
  if (!cleaned) return 0;
  return cleaned.split(/\s+/).filter(Boolean).length;
}

export function computeAnswerDepthMetrics(answers: string[]): AnswerDepthMetrics {
  const counts = answers.map((ans) => countWords(ans));
  if (counts.length === 0) {
    return {
      totalWords: 0,
      averageWordsPerAnswer: 0,
      shortestAnswerWords: 0,
      longestAnswerWords: 0,
      concisenessRating: 'Brief — Add More Depth',
      concisenessGuidance:
        'Provide structured multi-sentence responses covering context, technical actions, and outcomes.',
    };
  }

  const totalWords = counts.reduce((sum, n) => sum + n, 0);
  const averageWordsPerAnswer = Math.round(totalWords / counts.length);
  const shortestAnswerWords = Math.min(...counts);
  const longestAnswerWords = Math.max(...counts);

  if (averageWordsPerAnswer < 35) {
    return {
      totalWords,
      averageWordsPerAnswer,
      shortestAnswerWords,
      longestAnswerWords,
      concisenessRating: 'Brief — Add More Depth',
      concisenessGuidance:
        'Your answers average under 35 words. Expand with concrete architecture trade-offs, tools, or STAR outcomes.',
    };
  }

  if (averageWordsPerAnswer <= 95) {
    return {
      totalWords,
      averageWordsPerAnswer,
      shortestAnswerWords,
      longestAnswerWords,
      concisenessRating: 'Concise & Focused',
      concisenessGuidance:
        'Ideal executive pacing—responses are crisp, high-signal, and easy for technical panels to follow.',
    };
  }

  if (averageWordsPerAnswer <= 150) {
    return {
      totalWords,
      averageWordsPerAnswer,
      shortestAnswerWords,
      longestAnswerWords,
      concisenessRating: 'Well-Balanced',
      concisenessGuidance:
        'Thorough explanations with solid technical context while staying within healthy interview time limits.',
    };
  }

  return {
    totalWords,
    averageWordsPerAnswer,
    shortestAnswerWords,
    longestAnswerWords,
    concisenessRating: 'Detailed — Tighten Structure',
    concisenessGuidance:
      'Rich detail, though answers run long. Lead with a 1-sentence thesis before diving into implementation specifics.',
  };
}
