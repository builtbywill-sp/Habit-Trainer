import { useState } from "react";
import type { AppState } from "../app/types";
import { Card } from "../components/Card";
import { Layout } from "../components/Layout";
import { fmtMoney } from "../app/utils";
import { MoneyInput } from "../components/MoneyInput";
import { payLoan } from "../app/store";

export function Loans({ state, setState }: { state: AppState; setState: (s: AppState) => void }) {
  const active = state.loans.filter((l) => l.status === "active");
  const [amount, setAmount] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const n = Number(amount || 0);

  return (
    <Layout title="Loans" subtitle="Manage your financing obligations">
      {active.length === 0 ? (
        <Card className="center">
          <div className="muted">No loans yet</div>
          <div className="muted">Visit the Store to finance items</div>
        </Card>
      ) : (
        <>
          {err && <div className="error">{err}</div>}
          {active.map((l) => (
            <Card key={l.id}>
              <div className="row between">
                <div>
                  <div className="muted">{l.itemName}</div>
                  <div className="muted small">
                    APR: {Math.round(l.apr * 100)}% · Term: {l.termWeeks} weeks · Weekly: {fmtMoney(l.weeklyPayment)}
                  </div>
                </div>
                <div className="big">{fmtMoney(l.remaining)}</div>
              </div>

              <div className="muted">Pay amount</div>
              <MoneyInput value={amount} onChange={setAmount} />
              <button
                className="btn"
                onClick={() => {
                  try {
                    setErr(null);
                    setState(payLoan(state, l.id, n));
                    setAmount("");
                  } catch (e: any) {
                    setErr(e.message);
                  }
                }}
              >
                Make Payment
              </button>
            </Card>
          ))}
        </>
      )}
    </Layout>
  );
}