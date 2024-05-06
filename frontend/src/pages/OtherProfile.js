import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Modal({ isOpen, onClose, title, children }) {
    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex',
            justifyContent: 'center', alignItems: 'center'
        }}>
            <div style={{
                background: 'white', padding: '20px', borderRadius: '5px',
                maxHeight: '70%', overflow: 'auto', width: '300px'
            }}>
                <h2>{title}</h2>
                <button onClick={onClose}>Close</button>
                <div>{children}</div>
            </div>
        </div>
    );
}

function UserProfile({ token }) {
    const [username, setUsername] = useState('');
    const [isFollowing, setIsFollowing] = useState(false);
    const [followers, setFollowers] = useState([]);
    const [following, setFollowing] = useState([]);
    const [showFollowersModal, setShowFollowersModal] = useState(false);
    const [showFollowingModal, setShowFollowingModal] = useState(false);
    const { userId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            const headers = { Authorization: `Bearer ${token}` };
            try {
                const response = await axios.get(`http://localhost:5000/profile/${userId}`, { headers });
                if (response.data.redirectTo) {
                    navigate(response.data.redirectTo, { replace: true });
                } else {
                    setUsername(response.data.username);
                    setFollowers(response.data.followers);
                    setFollowing(response.data.following);
                }

                const followStatus = await axios.get(`http://localhost:5000/following/${userId}`, { headers });
                setIsFollowing(followStatus.data.isFollowing);
            } catch (error) {
                console.error('Failed to fetch profile data:', error);
            }
        };

        fetchData();
    }, [userId, token, navigate]);

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
        <div>
            <h1>{username}</h1>
            <button onClick={toggleFollow}>{isFollowing ? 'Unfollow' : 'Follow'}</button>
            <button onClick={() => setShowFollowingModal(true)}>View Following</button>
            <button onClick={() => setShowFollowersModal(true)}>View Followers</button>
            <Modal
                isOpen={showFollowingModal}
                onClose={() => setShowFollowingModal(false)}
                title="Following"
            >
                <ul>
                    {following.map((user, index) => (
                        <li key={index}>{user.username}</li>
                    ))}
                </ul>
            </Modal>
            <Modal
                isOpen={showFollowersModal}
                onClose={() => setShowFollowersModal(false)}
                title="Followers"
            >
                <ul>
                    {followers.map((user, index) => (
                        <li key={index}>{user.username}</li>
                    ))}
                </ul>
            </Modal>
        </div>
    );
}

export default UserProfile;
