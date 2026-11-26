interface WidthSample { width: number; time: number }
export interface WidthHistory { samples: WidthSample[]; preferred: number | null }
export const SIDEBAR_SNAP_DISTANCE = 10;

/** A bounded, recency-weighted estimate. Updated only after a completed drag. */
export function recordPreferredWidth(history: WidthHistory, width: number, time: number, initialPoint: number | null): WidthHistory {
  const last = history.samples.at(-1);
  // A quick correction replaces the previous adjustment instead of adding a vote.
  const previous = last && time - last.time < 2000 ? history.samples.slice(0, -1) : history.samples;
  const samples = [...previous, { width, time }].slice(-40);
  const votes = samples.map((sample, index) => ({
    width: sample.width, weight: 2 ** ((index + 1 - samples.length) / 5),
  }));
  const density = (at: number) => votes.reduce((sum, vote) =>
    sum + vote.weight * Math.exp(-((at - vote.width) ** 2) / 128), 0);
  const seed = votes.reduce((best, vote) => density(vote.width) > density(best.width) ? vote : best);
  const nearby = votes.filter(vote => Math.abs(vote.width - seed.width) <= 16);
  const support = nearby.reduce((sum, vote) => sum + vote.weight, 0);
  if (support < 2.5) return { samples, preferred: history.preferred };
  const candidate = Math.round(nearby.reduce((sum, vote) => sum + vote.width * vote.weight, 0) / support);
  // Fine adjustments stay reachable without moving the reference on each release.
  const reference = initialPoint ?? history.preferred;
  const preferred = reference !== null && Math.abs(candidate - reference) <= SIDEBAR_SNAP_DISTANCE
    ? reference : candidate;
  return { samples, preferred };
}
