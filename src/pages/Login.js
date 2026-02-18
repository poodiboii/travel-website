import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageWrapper from "../components/PageWrapper";
import { useAuth } from "../context/AuthContext";
import "./Login.css";

function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      await login(email.trim(), password);
      nav("/admin");
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <PageWrapper>
      <div className="auth-wrap">
        <div className="auth-card">
          <h1 className="auth-title">Admin Login</h1>
          <p className="auth-sub">
            Sign in to manage content and bookings (master account).
          </p>

          {error && <div className="err">{error}</div>}

          <form className="auth-form" onSubmit={onSubmit}>
            <div className="field">
              <span className="label">Email</span>
              <input
                className="input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@..."
                required
              />
            </div>

            <div className="field">
              <span className="label">Password</span>
              <input
                className="input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
              />
            </div>

            <div className="row">
              <button className="btn btn-primary" type="submit" disabled={busy}>
                {busy ? "Signing in…" : "Sign in"}
              </button>

              <button
                className="btn btn-ghost"
                type="button"
                onClick={() => nav("/")}
              >
                Back to site
              </button>
            </div>
          </form>
        </div>
      </div>
    </PageWrapper>
  );
}

export default Login;
