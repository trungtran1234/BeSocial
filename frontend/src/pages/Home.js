import React, { useEffect, useState } from 'react';
import axios from 'axios';
import EventItem from '../components/EventItem';
import EventForm from '../components/EventForm';
import '../css/homepage.css';

function Homepage({ token: initialToken }) {
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
    await axios.post('/events', formData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setShowEventForm(false);
    fetchEvents();
  };

  const handleLogout = () => {
    // Clear the authentication token from local storage
    localStorage.removeItem('authToken');
    // Redirect to the login page
    window.location.href = '/login';
  };
  const handleDeleteEvent = async (eventId) => {
    // Filter out the deleted event from the events array
    setEvents(events.filter(event => event.id !== eventId));
  };
  return (
    <div className="event-wall">
      <h1>BeSocial</h1>
      <button onClick={() => setShowEventForm(true)}>Create New Event</button>
      <button onClick={handleLogout}>Logout</button> {/* Add the logout button */}
      {showEventForm && (
        <div className="popup">
          <EventForm onSubmit={handleCreateEvent} onCancel={() => setShowEventForm(false)} />
        </div>
      )}

      {events.length === 0 ? (
        <p>No events posted yet.</p>
      ) : (
        events.map((event) => <EventItem key={event.id} event={event} onDelete={handleDeleteEvent}/>)
      )}
    </div>
  );
}

export default Homepage;
