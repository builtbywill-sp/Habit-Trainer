import type { AppState } from "../app/types";
import { Card } from "../components/Card";
import { Layout } from "../components/Layout";
import { fmtMoney } from "../app/utils";

export function Ledger({ state }: { state: AppState }) {
  return (
    <Layout title="Ledger" subtitle="Complete transaction history">
      <Card>
        <h3>Transactions ({state.transactions.length})</h3>

        {state.transactions.length === 0 ? (
          <div className="muted">No transactions yet.</div>
        ) : (
          <div className="txList">
            {state.transactions.map((t) => (
              <div key={t.id} className="tx">
                <div>
                  <div className="row gap">
                    <span className="chip">{t.type === "paycheck" ? "Paycheck" : t.type === "bills" ? "Bills" : "Tx"}</span>
                    <span className="muted">Week {t.week}</span>
                  </div>
                  <div className="muted">{t.label}</div>
                  <div className="muted small">
                    Ck: {fmtMoney(t.checking)} &nbsp; Sv: {fmtMoney(t.savings)} &nbsp; Inv: {fmtMoney(t.investments)}
                  </div>
                </div>
                <div className={t.amount >= 0 ? "amt pos" : "amt neg"}>
                  {t.amount >= 0 ? "+" : "-"}
                  {fmtMoney(Math.abs(t.amount))}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </Layout>
  );
}