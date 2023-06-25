import React from 'react'
import classes from './mainComponent.module.css'
import Tasks from '../tasks/Tasks'
import { useParams } from 'react-router-dom';
import morning from '../../assets/weather-icons-master/production/fill/darksky/partly-cloudy-day.svg'
import afternoon from '../../assets/weather-icons-master/production/fill/all/clear-day.svg'
import evening from '../../assets/weather-icons-master/production/fill/all/partly-cloudy-night.svg'

const MainComponent = () => {


  const { listId } = useParams();
  console.log(listId);


  const date = new Date();
  const currentHour = date.getHours();


  let greeting;
  let image;

  if (currentHour < 12) {
    greeting = "Good Morning, ";
    image = <img src={morning} alt="" />;
  }
  else if (currentHour >= 12 && currentHour<16) {
    greeting = "Good Afternoon, ";
    image = <img src={afternoon} alt="" />;
  }
  else if(currentHour >= 16) {
    greeting = "Good Evening, ";
    image = <img src={evening} alt="" />;
  }




  return (
    <div className={classes.container}>
      <div className={classes.con}>
          <div className={classes.heading}>
            Dashboard
          </div>
          <div className={classes.greeting}>
            <span>{greeting} <p>User</p></span>
            {image}
          </div>
          <Tasks listId={listId} />
      </div>
    </div>
  )
}

export default MainComponent