import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RegistrationForm from './pages/Register';
import LoginForm from './pages/Login';
import Home from './pages/Home';
import EventWall from './pages/EventWall'
import ProtectedRoute from './components/ProtectedRoute';
import Profile from './pages/UserProfile';

function App() {
  const [token, setToken] = useState(localStorage.getItem('authToken'));
  useEffect(() => {
    setToken(localStorage.getItem('authToken'));
  }, []);  
  
 return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<RegistrationForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/" element={<ProtectedRoute><Home token={token}/></ProtectedRoute>} />
        <Route path="/event_wall" element={<ProtectedRoute><EventWall token={token}/></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile token={token}/></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
