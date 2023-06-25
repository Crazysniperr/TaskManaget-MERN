import React, { useState } from 'react';
import styles from './newTask.module.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useParams } from "react-router-dom";

const NewTask = () => {
    const { listId } = useParams();
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const handleInputChange = (event) => {
    setTitle(event.target.value);
    setMessage(''); // Clear the message when the input changes
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      if (title.trim() === '') {
        setMessage('Please enter the title.');
        return;
      }

      const task = { title };
      setLoading(true);

      await axios.post(`http://localhost:8080/lists/${listId}/tasks`, task);
      setMessage('Task created successfully!');
      setTitle('');
      navigate(`/lists/${listId}`);
    } catch (error) {
      console.error('Error adding task:', error);
      setMessage('Failed to create the task. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.centeredContent}>
      <div className={styles.modalBox}>
        <h1 className={styles.title}>Create a new task</h1>
        <form onSubmit={handleCreateTask}>
          <input
            className={`${styles.input}`}
            type="text"
            placeholder="Enter task.."
            value={title}
            onChange={handleInputChange}
          />
          {message && <p>{message}</p>}
          <br /><br />
          <div className={styles.buttons}>
            <button className={`${styles.button}`} type="button" onClick={()=> navigate(`/lists/${listId}`)}>Cancel</button>
            <button className={`${styles.button}`} type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewTask;
