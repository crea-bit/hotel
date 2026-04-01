import { useState, useEffect } from "react";
import { Card, Typography, Empty, Tag, Button, Popconfirm, message } from "antd";
import { Link } from "react-router-dom";
import { BASE_URL } from "../api";

const { Title, Text } = Typography;

export default function MyBookings() {
  const [data, setData] = useState([]);

  useEffect(() => {
    // In a real app we'd fetch from backend by userId: GET /api/users/{id}/bookings
    // For now we try local storage since they are mocked there when backend fails
    const localData = JSON.parse(localStorage.getItem("bookings")) || [];
    setData(localData);
  }, []);

  const handleCancel = (index) => {
    // In a real application, you'd send a DELETE/PUT request to your backend:
    // await fetch(`${BASE_URL}/api/bookings/${bookingId}`, { method: 'DELETE' })
    
    const localData = JSON.parse(localStorage.getItem("bookings")) || [];
    localData[index].status = "Cancelled";
    localStorage.setItem("bookings", JSON.stringify(localData));
    
    // Update local Component State
    const updatedData = [...data];
    updatedData[index].status = "Cancelled";
    setData(updatedData);
    
    message.success("Booking successfully cancelled. Any applicable refund has been initiated.");
  };

  return (
    <div style={{ maxWidth: 800, margin: "40px auto", padding: "0 20px" }}>
      <Title level={2} style={{ marginBottom: 30 }}>My Bookings</Title>

      {data.length === 0 ? (
        <Empty description="You have no bookings yet." style={{ marginTop: 50 }}>
          <Link to="/">
            <Button type="primary">Explore Hotels</Button>
          </Link>
        </Empty>
      ) : (
        data.map((b, i) => (
          <Card 
            key={i} 
            style={{ marginBottom: 20, borderRadius: 12, boxShadow: "var(--shadow-sm)" }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", ...{ gap: 15 } }}>
              <div>
                <Title level={4} style={{ margin: 0 }}>{b.hotelName || "Unknown Hotel"}</Title>
                <Text type="secondary">{b.checkIn} to {b.checkOut}</Text>
                
                <div style={{ marginTop: 10 }}>
                  <Text strong>Guests: </Text>
                  {b.guests && b.guests.length > 0 ? b.guests.map(g => g.name).join(", ") : "Not specified"}
                </div>
              </div>

              <div style={{ textAlign: "right" }}>
                <Title level={4} style={{ margin: 0, color: "var(--primary)" }}>₹{b.totalPrice}</Title>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-end', marginTop: 12 }}>
                  <Tag color={b.status === "Cancelled" ? "red" : b.status === "Pending Payment" ? "gold" : "green"}>
                    {b.status || "Confirmed"}
                  </Tag>

                  {b.status !== "Cancelled" && (
                    <Popconfirm
                      title="Cancel this reservation?"
                      description="Are you sure you want to cancel? This action cannot be undone."
                      onConfirm={() => handleCancel(i)}
                      okText="Yes, Cancel Booking"
                      cancelText="No, Keep It"
                    >
                      <Button danger type="dashed" size="small">Cancel Booking</Button>
                    </Popconfirm>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))
      )}
    </div>
  );
}