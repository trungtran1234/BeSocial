import React, { useEffect, useState } from 'react';
import axios from 'axios';
import EventItem from '../components/EventItem';
import '../css/event_wall.css';
import { Link } from 'react-router-dom';
import Taskbar from '../components/Taskbar';

function BookmarkedEvents({ token: initialToken }) {
  const [token, setToken] = useState(initialToken || localStorage.getItem('authToken'));
  const [events, setEvents] = useState([]);

  const fetchBookmarkedEvents = async () => {
    try {
      const response = await axios.get('/bookmarked_events', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching bookmarked events:', error);
    }
  }

  const handleUnbookmark = async (eventId) => {
    try {
       await axios.post(`/unbookmark/${eventId}`, null, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEvents(events.filter(event => event.id !== eventId));
      fetchBookmarkedEvents();
    } catch (error) {
      console.error('Error unbookmarking event:', error);
    }
  }

  useEffect(() => {
    fetchBookmarkedEvents();
  }, [token]);

  return (
    <div className="eventWallContainer">
        <Taskbar/>
        <h1> Your Bookmarked Events </h1>

        <div className="eventsListed">
            {events.length === 0 ? (
                <p>No bookmarked events yet.</p>
            ) : (
                events.map((event) => (
                    <EventItem
                        key={event.id}
                        event={event}
                        onUnbookmark={() => handleUnbookmark(event.id)}
                        showUnbookmarkButton={true}
                        showGuestButton={true}
                    />
                ))
            )}
        </div>
    </div>
);
}

export default BookmarkedEvents;
