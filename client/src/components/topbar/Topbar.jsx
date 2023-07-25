import React, { useEffect, useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faTachometerAlt, faFolderPlus, faPlus, faUser, faSearch } from "@fortawesome/free-solid-svg-icons";
import classes from "./topbar.module.css";
import axios from "axios";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { faFolder } from "@fortawesome/free-solid-svg-icons";
import Cookies from "js-cookie";
import protect from "../../hooks/useProtect/useProtect";

const Topbar = () => {
  const navigate = useNavigate();
  const userName = localStorage.getItem("name");
  const location = useLocation();
  const [showModal, setShowModal] = useState(false);
  const modalRef = useRef(null);
  const [flag, setFlag] = useState(0);
  const [listMenu, setListMenu] = useState([]);
  const [logoutModal, setLogoutModal] = useState(false);
  const [name, setName] = useState(null)
  

  useEffect(() => {
    const fetchLists = async () => {
      try {
        const accessToken = Cookies.get("access");
        const refreshToken = Cookies.get("refresh");
        const namee = Cookies.get("name");
        setName(namee);
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
    fetchLists();
  }, []);

  const handleCollectionClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setLogoutModal(false);
  };

  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  const handleOutsideClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      handleCloseModal();
    }
  };

  const handleLogoutModal = (e) => {
    setLogoutModal(true);
  };

  const handleLogout = (e) => {
    Cookies.remove("access");
    Cookies.remove("refresh");

    // Clear local storage
    localStorage.clear();

    // Navigate to login page
    navigate("/user/login");
  };

  const handleAddTaskClick = () => {
    if (location.pathname === "/taskmanager") {
      setFlag(1);
      setShowModal(true);
    } else if (location.pathname.startsWith("/lists/")) {
      const listId = location.pathname.split("/")[2];
      navigate(`/lists/${listId}/NewTask`);
    }
  };

  const listId = location.pathname.split("/")[2];

  

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (logoutModal && !modalRef.current.contains(e.target)) {
        handleCloseModal();
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [logoutModal]);

  return (
    <div className={classes.topbar}>
      <div className={classes.container}>
        <div className={classes.one}>
          <div className={classes.dash} onClick={() => navigate("/taskmanager")}>
            <FontAwesomeIcon icon={faHome} />
            <span>Dashboard</span>
          </div>
          <div className={classes.dash} id={classes.collection} onClick={handleCollectionClick}>
            <FontAwesomeIcon icon={faFolderPlus} />
            <span>Collections</span>
          </div>
        </div>
        <div className={classes.two}>
          <div className={classes.addtask} onClick={handleAddTaskClick}>
            <FontAwesomeIcon icon={faPlus} />
          </div>
          <div className={classes.search}>
            <FontAwesomeIcon icon={faSearch} />
          </div>
          <div className={classes.imgdiv}>
            <span>Hello, {name}</span>
            <FontAwesomeIcon className={classes.user} icon={faUser} onClick={handleLogoutModal} />
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className={classes.modal} onClick={handleCloseModal}>
          <div ref={modalRef} className={classes.modalContent} onClick={handleModalClick}>
            <div className={classes.modalCon}>
              <div className={classes.modalHeader}>
                <h2>Select a Collection</h2>
              </div>
              <div className={classes.collectionContainer}>
                {listMenu.map((list) => (
                  <Link
                    to={flag === 1 ? `/lists/${list._id}/newTask` : `/lists/${list._id}`}
                    className={`${classes.list_menu_item}`}
                    key={list._id}
                    onClick={handleCloseModal}
                  >
                    <div className={`${classes.card} card`}>
                      <span className={classes.icon} style={{ backgroundColor: list.color }}>
                        <FontAwesomeIcon icon={faFolder} />
                      </span>
                      <span className={classes.title}>{list.title}</span>
                    </div>
                  </Link>
                ))}
              </div>
              <Link className={classes.Link} to="/NewList">
                <button className={classes.btn}>New List</button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {logoutModal && (
        <div className={classes.logoutModal}>
          <div className={classes.member} ref={modalRef} onClick={handleLogout}>
            <FontAwesomeIcon className={classes.user} icon={faUser} />
            <span>LogOut</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Topbar;
