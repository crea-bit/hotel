import { Input, Button, Card, message } from "antd";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { BASE_URL } from "../api";

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({ email: "", password: "" });

  const handleLogin = async () => {
    if (!user.email || !user.password) {
      return message.warning("Please enter your email and password!");
    }

    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user)
      });
      
      const data = await response.json().catch(() => null);

      if (response.ok) {
        // Assume backend returns a token or user info
        localStorage.setItem("authToken", data?.token || "mock-token-from-backend");
        localStorage.setItem("userEmail", user.email);
        message.success("Login Success ✅ Welcome back!");
        
        // Dispatch custom event to update Navbar immediately
        window.dispatchEvent(new Event("storage"));
        navigate("/");
      } else {
        if (response.status === 404) {
          // Fallback to local storage if API doesn't exist
          const mockUsers = JSON.parse(localStorage.getItem("mockUsers") || "[]");
          const found = mockUsers.find(u => u.email === user.email && u.password === user.password);
          if (found) {
            message.warning("Backend API missing. Using Local Storage Login!");
            localStorage.setItem("authToken", "mock-token-fallback");
            localStorage.setItem("userEmail", user.email);
            window.dispatchEvent(new Event("storage"));
            setTimeout(() => navigate("/"), 1000);
          } else {
            message.error("Invalid Email or Password (Local Check) ❌");
          }
        } else {
          message.error(data?.message || "Invalid Email or Password ❌");
        }
      }
    } catch (error) {
      console.error("Login Error:", error);
      // Fallback to local storage if API is offline
      const mockUsers = JSON.parse(localStorage.getItem("mockUsers") || "[]");
      const found = mockUsers.find(u => u.email === user.email && u.password === user.password);
      if (found) {
        message.warning("Backend Offline. Using Local Storage Login!");
        localStorage.setItem("authToken", "mock-token-fallback");
        localStorage.setItem("userEmail", user.email);
        window.dispatchEvent(new Event("storage"));
        setTimeout(() => navigate("/"), 1000);
      } else {
        message.error("Invalid Email or Password (Local Check) ❌");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh" }}>
      <Card style={{ width: 400, textAlign: "center", padding: "20px 10px" }}>
        <h2 className="premium-gradient-text" style={{ marginBottom: 30, fontSize: "28px", fontWeight: "bold" }}>Welcome Back</h2>

        <div style={{ textAlign: "left", marginBottom: "8px", fontWeight: "500", color: "#4b5563" }}>Email Address</div>
        <Input 
          size="large"
          type="email"
          placeholder="john@example.com"
          value={user.email}
          onChange={(e) => setUser({ ...user, email: e.target.value })}
          style={{ marginBottom: 20 }}
        />

        <div style={{ textAlign: "left", marginBottom: "8px", fontWeight: "500", color: "#4b5563" }}>Password</div>
        <Input.Password 
          size="large"
          placeholder="••••••••"
          value={user.password}
          onChange={(e) => setUser({ ...user, password: e.target.value })}
          onPressEnter={handleLogin}
          style={{ marginBottom: 30 }}
        />

        <Button 
          type="primary" 
          block 
          size="large" 
          onClick={handleLogin} 
          loading={loading}
          style={{ fontSize: "16px" }}
        >
          Login securely
        </Button>
        
        <p style={{ marginTop: 20, color: "#6b7280" }}>
          Don't have an account? <Link to="/signup" style={{ color: "var(--primary)", fontWeight: "500" }}>Sign up for free</Link>
        </p>
      </Card>
    </div>
  );
}