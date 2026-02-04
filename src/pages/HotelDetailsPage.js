import { useParams } from "react-router-dom";
import { hotels } from "../components/HotelsList";

function HotelDetailsPage() {
  const { hotelId } = useParams();
  const hotel = hotels.find((h) => h.id === hotelId);

  if (!hotel) return <p>Hotel not found</p>;

  return (
    <div style={{ padding: "60px" }}>
      <h1>{hotel.name}</h1>
      <p>{hotel.city}</p>
      <p>⭐ {hotel.rating}</p>
      <p>₹{hotel.price} per night</p>

      <p>
        Comfortable stay with premium amenities, great location, and trusted
        service.
      </p>
    </div>
  );
}

export default HotelDetailsPage;
