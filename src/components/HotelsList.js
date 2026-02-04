import { useState, useEffect } from "react";
import { Link } from "react-router-dom";


/* Sample hotel data */
export const hotels = [
  {
    id: "goa-resort",
    name: "Goa Beach Resort",
    city: "Goa",
    price: 5999,
    rating: 4.5,
    image: "/assets/hotel-goa.png",
  },
  {
    id: "manali-hills",
    name: "Manali Hill View Hotel",
    city: "Manali",
    price: 4499,
    rating: 4.2,
    image: "/assets/hotel-manali.png",
  },
];

function HotelsList() {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("hotelWishlist")) || [];
    setWishlist(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem("hotelWishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  const toggleWishlist = (id) => {
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  let filtered = hotels.filter(
    (hotel) =>
      hotel.name.toLowerCase().includes(search.toLowerCase()) ||
      hotel.city.toLowerCase().includes(search.toLowerCase())
  );

  if (sortBy === "priceLow")
    filtered.sort((a, b) => a.price - b.price);
  if (sortBy === "priceHigh")
    filtered.sort((a, b) => b.price - a.price);
  if (sortBy === "rating")
    filtered.sort((a, b) => b.rating - a.rating);

  return (
    <section className="packages-section">
      <div className="packages-header">
        <h2>AVAILABLE HOTELS</h2>

        <input
          className="package-search"
          placeholder="Search by city or hotel..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="package-filter"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="default">Sort By</option>
          <option value="priceLow">Price: Low → High</option>
          <option value="priceHigh">Price: High → Low</option>
          <option value="rating">Rating</option>
        </select>
      </div>

      <div className="packages-wrapper">
        {filtered.map((hotel) => (
          <div
            key={hotel.id}
            className="package-row"
            style={{
              backgroundImage: `linear-gradient(
                rgba(0,0,0,0.55),
                rgba(0,0,0,0.55)
              ), url(${hotel.image})`,
            }}
          >
            <button
              className="wishlist-btn"
              onClick={() => toggleWishlist(hotel.id)}
            >
              {wishlist.includes(hotel.id) ? "❤️" : "🤍"}
            </button>

            <div className="package-info">
              <h3>{hotel.name}</h3>
              <p>{hotel.city}</p>
              <p>⭐ {hotel.rating}</p>
            </div>

            <div className="package-action">
              <p className="package-price">₹{hotel.price}/night</p>
              <Link to={`/hotels/${hotel.id}`} className="package-link">
                View Details →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default HotelsList;
