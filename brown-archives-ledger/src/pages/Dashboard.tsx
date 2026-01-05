import type { AppState } from "../app/types";
import { fmtMoney, now } from "../app/utils";
import { Card } from "../components/Card";
import { Layout } from "../components/Layout";
import { tickWeek } from "../app/store";

function timeLeft(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  return `${h}h ${m}m`;
}

export function Dashboard({ state, setState }: { state: AppState; setState: (s: AppState) => void }) {
  const left = state.nextTickAt - now();

  return (
    <Layout
      title="Dashboard"
      subtitle="Track your wealth journey"
      rightAction={<button className="iconBtn" onClick={() => setState({ ...state })}>↻</button>}
    >
      <Card className="row between">
        <div className="row">
          <div className="badge">🕒</div>
          <div>
            <div className="muted">Week {state.week}</div>
            <div className="muted">Next tick in {timeLeft(left)}</div>
          </div>
        </div>
        <button className="btn ghost" onClick={() => setState(tickWeek(state))}>+1 Week</button>
      </Card>

      <Card>
        <div className="muted">CHECKING</div>
        <div className="big">{fmtMoney(state.checking)}</div>
        <div className="muted">Available for spending</div>
      </Card>

      <div className="grid2">
        <Card>
          <div className="row between">
            <div className="muted">SAVINGS</div>
            <div className="pill">🐷</div>
          </div>
          <div className="big">{fmtMoney(state.savings)}</div>
          <div className="muted">4% APY</div>
        </Card>

        <Card>
          <div className="row between">
            <div className="muted">INVESTMENTS</div>
            <div className="pill">📈</div>
          </div>
          <div className="big">{fmtMoney(state.investments)}</div>
          <div className="muted">~8% APY</div>
        </Card>
      </div>

      <Card className="row between">
        <div>
          <div className="muted">CREDIT SCORE</div>
          <div className="big">{state.creditScore}</div>
          <div className="tag">Good</div>
        </div>
        <div className="pill">🛡️</div>
      </Card>
    </Layout>
  );
}