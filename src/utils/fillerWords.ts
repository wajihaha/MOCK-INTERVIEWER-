import type { FillerWordCounts } from '../types/interview';

export function detectFillerWords(text: string): FillerWordCounts {
  if (!text || !text.trim()) {
    return { um: 0, uh: 0, like: 0, basically: 0, total: 0 };
  }

  const normalized = text.toLowerCase();

  const countMatches = (pattern: RegExp): number => {
    const matches = normalized.match(pattern);
    return matches ? matches.length : 0;
  };

  const um = countMatches(/\b(um+|umm+)\b/g);
  const uh = countMatches(/\b(uh+|uhh+)\b/g);
  const like = countMatches(/\b(like)\b/g);
  const basically = countMatches(/\b(basically)\b/g);

  return {
    um,
    uh,
    like,
    basically,
    total: um + uh + like + basically,
  };
}

export function sumFillerWords(list: FillerWordCounts[]): FillerWordCounts {
  return list.reduce<FillerWordCounts>(
    (acc, item) => ({
      um: acc.um + item.um,
      uh: acc.uh + item.uh,
      like: acc.like + item.like,
      basically: acc.basically + item.basically,
      total: acc.total + item.total,
    }),
    { um: 0, uh: 0, like: 0, basically: 0, total: 0 }
  );
}
