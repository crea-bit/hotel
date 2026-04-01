import { Card, Row, Col, Statistic, Button } from "antd";
import { useNavigate } from "react-router-dom";
import { BookOutlined, HomeOutlined, UsergroupAddOutlined } from "@ant-design/icons";
import allHotels from "../data/hotels";

export default function Dashboard() {
  const navigate = useNavigate();
  // Simply pull the first 4 real hotels to replace the fake hardcoded ones!
  const topPickedHotels = allHotels.slice(0, 4);

  return (
    <div style={{ padding: "40px 20px", maxWidth: 1200, margin: "0 auto" }}>
      <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 20 }}>Welcome back 👋</h2>

      {/* 🔥 STATS */}
      <Row gutter={[16, 16]} style={{ marginBottom: 40 }}>
        <Col xs={24} sm={8}>
          <Card style={{ borderRadius: 12, boxShadow: "var(--shadow-sm)" }}>
            <Statistic title="Total Bookings" value={12} prefix={<BookOutlined style={{color: "var(--primary)"}}/>} />
          </Card>
        </Col>

        <Col xs={24} sm={8}>
          <Card style={{ borderRadius: 12, boxShadow: "var(--shadow-sm)" }}>
            <Statistic title="Available Rooms" value={120} prefix={<HomeOutlined style={{color: "#10b981"}}/>} />
          </Card>
        </Col>

        <Col xs={24} sm={8}>
          <Card style={{ borderRadius: 12, boxShadow: "var(--shadow-sm)" }}>
            <Statistic title="Registered Users" value={45} prefix={<UsergroupAddOutlined style={{color: "#f59e0b"}}/>} />
          </Card>
        </Col>
      </Row>

      {/* 🔥 HOTEL CARDS */}
      <h3 style={{ fontSize: 22, fontWeight: 600, marginBottom: 20 }}>Featured Deals</h3>
      <Row gutter={[20, 20]}>
        {topPickedHotels.map((h) => (
          <Col xs={24} sm={12} md={6} key={h.id}>
            <Card
              hoverable
              styles={{ body: { padding: "16px" } }}
              style={{ borderRadius: 12, overflow: "hidden", display: "flex", flexDirection: "column", height: "100%" }}
              cover={
                <img
                  alt={h.name}
                  src={h.image}
                  style={{ height: 160, objectFit: "cover" }}
                />
              }
            >
              <h3 style={{ fontSize: 18, margin: "0 0 8px 0", color: "var(--text-main)" }}>{h.name}</h3>
              <p style={{ color: "#6b7280", margin: "0 0 16px 0", fontWeight: 500 }}>₹{h.price} / night</p>

              <div style={{ marginTop: "auto" }}>
                <Button
                  type="primary"
                  block
                  onClick={() => navigate(`/hotel/${h.id}`)}
                >
                  View Details
                </Button>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}