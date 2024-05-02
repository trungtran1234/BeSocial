import React, { useEffect, useState } from 'react';
import axios from 'axios';
import EventItem from '../components/EventItem';
import EventForm from '../components/EventForm';
import '../css/event_wall.css';
import Taskbar from '../components/Taskbar';
import { Link, useNavigate } from 'react-router-dom';

function EventWall({ token: initialToken }) {
    const [token, setToken] = useState(initialToken || localStorage.getItem('authToken'));
    const [events, setEvents] = useState([]);
    const [showEventForm, setShowEventForm] = useState(false);
  
    console.log(token);
    const fetchEvents = async () => {
      try {
        const response = await axios.get('/events', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEvents(response.data);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };
  
    useEffect(() => {
      fetchEvents();
    
    }, [token]);
  
  
    const handleCreateEvent = async (formData) => {
      await axios.post('/events_wall', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setShowEventForm(false);
      fetchEvents();
    };
    return (
      <div className="eventWallContainer">
        <Taskbar/>
        <div> Event Wall </div>
        <button onClick={() => setShowEventForm(true)}>Create New Event</button>
        <Link to="/user_wall">
          <button>View Your Events</button>
        </Link>
        {showEventForm && (
          <div className="popup">
            <EventForm onSubmit={handleCreateEvent} onCancel={() => setShowEventForm(false)} />
          </div>
        )}
        <div className="eventsListed">
          {events.length === 0 ? (
            <p>No events posted yet.</p>
          ) : (
            events.map((event) => <EventItem key={event.id} event={event}/>)
          )}
        </div>
      </div>
    );
  }
  
  export default EventWall;