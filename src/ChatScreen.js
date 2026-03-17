import React, { useState } from 'react';
import { encryptMessage, decryptMessage } from './encryption';
import './ChatScreen.css';

const contacts = [
  { id: 1, name: 'AuraBot 🤖', message: 'Hey! Kaise ho aaj? 🥺', time: '9:00 AM', online: true, special: true },
  { id: 2, name: 'Rahul', message: 'Bhai kya chal raha hai?', time: '8:45 AM', online: true },
  { id: 3, name: 'Priya', message: 'Kal milte hain ✅', time: '8:30 AM', online: false },
  { id: 4, name: 'BCA Friends 👥', message: 'Assignment submit kiya?', time: 'Yesterday', online: false },
  { id: 5, name: 'Mom 👩', message: 'Beta khaana khaya?', time: 'Yesterday', online: true },
];

function ChatScreen() {
  const [selectedContact, setSelectedContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [selfDestruct, setSelfDestruct] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(10);

  const sendMessage = () => {
    if (newMessage.trim() === '') return;

    const encrypted = encryptMessage(newMessage);
    const displayText = decryptMessage(encrypted);
    const msgId = messages.length + 1;

    const newMsg = {
      id: msgId,
      text: displayText,
      encrypted: encrypted,
      sent: true,
      time: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      }),
      selfDestruct: selfDestruct,
      timer: selfDestruct ? timerSeconds : null,
      timeLeft: selfDestruct ? timerSeconds : null,
    };

    setMessages(prev => [...prev, newMsg]);
    setNewMessage('');

    if (selfDestruct) {
      let countdown = timerSeconds;
      const interval = setInterval(() => {
        countdown--;
        setMessages(prev =>
          prev.map(m =>
            m.id === msgId ? { ...m, timeLeft: countdown } : m
          )
        );
        if (countdown <= 0) {
          clearInterval(interval);
          setMessages(prev => prev.filter(m => m.id !== msgId));
        }
      }, 1000);
    }
  };

  const handleKey = (e) => {
    if (e.key === 'Enter') sendMessage();
  };

  return (
    <div className="chat-container">

      {/* LEFT SIDEBAR */}
      <div className="sidebar">
        <div className="sidebar-header">
          <div className="app-name">🔐 CipherTalk</div>
          <div className="avatar">K</div>
        </div>

        <div className="search-box">
          <input
            type="text"
            placeholder="🔍 Search chats..."
            className="search-input"
          />
        </div>

        <div className="contact-list">
          {contacts.map(contact => (
            <div
              key={contact.id}
              className={`contact-item ${selectedContact?.id === contact.id ? 'active' : ''} ${contact.special ? 'special' : ''}`}
              onClick={() => setSelectedContact(contact)}
            >
              <div className="contact-avatar">
                {contact.name[0]}
                {contact.online && <span className="online-dot"></span>}
              </div>
              <div className="contact-info">
                <div className="contact-name">{contact.name}</div>
                <div className="contact-message">{contact.message}</div>
              </div>
              <div className="contact-time">{contact.time}</div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT CHAT AREA */}
      <div className="chat-area">
        {selectedContact ? (
          <>
            <div className="chat-header">
              <div className="chat-avatar">{selectedContact.name[0]}</div>
              <div className="chat-info">
                <div className="chat-name">{selectedContact.name}</div>
                <div className="chat-status">
                  {selectedContact.online ? '🟢 Online' : '⚫ Offline'}
                </div>
              </div>
              <div className="chat-actions">
                <button className="action-btn">📞</button>
                <button className="action-btn">🎥</button>
              </div>
            </div>

            <div className="messages-area">
              {messages.length === 0 && (
                <div className="no-messages">
                  🔐 Messages are end-to-end encrypted
                </div>
              )}
              {messages.map(msg => (
                <div key={msg.id} className={`message ${msg.sent ? 'sent' : 'received'}`}>
                  <div className="message-text">{msg.text}</div>
                  <div className="message-time">
                    {msg.time} ✓✓
                    {msg.selfDestruct && (
                      <span className="timer-badge">
                        💣 {msg.timeLeft}s
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="input-area">
              <button className="attach-btn">📎</button>
              <input
                type="text"
                placeholder="Type a message..."
                className="message-input"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKey}
              />
              <button
                className={`destruct-btn ${selfDestruct ? 'active' : ''}`}
                onClick={() => setSelfDestruct(!selfDestruct)}
                title="Self Destruct"
              >
                💣
              </button>
              {selfDestruct && (
                <select
                  className="timer-select"
                  value={timerSeconds}
                  onChange={(e) => setTimerSeconds(Number(e.target.value))}
                >
                  <option value={10}>10s</option>
                  <option value={30}>30s</option>
                  <option value={60}>60s</option>
                </select>
              )}
              <button className="send-btn" onClick={sendMessage}>➤</button>
            </div>
          </>
        ) : (
          <div className="welcome-screen">
            <div className="welcome-icon">🔐</div>
            <h2>Welcome to CipherTalk</h2>
            <p>Select a chat to start talking</p>
            <p className="encrypted-note">
              All messages are end-to-end encrypted
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatScreen;