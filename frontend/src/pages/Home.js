import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import EventItem from '../components/EventItem';
import EventForm from '../components/EventForm';
import '../css/homepage.css';
import Taskbar from '../components/Taskbar';

function Homepage({ token: initialToken }) {
  const [token, setToken] = useState(initialToken || localStorage.getItem('authToken'));
  const [showSearchForm, setShowSearchForm] = useState(false);
  const navigate = useNavigate();
  console.log(token);

  const handleNavigation = (path) => {
    navigate(path);
};
  
  return (
    <div className="homeContainer">
      <Taskbar/>
      <div className = "searchContainer">
        <h1>Discover Your Social Sphere</h1>
        <div className = "searchBox">
          <button className = "searchButton" onClick={() => handleNavigation('/discover')}>Browse Upcoming Events</button>
        </div>
      </div>
      <div className='upcomingEventsContainer'>
              
      </div>
    </div>
  );
}

export default Homepage;