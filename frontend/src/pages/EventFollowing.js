import React, { useEffect, useState } from 'react';
import axios from 'axios';
import EventItem from '../components/EventItem';
import '../css/event_wall.css';
import { Link } from 'react-router-dom';
import Taskbar from '../components/Taskbar';
function EventFollowing({ token: initialToken }) {
    const [token, setToken] = useState(initialToken || localStorage.getItem('authToken'));
    const [events, setEvents] = useState([])

    const fetchUserEvents = async () => {
        try {
            const response = await axios.get('/get_event_following', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setEvents(response.data.map(event => ({
                ...event,
                isBookmarked: Boolean(event.isBookmarked)
            })));
        } catch (error) {
            console.error('Error fetching events:', error);
        }
    };

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

    const handleBookmarkEvent = async (eventId) => {
        try {
            await axios.post(`/bookmark/${eventId}`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            updateEventStatus(eventId, true);
        } catch (error) {
            console.error('Error bookmarking event:', error);
        }
    };

    const handleUnbookmarkEvent = async (eventId) => {
        try {
            await axios.post(`/unbookmark/${eventId}`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            updateEventStatus(eventId, false);
        } catch (error) {
            console.error('Error unbookmarking event:', error);
        }
    };

    const updateEventStatus = (eventId, isBookmarked) => {
        setEvents(currentEvents => currentEvents.map(event =>
            event.id === eventId ? { ...event, isBookmarked: isBookmarked } : event
        ));
    };

    //sorting by date (asc), moving null dates to the back (null dates are those with unreasonable years).
    const sortedEvents = events.slice().sort((a, b) => {
    const dateA = a.start_time ? new Date(a.start_time) : null;
    const dateB = b.start_time ? new Date(b.start_time) : null;
  
    if (dateA === null && dateB === null) {
        return 0; 
        } else if (dateA === null) {
            return 1; 
        } else if (dateB === null) {
            return -1; 
        } else {

        return dateA - dateB;
        }
    });

    return (
        <div className="eventWallContainer">
            <Taskbar />
            <h1> Events You're Attending </h1>

            <div className="eventsListed">
                {events.length === 0 ? (
                    <p>No events attended yet.</p>
                ) : (
                    sortedEvents.map((event) => (
                        <EventItem
                            key={event.id}
                            event={event}
                            onUnfollow={() => handleUnfollowEvent(event.id)}
                            showUnFollowButton={true}
                            onBookmark={() => handleBookmarkEvent(event.id)}
                            onUnbookmark={() => handleUnbookmarkEvent(event.id)}
                            showBookmarkButton={!event.isBookmarked}
                            showUnbookmarkButton={event.isBookmarked}
                            showGuestButton={true}
                        />
                    ))
                )}
            </div>
        </div>
    );
}

export default EventFollowing