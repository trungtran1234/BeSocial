import React, { useEffect, useState } from 'react';
import axios from 'axios';
import EventItem from '../components/EventItem';
import '../css/event_wall.css';
import { Link } from 'react-router-dom';

function EventFollowing({ token: initialToken }){
    const [token, setToken] = useState(initialToken || localStorage.getItem('authToken'));
    const [events, setEvents] = useState([])

    const fetchUserEvents = async () => {
        try{
            const response = await axios.get('/get_event_following', {
                headers: { Authorization: `Bearer ${token}`},
            });
            setEvents(response.data);
        }catch(error){
            console.error('Error fetching user events:', error);
        }
    }

    const handleUnfollowEvent = async (eventId) => {
        try {
            const response = await axios.post(`/post_event_unfollowing/${eventId}`, null, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setEvents(events.filter(event => event.id !== eventId));
            fetchUserEvents();
        } catch (error) {
            console.error('Error unfollowing event:', error);
        }
    }
    
    

    useEffect(() => {
        fetchUserEvents();
    }, [token]);

    return (
        <div className="eventWallContainer">
            <div> Your Attending Events </div>
            <Link to="/event_wall">
                <button>View Local Events</button>
            </Link>
            <Link to="/user_wall">
                <button>View Your Events</button>
            </Link>
            <div className="eventsListed">
                {events.length === 0 ? (
                    <p>No events attended yet.</p>
                ) : (
                    events.map((event) => (
                        <EventItem
                            key={event.id}
                            event={event}
                            onClickFunction={() => handleUnfollowEvent(event.id)}
                            showUnFollowButton={true}
                        />
                    ))
                )}
            </div>
        </div>
    );
}

export default EventFollowing