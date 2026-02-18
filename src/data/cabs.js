export const cabCities = [
  {
    id: "delhi",
    city: "Delhi",
    price: 12,
    unit: "km",
    advancePercent: 10,
    services: ["Airport Transfer", "City Rides", "Outstation"],
  },
  {
    id: "mumbai",
    city: "Mumbai",
    price: 14,
    unit: "km",
    advancePercent: 10,
    services: ["Airport Transfer", "City Rides"],
  },
  {
    id: "goa",
    city: "Goa",
    price: 13,
    unit: "km",
    advancePercent: 10,
    services: ["Airport Transfer", "Sightseeing", "Outstation"],
  },
  {
    id: "manali",
    city: "Manali",
    price: 15,
    unit: "km",
    advancePercent: 10,
    services: ["Local Sightseeing", "Outstation"],
  },
  {
    id: "jaipur",
    city: "Jaipur",
    price: 11,
    unit: "km",
    advancePercent: 10,
    services: ["City Rides", "Outstation"],
  },
];

export function formatCabRate(c) {
  return `₹${c.price}/${c.unit}`;
}
