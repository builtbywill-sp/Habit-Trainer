import { useState } from "react";
import type { AppState } from "../app/types";
import { Card } from "../components/Card";
import { Layout } from "../components/Layout";
import { fmtMoney, weeklyPayment } from "../app/utils";
import { STORE_ITEMS, buyNow, financeItem } from "../app/store";

export function Store({ state, setState }: { state: AppState; setState: (s: AppState) => void }) {
  const [err, setErr] = useState<string | null>(null);

  const [financeOpen, setFinanceOpen] = useState(false);
  const [selected, setSelected] = useState<(typeof STORE_ITEMS)[number] | null>(null);
  const [termWeeks, setTermWeeks] = useState<number>(26);
  const [agree, setAgree] = useState(false);
  const [quoteApr, setQuoteApr] = useState<number>(0);

  const quote =
    selected
      ? {
          apr: quoteApr,
          termWeeks,
          weekly: weeklyPayment(selected.price, quoteApr, termWeeks),
        }
      : null;

  return (
    <Layout title="Store" subtitle="Buy items with cash or financing">
      <Card className="row between">
        <div>
          <div className="muted">Available in Checking</div>
          <div className="big green">{fmtMoney(state.checking)}</div>
        </div>
        <div>
          <div className="muted">Your APR Range</div>
          <div className="big">
            {Math.round(state.aprMin * 100)}% - {Math.round(state.aprMax * 100)}%
          </div>
        </div>
      </Card>

      {err && <div className="error">{err}</div>}

      <div className="grid2">
        {STORE_ITEMS.map((it) => (
          <Card key={it.id}>
            <div className="muted">{it.name}</div>
            <div className="muted small">{it.desc}</div>
            <div className="big">{fmtMoney(it.price)}</div>

            <button
              className="btn ghost"
              onClick={() => {
                try {
                  setErr(null);
                  setState(buyNow(state, it));
                } catch (e: any) {
                  setErr(e.message);
                }
              }}
            >
              $ Buy Now
            </button>

            <button
              className="btn outline"
              onClick={() => {
                setErr(null);
                setAgree(false);
                setTermWeeks(26);
                setSelected(it);
                const apr = state.aprMin + Math.random() * (state.aprMax - state.aprMin);
                setQuoteApr(apr);
                setFinanceOpen(true);
              }}
            >
              💳 Finance
            </button>
          </Card>
        ))}
      </div>

      {financeOpen && selected && quote && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.55)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
            zIndex: 100,
          }}
          onClick={() => setFinanceOpen(false)}
        >
          <div
            style={{
              width: "min(560px, 100%)",
              background: "#0b0f14",
              borderRadius: 16,
              padding: 16,
              border: "1px solid rgba(255,255,255,0.12)",
              boxShadow: "0 12px 48px rgba(0,0,0,0.45)",
              color: "#e2e8f0",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 18, fontWeight: 900 }}>Finance {selected.name}</div>
                <div style={{ color: "#94a3b8", fontSize: 13 }}>
                  Choose a term. Review the payment. Then accept.
                </div>
              </div>
              <button
                className="btn outline small"
                onClick={() => {
                  setFinanceOpen(false);
                  setSelected(null);
                }}
              >
                Close
              </button>
            </div>

            <div style={{ marginTop: 14 }}>
              <div style={{ color: "#94a3b8", fontSize: 12 }}>Price</div>
              <div style={{ fontSize: 22, fontWeight: 900 }}>{fmtMoney(selected.price)}</div>
            </div>

            <div style={{ marginTop: 14 }}>
              <div style={{ color: "#94a3b8", fontSize: 12 }}>APR (quoted)</div>
              <div style={{ fontSize: 16, fontWeight: 900 }}>{Math.round(quote.apr * 100)}%</div>
              <div style={{ color: "#94a3b8", fontSize: 12 }}>
                Your range: {Math.round(state.aprMin * 100)}% - {Math.round(state.aprMax * 100)}%
              </div>
            </div>

            <div style={{ marginTop: 14 }}>
              <div style={{ color: "#94a3b8", fontSize: 12, marginBottom: 6 }}>Term</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {[12, 26, 52].map((w) => (
                  <button
                    key={w}
                    type="button"
                    className={"btn outline small" + (termWeeks === w ? " active" : "")}
                    onClick={() => setTermWeeks(w)}
                  >
                    {w} weeks
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginTop: 14 }}>
              <div style={{ color: "#94a3b8", fontSize: 12 }}>Estimated weekly payment</div>
              <div style={{ fontSize: 26, fontWeight: 950 }}>{fmtMoney(quote.weekly)}</div>
              <div style={{ color: "#94a3b8", fontSize: 12 }}>
                You must accept before the loan is created.
              </div>
            </div>

            <label style={{ display: "flex", gap: 10, alignItems: "flex-start", marginTop: 14 }}>
              <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
              <span style={{ fontSize: 13, color: "#e2e8f0" }}>
                I agree to finance this purchase. I understand this creates a loan and requires weekly payments.
              </span>
            </label>

            <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
              <button
                className="btn"
                disabled={!agree}
                onClick={() => {
                  try {
                    setErr(null);
                    setState(financeItem(state, selected));
                    setFinanceOpen(false);
                    setSelected(null);
                  } catch (e: any) {
                    setErr(e.message);
                  }
                }}
              >
                Confirm & Create Loan
              </button>
              <button
                className="btn outline"
                onClick={() => {
                  setFinanceOpen(false);
                  setSelected(null);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}