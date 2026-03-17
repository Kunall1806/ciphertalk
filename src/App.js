import React, { useState } from 'react';
import './App.css';
import ChatScreen from './ChatScreen';
import AuraBot from './AuraBot';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [activeTab, setActiveTab] = useState('chat');

  if (isLoggedIn) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        
        {/* Top Navigation */}
        <div style={{
          display: 'flex',
          background: '#111118',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          padding: '0 20px',
        }}>
          <button
            onClick={() => setActiveTab('chat')}
            style={{
              background: 'none',
              border: 'none',
              color: activeTab === 'chat' ? '#8b5cf6' : 'rgba(255,255,255,0.4)',
              padding: '16px 24px',
              cursor: 'pointer',
              fontSize: '15px',
              fontWeight: '700',
              borderBottom: activeTab === 'chat' ? '2px solid #8b5cf6' : '2px solid transparent',
              transition: 'all 0.3s',
            }}
          >
            💬 Chats
          </button>
          <button
            onClick={() => setActiveTab('aurabot')}
            style={{
              background: 'none',
              border: 'none',
              color: activeTab === 'aurabot' ? '#8b5cf6' : 'rgba(255,255,255,0.4)',
              padding: '16px 24px',
              cursor: 'pointer',
              fontSize: '15px',
              fontWeight: '700',
              borderBottom: activeTab === 'aurabot' ? '2px solid #8b5cf6' : '2px solid transparent',
              transition: 'all 0.3s',
            }}
          >
            🤖 AuraBot
          </button>
        </div>

        {/* Content */}
       <div style={{ flex: 1, overflow: 'hidden', height: 'calc(100vh - 53px)' }}>
          {activeTab === 'chat' ? <ChatScreen /> : <AuraBot />}
        </div>

      </div>
    );
  }

  return (
    <div className="container">
      <div className="card">
        <div className="logo">🔐 CipherTalk</div>
        <p className="tagline">Your private world. Your AI companion.</p>

        <div className="tabs">
          <button
            className={isLogin ? 'tab active' : 'tab'}
            onClick={() => setIsLogin(true)}
          >Login</button>
          <button
            className={isLogin ? 'tab' : 'tab active'}
            onClick={() => setIsLogin(false)}
          >Register</button>
        </div>

        {isLogin ? (
          <div className="form">
            <input type="email" placeholder="Enter your email" className="input" />
            <input type="password" placeholder="Enter your password" className="input" />
            <button className="btn" onClick={() => setIsLoggedIn(true)}>
              Login to CipherTalk 🔐
            </button>
            <p className="switch">
              New here?{' '}
              <span onClick={() => setIsLogin(false)}>Create account</span>
            </p>
          </div>
        ) : (
          <div className="form">
            <input type="text" placeholder="Your full name" className="input" />
            <input type="email" placeholder="Your email" className="input" />
            <input type="password" placeholder="Create password" className="input" />
            <button className="btn" onClick={() => setIsLoggedIn(true)}>
              Join CipherTalk 🚀
            </button>
            <p className="switch">
              Already have account?{' '}
              <span onClick={() => setIsLogin(true)}>Login</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;