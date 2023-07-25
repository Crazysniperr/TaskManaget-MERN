import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import classes from "./sidebar.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolder } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import protect from "../../hooks/useProtect/useProtect";
import Cookies from "js-cookie";
const Sidebar = () => {
  const [listMenu, setListMenu] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accessToken = Cookies.get("access");
        const refreshToken = Cookies.get("refresh");
        await protect(navigate, accessToken, refreshToken);
        const response = await axios.get("http://localhost:8080/lists", {
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        });
        setListMenu(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [navigate]);

  return (
    <div className={classes.container}>
      <span className={classes.heading}>Collections</span>
      <div className={classes.List}>
        {listMenu.map((list) => (
          <NavLink
            to={`/lists/${list._id}`}
            key={list._id}
            className={`${classes.list_menu_item} `}
          >
            <div className={classes.menu}>
              <span className={classes.icon} style={{ backgroundColor: list.color }}>
                <FontAwesomeIcon icon={faFolder} />
              </span>
              <span className={classes.title}>{list.title}</span>
            </div>
          </NavLink>
        ))}
      </div>
      <NavLink to="/NewList">
        <button className={classes.btn}>New List</button>
      </NavLink>
    </div>
  );
};

export default Sidebar;
