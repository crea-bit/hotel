import { Button, Avatar, Space, Dropdown } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";

export default function Navbar() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState("User");

  const checkAuth = () => {
    setIsAuthenticated(!!localStorage.getItem("authToken"));
    const email = localStorage.getItem("userEmail") || "";
    if (email) {
      setUserName(email.split('@')[0]);
    }
  };

  useEffect(() => {
    checkAuth();
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  const logout = () => {
    localStorage.clear();
    setIsAuthenticated(false);
    navigate("/login");
  };

  const profileMenu = {
    items: [
      {
        key: '1',
        label: <Link to="/profile">My Profile</Link>,
        icon: <UserOutlined />,
      },
      {
        key: '2',
        danger: true,
        label: <div onClick={logout}>Log out</div>,
        icon: <LogoutOutlined />,
      },
    ],
  };

  return (
    <div style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "16px 40px",
      background: "var(--card-bg)",
      boxShadow: "var(--shadow-md)",
      color: "var(--text-main)",
      position: "sticky",
      top: 0,
      zIndex: 1000,
      borderBottom: "1px solid #334155"
    }}>
      <Link to="/" style={{ textDecoration: "none" }}>
        <h2 style={{ 
          margin: 0, 
          fontSize: "24px", 
          fontWeight: 800, 
          letterSpacing: "-0.5px"
        }}>
          <span className="premium-gradient-text">Hotel</span> Reserve
        </h2>
      </Link>

      <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
        <Link to="/"><Button type="text" style={{ fontWeight: 500, color: "var(--text-main)" }}>Find Stays</Button></Link>
        
        {isAuthenticated ? (
          <>
            <Link to="/bookings"><Button type="text" style={{ fontWeight: 500, color: "var(--text-main)" }}>My Bookings</Button></Link>
            <Link to="/dashboard"><Button type="text" style={{ fontWeight: 500, color: "var(--text-main)" }}>Dashboard</Button></Link>
            <Dropdown menu={profileMenu} placement="bottomRight" trigger={['click']}>
               <Space style={{ cursor: "pointer", marginLeft: 10 }}>
                 <Avatar style={{ backgroundColor: 'var(--primary)', verticalAlign: 'middle' }} size="large">
                   {userName.charAt(0).toUpperCase()}
                 </Avatar>
               </Space>
            </Dropdown>
          </>
        ) : (
          <>
            <Link to="/login"><Button type="default" style={{ fontWeight: 500, borderColor: "var(--primary)", color: "var(--primary)", borderRadius: "6px" }}>Login</Button></Link>
            <Link to="/signup"><Button type="primary" style={{ borderRadius: "6px" }}>Sign Up</Button></Link>
          </>
        )}
      </div>
    </div>
  );
}