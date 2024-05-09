  import React, { useState, useEffect } from 'react';
  import axios from 'axios';
  import '../css/event_item.css';
  import { Link, useNavigate } from 'react-router-dom';
  import profileIcon from '../css/images/profileIcon.png';
  import { FaBookmark } from "react-icons/fa";
  import { FaRegBookmark } from "react-icons/fa";

    function EventItem({ event, showGuestButton, onFollow, onDelete, onUnfollow, showDeleteButton, showFollowButton, showUnFollowButton, showBookmarkButton, showUnbookmarkButton, onBookmark, onUnbookmark, currentUserID }) {
      const navigate = useNavigate();
      const [hostUsername, setHostUsername] = useState('');

      const handleProfileClick = () => {
        if (event.host_user_id === currentUserID) {
            navigate('/profile');
        } else {
            navigate(`/profile/${event.host_user_id}`);
        }
    };

    useEffect(() => {
      const fetchUsername = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/users/${event.host_user_id}`);
          setHostUsername(response.data.username);
        } catch (error) {
          console.error('Failed to fetch host username:', error);
          setHostUsername('Unknown User');
        }
      };
  
      fetchUsername();
    }, [event.host_user_id]);

      return (
        <div className = "event-item-container">
          <div className="event-item-top">       
            <img src={profileIcon} alt="Profile" className="profileIcon3" onClick={() => navigate(`/profile/${event.host_user_id}`)} />
            <span onClick={() => navigate(`/profile/${event.host_user_id}`)} style={{ cursor: 'pointer' }}>{hostUsername}</span>
          </div>
          <div className = "event-item-bottom">
            <h3>{event.title}</h3>
              <p>{event.description}</p>
              <p>
                <strong>Location: </strong> {event.location}
              </p>
              <p>
                <strong>Capacity:</strong> {event.capacity}
              </p>
              <p>
              <p><strong>Category:</strong> {event.category_name || 'No Category'}</p>
              </p>
              <p>
                <strong>Start Time:</strong> {new Date(event.start_time).toLocaleString()}
              </p>
              <p>
                <strong>End Time:</strong> {new Date(event.end_time).toLocaleString()}
              </p>
              {showDeleteButton && (
                      <button className="deleteButton" onClick={() => onDelete()}>Delete</button>
                  )}
              {showFollowButton && (
                      <button className="attendButton" onClick={() => onFollow()}>Attend</button>
                  )}
              {showUnFollowButton && (
                      <button className="unattendButton" onClick={() => onUnfollow()}>Unattend</button>
                  )} 
                <button className="viewEventButton" onClick={() => navigate(`/event/${event.id}`)}>View Event</button>
                { showBookmarkButton && (
                  <button className="bookmark" onClick={() => onBookmark()}><FaRegBookmark/></button>
              )}
              { showUnbookmarkButton && (
                  <button className="bookmark" onClick={() => onUnbookmark()}><FaBookmark/> </button>
              )}
                {showGuestButton && (
                      <button onClick={() => navigate(`/guest_list/${event.id}`)}>Guest List</button>
                  )} 
          </div>
        </div>
      );
    }

  export default EventItem;
