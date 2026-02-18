import PageWrapper from "../components/PageWrapper";

function PaymentFailed() {
  return (
    <PageWrapper>
      <div className="container section">
        <h1 className="h1">Payment failed / cancelled</h1>
        <p className="lead" style={{ marginTop: 10 }}>
          No worries—your booking wasn’t completed. You can try again.
        </p>
        <div style={{ marginTop: 18, display: "flex", gap: 12, flexWrap: "wrap" }}>
          <a className="btn btn-primary" href="/packages">Try again</a>
          <a className="btn btn-ghost" href="/">Home</a>
        </div>
      </div>
    </PageWrapper>
  );
}

export default PaymentFailed;
