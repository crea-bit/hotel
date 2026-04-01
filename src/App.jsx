import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ConfigProvider, theme } from "antd";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Payment from "./pages/Payment";
import AdminDashboard from "./pages/AdminDashboard";
import BookRoom from "./pages/BookRoom";
import MyBookings from "./pages/MyBookings";
import Profile from "./pages/Profile";
import HotelDetails from "./pages/HotelDetails";
import ChatBot from "./components/ChatBot";

export default function App() {
  return (
    <ConfigProvider 
      theme={{ 
        algorithm: theme.darkAlgorithm,
        token: {
          colorPrimary: '#818cf8',
          colorBgContainer: '#1e293b', 
          colorBgElevated: '#334155',
          fontFamily: "'Inter', sans-serif"
        }
      }}
    >
      <BrowserRouter>
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/book/:id" element={<BookRoom />} />
          <Route path="/bookings" element={<MyBookings />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/hotel/:id" element={<HotelDetails />} />
        </Routes>
        <ChatBot />
      </BrowserRouter>
    </ConfigProvider>
  );
}