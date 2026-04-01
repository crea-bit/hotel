import { useState, useEffect } from "react";
import { Button, Card, Input, Row, Col, Typography, message, Divider } from "antd";
import { CreditCardOutlined, LockOutlined, CalendarOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../api";

const { Title, Text } = Typography;

export default function Payment() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [bookingData, setBookingData] = useState(null);

  useEffect(() => {
    const data = localStorage.getItem("pendingBooking");
    if (data) {
      setBookingData(JSON.parse(data));
    } else {
      message.error("No pending booking found. Redirecting...");
      navigate("/");
    }
  }, [navigate]);

  const handlePayment = async () => {
    if (!bookingData) return;

    let bookingPayload = null;

    setLoading(true);
    // In a real app, you'd process Stripe/Razorpay here
    // We simulate a 1.5s bank processing time
    setTimeout(async () => {
      try {
        // Map complex frontend state to the exact Java Backend Model (guestName, phone, age)
        const javaBackendPayload = {
          guestName: bookingData.guests && bookingData.guests.length > 0 ? bookingData.guests[0].name : "Unknown Guest",
          phone: bookingData.primaryGuestPhone || "Not Provided",
          age: bookingData.guests && bookingData.guests.length > 0 ? bookingData.guests[0].age : "Adult"
        };
        bookingPayload = { ...bookingData, ...javaBackendPayload, status: "Paid & Confirmed" };

        const res = await fetch(`${BASE_URL}/api/bookings`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(javaBackendPayload)
        });

        if (res.ok) {
          // Keep local copy for MyBookings view (this app currently uses localStorage for history)
          const existing = JSON.parse(localStorage.getItem("bookings") || "[]");
          existing.push(bookingPayload);
          localStorage.setItem("bookings", JSON.stringify(existing));

          message.success("Payment Successful! 🎉 Your booking is confirmed.");
          localStorage.removeItem("pendingBooking");
          navigate("/bookings"); // Route to user's booking history
        } else {
          message.error("Backend refused the booking payload. Saving locally for fallback.");
          // Fallback if backend /api/bookings is not available yet:
          const existing = JSON.parse(localStorage.getItem("bookings") || "[]");
          existing.push(bookingPayload);
          localStorage.setItem("bookings", JSON.stringify(existing));
          localStorage.removeItem("pendingBooking");
          navigate("/bookings");
        }
      } catch (err) {
        console.error(err);
        message.warning("Backend offline. Simulating success using mock data!");
        // Mock success fallback
        const existing = JSON.parse(localStorage.getItem("bookings") || "[]");
        existing.push({ ...bookingPayload, status: "Paid (Local fallback)" });
        localStorage.setItem("bookings", JSON.stringify(existing));
        localStorage.removeItem("pendingBooking");
        navigate("/bookings");
      } finally {
        setLoading(false);
      }
    }, 1500);
  };

  if (!bookingData) return <div style={{ textAlign: "center", padding: 50 }}>Loading Secure Gateway...</div>;

  return (
    <div style={{ maxWidth: 800, margin: "40px auto", padding: "0 20px" }}>
      <Title level={2} style={{ textAlign: "center", marginBottom: 30 }}><LockOutlined /> Secure Checkout</Title>

      <Row gutter={[24, 24]}>
        {/* Credit Card Form */}
        <Col xs={24} md={14}>
          <Card title="Payment Details" style={{ borderRadius: 12, boxShadow: "var(--shadow-sm)" }}>
            <div style={{ marginBottom: 20 }}>
              <Text strong>Card Number</Text>
              <Input 
                size="large" 
                placeholder="0000 0000 0000 0000" 
                prefix={<CreditCardOutlined style={{ color: "#9ca3af" }} />} 
                maxLength={19}
              />
            </div>

            <Row gutter={16} style={{ marginBottom: 20 }}>
              <Col span={12}>
                <Text strong>Expiration Date</Text>
                <Input 
                  size="large" 
                  placeholder="MM/YY" 
                  prefix={<CalendarOutlined style={{ color: "#9ca3af" }} />} 
                  maxLength={5}
                />
              </Col>
              <Col span={12}>
                <Text strong>CVC</Text>
                <Input 
                  size="large" 
                  placeholder="123" 
                  type="password"
                  maxLength={4}
                />
              </Col>
            </Row>

            <div style={{ marginBottom: 30 }}>
              <Text strong>Cardholder Name</Text>
              <Input size="large" placeholder="Name on card" defaultValue={bookingData.primaryGuestPhone || ""} />
            </div>

            <Button 
              type="primary" 
              size="large" 
              block 
              loading={loading} 
              onClick={handlePayment}
              style={{ height: 50, fontSize: 18 }}
            >
              Pay ₹{bookingData.totalPrice}
            </Button>
            <div style={{ textAlign: "center", marginTop: 10 }}>
              <Text type="secondary" style={{ fontSize: 12 }}><LockOutlined /> 256-bit SSL Encryption Guarantee</Text>
            </div>
          </Card>
        </Col>

        {/* Order Summary */}
        <Col xs={24} md={10}>
          <Card 
            title="Order Summary" 
            styles={{ header: { background: "#f9fafb" } }}
            style={{ borderRadius: 12, boxShadow: "var(--shadow-sm)" }}
          >
            <Title level={5}>{bookingData.hotelName}</Title>
            <Text type="secondary">Dates: {bookingData.checkIn} to {bookingData.checkOut}</Text>
            <Divider />
            
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <Text>Total Guests:</Text>
              <Text>{bookingData.guests.length}</Text>
            </div>
            
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <Text>Amount Payable:</Text>
              <Text strong>₹{bookingData.totalPrice}</Text>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}