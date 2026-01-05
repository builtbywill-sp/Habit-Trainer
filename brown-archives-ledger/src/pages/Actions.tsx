import { useState } from "react";
import type { AppState } from "../app/types";
import { Card } from "../components/Card";
import { Layout } from "../components/Layout";
import { MoneyInput } from "../components/MoneyInput";
import { spend, transferToSavings, invest } from "../app/store";

const SPEND_CATEGORIES = [
  "Groceries",
  "Transportation",
  "Food / Dining",
  "Entertainment",
  "Clothing",
  "Medical",
  "Education",
  "Misc"
];

export function Actions({ state, setState }: { state: AppState; setState: (s: AppState) => void }) {
  const [sp, setSp] = useState("");
  const [spCat, setSpCat] = useState<string>(SPEND_CATEGORIES[0]);
  const [sv, setSv] = useState("");
  const [iv, setIv] = useState("");
  const [err, setErr] = useState<string | null>(null);

  const parse = (v: string) => Number(v || 0);

  return (
    <Layout title="Actions" subtitle="Manage your money wisely">
      <Card>
        <h3>Spend</h3>
        <div className="muted">What did you spend money on?</div>

        <select
          value={spCat}
          onChange={(e) => setSpCat(e.target.value)}
          style={{
            width: "100%",
            margin: "8px 0",
            padding: "10px",
            borderRadius: 8,
            background: "#0b0f14",
            color: "#e5e7eb",
            border: "1px solid rgba(255,255,255,0.15)",
          }}
        >
          {SPEND_CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <div className="muted">Amount</div>
        <MoneyInput value={sp} onChange={setSp} />

        <button
          className="btn"
          onClick={() => {
            try {
              setErr(null);
              setState(spend(state, parse(sp), `Spent on ${spCat}`));
              setSp("");
            } catch (e: any) {
              setErr(e.message);
            }
          }}
        >
          Confirm Spend
        </button>

        <div className="muted small">Every spend is logged with context — money always turns into something.</div>
      </Card>

      {err && <div className="error">{err}</div>}

      <Card>
        <h3>Save</h3>
        <div className="muted">Amount</div>
        <MoneyInput value={sv} onChange={setSv} />
        <button
          className="btn ghost"
          onClick={() => {
            try {
              setErr(null);
              setState(transferToSavings(state, parse(sv)));
              setSv("");
            } catch (e: any) {
              setErr(e.message);
            }
          }}
        >
          Transfer to Savings
        </button>
        <div className="muted small">Earns 4% APY interest weekly</div>
      </Card>

      <Card>
        <h3>Invest</h3>
        <div className="muted">Amount</div>
        <MoneyInput value={iv} onChange={setIv} />
        <button
          className="btn ghost"
          onClick={() => {
            try {
              setErr(null);
              setState(invest(state, parse(iv)));
              setIv("");
            } catch (e: any) {
              setErr(e.message);
            }
          }}
        >
          Invest Money
        </button>
        <div className="muted small">~8% APY with weekly variance (-1% to +1.5%)</div>
      </Card>
    </Layout>
  );
}