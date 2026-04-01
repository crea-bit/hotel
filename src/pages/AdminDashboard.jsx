import { useState, useEffect } from "react";
import { Table, Card, Typography, Statistic, Row, Col, Tag, Button, message } from "antd";
import { DashboardOutlined, DollarOutlined, UserOutlined } from "@ant-design/icons";
import { BASE_URL } from "../api";

const { Title } = Typography;

export default function AdminDashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/bookings`);
      if (res.ok) {
        const data = await res.json();
        setBookings(data || []);
      } else {
        // Fallback to local storage if API lacks GET method or fails
        const localData = JSON.parse(localStorage.getItem("bookings") || "[]");
        setBookings(localData);
      }
    } catch (err) {
      console.warn("Backend /api/bookings GET failed, showing local mocks.");
      const localData = JSON.parse(localStorage.getItem("bookings") || "[]");
      setBookings(localData);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'Booking ID',
      dataIndex: 'id',
      key: 'id',
      render: (text, record, index) => <Tag color="geekblue">#{record.id || index + 1000}</Tag>,
    },
    {
      title: 'Hotel Name',
      dataIndex: 'hotelName',
      key: 'hotelName',
      render: text => <strong>{text}</strong>,
    },
    {
      title: 'Check In',
      dataIndex: 'checkIn',
      key: 'checkIn',
    },
    {
      title: 'Phone',
      dataIndex: 'primaryGuestPhone',
      key: 'phone',
    },
    {
      title: 'Total Price',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      render: price => `₹${price}`,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: status => {
        let color = status?.includes("Paid") ? 'green' : 'gold';
        return <Tag color={color}>{status || 'Paid'}</Tag>;
      },
    }
  ];

  const totalRevenue = bookings.reduce((acc, curr) => acc + (curr.totalPrice || 0), 0);

  return (
    <div style={{ maxWidth: 1200, margin: "40px auto", padding: "0 20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 30 }}>
        <Title level={2}><DashboardOutlined /> Admin Console</Title>
        <Button onClick={fetchBookings} loading={loading}>Refresh Data</Button>
      </div>

      <Row gutter={[24, 24]} style={{ marginBottom: 30 }}>
        <Col xs={24} sm={8}>
          <Card style={{ borderRadius: 12, boxShadow: "var(--shadow-sm)" }}>
            <Statistic 
              title="Total active reservations" 
              value={bookings.length} 
              prefix={<UserOutlined />} 
              valueStyle={{ color: 'var(--primary)', fontWeight: 'bold' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card style={{ borderRadius: 12, boxShadow: "var(--shadow-sm)" }}>
            <Statistic 
              title="Total Revenue Generated" 
              value={totalRevenue} 
              prefix={<DollarOutlined />} 
              suffix="NR"
              valueStyle={{ color: '#10b981', fontWeight: 'bold' }}
            />
          </Card>
        </Col>
      </Row>

      <Card style={{ borderRadius: 12, boxShadow: "var(--shadow-md)" }}>
        <Title level={4} style={{ marginBottom: 20 }}>Recent Bookings ledger</Title>
        <Table 
          columns={columns} 
          dataSource={bookings} 
          loading={loading}
          rowKey={(record, index) => record.id || index}
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  );
}