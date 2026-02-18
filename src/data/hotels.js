import hero from "../assets/hero2.jpg";

export const hotels = [
  {
    id: "goa-beach-resort",
    name: "Goa Beach Resort & Spa",
    city: "Goa",
    country: "India",
    rating: 4.6,
    pricePerNight: 5999,
    advancePercent: 15,
    image: hero,
    amenities: ["Breakfast", "Pool", "Wi‑Fi", "Near beach", "Airport pickup"],
    description:
      "A relaxed beachfront stay with modern rooms, great service and quick access to top spots.",
    policies: [
      "Check-in: 2 PM • Check-out: 11 AM",
      "Government ID required at check-in",
      "Advance is non-refundable once reserved",
    ],
  },
  {
    id: "manali-hill-view",
    name: "Manali Hill View Retreat",
    city: "Manali",
    country: "India",
    rating: 4.4,
    pricePerNight: 4499,
    advancePercent: 15,
    image: hero,
    amenities: ["Breakfast", "Heating", "Mountain view", "Wi‑Fi", "Parking"],
    description:
      "Cozy mountain stay with scenic views, warm hospitality and comfortable rooms.",
    policies: [
      "Check-in: 1 PM • Check-out: 11 AM",
      "Subject to seasonal availability",
      "Advance is non-refundable once reserved",
    ],
  },
  {
    id: "dubai-marina-hotel",
    name: "Dubai Marina Business Hotel",
    city: "Dubai",
    country: "UAE",
    rating: 4.7,
    pricePerNight: 8999,
    advancePercent: 20,
    image: hero,
    amenities: ["Breakfast", "Gym", "Wi‑Fi", "City access", "Airport transfer"],
    description:
      "Premium city hotel with fast access to malls, marina and iconic attractions.",
    policies: [
      "Tourism dirham / local taxes may apply",
      "Passport required at check-in",
      "Advance is non-refundable once reserved",
    ],
  },
];

export function getHotelById(id) {
  return hotels.find((h) => h.id === id);
}

export function formatINR(amount) {
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `₹${amount}`;
  }
}
