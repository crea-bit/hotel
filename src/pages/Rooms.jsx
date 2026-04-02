import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../api";

const images = [
  "https://source.unsplash.com/400x250/?hotel",
  "https://source.unsplash.com/400x250/?luxury-room",
  "https://source.unsplash.com/400x250/?resort",
];

function Rooms() {
  const [rooms, setRooms] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${BASE_URL}/rooms`)
      .then(res => {
        if (res.data.length === 0) {
          const dummy = Array.from({ length: 20 }, (_, i) => ({
            id: i + 1,
            type: ["Deluxe", "AC", "Suite", "Standard"][i % 4],
            price: 1500 + i * 200,
            available: i % 2 === 0
          }));
          setRooms(dummy);
        } else {
          setRooms(res.data);
        }
      });
  }, []);

  return (
    <div className="container mt-4">
      <div className="row">
        {rooms.map((room, i) => (
          <div className="col-md-4 mb-4" key={room.id}>
            <div className="card shadow">
              <img src={images[i % images.length]} className="card-img-top" />

              <div className="card-body">
                <h5>{room.type}</h5>
                <p>₹{room.price}</p>

                <button
                  className="btn btn-primary w-100"
                  onClick={() => navigate(`/book/${room.id}`)}
                >
                  Book Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Rooms;