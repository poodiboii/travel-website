// src/pages/Visa.js
import { useState } from "react";
import { Link } from "react-router-dom";
import "./Visa.css";

// Sample visa countries data
const visaCountries = [
  { id: 1, name: "USA", continent: "North America", price: "₹5,000" },
  { id: 2, name: "Canada", continent: "North America", price: "₹4,500" },
  { id: 3, name: "UK", continent: "Europe", price: "₹6,000" },
  { id: 4, name: "Germany", continent: "Europe", price: "₹5,500" },
  { id: 5, name: "Australia", continent: "Oceania", price: "₹6,500" },
  { id: 6, name: "Japan", continent: "Asia", price: "₹5,800" },
  { id: 7, name: "France", continent: "Europe", price: "₹5,700" },
  { id: 8, name: "Singapore", continent: "Asia", price: "₹4,900" },
  { id: 9, name: "New Zealand", continent: "Oceania", price: "₹6,200" },
  // add more as needed
];

// Process steps
const processSteps = [
  {
    step: 1,
    title: "Choose Your Country",
    description: "Select the country you want to apply for a visa from our offerings.",
  },
  {
    step: 2,
    title: "Provide Documents",
    description: "Submit all necessary documents and personal information securely.",
  },
  {
    step: 3,
    title: "Application Processing",
    description: "Our experts handle your application and guide you through each step.",
  },
  {
    step: 4,
    title: "Receive Visa",
    description: "Get your visa approved and start your journey with confidence.",
  },
];

function Visa() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Filter countries by search
  const filteredCountries = visaCountries.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredCountries.length / itemsPerPage);
  const paginatedCountries = filteredCountries.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePrev = () => setCurrentPage((p) => Math.max(p - 1, 1));
  const handleNext = () => setCurrentPage((p) => Math.min(p + 1, totalPages));

  return (
    <section className="visa-page">
      {/* HERO */}
      <div className="visa-hero">
        <h1>Visa Services</h1>
        <p>Apply for your visa seamlessly and securely. Explore our offerings below.</p>
      </div>

      {/* SEARCH */}
      <div className="visa-search">
        <input
          type="text"
          placeholder="Search for a country..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* POPULAR / PAGINATED COUNTRIES */}
      <div className="visa-countries">
        {paginatedCountries.map((country) => (
          <Link
            key={country.id}
            to={`/visa/${country.id}`}
            className="visa-country-card"
          >
            <h3>{country.name}</h3>
            <p>Starting from {country.price}</p>
          </Link>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button onClick={handlePrev} disabled={currentPage === 1}>Prev</button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button onClick={handleNext} disabled={currentPage === totalPages}>Next</button>
        </div>
      )}

      {/* PROCESS */}
      <div className="visa-process">
        <h2>Our 4-Step Process</h2>
        <div className="process-steps">
          {processSteps.map((step) => (
            <div key={step.step} className="process-card">
              <div className="process-step">Step {step.step}</div>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CONTINENT WISE LISTING */}
      <div className="visa-continents">
        <h2>Countries We Offer by Continent</h2>
        {["Asia","Europe","North America","Oceania"].map((continent) => (
          <div key={continent} className="continent-section">
            <h3>{continent}</h3>
            <div className="continent-countries">
              {visaCountries
                .filter((c) => c.continent === continent)
                .map((c) => (
                  <Link
                    key={c.id}
                    to={`/visa/${c.id}`}
                    className="continent-country-card"
                  >
                    {c.name} - {c.price}
                  </Link>
                ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Visa;
