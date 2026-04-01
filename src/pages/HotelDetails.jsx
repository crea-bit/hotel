import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Rate, Button, Divider, Tag, Typography, Row, Col, Card } from "antd";
import { EnvironmentOutlined, CheckCircleOutlined, StarFilled, ArrowLeftOutlined, UserOutlined } from "@ant-design/icons";
import allHotels from "../data/hotels";

const { Title, Text, Paragraph } = Typography;

export default function HotelDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hotel, setHotel] = useState(null);

  useEffect(() => {
    const found = allHotels.find(h => h.id === parseInt(id));
    if (found) setHotel(found);
    window.scrollTo(0, 0); // Scroll to top on load
  }, [id]);

  if (!hotel) return <div style={{ padding: 100, textAlign: 'center' }}>Loading Hotel Portfolio...</div>;

  return (
    <div style={{ background: "var(--bg-color)", minHeight: "100vh", paddingBottom: 100 }}>
      {/* Majestic Hero Banner */}
      <div style={{ position: "relative", height: "60vh", minHeight: 400, width: "100%" }}>
        <img 
          src={hotel.image} 
          alt={hotel.name} 
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", filter: "brightness(0.85)" }} 
        />
        <div style={{ position: "absolute", bottom: 0, left: 0, width: "100%", background: "linear-gradient(transparent, var(--bg-color))", height: "50%" }}></div>
        
        <div style={{ position: "absolute", bottom: 40, left: "5%", right: "5%", maxWidth: 1200, margin: "0 auto" }}>
          <Button type="text" onClick={() => navigate(-1)} icon={<ArrowLeftOutlined />} style={{ color: "white", marginBottom: 20, fontSize: 16 }}>
            Back to Search
          </Button>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-end" }}>
            <div>
              <Tag color={hotel.type === "AC" ? "geekblue" : "default"} style={{ marginBottom: 16, fontSize: 14, padding: "4px 12px" }}>
                {hotel.type} Suite
              </Tag>
              <Title level={1} style={{ color: "white", margin: 0, fontSize: "48px", fontWeight: 800 }}>{hotel.name}</Title>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 10 }}>
                <Rate disabled defaultValue={Number(hotel.rating)} allowHalf style={{ color: "#f59e0b", fontSize: 18 }} />
                <span style={{ color: "white", fontSize: 16, fontWeight: 500 }}>{hotel.rating} / 5.0 (124 Reviews)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "40px auto", padding: "0 20px" }}>
        <Row gutter={[40, 40]}>
          {/* Main Info Column */}
          <Col xs={24} md={16}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#94a3b8", fontSize: "18px", marginBottom: 20 }}>
              <EnvironmentOutlined style={{ color: "var(--primary)", fontSize: 22 }}/> {hotel.location}
            </div>
            
            <Title level={3} style={{ color: "var(--text-main)", marginTop: 40 }}>About this property</Title>
            <Paragraph style={{ color: "#cbd5e1", fontSize: 16, lineHeight: 1.8 }}>
              {hotel.description}
            </Paragraph>

            <Divider style={{ borderColor: "#334155", margin: "40px 0" }} />

            <Title level={3} style={{ color: "var(--text-main)", marginBottom: 20 }}>Premium Amenities</Title>
            <Row gutter={[16, 24]}>
              {hotel.amenities.map(amenity => (
                <Col xs={12} sm={8} key={amenity}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, color: "#f8fafc", fontSize: 16 }}>
                    <CheckCircleOutlined style={{ color: "#10b981", fontSize: 18 }} />
                    {amenity}
                  </div>
                </Col>
              ))}
            </Row>

            <Divider style={{ borderColor: "#334155", margin: "40px 0" }} />

            <Title level={3} style={{ color: "var(--text-main)", marginBottom: 20 }}>Guest Reviews</Title>
            {[
              { name: "Arjun R.", date: "March 2026", text: "Absolutely stunning interior design. The staff was incredibly welcoming and our suite was spotless. Highly recommend!" },
              { name: "Priya S.", date: "February 2026", text: `I loved the ${hotel.amenities[0] ? hotel.amenities[0].toLowerCase() : 'ambience'}. The location is perfect for navigating Hyderabad without dealing with too much traffic.` },
            ].map((rev, idx) => (
              <Card key={idx} style={{ background: "transparent", border: "1px solid #334155", borderRadius: 12, marginBottom: 16 }}>
                <div style={{ display: "flex", gap: 16 }}>
                  <div style={{ width: 48, height: 48, borderRadius: "50%", background: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 20, fontWeight: "bold" }}>
                    {rev.name.charAt(0)}
                  </div>
                  <div>
                    <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 4 }}>
                      <Text style={{ color: "var(--text-main)", fontWeight: "bold", fontSize: 16 }}>{rev.name}</Text>
                      <Text type="secondary" style={{ fontSize: 12 }}>{rev.date}</Text>
                    </div>
                    <div>
                      <StarFilled style={{ color: "#f59e0b", fontSize: 12 }} /> <StarFilled style={{ color: "#f59e0b", fontSize: 12 }} /> <StarFilled style={{ color: "#f59e0b", fontSize: 12 }} /> <StarFilled style={{ color: "#f59e0b", fontSize: 12 }} /> <StarFilled style={{ color: "#f59e0b", fontSize: 12 }} />
                    </div>
                    <Text style={{ color: "#cbd5e1", display: "block", marginTop: 8 }}>{rev.text}</Text>
                  </div>
                </div>
              </Card>
            ))}
          </Col>

          {/* Sticky Reservation Form / Price Card */}
          <Col xs={24} md={8}>
            <div style={{ position: "sticky", top: 100 }}>
              <Card style={{ borderRadius: 16, boxShadow: "var(--shadow-lg)", border: "1px solid #334155" }}>
                <div style={{ marginBottom: 24 }}>
                  <span style={{ fontSize: "32px", fontWeight: 800, color: "var(--primary)" }}>₹{hotel.price}</span>
                  <span style={{ color: "#94a3b8", fontSize: "16px", fontWeight: 500 }}> / night</span>
                </div>
                
                <div style={{ background: "#0f172a", borderRadius: 8, padding: 16, marginBottom: 24, border: "1px solid #334155" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, color: "#cbd5e1" }}>
                    <span>Excellent location</span>
                    <EnvironmentOutlined style={{ color: "#10b981" }}/>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", color: "#cbd5e1" }}>
                    <span>Highly rated staff</span>
                    <UserOutlined style={{ color: "#10b981" }}/>
                  </div>
                </div>

                <Button 
                  type="primary" 
                  size="large" 
                  block 
                  style={{ height: 55, fontSize: "18px", fontWeight: 600, borderRadius: 8 }}
                  onClick={() => navigate(`/book/${hotel.id}`)}
                >
                  Reserve Your Stay
                </Button>
                <div style={{ textAlign: "center", marginTop: 16, color: "#94a3b8", fontSize: 13 }}>
                  You won't be charged yet.
                </div>
              </Card>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
}
