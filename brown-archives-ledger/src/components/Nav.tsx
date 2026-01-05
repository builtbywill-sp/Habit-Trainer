
type Tab = "dashboard" | "actions" | "store" | "ledger" | "loans";

export function Nav({ tab, setTab }: { tab: Tab; setTab: (t: Tab) => void }) {
  return (
    <nav className="nav">
      <button className={tab === "dashboard" ? "active" : ""} onClick={() => setTab("dashboard")}>Dashboard</button>
      <button className={tab === "actions" ? "active" : ""} onClick={() => setTab("actions")}>Actions</button>
      <button className={tab === "store" ? "active" : ""} onClick={() => setTab("store")}>Store</button>
      <button className={tab === "ledger" ? "active" : ""} onClick={() => setTab("ledger")}>Ledger</button>
      <button className={tab === "loans" ? "active" : ""} onClick={() => setTab("loans")}>Loans</button>
    </nav>
  );
}