import { useState } from "react";
import api from "../api";
import "./Login.css";

export default function Login({ setToken }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await api.post("/auth/login", { username, password });
      setToken(res.data.token);
      localStorage.setItem("token", res.data.token);
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-visual">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/80">
              Inventory Suite
            </p>
            <h2 className="mt-6 text-4xl font-bold leading-tight text-white">
              Smarter Stock,
              <br />
              Better Decisions
            </h2>
            <p className="mt-4 text-white/90">
              Track inventory health in real-time with trend insights and
              low-stock alerts.
            </p>
          </div>
          <div className="login-visual-note">
            Demo access is enabled for quick client walkthroughs.
          </div>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              Welcome back
            </p>
            <h1 className="mt-2 text-3xl font-bold text-white">
              Sign in to continue
            </h1>
            <p className="mt-2 text-slate-400">
              Access your dashboard to manage products and monitor stock trends.
            </p>
          </div>

          <div className="login-demo">
            Demo account: <span className="font-semibold">demo / demo123</span>
          </div>

          <div className="space-y-3">
            <input
              className="login-input"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              className="login-input"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <p className="login-error">{error}</p>}

          <button className="login-submit" type="submit">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
