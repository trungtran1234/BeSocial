import React, { useState } from 'react';
import axios from 'axios';
import '../css/taskbar.css';
import { useNavigate, useLocation } from 'react-router-dom';
import profileIcon from '../css/images/profileIcon.png';
import logo from '../css/images/logo.png';

function Taskbar({ token: initialToken }) {
    const [token, setToken] = useState(initialToken || localStorage.getItem('authToken'));
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        setToken(null);
        navigate('/login');
        window.location.reload();
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
                    <img src={logo} alt="logo" className="logo"/>
                </div>
                <div className="taskBarCenter">
                    <button onClick={() => handleNavigation('/')} className={`navButton ${isActive('/')}`}>Home</button>
                    <button onClick={() => handleNavigation('/discover')} className={`navButton ${isActive('/discover')}`}>Discover</button>
                    <button onClick={() => handleNavigation('/event_wall')} className={`navButton ${isActive('/event_wall')}`}>Event Wall</button>
                    <button onClick={() => handleNavigation('/user_wall')} className={`navButton ${isActive('/user_wall')}`}>Events Hosted</button>
                    <button onClick={() => handleNavigation('/event_following')} className={`navButton ${isActive('/event_following')}`}>Events Attended</button>
                    <button onClick={() => handleNavigation('/bookmarked_events')} className={`navButton ${isActive('/bookmarked_events')}`}>Bookmarked Events</button>
                </div>
                <div className="taskBarRight">
                    <img src={profileIcon} alt="Profile" className="profileIconTask" onClick={() => navigate('/profile')} />
                    <button className="logoutButton" onClick={handleLogout}>Logout</button>
                </div>
            </div>
        </div>
    );
};

export default Taskbar;
