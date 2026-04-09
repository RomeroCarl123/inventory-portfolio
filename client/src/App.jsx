import { useState } from "react";
import Dashboard from "./components/Dashboard";
import Login from "./pages/Login";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken("");
  };

  if (!token) return <Login setToken={setToken} />;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
              Inventory Suite
            </p>
            <p className="font-semibold text-white">Admin Workspace</p>
          </div>
          <button
            className="rounded-lg bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/20"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
      <Dashboard token={token} />
    </div>
  );
}

export default App;
