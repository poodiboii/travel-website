/* Visa data (placeholder structure). Replace copy/prices later. */

export const visaCountries = [
  {
    id: "uae",
    name: "UAE (Dubai)",
    region: "Middle East",
    startingFrom: 2999,
    currency: "INR",
    plans: [
      { id: "uae-96h", name: "96 Hours", price: 2999, processing: "3–5 working days" },
      { id: "uae-14d", name: "14 Days", price: 7199, processing: "3–5 working days" },
      { id: "uae-30d", name: "30 Days", price: 7499, processing: "3–5 working days" },
      { id: "uae-60d", name: "60 Days", price: 13499, processing: "5–7 working days" },
    ],
    documents: [
      "Passport (6+ months validity)",
      "Photograph (white background)",
      "Confirmed return tickets (if applicable)",
      "Hotel booking / address proof",
    ],
    faqs: [
      { q: "How long does processing take?", a: "Usually 3–7 working days depending on plan." },
      { q: "Do I need insurance?", a: "Recommended for international travel." },
    ],
  },
  {
    id: "thailand",
    name: "Thailand",
    region: "Asia",
    startingFrom: 1900,
    plans: [
      { id: "thai-tourist", name: "Tourist", price: 1900, processing: "5–10 working days" },
    ],
    documents: ["Passport", "Photo", "Bank statement", "Return tickets"],
    faqs: [{ q: "Is it e-visa?", a: "Depends on nationality and travel purpose." }],
  },
  {
    id: "singapore",
    name: "Singapore",
    region: "Asia",
    startingFrom: 4900,
    plans: [{ id: "sg-tourist", name: "Tourist", price: 4900, processing: "5–7 working days" }],
    documents: ["Passport", "Photo", "Itinerary", "Hotel booking"],
    faqs: [{ q: "Validity?", a: "Varies by profile and issuance." }],
  },
  {
    id: "schengen",
    name: "Schengen",
    region: "Europe",
    startingFrom: 6500,
    plans: [{ id: "schengen-tourist", name: "Tourist", price: 6500, processing: "10–20 working days" }],
    documents: ["Passport", "Cover letter", "Travel insurance", "Bank statement"],
    faqs: [{ q: "Is interview required?", a: "Often required for biometrics." }],
  },
];

export function getVisaCountry(id) {
  return visaCountries.find((c) => c.id === id);
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
