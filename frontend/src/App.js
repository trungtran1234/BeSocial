import React from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import RegistrationForm from './pages/Register';
import LoginForm from './pages/Login';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element=<div>hi welcome to BeSocial</div> />
        <Route path="/register" element={<RegistrationForm />} />
        <Route path="/login" element={<LoginForm />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
