import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RegistrationForm from './pages/Register';
import LoginForm from './pages/Login';
import Home from './pages/Home';
import EventWall from './pages/EventWall'
import UserWall from './pages/UserWall';
import ProtectedRoute from './components/ProtectedRoute';
import Profile from './pages/UserProfile';
import OtherProfile from './pages/OtherProfile';
import EventFollowing from './pages/EventFollowing';
import GuestList from './components/GuestList';
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
        <Route path="/profile/" element={<ProtectedRoute><Profile token={token}/></ProtectedRoute>} />
        <Route path="/user_wall" element={<ProtectedRoute><UserWall token={token}/></ProtectedRoute>} />
        <Route path="/profile/:userId" element={<ProtectedRoute><OtherProfile token={token}/></ProtectedRoute>} />
        <Route path="/event_following" element={<ProtectedRoute><EventFollowing token={token}/></ProtectedRoute>} />
        <Route path="/guest_list" element={<ProtectedRoute><GuestList token={token}/></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
