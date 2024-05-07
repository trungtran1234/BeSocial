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
      const eventsFollowing = await axios.get('/get_event_following', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const followingIds = new Set(eventsFollowing.data.map(event => event.id));
      setEvents(response.data.map(event => ({
        ...event,
        isBookmarked: Boolean(event.isBookmarked),
        isAttending: followingIds.has(event.id)
      })));
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

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

  const handleFollowEvent = async (eventId) => {
    try {
      const response = await axios.post(
        `/post_event_following/${eventId}`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(response.data)
      updateEventState(eventId, true);
    } catch (error) {
      console.error('Error following event:', error);
    }
  }


  const handleUnfollowEvent = async (eventId) => {
    try {
        const response = await axios.post(`/post_event_unfollowing/${eventId}`, null, {
            headers: { Authorization: `Bearer ${token}` }
        });
        updateEventState(eventId, false);
    } catch (error) {
        console.error('Error unfollowing event:', error);
    }
}    

  useEffect(() => {
    fetchBookmarkedEvents();

  }, [token]);

  const updateEventState = (eventId, isAttending) => {
    setEvents(prevEvents => prevEvents.map(event => event.id === eventId ? { ...event, isAttending } : event));
  };

  return (
    <div className="eventWallContainer">
      <Taskbar />
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
              showFollowButton={!event.isAttending}
              showUnFollowButton={event.isAttending}
              onFollow={() => handleFollowEvent(event.id)}
              onUnfollow={() => handleUnfollowEvent(event.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default BookmarkedEvents;
