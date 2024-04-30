import React from 'react';
import axios from 'axios';
import '../css/event_item.css';

  function EventItem({ event, onDelete }) {
    const handleDelete = async () => {
      try {
        await axios.delete(`/events/${event.id}`);
        // Inform the parent component that the event has been deleted
        onDelete(event.id);
      } catch (error) {
        console.error('Error deleting event:', error);
        // Handle error
      }
    };
    return (
      <div className="event-item">
        <h3>{event.title}</h3>
        <p>{event.description}</p>
        <p>
          <strong>Location:</strong> {event.location}
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
        <button onClick={handleDelete}>Delete</button>
      </div>
    );
  }

export default EventItem;
