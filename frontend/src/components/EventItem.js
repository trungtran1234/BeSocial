import React from 'react';
import axios from 'axios';
import '../css/event_item.css';
import { Link, useNavigate } from 'react-router-dom';
import profileIcon from '../css/images/profileIcon.png';

  function EventItem({ event, onClickFunction, showDeleteButton, showFollowButton, showUnFollowButton, currentUserID }) {
    const navigate = useNavigate();

    const handleProfileClick = () => {
      if (event.host_user_id === currentUserID) {
          navigate('/profile');
      } else {
          navigate(`/profile/${event.host_user_id}`);
      }
  };

    return (
      <div className="event-item">
                <h4>
        <img src={profileIcon} alt="Profile" className="profileIcon" onClick={() => navigate(`/profile/${event.host_user_id}`)} />
        <span onClick={() => navigate(`/profile/${event.host_user_id}`)} style={{ cursor: 'pointer' }}>{event.host_username}</span>
    </h4>
        <h3>{event.title}</h3>
        <p>{event.description}</p>
        <p>
          <strong>Location: </strong> {event.location}
        </p>
        <p>
          <strong>Capacity:</strong> {event.capacity}
        </p>
        <p>
          <strong>Category:</strong> {event.category}
        </p>
        <p>
          <strong>Start Time:</strong> {new Date(event.start_time).toLocaleString()}
        </p>
        <p>
          <strong>End Time:</strong> {new Date(event.end_time).toLocaleString()}
        </p>
        {showDeleteButton && (
                <button onClick={() => onClickFunction()}>Delete</button>
            )}
        {showFollowButton && (
                <button onClick={() => onClickFunction()}>Attend</button>
            )}
        {showUnFollowButton && (
                <button onClick={() => onClickFunction()}>Unattend</button>
            )}  
          <button onClick={() => navigate(`/event/${event.id}`)}>View Event</button>
      </div>
    );
  }

export default EventItem;
