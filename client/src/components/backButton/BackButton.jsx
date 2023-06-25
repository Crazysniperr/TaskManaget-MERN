import React from 'react'
import { Link } from 'react-router-dom'
import classes from "./backbutton.module.css"

const BackButton = () => {
  return (
    <Link to="/" className={classes.link}>
        <button className={classes.button}>-</button>
    </Link>
  )
}

export default BackButton