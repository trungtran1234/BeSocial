import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/profile.css';
import { useParams } from 'react-router-dom';
import Taskbar from '../components/Taskbar';
import FollowModal from '../components/FollowModal';

function UserProfile({ token: initialToken }) {
    const [userData, setUserData] = useState({ username: '', following: [], followers: [] });
    const [token, setToken] = useState(initialToken || localStorage.getItem('authToken'));
    const { userId } = useParams();
    const [showFollowingModal, setShowFollowingModal] = useState(false);
    const [showFollowersModal, setShowFollowersModal] = useState(false);

    useEffect(() => {
        axios.get(`http://localhost:5000/profile`, { headers: { Authorization: `Bearer ${token}` } })
            .then(response => setUserData(response.data))
            .catch(error => console.error('Error fetching profile:', error));
    }, [token, userId]);

    return (
        <div>
            <Taskbar />
            <h1>{userData.username}</h1>
            <button onClick={() => setShowFollowingModal(true)}>Following</button>
            <FollowModal
                isOpen={showFollowingModal}
                onClose={() => setShowFollowingModal(false)}
                title="Following"
            >
                <ul>
                    {userData.following.map((username, index) => (
                        <li key={index}>{username}</li>
                    ))}
                </ul>
            </FollowModal>
            <button onClick={() => setShowFollowersModal(true)}>Followers</button>
            <FollowModal
                isOpen={showFollowersModal}
                onClose={() => setShowFollowersModal(false)}
                title="Followers"
            >
                <ul>
                    {userData.followers.map((username, index) => (
                        <li key={index}>{username}</li>
                    ))}
                </ul>
            </FollowModal>
        </div>
    );
}

export default UserProfile;
