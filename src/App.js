import React, { useState } from 'react';
import './App.css';

function App() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="container">
      <div className="card">

        {/* Logo */}
        <div className="logo">
          🔐 CipherTalk
        </div>
        <p className="tagline">
          Your private world. Your AI companion.
        </p>

        {/* Tabs */}
        <div className="tabs">
          <button
            className={isLogin ? 'tab active' : 'tab'}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button
            className={isLogin ? 'tab' : 'tab active'}
            onClick={() => setIsLogin(false)}
          >
            Register
          </button>
        </div>

        {/* Form */}
        {isLogin ? (
          <div className="form">
            <input
              type="email"
              placeholder="Enter your email"
              className="input"
            />
            <input
              type="password"
              placeholder="Enter your password"
              className="input"
            />
            <button className="btn">
              Login to CipherTalk 🔐
            </button>
            <p className="switch">
              New here?{' '}
              <span onClick={() => setIsLogin(false)}>
                Create account
              </span>
            </p>
          </div>
        ) : (
          <div className="form">
            <input
              type="text"
              placeholder="Your full name"
              className="input"
            />
            <input
              type="email"
              placeholder="Your email"
              className="input"
            />
            <input
              type="password"
              placeholder="Create password"
              className="input"
            />
            <button className="btn">
              Join CipherTalk 🚀
            </button>
            <p className="switch">
              Already have account?{' '}
              <span onClick={() => setIsLogin(true)}>
                Login
              </span>
            </p>
          </div>
        )}

      </div>
    </div>
  );
}

export default App;
