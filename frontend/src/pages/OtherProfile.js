import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/profile.css';
import { useParams } from 'react-router-dom';
import Taskbar from '../components/Taskbar';
import FollowModal from '../components/FollowModal';  // Ensure this is correctly imported

function UserProfile({ token: initialToken }) {
    const [userData, setUserData] = useState({
        username: '',
        following: [],
        followers: []
    });
    const [token, setToken] = useState(initialToken || localStorage.getItem('authToken'));
    const { userId } = useParams();
    const [showFollowingModal, setShowFollowingModal] = useState(false);
    const [showFollowersModal, setShowFollowersModal] = useState(false);

    useEffect(() => {
        axios.get(`http://localhost:5000/profile/${userId}`, {  // Ensure the URL correctly includes the userId
            headers: { Authorization: `Bearer ${token}` },
        }).then(response => {
            setUserData(response.data);
        }).catch(error => {
            console.error('Error fetching profile:', error);
        });
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
                    {userData.following.map((user, index) => (  // Assuming userData.following contains objects with a username property
                        <li key={index}>{user.username}</li>
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
                    {userData.followers.map((user, index) => (  // Assuming userData.followers contains objects with a username property
                        <li key={index}>{user.username}</li>
                    ))}
                </ul>
            </FollowModal>
        </div>
    );
}

export default UserProfile;
