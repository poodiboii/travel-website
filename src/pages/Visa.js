import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { FaMagnifyingGlass, FaArrowRight, FaCheck } from "react-icons/fa6";

import { visaCountries, getVisaCountry, formatINR } from "../data/visas";
import { useCart } from "../context/CartContext";
import "./Visa.css";

function Visa() {
  const { visaId } = useParams();
  const country = visaId ? getVisaCountry(visaId) : null;

  const nav = useNavigate();
  const { addToCart } = useCart();

  const [q, setQ] = useState("");
  const [region, setRegion] = useState("all");

  const regions = useMemo(() => {
    const set = new Set(visaCountries.map((c) => c.region));
    return ["all", ...Array.from(set)];
  }, []);

  const filtered = useMemo(() => {
    const normalized = q.trim().toLowerCase();
    return visaCountries.filter((c) => {
      const matchesRegion = region === "all" || c.region === region;
      const matchesQ = !normalized || c.name.toLowerCase().includes(normalized);
      return matchesRegion && matchesQ;
    });
  }, [q, region]);

  // Country detail page
  if (country) {
    return (
      <div className="visa">
        <div className="container">
          <div className="visa-country-hero">
            <h1 className="visa-title">{country.name} Visa</h1>
            <p className="visa-sub">
              Choose your visa type, review document requirements, and pay an advance to begin.
            </p>

            <div className="plans">
              {country.plans.map((p) => (
                <div key={p.id} className="plan">
                  <h3>{p.name}</h3>
                  <p>Processing: {p.processing}</p>
                  <div className="kv">
                    <span>Starting from</span>
                    <strong>{formatINR(p.price)}</strong>
                  </div>
                  <div className="country-actions">
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => {
                        // Add to cart to finalize later (as requested)
                        addToCart({
                          id: p.id,
                          name: `${country.name} Visa • ${p.name}`,
                          price: formatINR(p.price),
                          image: null,
                        });
                        nav("/cart");
                      }}
                    >
                      Pay advance <FaArrowRight />
                    </button>
                    <Link className="btn btn-ghost" to="/visa">
                      Back to countries
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            <div className="section-nav" style={{ marginTop: 14 }}>
              <div className="container section-nav-inner">
                <button onClick={() => document.getElementById("docs")?.scrollIntoView({ behavior: "smooth" })}>
                  Documents
                </button>
                <button onClick={() => document.getElementById("faqs")?.scrollIntoView({ behavior: "smooth" })}>
                  FAQs
                </button>
              </div>
            </div>

            <section id="docs" className="box">
              <h2 className="h2" style={{ textAlign: "left", marginBottom: 10 }}>
                Documents required
              </h2>
              <ul className="list">
                {country.documents.map((d) => (
                  <li key={d}>
                    <FaCheck /> {d}
                  </li>
                ))}
              </ul>
            </section>

            <section id="faqs" className="box">
              <h2 className="h2" style={{ textAlign: "left", marginBottom: 10 }}>
                FAQs
              </h2>
              <div className="faq">
                {country.faqs.map((f) => (
                  <details key={f.q}>
                    <summary>{f.q}</summary>
                    <p>{f.a}</p>
                  </details>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    );
  }

  // Landing page
  return (
    <div className="visa">
      <div className="container">
        <motion.div
          className="visa-hero"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
        >
          <h1 className="visa-title">Visa services (multi-country)</h1>
          <p className="visa-sub">
            Search by country, open a visa page, then pay an advance to start.
          </p>

          <div className="visa-controls">
            <div className="control">
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <FaMagnifyingGlass color="#64748b" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search country (UAE, Thailand, Schengen…)"
                />
              </div>
            </div>

            <div className="control">
              <select value={region} onChange={(e) => setRegion(e.target.value)}>
                {regions.map((r) => (
                  <option key={r} value={r}>
                    {r === "all" ? "All regions" : r}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        <div className="visa-grid">
          {filtered.map((c, i) => (
            <motion.div
              key={c.id}
              className="country-card"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.03 * i, duration: 0.45, ease: "easeOut" }}
              onClick={(e) => {
                const interactive = e.target.closest("a, button");
                if (interactive) return;
                nav(`/visa/${c.id}`);
              }}
              role="link"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter") nav(`/visa/${c.id}`);
              }}
            >
              <div className="country-top">
                <div>
                  <div className="country-name">{c.name}</div>
                  <div className="country-region">{c.region}</div>
                </div>
                <div className="country-price">
                  {formatINR(c.startingFrom)}
                  <small>starting from</small>
                </div>
              </div>

              <div className="country-actions">
                <Link className="btn btn-ghost" to={`/visa/${c.id}`}>
                  View details
                </Link>
                <button
                  className="btn btn-primary"
                  type="button"
                  onClick={() => nav(`/visa/${c.id}`)}
                >
                  Apply <FaArrowRight />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{ marginTop: 18 }}>
            <p className="lead">No results. Try a different search.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Visa;
