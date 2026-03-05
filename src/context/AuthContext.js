import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext(null);

const TOKEN_KEY = "dnah_token";
const API_URL = process.env.REACT_APP_API_URL;

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      try {
        if (!token) {
          if (!cancelled) {
            setUser(null);
            setLoading(false);
          }
          return;
        }

        const res = await fetch(`${API_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          if (!cancelled) {
            setUser(null);
            setLoading(false);
          }
          return;
        }

        const data = await res.json();

        if (!cancelled) {
          setUser(data.user);
          setLoading(false);
        }
      } catch {
        if (!cancelled) {
          setUser(null);
          setLoading(false);
        }
      }
    }

    bootstrap();
    return () => {
      cancelled = true;
    };
  }, [token]);

  const value = useMemo(() => {
    return {
      token,
      user,
      loading,
      isAuthed: Boolean(token && user),
      isAdmin: user?.role === "admin",

      async login(email, password) {
        const res = await fetch(`${API_URL}/api/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data?.error || "Login failed");
        }

        localStorage.setItem(TOKEN_KEY, data.token);
        setToken(data.token);
        setUser(data.user);

        return data.user;
      },

      logout() {
        localStorage.removeItem(TOKEN_KEY);
        setToken(null);
        setUser(null);
      },
    };
  }, [token, user, loading]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
