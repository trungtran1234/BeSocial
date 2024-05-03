import React, { useEffect, useState } from 'react';
import axios from 'axios';
import EventItem from '../components/EventItem';
import { Link, useNavigate } from 'react-router-dom';
import EventForm from '../components/EventForm';

function UserWall({ token: initialToken  }) {
    const [token, setToken] = useState(initialToken || localStorage.getItem('authToken'));
    const [events, setEvents] = useState([]);
    const [showEventForm, setShowEventForm] = useState(false);
    console.log(token);

    const fetchUserEvents = async () => {
        try {
            const response = await axios.get('/user_events', {
                headers: { Authorization: `Bearer ${token}` },
            });
            // Filter events based on host_user_id
            setEvents(response.data);
        } catch (error) {
            console.error('Error fetching user events:', error);
        }
    };

    useEffect(() => {
        fetchUserEvents();
    }, [token]);

    const handleCreateEvent = async (formData) => {
        await axios.post('/event_walls', formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setShowEventForm(false);
        fetchUserEvents();
    };
    
    const handleDeleteEvent = async (eventId) => {
        try {
            await axios.delete(`/events/${eventId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            // After deleting the event, fetch user events again to update the list
            fetchUserEvents();
        } catch (error) {
            console.error('Error deleting event:', error);
        }
    };

    return (
        <div className="eventWallContainer">
            <div> Your Events </div>
            <button onClick={() => setShowEventForm(true)}>Create New Event</button>
            {showEventForm && (
                <div className="popup">
                    <EventForm onSubmit={handleCreateEvent} onCancel={() => setShowEventForm(false)} />
                </div>
            )}
            <Link to="/event_wall">
                <button>View Local Events</button>
            </Link>
            <div className="eventsListed">
                {events.length === 0 ? (
                    <p>No events created yet.</p>
                ) : (
                    events.map((event) => (
                        <EventItem
                            key={event.id}
                            event={event}
                            onDelete={() => handleDeleteEvent(event.id)}
                            showDeleteButton={true}
                        />
                    ))
                )}
            </div>
        </div>
    );
}

export default UserWall;