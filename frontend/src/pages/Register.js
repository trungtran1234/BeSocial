import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import '../css/register.css';


const RegistrationForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3001/register', {
        username,
        password,
      });

      if (response.status === 201) {
        const token = response.data.token;
        localStorage.setItem('authToken', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        navigate('/');
        setMessage('User registered successfully');
      }
    } catch (error) {
      if (error.response) {
        const statusCode = error.response.status;
        let errorMessage = 'Error registering user';
        if (statusCode === 500) {
          errorMessage = 'Username already exists';
        }
        setMessage(errorMessage);
        setTimeout(() => {
          setMessage('');
        }, 4000);
    }
  }
  };
  return (
    <div className="register-container">
      <div className = "register-logo">
          Register Now!
      </div>
      <div className="register-box">
        <h1>Sign Up</h1>
        {message && (
          <div className="register-error-message">{message}</div> 
        )}
        <form onSubmit={handleRegister}>
          <div className="register-form-group">
            <label className="register-input-label">Username</label>
            <input
              className="register-input-field"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder=" Enter username"
              required
            />
          </div>
          <div className="register-form-group">
            <label className="register-input-label">Password</label>
            <input
              className="register-input-field"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder=" Enter password"
              required
            />
          </div>
          <button type="submit" className="register-login-button">Sign up</button>

        </form>
        <p>
          Already have an account?{' '}
          <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default RegistrationForm;