import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import profileIcon from '../css/images/profileIcon.png';
import Taskbar from '../components/Taskbar';
import '../css/event_details.css';
import GuestItem from '../components/GuestItem';
import { BsFillHandThumbsUpFill,  BsHandThumbsUp  } from "react-icons/bs";

const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [guests, setGuests] = useState([]);
  const [hostUsername, setHostUsername] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/users/${event.host_user_id}`);
        setHostUsername(response.data.username);
      } catch (error) {
        console.error('Failed to fetch host username:', error);
      }
    };
    fetchUsername();

    const fetchEventDetails = async () => {
      try {
        const eventResponse = await axios.get(`http://localhost:5000/events/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          }
        });
        setEvent(eventResponse.data);

        const commentsResponse = await axios.get(`http://localhost:5000/events/${id}/comments`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          }
        });
        setComments(commentsResponse.data);

        const guestsResponse = await axios.get(`http://localhost:5000/get_event_follower/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
        });
        setGuests(guestsResponse.data);
        setIsLoading(false);
      } catch (err) {
        setError(err.response ? err.response.data : 'An error occurred');
        setIsLoading(false);
      }
    };

    fetchEventDetails();
  }, [id, event]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      const response = await axios.post(`http://localhost:5000/events/${id}/comments`, {
        content: newComment,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        }
      });
      const updatedComment = {
        ...response.data,
        like_count: 0
      };
      setComments([...comments, updatedComment]);
      setNewComment('');
    } catch (err) {
      console.error('Failed to post comment:', err);
    }
  };

  const handleToggleLike = async (commentId, isLiked) => {
    const method = isLiked ? 'delete' : 'post';
    const endpoint = `http://localhost:5000/comments/${commentId}/${isLiked ? 'unlike' : 'like'}`;

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
      <Taskbar />
      <div className="outerEventDetailsContainer">
        <div className="eventAndGuestsContainter">
        <div className="eventDetailsContainer">
          <h1>Event Details:</h1>
          <h2>{event.title}</h2>
          <p><strong>Hosted by:</strong> {hostUsername}</p>
          <p className = "description_box"><strong>Description:</strong> {event.description}</p>
          <p><strong>Location:</strong> {event.location}</p>
          <p><strong>Start Time:</strong> {new Date(event.start_time).toLocaleString()}</p>
          <p><strong>End Time:</strong> {new Date(event.end_time).toLocaleString()}</p>
          <p><strong>Capacity:</strong> {event.capacity}</p>
          <p><strong>Category:</strong> {event.category_name || 'No Category'}</p>
        </div>
        <div className="eventGuestListContainer">
          <h1>Guest List:</h1>
          {guests.length > 0 ? (
            guests.map((guest) => (
              <GuestItem key={guest.id} guest={guest} currentUserID={localStorage.getItem('userID')} />
            ))
          ) : (
            <div>No guests attended</div>
          )}
        </div>
        </div>
        <div className="eventCommentsContainer">
          <h1>Comments:</h1>
          <form onSubmit={handleCommentSubmit}>
            <input
              className='input'
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              required
            />
            <button className="button" type="submit">Post</button>
          </form>
          {comments.map(comment => (
            <div key={comment.id}>
              <div>
                <img src={profileIcon} alt="Profile" className="profileIcon" onClick={() => navigate(`/profile/${comment.user_id}`)} />
                <span className='username' onClick={() => navigate(`/profile/${comment.user_id}`)}>{comment.username}</span>
                <span> {new Date(comment.created_at).toLocaleString()}</span>
                <button className='likeButton' onClick={() => handleToggleLike(comment.id, comment.isLiked)}>
                  {comment.isLiked ? <BsFillHandThumbsUpFill/>  :  <BsHandThumbsUp/>}
                </button>
                <span>{comment.like_count}</span>
              </div>
              <div className="comment">{comment.content}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default EventDetails;
