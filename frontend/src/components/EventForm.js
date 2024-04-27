import React, { useState } from 'react';
import '../css/event_form.css';

function EventForm({ onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    capacity: '',
    category: '',
    startTime: '',
    endTime: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  

  return (
    <form onSubmit={handleSubmit} className="event-form">
      <h2>Create New Event</h2>
      <input
        type="text"
        name="title"
        placeholder="Title"
        value={formData.title}
        onChange={handleChange}
        required
      />
      <textarea
        name="description"
        placeholder="Description"
        value={formData.description}
        onChange={handleChange}
        required
      ></textarea>
      <input
        type="text"
        name="location"
        placeholder="Location"
        value={formData.location}
        onChange={handleChange}
        required
      />
      <input
        type="number"
        name="capacity"
        placeholder="Capacity"
        value={formData.capacity}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="category"
        placeholder="Category"
        value={formData.category}
        onChange={handleChange}
        required
      />
      <input
        type="datetime-local"
        name="startTime"
        value={formData.startTime}
        onChange={handleChange}
        max = {formData.endTime}
        required
      />
      <input
        type="datetime-local"
        name="endTime"
        value={formData.endTime}
        onChange={handleChange}
        min = {formData.startTime}
        required
      />
      <div className="form-buttons">
        <button type="submit">Create</button>
        <button type="button" onClick={onCancel} className="close">
          Cancel
        </button>
      </div>
    </form>
  );
}
}
export default EventForm;
