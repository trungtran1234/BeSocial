import React from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import RegistrationForm from './pages/Register';
import LoginForm from './pages/Login';
import Home from './pages/Home';

function App() {
  return (
    <BrowserRouter>
      <Routes>
      <Route path="/" element={<Home />} />
        <Route path="/register" element={<RegistrationForm />} />
        <Route path="/login" element={<LoginForm />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
