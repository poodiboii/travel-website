import { useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import PageWrapper from "../components/PageWrapper";
import { formatINR, getPackageById } from "../data/packages";
import "./Checkout.css";

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

function Checkout() {
  const { kind, id } = useParams();
  const q = useQuery();
  const navigate = useNavigate();

  const travellers = Math.max(1, Number(q.get("travellers") || 2));

  const pkg = kind === "package" ? getPackageById(id) : null;

  const pricing = useMemo(() => {
    if (!pkg) return null;
    const total = pkg.pricePerPerson * travellers;
    const advance = Math.round((total * (pkg.advancePercent || 20)) / 100);
    return { total, advance };
  }, [pkg, travellers]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const mockPaymentsEnabled = useMemo(() => {
    const mode = (process.env.REACT_APP_PAYMENT_MODE || "").toLowerCase();
    if (mode === "live") return false;
    if (mode === "mock") return true;
    return process.env.NODE_ENV !== "production";
  }, []);

  async function payNow() {
    setError(null);
    if (!pkg) return;

    if (mockPaymentsEnabled) {
      const orderId = `MOCK_${Date.now()}`;
      navigate(`/payment-success?mock=1&order_id=${encodeURIComponent(orderId)}&amount=${encodeURIComponent(pricing.advance)}`);
      return;
    }

    setBusy(true);
    try {
      const orderId = `DNAH-${Date.now()}`;

      const res = await fetch("/api/initiate-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_id: orderId,
          amount: String(pricing.advance),
          billing_name: name,
          billing_email: email,
          billing_tel: phone,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Payment init failed");
      if (!data?.encRequest || !data?.accessCode) throw new Error("Invalid payment response");

      // Create and submit CC Avenue form
      const form = document.createElement("form");
      form.method = "POST";
      form.action = data.gatewayUrl || "https://secure.ccavenue.com/transaction/transaction.do?command=initiateTransaction";

      const enc = document.createElement("input");
      enc.type = "hidden";
      enc.name = "encRequest";
      enc.value = data.encRequest;

      const ac = document.createElement("input");
      ac.type = "hidden";
      ac.name = "access_code";
      ac.value = data.accessCode;

      form.appendChild(enc);
      form.appendChild(ac);

      document.body.appendChild(form);
      form.submit();
    } catch (e) {
      setError(e.message || "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  if (!pkg) {
    return (
      <PageWrapper>
        <div className="container section">
          <h1 className="h1">Checkout</h1>
          <p className="lead">Invalid checkout item.</p>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div className="checkout">
        <div className="container">
          <h1 className="h1">Secure Checkout</h1>
          <p className="lead" style={{ marginTop: 8 }}>
            You’re paying the advance to reserve <strong>{pkg.title}</strong>.
          </p>

          <div className="checkout-grid">
            <div className="panel">
              <h2>Traveller details</h2>
              {error && (
                <div className="err" style={{ marginBottom: 12 }}>
                  {error}
                </div>
              )}
              <div className="form">
                <div className="full">
                  <span className="label">Full name</span>
                  <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
                </div>
                <div>
                  <span className="label">Email</span>
                  <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" />
                </div>
                <div>
                  <span className="label">Phone</span>
                  <input className="input" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91…" />
                </div>
                <div className="full">
                  <p className="note">
                    After advance payment, our team will confirm availability and share the final itinerary.
                  </p>
                </div>
                <div className="full" style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  <button className="btn btn-primary" type="button" disabled={busy || !name || !email || !phone} onClick={payNow}>
                    {busy
                      ? "Redirecting…"
                      : mockPaymentsEnabled
                        ? `Mock pay advance ${formatINR(pricing.advance)}`
                        : `Pay advance ${formatINR(pricing.advance)}`}
                  </button>
                  <a className="btn btn-ghost" href="/packages">Back</a>
                </div>
              </div>
            </div>

            <div className="panel">
              <h2>Summary</h2>
              <div className="summary">
                <div className="row"><span>Travellers</span><strong>{travellers}</strong></div>
                <div className="row"><span>Price / person</span><strong>{formatINR(pkg.pricePerPerson)}</strong></div>
                <div className="row"><span>Total</span><strong>{formatINR(pricing.total)}</strong></div>
                <div className="row"><span>Advance ({pkg.advancePercent}%)</span><strong>{formatINR(pricing.advance)}</strong></div>
              </div>
              <p className="note" style={{ marginTop: 12 }}>
                Payment is processed securely via CC Avenue.
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}

export default Checkout;
