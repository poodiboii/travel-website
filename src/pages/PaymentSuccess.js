import PageWrapper from "../components/PageWrapper";

function PaymentSuccess() {
  return (
    <PageWrapper>
      <div className="container section">
        <h1 className="h1">Payment successful</h1>
        <p className="lead" style={{ marginTop: 10 }}>
          Your advance payment is received. We’ll confirm your booking shortly.
        </p>
        <div style={{ marginTop: 18, display: "flex", gap: 12, flexWrap: "wrap" }}>
          <a className="btn btn-primary" href="/packages">Explore packages</a>
          <a className="btn btn-ghost" href="/">Home</a>
        </div>
      </div>
    </PageWrapper>
  );
}

export default PaymentSuccess;
