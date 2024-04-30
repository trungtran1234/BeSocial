import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../css/Taskbar.css';
import { useNavigate, Link } from 'react-router-dom'

function Taskbar({ token: initialToken }) {
    const [token, setToken] = useState(initialToken || localStorage.getItem('authToken'));
    console.log(token);
    const navigate = useNavigate();

    const handleLogout = () => {
        // Clear the authentication token from local storage
        localStorage.removeItem('authToken');
        // Changed by Ryan (might be needed)
        setToken(null);
        // Redirect to the login page
        window.location.href = '/login';
      };

    return (
        <div className="taskbarContainer">
            <div className="innerTaskBar">
                <div className="taskBarLeft">
                    <div>[Insert Logo]</div>
                </div>
                <div className="taskBarCenter">
                    <div>[Insert Button]</div>
                    <div>[Insert Button]</div>
                    <div>[Insert Button]</div>
                    <div>[Insert Button]</div>
                    <div>[Insert Button]</div>
                </div>
                <div className="taskBarRight">
                    <button className="logoutButton" onClick={handleLogout}>Logout</button>
                </div>
            </div>
        </div>
    );
};

export default Taskbar