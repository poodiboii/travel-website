/*
  Data-driven packages.
  NOTE: Content is professional placeholder copy you can replace later.
*/

import bali1 from "../assets/bali-international-trip.png";
import dubai1 from "../assets/dubai-luxury-tour.png";
import goa1 from "../assets/goa-beach-holiday.png";
import manali1 from "../assets/manali-mountain-escape.png";
import rajasthan1 from "../assets/royal-rajasthan-tour.png";

function money(n) {
  return n;
}

export const packages = [
  {
    id: "dubai-luxury-4n5d",
    title: "Dubai Luxury Escape",
    destination: "Dubai",
    country: "UAE",
    category: "international",
    duration: { nights: 4, days: 5 },
    pricePerPerson: money(47699),
    advancePercent: 20,
    rating: 4.7,
    image: dubai1,
    gallery: [dubai1],
    highlights: [
      "Burj Khalifa at the Top (non-prime)",
      "Desert Safari with BBQ Dinner",
      "Dhow Cruise Marina",
      "City Tour + Transfers",
    ],
    inclusions: [
      "4-star stay with breakfast",
      "Airport transfers",
      "Sightseeing as per itinerary",
      "All taxes (as applicable)",
    ],
    exclusions: [
      "Flights",
      "Tourism dirham / local taxes",
      "Personal expenses",
      "Travel insurance (recommended)",
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival + Check-in",
        desc: "Arrive in Dubai, private transfer to hotel, evening at leisure.",
      },
      {
        day: 2,
        title: "Dubai City Tour + Dhow Cruise",
        desc: "Half-day city tour covering major landmarks, evening marina cruise with dinner.",
      },
      {
        day: 3,
        title: "Burj Khalifa + Dubai Mall",
        desc: "Visit Burj Khalifa observation deck and explore Dubai Mall.",
      },
      {
        day: 4,
        title: "Desert Safari",
        desc: "Dune bashing, sunset views, cultural show and BBQ dinner.",
      },
      {
        day: 5,
        title: "Departure",
        desc: "Check-out and transfer to the airport.",
      },
    ],
    policies: [
      "Prices are per person on twin sharing.",
      "Final confirmation subject to availability.",
      "Advance payment is non-refundable once booked.",
    ],
  },

  {
    id: "bali-kuta-ubud-5n6d",
    title: "Bali Kuta + Ubud Highlights",
    destination: "Bali",
    country: "Indonesia",
    category: "international",
    duration: { nights: 5, days: 6 },
    pricePerPerson: money(31999),
    advancePercent: 20,
    rating: 4.6,
    image: bali1,
    gallery: [bali1],
    highlights: [
      "Nusa Penida day trip",
      "Kintamani + Tegallalang",
      "Water sports",
      "Private transfers",
    ],
    inclusions: [
      "4-star stays",
      "Daily breakfast",
      "Airport transfers",
      "Sightseeing as per itinerary",
    ],
    exclusions: [
      "Flights",
      "Visa (if applicable)",
      "Meals not mentioned",
      "Personal expenses",
    ],
    itinerary: [
      { day: 1, title: "Arrival in Bali", desc: "Check-in and relax." },
      { day: 2, title: "South Bali + Water Sports", desc: "Beach time and activities." },
      { day: 3, title: "Nusa Penida", desc: "Full-day island highlights tour." },
      { day: 4, title: "Ubud Highlights", desc: "Temples, rice terraces, scenic spots." },
      { day: 5, title: "Leisure / Optional", desc: "Spa, shopping, cafes." },
      { day: 6, title: "Departure", desc: "Airport drop." },
    ],
    policies: ["Passport validity 6 months required.", "Advance holds booking slots."],
  },

  {
    id: "goa-beach-3n4d",
    title: "Goa Beach Holiday",
    destination: "Goa",
    country: "India",
    category: "domestic",
    duration: { nights: 3, days: 4 },
    pricePerPerson: money(14999),
    advancePercent: 15,
    rating: 4.5,
    image: goa1,
    gallery: [goa1],
    highlights: ["North + South Goa tours", "Beachside stay", "Airport transfers"],
    inclusions: ["3-star/4-star stay", "Breakfast", "Transfers", "Local sightseeing"],
    exclusions: ["Flights/train", "Entry tickets", "Personal expenses"],
    itinerary: [
      { day: 1, title: "Arrival", desc: "Check-in + beach evening." },
      { day: 2, title: "North Goa", desc: "Fort + beaches + markets." },
      { day: 3, title: "South Goa", desc: "Churches + calm beaches." },
      { day: 4, title: "Departure", desc: "Check-out + transfer." },
    ],
    policies: ["IDs required for check-in.", "Seasonal surcharges may apply."],
  },

  {
    id: "manali-snow-4n5d",
    title: "Manali Mountain Escape",
    destination: "Manali",
    country: "India",
    category: "domestic",
    duration: { nights: 4, days: 5 },
    pricePerPerson: money(17999),
    advancePercent: 15,
    rating: 4.4,
    image: manali1,
    gallery: [manali1],
    highlights: ["Solang Valley", "Local sightseeing", "Cozy stays"],
    inclusions: ["Stay", "Breakfast + dinner", "Sightseeing", "Transfers"],
    exclusions: ["Adventure activity fees", "Personal expenses"],
    itinerary: [
      { day: 1, title: "Arrival", desc: "Check-in and rest." },
      { day: 2, title: "Local tour", desc: "Temples + markets." },
      { day: 3, title: "Solang Valley", desc: "Snow activities (optional)." },
      { day: 4, title: "Leisure", desc: "Cafe hopping or shopping." },
      { day: 5, title: "Departure", desc: "Return transfer." },
    ],
  },

  {
    id: "rajasthan-heritage-5n6d",
    title: "Royal Rajasthan Tour",
    destination: "Jaipur • Jodhpur • Udaipur",
    country: "India",
    category: "domestic",
    duration: { nights: 5, days: 6 },
    pricePerPerson: money(23999),
    advancePercent: 15,
    rating: 4.6,
    image: rajasthan1,
    gallery: [rajasthan1],
    highlights: ["City palaces", "Fort tours", "Cultural evening"],
    inclusions: ["Hotels", "Breakfast", "Intercity transfers", "Guided sightseeing"],
    exclusions: ["Flights/train", "Entry fees", "Personal expenses"],
    itinerary: [
      { day: 1, title: "Arrive Jaipur", desc: "Check-in + local market." },
      { day: 2, title: "Jaipur", desc: "Amer Fort + City Palace." },
      { day: 3, title: "Jodhpur", desc: "Drive + Mehrangarh Fort." },
      { day: 4, title: "Udaipur", desc: "Drive + lakeside evening." },
      { day: 5, title: "Udaipur", desc: "City Palace + boat ride." },
      { day: 6, title: "Departure", desc: "Check-out." },
    ],
  },
];

export function getPackageById(id) {
  return packages.find((p) => p.id === id);
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
