  import React from 'react';
  import axios from 'axios';
  import '../css/event_item.css';
  import { Link, useNavigate } from 'react-router-dom';
  import profileIcon from '../css/images/profileIcon.png';

    function EventItem({ event, showGuestButton, onFollow, onDelete, onUnfollow, showDeleteButton, showFollowButton, showUnFollowButton, showBookmarkButton, showUnbookmarkButton, onBookmark, onUnbookmark, currentUserID }) {
      const navigate = useNavigate();

      const handleProfileClick = () => {
        if (event.host_user_id === currentUserID) {
            navigate('/profile');
        } else {
            navigate(`/profile/${event.host_user_id}`);
        }
    };

      return (
        <div className = "event-item-container">
          <div className="event-item-top">       
            <img src={profileIcon} alt="Profile" className="profileIcon2" onClick={() => navigate(`/profile/${event.host_user_id}`)} />
            <span onClick={() => navigate(`/profile/${event.host_user_id}`)} style={{ cursor: 'pointer' }}>{event.host_username}</span>
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
                <strong>Category:</strong> {event.category}
              </p>
              <p>
                <strong>Start Time:</strong> {new Date(event.start_time).toLocaleString()}
              </p>
              <p>
                <strong>End Time:</strong> {new Date(event.end_time).toLocaleString()}
              </p>
              {showDeleteButton && (
                      <button onClick={() => onDelete()}>Delete</button>
                  )}
              {showFollowButton && (
                      <button onClick={() => onFollow()}>Attend</button>
                  )}
              {showUnFollowButton && (
                      <button onClick={() => onUnfollow()}>Unattend</button>
                  )} 
                <button onClick={() => navigate(`/event/${event.id}`)}>View Event</button>
                { showBookmarkButton && (
                  <button onClick={() => onBookmark()}>Bookmark</button>
              )}
              { showUnbookmarkButton && (
                  <button onClick={() => onUnbookmark()}>Unbookmark</button>
              )}
                {showGuestButton && (
                      <button onClick={() => navigate(`/guest_list/${event.id}`)}>Guest List</button>
                  )} 
          </div>
        </div>
      );
    }

  export default EventItem;
