import React, { useState } from 'react';
import { Mail, Lock, ArrowRight, Activity } from 'lucide-react';
import './loginpage.css';

const Login = ({ onLogin, onSwitchToSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const response = await fetch('http://localhost:3000/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        if (onLogin) {
          onLogin(); 
        }
      } else {
        setError(data.message || "Invalid email or password");
      }
    } catch (err) {
      console.error("Error logging in:", err);
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-visuals">
        <div className="visuals-content">
          <div className="brand-logo">
            <Activity size={32} color="#ffffff" />
            <span>WorkSync</span>
          </div>
          <h1>Streamline your workflow effortlessly.</h1>
          <p>Connect your team, manage your projects, and boost your productivity all in one place.</p>
          
          <div className="floating-elements">
            <div className="float-card card-1"><div className="skeleton-line short"></div><div className="skeleton-line long"></div></div>
            <div className="float-card card-2"><div className="skeleton-line"></div></div>
            <div className="float-card card-3"><div className="skeleton-line mid"></div></div>
          </div>
        </div>
      </div>
      
      <div className="login-form-container">
        <div className="login-form-content">
          <div className="form-header">
            <h2>Welcome Back</h2>
            <p>Please enter your details to sign in.</p>
          </div>
          
          {error && <div className="error-message">{error}</div>}

          <form className="modern-login-form" onSubmit={handleSubmit}>
            <div className="input-block">
              <label>Email Address</label>
              <div className="input-wrapper">
                <Mail className="input-icon" size={18} />
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
              </div>
            </div>

            <div className="input-block">
              <label>Password</label>
              <div className="input-wrapper">
                <Lock className="input-icon" size={18} />
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                />
              </div>
              <div className="forgot-password">
                <a href="#">Forgot password?</a>
              </div>
            </div>

            <button type="submit" className="primary-btn" disabled={isLoading}>
              {isLoading ? 'Signing In...' : 'Sign In'}
              {!isLoading && <ArrowRight size={18} />}
            </button>
          </form>

          <p className="signup-prompt">
            Don't have an account? <a href="#" onClick={(e) => { e.preventDefault(); onSwitchToSignup(); }}>Sign up for free</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;