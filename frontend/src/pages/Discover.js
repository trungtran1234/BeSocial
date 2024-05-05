import React, { useEffect, useState } from 'react';
import axios from 'axios';
import EventItem from '../components/EventItem';
import EventForm from '../components/EventForm';
import '../css/event_wall.css';
import Taskbar from '../components/Taskbar';
import { Link, useNavigate } from 'react-router-dom';


function Discover({ token: initialToken }) {
    const [token, setToken] = useState(initialToken || localStorage.getItem('authToken'));
    const [events, setEvents] = useState([]);
  
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
  
    const handleFollowEvent = async (eventId) => {
      try {
        const response = await axios.post(
          `/post_event_following/${eventId}`, null, {
              headers: { Authorization: `Bearer ${token}` },           
        });
        console.log(response.data)
        setEvents(events.filter(event => event.id !== eventId))
      }catch(error){
        console.error('Error following event:', error);
      }
    }
    return (
      <div className="eventWallContainer">
        <Taskbar/>
        <h3> Discover Events </h3>
        <h3> - Displays all active event postings </h3>
        <div className="eventsListed">
          {events.length === 0 ? (
            <p>No events nearby.</p>
          ) : (
            events.map((event) => <EventItem key={event.id} event={event} onClickFunction={() => handleFollowEvent(event.id)} showFollowButton={true}/>)
          )}
        </div>
      </div>
    );
  }
  
  export default Discover;