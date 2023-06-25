import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import morning from "../../assets/weather-icons-master/production/fill/darksky/partly-cloudy-day.svg";
import afternoon from "../../assets/weather-icons-master/production/fill/all/clear-day.svg";
import evening from "../../assets/weather-icons-master/production/fill/all/partly-cloudy-night.svg";
import useFetchUserName from "../../hooks/useFetchUserName/useFetchUserName";
import { Loader } from "../../components/loader";

import Topbar from "../../components/topbar/Topbar";
import Sidebar from "../../components/sidebar/Sidebar";
import classes from "./taskPage.module.css";

const TaskPage = () => {
  const [tasks, setTasks] = useState([]);
  const { listId } = useParams();
  const [weatherData, setWeatherData] = useState(null);
  const [location, setLocation] = useState("");
  const [temperature, setTemperature] = useState(0);
  const [humidity, setHumidity] = useState(0);
  const [windSpeed, setWindSpeed] = useState(0);
  const [loading, setLoading] = useState(true);
  const userName = useFetchUserName();
  const [title, setTitle] = useState("");
  const [editTaskId, setEditTaskId] = useState(null);
  const [editListId, setEditListId] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [heading, setHeading] = useState("Dashboard");

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      try {
        let response;
        if (listId) {
          response = await axios.get(`http://localhost:8080/lists/${listId}/tasks`);
          setHeading(response.data.listName);
          setTasks(response.data.tasks);
        } else {
          response = await axios.get("http://localhost:8080/lists/tasks");
          setHeading("Dashboard");
          setTasks(response.data);
          console.log(response.data[0]._listId);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    const fetchWeather = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=Lucknow&appid=db9fa6bfd5449eec1c9bfefe97e1b80f`
        );

        setWeatherData(response.data);
        if (response.data.name) {
          setLocation(response.data.name);
        }
        if (response.data.main) {
          setTemperature(Math.round(response.data.main.temp - 273.15));
          setHumidity(response.data.main.humidity);
        }
        if (response.data.wind) {
          setWindSpeed(response.data.wind.speed);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
    fetchWeather();
  }, [listId]);

  const updatedTask = (e) => {
    setTitle(e.target.value);
  };


  const handleEditTaskClick = (taskId,listtId) => {
    setEditTaskId(taskId);
    setEditListId(listtId);
    setShowEditModal(true);
  };
  const handleDeleteTask = async (taskId,listtId) => {
    try {
      await axios.delete(`http://localhost:8080/lists/${listtId}/tasks/${taskId}`);
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
    } catch (error) {
      console.log(error);
    }
  };
  
  const handleCloseEditModal = () => {
    setEditTaskId(null);
    setShowEditModal(false);
  };

  const handleEditTaskSubmit = async (title) => {
    try {
      await axios.patch(
        `http://localhost:8080/lists/${editListId}/tasks/${editTaskId}`,
        { title }
      );
  
      // Update the tasks state with the updated task
      setTasks((prevTasks) =>
        prevTasks.map((task) => {
          if (task._id === editTaskId) {
            return { ...task, title: title };
          }
          return task;
        })
      );
    } catch (error) {
      console.log(error);
    } finally {
      handleCloseEditModal();
    }
  };
  
  const date = new Date();
  const currentHour = date.getHours();

  let greeting;
  let image;

  if (currentHour < 12) {
    greeting = "Good Morning, ";
    image = <img src={morning} alt="" />;
  } else if (currentHour >= 12 && currentHour < 16) {
    greeting = "Good Afternoon, ";
    image = <img src={afternoon} alt="" />;
  } else if (currentHour >= 16) {
    greeting = "Good Evening, ";
    image = <img src={evening} alt="" />;
  }

  return (
    <>
      <Topbar />
      <Sidebar />
      <div className={`${classes.main} main`}>
        <div className={`${classes.container} container`}>
          <div className={`${classes.con} con`}>
            <div className={`${classes.heading} heading`}>{heading}</div>
            <div className={`${classes.greeting} greeting`}>
              <div className={classes.greeCon}>
                {image}
                <span>
                  {greeting}
                  <p className={classes.userName}>{userName}</p>
                </span>
              </div>
              {weatherData && (
                <div className={classes.card}>
                  <div className={`${classes.weather} ${classes.loading}`}>
                    <h2 className={classes.city}>Weather in {location}</h2>
                    <h1 className={classes.temp}>{temperature}°C</h1>
                    <div className={classes.flex}>
                      <img
                        src={`http://openweathermap.org/img/w/${weatherData.weather[0].icon}.png`}
                        alt="Weather Icon"
                      />
                      <div className={classes.description}>
                        {weatherData.weather[0].main}
                      </div>
                    </div>
                    <div className={classes.humidity}>Humidity: {humidity}%</div>
                    <div className={classes.wind}>Wind speed: {windSpeed} km/h</div>
                  </div>
                </div>
              )}
            </div>
            {loading ? (
              <div className={classes.loader}>
                <Loader />
              </div>
            ) : tasks.length === 0 ? (
              <div className={classes.noTasks}>No tasks available</div>
            ) : (
              tasks.map((task) => (
                <div
                  key={task._id}
                  className={`${classes.task} ${
                    task.completed ? classes.complete : ""
                  } task`}
                >
                  <div className={`${classes.check} check`}>
                    <div className={`${classes.wrapper} wrapper`}>
                      <input
                        type="checkbox"
                        id={`fireCheckbox_${task._id}`}
                        value="1"
                      />
                      <label htmlFor={`fireCheckbox_${task._id}`}></label>
                    </div>
                    <span className={`${classes.taskTitle} taskTitle`}>
                      {task.title}
                    </span>
                  </div>
                  <div className={`${classes.taskButtons} taskButtons`}>
                    <button
                      className={`${classes.taskButton} taskButton`}
                      onClick={() => handleEditTaskClick(task._id,task._listId)}
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button className={`${classes.taskButton} taskButton`}onClick={() => handleDeleteTask(task._id,task._listId)}>
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      {showEditModal && (
        <div className={classes.modal}>
          <h2>Edit the task</h2>
          <input type="text" onChange={updatedTask} />
          <button onClick={handleCloseEditModal}>Close</button>
          <button onClick={() => handleEditTaskSubmit(title)}>Save</button>
        </div>
      )}
    </>
  );
};

export default TaskPage;