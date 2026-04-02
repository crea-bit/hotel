import { useState, useMemo, useCallback } from "react";
import { Slider, Card, Tag, Button, Rate, Input, Checkbox } from "antd";
import { Link } from "react-router-dom";
import { EnvironmentOutlined, FilterOutlined, SearchOutlined } from "@ant-design/icons";
import debounce from "lodash.debounce";
import hotels from "../data/hotels";

const amenityOptions = ["Free WiFi", "Swimming Pool", "Gym", "Spa", "Free Parking"];

export default function Home() {
  const [price, setPrice] = useState([0, 15000]);
  const [filterType, setFilterType] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

  // Debounced search to prevent excessive filtering
  const debouncedSetSearch = useMemo(
    () => debounce((value) => setDebouncedSearchQuery(value), 200),
    []
  );

  // Update debounced search when searchQuery changes
  const handleSearchChange = useCallback((e) => {
    const value = e.target.value;
    setSearchQuery(value);
    debouncedSetSearch(value);
  }, [debouncedSetSearch]);

  // Memoized filtered hotels to prevent recalculation on every render
  const filteredHotels = useMemo(() => {
    const term = debouncedSearchQuery.toLowerCase();
    const searchMatch = (hotel) => 
      hotel.name.toLowerCase().includes(term) || 
      hotel.location.toLowerCase().includes(term);
    
    // Check if hotel has ALL selected amenities
    const hasAmenities = (hotel) => 
      selectedAmenities.length === 0 || 
      selectedAmenities.every(a => hotel.amenities && hotel.amenities.includes(a));

    return hotels.filter((hotel) => (
      searchMatch(hotel) &&
      hasAmenities(hotel) &&
      hotel.price >= price[0] &&
      hotel.price <= price[1] &&
      (filterType === "All" || hotel.type === filterType)
    ));
  }, [debouncedSearchQuery, selectedAmenities, price, filterType]);

  return (
    <div style={{ background: "var(--bg-color)", minHeight: "100vh" }}>
      
      {/* Hero Banner Series */}
      <div style={{
        background: "linear-gradient(rgba(15, 23, 42, 0.7), rgba(15, 23, 42, 0.9)), url('https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1600') center/cover",
        padding: "100px 20px",
        textAlign: "center",
        color: "white"
      }}>
        <h1 style={{ fontSize: "56px", fontWeight: "800", margin: "0 0 16px 0", color: "white", textShadow: "0 4px 12px rgba(0,0,0,0.5)" }}>
          Find Your Perfect Stay
        </h1>
        <p style={{ fontSize: "22px", opacity: 0.9, maxWidth: "600px", margin: "0 auto 40px auto", color: "#cbd5e1" }}>
          Explore luxury hotels & premium resorts in Hyderabad matching your exact lifestyle.
        </p>

        {/* Global Search Bar */}
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
           <Input 
             size="large" 
             placeholder="Search by hotel name or location in Hyderabad (e.g., Jubilee Hills)"
             prefix={<SearchOutlined style={{ color: "var(--primary)", fontSize: 20, marginRight: 10 }} />}
             value={searchQuery}
             onChange={handleSearchChange}
             style={{ 
               height: 60, 
               fontSize: 18, 
               borderRadius: 30, 
               boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.5)",
               border: "2px solid #334155"
             }}
           />
        </div>
      </div>

      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "40px 20px" }}>
        
        {/* Filters Panel */}
        <div style={{
          background: "var(--card-bg)",
          padding: "24px 32px",
          borderRadius: "var(--radius-lg)",
          boxShadow: "var(--shadow-md)",
          marginBottom: "40px",
          display: "flex",
          flexDirection: "column",
          gap: "24px",
          border: "1px solid #334155"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "40px", flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: 600, fontSize: "18px", color: "var(--primary)" }}>
              <FilterOutlined /> Advanced Filters
            </div>

          <div style={{ flex: 1, minWidth: "250px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontWeight: 500, color: "var(--text-main)" }}>
              <span>Price Range</span>
              <span style={{ color: "var(--primary)" }}>₹{price[0]} - ₹{price[1]}</span>
            </div>
            <Slider
              range
              min={0}
              max={15000}
              step={500}
              value={price}
              onChange={(value) => setPrice(value)}
              trackStyle={[{ backgroundColor: "var(--primary)" }]}
              handleStyle={[{ borderColor: "var(--primary)" }, { borderColor: "var(--primary)" }]}
            />
          </div>

          <div style={{ minWidth: "200px" }}>
            <div style={{ marginBottom: "8px", fontWeight: 500, color: "var(--text-main)" }}>Room Type</div>
            <select
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: "8px",
                border: "1px solid #475569",
                outline: "none",
                fontSize: "15px",
                background: "#0f172a",
                color: "#f8fafc",
                cursor: "pointer"
              }}
              onChange={(e) => setFilterType(e.target.value)}
              value={filterType}
            >
              <option value="All">All Types</option>
              <option value="AC">AC Rooms</option>
              <option value="Non-AC">Non-AC Rooms</option>
            </select>
          </div>
          </div>

          {/* Amenities Row */}
          <div style={{ borderTop: "1px solid #334155", paddingTop: "20px" }}>
            <div style={{ marginBottom: "12px", fontWeight: 500, color: "var(--text-main)" }}>Must-have Amenities</div>
            <Checkbox.Group 
               options={amenityOptions} 
               value={selectedAmenities} 
               onChange={setSelectedAmenities} 
               style={{ color: "var(--text-main)" }}
            />
          </div>
        </div>

        {/* Hotel Grid */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h2 style={{ margin: 0, fontSize: "28px", color: "var(--text-main)" }}>{searchQuery ? "Search Results" : "Available Properties"} ({filteredHotels.length})</h2>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "30px"
        }}>
          {filteredHotels.map((hotel) => (
            <Card 
              key={hotel.id} 
              hoverable
              styles={{ body: { padding: 0 } }}
              style={{ overflow: "hidden", display: "flex", flexDirection: "column", border: "1px solid #334155" }}
            >
              <div style={{ position: "relative" }}>
                <img
                  src={hotel.image}
                  alt={hotel.name}
                  style={{ width: "100%", height: "220px", objectFit: "cover" }}
                />
                <Tag color={hotel.type === "AC" ? "geekblue" : "default"} style={{ position: "absolute", top: 12, right: 12, fontSize: "13px", padding: "4px 8px", borderRadius: "6px", fontWeight: 500, boxShadow: "0 2px 8px rgba(0,0,0,0.6)" }}>
                  {hotel.type}
                </Tag>
              </div>

              <div style={{ padding: "20px", display: "flex", flexDirection: "column", flexGrow: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
                  <h3 style={{ margin: 0, fontSize: "20px", fontWeight: 700, color: "var(--text-main)", lineHeight: 1.2 }}>
                    {hotel.name}
                  </h3>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#94a3b8", marginBottom: "12px", fontSize: "14px", fontWeight: 500 }}>
                  <EnvironmentOutlined /> {hotel.location}
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
                  <Rate disabled defaultValue={Number(hotel.rating)} allowHalf style={{ fontSize: "14px", color: "#f59e0b" }} />
                  <span style={{ fontSize: "14px", color: "#94a3b8", fontWeight: 500 }}>({hotel.rating})</span>
                </div>

                <div style={{ marginTop: "auto", display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "16px", borderTop: "1px solid #334155" }}>
                  <div>
                    <span style={{ fontSize: "14px", color: "#94a3b8" }}>Starts from</span>
                    <div style={{ fontSize: "22px", fontWeight: 800, color: "var(--primary)" }}>
                      ₹{hotel.price} <span style={{ fontSize: "14px", fontWeight: 500, color: "#94a3b8" }}>/night</span>
                    </div>
                  </div>
                  
                  <Link to={`/hotel/${hotel.id}`}>
                    <Button type="primary" size="large" style={{ padding: "0 24px", fontWeight: 600 }}>
                      View Details
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
          
          {filteredHotels.length === 0 && (
            <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "60px", color: "#94a3b8", fontSize: "18px" }}>
              No hotels found matching "{searchQuery}" with these filters.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}