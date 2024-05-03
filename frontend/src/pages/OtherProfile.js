import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function UserProfile({ token }) {
    const [username, setUsername] = useState('');
    const [isFollowing, setIsFollowing] = useState(false);
    const { userId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            const headers = { Authorization: `Bearer ${token}` };
            try {
                // Fetch the user profile and check for redirection
                const response = await axios.get(`http://localhost:5000/profile/${userId}`, { headers });
                if (response.data.redirectTo) {
                    navigate(response.data.redirectTo);
                } else {
                    setUsername(response.data.username);
                }

                // Fetch the follow status
                const followStatus = await axios.get(`http://localhost:5000/following/${userId}`, { headers });
                setIsFollowing(followStatus.data.isFollowing);
                
                console.log(followStatus.data.isFollowing);
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
            <div>{username}</div>
            <button onClick={toggleFollow}>{isFollowing ? 'Unfollow' : 'Follow'}</button>
        </div>
    );
}

export default UserProfile;
