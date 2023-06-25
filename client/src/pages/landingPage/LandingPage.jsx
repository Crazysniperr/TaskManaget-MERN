import React from 'react'
import classes from "./landingPage.module.css"
import imgpng from "../../assets/pngimg.png"
import {Link} from "react-router-dom";

const LandingPage = () => {
  return (
    <div className={classes.main_container}>
      <div className={classes.container}>
        <div className={classes.text_part}>
          <h2 className={classes.title}>LISTY</h2>
          <p className={classes.subtitle}>
            An ultimate task manager and to-do list app that helps you stay
            organized and productive
          </p>
          <Link to="/user/login">
          <button className={classes.button}>Let's Get Started! 😎</button>
          </Link>
        </div>
        <div className={classes.image_part}>
          <img src={imgpng} alt="taskpng" className={classes.image} />
        </div>
      </div>
    </div>
  );
}

export default LandingPage