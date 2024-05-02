import React, { useEffect, useState } from 'react';
import axios from 'axios';
import EventItem from '../components/EventItem';
import EventForm from '../components/EventForm';
import '../css/homepage.css';
import Taskbar from '../components/Taskbar';

function Homepage({ token: initialToken }) {
  const [token, setToken] = useState(initialToken || localStorage.getItem('authToken'));
  console.log(token);
  
  return (
    <div className="homeContainer">
      <Taskbar/>
    </div>
  );
}

export default Homepage;