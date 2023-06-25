import React, { useState } from 'react';
import styles from './newList.module.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const NewList = () => {
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const handleInputChange = (event) => {
    setTitle(event.target.value);
    setMessage(''); // Clear the message when the input changes
  };

  const handleCreateList = async (e) => {
    e.preventDefault();
    try {
      if (title.trim() === '') {
        setMessage('Please enter the title.');
        return;
      }

      const list = { title };
      setLoading(true);

      await axios.post("http://localhost:8080/lists", list);
      setMessage('List created successfully!');
      setTitle('');
      navigate('/taskmanager');
    } catch (error) {
      console.error('Error adding list:', error);
      setMessage('Failed to create the list. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.centeredContent}>
      <div className={styles.modalBox}>
        <h1 className={styles.title}>Create a new list</h1>
        <form onSubmit={handleCreateList}>
          <input
            className={`${styles.input}`}
            type="text"
            placeholder="Enter list name..."
            value={title}
            onChange={handleInputChange}
          />
          {message && <p>{message}</p>}
          <br /><br />
          <div className={styles.buttons}>
            <button className={`${styles.button}`} type="button" onClick={()=> navigate('/taskmanager')}>Cancel</button>
            <button className={`${styles.button}`} type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewList;
