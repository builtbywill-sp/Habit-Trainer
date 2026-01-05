export const uid = () => crypto.randomUUID();

export function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export function fmtMoney(n: number) {
  return n.toLocaleString(undefined, { style: "currency", currency: "USD" });
}

export function now() {
  return Date.now();
}

// fixed weekly tick: 7 days
export function computeNextTick(fromTs: number) {
  const weekMs = 7 * 24 * 60 * 60 * 1000;
  return fromTs + weekMs;
}

// amortized weekly payment (simple APR -> weekly rate)
export function weeklyPayment(principal: number, apr: number, termWeeks: number) {
  const r = apr / 52;
  if (r === 0) return principal / termWeeks;
  const pmt = (principal * r) / (1 - Math.pow(1 + r, -termWeeks));
  return pmt;
}

// investments: weekly variance (-1% to +1.5%) around ~8%/yr
export function investmentWeeklyReturn() {
  // base: 0.08 / 52 ≈ 0.001538
  const base = 0.08 / 52;
  const variance = (Math.random() * (0.015 - (-0.01))) + (-0.01); // -1%..+1.5%
  return base + variance; // intentionally “game-like” like your screenshots
}