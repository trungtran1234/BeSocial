import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/profile.css';
import { useParams } from 'react-router-dom';
import Taskbar from '../components/Taskbar';
import FollowModal from '../components/FollowModal';
import { useNavigate } from 'react-router-dom';

function UserProfile({ token: initialToken }) {
    const [username, setUsername] = useState('');
    const [isFollowing, setIsFollowing] = useState(false);
    const [userData, setUserData] = useState({
        username: '',
        following: [],
        followers: []
    });
    const [token, setToken] = useState(initialToken || localStorage.getItem('authToken'));
    const { userId } = useParams();
    const [showFollowingModal, setShowFollowingModal] = useState(false);
    const [showFollowersModal, setShowFollowersModal] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            const headers = { Authorization: `Bearer ${token}` };
            try {
                const profileResponse = await axios.get(`http://localhost:5000/profile/${userId}`, { headers });
                if (profileResponse.data.redirectTo) {
                    navigate(profileResponse.data.redirectTo, { replace: true });
                } else {
                    setUserData(profileResponse.data);
                    setUsername(profileResponse.data.username);
                }
    
                const followStatusResponse = await axios.get(`http://localhost:5000/following/${userId}`, { headers });
                setIsFollowing(followStatusResponse.data.isFollowing);
                console.log(followStatusResponse.data.isFollowing);
            } catch (error) {
                console.error('Failed to fetch profile data:', error);
            }
        };
        fetchData();
    }, [userId, token, navigate, setUsername, setIsFollowing, isFollowing]);


    const toggleFollow = async () => {
        const headers = { Authorization: `Bearer ${token}` };
        const url = `http://localhost:5000/${isFollowing ? 'unfollow' : 'follow'}/${userId}`;
        try {
            await axios.post(url, {}, { headers });
            setIsFollowing(!isFollowing);
        } catch (error) {
            console.error('Failed to toggle follow status:', error);
        }
    };

    return (
        <div className = "profileContainer">
            <Taskbar />
            <h1>{username}</h1>
            <button onClick={toggleFollow}>{isFollowing ? 'Unfollow' : 'Follow'}</button>
            <button onClick={() => setShowFollowingModal(true)}>Following</button>
            <FollowModal
                isOpen={showFollowingModal}
                onClose={() => setShowFollowingModal(false)}
                title="Following"
            >
                <ul>
                    {userData.following.map((user, index) => ( 
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
                    {userData.followers.map((user, index) => (
                        <li key={index}>{user.username}</li>
                    ))}
                </ul>
            </FollowModal>
        </div>
    );
}

export default UserProfile;
