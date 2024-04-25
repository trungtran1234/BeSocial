import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';


const RegistrationForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/register', {
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
    <div className="login-container">
      <div className="login-box">
        <h1>Sign Up</h1>
        {message && (
          <div className="error-message">{message}</div> 
        )}
        <form onSubmit={handleRegister}>
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
          <button type="submit" className="login-button">Sign up</button>

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