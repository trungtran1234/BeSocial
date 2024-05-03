import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/profile.css';

function UserProfile({ token: initialToken }) {
    const [username, setUsername] = useState('');
    const [token, setToken] = useState(initialToken || localStorage.getItem('authToken'));
    useEffect(() => {
        axios.get('http://localhost:5000/profile', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }).then((response) => {
            setUsername(response.data);
            console.log(response.data);
        })
    }, [token]);

    return (
        <div className="profile-container">
            <div className="profile-logo">
                {username}
            </div>
        </div>
    )
}

export default UserProfile