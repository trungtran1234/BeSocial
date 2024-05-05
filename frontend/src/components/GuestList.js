import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../css/event_item.css';
import { Link, useNavigate } from 'react-router-dom';
import profileIcon from '../css/images/profileIcon.png';
import Taskbar from '../components/Taskbar';
import GuestItem from '../components/GuestItem';

function GuestList({ eventId, token: initialToken }) {
  const [token, setToken] = useState(initialToken || localStorage.getItem('authToken'));
  const [guests, setGuests] = useState([]);

  const fetchGuestList = async (eventId) => {
    try {
      const response = await axios.get(`/get_event_follower/${eventId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGuests(response.data);
    } catch (error) {
      console.error('Error fetching guest list:', error);
    }
  };

  useEffect(() => {
    fetchGuestList(eventId); // Pass eventId to fetchGuestList
  }, [token, eventId]);

  return (
    <div className="guest-list">
      <Taskbar/>
      <Link to="/event_wall">
        <button>View Local Events</button>
      </Link>
      <Link to="/event_following">
        <button>View Your Attending Events</button>
      </Link>
      <h3>Guest List</h3>
      <table>
        <thead>
          <tr>
            <th>User ID</th>
            <th>Username</th>
            {/* Add more table headers as needed */}
          </tr>
        </thead>
        <tbody>
          {guests.length === 0 ? <tr>
            <td>"no guest attended"</td>
          </tr>
            :  
              guests.map((guest) => <tr>
                  <td><GuestItem key={guest.id} guest={guest} username={guest.username}/></td>
                </tr>
            )
          }
        </tbody>
      </table>
    </div>
  );
}

export default GuestList;
