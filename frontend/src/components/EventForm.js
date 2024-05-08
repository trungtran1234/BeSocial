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
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };
  function getCurrentDateTime() {
    const now = new Date();
    const year = now.getFullYear();
    const month = `${now.getMonth() + 1}`.padStart(2, '0'); // Adding 1 because months start from 0
    const day = `${now.getDate()}`.padStart(2, '0');
    const hours = `${now.getHours()}`.padStart(2, '0');
    const minutes = `${now.getMinutes()}`.padStart(2, '0');
    const seconds = `${now.getSeconds()}`.padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
const today = getCurrentDateTime();
  console.log(today);
  console.log(formData.startTime);
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
        max = "2999-12-31T23:59"
        min = {today}
        required
      />
      <input
        type="datetime-local"
        name="endTime"
        value={formData.endTime}
        onChange={handleChange}
        min = {formData.startTime}
        max = "2999-12-31T23:59"
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

export default EventForm;
