import React, { useState, useEffect, useRef } from 'react';
import { Button, Input, Card, Typography, Avatar, Spin, Space } from 'antd';
import { MessageOutlined, CloseOutlined, RobotOutlined, UserOutlined, SendOutlined } from '@ant-design/icons';
import hotels from '../data/hotels.js';

const { Text } = Typography;

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'model', content: "Hi! I'm your AI concierge. Looking for a hotel? Ask me!" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    setTimeout(() => {
      const lowerInput = input.toLowerCase();
      const priceMatch = lowerInput.match(/\d{3,4}/);
      let botReply = "";
      
      if (priceMatch) {
         const budget = parseInt(priceMatch[0]);
         const affordableHotels = hotels.filter(h => h.price <= budget + 500);
         if (affordableHotels.length > 0) {
             const best = affordableHotels.sort((a,b) => b.rating - a.rating)[0];
             botReply += `Based on your budget around ₹${budget}, I completely insist you book **${best.name}** in ${best.location}. It's a fantastic deal at just ₹${best.price} and boasts a stellar ${best.rating} rating!`;
         } else {
             botReply += `I couldn't find any premium hotels under ₹${budget}. Our luxurious properties start slightly higher.`;
         }
      } else if (lowerInput.includes('best') || lowerInput.includes('recommend')) {
         const topRated = [...hotels].sort((a,b) => b.rating - a.rating)[0];
         botReply += `Our absolute best-rated property right now is **${topRated.name}** with a pristine rating of ${topRated.rating}! It features incredible amenities like ${topRated.amenities.slice(0, 2).join(' and ')}.`;
      } else {
         botReply += "Are you looking for a hotel within a specific price range? Try asking me 'Recommend the best hotel under 2000'!";
      }

      setMessages(prev => [...prev, { role: 'model', content: botReply }]);
      setLoading(false);
    }, 1200);
  };

  return (
    <>
      <Button 
        type="primary" 
        shape="circle" 
        size="large" 
        icon={isOpen ? <CloseOutlined /> : <MessageOutlined />} 
        style={{
          position: 'fixed',
          bottom: 30,
          right: 30,
          width: 60,
          height: 60,
          boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#818cf8',
          border: 'none'
        }}
        onClick={() => setIsOpen(!isOpen)}
      />

      {isOpen && (
        <Card 
          title={<Space><RobotOutlined /> AI Concierge</Space>}
          style={{
            position: 'fixed',
            bottom: 110,
            right: 30,
            width: 360,
            height: 520,
            boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            borderRadius: '16px',
            backgroundColor: '#1e293b',
            border: '1px solid #334155'
          }}
          styles={{ header: { padding: '12px 16px', borderBottom: '1px solid #334155', color: '#fff', fontWeight: 600 }, body: { padding: 0, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' } }}
        >
          <div style={{ flex: 1, padding: 16, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
            {messages.map((msg, idx) => (
              <div key={idx} style={{ 
                display: 'flex', 
                flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                alignItems: 'flex-end',
                gap: 8
              }}>
                <Avatar 
                  size={32}
                  icon={msg.role === 'user' ? <UserOutlined /> : <RobotOutlined />} 
                  style={{ backgroundColor: msg.role === 'user' ? '#1677ff' : '#818cf8', flexShrink: 0 }}
                />
                <div style={{
                  maxWidth: '75%',
                  padding: '10px 14px',
                  borderRadius: '14px',
                  backgroundColor: msg.role === 'user' ? '#1677ff' : '#334155',
                  color: '#fff',
                  borderBottomRightRadius: msg.role === 'user' ? 4 : 14,
                  borderBottomLeftRadius: msg.role === 'model' ? 4 : 14,
                  fontSize: '0.95rem',
                  lineHeight: '1.4'
                }}>
                  <div style={{ wordWrap: 'break-word', whiteSpace: 'pre-wrap' }}>{msg.content}</div>
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
                <Avatar size={32} icon={<RobotOutlined />} style={{ backgroundColor: '#818cf8', flexShrink: 0 }} />
                <div style={{ padding: '10px 14px', borderRadius: '14px', borderBottomLeftRadius: 4, backgroundColor: '#334155' }}>
                  <Spin size="small" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div style={{ padding: '12px 16px', backgroundColor: '#1e293b', borderTop: '1px solid #334155' }}>
            <Input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onPressEnter={handleSend}
              placeholder="Ask me anything..."
              variant="filled"
              disabled={loading}
              suffix={<Button type="text" shape="circle" icon={<SendOutlined />} onClick={handleSend} disabled={loading || !input.trim()} style={{ color: input.trim() ? '#818cf8' : '#64748b' }} />}
              style={{ borderRadius: '24px', backgroundColor: '#0f172a', paddingLeft: '16px', paddingRight: '8px' }}
            />
          </div>
        </Card>
      )}
    </>
  );
}
