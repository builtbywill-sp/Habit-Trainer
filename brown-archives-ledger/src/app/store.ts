import type { AppState } from "./types";
import type { Transaction, Loan, StoreItem } from "./types";
import { uid, now, computeNextTick, clamp, weeklyPayment, investmentWeeklyReturn } from "./utils";

const LS_KEY = "ba_finance_sim_v1";

export const DEFAULT_PAYCHECK = 150;
export const DEFAULT_WEEKLY_BILLS = 80;

export const STORE_ITEMS: StoreItem[] = [
  { id: "smartphone", name: "Smartphone", desc: "Latest model with all the features", price: 999 },
  { id: "laptop", name: "Laptop", desc: "Powerful computer for work and play", price: 1499 },
  { id: "smartwatch", name: "Smart Watch", desc: "Track fitness and stay connected", price: 399 },
  { id: "headphones", name: "Wireless Headphones", desc: "Premium noise-canceling audio", price: 299 },
  { id: "tablet", name: "Tablet", desc: "Perfect for entertainment and browsing", price: 799 },
  { id: "console", name: "Gaming Console", desc: "Next-gen gaming experience", price: 499 },
  { id: "camera", name: "Digital Camera", desc: "Professional-quality photos and video", price: 1299 },
  { id: "speakers", name: "Smart Speakers", desc: "Room-filling sound with voice control", price: 199 },
];

export function defaultState(): AppState {
  const t = now();
  return {
    week: 1,
    nextTickAt: computeNextTick(t),
    checking: 0,
    savings: 0,
    investments: 0,
    creditScore: 650,
    aprMin: 0.15,
    aprMax: 0.25,
    transactions: [],
    loans: [],
  };
}

export function loadState(): AppState {
  const raw = localStorage.getItem(LS_KEY);
  if (!raw) return defaultState();
  try {
    return JSON.parse(raw) as AppState;
  } catch {
    return defaultState();
  }
}

export function saveState(s: AppState) {
  localStorage.setItem(LS_KEY, JSON.stringify(s));
}

export function addTx(state: AppState, tx: Omit<Transaction, "id" | "ts">): AppState {
  const full: Transaction = { id: uid(), ts: now(), ...tx };
  const next = { ...state, transactions: [full, ...state.transactions] };
  saveState(next);
  return next;
}

export function spend(state: AppState, amount: number, label = "Spend") {
  amount = Math.max(0, amount);
  if (amount > state.checking) throw new Error("Insufficient checking balance.");
  const next = { ...state, checking: state.checking - amount };
  return addTx(next, {
    week: state.week,
    type: "spend",
    label,
    amount: -amount,
    checking: next.checking,
    savings: next.savings,
    investments: next.investments,
  });
}

export function transferToSavings(state: AppState, amount: number) {
  amount = Math.max(0, amount);
  if (amount > state.checking) throw new Error("Insufficient checking balance.");
  const next = { ...state, checking: state.checking - amount, savings: state.savings + amount };
  return addTx(next, {
    week: state.week,
    type: "save",
    label: "Transfer to Savings",
    amount: -amount,
    checking: next.checking,
    savings: next.savings,
    investments: next.investments,
  });
}

export function invest(state: AppState, amount: number) {
  amount = Math.max(0, amount);
  if (amount > state.checking) throw new Error("Insufficient checking balance.");
  const next = { ...state, checking: state.checking - amount, investments: state.investments + amount };
  return addTx(next, {
    week: state.week,
    type: "invest",
    label: "Invest Money",
    amount: -amount,
    checking: next.checking,
    savings: next.savings,
    investments: next.investments,
  });
}

export function buyNow(state: AppState, item: StoreItem) {
  if (item.price > state.checking) throw new Error("Not enough in checking to buy now.");
  const next = { ...state, checking: state.checking - item.price };
  return addTx(next, {
    week: state.week,
    type: "store_purchase",
    label: `Bought ${item.name}`,
    amount: -item.price,
    checking: next.checking,
    savings: next.savings,
    investments: next.investments,
  });
}

export function financeItem(state: AppState, item: StoreItem) {
  const apr = state.aprMin + Math.random() * (state.aprMax - state.aprMin);
  const termWeeks = 26;
  const pmt = weeklyPayment(item.price, apr, termWeeks);

  const loan: Loan = {
    id: uid(),
    itemName: item.name,
    principal: item.price,
    apr,
    termWeeks,
    createdWeek: state.week,
    remaining: item.price,
    weeklyPayment: pmt,
    status: "active",
  };

  const next = { ...state, loans: [loan, ...state.loans] };
  saveState(next);

  return addTx(next, {
    week: state.week,
    type: "loan_create",
    label: `Financed ${item.name}`,
    amount: 0,
    checking: next.checking,
    savings: next.savings,
    investments: next.investments,
  });
}

export function payLoan(state: AppState, loanId: string, amount: number) {
  amount = Math.max(0, amount);
  if (amount > state.checking) throw new Error("Insufficient checking balance.");

  const loans: Loan[] = state.loans.map((l): Loan => {
    if (l.id !== loanId || l.status !== "active") return l;
    const rem = Math.max(0, l.remaining - amount);
    return { ...l, remaining: rem, status: rem === 0 ? "paid" : "active" };
  });

  const next: AppState = { ...state, checking: state.checking - amount, loans };
  saveState(next);

  return addTx(next, {
    week: state.week,
    type: "loan_payment",
    label: "Loan payment",
    amount: -amount,
    checking: next.checking,
    savings: next.savings,
    investments: next.investments,
  });
}

export function tickWeek(state: AppState) {
  let s: AppState = { ...state, week: state.week + 1, nextTickAt: computeNextTick(now()) };

  // paycheck
  {
    const nextChecking = s.checking + DEFAULT_PAYCHECK;
    s = addTx({ ...s, checking: nextChecking }, {
      week: s.week,
      type: "paycheck",
      label: "Weekly paycheck",
      amount: DEFAULT_PAYCHECK,
      checking: nextChecking,
      savings: s.savings,
      investments: s.investments,
    });
  }

  // bills
  {
    const nextChecking = s.checking - DEFAULT_WEEKLY_BILLS;
    s = addTx({ ...s, checking: nextChecking }, {
      week: s.week,
      type: "bills",
      label: "Weekly bills",
      amount: -DEFAULT_WEEKLY_BILLS,
      checking: nextChecking,
      savings: s.savings,
      investments: s.investments,
    });
  }

  // savings interest weekly (4% APY)
  {
    const savingsRate = 0.04 / 52;
    s = { ...s, savings: s.savings * (1 + savingsRate) };
  }

  // investment return weekly
  {
    const invRet = investmentWeeklyReturn();
    s = { ...s, investments: s.investments * (1 + invRet) };
  }

  // auto-pay loans
  {
    const activeLoans = s.loans.filter((l) => l.status === "active");
    for (const l of activeLoans) {
      const pmt = Math.min(l.weeklyPayment, l.remaining);
      if (pmt > 0 && pmt <= s.checking) s = payLoan(s, l.id, pmt);
    }
  }

  s = { ...s, creditScore: clamp(s.creditScore, 300, 850) };
  saveState(s);
  return s;
}

export function resetAll() {
  localStorage.removeItem(LS_KEY);
  return defaultState();
}