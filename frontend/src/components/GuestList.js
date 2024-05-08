import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../css/event_item.css';
import { Link, useParams } from 'react-router-dom'; // Removed unnecessary import of useNavigate
import profileIcon from '../css/images/profileIcon.png';
import Taskbar from '../components/Taskbar';
import GuestItem from '../components/GuestItem';

function GuestList({ token: initialToken }) {
  const { id } = useParams();
  const [token, setToken] = useState(initialToken || localStorage.getItem('authToken'));
  const [guests, setGuests] = useState([]);

  const fetchGuestList = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/get_event_follower/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("eventId " + id);
      setGuests(response.data);
    } catch (error) {
      console.error('Error fetching guest list:', error);
    }
  };

  useEffect(() => {
    fetchGuestList();
  }, [token, id]);

  return (
    <div className="guest-list">
      <Taskbar/>
      <h3>Guest List</h3>
      <table>
        <thead>
          <tr>
            <th>User ID</th>
            {/* Add more table headers as needed */}
          </tr>
        </thead>
        <tbody>
          {guests.length === 0 ? (
            <tr>
              <td>"no guest attended"</td>
            </tr>
          ) : (
            guests.map((guest) => (
              <tr key={guest.id}>
                <td>
                  <GuestItem guest={guest} username={guest.username}/>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default GuestList;
