import { Input, Button, Card, message } from "antd";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { BASE_URL } from "../api";

export default function Signup() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: ""
  });

  const handleSignup = async () => {
    if (!user.name || !user.email || !user.password) {
      return message.warning("Please fill out all fields!");
    }

    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user)
      });
      
      const data = await response.json().catch(() => null);

      if (response.ok) {
        message.success("Signup Successful ✅ Please Login.");
        navigate("/login");
      } else {
        if (response.status === 404) {
          message.warning("Backend API missing. Saving user to Local Storage instead!");
          const mockUsers = JSON.parse(localStorage.getItem("mockUsers") || "[]");
          mockUsers.push(user);
          localStorage.setItem("mockUsers", JSON.stringify(mockUsers));
          setTimeout(() => navigate("/login"), 1000);
        } else {
          message.error(data?.message || "Signup failed! Email might exist.");
        }
      }
    } catch (error) {
      console.error("Signup error:", error);
      message.warning("Backend Offline. Saving user to Local Storage instead!");
      const mockUsers = JSON.parse(localStorage.getItem("mockUsers") || "[]");
      mockUsers.push(user);
      localStorage.setItem("mockUsers", JSON.stringify(mockUsers));
      setTimeout(() => navigate("/login"), 1000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh" }}>
      <Card style={{ width: 400, textAlign: "center", padding: "20px 10px" }}>
        <h2 className="premium-gradient-text" style={{ marginBottom: 30, fontSize: "28px", fontWeight: "bold" }}>Join Us</h2>

        <div style={{ textAlign: "left", marginBottom: "8px", fontWeight: "500", color: "#4b5563" }}>Full Name</div>
        <Input 
          size="large"
          placeholder="e.g. John Doe"
          value={user.name}
          onChange={e => setUser({...user, name: e.target.value})}
          style={{ marginBottom: 20 }}
        />

        <div style={{ textAlign: "left", marginBottom: "8px", fontWeight: "500", color: "#4b5563" }}>Email Address</div>
        <Input 
          size="large"
          type="email"
          placeholder="john@example.com"
          value={user.email}
          onChange={e => setUser({...user, email: e.target.value})}
          style={{ marginBottom: 20 }}
        />

        <div style={{ textAlign: "left", marginBottom: "8px", fontWeight: "500", color: "#4b5563" }}>Password</div>
        <Input.Password 
          size="large"
          placeholder="••••••••"
          value={user.password}
          onChange={e => setUser({...user, password: e.target.value})}
          style={{ marginBottom: 30 }}
        />

        <Button 
          type="primary" 
          block 
          size="large" 
          onClick={handleSignup} 
          loading={loading}
          style={{ fontSize: "16px" }}
        >
          Create Account
        </Button>
        
        <p style={{ marginTop: 20, color: "#6b7280" }}>
          Already have an account? <Link to="/login" style={{ color: "var(--primary)", fontWeight: "500" }}>Log In</Link>
        </p>
      </Card>
    </div>
  );
}