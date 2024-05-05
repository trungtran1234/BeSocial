import React from 'react';
import axios from 'axios';
import '../css/event_item.css';
import { Link, useNavigate } from 'react-router-dom';
import profileIcon from '../css/images/profileIcon.png';

function GuestItem({ guest, currentUserID }) {
    const navigate = useNavigate();

    const handleProfileClick = () => {
      if (guest.id === currentUserID) {
          navigate('/profile');
      } else {
          navigate(`/profile/${guest.id}`);
      }
  };

    return (
      <div className="guest-item">
        <h4>
            <img src={profileIcon} alt="Profile" className="profileIcon" onClick={() => navigate(`/profile/${guest.id}`)} />
            <span onClick={() => navigate(`/profile/${guest.id}`)} style={{ cursor: 'pointer' }}>{guest.id}</span>
        </h4>
        <h3>{guest.username}</h3>
      </div>
    );
  }

export default GuestItem;
