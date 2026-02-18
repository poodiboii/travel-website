import { useNavigate } from "react-router-dom";
import PageWrapper from "../components/PageWrapper";
import { useAuth } from "../context/AuthContext";

function Admin() {
  const { user, logout } = useAuth();
  const nav = useNavigate();

  return (
    <PageWrapper>
      <div className="container section">
        <h1 className="h1">Admin</h1>
        <p className="lead" style={{ marginTop: 10 }}>
          Logged in as <strong>{user?.email}</strong>
        </p>

        <div style={{ marginTop: 18, display: "flex", gap: 12, flexWrap: "wrap" }}>
          <button className="btn btn-primary" onClick={() => nav("/visa")}>Go to Visa</button>
          <button className="btn btn-ghost" onClick={() => nav("/cart")}>View Cart</button>
          <button
            className="btn btn-ghost"
            onClick={() => {
              logout();
              nav("/");
            }}
          >
            Logout
          </button>
        </div>

        <div style={{ marginTop: 26 }}>
          <h2 className="h2">Next</h2>
          <p className="lead">
            I’ll add a real admin dashboard here (countries/visa plans, packages,
            hotels, booking requests, payments status).
          </p>
        </div>
      </div>
    </PageWrapper>
  );
}

export default Admin;
