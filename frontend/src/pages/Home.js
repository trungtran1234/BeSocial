import React, { useEffect, useState } from 'react';
import axios from 'axios';
import EventItem from '../components/EventItem';
import EventForm from '../components/EventForm';
import '../css/homepage.css';
import Taskbar from '../components/Taskbar';

function Homepage({ token: initialToken }) {
  const [token, setToken] = useState(initialToken || localStorage.getItem('authToken'));
  const [showSearchForm, setShowSearchForm] = useState(false);
  console.log(token);

  const handleMakeSearch = async (formData) => {
    
};
  
  return (
    <div className="homeContainer">
      <Taskbar/>
      <div className = "searchContainer">
        <h1>Discover Your Social Sphere</h1>
        <div className = "searchBox">
          <button className = "searchButton" onClick={() => setShowSearchForm(true)}>Search for events</button>
            {showSearchForm && (
                <div className="popup_search">
                    <EventForm onSubmit={handleMakeSearch} onCancel={() => setShowSearchForm(false)} />
                </div>
            )}
        </div>
      </div>
      <div className='upcomingEventsContainer'>
              <h1>Upcoming Events</h1>
              <h3>- We put events here that a user checked in to and will start within 7 days</h3>
              <h3>- If too much of a pain, we could use this space for something else</h3>
      </div>
    </div>
  );
}

export default Homepage;