import React, { useEffect, useState } from 'react';
import classes from './tasks.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit, faFolder } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const Tasks = ({ listId }) => {
  const [tasks, setTasks] = useState([]);
  // const { listId } = useParams();

  // useEffect(() => {
  //   const fetchTasks = async () => {
  //     try {
  //       const response = await axios.get(`http://localhost:8080/lists/${listId}/tasks`);
  //       setTasks(response.data);
  //       console.log(response.data);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };

  //   fetchTasks();
  // }, [listId]);

  if (tasks.length === 0) {
    return <div>Loading tasks...</div>;
  }

  return (
    <div className={classes.container}>
      <div className={classes.collection}>
        <span className={classes.icon}><FontAwesomeIcon icon={faFolder} /></span>
        <span className={classes.title}>List title 1</span>
      </div>

      {/* Render the tasks */}
      {tasks.map((task) => (
        <div key={task._id} className={classes.task}>
          <div className={classes.check}>
            <input type="checkbox" />
            <span className={classes.taskTitle}>{task.title}</span>
          </div>
          <div className={classes.taskButtons}>
            <button className={classes.taskButton}>
              <FontAwesomeIcon icon={faEdit} />
            </button>
            <button className={classes.taskButton}>
              <FontAwesomeIcon icon={faTrash} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Tasks;
