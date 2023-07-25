import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
import morning from "../../assets/weather-icons-master/production/fill/darksky/partly-cloudy-day.svg";
import afternoon from "../../assets/weather-icons-master/production/fill/all/clear-day.svg";
import evening from "../../assets/weather-icons-master/production/fill/all/partly-cloudy-night.svg";
import { Loader } from "../../components/loader";
import fireon from "../../assets/f2.svg";
import fireoff from "../../assets/f.svg";
import Topbar from "../../components/topbar/Topbar";
import Sidebar from "../../components/sidebar/Sidebar";
import classes from "./taskPage.module.css";
import protect from "../../hooks/useProtect/useProtect";
import Cookies from "js-cookie";

const TaskPage = () => {
  const navigate = useNavigate();
  const loc = useLocation();
  const [tasks, setTasks] = useState([]);
  const { listId } = useParams();
  const [weatherData, setWeatherData] = useState(null);
  const [location, setLocation] = useState("");
  const [temperature, setTemperature] = useState(0);
  const [humidity, setHumidity] = useState(0);
  const [windSpeed, setWindSpeed] = useState(0);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [editTaskId, setEditTaskId] = useState(null);
  const [editListId, setEditListId] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [heading, setHeading] = useState("Dashboard");
  const [showModal, setShowModal] = useState(false);
  const username = localStorage.getItem("name");
  const [name, setName] = useState(null);
  const [taskStates, setTaskStates] = useState({});
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      try {
        const accessToken = Cookies.get("access");
        const refreshToken = Cookies.get("refresh");
        const namee = Cookies.get("name");
        setName(namee);
        await protect(navigate, accessToken, refreshToken);
        let response;
        if (listId) {
          response = await axios.get(
            `http://localhost:8080/lists/${listId}/tasks`,
            {
              headers: {
                authorization: `Bearer ${accessToken}`,
              },
            }
          );
          setHeading(response.data.listName);
          console.log(response.data.list);
          setTasks(response.data.tasks);
        } else {
          response = await axios.get("http://localhost:8080/lists/tasks", {
            headers: {
              authorization: `Bearer ${accessToken}`,
            },
          });
          setHeading("Dashboard");
          setTasks(response.data);
          // console.log(response.data[0]._listId);
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
          `https://api.openweathermap.org/data/2.5/weather?q=Delhi&appid=db9fa6bfd5449eec1c9bfefe97e1b80f`
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

  const handleEditTaskClick = (taskId, listtId) => {
    setEditTaskId(taskId);
    setEditListId(listtId);
    setShowEditModal(true);
  };
  const handleDeleteTask = async (taskId, listtId) => {
    try {
      const accessToken = Cookies.get("access");
      const refreshToken = Cookies.get("refresh");
      await protect(navigate, accessToken, refreshToken);
      await axios.delete(
        `http://localhost:8080/lists/${listtId}/tasks/${taskId}`,
        {
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const initialState = tasks.reduce((acc, task) => {
      acc[task._id] = task.isChecked;
      return acc;
    }, {});
    setTaskStates(initialState);
  }, [tasks]);

  const handleCloseEditModal = () => {
    setEditTaskId(null);
    setShowEditModal(false);
  };



  const handleEditTaskSubmit = async (title) => {
    try {
      const accessToken = Cookies.get("access");
      const refreshToken = Cookies.get("refresh");
      await protect(navigate, accessToken, refreshToken);
      await axios.patch(
        `http://localhost:8080/lists/${editListId}/tasks/${editTaskId}`,
        { title },
        {
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        }
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

  const handleCheckboxChange = async (taskId, listtId) => {
    try {
      setTaskStates((prevTaskStates) => ({
        ...prevTaskStates,
        [taskId]: !prevTaskStates[taskId],
      }));
      const accessToken = Cookies.get("access");
      const refreshToken = Cookies.get("refresh");
      await protect(navigate, accessToken, refreshToken);
      await axios.patch(
        `http://localhost:8080/lists/${listtId}/tasks/${taskId}/toggle`,
        null,
        {
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        }
      );
    } catch (error) {
      console.error(error);
    }
  };

  
  const handleCompleteChange = async (taskId, listtId) => {
    try {
      setTaskStates((prevTaskStates) => ({
        ...prevTaskStates,
        [taskId]: !prevTaskStates[taskId],
      }));
      const accessToken = Cookies.get("access");
      const refreshToken = Cookies.get("refresh");
      await protect(navigate, accessToken, refreshToken);
      await axios.patch(
        `http://localhost:8080/lists/${listtId}/tasks/${taskId}/complete`,
        null,
        {
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        }
      );
    } catch (error) {
      console.error(error);
    }
  };

  

  const handleAddTaskClick = () => {
    if (loc.pathname.startsWith("/lists/")) {
      const listId = loc.pathname.split("/")[2];
      navigate(`/lists/${listId}/NewTask`);
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
                  <p className={classes.userName}>{name}</p>
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
                    <div className={classes.humidity}>
                      Humidity: {humidity}%
                    </div>
                    <div className={classes.wind}>
                      Wind speed: {windSpeed} km/h
                    </div>
                  </div>
                </div>
              )}
            </div>
            {loading ? (
              <div className={classes.loader}>
                <Loader />
              </div>
            ) : tasks.length === 0 ? (
              <div className={classes.noTasks}>
                <div>No tasks here 😞</div>
                <div>Wanna Add a new task? 🤩</div>
                <button className={classes.btn} onClick={handleAddTaskClick}>
                  Add Task
                </button>
              </div>
            ) : (
              tasks.map((task) => (
                <div
                  key={task._id}
                  className={`${classes.task} ${
                    task.completed ? classes.complete : ""
                  } task`}
                  style={{ borderTop: `4px solid ${task._listId.color}` }}
                >
                  <div className={`${classes.check} check`}>
                    <div className={classes.wrapper}>
                      <div
                        className={classes.checkimg}
                        onClick={() => handleCheckboxChange(task._id, task._listId)}
                      >
                        {taskStates[task._id] ? (
                          <img src={fireon} alt="Fire On" />
                        ) : (
                          <img src={fireoff} alt="Fire Off" />
                        )}
                      </div>
                    </div>
                    <span className={`${classes.taskTitle} taskTitle`}>
                      {task.title}
                    </span>
                  </div>
                  <div className={`${classes.taskButtons} taskButtons`}>
                    <button
                      className={`${classes.taskButton} taskButton`}
                      onClick={() =>
                        handleEditTaskClick(task._id, task._listId)
                      }
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button
                      className={`${classes.taskButton} taskButton`}
                      onClick={() => handleDeleteTask(task._id, task._listId)}
                    >
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
