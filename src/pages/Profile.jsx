import { useEffect, useState } from "react";
import { Card, Avatar, Typography, Divider, Spin, message, Descriptions } from "antd";
import { UserOutlined, SettingOutlined, MailOutlined, EditOutlined } from "@ant-design/icons";
import { BASE_URL } from "../api";

const { Title, Text } = Typography;

export default function Profile() {
  const [bookingsCount, setBookingsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fallback info if API is completely unavailable
  const email = localStorage.getItem("userEmail") || "guest@hotelreserve.com";
  const userName = email.split('@')[0];

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/bookings`);
        if (res.ok) {
           const data = await res.json();
           setBookingsCount(data.length); // In a real app filter by user ID
        } else {
           const localData = JSON.parse(localStorage.getItem("bookings") || "[]");
           setBookingsCount(localData.length);
        }
      } catch (err) {
        const localData = JSON.parse(localStorage.getItem("bookings") || "[]");
        setBookingsCount(localData.length);
      } finally {
        setLoading(false);
      }
    };
    fetchProfileData();
  }, []);

  return (
    <div style={{ maxWidth: 800, margin: "60px auto", padding: "0 20px" }}>
      <Card 
        style={{ borderRadius: 16, overflow: "hidden", border: "1px solid #334155" }}
        styles={{ body: { padding: 0 } }}
      >
        {/* Profile Header/Cover */}
        <div style={{ 
          height: 180, 
          background: "var(--header-bg)",
          position: "relative"
        }}>
           <div style={{ 
             position: "absolute", 
             bottom: -50, 
             left: 40, 
             padding: 6, 
             background: "var(--card-bg)", 
             borderRadius: "50%"
           }}>
             <Avatar size={100} icon={<UserOutlined />} style={{ backgroundColor: '#475569', border: "4px solid var(--card-bg)" }} />
           </div>
        </div>

        {/* Profile Details */}
        <div style={{ padding: "60px 40px 40px 40px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <Title level={2} style={{ margin: 0, textTransform: "capitalize" }}>{userName}</Title>
              <Text type="secondary" style={{ fontSize: 16 }}><MailOutlined /> {email}</Text>
              
              <div style={{ marginTop: 20 }}>
                <Text type="secondary" style={{ fontSize: 16 }}>Status: </Text>
                <Text style={{ color: "#10b981", fontWeight: "bold" }}>Verified Premium Member</Text>
              </div>
            </div>
            
            <div style={{ display: "flex", gap: 10 }}>
              <Avatar size="large" icon={<SettingOutlined />} style={{ background: "transparent", border: "1px solid #475569", color: "#94a3b8", cursor: "pointer" }} />
              <Avatar size="large" icon={<EditOutlined />} style={{ background: "var(--primary)", cursor: "pointer" }} />
            </div>
          </div>

          <Divider style={{ borderColor: "#334155" }} />

          {loading ? <Spin /> : (
            <Descriptions title="Account Overview" column={1} labelStyle={{ color: "#94a3b8" }}>
              <Descriptions.Item label="Lifetime Bookings">{bookingsCount} trips</Descriptions.Item>
              <Descriptions.Item label="Loyalty Points">{(bookingsCount * 150) || 500} pts</Descriptions.Item>
              <Descriptions.Item label="Member Since">March 2026</Descriptions.Item>
              <Descriptions.Item label="Saved Payment Methods">xxxx-xxxx-xxxx-4491</Descriptions.Item>
            </Descriptions>
          )}

        </div>
      </Card>
    </div>
  );
}