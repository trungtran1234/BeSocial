import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import '../css/login.css';
const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [token, setToken] = useState(null);
  const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/login', {
        username,
        password,
      });

      if (response.status === 200) {
        navigate('/');
        setToken(response.data.token);
        setMessage('Login successful');
      }
    } catch (error) {
      setMessage('Error logging in');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Login</h1>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="input-label">Username</label>
            <input
              className="input-field"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder=" Enter username"
              required
            />
          </div>
          <div className="form-group">
            <label className="input-label">Password</label>
            <input
              className="input-field"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder=" Enter password"
              required
            />
          </div>
          <button type="submit" className="login-button">Login</button>
          
        </form>
        <p>
          Don't have an account?{' '}
          <Link to="/register">Sign up</Link> {/* Link to registration page */}
        </p>
      </div>
    </div>
  );
};


export default LoginForm;
