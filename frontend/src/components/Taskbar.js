import React, { useState } from 'react';
import axios from 'axios';
import '../css/Taskbar.css';
import { useNavigate, useLocation } from 'react-router-dom';
import profileIcon from '../css/images/profileIcon.png'; // Ensure the path is correct

function Taskbar({ token: initialToken }) {
    const [token, setToken] = useState(initialToken || localStorage.getItem('authToken'));
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        setToken(null);
        navigate('/login'); // Changed to use navigate for SPA behavior
    };

    const handleNavigation = (path) => {
        navigate(path);
    };

    const isActive = (path) => {
        return location.pathname === path ? 'active' : '';
    };

    return (
        <div className="taskbarContainer">
            <div className="innerTaskBar">
                <div className="taskBarLeft">
                    <button onClick={() => handleNavigation('/')} className={`navButton ${isActive('/')}`}>Home</button>
                </div>
                <div className="taskBarCenter">
                    <button onClick={() => handleNavigation('/event_wall')} className={`navButton ${isActive('/event_wall')}`}>Events</button>
                </div>
                <div className="taskBarRight">
                    <img src={profileIcon} alt="Profile" className="profileIcon" onClick={() => navigate('/profile')} />
                    <button className="logoutButton" onClick={handleLogout}>Logout</button>
                </div>
            </div>
        </div>
    );
};

export default Taskbar;