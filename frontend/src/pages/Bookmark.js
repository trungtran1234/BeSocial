import React, { useEffect, useState } from 'react';
import axios from 'axios';
import EventItem from '../components/EventItem';
import '../css/event_wall.css';
import { Link } from 'react-router-dom';

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
      const response = await axios.post(`/unbookmark/${eventId}`, null, {
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
      <div>Your Bookmarked Events</div>
      <Link to="/event_wall"><button>View Local Events</button></Link>
      <Link to="/user_wall"><button>View Your Events</button></Link>
      <div className="eventsListed">
        {events.length === 0 ? (
          <p>No bookmarked events.</p>
        ) : (
          events.map((event) => (
            <EventItem
              key={event.id}
              event={event}
              showUnbookmarkButton={true}
              onUnbookmark={handleUnbookmark}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default BookmarkedEvents;
