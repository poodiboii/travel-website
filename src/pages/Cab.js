import { useState } from "react";
import "./Cab.css";

const cabLocations = [
  {
    id: 1,
    city: "Delhi",
    services: ["Airport Transfer", "City Rides", "Outstation"],
    price: "₹12/km",
  },
  {
    id: 2,
    city: "Mumbai",
    services: ["Airport Transfer", "City Rides"],
    price: "₹14/km",
  },
  {
    id: 3,
    city: "Goa",
    services: ["Airport Transfer", "Sightseeing", "Outstation"],
    price: "₹13/km",
  },
  {
    id: 4,
    city: "Manali",
    services: ["Local Sightseeing", "Outstation"],
    price: "₹15/km",
  },
  {
    id: 5,
    city: "Jaipur",
    services: ["City Rides", "Outstation"],
    price: "₹11/km",
  },
];

function Cab() {
  const [search, setSearch] = useState("");

  const filteredCabs = cabLocations.filter((cab) =>
    cab.city.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section className="cab-page">
      {/* HERO */}
      <div className="cab-hero">
        <h1>Cab Services</h1>
        <p>
          Comfortable, reliable, and affordable cab services for airport
          transfers, city travel, and outstation journeys.
        </p>
      </div>

      {/* SEARCH */}
      <div className="cab-search">
        <input
          type="text"
          placeholder="Search by city (e.g. Delhi, Goa)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* CAB LIST */}
      <div className="cab-list">
        {filteredCabs.map((cab) => (
          <div key={cab.id} className="cab-card">
            <h3>{cab.city}</h3>

            <p className="cab-price">
              <strong>Starting at:</strong> {cab.price}
            </p>

            <ul className="cab-services">
              {cab.services.map((service, index) => (
                <li key={index}>✔ {service}</li>
              ))}
            </ul>

            {/* ONLY ENQUIRY BUTTON */}
            <div className="cab-actions">
              <a
                href={`https://wa.me/919999359448?text=Hello%20I%20want%20cab%20service%20in%20${cab.city}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn primary"
              >
                Enquire on WhatsApp
              </a>
            </div>
          </div>
        ))}

        {filteredCabs.length === 0 && (
          <p className="no-results">No cab services found.</p>
        )}
      </div>
    </section>
  );
}

export default Cab;
