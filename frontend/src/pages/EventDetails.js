import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import profileIcon from '../css/images/profileIcon.png';
import Taskbar from '../components/Taskbar';
import '../css/event_details.css';

const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEventAndComments = async () => {
      try {
        const eventResponse = await axios.get(`http://localhost:3001/events/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          }
        });
        setEvent(eventResponse.data);

        const commentsResponse = await axios.get(`http://localhost:3001/events/${id}/comments`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          }
        });
        setComments(commentsResponse.data);
        setIsLoading(false);
      } catch (err) {
        setError(err.response ? err.response.data : 'An error occurred');
        setIsLoading(false);
      }
    };

    fetchEventAndComments();
  }, [id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      const response = await axios.post(`http://localhost:3001/events/${id}/comments`, {
        content: newComment,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        }
      });
      const updatedComment = {
        ...response.data,
        like_count: 0  // Assuming new comments start with 0 likes
      };
      setComments([...comments, updatedComment]);
      setNewComment('');
    } catch (err) {
      console.error('Failed to post comment:', err);
    }
  };

  const handleToggleLike = async (commentId, isLiked) => {
    const method = isLiked ? 'delete' : 'post';
    const endpoint = `http://localhost:3001/comments/${commentId}/${isLiked ? 'unlike' : 'like'}`;

    try {
      await axios({
        method: method,
        url: endpoint,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        }
      });

      const newComments = comments.map(comment => {
        if (comment.id === commentId) {
          return {
            ...comment,
            like_count: isLiked ? comment.like_count - 1 : comment.like_count + 1,
            isLiked: !isLiked
          };
        }
        return comment;
      });
      setComments(newComments);
    } catch (err) {
      console.error(`Failed to ${isLiked ? 'unlike' : 'like'} comment:`, err);
    }
  };


  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!event) return <div>No event found.</div>;

  return (
    <div className="eventContainer">
      <Taskbar/>
      <div className="outerEventDetailsContainer">
        <div className="eventDetailsContainer">
          <h1>Event Details:</h1>
          <h2>{event.title}</h2>
          <p>Description: {event.description}</p>
          <p>Location: {event.location}</p>
          <p>Start Time: {new Date(event.start_time).toLocaleString()}</p>
          <p>End Time: {new Date(event.end_time).toLocaleString()}</p>
          <p>Capacity: {event.capacity}</p>
          <p>Category: {event.category}</p>
        </div>
        <div className="eventGuestListContainer">
          <h1>Guest List:</h1>
        </div>
        <div className="eventCommentsContainer">
          <h1>Comments:</h1>
          <form onSubmit={handleCommentSubmit}>
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              required
            />
            <button type="submit">Post</button>
          </form>
          {comments.map(comment => (
  <div key={comment.id}>
    <div>
      <img src={profileIcon} alt="Profile" className="profileIcon" onClick={() => navigate(`/profile/${comment.user_id}`)}/>
      <span onClick={() => navigate(`/profile/${comment.user_id}`)}>{comment.username}</span>
      <span>{new Date(comment.created_at).toLocaleString()}</span>
      <button onClick={() => handleToggleLike(comment.id, comment.isLiked)}>
        {comment.isLiked ? 'Unlike' : 'Like'}
      </button>
      <span>Likes: {comment.like_count}</span>
    </div>
    <div>{comment.content}</div>
  </div>
))}
        </div>
      </div>
    </div>
  );
}

export default EventDetails;
