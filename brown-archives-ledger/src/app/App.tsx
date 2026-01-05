import { useEffect, useState } from "react";
import { loadState, saveState, resetAll } from "./store";
import { type AppState } from "./types";
import { Nav } from "../components/Nav";
import { Dashboard } from "../pages/Dashboard";
import { Actions } from "../pages/Actions";
import { Store } from "../pages/store";
import { Ledger } from "../pages/Ledger";
import { Loans } from "../pages/Loans";

type Tab = "dashboard" | "actions" | "store" | "ledger" | "loans";

export default function App() {
  const [state, setState] = useState<AppState>(() => loadState());
  const [tab, setTab] = useState<Tab>("dashboard");

  useEffect(() => saveState(state), [state]);

  return (
    <div className="app">
      <div className="content">
        {tab === "dashboard" && <Dashboard state={state} setState={setState} />}
        {tab === "actions" && <Actions state={state} setState={setState} />}
        {tab === "store" && <Store state={state} setState={setState} />}
        {tab === "ledger" && <Ledger state={state} />}
        {tab === "loans" && <Loans state={state} setState={setState} />}

        <div className="footerTools">
          <button className="btn outline small" onClick={() => setState(resetAll())}>
            Reset (dev)
          </button>
        </div>
      </div>

      <Nav tab={tab} setTab={setTab} />
    </div>
  );
}