import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Form, Input, Button, DatePicker, Select, Card, Divider, Space, message, Row, Col, Typography } from "antd";
import { MinusCircleOutlined, PlusOutlined, CalendarOutlined, SolutionOutlined, CreditCardOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import debounce from "lodash.debounce";
import hotels from "../data/hotels";

const { RangePicker } = DatePicker;
const { Title, Text } = Typography;

export default function BookRoom() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  
  const [hotel, setHotel] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const [days, setDays] = useState(1);
  const [guestCount, setGuestCount] = useState(1);

  // Memoize hotel lookup to avoid recalculating
  const hotelData = useMemo(() => {
    return hotels.find(h => h.id === parseInt(id));
  }, [id]);

  useEffect(() => {
    if (hotelData) {
      setHotel(hotelData);
      setTotalPrice(hotelData.price);
    } else {
      message.error("Hotel not found!");
      navigate("/");
    }
  }, [hotelData, navigate]);

  // Memoized calculation function to avoid recreating on every render
  const calculatePrice = useCallback((dates, guests, basePrice) => {
    if (!basePrice) return basePrice;

    // Calculate Days
    let calculatedDays = 1;
    if (dates && dates[0] && dates[1]) {
      calculatedDays = dates[1].diff(dates[0], 'days');
      if (calculatedDays === 0) calculatedDays = 1;
    }

    // Calculate Guests (Base price covers 1 adult. Extra adult = +500, Child = +250 per day)
    const guestList = guests || [];
    
    let extraCostPerDay = 0;
    guestList.forEach(guest => {
      // First guest is strictly included in base price
      if (guest && guest.type === "Child") {
        extraCostPerDay += 250;
      } else if (guest && guest.type === "Adult") {
        extraCostPerDay += 500;
      }
    });
    
    // Subtract one adult for the primary booker since it's included in base hotel price
    if (guestList.length > 0 && guestList[0]?.type === "Adult") {
       extraCostPerDay -= 500;
       if(extraCostPerDay < 0) extraCostPerDay = 0;
    }

    return (basePrice + extraCostPerDay) * calculatedDays;
  }, []);

  // Debounced values change handler to prevent excessive re-renders
  const debouncedOnValuesChange = useMemo(
    () => debounce((changedValues, allValues) => {
      if (!hotel) return;

      // Calculate Days
      let calculatedDays = 1;
      if (allValues.dates && allValues.dates[0] && allValues.dates[1]) {
        calculatedDays = allValues.dates[1].diff(allValues.dates[0], 'days');
        if (calculatedDays === 0) calculatedDays = 1;
        setDays(calculatedDays);
      }

      // Calculate Guests
      const guests = allValues.guests || [];
      setGuestCount(guests.length);
      
      // Calculate total price
      const newTotal = calculatePrice(allValues.dates, guests, hotel.price);
      setTotalPrice(newTotal);
    }, 150), // 150ms debounce
    [hotel, calculatePrice]
  );

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      debouncedOnValuesChange.cancel();
    };
  }, [debouncedOnValuesChange]);

  const onFinish = useCallback((values) => {
    if (!values.dates || values.dates.length !== 2) {
      return message.error("Please select Check-in and Check-out dates.");
    }

    const bookingPayload = {
      hotelId: hotel.id,
      hotelName: hotel.name,
      checkIn: values.dates[0].format("YYYY-MM-DD"),
      checkOut: values.dates[1].format("YYYY-MM-DD"),
      primaryGuestPhone: values.phone,
      guests: values.guests || [],
      totalPrice: totalPrice,
      status: "Pending Payment"
    };

    // Store pending booking in localStorage so Payment page can process it
    localStorage.setItem("pendingBooking", JSON.stringify(bookingPayload));
    
    message.loading("Processing to secure payment gateway...", 1.5).then(() => {
      navigate("/payment");
    });
  }, [hotel, totalPrice, navigate]);

  if (!hotel) return <div style={{ padding: "50px", textAlign: "center" }}>Loading Hotel Data...</div>;

  return (
    <div style={{ maxWidth: 1000, margin: "40px auto", padding: "0 20px" }}>
      <Title level={2} style={{ marginBottom: 30 }}><SolutionOutlined /> Complete Your Booking</Title>
      
      <Row gutter={[30, 30]}>
        {/* Reservation Form */}
        <Col xs={24} md={16}>
          <Card title="Guest Information" style={{ borderRadius: 12, boxShadow: "var(--shadow-sm)" }}>
            <Form 
              form={form} 
              layout="vertical" 
              onFinish={onFinish}
              onValuesChange={debouncedOnValuesChange}
              initialValues={{ guests: [{ name: "", age: "", type: "Adult" }] }}
            >
              
              <Form.Item name="dates" label="Check-in & Check-out Dates" rules={[{ required: true, message: 'Please select dates' }]}>
                <RangePicker 
                  style={{ width: "100%", padding: "10px" }} 
                  disabledDate={current => current && current < dayjs().startOf('day')}
                />
              </Form.Item>

              <Form.Item name="phone" label="Primary Contact Number" rules={[{ required: true, message: 'Phone is required for reservation' }]}>
                <Input size="large" placeholder="+91 98765 43210" />
              </Form.Item>

              <Divider dashed titlePlacement="left">Register Guests</Divider>
              
              <Form.List name="guests">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, ...restField }, index) => (
                      <Card size="small" style={{ marginBottom: 16, background: "#f9fafb" }} key={key}>
                        <Space style={{ display: 'flex', marginBottom: 8 }} align="baseline" wrap>
                          
                          <Form.Item
                            {...restField}
                            name={[name, 'name']}
                            label={index === 0 ? "Primary Guest Name" : `Guest ${index + 1} Name`}
                            rules={[{ required: true, message: 'Missing name' }]}
                          >
                            <Input placeholder="Full Name" />
                          </Form.Item>

                          <Form.Item
                            {...restField}
                            name={[name, 'age']}
                            label="Age"
                            rules={[{ required: true, message: 'Missing age' }]}
                          >
                            <Input placeholder="e.g. 25" style={{ width: 80 }} />
                          </Form.Item>

                          <Form.Item
                            {...restField}
                            name={[name, 'type']}
                            label="Type"
                          >
                            <Select style={{ width: 120 }}>
                              <Select.Option value="Adult">Adult</Select.Option>
                              <Select.Option value="Child">Child</Select.Option>
                            </Select>
                          </Form.Item>

                          {index > 0 && (
                            <MinusCircleOutlined onClick={() => remove(name)} style={{ color: 'red', marginTop: 35 }} />
                          )}
                        </Space>
                      </Card>
                    ))}
                    <Form.Item>
                      <Button type="dashed" onClick={() => add({ name: "", age: "", type: "Adult" })} block icon={<PlusOutlined />}>
                        Add Another Guest (Adult/Child)
                      </Button>
                    </Form.Item>
                  </>
                )}
              </Form.List>

              <Button type="primary" htmlType="submit" size="large" block style={{ marginTop: 20, height: 50, fontSize: 18 }}>
                <CreditCardOutlined /> Proceed to Payment
              </Button>
            </Form>
          </Card>
        </Col>

        {/* Price Summary */}
        <Col xs={24} md={8}>
          <Card 
            title="Booking Summary" 
            style={{ borderRadius: 12, boxShadow: "var(--shadow-md)", position: "sticky", top: 100 }}
            styles={{ header: { background: "var(--header-bg)", color: "white", borderTopLeftRadius: 12, borderTopRightRadius: 12 } }}
          >
            <img src={hotel.image} alt={hotel.name} style={{ width: "100%", height: 160, objectFit: "cover", borderRadius: 8, marginBottom: 16 }} />
            
            <Title level={4} style={{ margin: 0 }}>{hotel.name}</Title>
            <Text type="secondary">{hotel.location}</Text>
            <Divider />
            
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <Text>Base Price (1 Adult):</Text>
              <Text>₹{hotel.price} / night</Text>
            </div>
            
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <Text>Total Guests:</Text>
              <Text>{guestCount} ({days} {days === 1 ? 'Night' : 'Nights'})</Text>
            </div>
            
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <Text>Taxes & Fees:</Text>
              <Text>Included</Text>
            </div>
            
            <Divider dashed />
            
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Title level={4} style={{ margin: 0 }}>Total amount</Title>
              <Title level={3} style={{ margin: 0, color: "var(--primary)" }}>₹{totalPrice}</Title>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}