import { Input, Button, Card } from "antd";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Register() {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    name: "",
    email: "",
    password: ""
  });

  const signup = () => {
    localStorage.setItem("userEmail", user.email);
    localStorage.setItem("userName", user.name);

    alert("Signup Success 🎉");
    navigate("/login");
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: 100 }}>
      <Card style={{ width: 400 }}>
        <h2>Signup</h2>

        <Input placeholder="Name"
          onChange={(e) => setUser({ ...user, name: e.target.value })}
        /><br /><br />

        <Input placeholder="Email"
          onChange={(e) => setUser({ ...user, email: e.target.value })}
        /><br /><br />

        <Input.Password placeholder="Password"
          onChange={(e) => setUser({ ...user, password: e.target.value })}
        /><br /><br />

        <Button type="primary" block onClick={signup}>
          Signup
        </Button>
      </Card>
    </div>
  );
}