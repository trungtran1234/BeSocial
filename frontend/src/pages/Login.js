import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import '../css/login.css';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/login', {
        username,
        password,
      });

      if (response.status === 200) {
        const token = response.data.token;
        localStorage.setItem('authToken', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        navigate('/');
      }
    } catch (error) {
      if (error.response) {
        const statusCode = error.response.status;
        let errorMessage = 'Login failed';
        if (statusCode === 401) {
          errorMessage = 'Invalid username';
        }
        else if (statusCode === 402) {
          errorMessage = 'Incorrect password';
        }
        setMessage(errorMessage);
        setTimeout(() => { //remove error message after 4 seconds
          setMessage(''); 
        }, 4000);
      }
    }
  };
  return (
    <div className="login-container">
      <div className = "login-logo">
          What are you waiting for?
      </div>
      <div className="login-box">
        <h1>Login</h1>
        {message && (
          <div className="error-message">{message}</div>
        )}
        <form onSubmit={handleLogin}>
          <div className="login-form-group">
            <label className="input-label">Username</label>
            <input
              className="login-input-field"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder=" Enter username"
              required
            />
          </div>
          <div className="login-form-group">
            <label className="input-label">Password</label>
            <input
              className="login-input-field"
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
          <Link to="/register">Sign up</Link>
        </p>
      </div>
    </div>
  );
};


export default LoginForm;
