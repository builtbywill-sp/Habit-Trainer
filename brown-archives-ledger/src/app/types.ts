export type Bucket = "checking" | "savings" | "investments";

export type TxType =
  | "paycheck"
  | "bills"
  | "spend"
  | "save"
  | "invest"
  | "store_purchase"
  | "loan_create"
  | "loan_payment";

export type Transaction = {
  id: string;
  ts: number;          // epoch ms
  week: number;
  type: TxType;
  label: string;
  amount: number;      // +in, -out (always relative to checking unless noted)
  checking: number;
  savings: number;
  investments: number;
};

export type Loan = {
  id: string;
  itemName: string;
  principal: number;     // original amount
  apr: number;           // e.g. 0.18
  termWeeks: number;     // repay in weeks
  createdWeek: number;
  remaining: number;     // current balance
  weeklyPayment: number; // computed at creation
  status: "active" | "paid";
};

export type StoreItem = {
  id: string;
  name: string;
  desc: string;
  price: number;
};

export type AppState = {
  week: number;
  nextTickAt: number; // epoch ms
  checking: number;
  savings: number;
  investments: number;
  creditScore: number;
  aprMin: number;
  aprMax: number;
  transactions: Transaction[];
  loans: Loan[];
};