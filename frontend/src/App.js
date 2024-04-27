import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RegistrationForm from './pages/Register';
import LoginForm from './pages/Login';
import Home from './pages/Home';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const [token, setToken] = useState(localStorage.getItem('authToken'));
  useEffect(() => {
    setToken(localStorage.getItem('authToken'));
  }, []);  
  
 return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ProtectedRoute><Home token={token}/></ProtectedRoute>} />
        <Route path="/register" element={<RegistrationForm />} />
        <Route path="/login" element={<LoginForm />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
