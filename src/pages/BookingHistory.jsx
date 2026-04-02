import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../api";

function BookingHistory() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios.get(`${BASE_URL}/api/bookings`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(res => setBookings(res.data));
  }, []);

  return (
    <div className="container mt-4">
      <h2>My Bookings</h2>

      {bookings.map(b => (
        <div key={b.id} className="card p-3 mb-3 shadow">
          <h5>Room #{b.roomId}</h5>
          <p>User: {b.userName}</p>
          <p>{b.checkIn} → {b.checkOut}</p>
        </div>
      ))}
    </div>
  );
}

export default BookingHistory;