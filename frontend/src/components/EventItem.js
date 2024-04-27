import React from 'react';
import '../css/event_item.css';

function EventItem({ event }) {
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
    </div>
  );
}

export default EventItem;
